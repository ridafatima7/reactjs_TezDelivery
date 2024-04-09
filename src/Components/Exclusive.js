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
  const addToCart = () => {
    setShowQuantityButtons(true);
    dispatch(addtoCart(props));
  };
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    dispatch(addtoCart(props));
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
        <Link to={`/product_detail?martId=1&productId=${props.id}`} className='linkstyle'>
          <div style={{display:'flex',justifyContent:'center'}}>
          <img src={props.image} alt='img' /> 
          </div>  
          <p className='Exclusive_itemp'>{props.name}</p>      
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
