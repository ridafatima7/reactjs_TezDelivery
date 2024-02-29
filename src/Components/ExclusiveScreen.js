import React, { useState, useEffect } from 'react'
import TNavbar from './TNavbar'
import Footer from './Footer';
import { Link } from 'react-router-dom';
import api from "./apis";
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from "react-loading-skeleton";
import Items from './Items';
const ExclusiveScreen = (props) => {
  const [ExclusiveOffers, setExclusive] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(15);
  const [skip, setSkip] = useState(0);
  const storedMart = sessionStorage.getItem('mart_id');

  // const fetchScrollData= async ()=>{
  //   setPageNo(page+10);
  //   const fetchData = async () => {
  //     try {
  //       const get_mart_product_url = `${api}/get_martProducts?mart_id=1&exclusive=true&limit=10&skip=${page}`;
  //       const products = await fetch(get_mart_product_url);
  //       if (!products.ok) {
  //         throw new Error(`HTTP error! Status: ${products.status}`);
  //       }
  //       const resultProducts = await products.json();
  //       console.log(resultProducts);
  //       setExclusive(resultProducts.data ? resultProducts.data : []);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchData();
  // }
  const fetchData = async () => {
    try {
      const response = await fetch(`${api}/get_martProducts?mart_id=${storedMart}&exclusive=true&limit=${limit}&skip=${skip}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        setExclusive([...ExclusiveOffers, ...result.data]);
        setSkip(skip + limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const loadMore = () => {
    fetchData();
  };
  // const fetchScrollData = () => {
  //   let nextPage = page + 10;
  //   setPageNo(nextPage);
  //   fetchData(nextPage);
  // };
  // useEffect(() => {
  //   fetchData(page);
  // }, [page]);
  return (
    <div>
      <TNavbar />
      <section className='container pt pb'>
        <div className="pt">
          <h5 className="main_heading">Exclusive Screen</h5>
        </div>        
        <InfiniteScroll
              dataLength={ExclusiveOffers.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<ProductLoader />}
              endMessage={
                <div style={{ textAlign: "center", margin: "20px 10px 0px", color: "#999" }}>
                <p style={{ fontSize: "1.2em" }}>No more products</p>
              </div>
              }
              style={{ overflow: "none" }}
            >
           <div className="pt">
            <div className="exclusive_product">
              {ExclusiveOffers.length > 0
                ? ExclusiveOffers.map((item, i) => (
                  // <Link to={`/product_detail?martId=1&productId=${item.id}`} className="linkstyle" >
                    <Items
                      key={i}
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      exclusivePrice={item.exclusivePrice}
                      price={item.price}
                    />
                  // </Link>
                ))
                :<></>}
            </div>
          </div>
          </InfiniteScroll>
      </section>
      <Footer />
    
   </div> 
  )
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
          style={{ height: "16em", marginRight: "1em",width:'14em' }}
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

export default ExclusiveScreen
