import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPhoneNumber ,
  RecaptchaVerifier
} from "firebase/auth"; // If you're using Authentication
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

const firebaseApp = initializeApp(firebaseConfig);
// Export Firebase services you plan to use
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  var result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  return result.user;
};
const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  var result = await signInWithPopup(auth, provider);
  const credential = FacebookAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  return result.user;
};


const sendToken = async (phoneNumber) => {

  console.log(phoneNumber);
  var recaptcha="";
  try{
    recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
      size: "invisible",
    });
   const confirmationResult= await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
   return confirmationResult;
  }catch(e){
    recaptcha="";
    return e;
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
  sendToken
};
