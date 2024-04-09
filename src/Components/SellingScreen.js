import React, { useState, useEffect } from 'react'
import TNavbar from './TNavbar'
import Footer from './Footer';
import { Link } from 'react-router-dom';
import api from "./apis";
import Items from './Items';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from "react-loading-skeleton";
import { getMostSellingProducts } from '../Server';
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
  const [errorMessage, setErrorMessage] = useState("");
  const [skip, setSkip] = useState(0);
  const storedMart = sessionStorage.getItem('mart_id');
  const handleErrorMessage = (message) => {
    setErrorMessage(message);
  };
  const fetchData = async () => {
    try {
      const response = await getMostSellingProducts(storedMart, limit, skip);
      if (response.status === 200) {
        console.log("most Selling Products=>", response.data);
        if (response.data && response.data.length > 0) {
          setSelling([...mostSellingOffers, ...response.data]);
          setSkip(skip + limit);
        } else {
          setHasMore(false);
        }
      }
      else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
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
        <div className="pt">
          <h2 className="main_heading">Most Selling Screen</h2>
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
                    maxProductLimit={item.maxProductLimit}
                    onErrorMessage={handleErrorMessage}
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
