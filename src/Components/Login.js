import React, { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa";
import { GoChevronLeft } from "react-icons/go";
<<<<<<< HEAD
import { initializeApp } from 'firebase/app';
import 'firebase/messaging';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken } from 'firebase/messaging';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { LoginSocialFacebook, LoginSocialGoogle } from 'reactjs-social-login';
import { login } from '../Server';
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
=======
import { Button, Input } from "reactstrap";

import {
  auth,
  signInWithGoogle,
  getCustomerData,
  requestPermission,
  updateCustomerData,
  signInWithFacebook,
  sendToken,
} from "../firebaseConfig";
import { login } from "../Server";
>>>>>>> d5071cd8d34c0ba8aa89d6eee4f4ee8927b1bf4d

const Login = () => {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deviceToken, setDeviceToken] = useState("");
  const [isOtpSend, setIsOtpSend] = useState(false);

  const getDeviceToken = async () => {
    var token = await requestPermission();
    console.log(token);
    setDeviceToken(token);
  };
  useEffect(() => {
    getDeviceToken();
  }, []);

  const handleLogin = async () => {
    if (phoneNumber) {
      var code = await sendToken(phoneNumber);
      console.log(code);
      setIsOtpSend(true);
    }

    // const data = {
    //   name: userName,
    //   mobile: phoneNumber,
    //   image: null,
    //   wallet: 0,
    //   code: "SXAVMX48",
    //   house: null,
    //   street: null,
    //   floor: null,
    //   addedOn: 1698703900696,
    //   points: 40416.6,
    //   deviceToken: deviceToken,
    //   id: newCityRef.id,
    //   uniqueId: 1698703900696,
    //   email: "",
    //   firebase_id: newCityRef.id,
    // };
    // sessionStorage.setItem("userName", userName);
    // sessionStorage.setItem("phoneNumber", phoneNumber);
    // await setDoc(newCityRef, data);
    // try {
    //   const response = await login(data);
    //   console.log("Response Status:", response.status);
    //   if (response.status === 200) {
    //     console.log("Login successful!", response.data);
    //   } else {
    //     console.error("Login failed.", response.data);
    //   }
    // } catch (error) {
    //   console.error("Error during login:", error);
    // }
  };

  const handleGoogleClick = async () => {
    var result = await signInWithGoogle();
    var firebase_id = result.uid;
    var customerData = await getCustomerData(firebase_id);

    if (customerData) {
      customerData["deviceToken"] = deviceToken;
    } else {
      var data = {
        name: "",
        mobile: "",
        image: "",
        wallet: 0,
        code: "",
        house: "",
        street: "",
        floor: "",
        addedOn: new Date().getTime(),
        points: 0,
        deviceToken: deviceToken,
        id: firebase_id,
        uniqueId: new Date().getTime(),
        email: result.email,
        firebase_id: firebase_id,
      };
    }

    try {
      const res = await updateCustomerData(
        customerData ? customerData : data,
        firebase_id
      );

      const response = await login(customerData ? customerData : data);
      console.log("Response Status:", response.status);
      if (response.status === 200) {
        console.log("Login successful!", response.data);

        sessionStorage.setItem("firebase_id", firebase_id);
      } else {
        console.error("Login failed.", response.data);
        sessionStorage.setItem("firebase_id", "");
      }
    } catch (error) {
      console.error("Error during login:", error);
      sessionStorage.setItem("firebase_id", "");
    }
  };

  const handleFacebookClick = async () => {
    var result = await signInWithFacebook();
    var firebase_id = result.uid;
    var customerData = await getCustomerData(firebase_id);

    if (customerData) {
      customerData["deviceToken"] = deviceToken;
    } else {
      var data = {
        name: "",
        mobile: "",
        image: "",
        wallet: 0,
        code: "",
        house: "",
        street: "",
        floor: "",
        addedOn: new Date().getTime(),
        points: 0,
        deviceToken: deviceToken,
        id: firebase_id,
        uniqueId: new Date().getTime(),
        email: result.email,
        firebase_id: firebase_id,
      };
    }

    try {
      const res = await updateCustomerData(
        customerData ? customerData : data,
        firebase_id
      );

      const response = await login(customerData ? customerData : data);
      console.log("Response Status:", response.status);
      if (response.status === 200) {
        console.log("Login successful!", response.data);

        sessionStorage.setItem("firebase_id", firebase_id);
      } else {
        console.error("Login failed.", response.data);
        sessionStorage.setItem("firebase_id", "");
      }
    } catch (error) {
      console.error("Error during login:", error);
      sessionStorage.setItem("firebase_id", "");
    }
  };

  return (
    <div>
<<<<<<< HEAD
      <section className='container pt'>
        <div className='Login'>
          <img src='/Images/LogoImage.png' className=' pb' alt='loginimage' style={{ marginTop: '15px' }} />
          <p>Enter Account Credientials</p>
          <Input className='LoginInput' type="text" placeholder="Your Name" name="name" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <Input className='LoginInput' type="text" placeholder="03xx xxxxxxx" name="phoneno" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <span className='Login-span1'>Skip Login</span>
          <Button onClick={handleLogin}>Login</Button>
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
=======
      {isOtpSend ? (
        <OTPScreen  setIsOtpSend={setIsOtpSend} />
      ) : (
        <section className="container pt">
          <div className="Login">
            <img
              src="/Images/LogoImage.png"
              className=" pb"
              alt="loginimage"
              style={{ marginTop: "15px" }}
            />
            <p>Enter Account Credientials</p>
            <Input
              className="LoginInput"
              type="text"
              placeholder="Your Name"
              name="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              className="LoginInput"
              type="text"
              placeholder="03xx xxxxxxx"
              name="phoneno"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <span className="Login-span1">Skip Login</span>
            <Button onClick={handleLogin} id="recaptcha">
              LOGIN
            </Button>
            <span className="Login-span2">Or Continue with </span>

            <div className="Logindiv" onClick={handleFacebookClick}>
              <FaFacebook className="login-icon" size={26} />
>>>>>>> d5071cd8d34c0ba8aa89d6eee4f4ee8927b1bf4d
              <h6>Facebook</h6>
            </div>

            <div className="Logindiv" onClick={handleGoogleClick}>
              <img
                src="/Images/google.png"
                className="google-img"
                alt="google"
              />
              <h6>Google</h6>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export const OTPScreen = ({setIsOtpSend}) => {
  return (
    <>
      <section className="container">
        <div className="otp-screen">
          <div className="back-arrow" onClick={()=>setIsOtpSend(false)}>
            <GoChevronLeft size={24} color="#F17E2A" />{" "}
          </div>
          <h1>Enter 6-digit Verification code</h1>
          <span>Code sent to 03087656554. This will expire in 2 minutes.</span>
          <div className="otp-inputs">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                maxLength="1"
                type="text"
                className="otp-input"
                pattern="\d*"
              />
            ))}
          </div>
        </div>
        <div className="otp-button">
          <button className="submit-btn">Submit</button>
        </div>
      </section>
    </>
  );
};
export default Login;
