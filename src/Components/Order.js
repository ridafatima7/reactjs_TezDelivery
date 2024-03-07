import React, { useState, useEffect } from 'react';
import { GoCheck, GoChevronDown } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";
import { FaRecycle } from "react-icons/fa";
import { MdPictureAsPdf } from "react-icons/md";
import Collapsible from 'react-collapsible';
import TNavbar from "./TNavbar";
import { ReOrder, createOrder, getMyOrders } from '../Server';
const Order = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [ReOrderDetails,setReOrder]=useState('');
  const [order,setOrder]=useState('');
  const [data, setData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [ReOrderPopup,setReorderPopup]=useState(true);
  const Re_Order = async (orderId) => {
    try {
      const response = await ReOrder(orderId); 
      console.log(response.data);
      setReOrder(response.data);

      if(response.data.details != null){
        const order=createOrder(ReOrderDetails);
        if (response.status === 200) {
          console.log("OrderDetails=>", order.data);
          setOrder(order.data);
        } else {
          console.log('Error:', response.statusText);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyOrders(); 
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <TNavbar />
      { ReOrderPopup && (
            <>
              <div className='promo-container'>
                <div className='promo-popup'>
                  <div className='promo-close'>
                    <span className='promo-tick-btn'>
                      <GoCheck />
                    </span>
                  </div>
                  <h3 className='promo-label'>Success</h3>
                  <h3 className='promo-label2'>Products added to Cart</h3>
                  <button onClick={() => setReorderPopup(false)} className='continue'>OK</button>
                </div>
              </div>
            </>
          )}
      <div style={{ marginTop: '60px' }}>
      {data.map((order, index) => (
        <div key={index} style={{ width: '80%', margin: '13px auto' }} className='pt accordion'>
          <Collapsible 
            trigger={
              <div className='accordion-button'>
                <span style={{ marginRight: 'auto',marginLeft:'10px' }}><b>{order.orderNo}</b></span>
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
            <div style={{ display: 'flex', flexDirection: 'column',paddingLeft:"20px",paddingRight:'20px',paddingBottom:'20px' }} >
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
                <MdPictureAsPdf size={28} style={{ marginLeft: '10px' }} />
              </div>
              <div className='order-icons' style={{ marginTop: '-1px' }}>
                <span style={{ fontSize: '11px' }}>Reorder</span>
                <span style={{ fontSize: '11px' }}>Invoice</span>
              </div>
            </div>
          </Collapsible>
        </div>
      ))}
    </div>

    </>
  )
}

export default Order
