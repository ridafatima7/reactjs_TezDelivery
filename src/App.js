import { useState,useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AboutUs, { Privacy_Policy } from "./Components/AboutUs";
import Cart from "./Components/Cart";
import {AdditionalProducts} from "./Components/Cart";
import Categories from "./Components/Categories";
import Category from "./Components/Category";
import Checkout, { Location, OrderPlaced } from "./Components/Checkout";
import { WalletandPromos} from "./Components/Checkout";
import ExclusiveScreen from "./Components/ExclusiveScreen";
import Gmaps from "./Components/Gmaps";
import LandingPage from "./Components/LandingPageFiles/LandingPage";
import Loader from "./Components/Loader";
import Login, { OTPScreen } from "./Components/Login";
import Maps from "./Components/Maps";
import Order, { ScheduleOrder } from "./Components/Order";
import Product from "./Components/Product";
import SearchProducts from "./Components/SearchProducts";
import SellingScreen from "./Components/SellingScreen";
import Sidebar from "./Components/Sidebar";
import TezDelivery from "./Components/TezDelivery";
import Tracking from "./Components/Tracking";

import "./App.css";

function App() {
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    //setLoading(true);
    setTimeout(()=>{
      setLoading(false);
    },1000)
  },[])
  return (
      <div className="App">
      {loading ? (
        <Loader />
         ) : ( 
          <>
         <BrowserRouter>
          <Routes>
          <Route path="/" element={<LandingPage />} />
            <Route path="/TezDelivery" element={<TezDelivery />} />
            <Route path="/order" element={<Order />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/login" element={<Login />} />
            <Route path='/walletandpromos' element={<WalletandPromos />} />
            <Route path="/additionalproducts" element={<AdditionalProducts />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/home" element={<Sidebar/>} />
            <Route path="/order-placed" element={<OrderPlaced/>} />
            <Route path="/order-scheduled" element={<ScheduleOrder/>} />
            <Route path="/edit-location" element={<Location/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/privacy-policy" element={<Privacy_Policy/>} />
            <Route path="/sidebar" element={<Sidebar/>} />
            <Route path="/maps" element={<Gmaps/>} />
            <Route path="/landing-page" element={<LandingPage/>} />
            <Route path="/categories" element={<Category />}></Route>
            <Route path="/categories_page" element={<Categories />} />
            <Route path="/product_detail" element={<Product />}></Route>
            <Route path="/aboutus" element={<AboutUs />}></Route>
            <Route path="/searchProduct" element={<SearchProducts />}></Route>
            <Route path="/Exclusive-offers" element={<ExclusiveScreen />}></Route>
            <Route path="/most-selling-offers" element={<SellingScreen />}></Route>
          </Routes>
        </BrowserRouter> 
        </>
       )}
    </div>
  );
}
export default App;
