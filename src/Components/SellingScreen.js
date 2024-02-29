import React, { useState, useEffect } from 'react'
import TNavbar from './TNavbar'
import Footer from './Footer';
import { Link } from 'react-router-dom';
import api from "./apis";
import Items from './Items';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from "react-loading-skeleton";
const ProductLoader = () => {
  return (
    <>
      <div className="skeleton-row pt">
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            className="Exclusive_p"
            style={{ height: "16em", marginRight: "1em", width: '14em' }}
          />
        ))}
      </div>
      <div className="skeleton-row">
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            className="Exclusive_p"
            style={{ height: "16em", marginRight: "1em", width: '14em' }}
          />
        ))}
      </div>
      <div className="skeleton-row">
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            className="Exclusive_p"
            style={{ height: "16em", marginRight: "1em", width: '14em' }}
          />
        ))}
      </div>

    </>
  );
};
const SellingScreen = () => {
  const [mostSellingOffers, setSelling] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(15);
  const [skip, setSkip] = useState(0);
  const storedMart = sessionStorage.getItem('mart_id');
  const fetchData = async () => {
    try {
      const response = await fetch(`${api}/get_martProducts?mart_id=${storedMart}&most_selling=true&limit=${limit}&skip=${skip}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        setSelling([...mostSellingOffers, ...result.data]);
        setSkip(skip + limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {

    fetchData();
  }, []);
  const loadMore = () => {
    fetchData();
  };
  return (
    <>
      <TNavbar />
      <section className='container pt pb'>
        <div className="pt">
          <h5 className="main_heading">Most Selling Screen</h5>
        </div>
        <div className="pt">
          <InfiniteScroll
            dataLength={mostSellingOffers.length}
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
            <div className="exclusive_product">
              {mostSellingOffers.length > 0 ? (
                mostSellingOffers.map((item, i) => (
                  // <Link to={`/product_detail?martId=1&productId=${item.id}`} className="linkstyle" key={i}>
                    <Items
                      id={item.id}
                      name={item.name}
                      image={item.image}
                      exclusivePrice={item.exclusivePrice}
                      price={item.price}
                    />
                  // </Link>
                ))
              ) : (
                <></>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </section>
      <Footer />
    </>
  );
}
export default SellingScreen
