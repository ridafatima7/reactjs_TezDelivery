import React, { useEffect, useState } from 'react';
import TNavbar from './TNavbar';
import api from "./apis";
import { BsShop } from "react-icons/bs";
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Marts.css';
import Logo from './Images/Logo.jpg';
import { FaSearch } from "react-icons/fa";
import { RiMapPin2Fill } from 'react-icons/ri';
import { BsList } from "react-icons/bs";
import { Input,Button} from 'reactstrap';
const Marts = () => {
    const [martData, setMartData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${api}/get_marts`);
                console.log('Response Status:', response.status);
                if (response.status === 200) {
                    console.log('Request successful!', response.data);
                    setMartData(response.data.data);
                } 
                else
                 {
                    console.error('Request failed.', response.data);
                }
            } catch (error) {
                console.error('Error during request:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    return (
        <div>
            <section className='m-section1 pb'>
          <div className="m-navbar" >
            <div >
              <a href="/">
                <img className='mart-logo' src={Logo} alt="Logo" />
              </a>
            </div>
            <div className="m-central">
            <Input
              className="m-control"
              name="mart"
              placeholder="Search Mart"
            >
            </Input>
            <FaSearch className='m-icon' aria-hidden='true'/>
          </div>
       </div>
    </section >
            <section className='container'>
            <div className="m-section1 ">
          {/* <div> */}
            {/* <div className="div2">
              <Link to="/home"><BsList className="menubtn" /></Link>
            </div> */}
            {/* <div className="div3">
              <p className="para">Deliver to</p>
              <RiMapPin2Fill className='icon1' aria-hidden='true'/>
              <Input
                name="address"
                className=" m-location"
              />
            </div> */}
          {/* </div> */}
          
        </div>
            </section>
            {loading ? (
                // <p>Loading...</p>
               <>
                </>
            ) : (
                <section className='container'>
                    <div>
                    <div className=" marts_grid">
                        {martData.map((item, index) => (
                                <Link to={`/TezDelivery?martId=${item.inventory_id}`} className="linkstyle" key={index}>
                            <div key={index}>
                                <div className="marts_grid_item">
                                    <div className='mart-items'>
                                    <div className='mart' >
                                    <BsShop size={24} />
                                    </div>
                                    <div>
                                    <h5 >{item.name}</h5>
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
            )}
        </div>
    )
}

export default Marts
