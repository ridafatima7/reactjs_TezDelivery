import React, { useState, useEffect, useRef } from 'react'
import TNavbar from './TNavbar';
import Footer from "./Footer";
import { FaLocationDot, FaRegAddressCard } from "react-icons/fa6";
import { FiShoppingBag } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux';
import api from "./apis";
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { FaRegFaceFrown } from "react-icons/fa6";
import { removefromCart, removefromCross } from './CartSlice';
import { Subtotal } from './CartSlice';
import { addtoCart } from './CartSlice';
import axios from 'axios';
import { Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Calendar from './CalendarComponent';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import "./TD.css";
// import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { LoadScript } from '@react-google-maps/api';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { createOrder, getMarts } from '../Server';
const Checkout = () => {
  const location = useLocation();
  const { locationId, newlatitude, newlongitude } = location.state || {};
  console.log(locationId, newlatitude, newlongitude);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [addressLoc, setAddressLoc] = useState('');
  const [minAmountToOrder,setMinAmountToOrder]=useState("");
  const [showPromos, setShowPromos] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [additionalComment, setAdditionalComment] = useState('');
  const [paymentMethodpopup, setPaymentMethodpopup] = useState(false);
  const [promoCode, setPromoCode] = useState(false);
  const [martTimings, setTimingsArray] = useState('');
  const [schedule, setScheduale] = useState(false);
  const [OrderScheduale, setOrderScheduale] = useState(false);
  const LoginUserName = sessionStorage.getItem('userName');
  const storedUserName = sessionStorage.getItem('userName') || 'Guest User';
  const storedFirebaseId = sessionStorage.getItem('fire_baseid') || '';
  const storedPhoneNo = sessionStorage.getItem('phoneNumber') || '';
  const storedEmail = sessionStorage.getItem('Email') || '';
  const storedMart = sessionStorage.getItem('mart_id');
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('Now');
  const [schedualeOrder, setSchedualeOrder] = useState('Now');
  const [isEditing, setIsEditing] = useState(false);
  const [EditPopup, setEditPopup] = useState(false);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [martInfo, setMartInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutFailed, setCheckoutFailed] = useState(false);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [formattedDate, setformattedDate] = useState('');
  const [schedualeDate, setschedualeDate] = useState('');
  const [promoCodeNumber, setPromoCodeNumber] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoId, setPromoId] = useState('');
  const [promoName, setPromoName] = useState('');
  const [discountTotal, setDiscountTotal] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [martExist, setMartExist] = useState('');
  const [martClose,setMartClose]=useState('');
  const cartItems = useSelector(state => state.cart);
  const subtotal = useSelector(state => state.cart.subtotal);
  console.log(subtotal);
  const handlePromoCodeChange = (event) => {
    setPromoCodeNumber(event.target.value);
    setPromoError('');
    setPromoId('');
    setPromoName('');
  };
  const applyPromoCode = async () => {
    try {
      const response = await axios.post(
        'https://old.tezzdelivery.com/td_api_test/is_promo_valid',
        JSON.stringify({
          inventory_id: storedMart,
          code: promoCodeNumber,
        }),
      );
      if (response.status === 200) {
        const foundPromo = response.data.data[0];
        console.log(response.data.data[0]);
        let discountAmount = '';
        if (foundPromo.discountPercentage) {
          discountAmount = (foundPromo.discountPercentage / 100) * subtotal;
        }
        else if (foundPromo.flatAmount) {
          discountAmount = foundPromo.flatAmount;
        }
        let totalAfterDiscount = subtotal - discountAmount;
        if (totalAfterDiscount < 0) {
          totalAfterDiscount = 0;
        }
        console.log(totalAfterDiscount);
        setDiscountValue(discountAmount);
        setDiscountTotal(totalAfterDiscount);
        setPromoId(foundPromo.id);
        setPromoName(foundPromo.name);
      } else {
        const errorResponse = response.data;
        console.log('Promo code is invalid.')
        console.log(response.data.message);
        setPromoError(errorResponse.message || 'Promo code is invalid.');
        setPromoCode(true);
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      setPromoError(error.message);
      setPromoCode(true);
    }
  }
  const [formData, setFormData] = useState({
    name: storedUserName || '',
    phoneno: storedPhoneNo || '',
    houseNo: '',
    street: '',
    floor: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phoneno: '',
    houseNo: '',
    street: '',
    floor: ''
  });
  const handleScheduale = (value) => {
    if (value === 'S') {
      setShowCalendar(true);
      setEditPopup(false);
      setOrderScheduale(false);
    }
    else if (value === 'N') {
      setEditPopup(false);
      setSchedualeOrder('Now');
      setOrderScheduale(false);
      setschedualeDate('');
    }
    else {

    }
  }
  const handleClick = (input) => {
    if (input == 'COD') {
      setPaymentMethodpopup(true);
      setEditPopup(true);
    }
    else if (input == 'paymentMethod') {
      setPaymentMethodpopup(false);
      setEditPopup(false);
      setPaymentMethod("Cash on Delivery");
    }
    else if (input == 'Schedualefor') {
      setScheduale(true);
      // setEditPopup(true);
      setOrderScheduale(true);
    }
    else if (input == 'SchedualeDate') {
      setScheduale(false);
      setEditPopup(false);
      setOrderScheduale(false);
    }
    else {

    }

  };
  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };
  const handleDateSelect = (selectedDate) => {
    console.log('Selected Date:', selectedDate);
  };
  const onDateTimeSelect = (selectedDate) => {
    console.log('Selected Time:', selectedDate);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    const schedualeDate = selectedDate.toLocaleString('en-US', options).replace(',', ' ');

    setschedualeDate(schedualeDate);
    setSchedualeOrder(schedualeDate);
    console.log(schedualeOrder);
    console.log(schedualeDate);
    const currentDate = new Date();
    const placedOnDate = currentDate.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const formattedDate = placedOnDate.replace(',', '');
    console.log(formattedDate);
    setformattedDate(formattedDate);
  };
  const handleOptionClick = (option) => {
    if (option === 'Now') {
      setIsEditing(false);
      setShowCalendarPopup(false);
      setScheduledTime('Now')
    } else if (option === 'ScheduleFor') {
      setShowCalendarPopup(true);
      setIsEditing(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = formData.name;
    const phoneno = formData.phoneno;
    const houseno = formData.houseNo;
    const streetno = formData.street;
    const floor = formData.floor;
    setIsPopupOpen(false);
  };
  var lat = 0;
  var long = 0;
  let productIds;
  let productQuantities;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if(!locationId){
      if (martExist === false) {
        setIsPopupOpen(false);
        setCheckoutFailed(true);
        setCheckoutError('Mart is not operating in your current Location.Please Select another location.');
        console.log('Mart is not operating in your current Location.Please Select another location');
        return;
      }
    }
    if (subtotal < minAmountToOrder) {
      setIsPopupOpen(false);
      setCheckoutFailed(true);
      setCheckoutError(`Minimum Amount to place this order is Rs ${minAmountToOrder}.`);
      console.log(`Minimum Amount to place this order is ${minAmountToOrder}.`)
      return;
    }
    if (!formattedDate || formattedDate.trim() === '') {
      setIsPopupOpen(false);
      setCheckoutFailed(true);
      setCheckoutError('Please schedule the order date.');
      console.log('Please schedule the order date.')
      return;
    }

    if (!addressLoc && !locationId) {
      setIsPopupOpen(false);
      setCheckoutFailed(true);
      setCheckoutError('Please provide a valid address before proceeding.');
      return;
    }

    if (!schedualeDate && martClose===true) {
      setIsPopupOpen(false);
      setCheckoutFailed(true);
      setCheckoutError('Mart is currently closed. Please schedule the order.');
      console.log('Mart is currently closed. Please schedule the order.');
      return;
    }
    // if (schedualeDate) {
    //   const scheduled_Time = new Date(schedualeDate).getHours() + (new Date(schedualeDate).getMinutes() / 60);
    //   console.log(scheduled_Time)
    //   if (scheduled_Time >= 12 && scheduled_Time <= 23.5) {
    //     console.log("Selected time is within the valid range.");
    //   } else {
    //     console.log("Please select a time strictly between 12:00 PM and 11:30 PM.");
    //     setIsPopupOpen(false);
    //     setCheckoutFailed(true);
    //     setCheckoutError('Order can only be Scheduled  between 12:00 PM - 11:30 PM.');
    //     return;
    //   }
    // }
    if (schedualeDate) {
      const scheduledDate = new Date(schedualeDate);
      const scheduledDayOfWeek = scheduledDate.getDay();
      const scheduledTimeMinutes = scheduledDate.getHours() * 60 + scheduledDate.getMinutes();
  
      const apiDayOfWeek = scheduledDayOfWeek === 0 ? 7 : scheduledDayOfWeek;
      const todaysTimings = martTimings.find(timing => timing.day === apiDayOfWeek);
      
      if (todaysTimings) {
        const openingTimeMinutes = parseInt(todaysTimings.checkIn.split(':')[0]) * 60 + parseInt(todaysTimings.checkIn.split(':')[1]);
        const closingTimeMinutes = parseInt(todaysTimings.checkOut.split(':')[0]) * 60 + (todaysTimings.checkOut.includes('PM') ? 720 : 0) + parseInt(todaysTimings.checkOut.split(':')[1]);
        const adjustedOpeningTimeMinutes = openingTimeMinutes + 120;
          
          if (scheduledTimeMinutes < adjustedOpeningTimeMinutes || scheduledTimeMinutes > closingTimeMinutes) {
            const adjustedOpeningTime = new Date(scheduledDate.getTime());
            adjustedOpeningTime.setHours(Math.floor(adjustedOpeningTimeMinutes / 60), adjustedOpeningTimeMinutes % 60);

            const closingTime = new Date(scheduledDate.getTime());
            closingTime.setHours(Math.floor(closingTimeMinutes / 60), closingTimeMinutes % 60);

            console.log("The selected time is outside of mart operating hours.");
            setIsPopupOpen(false);
            setCheckoutFailed(true);
            setCheckoutError(`Please schedule the order between ${adjustedOpeningTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} and ${closingTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
            return;
          } else {
              console.log("Scheduled time is within the adjusted mart operating hours.");
          }
      } else {
          console.log("Mart is closed on the selected day.");
          setIsPopupOpen(false);
          setCheckoutFailed(true);
          setCheckoutError("We're sorry, but our mart is closed on the selected day. Please choose another day.");
          return;
      }
  }
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.phoneno.trim()) {
      newErrors.phoneno = 'Phone number is required';
    }
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    console.log(subtotal);
    console.log(cartItems.carts);
    if (Array.isArray(cartItems.carts)) {
      productIds = cartItems.carts.map((product) => product.id).join("|");
      productQuantities = cartItems.carts.map((product) => product.qty).join("|");
      console.log(productIds);
      console.log(productQuantities);
    }
    else {
      console.error("cartItems is not an array or is undefined");
    }
    console.log(addressLoc);
    const data = {
      placedOn: formattedDate,
      scheduledFor: schedualeDate,
      paymentMethod: paymentMethod,
      additionalComments: additionalComment,
      address: locationId !== undefined ? locationId : addressLoc,
      latitude: newlatitude !== undefined ? newlatitude : latitude,
      longitude: newlongitude !== undefined ? newlongitude : longitude,
      feedback: "Test feedback",
      feedback_type: "Normal",
      inventory_id: storedMart,
      rating: "0",
      collectedAmount: 0,
      deliveryCharges: 0,
      walletDiscount: 0,
      grandTotal: discountTotal !== "" && discountTotal >= 0 ? discountTotal : subtotal,
      discount: discountValue,
      source: "web Order",
      status: "pending",
      cancelledBy: "",
      cancelledReason: "",
      productId: productIds,
      productQuantity: productQuantities,
      customerName: formData.name,
      customerEmail: storedEmail,
      customerPhone: formData.phoneno,
      customerId: storedFirebaseId,
      customerAddress: addressLoc,
      additionalProducts: "",
      additionalQuantity: "",
      riderToken: "",
      customerToken: "",
      distanceInMeters: 0,
      promoId: promoId,
      promoName: promoName,
      houseNum: formData.houseNo,
      floorNum: formData.floor,
      streetNum: formData.street,
    };
    console.log(data);
    try {
      const response = await axios.post(
        `${api}/create_order`,
        JSON.stringify(data),
      );
      console.log('Response Status:', response.status);
      if (response.status === 200) {
        console.log('Checkout successful!', response.data);
        setIsPopupOpen(false);
        navigate('/order-placed');
      } else {
        console.error('Checkout failed.', response.data);
        setIsPopupOpen(false);
        setCheckoutFailed(true);
      }
    }
    catch (error) {
      console.error('Error during checkout:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        setIsPopupOpen(false);
        setCheckoutFailed(true);
      }
    }
  };
  useEffect(() => {
    // Fetching Mart info for timings
    const fetchMartInfo = async () => {
      try {
        const response = await axios.get(`${api}/get_marts?mart_id=${storedMart}`);
        console.log(response);
        const martData = response.data.data[0];
        setMinAmountToOrder(response.data.data[0].minPriceToOrder);
        console.log(martData);
        setMartInfo(martData);
        setShowPromos(martData.promos);
        setLoading(false);
        let charges = 0;
        if (response.data.data[0].fixed > 0) {
          charges = response.data.data[0].fixed;
        }
        if (response.data.data[0].perKM > 0) 
        {
        const firstRadius = response.data.data[0].address[0].radius;
        const distance = calculateDistance(latitude, longitude,response.data.data[0].address[0].lat,  response.data.data[0].address[0].lng);   
        charges +=response.data.data[0].perKm * distance;
        }
        
        const timingsArray = martData.timmings;
        console.log(timingsArray);
        setTimingsArray(timingsArray);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    const getCurrentPosition = () => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
              setLatitude(latitude);
              setLongitude(longitude);
              console.log(latitude);
            },
            (error) => {
              reject(error);
            }
          );
        } else {
          reject(new Error('Geolocation is not supported by your browser'));
        }
      });
    };
    const getAddressFromCoordinates = async (latitude, longitude) => {
      const apiKey = 'AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU';
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const address = data.results[0].formatted_address;
          setAddressLoc(address);
          const martApiResponse = await axios.get(`${api}/get_marts?mart_id=${storedMart}`);
          const martData = martApiResponse.data.data[0];
          const isMartInLocation = martData.address.some((address) => {
            const distance = calculateDistance(
              parseFloat(latitude),
              parseFloat(longitude),
              address.lat,
              address.lng
            );
            return distance <= address.radius;
          });

          if (isMartInLocation) {
            console.log('At least one address of the mart is within the user\'s current location.',address);
            setMartExist(true);
          } else {
            console.log('No address of the mart is within the user\'s current location.',address);
            setMartExist(false);
          }

          return address;
        } else {
          throw new Error('No address found for the provided coordinates');
        }
      } catch (error) {
        throw error;
      }
    };
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    }
    const fetchData = async () => {
      try {

        const position = await getCurrentPosition();
        const { latitude, longitude } = position;
        await getAddressFromCoordinates(latitude, longitude);

      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
    fetchMartInfo();
  }, []);
  useEffect(() => {
    if (martTimings && Array.isArray(martTimings)) {
      const currentDate = new Date();
      const currentDayOfWeek = currentDate.getDay();
      const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
      const apiDayOfWeek = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;
      const todaysTimings = martTimings.find(timing => timing.day === apiDayOfWeek);
      if (todaysTimings) {
        const checkInTime = parseInt(todaysTimings.checkIn.split(':')[0]) * 60 + parseInt(todaysTimings.checkIn.split(':')[1]);
        const checkOutTime = parseInt(todaysTimings.checkOut.split(':')[0]) * 60 + (todaysTimings.checkOut.includes('PM') ? 12 * 60 : 0) + parseInt(todaysTimings.checkOut.split(':')[1]);
        if (currentTime >= checkInTime && currentTime <= checkOutTime) {
          console.log("Mart is currently open.");
          const currentDate = new Date();
          const placedOnDate = currentDate.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          const formattedDate = placedOnDate.replace(',', '');
          setformattedDate(formattedDate);
        } else {
          console.log("Mart is currently closed.");
          // setShowOrderScheduale(true);
          // console.log('state is', showOrderScheduale);
          setMartClose(true);
        }
      } else {
        console.log("Could not find timings for today.");
      }
    }
  }, [martTimings]);
  return (
    <div>

      <TNavbar />
      {cartItems.carts.length === 0 ? (
        <div className='container pt'>
          <div className='no-items'>
            <FaRegFaceFrown size={100} color='#F17E2A' />
            <h3>No Items Added Yet!</h3>
          </div>
        </div>
      ) : (
        <>
          {EditPopup && (
            <div className='payment-container'>
              <div className='payment-popup'>
                {paymentMethodpopup && (
                  <>
                    <div className='payment-close'>
                      <span className='payment-close-btn' onClick={() => handleClick('paymentMethod')}>
                        &times;
                      </span>
                    </div>
                    <h3 className='payment-label' onClick={() => handleClick('paymentMethod')}>Cash on Delivery</h3>
                    <hr className='line-after' />
                  </>
                )}

              </div>
            </div>
          )}
          {checkoutFailed && (
            <>
              <div className='promo-container'>
                <div className='promo-popup'>
                  <div className='promo-close'>
                    <span className='promo-close-btn' onClick={() => setCheckoutFailed(false)}>
                      &times;
                    </span>
                  </div>
                  <h2 className='promo-label main_heading'>Error</h2>
                  <h3 className='promo-label2'>{checkoutError}</h3>
                  <button onClick={() => setCheckoutFailed(false)} className='continue'>Continue</button>
                </div>
              </div>
            </>
          )}
          {showCalendar && (
            <>
              <Calendar onClose={handleCloseCalendar} onDateSelect={handleDateSelect} onDateTimeSelect={onDateTimeSelect} />
            </>
          )}
          {promoCode && (
            <>
              <div className='promo-container'>
                <div className='promo-popup'>
                  <div className='promo-close'>
                    <span className='promo-close-btn' onClick={() => handleClick('paymentMethod')}>
                      &times;
                    </span>
                  </div>
                  <h3 className='promo-label'>Invalid Promo</h3>
                  <h3 className='promo-label2'>{promoError}</h3>
                  <button onClick={() => setPromoCode(false)} className='continue'>Continue</button>
                </div>
              </div>
            </>
          )}
          {isPopupOpen && (
            <div className='popup-container'>
              <div className='popup'>
                <span className='close-btn' onClick={() => setIsPopupOpen(false)}>
                  &times;
                </span>
                <h2 className='popup-heading main_heading'>One last step!</h2>
                <span className='popup-text'>Please Enter Contact details to place your order</span>
                <form className='popup-form'>
                  <input
                    placeholder='Name'
                    type='text'
                    id='name'
                    name='name'
                    value={formData.name}
                    className='popup-input'
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  {formErrors.name && <span className='required-errors'>{formErrors.name}</span>}
                  <input
                    placeholder='03xx xxxxxxx'
                    type='text'
                    id='phoneno'
                    name='phoneno'
                    className='popup-input'
                    value={formData.phoneno}
                    onChange={(e) => setFormData({ ...formData, phoneno: e.target.value })}
                    required
                  />
                  {formErrors.phoneno && <span className='required-errors'>{formErrors.phoneno}</span>}

                  <input
                    type='text'
                    placeholder='House Number'
                    id='houseNo'
                    name='houseNo'
                    className='popup-input'
                    value={formData.houseNo}
                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                  />

                  <input
                    type='text'
                    id='street'
                    className='popup-input'
                    placeholder='Street Name/Number'
                    name='street'
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                  <input
                    type='text'
                    className='popup-input'
                    id='floor'
                    placeholder='Floor'
                    name='floor'
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  />
                  <button className='popup-button' onClick={handleCheckout} type='submit'>Submit</button>
                </form>
              </div>
            </div>
          )}
          {OrderScheduale && (
            <div className='payment-container'>
              <div className='payment-popup'>
                {schedule && (
                  <>
                    <div className='payment-close'>
                      <span className='payment-close-btn' onClick={() => handleClick('SchedualeDate')}>
                        &times;
                      </span>
                    </div>
                    <h3 className='payment-label' onClick={() => handleScheduale('N')}>Now</h3>
                    <hr className='line-after' />
                    <h3 className='payment-label' onClick={() => handleScheduale('S')}>Scheduale Order</h3>
                    <hr className='line-after' />
                  </>
                )}

              </div>
            </div>
          )}
          <section className='container'>

            <div className='cart-container'>
              {/* {checkoutError && (
                <Alert color="danger" className="alert alert-warning" role="alert" isOpen={checkoutError !== ''} toggle={() => setCheckoutError('')} style={{ marginBottom: '10px' }}>
                  {checkoutError}
                </Alert>
              )} */}
              <div className='checkout-items'>
                <h5>Deliver to</h5>
                <Link to={{
                  pathname: '/edit-location',
                  state:
                  {
                    any: setNewLocation
                  }
                }} style={{ textDecoration: 'none' }}>
                  <span style={{}}>Edit</span></Link>
              </div>
              <div className='main'>
                <div className='checkout-icons'>
                  <FaLocationDot size={20} style={{ color: '#434F7B' }} />
                </div>
                <div className='main-div'>
                  <p>{storedUserName}</p>
                  <p> {locationId ? locationId : addressLoc}</p>
                </div>
              </div>
            </div>
            <div className='cart-container'>
              <div className='checkout-items'>
                <h5>Payment Method</h5>
                <span onClick={() => handleClick('COD')}>Edit</span>
              </div>
              <div className='main'>
                <div >
                  <img src='/Images/card.png' size={20} />
                </div>
                <div className='main-div'>
                  <p style={{ marginTop: '-5px' }}>{paymentMethod}</p>
                </div>
              </div>
            </div>
            {showPromos.length > 0 && LoginUserName && (
              <div className='cart-container'>
                <div className='checkout-items'>
                  <h5>Promo Code</h5>
                  <span >Applicable</span>
                </div>
                <div className='main'>
                  <div className=''>
                    <img src='/Images/promo.png' alt='' />
                  </div>
                  <div className='promo'>
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCodeNumber}
                      onChange={handlePromoCodeChange}
                      className='promo-input'
                    />
                    {/* <p style={{ marginTop: '5px' }}>Enter Promo Code</p> */}
                    <h5 onClick={applyPromoCode}>Apply</h5>
                  </div>
                </div>
              </div>
            )}
            {/* {showOrderScheduale && ( */}
            <div className='cart-container'>
              {/* {TimeError && (
                <Alert color="danger" className="alert alert-warning" role="alert" isOpen={TimeError !== ''} toggle={() => setTimeError('')} style={{ marginBottom: '10px' }}>
                  {TimeError}
                </Alert>
              )} */}
              <div className='checkout-items'>
                <h5>Scheduled for</h5>
                <span onClick={() => handleClick('Schedualefor')}>Edit</span>
              </div>
              <div className='main'>
                <div className='checkout-icons'>
                  <FiShoppingBag style={{ color: '#434F7B' }} size={20} />
                </div>
                <div className='main-div'>
                  <p style={{ marginTop: '5px' }}>{schedualeOrder}</p>
                </div>
              </div>
              {isEditing && (
                <div className='popup-options'>
                  <button onClick={() => handleOptionClick('Now')}>Now</button>
                  <button onClick={() => handleOptionClick('ScheduleFor')}>
                    Schedule For
                  </button>
                </div>

              )}

            </div>
            {/* )} */}
          </section>
          <section className='container '>
            <div className='cart-container'>
              <div style={{ width: '100%' }} class="checkoutInputContainer">
                <textarea class="checkoutInput" placeholder="Additional Comments" value={additionalComment}
                  onChange={(e) => setAdditionalComment(e.target.value)}
                ></textarea>
              </div>
            </div>
          </section>
          <section className='container '>
            <div className='cart-container' style={{ backgroundImage: 'url("/Images/Background.jpeg")', borderRadius: "15px", backgroundRepeat: 'none', backgroundSize: 'cover', objectPosition: 'center', backgroundPosition: 'center' }}>
              <div className='cart-checkout'>
                <div className='cart-subtotal'>
                  <Link to='/cart' ><h4 style={{ textDecoration: 'underline', fontSize: '16px', color: 'white' }}>View Cart</h4></Link>
                </div>
                <div className='cart-subtotal'>
                  <h5>Sub-Total</h5>
                  <h5>Rs {subtotal}</h5>
                </div>
                <div>
                  <div className='cart-subtotal'>
                    <h5>Delivery Charges</h5>
                    <h5>Free Delivery</h5>
                  </div>
                  {discountValue !== '' && (
                    <div className='cart-subtotal'>
                      <h5>Discount</h5>
                      <h5>Rs {discountValue}</h5>
                    </div>
                  )}
                  <div className='cart-subtotal'>
                    <h5>Total</h5>
                    <h5>Rs {discountTotal || discountTotal === 0 ? discountTotal : subtotal}</h5>
                  </div>
                  <div className='button-Style'>
                    <button onClick={() => setIsPopupOpen(true)} className='checkout-button'>
                      {schedualeDate ? "Schedule Order" : "Place Order"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Checkout
const libraries = ['places'];
export const Location = () => {
  const navigate = useNavigate();
  const [currentPosition, setCurrentPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationError, setConfirmationError] = useState('');
  const [open, setopen] = useState(false);
  const [martData, setMartInfo] = useState('');
  const [addressArray, setAddressArray] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);
  const storedMart = sessionStorage.getItem('mart_id');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [confirmedAddress, setConfirmedAddress] = useState('');
  const autocompleteInputRef = useRef(null);
  // const [libraries] = useState(['places']);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU",
    libraries,
    // libraries: ['places'],
  });

  const handlePlaceSelect = (place) => {
    if (!place || !place.geometry || !place.geometry.location) {
      console.error('No location found for:', place);
      return;
    }
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setCurrentPosition({ lat, lng });
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setSearchLocation(place.formatted_address);

  };
  useEffect(() => {
    const getLocation = () => {
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            getCurrentPosition();
          } else {
            setLoading(false);
            setToMartLocation();
          }
        });
      } else {
        if (navigator.geolocation) {
          getCurrentPosition();
        } else {
          console.error('Geolocation is not supported by this browser.');
          setLoading(false);
          setToMartLocation();
        }
      }
    };


    const getCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          setLatitude(latitude.toFixed(6));
          setLongitude(longitude.toFixed(6));
          setLoading(false);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setLoading(false);
        }
      );
    };
    const setToMartLocation = async () => {
      try {
        const response = await axios.get(`${api}/get_marts?mart_id=${storedMart}`);
        console.log('Fetching mart data for location:', response);
        const martData = response.data.data[0];

        if (martData && martData.latitude && martData.longitude) {
          console.log(martData.latitude, martData.longitude);
          setCurrentPosition({ lat: martData.latitude, lng: martData.longitude });
          setLatitude(martData.latitude.toFixed(6));
          setLongitude(martData.longitude.toFixed(6));
        } else {
          console.error('Mart location data is not available.');
        }
      } catch (error) {
        console.error('Error fetching mart location:', error);
      }
      setLoading(false);
    };
    const fetchMartInfo = async () => {
      try {
        const response = await axios.get(`${api}/get_marts?mart_id=${storedMart}`);
        console.log(response);
        const martData = response.data.data[0];
        console.log(martData);
        setMartInfo(martData);
        // setLoading(false);
        const martAddress = martData.address;
        console.log(martAddress);
        setAddressArray(martAddress);
      } catch (error) {
        // setError(error.message);
        // setLoading(false);
      }
    };
    fetchMartInfo();
    getLocation();
  }, []);
  const handleConfirmAddress = () => {
    const isWithinServiceArea = martData.address.some((address) => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        address.lat,
        address.lng
      );
      return distance <= address.radius;
    });

    if (isWithinServiceArea) {
      setConfirmedAddress(searchLocation);
      console.log(confirmedAddress);
      setSearchLocation(searchLocation);
      navigate('/checkout', {
        state: {
          locationId: searchLocation,
          newlatitude: latitude,
          newlongitude: longitude,
        },
      });
    } else {
      setConfirmationError('Mart is not available for delivery at selected location ');
      console.log('Selected address is outside the service area of the mart.');
    }
  };
  const handleSearch = async () => {
    try {
      let api = 'AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU';
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchLocation)}&key=${api}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        // const formattedAddress = data.results[0].formatted_address;
        setMarkerPosition({ lat, lng });
        setCurrentPosition({ lat, lng });
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
      }
      else {
        console.error('Location not found');
        console.log(searchLocation);
        console.log(data);
        console.log(response);
        console.log(currentPosition);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  const handleSelect = async (address) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      setCurrentPosition(latLng);
      setSearchLocation(address);
      setLatitude(latLng.lat.toFixed(6));
      setLongitude(latLng.lng.toFixed(6));
    } catch (error) {
      console.error('Error selecting location:', error);
    }
  };
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiId = process.env.REACT_APP_API_URL;
  const mapOptions = {
    mapTypeControl: false,
  };
  return (
    <div>
      <TNavbar />
      <div className='pt' >
        {confirmationError && (
          <>
            <div className='promo-container'>
              <div className='promo-popup'>
                <div className='promo-close'>
                  <span className='promo-close-btn' onClick={() => setConfirmationError('')}>
                    &times;
                  </span>
                </div>
                <h2 className='promo-label main_heading'>Error</h2>
                <h3 className='promo-label2'>{confirmationError}.</h3>
                <button onClick={() => setConfirmationError('')} className='continue'>Continue</button>
              </div>
            </div>
          </>
        )}
        {loading ? (
          <div className='loader-div'>
            <div className="Order-loader"></div>
            <>
              <span className='loader-span'>Loading....</span>
            </>
          </div>
        ) : (
          <APIProvider apiKey='AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU' className='pt' >
            <div style={{ height: '100vh', width: '100%' }}>
              <Map zoom={14} center={currentPosition} mapId='f354a7d216f1686c' options={mapOptions}>
                {currentPosition && (
                  <AdvancedMarker position={currentPosition} onClick={() => setopen(true)}>
                    <Pin
                      background={'grey'}
                      borderColor={'green'}
                      glyphColor={'purple'} />
                  </AdvancedMarker>
                )}
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}>
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocomplete.addListener('place_changed', () => {
                        const place = autocomplete.getPlace();
                        handlePlaceSelect(place);
                      });
                    }}
                  >
                    <input
                      type="text"
                      // value={searchLocation}
                      // onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Enter location"
                      className='map-search'
                      ref={autocompleteInputRef}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                  </Autocomplete>
                  {/* <button onClick={handleSearch} className='map-search-button'>Search</button> */}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', position: 'relative', height: '74vh' }}>
                  <div style={{ alignSelf: 'flex-end', zIndex: 1001 }}>
                    <button onClick={handleConfirmAddress} className='confirm-adress'>Confirm Address</button>
                  </div>
                </div>
              </Map>
            </div>
          </APIProvider>
        )}
      </div>
    </div>
  );
};
export const WalletandPromos = () => {
  const storedMart = sessionStorage.getItem('mart_id');
  const [PromoExists, setPromoExists] = useState('');
  const [EditPopup, setEditPopup] = useState(false);
  const [paymentMethodpopup, setPaymentMethodpopup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  useEffect(() => {

    const fetchData = async () => {
      // Getting Mart Data
      try {
        const response = await getMarts(storedMart);
        if (response.status === 200) {
          console.log("Mart Data for promos =>", response.data);
          setPromoExists(response.data[0].promos);
          console.log(response.data[0].promos);
        }
        else {
          console.log('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchData();
  }, []);
  const breakpoints = {
    300: {
      spaceBetween: 20,
      slidesPerView: 1.5
    },
    480: {
      // spaceBetween: 20,
      slidesPerView: 1
    },
    768: {
      spaceBetween: 30,
      // slidesPerView: 1
    },
    1024: {
      spaceBetween: 20,
      // slidesPerView: 1
    },
    1200: {
      slidesPerView: 1,
      // spaceBetween: 20,
    },
  };
  const handleClick = (input) => {
    if (input == 'paymentMethod') {
      setPaymentMethodpopup(false);
      setEditPopup(false);
      setPaymentMethod("Cash on Delivery");
    }
    else if (input == 'COD') {
      setPaymentMethodpopup(true);
      setEditPopup(true);
      // setPaymentMethod("Cash on Delivery");
    }
    else {

    }
  };
  return (
    <>
      <TNavbar />
      <section className='container'>
        {EditPopup && (
          <div className='payment-container'>
            <div className='payment-popup'>
              {paymentMethodpopup && (
                <>
                  <div className='payment-close'>
                    <span className='payment-close-btn' onClick={() => handleClick('paymentMethod')}>
                      &times;
                    </span>
                  </div>
                  <h3 className='payment-label' onClick={() => handleClick('paymentMethod')}>Cash on Delivery</h3>
                  <hr className='line-after' />
                </>
              )}

            </div>
          </div>
        )}
        <div className='cart-container'>
          <div className='checkout-items'>
            <h5>Funds Available</h5>
          </div>
          <div className='main'>
            <div>
              <img src='Images/promo.png' alt='' />
            </div>
            <div className='main-div'>
              <p style={{ marginTop: '9px' }}>Rs 0</p>
            </div>
          </div>
        </div>
        <div className='cart-container'>
          <div className='checkout-items'>
            <h5>Points Available</h5>
            {/* <span >Applicable</span> */}
          </div>
          <div className='main'>
            <div>
              <img src='Images/promo.png' alt='' />
            </div>
            <div className='promo'>
              <p style={{ marginTop: '9px' }}>0</p>
              {/* <h5 onClick={() => setPromoCode(true)}>Apply</h5> */}
            </div>
          </div>
        </div>
        <div className='cart-container'>
          <div className='checkout-items'>
            <h5>Payment Method</h5>
            <span onClick={() => handleClick('COD')}>Edit</span>
          </div>
          <div className='main'>
            <div >
              <img src='/Images/card.png' size={20} />
            </div>
            <div className='main-div'>
              <p style={{ marginTop: '5px' }}>{paymentMethod}</p>
            </div>
          </div>

        </div>
        <div className='cart-container' style={{ fontSize: '17px', borderBottom: '0px' }}>
          {/* <br /><h5>Promo Code</h5>
          <h5>Promo Code not Available.Please come back later</h5> */}
          {PromoExists.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              // spaceBetween={30}
              // slidesPerView={1.5}
              grabCursor={true}
              breakpoints={breakpoints}
              // centeredSlides={true}
              // loop={true}
              navigation={false}
              pagination={{ clickable: true }}
              // className='swiper-container'
              onSwiper={(swiper) => console.log(swiper)}
              // onSlideChange={() => console.log('slide change')}
              slideClass="custom-swiper-slide"

            >
              {PromoExists.map((promo, index) => (
                <SwiperSlide key={index} style={{ backgroundColor: 'white' }}>
                  <img className='promoImg' src={promo.image} alt={`Promo ${index + 1}`} />
                  <div className="content-p">
                    <h2>{promo.description}</h2>
                    <div className="description-line"></div>
                    <div className="promo-details">
                      <div>
                        <span>Code</span>
                        <span style={{ fontWeight: 'bold' }}>{promo.code}</span>
                      </div>
                      <div>
                        <span>Valid till</span>
                        <span style={{ fontWeight: 'bold' }}>{promo.validTill}</span>
                      </div>
                    </div>
                    {/* </div> */}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <>
              <br /><h5>Promo Code</h5>
              <h5>Promo Code not Available. Please come back later</h5>
            </>
          )}
        </div>

      </section >
      <Footer />
    </>
  )
}
export const OrderPlaced = () => {
  const storedMart = sessionStorage.getItem('mart_id');

  return (
    <>
      <section className="container pt">
        <div className='center-content'>
          <div className='place-order'>
            <img src="Images/Avatar.png" alt="Order Placed" className="order-image" />
            <div className='image-div-order'>
              <h2>Your Order has been Placed</h2>
              <span className="order-text">Your order has been placed and its on the way to being processed!</span>
              <button className="order-placed-btn">TRACK ORDER</button>
              <Link to={`/TezDelivery?martId=${storedMart}`} className="back-btn">BACK TO HOME PAGE</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}