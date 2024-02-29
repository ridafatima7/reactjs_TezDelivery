import React, { useState, useEffect } from 'react';
import { Button, Input, FormGroup } from 'reactstrap';
import { FaFacebook } from "react-icons/fa";
import { GoogleLogin } from 'react-google-login';
import { initializeApp } from 'firebase/app';
import 'firebase/messaging';
import api from "./apis";
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken } from 'firebase/messaging';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { LoginSocialFacebook, LoginSocialGoogle } from 'reactjs-social-login';
import axios from 'axios';
// import { GoogleLogin } from 'react-google-login';
const firebaseConfig = {
  apiKey: "AIzaSyAxANdP0jWz27EOJvZt11_-kB_y4ebposU",
  authDomain: "tezdelivery-1ac08.firebaseapp.com",
  projectId: "tezdelivery-1ac08",
  storageBucket: "tezdelivery-1ac08.appspot.com",
  messagingSenderId: "1054262826197",
  appId: "1:1054262826197:web:5de8514698561b5f3a7e5c",
  measurementId: "G-SB18KSB5RD"
};
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
export const messaging = getMessaging();

const Login = () => {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const newCityRef = doc(collection(db, "create-customer"));
  sessionStorage.setItem('fire_baseid', newCityRef.id);
  const [deviceToken, setDeviceToken] = useState('');
  async function requestPermission(){
    const messaging = getMessaging();
    const permission=await Notification.requestPermission();
    if(permission==='granted'){
      const token=await getToken(messaging, {vapidKey: "BKSUQkhoaL4tRJY1pdnv6U3MSu_5DB7Z6SVtExAwhSJLh26kroqgLQ_WaO340PFlLwOQKkwJbNZKRy4ySqYWcZo"});
      setDeviceToken(token);
    }
    else if(permission==='denied'){
      alert("you denied for notifications");
    }
  }
  useEffect(()=>{
    requestPermission();
   
  },[]);
  const handleLogin = async () => {
    const data = {
      name: userName,
      mobile: phoneNumber,
      image: null,
      wallet: 0,
      code: "SXAVMX48",
      house: null,
      street: null,
      floor: null,
      addedOn: 1698703900696,
      points: 40416.6,
      deviceToken: deviceToken,
      id: newCityRef.id,
      uniqueId: 1698703900696,
      email: "",
      firebase_id: newCityRef.id,
    };
    sessionStorage.setItem('userName', userName);
    sessionStorage.setItem('phoneNumber', phoneNumber);
    await setDoc(newCityRef, data);
    try {
      const response = await axios.post(
        `${api}/create_customers`,
        JSON.stringify(data),
      );
      console.log('Response Status:', response.status);
      if (response.status === 200) {
        console.log('Login successful!', response.data);
      } else {
        console.error('Login failed.', response.data);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const clientId = '761542653895-mmbupt9quf3g1399n3mdcfphbrud2pta.apps.googleusercontent.com';

  const handleSuccess = (response) => {
    console.log('Google login success:', response);
    // onSuccess(response);
  };

  const handleFailure = (error) => {
    console.error('Google login error:', error);
    // onFailure(error);
  };
  return (
    <div>
      <section className='container pt'>
        <div className='Login'>
          <img src='/Images/LogoImage.png' className=' pb' alt='loginimage' style={{ marginTop: '15px' }} />
          <p>Enter Account Credientials</p>
          <Input className='LoginInput' type="text" placeholder="Your Name" name="name" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <Input className='LoginInput' type="text" placeholder="03xx xxxxxxx" name="phoneno" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <span className='Login-span1'>Skip Login</span>
          <Button onClick={handleLogin}>LOGIN</Button>
          <span className='Login-span2'>Or Continue with </span>
          <LoginSocialFacebook appId='815948600574654' onResolve={(response) => {
            console.log(response);
          }}
            onReject={(error) => {
              console.log(error);
            }}
          >
            <div className='Logindiv'>
              <FaFacebook className='login-icon' size={26} />
              <h6>Facebook</h6>
            </div>
          </LoginSocialFacebook>
          <GoogleLogin
            clientId={clientId}
            onSuccess={handleSuccess}
            onFailure={handleFailure}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
            render={renderProps => (
              <div className='Logindiv' onClick={renderProps.onClick}>
                <img src='/Images/google.png' className='google-img' alt='google' />
                <h6>Google</h6>
              </div>
            )}
          />
        </div>
      </section>
    </div>
  )
}

export default Login
