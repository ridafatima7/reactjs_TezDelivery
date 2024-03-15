import React,{useState,useEffect} from 'react';
import { FiMenu } from "react-icons/fi";
import {Link} from 'react-router-dom';
import { getMartCategories, getExclusiveProducts, getMarts } from "../../Server";
import Footer from '../Footer';
const TestNavbar = () => {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
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
    let storedMart='';
    const [isCollapsed, setIsCollapsed] = useState(true);
    const toggleNavbar = () => setIsCollapsed(!isCollapsed);
    const handleSelectMart = (e, martName, martid) => {
        e.preventDefault();
        setMartid(martid);
        setSelectedMartName(martName);
        // Martid = martid;
        // getExclusiveProducts(Martid);
        // getMartCategories(Martid);
        setShowDropdown(false);
    };
    useEffect(() => {

        const fetchData = async () => {
            // Getting mart categories
            storedMart=sessionStorage.setItem('mart_id', Martid);
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
  return ( 
    <>
   
    <nav className="navbar-n">
     <img className='navbar-brand' src='/Images/Logo.png' alt="Logo" />
    <button className="navbar-toggler" onClick={toggleNavbar}>
        <span className="toggler-icon"><FiMenu /></span>
    </button>
    <div className={`navbar-menu ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <div className="additional-links">
            <div className='expanded-container'>
            <Link to=''  className="nav-link">All Categories</Link>
            <Link to='' className="nav-link">Tezz Discounts & Offers</Link>
            <Link to='' className="nav-link">Exclusive Offers</Link>
            <Link to='' className="nav-link">Breakfast & Diary</Link>
            </div>          
        </div>
        </div>
        <div className={`navbar-menu ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <div style={{display: 'flex', gap:'10px'}}>

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
        <div>
            <Link to="https://play.google.com/store/apps/details?id=app.grocery.tezz">
                <img src="/Images/image.png" alt="" className="img-navbar" />
            </Link>
        </div>
    </div>
</div>
    </nav>
   
  <Footer />
    </>
    
    // <div className='container'>
    // <section className='section1'>
    //     <div className="navbar" >
    //         <div style={{ width: '35%' }}>
    //             <a href="/">
    //                 <div className='divlogo'>
    //                     <img className='logo' src='/Images/Logo.png' alt="Logo" />
    //                 </div>
    //             </a>
    //         </div>

    //         <div className='navbar-components'>
    //             <div>
    //                 <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
    //                     <button className="dropbtn">{selectedMartName}<span className="arrow">&#9660;</span></button>
    //                     {showDropdown && (
    //                         <div className="dropdown-content">
    //                             {martData && martData.map((mart, index) => (
    //                                 <a key={index}  onClick={(e) => handleSelectMart(e, mart.name, mart.inventory_id)}>
    //                                     {mart.name}
    //                                 </a>
    //                             ))}
    //                         </div>
    //                     )}
    //                 </div>
    //             </div>
    //             <div>
    //                 <Link to='https://play.google.com/store/apps/details?id=app.grocery.tezz' ><img src='/Images/image.png' alt='' className='img-navbar' /> </Link>
    //             </div>
    //         </div>
    //         {/* Over Flow menu */}
    //         <div className="overflow-menu">
    //             <div className="over-menu" onClick={() => setShowMobileMenu(!showMobileMenu)}>
    //                 <GiHamburgerMenu size={30} />
    //             </div>
    //             {showMobileMenu && (
    //                 <div className='overflow-containers'>
    //                     <div>All Categories</div>
    //                     <div>Tezz Discounts & Offers</div>
    //                     <div>Exclusive Offers</div>
    //                     <div>Breakfast & Diary</div>
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // </section >
    // <section className='section1'>
    //     <div className='mob-dropdown'>
    //         <div className="dropdown" onClick={() => setShowDropdown(!showDropdown)}>
    //             <button className="dropbtn">{selectedMartName}<span className="arrow">&#9660;</span></button>
    //             {showDropdown && (
    //                 <div className="dropdown-content">
    //                     {martData && martData.map((mart, index) => (
    //                         <a key={index} href="#" onClick={(e) => handleSelectMart(e, mart.name, mart.inventory_id)}>
    //                             {mart.name}
    //                         </a>
    //                     ))}
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // </section>
    // </div >
  )
}

export default TestNavbar
