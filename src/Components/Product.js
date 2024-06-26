import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import Items from "./Items";
import TNavbar from "./TNavbar";
import { getMartProducts, getMostSellingProducts } from "../Server";
import { useSelector, useDispatch } from 'react-redux';
import { removefromCart } from './CartSlice';
import { addtoCart } from './CartSlice';
const Product = ({ key = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const handleImageClick = (image) => {
    setCurrentImage(image);
    setIsOpen(true);
  };
  const [activeTitle, setActiveTitle] = useState('');
  // const handleVariationClick = (title) => {
  //   setActiveTitle(title);
  // };
  const [activeIndex, setActiveIndex] = useState(null);
  const [variationTitle, setVariationTitle] = useState("");
  const [variationPrice, setVariationPrice] = useState("");
  const [variationExPrice, setVariationExPrice] = useState("");
  const handleVariationClick = (index, title, price, ExPrice) => {
    console.log(ExPrice);
    console.log(price);
    console.log(title);
    setActiveIndex(index);
    setVariationTitle(title);
    setVariationExPrice(ExPrice);
    setVariationPrice(price);
  };
  useEffect(() => {
    setActiveIndex(0);
  }, []);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const pid = params.get("productId");
  const martid = params.get("martId");
  const [Products, setProducts] = useState([]);
  const [ExclusiveOffers, setExclusive] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showQuantityButtons, setShowQuantityButtons] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const get_Products = async () => {
    try {
      // const get_mart_product_url = key
      //   ? `${api}/get_searched_Products?mart_id=${martid}&key=${key}`
      //   : `${api}/get_martProducts?mart_id=${martid}&pid=${pid}`;
      const resultProducts = await getMartProducts(martid, 0, 0, 0, 0, pid);
      // fetch(get_mart_product_url);
      // if (!products.ok) {
      //   throw new Error(`HTTP error! Status: ${products.status}`);
      // }
      // const resultProducts = await products.json();
      console.log(resultProducts.data);
      setProducts(resultProducts.data ? resultProducts.data : []);
      if (resultProducts.data[0].variationTitle && resultProducts.data[0].variationTitle.length > 0) {
        setVariationTitle(resultProducts.data[0].variationTitle[0]);
        console.log(resultProducts.data[0].variationTitle[0])
      }
      if (resultProducts.data[0].variationPrice && resultProducts.data[0].variationPrice.length > 0) {
        setVariationPrice(resultProducts.data[0].variationPrice[0]);
        console.log(resultProducts.data[0].variationPrice[0]);
      }
      if (resultProducts.data[0].variationExPrice && resultProducts.data[0].variationExPrice.length > 0) {
        setVariationExPrice(resultProducts.data[0].variationExPrice[0]);
        console.log(resultProducts.data[0].variationExPrice[0]);
      }
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
    if (item.variationTitle === null && item.variationExPrice === null && item.variationPrice === null) {
      setShowQuantityButtons(true);
      console.log(item);
      dispatch(addtoCart(item));
    }
    else {
      const updatedItem = { ...item };
      updatedItem.name = `${item.name} ${variationTitle}`;
      updatedItem.price = variationPrice;
      updatedItem.exclusivePrice = variationExPrice;
      updatedItem.productTitle = variationTitle;
      setShowQuantityButtons(true);
      console.log(updatedItem)
      dispatch(addtoCart(updatedItem));
    }
  };
  const canIncreaseQuantity = (item) => {
    console.log("Max Product Limit:", item.maxProductLimit);
    console.log(quantity);
    if (item.maxProductLimit === 0) {
      console.log("No limit, can add product.");
      return true;
    }
    if (quantity < item.maxProductLimit) {
      console.log("Can add product.", quantity);
      return true;
    }
    else {
      console.log("Cannot add product. Quantity limit reached.");
      return false;
    }

  };
  const decreaseQuantity = (item) => {
    if (item.variationTitle === null && item.variationExPrice === null && item.variationPrice === null) {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      dispatch(removefromCart(item));
    } else {
      setShowQuantityButtons(false);
      dispatch(removefromCart(item));
    }
  }
  else{
    const updatedItem = { ...item };
    updatedItem.name = `${item.name} ${variationTitle}`;
      updatedItem.productTitle = variationTitle;
      if (quantity > 1) {
        setQuantity((prevQuantity) => prevQuantity - 1);
        dispatch(removefromCart(updatedItem));
      } else {
        setShowQuantityButtons(false);
        dispatch(removefromCart(updatedItem));
      }
  }
  };
  const increaseQuantity = (item) => {
    if (!canIncreaseQuantity(item)) {
      const message = `You can only add up to ${item.maxProductLimit} of this item.`;
      setErrorMessage(message);
      return;
    }
    if (item.variationTitle === null && item.variationExPrice === null && item.variationPrice === null) {

      setQuantity((prevQuantity) => prevQuantity + 1);
      setShowQuantityButtons(true);
      dispatch(addtoCart(item));
      setErrorMessage("");
    }
    else {
      const updatedItem = { ...item };
      updatedItem.name = `${item.name} ${variationTitle}`;
      updatedItem.price = variationPrice;
      updatedItem.exclusivePrice = variationExPrice;
      updatedItem.productTitle = variationTitle;
      setQuantity((prevQuantity) => prevQuantity + 1);
      setShowQuantityButtons(true);
      console.log(updatedItem)
      dispatch(addtoCart(updatedItem));
      setErrorMessage("");
    }
  };
  const handleErrorMessage = (message) => {
    setErrorMessage(message);
  };
  return (
    <div>
      <TNavbar />
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
        <div className="section6">
          {Products.length > 0
            ? Products.map((item, i) => (
              <div key={i} className="product">
                <div className="productdiv" onClick={() => handleImageClick(item.image)}>
                  <img src={item.image} alt="image" />
                </div>
                {isOpen && (
                  <div className="lightbox-overlay" onClick={() => setIsOpen(false)}>
                    <div className="lightbox" onClick={e => e.stopPropagation()}>
                      <img src={currentImage} alt="Preview" />
                      <span className="close-icon" onClick={() => setIsOpen(false)}>×</span>
                    </div>
                  </div>
                )}
                {showQuantityButtons ? (
                  <>
                    <div className="productDetail">
                      {/* <p className="productDetailp">Rs.{item.price}</p> */}
                      {item.variationTitle && item.variationTitle.map((title, index) => (
                        <button
                          key={index}
                          className={`variationTitle ${activeIndex === index ? 'active' : ''}`}
                          onClick={() => handleVariationClick(index, item.variationTitle[index], item.variationPrice[index], item.variationExPrice[index])}
                        >
                          {title}
                        </button>
                      ))}
                      {item.variationExPrice && item.variationExPrice.length > 0 ? (
                          item.variationExPrice[activeIndex] !== 0 ? (
                          <>
                            <p className="productDetailp variationPriceLineThrough">
                              Rs.{item.variationPrice[activeIndex]}
                            </p>
                            <p className="productDetailp"> Rs.{item.variationExPrice[activeIndex]}</p>
                          </>
                          ) : (
                          <p className="productDetailp">Rs.{item.variationPrice[activeIndex]}</p>
                          )
                      ) : (
                        item.exclusivePrice !== null && item.exclusivePrice > 0 ? (
                          <>
                            <p className="productDetailp variationPriceLineThrough">Rs.{item.price}</p>
                            <p className="productDetailp ">Rs.{item.exclusivePrice}</p>
                          </>
                        ) : (
                          <p className="productDetailp ">Rs.{item.price}</p>
                        )
                      )}
                      <h2 className="main_heading">{item.name}</h2>
                      <p>{item.description}</p>
                      <div className="product-buttons">
                        <button className="button-1" onClick={(e) => decreaseQuantity(item)} >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button className="button-2" onClick={(e) => increaseQuantity(item)} >
                          +
                        </button>
                      </div>
                    </div>

                  </>
                ) : (
                  <div className="productDetail">
                    {/* <p className="productDetailp">Rs.{item.price}</p> */}
                    {item.variationTitle && item.variationTitle.map((title, index) => (
                      <button
                        key={index}
                        className={`variationTitle ${activeIndex === index ? 'active' : ''}`}
                        onClick={() => handleVariationClick(index, item.variationTitle[index], item.variationPrice[index], item.variationExPrice[index])}
                      >
                        {title}
                      </button>
                    ))}
                    {item.variationExPrice && item.variationExPrice.length > 0 ? (
                          item.variationExPrice[activeIndex] !== 0 ? (
                          <>
                            <p className="productDetailp variationPriceLineThrough">
                              Rs.{item.variationPrice[activeIndex]}
                            </p>
                            <p className="productDetailp"> Rs.{item.variationExPrice[activeIndex]}</p>
                          </>
                          ) : (
                          <p className="productDetailp">Rs.{item.variationPrice[activeIndex]}</p>
                          )
                    ) : (
                      item.variationPrice !== null && item.exclusivePrice > 0 ? (
                        <>
                          <p className="productDetailp variationPriceLineThrough">Rs.{item.price}</p>
                          <p className="productDetailp ">Rs.{item.exclusivePrice}</p>
                        </>
                      ) : (
                        <p className="productDetailp ">Rs.{item.price}</p>
                      )
                    )}
                    <h2 className="main_heading">{item.name}</h2>
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
          <h2 className="main_heading">Recommendations</h2>
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
              onErrorMessage={handleErrorMessage}
              maxProductLimit={item.maxProductLimit}
            />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Product;
