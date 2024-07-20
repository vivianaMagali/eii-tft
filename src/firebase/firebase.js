import { initializeApp } from "firebase/app";
import firebaseConfig from "./config";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
export const db = getFirestore(appFirebase);
export const storage = getStorage(appFirebase);

const messaging = getMessaging(appFirebase);

export { messaging, getToken, onMessage };
