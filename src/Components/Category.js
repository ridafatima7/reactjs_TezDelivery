import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import Footer from "./Footer";
import NavSection from "./NavSection";
import TNavbar from "./TNavbar";
import LazyLoad from 'react-lazy-load';
import { ClipLoader } from 'react-spinners';
import api from "./apis";
const Category = () => {
  const [DataProduct, setData] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [search_Query, set_SearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const mart_id = sessionStorage.getItem('mart_id');
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${api}/get_martCategories?mart_id=${mart_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Categories=>", result);
      setData(result.data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <TNavbar />
      {/* <NavSection
        search_Query={search_Query}
        set_SearchQuery={set_SearchQuery}
      /> */}
      <section className="container pt">
        {DataProduct.map(
          (category, index) => (
            <div key={index}>
              <div className="pb heading-box">
                <h5 className="main_heading">{category.name}</h5>
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
                        {imageLoading && <ClipLoader color={'#F17E2A'} loading={imageLoading} size={35}  className='lazyload' />}
                        <LazyLoad>
                          <img
                            src={subCategory.image}
                            alt='img'
                            onLoad={() => setImageLoading(false)}
                            style={{ display: imageLoading ? 'none' : 'block' }}
                          />
                        </LazyLoad>
                        <p>{subCategory.name}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Category;
