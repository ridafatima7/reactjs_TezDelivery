import React, { useState, useEffect } from 'react';
import Footer from "../Footer";
import TDSlider from "../TDSlider";
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import LazyLoad from 'react-lazy-load';
import { ClipLoader } from 'react-spinners';
import { Navigation, Pagination, Autoplay, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { BsShop } from "react-icons/bs";
import { Button, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Exclusive from "../Exclusive";
import { MdLocationPin } from "react-icons/md";
import { getMartCategories, getExclusiveProducts, getMarts } from "../../Server";
import LandingNavbar from './LandingNavbar';
import './LandingPage.css';
const LandingPage = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [DataProduct, setData] = useState([]);
    const [martData, setMartData] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [ExclusiveOffers, setExclusive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedMartName, setSelectedMartName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [Martid,setMartid]=useState(1);
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
    const handleItemClick = (e) => {
        console.log('Clicked item:', e.target.textContent);
    };
    // let Martid = '1';
    useEffect(() => {

        const fetchData = async () => {
            // Getting mart categories
            try {
                const response = await getMartCategories(Martid);
                if (response.status === 200) {
                    console.log("Categories=>", response.data);
                    setData(response.data);
                } else {
                    console.log('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
            // Getting Exclusive products
            try {
                const response = await getExclusiveProducts(Martid);
                if (response.status === 200) {
                    console.log("ExclusiveProducts=>", response.data);
                    // setExclusive(response.data);
                    setExclusive([...response.data]);

                }
                else {
                    console.log('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
            // Getting Mart Data
            try {
                const response = await getMarts();
                console.log('Response Status:', response.status);
                if (response.status === 200) {
                    console.log('Request successful!', response.data);
                    setMartData(response.data);
                    console.log(martData);
                    if (response.data.length > 0) {
                        setSelectedMartName(response.data[0].name);
                    }
                }
                else {
                    console.error('Request failed.', response.data);
                }
            } catch (error) {
                console.error('Error during request:', error);
            } finally {
                setLoading(false);
            }
           
        };
        
        fetchData();
    }, [Martid]);
    const breakpoints = {
        480: {
            spaceBetween: 220,
            slidesPerView: 2
        },
        768: {
            spaceBetween: 30,
            slidesPerView: 2.5
        },
        1024: {
            spaceBetween: 20,
            slidesPerView: 2.5
        },
        1200: {
            slidesPerView: 5,
            spaceBetween: 20,
        },
    };
    // Handle mart change
    const handleSelectMart = (e, martName, martid) => {
        e.preventDefault();
        setMartid(martid);
        setSelectedMartName(martName);
        // Martid = martid;
        // getExclusiveProducts(Martid);
        // getMartCategories(Martid);
        setShowDropdown(false);
    };
    return (
        <div>
            {/* Navbar */}
            <div className='container'>
                <section className='section1'>
                    <div className="navbar" >
                        <div style={{ width: '35%' }}>
                            <a href="/">
                                <div className='divlogo'>
                                    <img className='logo' src='/Images/Logo.png' alt="Logo" />
                                </div>
                            </a>
                        </div>

                        <div className='navbar-components'>
                            <div>
                                <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
                                    <button className="dropbtn">{selectedMartName}<span className="arrow">&#9660;</span></button>
                                    {showDropdown && (
                                        <div className="dropdown-content">
                                            {martData && martData.map((mart, index) => (
                                                <a key={index}  onClick={(e) => handleSelectMart(e, mart.name, mart.inventory_id)}>
                                                    {mart.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Link to='/' ><img src='/Images/image.png' alt='' className='img-navbar' /> </Link>
                            </div>
                        </div>
                        {/* Over Flow menu */}
                        <div className="overflow-menu">
                            <div className="over-menu" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                                <GiHamburgerMenu size={30} />
                            </div>
                            {showMobileMenu && (
                                <div className='overflow-containers'>
                                    <div>All Categories</div>
                                    <div>Tezz Discounts & Offers</div>
                                    <div>Exclusive Offers</div>
                                    <div>Breakfast & Diary</div>
                                </div>
                            )}
                        </div>
                    </div>
                </section >
                <section className='section1'>
                    <div className='mob-dropdown'>
                        <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
                            <button className="dropbtn">{selectedMartName}<span className="arrow">&#9660;</span></button>
                            {showDropdown && (
                                <div className="dropdown-content">
                                    {martData && martData.map((mart, index) => (
                                        <a key={index} href="#" onClick={(e) => handleSelectMart(e, mart.name, mart.inventory_id)}>
                                            {mart.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div >
            <Container style={{ backgroundColor: '#4D5882' }} fluid >
                <section className='container'>
                    <div className='con-comp'>
                        <h6>All Categories</h6>
                        <h6>Tezz Discounts & Offers</h6>
                        <h6>Exclusive Offers</h6>
                        <h6>Breakfast & Diary</h6>
                    </div>
                </section>
            </Container>
            {/* Slider */}
            <Container fluid style={{ backgroundImage: 'url("/Images/Pattern.png")' }} className=' '>
                <section className="container " style={{ padding: '2rem 0' }} >
                    <TDSlider className="d-flex " />
                </section>
            </Container>
            {/* Marts */}
            <section className='container'>
                <div>
                    <div className=" marts_grid">
                        {martData && martData.map((item, index) => (
                            <Link to={`/TezDelivery?martId=${item.inventory_id}`} className="linkstyle" key={index}>
                                <div key={index}>
                                    <div className="marts_grid_item">
                                        <div className='mart-items'>
                                            <div className='mart' >
                                                <img src='/Images/shopicon.svg' alt='' size={24} />
                                            </div>
                                            <div>
                                                <h5 >{item.name}</h5>
                                                <span><MdLocationPin style={{ marginBottom: '-3px' }} size={16} /> Deliveing in</span>
                                                <p className='mart-location'>{item.location}</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            {/* Categories */}
            <section className="products_section container pt pb" style={{paddingBottom:'6rem'}}>
                <div className="pb heading-box">
                    <h5 className="main_heading ">Shop by Category</h5>
                    {/* <Link to={`/categories?martId=${Martid}`}><Button className="see-all">See all</Button></Link> */}
                </div>
                <div className="products_grid">
                    {DataProduct.slice(0, 10).map((item, index) => (
                        <Link to={`/TezDelivery?martId=1`} className="linkstyle" key={index}>
                            <div className={`products_grid_item ${item.index === 0 || item.index === 4 ? 'special_bg' : ''}`}>
                                {/* <img src={item.image} alt="img" /> */}
                                {imageLoading && <ClipLoader color={'#F17E2A'} loading={imageLoading} size={35} />}
                                <LazyLoad>
                                    <img
                                        src={item.image}
                                        alt='img'
                                        onLoad={() => setImageLoading(false)}
                                        style={{ display: imageLoading ? 'none' : 'block' }}
                                    />
                                </LazyLoad>
                                <p>{item.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            {/* Why you Choose Us */}
            <Container fluid className='ChooseUs-Section'>
                <section className="container " style={{ padding: '2rem 0' }} >
                    <div className='chooseus'>
                        <div class="choose-us-heading">
                            <h2>Why Choose Us?</h2>
                        </div>
                        <div class="choose-us-items pb">
                            <div class="item" >
                                <h6>Free Shipping</h6>
                                <span>Delivered in 60 minutes</span>
                            </div>
                            <div class="item" >
                                <h6>Money Back</h6>
                                <span>100% Money Back Guarentee</span>
                            </div>
                            <div class="item" >
                                <h6>Secure Payments</h6>
                                <span>100% Secure Payments</span>
                            </div>
                        </div>
                        <div class="choose-us-heading pb">
                            <h4 style={{ color: '#7c8081' }}>Thousands of healthy, fresh and delicious products delivered to your kitchen everyday</h4>
                        </div>
                        <div class="choose-us-heading">
                            <h1 >Get it TEZZ Now !</h1>
                        </div>
                    </div>
                </section>
            </Container>
            {/* Download app */}
            <Container style={{ backgroundColor: '#858ca9' }} fluid >
                <section className='container'>
                    <div className='download-comp'>
                        <h4>For Better Experience Download the App Now !</h4>
                        <div className='download-btns'>
                          <a href='https://apps.apple.com/eg/app/tezz-delivery/id1632938996'><img src='/Images/Appstore.png' alt='' className="img"  /></a>
                          <a href='https://play.google.com/store/apps/details?id=app.grocery.tezz'><img src='/Images/Playstore.png' alt='' className="img"  /></a>
                     </div>
                    </div>
                </section>
            </Container>
            {/* Exclusive Offers */}
            <section className="container pt pb">
                <div className="pb heading-box">
                    <h5 className="main_heading">Exclusive Offers</h5>

                    {/* <Link to="/Exclusive-offers"><Button className="see-all">See all</Button></Link> */}
                </div>
                {/* <div className="popular-exclusive"> */}
                <Swiper
                    modules={[Navigation, Pagination, A11y]}
                    // spaceBetween={230}
                    // slidesPerView={1.5}
                    grabCursor={true}
                    breakpoints={breakpoints}
                    // centeredSlides={true}
                    // loop={true}
                    navigation={false}
                    pagination={{ clickable: true, el: '' }}
                    className='swiper-container'
                    onSwiper={(swiper) => console.log(swiper)}
                    onSlideChange={() => console.log('slide change')}
                >
                    {ExclusiveOffers && ExclusiveOffers.map((item, i) => (
                        <SwiperSlide key={i} className="swiperslide" >
                            {/* <Link to={`/TezDelivery?martId=1`} className="linkstyle"> */}
                            <ExclusivePro
                                key={i}
                                id={item.id}
                                name={item.name}
                                image={item.image}
                                exclusivePrice={item.exclusivePrice}
                                price={item.price}
                            />
                            {/* </Link> */}
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* </div> */}
            </section>
            <Footer />
        </div >
    )
}

export default LandingPage

 
export const ExclusivePro = (props) => {
  return (
    <>
      <div className='Exclusive'>
        <div className='Exclusive_item'>
        <Link to={`/TezDelivery?martId=1`} className='linkstyle'>
          <div style={{display:'flex',justifyContent:'center'}}>
          <img src={props.image} alt='img' /> 
          </div>  
          <p className='Exclusive_itemp'>{props.name}</p>      
          </Link>
          {/* {showQuantityButtons ? (
            <div className='quantity-buttons'>
              <button className='button-1' onClick={decreaseQuantity}>-</button>
              <span>{quantity}</span>
              <button className='button-2' onClick={increaseQuantity}>+</button>
            </div>
          ) : ( */}
            <div className='prices'>
              <div className='Exclusive_old' style={{
                textDecoration: props.exclusivePrice ? 'line-through red' : 'none',
                fontSize: props.exclusivePrice ? '11px' : '14px',
                paddingBottom:props.exclusivePrice ? '0px':'10px'

              }}>
                Rs {props.price}
              </div>
              <div className='d-flex'>
                {props.exclusivePrice > 0 && (
                  <>
                    <div className='Exclusive_price-new'>
                      Rs {props.exclusivePrice}
                    </div>
                  </>
                )}
                <div className='addtocard-LP' >
                <Link to={`/TezDelivery?martId=1`} style={{textDecoration:'none',color:'white'}} >
                    <p className='addtocard-LP-p'>BUY NOW</p>
                </Link>
                </div>
              </div>
            </div>
          {/* )} */}
        </div>
      </div>
    </>
  )
}

