import React, { useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";
import { Button, Col, ModalHeader, Input, FormGroup,  Form} from 'reactstrap';
import { FiShoppingBag } from "react-icons/fi";
import { BsShop } from "react-icons/bs";
import { Link } from "react-router-dom";
import { MdShoppingCartCheckout } from "react-icons/md";
import { FiAlertCircle } from "react-icons/fi";
import { SlWallet } from "react-icons/sl";
import axios from 'axios';
import { MdModeEditOutline } from "react-icons/md";
import './TDnavbar.css';
import api from "./apis";
const Sidebar = (args) => {
  const [editProfile, setEditProfile] = useState(false);
  const storedMart = sessionStorage.getItem('mart_id');
  const formData = new FormData();
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const onDismissError = () => setError(false);
  const [id, setInformationid] = useState(null);
  const [editmodal, setEditModal] = useState(false);
  const onDismisseditSuccess = () => seteditSuccess(false);
  const [editsuccess, seteditSuccess] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const storedUserName = sessionStorage.getItem('userName');
  const storedPhoneNumber = sessionStorage.getItem('phoneNumber');
  console.log(storedUserName);
  console.log(storedPhoneNumber);
  alert('here');
  const edittoggle1 = (event) => {
    setEditModal(!editmodal);
  };
  const editModalClose = () => {
    setEditModal(!editmodal);
  }
  const  EditInformation = async(e) => {
    e.preventDefault();
    const staticData = {
      // "id": 9,
      "myCode": "E707",
      // "name": "Dashbaord Tester",
      "wallet": 300,
      // "address": "H9, Islamabad",
      "code": "E&h&",
      "promosAvailed": "",
      // "mobile": "03008304930",
      "customerNotes": "Rida Notes",
      "deviceToken": "dhvgbelejhe",
      "points": 20,
      "firebase_id": "250e47a3c949d3f0960f9d3e40ed14",
      "email": "rida-testing8@gmail.com",
      "status": "",
      "addedOn": "09/09/2023",
      "uniqueId": ""
    };
    const { myCode, wallet, code, promosAvailed, customerNotes, deviceToken, points, firebase_id, email, addedOn, uniqueId, status } = staticData;
    const user_name = e.target.u_name.value;
    const user_mob = e.target.u_phone.value;
    const user_email = e.target.email.value;
    const user_HouseNo = e.target.house.value;
    const user_StreetNo = e.target.Street.value;
    const user_FloorNo = e.target.Floor.value;
    const address = user_HouseNo + ' ' + user_StreetNo + ' ' + user_FloorNo;
   
    formData.append('name', user_name);
    formData.append('mobile', user_mob);
    formData.append('email', user_email);
    formData.append('address', address);
    formData.append('id', 9);
    formData.append('myCode', myCode);
    formData.append('wallet', wallet);
    formData.append('code', code);
    formData.append('promosAvailed', promosAvailed);
    formData.append('customerNotes', customerNotes);
    formData.append('deviceToken', deviceToken);
    formData.append('points', points);
    formData.append('firebase_id', firebase_id);
    formData.append('email', email);
    formData.append('addedOn', addedOn);
    formData.append('uniqueId', uniqueId);
    formData.append('status', status);
    // console.log(formData);
    try {
      const response = await axios.post(`${api}/update_customers`, formData, {
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      });
      // .then(response => {
      //   console.log('Response Status:', response.status);
      //   if (response.status === 200) {
      //     console.log('Update successful!', response.data);
      //   } else {
      //     console.error('Update failed.', response.data);
      //   }
      // })
      // .catch(error => {
      //   console.error('Error during update:', error);
      // });
      console.log('Response Status:', response.status);
    if (response.status === 200) {
      console.log('Update successful!', response.data);
    } else {
      console.log('Update failed with status:', response.status, 'and data:', response.data);
    }
  } catch (error) {
    console.error('Error during update:', error.response ? error.response.data : error.message);
  }

  };
  return (
    <>
      {editProfile && (
        <div className='editpopup-container'>
          <div className='editpopup'>
            <ModalHeader className='editpopup-heading'> Profile</ModalHeader>
            <span className='editclose-btn' onClick={() => setEditProfile(false)}>
              &times;
            </span>
            <Form  className='editpopup-form' >
              <div className='editRow'>
                <Col md={6}>
                  <FormGroup className='avatar'>
                    <img className='edit-img' src='/Images/Avatar.png' alt='Avatar Image' onError={(e) => console.error("Image Error", e)}></img>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="id"
                      className='editpopup-input'
                      name="id"
                      placeholder="info id"
                      type="hidden"
                      value={id}
                    />
                    <Input
                      id="u_phone"
                      className='editpopup-input'
                      name="u_phone"
                      type="Num"
                      value={storedPhoneNumber}
                      // maxLength="50"
                    // minLength="30"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="u_name"
                      className='editpopup-input'
                      name="u_name"
                      value={storedUserName}
                      type="text"
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
                      className='editpopup-input'
                      placeholder="Street Num"
                      type='number'
                      min="0"
                      max="1000000"
                      style={{ color: 'black' }}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="survivors"
                      name="Floor"
                      placeholder="Floor Num"
                      className='editpopup-input'
                      type='number'
                      min="0"
                      max="1000000"
                    //  style={{ color: 'black' }}
                    />
                  </FormGroup>
                </Col>
              </div>
              

            </Form>
            <Button color="primary" type="button" className='editpopup-button' onClick={EditInformation} >
                Update
              </Button>
          </div>
        </div>
      )}
      <section className='sidebar-container'>
        <div className='sidebar-body' >

          <div className='sidebar'>
            <div className='sidebar-components'>
              <IoIosArrowBack size={26} className='sidebar-components-icon' />
              <img src='/Images/Avatar.png' alt='Avatar Image' onError={(e) => console.error("Image Error", e)} />
              <Button >Login to Earn Rewards</Button>
              <div onClick={edittoggle1}>
                <MdModeEditOutline className='MdOutlineModeEdit-icon' onClick={() => setEditProfile(true)} size={18} />
              </div>
            </div>
          </div>
          <div className='sidebar-items pt'>
            <hr />
            <div>
              <Link to={`/TezDelivery?martId=${storedMart}`} className='Item-Link' >
                <BsShop size={28} />
                <span>Shop</span>
              </Link>
            </div>
            <hr />
            <div>
              <MdShoppingCartCheckout size={28} />
              <span>Additional Products</span>
            </div>
            <hr />
            <div>
              <Link to="/order" className='Item-Link'>
                <FiShoppingBag size={28} />
                <span>My Orders</span>
              </Link>
            </div>
            <hr />
            <div>
              <SlWallet size={28} />
              <span>Wallet & promos</span>
            </div>
            <hr />
            <div>
              <FiAlertCircle size={28} />
              <span>AboutUs</span>
            </div>
            <hr />
          </div>

        </div>
      </section>
    </>


    // </div>
  )
}

export default Sidebar
