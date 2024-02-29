importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyAxANdP0jWz27EOJvZt11_-kB_y4ebposU",
  authDomain: "tezdelivery-1ac08.firebaseapp.com",
  projectId: "tezdelivery-1ac08",
  storageBucket: "tezdelivery-1ac08.appspot.com",
  messagingSenderId: "1054262826197",
  appId: "1:1054262826197:web:5de8514698561b5f3a7e5c",
  measurementId: "G-SB18KSB5RD"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
