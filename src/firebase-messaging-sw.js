// Importar los módulos necesarios desde Firebase
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Configuración de Firebase
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

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Obtener la instancia de Firebase Messaging
const messaging = getMessaging(firebaseApp);

// Manejar los mensajes en segundo plano
onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  const notificationTitle = payload.notification?.title || "Default Title";
  const notificationOptions = {
    body: payload.notification?.body || "Default body",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
