import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';

import { removefromCart } from './CartSlice';
import { addtoCart } from './CartSlice';

import './TD.css';

const Exclusive = (props) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [showQuantityButtons, setShowQuantityButtons] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const storedMart = sessionStorage.getItem('mart_id');
  const canIncreaseQuantity = () => {
    console.log("Max Product Limit:", props.maxProductLimit);
    console.log(quantity);
      if (props.maxProductLimit === 0) {
      console.log("No limit, can add product.");
      return true;
    }
    if (quantity   < props.maxProductLimit) {
      console.log("Can add product.",quantity);
      return true;
    } 
    else {
      console.log("Cannot add product. Quantity limit reached.");
      return false;
    }
  };
  
  const addToCart = () => {
    setShowQuantityButtons(true);
    dispatch(addtoCart(props));
    setErrorMessage(""); 
  };
  const increaseQuantity = () => {
    if (!canIncreaseQuantity()) {
      const message = `You can only add up to ${props.maxProductLimit} of this item.`;
      setErrorMessage(message);
      props.onErrorMessage(message);
      return;
    }
    setQuantity((prevQuantity) => prevQuantity + 1);
    dispatch(addtoCart(props));
    setErrorMessage(""); 
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      dispatch(removefromCart(props));
    }
    else {
      setShowQuantityButtons(false);
    }
  };
 // console.log(props);
  return (
    <>
      <div className='Exclusive'>
        <div className='Exclusive_item'>
        <Link to={`/product_detail?martId=${storedMart}&productId=${props.id}`} className='linkstyle'>
          <div style={{display:'flex',justifyContent:'center'}}>
          <img src={props.image} alt='img' /> 
          </div>  
          <h6 className='Exclusive_itemp'>{props.name}</h6>      
          </Link>
          {showQuantityButtons ? (
            <div className='quantity-buttons'>
              <button className='button-1' onClick={decreaseQuantity}>-</button>
              <span>{quantity}</span>
              <button className='button-2' onClick={increaseQuantity}>+</button>
            </div>
          ) : (
            <div className='prices'>
              <div className='Exclusive_old' style={{
                textDecoration: props.exclusivePrice ? 'line-through red' : 'none',
                fontSize: props.exclusivePrice ? '11px' : '14px',
                paddingBottom:props.exclusivePrice ? '0px':'10px'

              }}>
                Rs {props.price}
              </div>
              <div className='d-flex'>
                {props.exclusivePrice > 0 && (
                  <>
                    <div className='Exclusive_price-new'>
                      Rs {props.exclusivePrice}
                    </div>
                  </>
                )}
                <div className='addtocard' onClick={addToCart}>
                  <p>+</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Exclusive
