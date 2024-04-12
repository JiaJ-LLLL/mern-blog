// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-75dc3.firebaseapp.com",
  projectId: "mern-blog-75dc3",
  storageBucket: "mern-blog-75dc3.appspot.com",
  messagingSenderId: "685269956962",
  appId: "1:685269956962:web:eea613d1bc508d8324d43b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);