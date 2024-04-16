import React, { useState, useEffect, useRef } from 'react';
import Footer from "../Footer";
import TDSlider from "../TDSlider";
import { FiMenu } from "react-icons/fi";
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
import ReactPlayer from 'react-player';
import ModalVideo from 'react-modal-video';
import { Button, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Exclusive from "../Exclusive";
import { FaPlayCircle } from 'react-icons/fa';
import { MdLocationPin } from "react-icons/md";
import { getMartCategories, getExclusiveProducts, getMarts } from "../../Server";
import LandingNavbar from './LandingNavbar';
import './LandingPage.css';
const LandingPage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };

    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [DataProduct, setData] = useState([]);
    const [martData, setMartData] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);
    const [ExclusiveOffers, setExclusive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedMartName, setSelectedMartName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [Martid, setMartid] = useState(1);
    sessionStorage.setItem('mart_id', Martid);
    const text = "We pick up your goods from our partner marts and never charge above the store price.";
    const [isCollapsed, setIsCollapsed] = useState(true);
    const toggleNavbar = () => setIsCollapsed(!isCollapsed);
    const truncatedText = text.length > 127 ? text.substring(0, 127) + '...' : text;
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
    const handleItemClick = (e) => {
        console.log('Clicked item:', e.target.textContent);
    };
    let storedMart = "";
    useEffect(() => {

        const fetchData = async () => {
            // Getting mart categories
            storedMart = sessionStorage.setItem('mart_id', Martid);
            setMartid(Martid);
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
        300: {
            spaceBetween: 20,
            slidesPerView: 1.5
        },
        480: {
            spaceBetween: 20,
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
                {/* <section className='section1'>
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
                                                <a key={index} onClick={(e) => handleSelectMart(e, mart.name, mart.inventory_id)}>
                                                    {mart.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Link to='https://play.google.com/store/apps/details?id=app.grocery.tezz' ><img src='/Images/image.png' alt='' className='img-navbar' /> </Link>
                            </div>
                        </div>
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
                </section > */}
                <nav className="navbar-n">
                    <img className='navbar-brand' src='/Images/Logo.png' alt="Logo" />
                    <div>
                        <button className="navbar-toggler" onClick={toggleNavbar}>
                            <span className="toggler-icon"><GiHamburgerMenu /></span>
                        </button>


                        <div className={`navbar-menu ${isCollapsed ? 'collapsed' : 'expanded display-class'}`}  >
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="dropdown1" onClick={() => setShowDropdown(!showDropdown)}>
                                    <button className="dropbtn1">{selectedMartName}<span className="arrow">&#9660;</span></button>
                                    {showDropdown && (
                                        <div className="dropdown-content1">
                                            {martData && martData.map((mart, index) => (
                                                <a key={index} onClick={(e) => handleSelectMart(e, mart.name, mart.inventory_id)}>
                                                    {mart.name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <a href="#download-app-section">
                                        <img src="/Images/image.png" alt="" className="img-navbar" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className={`navbar-menu ${isCollapsed ? 'collapsed' : 'expanded'}`} >
                    <div className="additional-links">
                        <div className='expanded-container'>
                            <a href='/categories' className='anchor-style'><h6>All Categories</h6></a>
                            <a href='#why-choose-us' className='anchor-style'><h6 >Why Choose Us</h6></a>
                            <a href='#exclusive-offers' className='anchor-style'><h6>Exclusive Offers</h6></a>
                            <a href='#why-choose' className='anchor-style'><h6>Why Choose Us</h6></a>
                        </div>
                    </div>
                </div>
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
            </div>
            <Container style={{ backgroundColor: '#4D5882' }} fluid >
                <section className='container'>
                    <div className='con-comp'>
                        <a href='/categories' className='anchor-style'><h6>All Categories</h6></a>
                        <a href='#why-choose-us' className='anchor-style'><h6 >Why Choose Us</h6></a>
                        <a href='#exclusive-offers' className='anchor-style'><h6>Exclusive Offers</h6></a>
                        <a href='#why-choose' className='anchor-style'><h6>Why Choose Us</h6></a>
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
                                                <span><MdLocationPin style={{ marginBottom: '-3px' }} size={16} />Delivering in</span>
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
            {/* Exclusive Offers */}
            <section className="container pt pb" id='exclusive-offers'>
                <div className="pb heading-box">
                    <h2 className="main_heading">Exclusive Offers</h2>
                    <Link to="/Exclusive-offers"><Button className="see-all">See all</Button></Link>
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
                            {console.log(storedMart)}
                            <Link to={`/product_detail?martId=${Martid}&productId=${item.id}`} className='linkstyle'>
                                <ExclusivePro
                                    key={i}
                                    id={item.id}
                                    name={item.name}
                                    image={item.image}
                                    exclusivePrice={item.exclusivePrice}
                                    price={item.price}
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* </div> */}
            </section>
            {/* Why you Choose Us (images section ) */}
            <Container fluid className='ChooseUs-SectionImg'>
                <section className="container " style={{ padding: '2rem 0' }} id='why-choose-us'>
                    <div className='chooseusImg'>
                        <div class="choose-us-heading">
                            <h2>Why Choose Us?</h2>
                        </div>
                        <div class="choose-us-tagline pb">
                            <p style={{ color: '#7c8081' }}>Thousands of healthy, fresh and delicious products delivered to your kitchen everyday</p>
                        </div>
                        <div className="features">
                            <div className="feature-item">
                                <img src="/Images/freeDelivery.jpeg" alt="" />
                                <h6>Free Shipping</h6>
                                <p>We provide free deliver in less than 2 hours to our service </p>
                            </div>
                            <div className="feature-item">
                                <img src="/Images/save.jpeg" alt="" />
                                <h6>Simplify your Life </h6>
                                <p>Never visit a store again because we provide all your favourite brands, at store prices and with free delivery.</p>
                            </div>
                            <div className="feature-item">
                                <img src="/Images/FreshVeges.jpeg" alt="" />
                                <h6>Competitive Prices</h6>
                                <p>{truncatedText}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Container>
            {/* Categories */}
            <section className="products_section container pt pb">
                <div className="pb heading-box">
                    <h2 className="main_heading ">Shop by Category</h2>
                    <Link to={`/categories?martId=${Martid}`}><Button className="see-all">See all</Button></Link>
                </div>
                <div className="products_grid">
                    {DataProduct.slice(0, 10).map((item, index) => (
                        <Link to={`/categories_page?martId=${Martid}&categoryId=${item.cid}`} className="linkstyle" key={index}>
                            <div className={`products_grid_item ${item.index === 0 || item.index === 4 ? 'special_bg' : ''}`}>
                                {/* <img src={item.image} alt="img" /> */}
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {imageLoading && <ClipLoader className='rounded-loader' color={'#F17E2A'} loading={imageLoading} size={35} />}
                                </div>
                                <LazyLoad>
                                    <img
                                        src={item.image}
                                        alt='img'
                                        onLoad={() => setImageLoading(false)}
                                        style={{ display: imageLoading ? 'none' : 'block' }}
                                    />
                                </LazyLoad>
                                <h6>{item.name}</h6>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            {/* Download app */}
            <Container style={{ backgroundColor: '#858ca9' }} fluid >
                <section className='container' id="download-app-section">
                    <div className='download-comp'>
                        <h4>For Better Experience Download the App Now !</h4>
                        <div className='download-btns'>
                            <a href='https://apps.apple.com/eg/app/tezz-delivery/id1632938996'><img src='/Images/Appstore.png' alt='' className="img" /></a>
                            <a href='https://play.google.com/store/apps/details?id=app.grocery.tezz'><img src='/Images/Playstore.png' alt='' className="img" /></a>
                        </div>
                    </div>
                </section>
            </Container>
            {/* Why you Choose Us */}
            {modalIsOpen && (
                <div className="video-modal">
                    <div className="video-modal-content">
                        <span className="video-close" onClick={toggleModal}>&times;</span>
                        <video style={{ width: '100%' }} src='/Images/videoplayback.mp4' controls autoPlay />
                    </div>
                </div>
            )}
            <Container fluid className='ChooseUs-Section'>
                <section className="container " style={{ padding: '2rem 0' }} id='why-choose'>
                    <div className='chooseus'>
                        <div class="choose-us-heading">
                            <h2>Why Choose Us?</h2>
                        </div>
                        <div class="choose-us-tagline pb">
                            <p style={{ color: '#7c8081' }}>Thousands of healthy, fresh and delicious products delivered to your kitchen everyday</p>
                        </div>
                        <div className="features">

                            <div className="feature-item">
                                <img src="/Images/TDimg1.jpeg" alt="" />
                                <h6>Free Shipping</h6>
                                <p>The happier you are, the more you order, the more we are able to give to the community</p>
                            </div>
                            <div className="feature-item">
                                <div className="video-thumbnail" onClick={toggleModal}>
                                    <img src="/Images/TDimg2.jpeg" alt=""  style={{opacity:"0.8"}} />
                                    <FaPlayCircle className="play-icon" style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        color: 'white',
                                        opacity:3,
                                        fontSize: '3em' 
                                    }} />
                                </div>
                                <h6>Simplify your Life</h6>
                                <p>We actively provide rations and cooked food to the undeserved, as well as widows and orphans development organisations</p>
                            </div>
                            <div className="feature-item">
                            {/* <video  src='/Images/videoplayback.mp4' controls autoPlay /> */}
                                <img src="/Images/TDimg3.jpeg" alt="" /> 
                                <h6>Competitive Prices</h6>
                                <p>TD is an equal opportunity employer that encourages staff to upskill and elevate at work and society</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Container>

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
                    {/* <Link to={`https://tezzdelivery.com/#/product_detail?martId=${storedMart}&productId=${props.pid}`} className='linkstyle'> */}
                    <div style={{ display: 'flex', justifyContent: 'center', width: '120px' }}>
                        <img src={props.image} alt='img' />
                    </div>
                    <h6 className='Exclusive_itemp'>{props.name}</h6>
                    {/* </Link> */}
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
                            paddingBottom: props.exclusivePrice ? '0px' : '10px'

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
                                {/* <Link to={`/TezDelivery?martId=1`} style={{textDecoration:'none',color:'white'}} > */}
                                <p className='addtocard-LP-p'>BUY NOW</p>
                                {/* </Link> */}
                            </div>
                        </div>
                    </div>
                    {/* )} */}
                </div>
            </div>
        </>
    )
}

