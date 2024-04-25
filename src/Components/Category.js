import React, { useEffect, useState } from "react";
import LazyLoad from 'react-lazy-load';
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import Footer from "./Footer";
import NavSection from "./NavSection";
import TNavbar from "./TNavbar";
import { ClipLoader } from 'react-spinners';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { getMartCategories } from "../../../my-app/src/Server";
const Category = () => {
  const [DataProduct, setData] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [search_Query, set_SearchQuery] = useState("");
  const mart_id = sessionStorage.getItem('mart_id');
  const fetchData = async () => {
    try {
      const response = await getMartCategories(mart_id);
      if (response.status === 200) {
        console.log("Categories=>", response.data);
        setData(response.data);
      } else {
        console.log('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }

  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <TNavbar />
      <NavSection />
      {/* <NavSection
        search_Query={search_Query}
        set_SearchQuery={set_SearchQuery}
      /> */}
      <section className="container pt pb">
        {DataProduct.map((category, index) => (
          <div key={index}>
            <div className="pb pt heading-box">
              <h2 className="main_heading">{category.name}</h2>
            </div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={50}
              slidesPerView={4}
              navigation
              breakpoints={{
                200: {
                  slidesPerView: 2,
                },
                480: {
                  slidesPerView: 2,
                },
                767: {
                  slidesPerView: 3,
                },
                991: {
                  slidesPerView: 3,
                },
                992: {
                  slidesPerView: 4,
                }
              }}
            >
              {category.sub_categories.map((subCategory, subIndex) => (
                <SwiperSlide key={subIndex}>
                  <Link
                    to={`/categories_page?martId=${mart_id}&categoryId=${category.cid}`}
                    className="linkstyle"
                  >
                    <div className="products_grid_item">
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {imageLoading && <ClipLoader color={'#F17E2A'} className="lazyload" loading={imageLoading} size={35} />}
                      </div>
                      <LazyLoad>
                        <img
                          src={subCategory.image}
                          alt='img'
                          onLoad={() => setImageLoading(false)}
                          style={{ display: imageLoading ? 'none' : 'block' }}
                        />
                      </LazyLoad>
                      <h6>{subCategory.name}</h6>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
        {/* {DataProduct.map(
          (category, index) => (
            <div key={index}>
              <div className="pb heading-box">
                <h2 className="main_heading">{category.name}</h2>
              </div>
              <div className="products_grid_Cat pb">
                {category.sub_categories
                  .slice(0, 4)
                  .map((subCategory, subIndex) => (
                    <Link
                      to={`/categories_page?martId=${mart_id}&categoryId=${category.cid}`}
                      key={subIndex}
                      className="linkstyle"
                    >
                      <div className="products_grid_item" >
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        { imageLoading && <ClipLoader color={'#F17E2A'} className=" lazyload" loading={imageLoading} size={35}   />}
                        </div>
                        <LazyLoad>
                          <img
                            src={subCategory.image}
                            alt='img'
                            onLoad={() => setImageLoading(false)}
                            style={{ display: imageLoading ? 'none' : 'block' }}
                          />
                        </LazyLoad>
                        <h6>{subCategory.name}</h6>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )
        )} */}
      </section>
      <Footer />
    </div>
  );
};

export default Category;
