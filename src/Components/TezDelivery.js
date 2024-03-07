import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazy-load';
import { ClipLoader } from 'react-spinners';
import {Button} from "reactstrap";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getMartCategories,getExclusiveProducts,getMostSellingProducts,getMarts } from "../../../my-app/src/Server";
import 'swiper/css/scrollbar';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Exclusive from "./Exclusive";
import Footer from "./Footer";
import NavSection from "./NavSection";
import TDSlider from "./TDSlider";
import TNavbar from "./TNavbar";
import api from "./apis";
import "./TD.css";
import 'swiper/swiper-bundle.css';
const TezDelivery = () => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const Martid = params.get('martId');
  sessionStorage.setItem('mart_id', Martid);
  const [DataProduct, setData] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [ExclusiveOffers, setExclusive] = useState([])
  const [mostSellingOffers, setSelling] = useState([])
  const [Ticker, setTicker] = useState([])
  useEffect(() => {

    const fetchData = async () => {
      // Getting mart categories
      try {
        const response = await getMartCategories(Martid);
        if (response.status === 200) {
          console.log("Categories=>", response.data);
          setData(response.data);
        } else {
          console.log('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
      // Getting Exclusive products
      try {
        const response = await getExclusiveProducts(Martid);       
        if (response.status === 200) {
          console.log("ExclusiveProducts=>", response.data);
          setExclusive(response.data);
        }
        else {
          console.log('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
      // Getting most Selling  products
      try {
        const response = await getMostSellingProducts(Martid);
        if (response.status === 200) {
          console.log("most Selling Products=>", response.data);
          setSelling(response.data);
        }
        else {
          console.log('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
     // Getting Mart Data
      try {
        const response = await getMarts(Martid);
        if (response.status === 200) {
          console.log("Mart Data=>", response.data);
          setTicker(response.data[0]);
        }
        else {
          console.log('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []);
  const breakpoints = {
    480: {
      spaceBetween: 20,
      slidesPerView: 1.5
    },
    768: {
      spaceBetween: 30,
      slidesPerView: 2.5
    },
    1024: {
      spaceBetween: 20,
      slidesPerView: 2.5
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  };
  return (
    <>
      <TNavbar />
      <NavSection />
      {/* ======== Ticker=========== */}
      <section className="container pt">
        <div className="anoucement">
          <Marquee speed={60} gradient={false} pauseOnHover={true}>
            <>
              <div className="anoucement-text text1">
                <span >{Ticker.ticker}</span>
                <span >{Ticker.ticker}</span>
                <span >{Ticker.ticker}</span>
                <span >{Ticker.ticker}</span>
                <span >{Ticker.ticker}</span>
                <span >{Ticker.ticker}</span>
              </div>
            </>
          </Marquee >
        </div>
      </section>
      <section className="container pb">
        <TDSlider className="d-flex " />
      </section>
      {/* ======== products section started=========== */}
      <section className="products_section container pt pb">
        <div className="pb heading-box">
          <h5 className="main_heading ">Shop by Category</h5>
          <Link to={`/categories?martId=${Martid}`}><Button className="see-all">See all</Button></Link>
        </div>
        <div className="products_grid">
          {DataProduct.map((item, index) => (
            <Link to={`/categories_page?martId=${Martid}&categoryId=${item.cid}`} className="linkstyle" key={index}>
              <div className={`products_grid_item ${item.index === 0 || item.index === 4 ? 'special_bg' : ''}`}>
                {/* <img src={item.image} alt="img" /> */}
                {imageLoading && <ClipLoader color={'#F17E2A'} loading={imageLoading} size={35} />}
                <LazyLoad>
                  <img
                    src={item.image}
                    alt='img'
                    onLoad={() => setImageLoading(false)}
                    style={{ display: imageLoading ? 'none' : 'block' }}
                  />
                </LazyLoad>
                <p>{item.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="container pt pb">
        <div className="pb heading-box">
          <h5 className="main_heading">Exclusive Offers</h5>
          <Link to="/Exclusive-offers"><Button className="see-all">See all</Button></Link>
        </div>
        {/* <div className="popular-exclusive"> */}
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          // spaceBetween={230}
          // slidesPerView={1.5}
          grabCursor={true}
          breakpoints={breakpoints}
          // centeredSlides={true}
          // loop={true}
          navigation={false}
          pagination={{ clickable: true, el: '' }}
          className='swiper-container'
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
        >
          {ExclusiveOffers && ExclusiveOffers.map((item, i) => (
            <SwiperSlide key={i} className="swiperslide" >
              {/* <Link to={`/product_detail?martId=1&productId=${item.id}`} className="linkstyle"> */}
              <Exclusive
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                exclusivePrice={item.exclusivePrice}
                price={item.price}
              />
              {/* </Link> */}
            </SwiperSlide>
          ))}
        </Swiper>
        {/* </div> */}
      </section>
      <section className="container pt pb">
        <div className="pb heading-box">
          <h5 className="main_heading ">Most Selling</h5>
          <Link to="/most-selling-offers"><Button className="see-all">See all</Button></Link>
        </div>
        {/* <div className="popular-exclusive"> */}
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          // spaceBetween={30}
          // slidesPerView={1.5}
          grabCursor={true}
          breakpoints={breakpoints}
          // centeredSlides={true}
          // loop={true}
          navigation={false}
          pagination={{ clickable: true, el: '' }}
          // className='swiper-container'
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log('slide change')}
        >
          {mostSellingOffers.map((item, i) => (
            <SwiperSlide key={i} className="swiperslide">
              {/* <Link to={`/product_detail?martId=1&productId=${item.id}`} className="linkstyle"> */}
              <Exclusive
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                exclusivePrice={item.exclusivePrice}
                price={item.price}
              />
              {/* </Link> */}
            </SwiperSlide>
          ))}
        </Swiper>
        {/* </div> */}
      </section>
      <Footer />
    </>
  );
};

export default TezDelivery;
