import React, { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { Button, Input } from "reactstrap";
import { Link } from "react-router-dom";
import {
  auth,
  signInWithGoogle,
  getCustomerData,
  requestPermission,
  updateCustomerData,
  signInWithFacebook,
  sendToken,
  confirmToken
} from "../firebaseConfig";
import { login } from "../Server";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deviceToken, setDeviceToken] = useState("");
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [UserToken,setUserToken]= useState("");
  const storedMart = sessionStorage.getItem('mart_id');
  const navigate = useNavigate(); 

  const getDeviceToken = async () => {
    var token = await requestPermission();
    console.log(token);
    setDeviceToken(token);
  };
  useEffect(() => {
    getDeviceToken();
  }, []);

  // const handleLogin = async () => {
  //   if (phoneNumber) {
  //     var code = await sendToken(phoneNumber);
  //     setUserToken(code);
  //     console.log(code);
  //     setIsOtpSend(true);
  //   }
  const handleLogin = async () => {
    if (phoneNumber) {
      try {
        const { success, error } = await sendToken(phoneNumber);
        if (success) {
          setIsOtpSend(true);
          console.log("Token sent successfully.");
        } else {
          setIsOtpSend(false);
          console.error("Failed to send token:", error);
        }
      } catch (error) {
        setIsOtpSend(false);
        console.error("Unexpected error during token sending:", error);
      }
    }
  // };  

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
        name: result.displayName || "",
        mobile: "",
        image: result.photoURL || "",
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
        sessionStorage.setItem("userName", result.displayName);
        sessionStorage.setItem("Email", result.email);
        navigate(`/TezDelivery?martId=${storedMart}`);
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
        name: result.displayName || "",
        mobile: "",
        image: result.photoURL || "",
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
        sessionStorage.setItem("userName", result.displayName);
        sessionStorage.setItem("Email", result.email);
        navigate(`/TezDelivery?martId=${storedMart}`);
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
      {isOtpSend ? (
        <OTPScreen setIsOtpSend={setIsOtpSend} phoneNumber={phoneNumber}/>
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
            <Link className="linkstyle" to={`/TezDelivery?martId=${storedMart}`}><span className="Login-span1">Skip Login</span></Link>
            <Button onClick={handleLogin} id="recaptcha">
              LOGIN
            </Button>
            <span className="Login-span2">Or Continue with </span>

            <div className="Logindiv" onClick={handleFacebookClick}>
              <FaFacebook className="login-icon" size={26} />
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
export default Login;
export const OTPScreen = ({ setIsOtpSend, phoneNumber }) => {
  const [otpCode, setOtpCode] = useState(Array(6).fill(""));
  const [errorMessage, setErrorMessage] = useState("");
  const storedMart = sessionStorage.getItem('mart_id');
  const navigate = useNavigate(); 
  const [timer, setTimer] = useState(120); 
  const [UserToken,setUserToken]= useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    console.log("OTP Code Array:", otpCode);
    const otpString = otpCode.join(''); 
    console.log(otpString);
    try {
      const result = await confirmToken(otpString);
      console.log(result);
      if (result.success) {
        console.log("Signed in user:", result.user);
        sessionStorage.setItem("phoneNumber", result.user.phoneNumber);
        sessionStorage.setItem("firebase_id", result.user.uid);
        navigate(`/TezDelivery?martId=${storedMart}`);
      } else {
        setErrorMessage(result.error);
        throw new Error(result.error);   
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      setErrorMessage("Failed to verify OTP. Please try again.");
      setError("Failed to verify OTP. Please try again.");

    }
    setLoading(false);
  };
  const handleChange = (index, value) => {
    let newOtpCode = [...otpCode];
    newOtpCode[index] = value;
    setOtpCode(newOtpCode);
  
    // Focus management
    if (value.length === 1 && index < newOtpCode.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  const handleContinue=()=>{
    setErrorMessage('');
   setIsOtpSend(false);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(interval);
          // navigate('/login');
          return 0;
        }
      });
    }, 1000); 
    return () => clearInterval(interval);
  }, []);
  const formattedTime = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`;
  const ResendOtp = async () => {
    console.log(phoneNumber)
    if (phoneNumber) {
      var code = await sendToken(phoneNumber);
      setUserToken(code);
      console.log(code);
      setIsOtpSend(true);
    }
  }
  return (
    <>
    
      <section className="container">
      {errorMessage && (
            <>
              <div className='promo-container'>
                <div className='promo-popup'>
                  <div className='promo-close'>
                    <span className='promo-close-btn' onClick={() => setErrorMessage('')}>
                      &times;
                    </span>
                  </div>
                  <h2 className='promo-label main_heading'>Error</h2>
                  <h3 className='promo-label2'>{errorMessage}</h3>
                  <button onClick={handleContinue} className='continue'>Continue</button>
                </div>
              </div>
            </>
          )}
        <div className="otp-screen">
          <Link to="/login">
            <div className="back-arrow" onClick={() => setIsOtpSend(false)}>
              <GoChevronLeft size={24} color="#F17E2A" />
            </div>
          </Link>
          {timer > 0 ? (
          <span>Code sent to {phoneNumber}. This will expire in {formattedTime}.</span>
         ) : (
          <span>
          Code expired.
           {/* <span onClick={ResendOtp} style={{ textDecoration: "underline", cursor: 'pointer' }} className="resend-link">Resend</span> */}
        </span>
        )}
          {error && <p className="error-message">{error}</p>}
          <div className="otp-inputs">
            <div className="otp-inputs">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  pattern="\d*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="otp-input"
                  id={`otp-input-${index}`} 
                />
              ))}
            </div>
          </div>
        </div>
        <div className="otp-button">
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </section>
    </>
  );
};