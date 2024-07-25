import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import { appFirebase } from "./firebase/firebase";

// Obtener la instancia de Firebase Messaging
const messaging = getMessaging(appFirebase);

// Manejar los mensajes en segundo plano
onBackgroundMessage(messaging, (payload) => {
  const notificationTitle = payload.notification?.title || "Default Title";
  const notificationOptions = {
    body: payload.notification?.body || "Default body",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
