import React from 'react'
import { Row, Container } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFacebook } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";
import { BsInstagram } from "react-icons/bs";
import { FaApple } from "react-icons/fa6";
import { IoLogoInstagram } from "react-icons/io";
import { TiSocialFacebook } from "react-icons/ti";
import './Footer.css';
const Footer = () => {
  return (
    <>

      <Container style={{ backgroundColor: '#4D5882' }} fluid>
        <section className='container'>
          <div className='row'>
            <div className='footer-col itemStyle'>
              <div className='text-left'>CALL US NOW</div>
              <div className='divStyle'>
                <div className='icon-style'>
                  <FiPhoneCall />
                </div>
                <span>(0333) 487 8399</span>
              </div>
            </div>

            <div className='footer-col itemStyle'>
              <div >
                <Link to='aboutus' className="div-links">About Us</Link>
              </div>
              <div style={{ marginTop: '7px' }}><a href='#' className="div-links">Privacy Policy</a></div>
              <div className='icons-div'>
                <div className='icons-circle'>
                  <a href='https://www.instagram.com/tezzdelivery/' style={{display:'flex'}}><TiSocialFacebook className=" icons" size={12} color='#15489D'/></a>
                </div>
                <div className='icons-circle'>
                  <a href='https://www.facebook.com/tezzdeliverypk' style={{display:'flex'}}><IoLogoInstagram className=" icons  display-5 " color='#15489D' /></a>
                </div>
              </div>
            </div>
            <div className='footer-col itemStyle apps third-div ml'>
              <span className='download-mobile-apps'>Download Mobile Apps</span>
              <div className='play-div'>
                <div className='icons-circle'>
                  <a href='https://apps.apple.com/eg/app/tezz-delivery/id1632938996' style={{display:'flex'}}><FaApple className=" icons" color='black' size={12} /></a>
                </div>
                <div className='icons-circle '>
                 <a href='https://play.google.com/store/apps/details?id=app.grocery.tezz' style={{display:'flex'}}><img src='/Images/google-play.png' alt="" className=" icons" size={12} /></a> 
                </div>
              </div>
            </div>
            {/* <div className='footer-col icons-div'>
          <a href='https://www.instagram.com/tezzdelivery/'><BsFacebook className=" icons " /></a>
            <a href='https://www.facebook.com/tezzdeliverypk'><BsInstagram className=" icons  display-5" /></a>
          </div> */}
          </div>
        </section>
      </Container>
    </>
  )
}

export default Footer
