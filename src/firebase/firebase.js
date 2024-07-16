import { initializeApp } from "firebase/app";
import firebaseConfig from "./config";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
export const db = getFirestore(appFirebase);
export const storage = getStorage(appFirebase);

// const messaging = getMessaging(appFirebase);

// export const requestForToken = () => {
//   return getToken(messaging, {
//     vapidKey:
//       "BD4yqNdKuE0LwmjJz6HbUppqhmviT6Hhzv5E23gEZwUdYMDai9escAbBFvexzK2n3Gp2BaRd1Q8Th-8xDwodeOI",
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         console.log("current token for client: ", currentToken);
//         // Send the token to your server and update the UI if necessary
//       } else {
//         console.log(
//           "No registration token available. Request permission to generate one.",
//         );
//       }
//     })
//     .catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//     });
// };

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
