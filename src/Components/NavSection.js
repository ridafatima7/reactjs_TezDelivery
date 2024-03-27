import React, { useState, useEffect } from "react";
import { BsShop } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { FiShoppingBag } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { MdShoppingCartCheckout } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { SlWallet } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import { GoSignOut } from "react-icons/go";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import {
  Button,
  Col,
  ModalHeader,
  Input,
  FormGroup,
  Form,
} from "reactstrap";
import api from "./apis";
import "./TDnavbar.css";
import { Update_customer } from "../Server";
import TNavbar from "./TNavbar";
import Footer from "./Footer";
const NavSection = ({
  search_Query = null,
  set_SearchQuery = null,
}) => {
  const storedUserName = sessionStorage.getItem('userName');
  const storedPhoneNumber = sessionStorage.getItem('phoneNumber');
  const [phoneNumber, setPhoneNumber] = useState(storedPhoneNumber);
  const [editUserName, setEditUserName] = useState(storedUserName);
  const handleChange = (event) => {
    setPhoneNumber(event.target.value);
  };
  const handleNameChange = (event) => {
    setEditUserName(event.target.value);
  };
  const [sidebar, setSidebar] = useState(false);
  const [logedIn, setLogedIn] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [showLoginPromo,setShowLoginPromo]=useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState('/Images/Avatar.png');
  const [error, setError] = useState(false);
  const onDismissError = () => setError(false);
  const [id, setInformationid] = useState(null);
  const [editmodal, setEditModal] = useState(false);
  const onDismisseditSuccess = () => seteditSuccess(false);
  const [editsuccess, seteditSuccess] = useState(false);
  const [modal, setModal] = useState(false);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const Martid = params.get("martId");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const navigate = useNavigate();
  const [DataProduct, setData] = useState([]);
  const handleSearchInputChange = (event) => {
    console.log("search=>", search_Query);
    set_SearchQuery && set_SearchQuery(event.target.value);
  };
  const EditInformation = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("form is submitted.");
    const formData = new FormData();
    const staticData = {
      "myCode": "E707",
      "wallet": 300,
      "code": "E&h&",
      "promosAvailed": "",
      "customerNotes": "Rida Notes",
      "deviceToken": "dhvgbelejhe",
      "points": 20,
      "firebase_id": "250e47a3c949d3f0960f9d3e40ed14",
      "mobile": "03008304930",
      "address": "H9, Islamabad",
      // "name": "Dashbaord Tester",
      "id": 9,
      // "email": "rida-testing8@gmail.com",
      "status": "",
      "addedOn": "09/09/2023",
      "uniqueId": ""
    };
    const { myCode, wallet, code, promosAvailed, address, customerNotes, deviceToken, points, firebase_id, addedOn, uniqueId, status } = staticData;
    const user_name = editUserName;
    const user_mob = phoneNumber;
    const user_email = e.target.email.value;
    const user_HouseNo = e.target.house.value;
    const user_StreetNo = e.target.Street.value;
    const user_FloorNo = e.target.Floor.value;
    // const address = user_HouseNo + ' ' + user_StreetNo + ' ' + user_FloorNo;
    formData.append('name', user_name);
    formData.append('mobile', user_mob);
    formData.append('email', user_email);
    formData.append('address', address);
    formData.append('id', 9);
    formData.append('myCode', myCode);
    formData.append('wallet', wallet);
    formData.append('code', code);
    formData.append('houseNum', user_HouseNo);
    formData.append('streetNum', user_StreetNo);
    formData.append('floorNum', user_FloorNo);
    console.log(formData.get('floorNum'));
    formData.append('promosAvailed', promosAvailed);
    formData.append('customerNotes', customerNotes);
    formData.append('deviceToken', deviceToken);
    formData.append('points', points);
    formData.append('firebase_id', firebase_id);
    formData.append('email', user_email);
    formData.append('addedOn', addedOn);
    formData.append('uniqueId', uniqueId);
    formData.append('status', status);
    const profilePhotoFile = profilePhoto;
    if (profilePhotoFile) {
      formData.append('image', profilePhotoFile);
    }
    console.log(formData.get('image'));
    const formDataToJSON = async (formData) => {
      const json = {};
      for (let [key, value] of formData.entries()) {
        json[key] = value;
      }
      return json;
    };
    const data = await formDataToJSON(formData);

    console.log(formData);
    try {
      const response = await Update_customer(data);
      console.log('Response Status:', response.status);
      if (response.status === 200) {
        console.log('Update successful!', response.data);
        sessionStorage.setItem('userName', user_name);
        sessionStorage.setItem('email', user_email);
        sessionStorage.setItem('phoneNumber', user_mob);
        setEditProfile(false);
      } else {
        console.log('Update failed with status:', response.status, 'and data:', response.data);
      }
    } catch (error) {
      console.error('Error during update:', error.response ? error.response.data : error.message);
    }
  }
  const edittoggle1 = (event) => {
    setEditModal(!editmodal);
  };
  useEffect(() => {
    const storedUserName = sessionStorage.getItem('userName');
    if (storedUserName) {
      setLogedIn(true);
    }
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${api}/get_martCategories?mart_id=${Martid}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        const filtered = result.data.filter((product) =>
          product.name.toLowerCase().includes(search_Query.toLowerCase())
        );
        //setFilteredProducts(filtered);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [searchQuery]);
  const handleInputClick = () => {
    navigate(`/searchProduct?martId=${Martid}`);
  };
  const searched_products = async () => {
    try {
      const response = await fetch(`${api}/get_martProducts?mart_id=${Martid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      setData(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    uploadProfilePhoto(file);
  };
  const uploadProfilePhoto = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setProfilePhoto(imageUrl);
  };
  const handleWalletLogin = () => {
     setShowLoginPromo(false);
     navigate('/login');
  }
  const handleLinkClick = (e) => {
    if (!logedIn) {
      e.preventDefault(); 
      setSidebar(false);
      setShowLoginPromo(true);   
    }
  };
  return (
    <>
      {showLoginPromo && (
        <>
          <div className='promo-container'>
            <div className='promo-popup'>
              <div className='promo-close'>
                <span className='promo-close-btn' onClick={() => setShowLoginPromo(!showLoginPromo)}>
                  &times;
                </span>
              </div>
              <h3 className='promo-label'>Login Required</h3>
              <h3 className='promo-label2'>You need to login first</h3>
              <button onClick={handleWalletLogin} className='continue'>OK</button>
            </div>
          </div>
        </>
      )}
      {editProfile && (
        <div className="editpopup-container">
          <div className="editpopup">
            <ModalHeader className="editpopup-heading">
              Update Profile
            </ModalHeader>
            <span
              className="editclose-btn"
              onClick={() => setEditProfile(false)}
            >
              &times;
            </span>
            <Form
              role="form"
              className="editpopup-form"
              onSubmit={EditInformation}
            >
              <div className="editRow">
                <Col md={6}>
                  <FormGroup className="avatar">
                    <div className="profile-photo-container">
                      <img
                        className="profile-photo"
                        src={profilePhoto}
                        alt="Avatar Image"
                        onError={(e) => console.error("Image Error", e)}
                      />
                      <label htmlFor="photo-input" >
                        <div className="edit-icon">
                          <MdModeEdit size={14} />
                        </div>
                      </label>
                      <input
                        id="photo-input"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="id"
                      className="editpopup-input"
                      name="id"
                      placeholder="info id"
                      type="hidden"
                      value={id}
                    />
                    <Input
                      id="u_phone"
                      className='editpopup-input'
                      name="u_phone"
                      placeholder="Phone Number"
                      type="Num"
                      value={phoneNumber}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="u_name"
                      className='editpopup-input'
                      name="u_name"
                      placeholder="Name"
                      type="text"
                      value={editUserName}
                      onChange={handleNameChange}
                      style={{ color: 'black' }}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="email"
                      name="email"
                      className='editpopup-input'
                      placeholder="Email"
                      type="text"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>

                    <Input
                      id="Description"
                      name="house"
                      className='editpopup-input'
                      placeholder="House No"
                      type="text"
                      style={{ color: 'black' }}
                    />
                  </FormGroup>
                </Col>
              </div>
              <div>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="Population"
                      name="Street"
                      className="editpopup-input"
                      placeholder="Street Num"
                      type="number"
                      min="0"
                      max="1000000"
                      style={{ color: "black" }}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="survivors"
                      name="Floor"
                      placeholder="Floor Num"
                      className="editpopup-input"
                      type="number"
                      min="0"
                      max="1000000"
                    //  style={{ color: 'black' }}
                    />
                  </FormGroup>
                </Col>
              </div>
              <Button
                color="primary"
                type="submit"
                className="editpopup-button"
              >
                Update
              </Button>
            </Form>
          </div>
        </div>
      )}
      {sidebar && (
        <section className="sidebar-container">
          <div className="sidebar-body">
            <div className="sidebar">
              <div className="sidebar-components">
                <IoIosArrowBack
                  size={26}
                  className="sidebar-components-icon"
                  onClick={() => setSidebar(false)}
                />
                <img
                  src="/Images/Avatar.png"
                  alt="Avatar Image"
                  onError={(e) => console.error("Image Error", e)}
                />
                {storedUserName ? (
                  <div className="user_name">{storedUserName}</div>
                ) : (
                  <Link to='/login'><Button>Login to Earn Rewards</Button></Link>
                )}
                {storedUserName ? (
                  <>
                    <div onClick={edittoggle1} style={{ display: 'flex', alignItems: "center" }}>
                      <MdModeEditOutline
                        className="MdOutlineModeEdit-icon"
                        onClick={() => setEditProfile(true)}
                        size={18}
                      />
                    </div>
                  </>
                ) :
                  (
                    <></>
                  )}
              </div>
            </div>
            <div className="sidebar-items pt">
              <hr />
              <div>
                <Link to='/' className="nav-linkstyle">
                  <BsShop size={28} />
                  <span>Shop</span>
                </Link>
              </div>
              <hr />
              <div>
                <Link to='/additionalproducts' className="nav-linkstyle">
                  <MdShoppingCartCheckout size={28} />
                  <span>Additional Products</span>
                </Link>
              </div>
              <hr />
              <div>
                <Link to='/order' className="nav-linkstyle">
                  <FiShoppingBag size={28} />
                  <span>My Orders</span>
                </Link>
              </div>
              <hr />
              <div onClick={handleLinkClick}>
                <Link to={logedIn ? '/walletandpromos' : '#'} className="nav-linkstyle">
                  <SlWallet size={28} />
                  <span>Wallet & promos</span>
                </Link>
              </div>
              <hr />
              <div>
                <Link to='/aboutus' className="nav-linkstyle">
                  <FiAlertCircle size={28} />
                  <span>AboutUs</span>
                </Link>
              </div>
              <hr />
              <div>
                <Link to='/aboutus' className="nav-linkstyle">
                  <MdOutlinePrivacyTip size={28} />
                  <span>Privacy Policy</span>
                </Link>
              </div>
              <hr />
              {storedUserName ? (
                // <Link to='/login' >
                <Button className="logout-btn"><GoSignOut size={25} style={{ marginRight: '5px' }} /> Logout</Button>
                // </Link>
              ) : (
                <div ></div>
              )}
            </div>
          </div>
        </section>
      )}
      <div className="container">
        <section>
          <div className="section1 ">
            <div className="over-flow">
              <GiHamburgerMenu
                size={22}
                color="#7E7E7E"
                onClick={() => setSidebar(true)}
              />
            </div>
            <div className="central">
              <Input
                className="control"
                name="mart"
                placeholder="Search from Mart"
                value={search_Query}
                onChange={(e) => handleSearchInputChange(e)}
                onClick={handleInputClick}
              ></Input>
              <FaSearch className="icon" aria-hidden="true" />
              <Link to="/login">
                <Button className="dbtn">Login</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NavSection;

