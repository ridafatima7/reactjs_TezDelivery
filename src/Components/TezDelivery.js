import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazy-load';
import { ClipLoader } from 'react-spinners';
import { Button } from "reactstrap";
import { RxCross2 } from "react-icons/rx";
import 'swiper/css';
import { FcCheckmark } from "react-icons/fc";
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getMartCategories, getExclusiveProducts, getMostSellingProducts, getMarts } from "../../../my-app/src/Server";
import 'swiper/css/scrollbar';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Exclusive from "./Exclusive";
import Footer from "./Footer";
import TNavbar from './TNavbar'
import NavSection from "./NavSection";
import TDSlider from "./TDSlider";
import "./TD.css";
import 'swiper/swiper-bundle.css';
const TezDelivery = () => {
  const [DataProduct, setData] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [ExclusiveOffers, setExclusive] = useState([])
  const [mostSellingOffers, setSelling] = useState([])
  const [Ticker, setTicker] = useState([]);
  const search = window.location.search;
  const [promoState,setPromoState]=useState(true);
  const params = new URLSearchParams(search);
  const Martid = params.get('martId');
  const [PromoExists, setPromoExists] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  sessionStorage.setItem('mart_id', Martid);
  // if (location.state === true) {
  //   setAdditionalPopup(true);
  // }

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
          setPromoExists(response.data[0].promos);
          console.log(response.data[0].promos);
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
    300: {
      spaceBetween: 20,
      slidesPerView: 1.5
    },
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
  const handleErrorMessage = (message) => {
    setErrorMessage(message);
  };
  return (
    <>

      <TNavbar />
      <NavSection />
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
      {promoState && PromoExists.length > 0 && PromoExists.map((promo, index) => (
        <div className='promo-container' key={index}  style={{zIndex:'3000'}}>
          <div className='promo-popup' style={{ backgroundColor: '#f3f3f3',padding: '10px', maxWidth: '500px' }} >
            <div className='wallet-close'>
              <span className='wallet-close-btn' >
                <RxCross2 size={18}  onClick={()=>setPromoState(!promoState)}/>
              </span>
            </div>
            <img className='promoImg' src={promo.image} alt={`Promo ${index + 1}`} />
            <div className="content-p" >
              <h2>{promo.description}</h2>
              <div className="promo-details">
                <div>
                  <span>USE CODE-</span>
                  <span style={{ fontWeight: 'bold' }}>{promo.code}</span>
                </div>
                <div>
                  <span>Valid till</span>
                  <span style={{ fontWeight: 'bold' }}>{promo.validTill}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

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
          <h2 className="main_heading ">Shop by Category</h2>
          <Link to={`/categories?martId=${Martid}`}><Button className="see-all">See all</Button></Link>
        </div>
        <div className="products_grid">
          {DataProduct.map((item, index) => (
            <Link to={`/categories_page?martId=${Martid}&categoryId=${item.cid}`} className="linkstyle" key={index}>
              <div className={`products_grid_item ${item.index === 0 || item.index === 4 ? 'special_bg' : ''}`}>
                {/* <img src={item.image} alt="img" /> */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,width:'35px'}}>
                {imageLoading && <ClipLoader color={'#F17E2A'}  className="rounded-loader"  loading={imageLoading} size={35} />}
                </div>
                <LazyLoad>
                  <img
                    src={item.image}
                    alt='img'
                    onLoad={() => setImageLoading(false)}
                    style={{ display: imageLoading ? 'none' : 'block' }}
                  />
                </LazyLoad>
                <h6>{item.name}</h6>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="container pt pb">
        <div className="pb heading-box">
          <h2 className="main_heading">Exclusive Offers</h2>
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
                maxProductLimit={item.maxProductLimit}
                onErrorMessage={handleErrorMessage}
              />
              {/* </Link> */}
            </SwiperSlide>
          ))}
        </Swiper>
        {/* </div> */}
      </section>
      <section className="container pt pb">
        <div className="pb heading-box">
          <h2 className="main_heading ">Most Selling</h2>
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
                maxProductLimit={item.maxProductLimit}
                onErrorMessage={handleErrorMessage}
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
