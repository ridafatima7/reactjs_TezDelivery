import React, { useState, useEffect } from 'react';
import { GoCheck, GoChevronDown } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";
import { FaRecycle } from "react-icons/fa";
import Footer from "./Footer";
import { MdPictureAsPdf } from "react-icons/md";
import { FaRegFaceFrown } from "react-icons/fa6";
import { MdOutlineDelete } from "react-icons/md";
import { Link } from 'react-router-dom';
import { addtoCart } from './CartSlice';
import Collapsible from 'react-collapsible';
import TNavbar from "./TNavbar";
import { useDispatch } from 'react-redux';
import { ReOrder, Update_Order, createOrder, getMarts, getMyOrders } from '../Server';
import { ImCross } from "react-icons/im";
const Order = () => {
  const storedMart = sessionStorage.getItem('mart_id');
  const dispatch = useDispatch();
  var martdate = '';
  const [cancelOrder, setCancelOrder] = useState(false);
  const [martTimings, setTimingsArray] = useState('');
  const [loading, setLoading] = useState(true);
  const [martInfo, setMartInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ReOrderDetails, setReOrder] = useState('');
  const [ReOrderDetailsPopup, setReOrderDetailsPopup] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [ReOrderPopup, setReorderPopup] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [openInventoryMart, setopenInventoryMart] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [cancelOrderNo, setCancelOrderNo] = useState('');
  const [loginFirst, setloginFirst] = useState(false);
  const LoginUserName = sessionStorage.getItem('userName');
  const storedFirebaseId= sessionStorage.getItem('firebase_id');
  useEffect(() => {
  const fetchData = async () => {
    if (storedFirebaseId === null) {
      setIsLoading(false);
      setloginFirst(true);
      return;
    }
    try {
      setIsLoading(true); 
    try {
        const response = await getMyOrders(storedFirebaseId); 
        console.log(response); 
        if (response.status === 200) {
            console.log(response.data);
            setData(response.data); 
        } else {
            console.error("Failed to fetch orders, status code:", response.status);
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
    } finally {
         setIsLoading(false);
    } 
      const responseMart = await getMarts(storedMart);
      console.log(responseMart);
      const martData = responseMart.data[0];
      console.log(martData);
      setMartInfo(martData);
      setLoading(false);
      const timingsArray = martData.timmings;
      console.log(timingsArray);
      setTimingsArray(timingsArray);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
    finally{
      setIsLoading(false);
    }
  };

  fetchData();
}, []);
  //   const fetchData = async () => {
  //   if (LoginUserName === null) {
  //     setloginFirst(true);
  //     return;
  //   }
  //     setIsLoading(true);
  //     try {
  //       const response = await getMyOrders();
  //       console.log(response.data);
  //       setData(response.data);

  //     } catch (error) {
  //       console.log(error);
  //     }

  //     try {
  //       const response = await getMarts(storedMart);
  //       console.log(response);
  //       const martData = response.data[0];
  //       console.log(martData);
  //       setMartInfo(martData);
  //       setLoading(false);
  //       const timingsArray = martData.timmings;
  //       console.log(timingsArray);
  //       setTimingsArray(timingsArray);
  //     }
  //     catch (error) {
  //       setError(error.message);
  //       setLoading(false);
  //     }
  //     finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);
  var cancelOrderId = "";
  const handleCancelState = (orderId) => {
    setCancelOrderNo(orderId);
    cancelOrderId = orderId;
    console.log(cancelOrderId);
    setCancelOrder(!cancelOrder);
  }
  const OrderCancel = async (orderId) => {
    orderId = cancelOrderId;
    const response = await ReOrder(cancelOrderNo);
    console.log(response.data[0]);
    const orderSummary = {
      orderId: cancelOrderNo,
      rating: response.data[0].rating,
      collectedAmount: response.data[0].collectedAmount,
      deliveredAmount: response.data[0].deliveredAmount,
      distanceInMeters: response.data[0].distanceInMeters,
      paymentMethod: response.data[0].paymentMethod,
      additionalComments: response.data[0].additionalComments,
      grandTotal: response.data[0].grandTotal,
      discount: response.data[0].discount,
      status: "Cancelled",
      cancelledBy: response.data[0].cancelledBy,
      cancelledReason: response.data[0].cancelledReason,
      additionalProducts: response.data[0].additionalProducts,
      additionalQuantity: response.data[0].additionalQuantity,
      riderToken: response.data[0].riderToken,
      customerToken: response.data[0].customerToken,
    };
    const createorder = await Update_Order(orderSummary);
    console.log('Response Status:', createorder.status);
    if (createorder.status === 200) {
      console.log(" order deleted> ", createorder.data);
      setCancelOrder(!cancelOrder);
      try {
        const response = await getMyOrders(storedFirebaseId);
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    else {
      console.log('Error:', response.statusText);
    }

  }
  const Re_Order = async (orderId) => {
    try {
      const response = await ReOrder(orderId);
      console.log(response.data[0]);
      setReOrder(response.data[0].details);
      console.log(ReOrderDetails);
      const pids = response.data[0].details.map(detail => detail.inventory_pid).join('|');
      const quantities = response.data[0].details.map(detail => detail.quantity).join('|');
      let paymentMethod = response.data[0].paymentMethod;
      let additionalComments = response.data[0].additionalComments;
      let address = response.data[0].address;
      let latitude = response.data[0].latitude;
      let longitude = response.data[0].longitude;
      let feedback = response.data[0].feedback;
      let feedback_type = response.data[0].feedback_type;
      let inventory_id = response.data[0].inventory_id;
      setOrderNo(response.data[0].orderNo);
      let rating = response.data[0].rating;
      let collectedAmount = response.data[0].collectedAmount;
      let deliveryCharges = response.data[0].deliveryCharges;
      let walletDiscount = response.data[0].walletDiscount;
      let grandTotal = response.data[0].grandTotal;
      let deliveredAmount = response.data[0].deliveredAmount
      let discount = response.data[0].discount;
      let source = response.data[0].source;
      let status = response.data[0].status;
      let customerName = response.data[0].customerName;
      let customerEmail = response.data[0].customerEmail;
      let customerPhone = response.data[0].customerPhone;
      let customerId = response.data[0].customerId;
      let customerAddress = response.data[0].customerAddress;
      let additionalProducts = response.data[0].additionalProducts;
      let additionalQuantity = response.data[0].additionalQuantity;
      let distanceInMeters = 0;
      let promoId = response.data[0].promoId;
      let promoName = response.data[0].promoName;
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
            setFormattedDate(placedOnDate.replace(',', ''));
            martdate = placedOnDate.replace(',', '');
          } else {
            console.log("Mart is currently closed.");
          }
        } else {
          console.log("Could not find timings for today.");
        }
      }
      const orderSummary = {
        placedOn: martdate,
        scheduledFor: "",
        paymentMethod: paymentMethod,
        additionalComments: additionalComments,
        address: address,
        latitude: latitude,
        longitude: longitude,
        feedback: feedback,
        feedback_type: feedback_type,
        inventory_id: inventory_id,
        rating: rating,
        deliveredAmount: deliveredAmount,
        collectedAmount: collectedAmount,
        deliveryCharges: deliveryCharges,
        walletDiscount: walletDiscount,
        grandTotal: grandTotal,
        discount: discount,
        source: source,
        status: status,
        cancelledBy: "",
        cancelledReason: "",
        productId: pids,
        productQuantity: quantities,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        customerId: customerId,
        customerAddress: customerAddress,
        additionalProducts: additionalProducts,
        additionalQuantity: additionalQuantity,
        riderToken: "",
        customerToken: "",
        distanceInMeters: distanceInMeters,
        promoId: promoId,
        promoName: promoName
      };
      console.log(formattedDate);
      console.log(inventory_id);
      console.log(storedMart);
      console.log(orderSummary);
      if (storedMart == inventory_id) {
        console.log(ReOrderDetails);
        console.log(ReOrderDetails.length);
        if (response.data[0].details.length > 0) {
          // const createorder = await axios.post(
          //   `${api}/create_order`,
          //   JSON.stringify(orderSummary),
          // );
          // console.log('Response Status:', createorder.status);
          // if (createorder.status === 200) {
          //   console.log(" order genrated> ", createorder.data);
          //   console.log(ReOrderDetails);
          const itemsToDispatch = response.data[0].details.map(detail => {
            return {
              id: detail.inventory_pid,
              name: detail.name,
              qty: detail.quantity,
              price: detail.price,
              description: detail.description,
              image: detail.image
            };
          });
          console.log(itemsToDispatch);
          itemsToDispatch.forEach(item => {
            dispatch(addtoCart(item));
          });
          setReorderPopup(true);
          // }
          // else {
          //   console.log('Error:', response.statusText);
          // }
        }
        else {
          setReOrderDetailsPopup(true);
        }
      }
      else {
        setopenInventoryMart(true);
      }


    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <TNavbar />
      {ReOrderPopup && (
        <>
          <div className='promo-container'>
            <div className='promo-popup'>
              <div className='promo-close'>
                <span className='promo-tick-btn'>
                  <GoCheck />
                </span>
              </div>
              <h2 className='promo-label main_heading'>Success</h2>
              <h3 className='promo-label2'>Products added to Cart.</h3>
              <button onClick={() => setReorderPopup(false)} className='continue'>Done</button>
            </div>
          </div>
        </>
      )}
      {openInventoryMart && (
        <>
          <div className='promo-container'>
            <div className='promo-popup'>
              <div className='promo-close'>
                <span className='promo-tick-btn'>
                  <GoCheck />
                </span>
              </div>
              <h2 className='promo-label main_heading'>Alert</h2>
              <h3 className='promo-label2' style={{ textWrap: 'wrap' }}>Different Mart Selected! To get the same products in your cart please select the same mart from where Order {orderNo}  was placed.</h3>
              <button onClick={() => setopenInventoryMart(false)} className='continue'>Done</button>
            </div>
          </div>
        </>
      )}
      {ReOrderDetailsPopup && (
        <>
          <div className='promo-container'>
            <div className='promo-popup'>
              <div className='promo-close'>
                <span className='promo-tick-btn' style={{ backgroundColor: '#F17E2A', color: 'white', fontSize: '40px' }}>
                  <ImCross />
                </span>
              </div>
              <h2 className='promo-label main_heading'>Alert</h2>
              <h3 className='promo-label2' style={{ textWrap: 'wrap' }}>The products in this order are currently not available.</h3>
              <button onClick={() => setReOrderDetailsPopup(false)} className='continue'>Done</button>
            </div>
          </div>
        </>
      )}
      {cancelOrder && (
        <>
          <div className='promo-container'>
            <div className='promo-popup' style={{ maxWidth: '385px' }}>
              <span className='cancel-order-label' style={{ marginTop: '0px' }}>Do you really want to cancel the order?</span>
              <div className='cancel-order-promo'>
                <button onClick={() => setCancelOrder(false)} className='continue'>No</button>
                <button onClick={() => OrderCancel(cancelOrderId)} className='continue'>Yes</button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* {loginFirst && (
        <>
       <div className='no-items' style={{ textAlign: 'center', marginTop: '50px' }}>
          <FaRegFaceFrown size={100} color='#F17E2A' />
          <h3>Login Required</h3>
        </div>
        </>
      )}
      {isLoading ? (
        <div className='loader-div'>
          <div className="Order-loader"></div>
          <>
            <span className='loader-span'>Loading....</span>
          </>
        </div>

      ) : data.length === 0 ? (
        <div className='no-items' style={{ textAlign: 'center', marginTop: '50px' }}>
          <FaRegFaceFrown size={100} color='#F17E2A' />
          <h3>Empty Order List</h3>
        </div>
      ) : (
        <div style={{ marginTop: '60px' }}>
          <div className='order-list'>
            {data.map((order, index) => (
              <div key={index} style={{ width: '80%', margin: '5px auto' }} className='pt accordion'>
                <Collapsible
                  trigger={
                    <div className='accordion-button'>
                      <span style={{ marginRight: 'auto', marginLeft: '10px' }}><b>{order.orderNo}</b></span>
                      <div>
                        <span><b>{order.status.toUpperCase()}</b></span>
                        {openIndex === index ? <GoChevronUp size={22} /> : <GoChevronDown size={22} />}
                      </div>
                    </div>
                  }
                  open={index === openIndex}
                  onOpening={() => setOpenIndex(index)}
                  onClosing={() => setOpenIndex(null)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: "20px", paddingRight: '20px', paddingBottom: '20px' }} >
                    {order.details.map((item, i) => (
                      <div className='panel-items' key={i}>
                        <span>{item.name}</span>
                        <span>{item.quantity}</span>
                        <span>{item.price}</span>
                      </div>
                    ))}
                    <div className='panel-div2'>
                      <span>Total</span>
                      <span>{order.grandTotal}</span>
                    </div>
                    <div className='panel-div2'>
                      <span>Placed On</span>
                      <span>{order.placedOn}</span>
                    </div>
                    <div className='order-icons' style={{ marginLeft: '4px' }}>
                      <FaRecycle size={28} onClick={() => Re_Order(order.id)} />
                      <Link style={{ color: '#4A5073' }} to={`https://admin.tezzdelivery.com/pages/phpFile/invoicePdf.php?orderNo=${order.orderNo}&id=${order.id}&type=1`}>
                        <MdPictureAsPdf size={28} style={{ marginLeft: '10px' }} />
                      </Link>
                      {order.status === 'pending' && (
                        <>

                          <MdOutlineDelete
                            size={28}
                            style={{ marginLeft: '23px' }}
                            onClick={() => handleCancelState(order.id)}
                          />
                        </>
                      )}
                    </div>
                    <div className='order-icons' style={{ marginTop: '-1px' }}>
                      <span style={{ fontSize: '11px' }}>Reorder</span>
                      <span style={{ fontSize: '11px' }}>Invoice</span>
                      {order.status === 'pending' && (
                        <>
                          <span style={{ fontSize: '11px' }} >Cancel Order</span>
                        </>
                      )}
                    </div>
                  </div>
                </Collapsible>
              </div>
            ))}
          </div>

        </div>
      )} */}
{
  loginFirst ? (
    <div className='no-items' style={{ textAlign: 'center', marginTop: '50px' }}>
      <FaRegFaceFrown size={100} color='#F17E2A' />
      <h6 style={{fontSize:'1.1rem',marginTop:'18px'}}>Login Required</h6>
      <Link to='/login'><button className="order-placed-btn">Login</button></Link>
    </div>
  ) : (
    <>
      {isLoading ? (
        <div className='loader-div'>
          <div className="Order-loader"></div>
          <span className='loader-span'>Loading....</span>
        </div>
      ) : data.length === 0  || data===undefined ? (
        <div className='no-items' style={{ textAlign: 'center', marginTop: '50px' }}>
          <FaRegFaceFrown size={100} color='#F17E2A' />
          <h6 style={{fontSize:'1.1rem',marginTop:'18px'}}>Empty Order List</h6>
        </div>
      ) : (
        <div style={{ marginTop: '60px' }}>
          <div className='order-list'>
            {data.map((order, index) => (
              <div key={index} style={{ width: '80%', margin: '5px auto' }} className='pt accordion'>
                <Collapsible
                  trigger={
                    <div className='accordion-button'>
                      <span style={{ marginRight: 'auto', marginLeft: '10px',marginTop:'3px' }}><b>{order.orderNo}</b></span>
                      <div>
                        <span><b>{order.status.toUpperCase()}</b></span>
                        {openIndex === index ? <GoChevronUp size={22} /> : <GoChevronDown size={22} />}
                      </div>
                    </div>
                  }
                  open={index === openIndex}
                  onOpening={() => setOpenIndex(index)}
                  onClosing={() => setOpenIndex(null)}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: "20px", paddingRight: '20px', paddingBottom: '20px' }} >
                    {order.details.map((item, i) => (
                      <div className='panel-items' key={i}>
                        <span>{item.name}</span>
                        <span>{item.quantity}</span>
                        <span>{item.price}</span>
                      </div>
                    ))}
                    <div className='panel-div2'>
                      <span>Total</span>
                      <span>{order.grandTotal}</span>
                    </div>
                    <div className='panel-div2'>
                      <span>Placed On</span>
                      <span>{order.placedOn}</span>
                    </div>
                    <div className='order-icons' style={{ marginLeft: '4px' }}>
                      <FaRecycle size={28} onClick={() => Re_Order(order.id)} />
                      <Link style={{ color: '#4A5073' }} to={`https://admin.tezzdelivery.com/pages/phpFile/invoicePdf.php?orderNo=${order.orderNo}&id=${order.id}&type=1`}>
                        <MdPictureAsPdf size={28} style={{ marginLeft: '10px' }} />
                      </Link>
                      {order.status === 'pending' && (
                        <>

                          <MdOutlineDelete
                            size={28}
                            style={{ marginLeft: '23px' }}
                            onClick={() => handleCancelState(order.id)}
                          />
                        </>
                      )}
                    </div>
                    <div className='order-icons' style={{ marginTop: '-1px' }}>
                      <span style={{ fontSize: '11px' }}>Reorder</span>
                      <span style={{ fontSize: '11px' }}>Invoice</span>
                      {order.status === 'pending' && (
                        <>
                          <span style={{ fontSize: '11px' }} >Cancel Order</span>
                        </>
                      )}
                    </div>
                  </div>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
    </>
  )
}

export default Order
export const ScheduleOrder = () => {
  const storedMart = sessionStorage.getItem('mart_id');

  return (
    <>
      <section className="container pt">
        <div className='center-content'>
          <div className='place-order'>
            <img src="Images/Avatar.png" alt="Order Placed" className="order-image" />
            <div className='image-div-order'>
              <h2 className='main_heading'>Your Order has been Scheduled</h2>
              <Link to={`/TezDelivery?martId=${storedMart}`} className="back-btn">Back To Home Page</Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}