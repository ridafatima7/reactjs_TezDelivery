import axios from "axios";
const API_BASE_URL = "https://old.tezzdelivery.com/td_api_test";
//    Fetching mart categories
export async function getMartCategories(mart_id, cid, limit, skip) {
  try {
    let url = `${API_BASE_URL}/get_martCategories?mart_id=${mart_id}`;
    if (cid) {
      url += `&cid=${cid}`;
    }
    if (limit) {
      url += `&limit=${limit}`;
    }
    if (skip) {
      url += `&skip=${skip}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Fetching Eclusive Products
export async function getExclusiveProducts(Martid, limit, skip) {
  try {
    let url = `${API_BASE_URL}/get_martProducts?mart_id=${Martid}&exclusive=true`;
    if (typeof limit !== 'undefined') {
      url += `&limit=${limit}`
    }
    else {
      url += `&limit=10`   // For Slider of Exclusive Products on homePage
    }
    if (typeof skip !== 'undefined') {
      url += `&skip=${skip}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Fetching MostSelling Products
export async function getMostSellingProducts(Martid, limit, skip) {
  try {
    let url = `${API_BASE_URL}/get_martProducts?mart_id=${Martid}&most_selling=true`;
    if (typeof limit !== 'undefined') {
      url += `&limit=${limit}`
    }
    else {
      url += `&limit=10`   // For Slider of Selling Products  on homePage and for Recommendations on Product Page
    }
    if (typeof skip !== 'undefined') {
      url += `&skip=${skip}`;
    }
    console.log(url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Fetching Marts
export async function getMarts(Martid) {
  try {
    let url = `${API_BASE_URL}/get_marts?active=true`;
    if (Martid) {
      url += `&mart_id=${Martid}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Fetch Sliders
export async function getSliders() {
  try {
    const url = `${API_BASE_URL}/get_sliders`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Fetch Mart Products
export async function getMartProducts(Martid, cid, sid, limit, skip,pid) {
  try {
    let url = `${API_BASE_URL}/get_martProducts?mart_id=${Martid}`;
    if (sid) {
      url += `&sid=${sid}`;
    }
    if (typeof cid !=='undefined') {
      url += `&cid=${cid}`;
    }
    if (typeof limit !== 'undefined') {
      url += `&limit=${limit}`
    }
    if (typeof skip !== 'undefined') {
      url += `&skip=${skip}`;
    }
    if(typeof pid !=='undefined'){
      url+=`&pid=${pid}`;
    }
    console.log(url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Fetch My-Orders
export async function getMyOrders() {
  try {
    const url = `${API_BASE_URL}/get_ordersList?customer_id=101338101135977459288`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
//Fetch Searched_Product
export async function getSearchProducts(Martid, key, limit, skip) {
  try {
    let url = `${API_BASE_URL}/get_searched_Products?mart_id=${Martid}&key=${key}`;
    if (typeof limit !== 'undefined') {
      url += `&limit=${limit}`
    }
    if (typeof skip !== 'undefined') {
      url += `&skip=${skip}`;
    }
    console.log(url);
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Login
export async function login(data) {
  try {
    const url = API_BASE_URL + "/create_customers";
    const response = await axios.post(url, JSON.stringify(data));
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Update Customer
export async function Update_customer(data) {
  try {
    const url = API_BASE_URL + "/update_customers";
    const response = await axios.post(url, JSON.stringify(data));
    return response.data;
  } catch (error) {
    throw error;
  }
}
//Create  Order
export async function createOrder(data) {
  try {
    const url = API_BASE_URL + "/create_order";
    const response = await axios.post(url, JSON.stringify(data));
    return response.data;
  } catch (error) {
    throw error;
  }
}
// Reorder Details
export async function ReOrder(orderId) {
  try {
    const url = `${API_BASE_URL}/re_order_details`;
    const response = await axios.post(url, JSON.stringify({'orderId': orderId }));
  
    return response.data;
  } catch (error) {
    throw error;
  }
}
// IsPromoValid Api
export async function isPromoValid(inventoryId,code,customerId) {
  try {
    const url = `${API_BASE_URL}/is_promo_valid`;
    const response = await axios.post(url, JSON.stringify({'inventory_id':inventoryId,'code':code,'customer_id':customerId}));
    return response.data;
  } catch (error) {
    throw error;
  }
}