import React, { useState } from 'react'
import Logo from './Images/Logo.jpg';
import { BsShop } from "react-icons/bs";
import {Link} from "react-router-dom";
import { BsCart2 } from "react-icons/bs";
import { MdShoppingCartCheckout } from "react-icons/md";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { FiShoppingBag } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from 'react-redux';
// import './font/Gilroy-Bold.ttf';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './TDnavbar.css';
const TNavbar = () => {
  const storedMart = sessionStorage.getItem('mart_id');
  const cart = useSelector((state) => state.cart.carts);
  const [showMediaIcons, setShowMediaIcons] = useState(false);
  const cartItemCount = cart.reduce((total, product) => total + product.qty, 0);
  console.log(cartItemCount);
  return (
    <>
      <div className='container'>
        <section className='section1'>
          <div className="navbar" >
            <div style={{width: '35%'}}>
              <a href="/">
                <div className='divlogo'>
                <img className='logo' src={Logo} alt="Logo" />
                </div>
              </a>
            </div>
            <div className={
              showMediaIcons ? "menu-link mobile-menu-link" : "navdiv menu-link"
            }>
              <div>
              <Link to={`/TezDelivery?martId=${storedMart}`} className='Item-Link' activeClassName='active' >
                <BsShop />
                <span className='Item-Link'>Shop</span>
              </Link>
             </div>
             <div>
              <Link to="/order" className='Item-Link'>
                <FiShoppingBag />
                <span>My Orders</span>
              </Link>
            </div>
            <div>
              <Link to="/categories" className='Item-Link'>
                <MdOutlineFeaturedPlayList />
                <span>Categories</span>
              </Link>
            </div>
            <div>
            <Link to="/cart" className='Item-Link'>
                <BsCart2 />
                {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                <span>Cart</span>
              </Link>
            </div>
            <div>
              <Link to="/checkout" className='Item-Link'>
                <MdShoppingCartCheckout />
                <span>Checkout</span>
              </Link>
            </div>
          </div>
          <div className="hamburger-menu">
        <a style={{color:"#495178"}} href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
        {showMediaIcons ? <RxCross2 className='cross-menu' size={24} /> : <GiHamburgerMenu />}
        </a>
      </div>
       </div>
     
    </section >
    
      </div >

    </>
  )
}

export default TNavbar
