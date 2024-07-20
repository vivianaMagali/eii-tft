// // firebase-messaging-sw.js

// // Importa los módulos de Firebase
// importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js",
// );

// // Inicializa la aplicación Firebase con la configuración
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: "tft-bd.firebaseapp.com",
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: "tft-bd",
//   storageBucket: "tft-bd.appspot.com",
//   messagingSenderId: "606394326708",
//   appId: "1:606394326708:web:1280aeadb0d64d4da701e1",
//   measurementId: "G-10V5RBVRL5",
// };
// // Inicializa Firebase
// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// // Maneja los mensajes en segundo plano
// messaging.onBackgroundMessage(function (payload) {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload,
//   );
//   const notificationTitle = payload.notification.title || "Default Title";
//   const notificationOptions = {
//     body: payload.notification.body || "Default body",
//     icon: "/firebase-logo.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
