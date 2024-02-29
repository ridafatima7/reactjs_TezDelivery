import React, { useState, useEffect } from 'react';
import { GoChevronDown } from "react-icons/go";
import { GoChevronUp } from "react-icons/go";
import { FaRecycle } from "react-icons/fa";
import { MdPictureAsPdf } from "react-icons/md";
// import 'bootstrap/dist/css/bootstrap.min.css';
import TNavbar from "./TNavbar";
import api from "./apis";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
const Order = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [className, setClassName] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${api}/get_ordersList?customer_id=0xZxbVCWCjSiY2Q3CInBv4Cv6Kb2`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  // const toggleAccordion = () => {
  //   setIsAccordionOpen(!isAccordionOpen);
  //   setIsPanelOpen(!isPanelOpen);
  // };
  const toggleAccordion = (index) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
    setIsAccordionOpen(!isAccordionOpen);
    setIsPanelOpen(!isPanelOpen);
  };
  return (
    <>
      <TNavbar />
      <div style={{ marginTop: '60px' }}>
        {data.map((order, index) => (
          <div style={{ width: '80%', margin: '13px auto' }} className='pt' >
            <Accordion
              allowMultipleExpanded={true}
            // preExpanded={[0]}
            >
              <AccordionItem className='accordionItem' key={index}>
                <AccordionItemButton className='accordion-button'   >
                  <span style={{ marginRight: 'auto' }}><b>{order.orderNo}</b></span>
                  <div>
                    <span><b>{order.status.toUpperCase()}</b></span>
                    {openAccordionIndex === index ? (
                      <GoChevronUp size={22} />
                    ) : (
                      <GoChevronDown size={22} />
                    )}
                  </div>
                </AccordionItemButton>
                {/* <AccordionItemState  > */}
                {/* {({ expanded }) =>
                    expanded
                      ? setClassName('expanded')
                      : setClassName('collapsed')

                  } */}
                {/* </AccordionItemState> */}
                <AccordionItemPanel >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                      <FaRecycle size={28} />
                      <MdPictureAsPdf size={28} style={{ marginLeft: '10px' }} />
                    </div>
                    <div className='order-icons' style={{ marginTop: '-1px' }}>
                      <span style={{ fontSize: '11px' }}>Reorder</span>
                      <span style={{ fontSize: '11px' }}>Invoice</span>
                    </div>
                  </div>
                </AccordionItemPanel>
              </AccordionItem>

            </Accordion>
          </div>
        ))}
      </div>

    </>
  )
}

export default Order
