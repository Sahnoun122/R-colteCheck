// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBL15ldn0FpcKMiDE6iekBnLYiO77RgMs",
  authDomain: "recolte-2cfb9.firebaseapp.com",
  projectId: "recolte-2cfb9",
  storageBucket: "recolte-2cfb9.firebasestorage.app",
  messagingSenderId: "785553259723",
  appId: "1:785553259723:web:339f416629cc9a7551ef4e",
  measurementId: "G-6G7GCYTQGP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
