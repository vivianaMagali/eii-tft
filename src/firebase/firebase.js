import { initializeApp } from "firebase/app";
import firebaseConfig from "./credentials";
import { getFirestore } from "firebase/firestore";
import { getStorage, getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

const auth = getAuth(appFirebase);
const messaging = getMessaging(appFirebase);

export {
  db,
  messaging,
  auth,
  storage,
  getToken,
  onMessage,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getDownloadURL,
  uploadBytes,
  ref,
};
