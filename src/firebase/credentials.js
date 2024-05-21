// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxbdrtuQiF1R__wTJ4dE-ItFkF4lw34dE",
  authDomain: "tft-bd.firebaseapp.com",
  databaseURL: "https://tft-bd-default-rtdb.firebaseio.com",
  projectId: "tft-bd",
  storageBucket: "tft-bd.appspot.com",
  messagingSenderId: "606394326708",
  appId: "1:606394326708:web:1280aeadb0d64d4da701e1",
  measurementId: "G-10V5RBVRL5",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
