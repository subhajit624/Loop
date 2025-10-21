// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "fir-explore-72216.firebaseapp.com",
  projectId: "fir-explore-72216",
  storageBucket: "fir-explore-72216.firebasestorage.app",
  messagingSenderId: "293753112840",
  appId: "1:293753112840:web:803d5b0c1c0389cc00c4bd"
};


export const app = initializeApp(firebaseConfig);