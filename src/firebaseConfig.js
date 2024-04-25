import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPhoneNumber ,
  RecaptchaVerifier
} from "firebase/auth"; 
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"; // If you're using Firestore
import { getMessaging, getToken } from "firebase/messaging";

// If you need Firebase Authentication
// Add other Firebase services as needed
const firebaseConfig = {
  apiKey: "AIzaSyBtfAc1LiY2l6QWixvsD9jn9SZiaH-f3sU",
  authDomain: "tezz-delivery-237ad.firebaseapp.com",
  databaseURL: "https://tezz-delivery-237ad-default-rtdb.firebaseio.com",
  projectId: "tezz-delivery-237ad",
  storageBucket: "tezz-delivery-237ad.appspot.com",
  messagingSenderId: "330028742587",
  appId: "1:330028742587:web:600b41611de0a60316769e",
  measurementId: "G-M2NEQN0X71",
};
const TIMEOUT_DURATION = 120000;
const firebaseApp = initializeApp(firebaseConfig);
// Export Firebase services you plan to use
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  var result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  console.log(result.user);
  return result.user;
};
const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  var result = await signInWithPopup(auth, provider);
  const credential = FacebookAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  return result.user;
};


// const sendToken = async (phoneNumber) => {
//   console.log(phoneNumber);
//   var recaptcha="";
//   try{
//     recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
//       size: "invisible",
//     });
//    const confirmationResult= await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
//    window.confirmationResult = confirmationResult;
//    window.recaptcha = recaptcha;
//    console.log(confirmationResult);
//    return confirmationResult;
//   }catch(e){
//     recaptcha="";
//     console.log(e)
//     return e;
//   }
 
// };
// const confirmToken = async (otpCode) => {
//   try {
//     const result = await window.confirmationResult.confirm(otpCode);
//     console.log("Signed in user:", result.user);
//     console.log(window.recaptcha)
//     if (window.recaptcha) {
//       window.recaptcha.clear();
//     }
//     return { success: true, user: result.user }; 
//   } catch (error) {
//     console.error("Error during OTP verification:", error);
//     return { success: false, error: "Failed to verify OTP" };
//   } 
 
// };
// const sendToken = async (phoneNumber) => {
//   console.log(phoneNumber);
//   let recaptcha = "";
//   try {
//     recaptcha = new RecaptchaVerifier(auth, "recaptcha", { size: "invisible" });
//     const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
//     window.confirmationResult = confirmationResult;
//     window.recaptcha = recaptcha;
//     console.log(confirmationResult);

//     // Set a timeout to clear the confirmation result after 2 minutes
//     window.confirmationTimeout = setTimeout(() => {
//       window.confirmationResult = null;
//       console.log("OTP has expired");
//     }, TIMEOUT_DURATION);

//     return confirmationResult;
//   } catch (e) {
//     recaptcha = "";
//     console.log(e);
//     return e;
//   }
// };
const sendToken = async (phoneNumber) => {
  console.log(phoneNumber);
  try {
    let recaptcha = new RecaptchaVerifier(auth, "recaptcha", { size: "invisible" });
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
    window.confirmationResult = confirmationResult;
    window.recaptcha = recaptcha;
    console.log(confirmationResult);
    window.confirmationTimeout = setTimeout(() => {
      window.confirmationResult = null;
      console.log("OTP has expired");
    }, TIMEOUT_DURATION);

    return { success: true, confirmationResult }; 
  } catch (error) {
    console.log("Error during OTP send:", error);
    return { success: false, error }; 
  }
};

const confirmToken = async (otpCode) => {
  try {
    if (!window.confirmationResult) {
      throw new Error("OTP has expired or was not sent.");
    }

    const result = await window.confirmationResult.confirm(otpCode);
    console.log("Signed in user:", result.user);

    // Clear the timeout and recaptcha if verification is successful
    clearTimeout(window.confirmationTimeout);
    if (window.recaptcha) {
      window.recaptcha.clear();
    }

    return { success: true, user: result.user };
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return { success: false, error: "Failed to verify OTP" };
  }
};
async function requestPermission() {
  const messaging = getMessaging();
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BOPNQS7yFUJwruwsfoPZEwNrJ5xrv-Rhb5WyAKdFRDd_3fgPgAsh4n0kz5rR0gJuyin-q7vYzc4TrgW18vqyxcM",
    });
    return token;
  } else if (permission === "denied") {
    return "";
  }
}
const getCustomerData = async (id) => {
  const docRef = doc(db, "customers", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    return null;
  }
};

const updateCustomerData = async (data, id) => {
  try {
    await setDoc(doc(db, "customers", id), data);
    return "success";
  } catch (err) {
    return err;
  }
};
export {
  db,
  auth,
  signInWithGoogle,
  getCustomerData,
  requestPermission,
  updateCustomerData,
  signInWithFacebook,
  sendToken,
  confirmToken
};
