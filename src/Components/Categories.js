import React, { useState, useEffect } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from "react-loading-skeleton";
import {Link} from "react-router-dom";
import { Spinner } from "reactstrap";
import Items from "./Items";
import NavSection from "./NavSection";
import TNavbar from "./TNavbar";
import api from "./apis";
const Categories = () => {
  let sid=0;
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const cid = params.get("categoryId");
  const mart_id = params.get("martId");
  const [DataProduct, setData] = useState("");
  const [Products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(15);
  const [skip, setSkip] = useState(0);
  const [effectiveSkip,setEffectiveSkip]=useState([]);
  const get_Products = async (cid, sid,skipValue) => {
    console.log(cid, sid,skipValue);
    try {
     const updatedSkipValue = skipValue !== null && skipValue !== undefined ? skipValue : skip;
      console.log(updatedSkipValue);
      const get_mart_product_url = `${api}/get_martProducts?mart_id=${mart_id}&cid=${cid}&${sid ? `&sid=${sid}` : ''}&limit=${limit}&skip=${updatedSkipValue}`;
      const products = await fetch(get_mart_product_url);
      console.log(products);
      if (!products.ok) {
        throw new Error(`HTTP error! Status: ${products.status}`);
      }
      const resultProducts = await products.json();
      if (resultProducts.data && resultProducts.data.length > 0) {
        if (sid) {
          setProducts(prevProducts => [...prevProducts, ...resultProducts.data]);
          console.log(resultProducts.data);
        } else {
          console.log(resultProducts);
          setProducts(prevProducts => [...prevProducts, ...resultProducts.data]);
        }
        setEffectiveSkip(prevSkip => prevSkip + limit);
        setSkip(prevSkip => prevSkip + limit)
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchData = async () => {
    try {
      const responseCategories = await fetch(
        `${api}/get_martCategories?mart_id=${mart_id}&cid=${cid}&limit=${limit}&skip=${skip}`
      );
      if (!responseCategories.ok) {
        throw new Error(`HTTP error! Status: ${responseCategories.status}`);
      }
      const resultCategories = await responseCategories.json();
      setData(resultCategories.data[0]);
      console.log(resultCategories.data[0]);
      get_Products(cid);   
    } catch (error) 
    {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [cid, mart_id]);
  const FilterCat = (id) => {
    setSelectedSubcategory(id); 
    setProducts([]);
    setEffectiveSkip(0);
    setHasMore(true);
    get_Products(cid, id,0);
  };
  const loadMore = () => {
    if(selectedSubcategory){
      get_Products(cid,selectedSubcategory,effectiveSkip);
      console.log(selectedSubcategory);
    }else{
      get_Products(cid);
    }
  };
  // const fetchScrollData= async (cid,sid)=>{
  //   setPageNo(page+5);
  //   const get_Products = async (cid, sid) => {
  //     console.log(cid, sid);
  //     try {
  //       const get_mart_product_url = `${api}/get_martProducts?mart_id=1&cid=7976&sid=19886&limit=5&skip=${page}`;
  //       const products = await fetch(get_mart_product_url);
  //       if (!products.ok) {
  //         throw new Error(`HTTP error! Status: ${products.status}`);
  //       }
  //       const resultProducts = await products.json();
  //       console.log(resultProducts);
  //       setProducts(resultProducts.data ? resultProducts.data : []);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   get_Products(cid,sid);
  // }
  return (
    <>
       <TNavbar />
      <NavSection />
      {DataProduct ? (
        <section className="container">
          <div className="pt">
            <h5 className="main_heading">{DataProduct.name}</h5>
            <div className="pt">
              {DataProduct.sub_categories.map((subcategory) => (

                <button
                  className={`subcategory pl ${sid === subcategory.sid ? 'subcat' : ''}`}
                  onClick={() => {
                    FilterCat(subcategory.sid);
                  }}
                  key={subcategory.sid}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </div>
          <InfiniteScroll
            dataLength={Products.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<ProductLoader />}
            endMessage={
              <div style={{ textAlign: "center", margin: "20px 10px 0px", color: "#999" }}>
                <p style={{ fontSize: "1.2em" }}>No more products</p>
              </div>
            }
            style={{ overflow: "hidden" }}
          >
            <div className="pt">
              <div className="exclusive_product">
                {Products.length > 0 ? Products.map((item, i) => (
                  <Link to={`/product_detail?martId=${mart_id}&productId=${item.id}`} className="linkstyle" key={i}>
                    <Items
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      exclusivePrice={item.exclusivePrice}
                      price={item.price}
                    />
                  </Link>
                )) : <></>}
              </div>
            </div>
          </InfiniteScroll>
        </section>
      ) : null}
    </>
  );
};
const ProductLoader = () => {
  return (
    <>
      <div className="skeleton-row pt">
      {[...Array(5)].map((_, i) => (
        <Skeleton
          key={i}
          className="Exclusive_p"
          style={{ height: "16em", marginRight: "1em",width:'14em' }}
        />
      ))}
    </div>
    <div className="skeleton-row">
      {[...Array(5)].map((_, i) => (
        <Skeleton
          key={i}
          className="Exclusive_p"
          style={{ height: "16em", marginRight: "1em", width:'14em' }}
        />
      ))}
    </div>
    <div className="skeleton-row">
      {[...Array(5)].map((_, i) => (
        <Skeleton
          key={i}
          className="Exclusive_p"
          style={{ height: "16em", marginRight: "1em",width:'14em' }}
        />
      ))}
    </div>
    </>
  );
};
export default Categories;
 