import React,{useState,useEffect} from 'react';
import { FaSearch } from "react-icons/fa";
import { Input,Button,Container} from 'reactstrap';
import { getMarts } from "../../Server";
const LandingNavbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedMartName, setSelectedMartName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [martData, setMartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
    const handleSelectMart = (e, martName, martid) => {
        e.preventDefault();
        setSelectedMartName(martName);
        Martid = martid;
        // getExclusiveProducts(Martid);
        // getMartCategories(Martid);
        setShowDropdown(false);
    };
    let Martid = '1';
    useEffect(() => {

        const fetchData = async () => {
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
    }, []);
    return (
        <>
            
        </>
    )
}

export default LandingNavbar
