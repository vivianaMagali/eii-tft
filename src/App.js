import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import { FirebaseContext } from "./firebase";
import ChefPage from "./components/ChefPage";
import CashierPage from "./components/CashierPage";
import AdminPage from "./components/AdminPage";
import Login from "./components/Login";
import Home from "./components/Home";
import Restaurant from "./components/Restaurant";
import {
  db,
  auth,
  getToken,
  messaging,
  onMessage,
  onAuthStateChanged,
} from "./firebase/firebase";
import Profile from "./components/Profile";
import Record from "./components/Record";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { typeRole } from "./utils";

function App() {
  const [user, setUser] = useState();
  const [record, setRecord] = useState([]);
  const [token, setToken] = useState();

  // Registrar el service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registrado con éxito:", registration);
      })
      .catch((error) => {
        console.error("Error al registrar el Service Worker:", error);
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        //si existe un usuario, guardar el token obtenido en la bd con el usuario
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUser({ uid: user.uid, token: token, ...userDoc.data() });
        const userDocRef = doc(db, "users", user.uid);
        const recordCollectionRef = collection(userDocRef, "record");

        const unsubscribeRecord = onSnapshot(
          recordCollectionRef,
          (snapshot) => {
            setRecord(snapshot.docs.map((doc) => doc.data()));
          },
        );

        return () => unsubscribeRecord();
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, [token]);

  useEffect(() => {
    // Solicitar permiso para recibir notificaciones
    const requestPermission = async () => {
      try {
        // Solicita el permiso para mostrar notificaciones
        Notification.requestPermission().then(async (permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted.");

            // Obtén el token de FCM
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.REACT_APP_VAPID_KEY,
            });

            if (currentToken) {
              setToken(currentToken);
            } else {
              console.log("No se pudo obtener el token.");
            }
          } else {
            console.log("Notification permission denied.");
          }
        });
      } catch (error) {
        console.error("Error al obtener el token:", error);
      }
    };

    requestPermission();

    // Configurar el receptor de mensajes
    const unsubscribe = onMessage(messaging, (payload) => {
      // Aquí debo manejar la configuración para las notificaciones. Un componente Toaster
      const notificationTitle = payload.notification.title;
      const notificationBody = payload.notification.body;
      alert(`Título: ${notificationTitle}\nMensaje: ${notificationBody}`);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <FirebaseContext.Provider
        value={{
          user: user,
          record: record,
          token: token,
        }}
      >
        <Toaster />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                allowedRoles={[typeRole.admin]}
                userRole={user?.role}
                redirectTo="/admin"
              >
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cashier"
            element={
              <ProtectedRoute
                allowedRoles={[typeRole.cashier]}
                userRole={user?.role}
                redirectTo="/cashier"
              >
                <CashierPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chef"
            element={
              <ProtectedRoute
                allowedRoles={[typeRole.chef]}
                userRole={user?.role}
                redirectTo="/chef"
              >
                <ChefPage />
              </ProtectedRoute>
            }
          />

          <Route path="/home" element={<Home />} />

          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route
            path="/:uidUser/record"
            element={
              <ProtectedRoute
                allowedRoles={[undefined]}
                userRole={user?.role}
                redirectTo="/:uidUser/record"
              >
                <Record />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </FirebaseContext.Provider>
    </div>
  );
}

export default App;
