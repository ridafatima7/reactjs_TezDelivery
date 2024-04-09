import React,{useState} from 'react'
import './TD.css';
import {Link} from 'react-router-dom';
import LazyLoad from 'react-lazy-load';
import { ClipLoader } from 'react-spinners';
import { useSelector, useDispatch } from 'react-redux';
import { removefromCart } from './CartSlice';
import { addtoCart } from './CartSlice';
const Items = (props) => {
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const [imageLoading, setImageLoading] = useState(true);
  const [showQuantityButtons, setShowQuantityButtons] = useState(false);
  const storedMart = sessionStorage.getItem('mart_id');
  const [errorMessage, setErrorMessage] = useState("");
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
  return (
    <>
    <div className='Exclusive_p'>
      <div className='Exclusive_item_p'>
      <Link to={`/product_detail?martId=${storedMart}&productId=${props.id}`} className='linkstyle'>
        <div className='centered-loader'>
        {imageLoading && <ClipLoader color={'#F17E2A'} loading={imageLoading} size={35} className='lazyload' /> }
        <LazyLoad>
        <div style={{display:'flex',justifyContent:'center'}}>
          <img
            src={props.image}
            alt='img'
            onLoad={() => setImageLoading(false)} 
            style={{ display: imageLoading ? 'none' : 'block'}} 
          />
        </div>
        </LazyLoad>
        </div>
      
         {/* <img src={props.image} alt='' /> */}
        <p className='Exclusive_itemp'>{props.name}</p>
       </Link>
        {showQuantityButtons ? (
          <div className='quantity-buttons'>
            <button className='button-1' onClick={decreaseQuantity}>-</button>
            <span>{quantity}</span>
            <button  className='button-2' onClick={increaseQuantity}>+</button>
          </div>
        ) : (
          <div className='I_prices'>
            <div className='Exclusive_old_I' style={{
                textDecoration: props.exclusivePrice ? 'line-through red' : 'none',
                fontSize: props.exclusivePrice ? '11px' : '14px',
                paddingBottom:props.exclusivePrice ? '0px':'10px'
              }}>
              Rs {props.price}
            </div>
            <div className='d-flex'>
            {props.exclusivePrice > 0 && (
                  <>
                    <div className='Exclusive_price-new_I'>
                      Rs {props.exclusivePrice}
                    </div>
                  </>
                )}
              {/* <div className='Exclusive_price-new_I'>
                Rs {props.exclusivePrice}
              </div> */}
              <div className='addtocard_I' onClick={addToCart}>
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

export default Items
