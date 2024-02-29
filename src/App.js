import { useState,useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./Components/AboutUs";
import Cart from "./Components/Cart";
import Categories from "./Components/Categories";
import Category from "./Components/Category";
import Checkout from "./Components/Checkout";
import ExclusiveScreen from "./Components/ExclusiveScreen";
import Gmaps from "./Components/Gmaps";
import Loader from "./Components/Loader";
import Login from "./Components/Login";
import Maps from "./Components/Maps";
import Marts from "./Components/Marts";
import Order from "./Components/Order";
import Product from "./Components/Product";
import SearchProducts from "./Components/SearchProducts";
import SellingScreen from "./Components/SellingScreen";
import Sidebar from "./Components/Sidebar";
import TezDelivery from "./Components/TezDelivery";
import "./App.css";
function App() {
  const [loading,setLoading]=useState(false);
  useEffect(()=>{
    setLoading(true);
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
          <Route path="/" element={<Marts />} />
            <Route path="/TezDelivery" element={<TezDelivery />} />
            <Route path="/order" element={<Order />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/home" element={<Sidebar/>} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/sidebar" element={<Sidebar/>} />
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
