import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import credencialsFirebase from "./firebase/credentials";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import { FirebaseContext } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import WaiterPage from "./components/WaiterPage";
import ChefPage from "./components/ChefPage";
import CashierPage from "./components/CashierPage";
import AdminPage from "./components/AdminPage";
import Login from "./components/Login";
import Home from "./components/Home";
import Restaurant from "./components/Restaurant";
import { db, getToken, messaging, onMessage } from "./firebase/firebase";
import Profile from "./components/Profile";
import Record from "./components/Record";
import { Toaster } from "react-hot-toast";

const auth = getAuth(credencialsFirebase);

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
    const eventSource = new EventSource(
      "https://fd29-90-165-59-29.ngrok-free.app/api/subscribe-token",
    );

    eventSource.onopen = () => {
      console.log("Connection to server opened.");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.token) {
          setToken(data.token);
        } else if (data.error) {
          console.error("Error received:", data.error);
        } else {
          console.log("No token found in the response");
        }
      } catch (error) {
        console.error("Error parsing event data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Error with SSE:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setUser({ uid: user.uid, ...userDoc.data() });
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
  }, []);

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
              vapidKey:
                "BD4yqNdKuE0LwmjJz6HbUppqhmviT6Hhzv5E23gEZwUdYMDai9escAbBFvexzK2n3Gp2BaRd1Q8Th-8xDwodeOI",
            });

            if (currentToken) {
              console.log("Token:", currentToken);
              // Aquí puedes enviar el token a tu servidor
              await fetch("/api/token", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: currentToken }),
              });
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
      console.log("Notificación recibida:", payload);
      // Aquí puedes manejar la notificación
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
        value={{ user: user, record: record, token: token }}
      >
        <Toaster />
        <Routes>
          <Route
            path="/"
            element={user ? <Home email={user.email} /> : <Login />}
          />
          <Route path="/waiter" element={<WaiterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/cashier" element={<CashierPage />} />
          <Route path="/chef" element={<ChefPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/:uidUser/record" element={<Record />} />
        </Routes>
      </FirebaseContext.Provider>
    </div>
  );
}

export default App;
