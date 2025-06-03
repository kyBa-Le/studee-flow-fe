// firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyADmrTwGbuuhdU-BGo6szTAxgUGGO-NbmY",
  authDomain: "studee-flow.firebaseapp.com",
  projectId: "studee-flow",
  storageBucket: "studee-flow.firebasestorage.app",
  messagingSenderId: "235137120983",
  appId: "1:235137120983:web:b3cf9f2e31e44ba5ee4e92",
  measurementId: "G-GVNBERC0GY",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
