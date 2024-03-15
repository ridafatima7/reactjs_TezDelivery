import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removefromCart,removefromCross} from './CartSlice';
import {  Subtotal } from './CartSlice';
import Footer from './Footer';
import { addtoCart } from './CartSlice';
import { RxCross2 } from "react-icons/rx";
import {Link} from 'react-router-dom';
import TNavbar from "../Components/TNavbar";
import { FaRegFaceFrown } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
const Cart = (props) => {
  const cartItems = useSelector(state => state.cart);
  const subtotal = useSelector(state => state.cart)
  console.log(subtotal);
  console.log(cartItems.carts);
  const dispatch = useDispatch();
  const addToCart = (item) => {
    dispatch(addtoCart(item));
  };
  useEffect(() => {
    dispatch(Subtotal());
  }, [dispatch,cartItems]);
  return (
    <div>
      <TNavbar />
      {cartItems.carts.length === 0 ? (
      <div className='container pt'>
        <div className='no-items'>
          <FaRegFaceFrown size={100} color='#F17E2A'/>
          <h3>No Items Added Yet!</h3>
        </div>
      </div>
    ) : (
      <>
      <div className='container pt'>
        {
          cartItems.carts.map(item => {
            return (
              <div className='cart-container '>
                <div className='cart-div1'>
                  <div className='cart-image'>
                    <div className='image-div'>
                      <img src={item.image} alt='' />
                    </div>
                  </div>
                  <div className='cart-items'>
                    <div className='cart-div2'>
                      <div className='Item-info'>
                        <h5>{item.name}</h5>
                        <div className='cross'>
                        <RxCross2  size={24} onClick={() => dispatch(removefromCross({ id: item.id }))} />
                        </div>
                      </div>
                      <div className='cart-quantity'>
                        <div style={{width:'80%'}}>
                          <div className='cart-buttons'>
                            {item.qty > 1 ? (
                              <button onClick={() => dispatch(removefromCart({ id: item.id }))} className='cart-button-3'>
                                -
                              </button>
                            ) : (
                              <button onClick={() => dispatch(removefromCart({ id: item.id }))} className='cart-button-1'>
                                <RiDeleteBin6Line />
                              </button>
                            )}
                            <span>{item.qty}</span>
                            <button onClick={(e) => addToCart(item)} className='cart-button-2'>+</button>
                          </div>
                        </div>
                        <div className='cart-price'>
                          <h6>Rs {item.price*item.qty}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
      <section className='container '>
        <div className='cart-container-2' >
          <div className='cart-checkout'>
            <div className='cart-subtotal'>
              <h5>Sub-Total</h5>
              <h5>{subtotal.subtotal}</h5>
            </div>
            <div>
              <div className='cart-subtotal'>
                <h5>Delivery Charges</h5>
                <h5>Free Delivery</h5>
              </div>
              <div className='cart-subtotal'>
                <h5>Total</h5>
                <h5>{subtotal.subtotal}</h5>
              </div>
              <div className='button-Style'>
              <Link to='/checkout'>
              <button className='checkout-button'>CHECKOUT</button>
              </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
      
      )}
    </div>
  )
}

export default Cart
export const AdditionalProducts = () => {
  return (
    <>
   <TNavbar />

   <Footer />
    </>
  )
}