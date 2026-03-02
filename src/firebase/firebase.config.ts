import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBL15ldn0FpcKMiDE6iekBnLYiO77RgMs",
  authDomain: "recolte-2cfb9.firebaseapp.com",
  projectId: "recolte-2cfb9",
  storageBucket: "recolte-2cfb9.firebasestorage.app",
  messagingSenderId: "785553259723",
  appId: "1:785553259723:web:339f416629cc9a7551ef4e",
  measurementId: "G-6G7GCYTQGP"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
