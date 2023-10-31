import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-c9612.firebaseapp.com",
  projectId: "mern-estate-c9612",
  storageBucket: "mern-estate-c9612.appspot.com",
  messagingSenderId: "923392137665",
  appId: "1:923392137665:web:50abe35ffbeace2d7a3740"
};


export const app = initializeApp(firebaseConfig);