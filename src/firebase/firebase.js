import { initializeApp } from "firebase/app";
import firebaseConfig from "./config";
import { getFirestore } from "firebase/firestore";

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
export const db = getFirestore(appFirebase);
