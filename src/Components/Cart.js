import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removefromCart, removefromCross, addAdditionalProductToCart } from './CartSlice';
import { Subtotal } from './CartSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';
import { MdDeleteOutline } from "react-icons/md";
import { addtoCart } from './CartSlice';
import { MdShoppingCartCheckout } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom';
import TNavbar from "../Components/TNavbar";
import { FaRegFaceFrown } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoCheck } from "react-icons/go";
const Cart = (props) => {
  const location = useLocation();
  const [additionalDetails, setAdditionalDetails] = useState(false);
  const cartItems = useSelector(state => state.cart);
  const subtotal = useSelector(state => state.cart);
  const additionalItems = useSelector((state) => state.cart.additionalItems);
  console.log(subtotal);
  const Martid = sessionStorage.getItem('mart_id');
  console.log(cartItems.carts);
  const dispatch = useDispatch();
  const handleClick = () => {
    setAdditionalDetails(!additionalDetails);
  }
  const addToCart = (item) => {
    dispatch(addtoCart(item));
  };
  const handleAdditionalPopup = () => {
    setAdditionalPopup(!additionalPopup);
    navigate(`/cart`, { state: false });
  }
  const handleUpdate = () => {
    setAdditionalDetails(!additionalDetails);
    navigate(`/additionalproducts`, { state: additionalItems });
  }
  useEffect(() => {
    dispatch(Subtotal());
  }, [dispatch, cartItems]);
  useEffect(() => {
    if (location.state === true) {
      setAdditionalPopup(true);
    }
  }, [location.state]);
  const navigate = useNavigate();
  const [additionalPopup, setAdditionalPopup] = useState(false);
  return (
    <div>
      <TNavbar />
      {additionalPopup && (
        <>
          <div className='promo-container'>
            <div className='promo-popup'>
              <div className='promo-close'>
                <span className='promo-close-btn' style={{ display: 'flex' }}>
                  <GoCheck style={{ paddingBottom: '10px' }} />
                </span>
              </div>
              <h3 className='promo-label'>Successful</h3>
              <h3 className='promo-label2'>Cart Updated Successfully</h3>
              <button onClick={handleAdditionalPopup} className='continue'>Continue</button>
              </div>
          </div>
        </>
      )}
      {additionalDetails && (
        <>
          <div className='promo-container'>
            <div className='promo-popup' style={{ maxWidth: '70%' }}>
              <div className='additional-close'>
                <RxCross2 onClick={handleClick} size={20} />
              </div>
              <div className="popup-content" style={{ maxHeight: 'auto', overflowY: 'auto' }}>

              {additionalItems.map((item) => (
                <div className='items-popup'>
                  <div className='items-additional'>
                    <div className='cart-image'>
                      <div className='image-div'>
                        <MdShoppingCartCheckout size={30} color='#F28637' />
                      </div>
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <div>
                    <span>{item.qty}</span>
                  </div>
                </div>
              ))}
              </div>
              <button onClick={handleUpdate} className='items-popup-button' style={{ width: '15%' }}>Update</button>
            </div>
          </div>
        </>
      )}
      {cartItems.carts.length === 0 ? (
        <div className='container pt'>
          <div className='no-items'>
            <FaRegFaceFrown size={100} color='#F17E2A' />
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
                              <RxCross2 size={24} onClick={() => dispatch(removefromCross({ id: item.id }))} />
                            </div>
                          </div>
                          <div className='cart-quantity'>
                            <div style={{ width: '80%' }}>
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
                              <h6>Rs {item.price * item.qty}</h6>
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
          {additionalItems.length > 0 && (
            <section className='container pt'>
              <div className='cart-container '>
                <div className='cart-div1'>
                  <div className='cart-image'>
                    <div className='image-div'>
                      <MdShoppingCartCheckout size={30} color='#F28637' />
                    </div>
                  </div>
                  <div className='cart-items'>
                    <div className='view-items'>
                      <h4>Additional Products</h4>
                      <button onClick={handleClick}>View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

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
  const [cartExists, setCartExists] = useState(false);
  const location = useLocation();
  const additionalItems = location.state || [];
  const [showInputs, setShowInputs] = useState(false);
  const navigate = useNavigate();
  // const [inputItems, setInputItems] = useState([{ id: `${Date.now()}-${Math.random().toString(16)}`, name: '', quantity: '' }]);
  const [errors, setErrors] = useState({});
  const Martid = sessionStorage.getItem('mart_id');
  const dispatch = useDispatch();
  const [validationMessages, setValidationMessages] = useState([]);
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const existingCart = storedCart ? JSON.parse(storedCart) : null;
    if (existingCart) {
      setCartExists(true);
    } else {
      setCartExists(false);
    }
  }, []);
  const initializeInputItems = () => {
    if (additionalItems.length > 0) {
      return additionalItems.map((item) => ({
        id: item.id,
        name: item.name || '',
        quantity: item.qty || '',
      }));
    } else {
      return [{
        id: `${Date.now()}-${Math.random().toString(16)}`,
        name: '',
        quantity: '',
      }];
    }
  };
  const [inputItems, setInputItems] = useState(initializeInputItems);
  const handleAddItemClick = () => {
    const newItem = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name: '',
      quantity: ''
    };
    setInputItems([...inputItems, newItem]);
    setValidationMessages([...validationMessages, { id: newItem.id, name: '', quantity: '' }]);

  };
  const handleDeleteItem = (itemId) => {
    if (inputItems.length > 1) {
      setInputItems(inputItems.filter(item => item.id !== itemId));
      setValidationMessages(validationMessages.filter(message => message.id !== itemId));
    }
  };
  const handleInputChange = (itemId, field, value) => {
    setInputItems(inputItems.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
    setValidationMessages(validationMessages.map(message =>
      message.id === itemId ? { ...message, [field]: value === '' ? 'Invalid Input' : '' } : message
    ));
  };

  const handleAddToCart = () => {
    let valid = true;
    const newErrors = {};
    inputItems.forEach(item => {
      if (!item.name) {
        valid = false;
        newErrors[item.id] = { ...newErrors[item.id], name: 'Invalid input' };
      }
      if (!item.quantity) {
        valid = false;
        newErrors[item.id] = { ...newErrors[item.id], quantity: 'Invalid input' };
      }
    });
    setErrors(newErrors);
    if (valid) {
      const storedCart = localStorage.getItem('cart');
      const existingCart = storedCart ? JSON.parse(storedCart) : null;
      if (existingCart) {
        inputItems.forEach(item => {
          const productToAdd = {
            id: item.id,
            name: item.name,
            qty: parseInt(item.quantity, 10)
          };
          dispatch(addAdditionalProductToCart(productToAdd));
          navigate(`/cart`, { state: true });
        });
      } else {
        alert('Please add a product first.');
      }
    }
  };
  return (
    <>
      <TNavbar />

      <div className='container' style={{ display: 'flex', justifyContent: 'center' }}>
        <div className='additional-container' >
          <div className='additional-inputs' style={{ marginBottom: '0px' }}>
            {!cartExists && (
              <div className="alert alert-warning" role="alert">
                It look likes you have not added any items from mart yet.You can only place order if you add some items from mart.
              </div>
            )}
          </div>
          <div className='additional-inputs' >
            <div style={{ width: '65%' }}>
              <span>Items</span>
              <input
                type="text"
                style={{ width: '100%' }}
                placeholder="Brufen Tablet 500 mg"
                className='additional-quantity'
                value={inputItems[0].name}
                onChange={(e) => handleInputChange(inputItems[0].id, 'name', e.target.value)}
              />
              {errors[inputItems[0].id]?.name && <div className='error-message'>{errors[inputItems[0].id].name}</div>}
            </div>
            <div style={{ width: '30%' }}>
              <span style={{ marginLeft: '20px' }} >Quantity</span>
              <input
                type="text"
                placeholder="1 Pack"
                className='additional-quantity'
                style={{ marginLeft: '15px', width: '100%' }}
                value={inputItems[0].quantity}
                onChange={(e) => handleInputChange(inputItems[0].id, 'quantity', e.target.value)}
              />
              {errors[inputItems[0].id]?.quantity && <div style={{ paddingLeft: '20px' }} className='error-message'>{errors[inputItems[0].id].quantity}</div>}
            </div>
            <div style={{ paddingTop: '27px', color: "#434F7B", paddingLeft: '15px' }}>
              <MdDeleteOutline size={24} onClick={() => handleDeleteItem(inputItems[0].id)} />
            </div>
          </div>
          {/* </div> */}
          {inputItems.slice(1).map((item, index) => (
            <div className='additional-inputs'>
              <div style={{ width: '65%' }}>
                <input
                  type="text"
                  placeholder="Brufen Tablet 500 mg"
                  className='additional-quantity'
                  value={item.name}
                  onChange={(e) => handleInputChange(item.id, 'name', e.target.value)}
                />
                {errors[item.id]?.name && <div className='error-message'>{errors[item.id].name}</div>}
              </div>
              <div style={{ width: '30%' }}>
                <input
                  type="text"
                  placeholder="1 Pack"
                  className='additional-quantity'
                  style={{ marginLeft: '15px', width: '100%' }}
                  value={item.quantity}
                  onChange={(e) => handleInputChange(item.id, 'quantity', e.target.value)}
                />
                {errors[item.id]?.quantity && <div style={{ paddingLeft: '20px' }} className='error-message'>{errors[item.id].quantity}</div>}
              </div>
              <div style={{ paddingTop: '9px', color: "#434F7B", paddingLeft: '15px' }}>
                <MdDeleteOutline size={24} onClick={() => handleDeleteItem(item.id)} />
              </div>
            </div>
          ))}
          <div>
            <h4 onClick={handleAddItemClick}>Add Item +</h4>
            {cartExists ? (
              <button onClick={handleAddToCart}>Add to Cart</button>
            ) : (
              <button style={{ backgroundColor: '#e2e2e2' }}>Add to Cart</button>
            )}
          </div>
        </div>
      </div>
      <Footer />


    </>
  )
}