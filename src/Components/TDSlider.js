import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { getSliders } from "../Server";

import api from "./apis";

import "./TD.css";
import 'swiper/swiper-bundle.css';

const TDSlider = () => {
  const [slider, setSlider] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSliders();
        console.log('Sliders Response Status:', response.status);
        if (response.status === 200) {
          console.log('Request successful (Sliders are...)!', response.data);
          setSlider(response.data);
        }
        else {
          console.error('Request failed.', response.data);
        }
      }
      catch (error) {
        console.error('Error during request:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  //  const settings = {
  //      dots: true,
  //      infinite: true,
  //      speed: 500,
  //      slidesToShow: 1,
  //      slidesToScroll: 1,
  //      autoplay: true,
  //      autoplaySpeed: 1000,
  //    };
  return (
    <>
      {/* <Slider {...settings} className='Sdiv'>
          <div >
            <img src={background} alt='meal' />
          </div>
          <div>
             <img src={background} alt='meal' />
          </div>
          <div>
             <img src={background} alt='meal' />
          </div>
          <div>
              <img src={background} alt='meal' />
          </div>
          <div>
             <img src={background} alt='meal' />
          </div>
          <div>
             <img src={background} alt='meal' />
          </div>
        </Slider> */}

      <Swiper
        modules={[EffectCoverflow, Navigation, Pagination, Autoplay, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        // effect={"coverflow"}
        // slidesPerView={"auto"}
        // grabCursor={true}
        // centeredSlides={true}
        effect="coverflow"
        coverflowEffect={
          {
            rotate: 0,
            strech: 0,
            depth: 100,
            modifier: 2.5
          }
        }
        loop={true}
        // keyboardControl={true}
        navigation={false}
        pagination={{
          clickable: true,

          // renderBullet: function (index, className) {
          //   return `<span className="${className} custom-dot"></span>`;
          // }
        }}
        className='swiper-container'
        simulateTouch={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 20
          }
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false, 
        }}
      // onSwiper={(swiper) => console.log(swiper)}
      // onSlideChange={() => console.log('slide change')}
      >
        {slider && slider.map((item, index) => (
          <SwiperSlide key={index}  >
            <BrowserView>
              <img className='swiperImg' src={item.webImage} alt='meal' />
            </BrowserView>
            <MobileView>
              <img className='swiperImg' src={item.image} alt='meal' />
            </MobileView>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default TDSlider
