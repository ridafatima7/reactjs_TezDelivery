import React, { useState, useEffect } from "react";
import { MdPinDrop } from "react-icons/md";
import Exclusive from "./Exclusive";
import Footer from "./Footer";
import Items from "./Items";
import TNavbar from "./TNavbar";
import api from "./apis";
import { getMartProducts, getMostSellingProducts } from "../Server";
import { useSelector, useDispatch } from 'react-redux';
import { removefromCart} from './CartSlice';
import {  Subtotal } from './CartSlice';
import { addtoCart } from './CartSlice';
const Product = ({ key = "" }) => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const pid = params.get("productId");
  const martid = params.get("martId");
  const [Products, setProducts] = useState([]);
  const [ExclusiveOffers, setExclusive] = useState([]);
  const [showQuantityButtons, setShowQuantityButtons] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const get_Products = async () => {
    try {
      // const get_mart_product_url = key
      //   ? `${api}/get_searched_Products?mart_id=${martid}&key=${key}`
      //   : `${api}/get_martProducts?mart_id=${martid}&pid=${pid}`;
      const resultProducts = await getMartProducts(martid,0,0,0,0,pid);
      // fetch(get_mart_product_url);
      // if (!products.ok) {
      //   throw new Error(`HTTP error! Status: ${products.status}`);
      // }
      // const resultProducts = await products.json();
      console.log(resultProducts.data);
      setProducts(resultProducts.data ? resultProducts.data : []);
    } catch (err) {
      console.log(err);
    }
    try {
      const response = await getMostSellingProducts(martid);
      console.log(response);
      setExclusive(response.data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  useEffect(() => {
    get_Products();
  }, []);
  const addToCart = (item) => {
    setShowQuantityButtons(true);
    dispatch(addtoCart(item));
  };
  const decreaseQuantity = (item) => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      dispatch(removefromCart(item));
    } else {
      setShowQuantityButtons(false);
      dispatch(removefromCart(item));
    }
  }; 
  const increaseQuantity = (item) => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    setShowQuantityButtons(true);
    dispatch(addtoCart(item));

  };

  return (
    <div>
      <TNavbar />
      <section className="container pt">
        <div className="section6">
          {Products.length > 0
            ? Products.map((item, i) => (
                <div key={i} className="product">
                  <div className="productdiv">
                    <img src={item.image} alt="image" />
                  </div>
                  {showQuantityButtons ? (
                    <div>
                      <div className="productDetail">
                        <p className="productDetailp">Rs.{item.price}</p>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                      </div>
                      <div className=" productDetail product-buttons">
                        <button className="button-1" onClick={(e) =>decreaseQuantity(item)} >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button className="button-2" onClick={(e) => increaseQuantity(item)} >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="productDetail">
                      <p className="productDetailp">Rs.{item.price}</p>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <p className="cart" onClick={(e) => addToCart(item)}>
                        +
                      </p>
                    </div>
                  )}
                </div>
              ))
            : null}
        </div>
      </section>

      <section className="container pt">
        <div className="pb heading-box">
          <h5 className="main_heading">Recommendations</h5>
        </div>
        <div className="popular-exclusive pb">
          {ExclusiveOffers.map((item, i) => (
            <Items
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
              exclusivePrice={item.exclusivePrice}
            />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Product;
