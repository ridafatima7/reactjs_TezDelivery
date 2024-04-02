import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import Items from "./Items";
import NavSection from "./NavSection";
import TNavbar from "./TNavbar";
import api from "./apis";
import "react-loading-skeleton/dist/skeleton.css";
import { getMartProducts, getSearchProducts } from "../Server";
const SearchProducts = () => {
  const [search_Query, set_SearchQuery] = useState("");
  const [filteredProducts, setFilteredProduct] = useState([]);
  const [autoReplace,setAutoReplace]=useState("");
  const [hasMore, setHasMore] = useState(true);
  const search = window.location.search;
  const [limit, setLimit] = useState(12);
  const [skip, setSkip] = useState(0);
  const params = new URLSearchParams(search);
  const mart_id = params.get("martId");
  const [errorMessage, setErrorMessage] = useState("");
  const searched_products = async () => {
    try {
      let result;
      if (search_Query) {
        // url = `${api}/get_searched_Products?mart_id=${mart_id}&key=${search_Query}&limit=${limit}&skip=${skip}`;
        result=await getSearchProducts(mart_id,search_Query);
      } else {
        // url = `${api}/get_martProducts?mart_id=${mart_id}&limit=${limit}&skip=${skip}`;
        result=await getMartProducts(mart_id,0,0,limit,skip);
      }
      // const response = await fetch(url);
      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
      // const result = await response.json();
      console.log(result);
      console.log(result.data)
      if (result.data && result.data.length > 0) {
        if(search_Query){
          setFilteredProduct("");
          setFilteredProduct(result.data);
          console.log(result.data);
          setHasMore(false);
        }
        else{
          setFilteredProduct([...filteredProducts, ...result.data]);
          setAutoReplace([...filteredProducts, ...result.data]);
          setSkip(skip + limit); 
        }
        
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    searched_products();
  }, [search_Query]);
  const loadMore = () => {
    searched_products();
  };
  const handleErrorMessage = (message) => {
    setErrorMessage(message);
  };
  return (
    <>
      <TNavbar />
      <NavSection
        search_Query={search_Query}
        set_SearchQuery={set_SearchQuery}
      />
      <>
        <section className="container pt">
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
          <div className="pb heading-box">
            <h2 className="main_heading">Products</h2>
          </div>
          <InfiniteScroll
              dataLength={filteredProducts.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<ProductLoader />}
              endMessage={
                <div style={{ textAlign: "center", margin: "20px 10px 0px", color: "#999" }}>
                <p style={{ fontSize: "1.2em" }}>No more products</p>
              </div>  
              }
            >
          <div className="popular-exclusive pb">         
              {filteredProducts.map((item, i) => (
                <Items
                  key={i}
                  id={item.id}
                  name={item.name}
                  image={item.images}
                  price={item.price}
                  exclusivePrice={item.exclusivePrice}
                  onErrorMessage={handleErrorMessage}
                  maxProductLimit={item.maxProductLimit}
                />
              ))}
          </div>
          </InfiniteScroll>
        </section>
      </>
    </>
  );
};

const ProductLoader = () => {
  return (
    <>
      <div className="skeleton-row">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          className="Exclusive_p"
          style={{ height: "13em", marginRight: "1em",width:'17em' }}
        />
      ))}
    </div>
    <div className="skeleton-row">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          className="Exclusive_p"
          style={{ height: "13em", marginRight: "1em",width:'17em' }}
        />
      ))}
    </div>
    <div className="skeleton-row">
      {[...Array(4)].map((_, i) => (
        <Skeleton
          key={i}
          className="Exclusive_p"
          style={{ height: "13em", marginRight: "1em",width:'17em' }}
        />
      ))}
    </div>
    </>
  );
};

export default SearchProducts;
