import React, { useState, useEffect } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from "react-loading-skeleton";
import {Link} from "react-router-dom";
import { Spinner } from "reactstrap";
import Items from "./Items";
import NavSection from "./NavSection";
import TNavbar from "./TNavbar";
import { getMartProducts,getMartCategories } from "../Server";
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
  const [SIDi, setSid] = useState(null); 
  const [errorMessage, setErrorMessage] = useState("");
  const [effectiveSkip,setEffectiveSkip]=useState([]);
  // Get Mart Products
  const get_Products = async (cid, sid,skipValue) => {
    console.log(cid, sid,skipValue);
    try {
     const updatedSkipValue = skipValue !== null && skipValue !== undefined ? skipValue : skip;
      console.log(updatedSkipValue);
      // const get_mart_product_url = `${api}/get_martProducts?mart_id=${mart_id}&cid=${cid}&${sid ? `&sid=${sid}` : ''}&limit=${limit}&skip=${updatedSkipValue}`;
      const products = await getMartProducts(mart_id,cid,sid,limit,updatedSkipValue);
      console.log('products are',products.data);
      const resultProducts =  products.data;
      if (resultProducts && resultProducts.length > 0) {
        if (sid) {
          setProducts(prevProducts => [...prevProducts, ...resultProducts]);
          console.log(resultProducts);
        } else {
          console.log(resultProducts);
          setProducts(prevProducts => [...prevProducts, ...resultProducts]);
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
  // Get Mart Categories
  const fetchData = async () => {
    try {
      const responseCategories = await  getMartCategories(mart_id,cid,limit,skip);
      const resultCategories =  responseCategories.data;
      console.log(responseCategories)
      setData(resultCategories[0]);
      // console.log(resultCategories[0]);
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
    setSid(id);
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
  const handleErrorMessage = (message) => {
    setErrorMessage(message);
  };
  return (
    <>
       <TNavbar />
      <NavSection />
       {/* <NavSection
        search_Query={search_Query}
        set_SearchQuery={set_SearchQuery}
      /> */}
      {DataProduct ? (
        <section className="container">
          <div className="pt">
          {errorMessage && (
            <>
              <div className='promo-container'>
                <div className='promo-popup'>
                  <div className='promo-close'>
                    <span className='promo-close-btn' onClick={() => setErrorMessage('')}>
                      &times;
                    </span>
                  </div>
                  <h3 className='promo-label'>Error</h3>
                  <h3 className='promo-label2'>Max quantity reached</h3>
                  <button onClick={() => setErrorMessage('')} className='continue'>Continue</button>
                </div>
              </div>
            </>
          )}
            <h2 className="main_heading">{DataProduct.name}</h2>
            <div className="pt">
              {DataProduct.sub_categories.map((subcategory) => (

                <button
                  className={`subcategory pl ${SIDi === subcategory.sid ? 'subcat' : ''}`}
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
                <p style={{ fontSize: "1.2em" }}></p>
              </div>
            }
            style={{ overflow: "hidden" }}
          >
            <div className="pt">
              <div className="exclusive_product">
                {Products.length > 0 ? Products.map((item, i) => (
                  // <Link to={`/product_detail?martId=${mart_id}&productId=${item.id}`} className="linkstyle" key={i}>
                    <Items
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      exclusivePrice={item.exclusivePrice}
                      price={item.price}
                      onErrorMessage={handleErrorMessage}
                      maxProductLimit={item.maxProductLimit}
                    />
                  // </Link>
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
 