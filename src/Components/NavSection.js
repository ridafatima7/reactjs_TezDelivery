import React, { useState, useEffect } from "react";
import { BsList } from "react-icons/bs";
import { BsShop } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import { FiShoppingBag } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { MdShoppingCartCheckout } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { RiMapPin2Fill } from "react-icons/ri";
import { SlWallet } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Row,
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Form,
  Alert,
} from "reactstrap";

import api from "./apis";

import "./TDnavbar.css";

const NavSection = ({
  search_Query = null,
  set_SearchQuery = null,
}) => {
  const [sidebar, setSidebar] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
  function EditInformation(e) {
    // e.preventDefault();
    // const disasterType=e.target.DisasterType.value;
    // const title=e.target.Title.value;
    // const Description=e.target.Description.value;
    // const area=e.target.area.value;
    // // const xcoordinates=e.target.xcoordinates.value;
    // // const ycoordinates=e.target.ycoordinates.value;
    // const population=parseInt(e.target.Population.value);
    // const survivors=parseInt(e.target.survivors.value);
    // const deaths=parseInt(e.target.deaths.value);
    // const date=e.target.date.value;
    // const shelters=parseInt(e.target.shelters.value);
    // const food=parseInt(e.target.food.value);
    // const medicine=parseInt(e.target.medicine.value);
    // // const gallery=e.target.gallery.value;
    // if( (survivors + deaths) > population || shelters>population )
    //  {
    //      if((survivors+population)> population){
    //        setIsCustomError(true);
    //       setErrorMessage("Survivors/deaths should not be greater than population !");
    //       setError(true);
    //       console.log("Survivors should not be greater than population !")
    //      }
    //     //  else if(deaths>population ){
    //     //   setIsCustomError(true);
    //     //   setErrorMessage("Deaths should not be greater than population !");
    //     //   setError(true);
    //     //  }
    //      else if(shelters>population)
    //      {
    //       setIsCustomError(true);
    //       setErrorMessage("Shelters should not be greater than population !");
    //       setError(true);
    //      }
    //     return;
    //  }
    // if(selectedFiles){
    //   selectedFiles.forEach((file) => {
    //   formData.append('files', file);
    //   });
    // }
    // else
    // {
    //   formData.append('files', []);
    // }
    // formData.append('disasterType', disasterType);
    // // formData.append('xcoordinates',xcoordinates );
    // // formData.append('ycoordinates',ycoordinates );
    // formData.append('Description',Description);
    // formData.append('population',population);
    // formData.append('title',title);
    // formData.append('id',id);
    // formData.append('area',area);
    // formData.append('date',date);
    // formData.append('survivors',survivors);
    // formData.append('deaths',deaths);
    // formData.append('shelters',shelters);
    // formData.append('food',food);
    // formData.append('medicine',medicine);
    // axios({
    //   withCredentials: true,
    //   method:'post',
    //   url:"http://localhost:8000/Information/EditInformation",
    //   // data:{id:id,disasterType:disasterType, title:title ,Description:Description, area:area, xcoordinates:xcoordinates,ycoordinates:ycoordinates,population:population
    //   //   ,survivors:survivors,deaths:deaths,date:date,shelters:shelters,food:food,medicine:medicine,gallery:gallery},
    //   data:formData,
    // })
    // .then(res=>{
    //   if(res.data == "success")
    //   {
    //     seteditSuccess(true);
    //     GetInformation();
    //     setRerender(!rerender);
    //   }
    //   else
    //   {
    //     setErrorMessage(res.data);
    //     setError(true);
    //   }
    //   setEditModal(!editmodal);
    // })
    // .catch(error=>{
    //   setErrorMessage("Failed to connect to backend");
    //   setError(true);
    //   console.log(error);
    // })
  }
  const edittoggle1 = (event) => {
    setEditModal(!editmodal);
  };
  useEffect(() => {
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

  // useEffect(() => {
  //   const filteredProducts = DataProduct.filter((product) =>
  //     product.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  //   setSearchedProducts(filteredProducts);
  // }, [DataProduct, searchQuery]);
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

  return (
    <>
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
                    <img
                      className="edit-img"
                      src="/Images/Avatar.png"
                      alt="Avatar Image"
                      onError={(e) => console.error("Image Error", e)}
                    ></img>
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
                      className="editpopup-input"
                      name="u_phone"
                      placeholder="Phone Num"
                      type="Num"
                      maxLength="50"
                      minLength="30"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="u_name"
                      className="editpopup-input"
                      name="u_name"
                      placeholder="Name"
                      type="text"
                      style={{ color: "black" }}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      id="Area"
                      name="email"
                      className="editpopup-input"
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
                      className="editpopup-input"
                      placeholder="House No"
                      type="text"
                      minLength="50"
                      style={{ color: "black" }}
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
                <Button>Login to Earn Rewards</Button>
                <div onClick={edittoggle1}>
                  <MdModeEditOutline
                    className="MdOutlineModeEdit-icon"
                    onClick={() => setEditProfile(true)}
                    size={18}
                  />
                </div>
              </div>
            </div>
            <div className="sidebar-items pt">
              <hr />
              <div>
                <BsShop size={28} />
                <span>Shop</span>
              </div>
              <hr />
              <div>
                <MdShoppingCartCheckout size={28} />
                <span>Additional Products</span>
              </div>
              <hr />
              <div>
                <FiShoppingBag size={28} />
                <span>My Orders</span>
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
