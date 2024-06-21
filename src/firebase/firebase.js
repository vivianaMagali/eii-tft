import { initializeApp } from "firebase/app";
import firebaseConfig from "./config";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
export const db = getFirestore(appFirebase);
export const storage = getStorage(appFirebase);
