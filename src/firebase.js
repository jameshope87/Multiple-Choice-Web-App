// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyuF_RpBBLWfQMmd4bDuMU8AbL4ynsayw",
  authDomain: "snappyscience-1f125.firebaseapp.com",
  projectId: "snappyscience-1f125",
  storageBucket: "snappyscience-1f125.firebasestorage.app",
  messagingSenderId: "1094231441404",
  appId: "1:1094231441404:web:3e5a87c2fa9c9b76e6fc79",
  measurementId: "G-877X8M2CXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);