import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyADmrTwGbuuhdU-BGo6szTAxgUGGO-NbmY",
  authDomain: "studee-flow.firebaseapp.com",
  projectId: "studee-flow",
  storageBucket: "studee-flow.firebasestorage.app",
  messagingSenderId: "235137120983",
  appId: "1:235137120983:web:b3cf9f2e31e44ba5ee4e92",
  measurementId: "G-GVNBERC0GY",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
