import React from 'react'
import TNavbar from './TNavbar';
import Footer from './Footer';
import { IoCall } from "react-icons/io5";
import { RiWhatsappFill } from "react-icons/ri";
import { ImFacebook2 } from "react-icons/im";
import { FaSquareInstagram } from "react-icons/fa6";
const AboutUs = () => {
  return (
    <div>
      <TNavbar />
       <section className='container pt'>
         <div className='aboutus'>
           <p><span className='about-span1'><b>Tezz Delivery</b></span> is a one-step solution for your daily shopping needs.</p>
           <p>Frustrated with disruptive deliveries  and unrelieble delivery times?We came up with a solution
           that keeps tha quintessential modern consumer in mind.You can now order any grocery item,from pharmaceuticals to cosmetics,toiletries,everyday essential,fruits and vegetables,
           and much much more,and it will delivered to your location of choice in <span className='about-span1'><b>Islamabad, DHA and Baharia</b></span> in less than 2 hours, with <span className='about-span1'><b>FREE DELIVERY</b></span>on ALL ORDERS.</p>
           <p>Whether you are a bussiness looking for a grocery delivery solution for your offices or schools , or a customer with their 
            fingers crossed for a smooth delivery experiencem you have come  to the right place!
           </p>
           <p>Dont hesitate to call us on <span className='about-span2'>0333 4878399</span></p>
           <p><span className='about-span2'>(0333 ITS TEZZ)</span>for further information.</p>
         </div>
         <div className='about-icons pb'>
           <IoCall  size={28} className='call'/>
           <RiWhatsappFill size={28} className='whatsapp'/>
           <ImFacebook2 size={29} className='fb' />
           <FaSquareInstagram className='insta' size={28} />
         </div>
       </section>
      <Footer />
    </div>
  )
}

export default AboutUs
