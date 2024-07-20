import React, { useContext, useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../firebase";
import logo from "../assets/logo-removebg-preview.png";
import { db } from "../firebase/firebase";

const ChefPage = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(FirebaseContext);
  const [commands, setCommands] = useState([]);

  useEffect(() => {
    if (!user) return;

    const commandsRef = collection(
      db,
      "restaurants",
      user?.uidRestaurant,
      "comandas",
    );

    const unsubscribeCommands = onSnapshot(commandsRef, (snapshot) => {
      setCommands(snapshot.docs.map((doc) => doc.data()));
    });

    return () => {
      unsubscribeCommands();
    };
  }, [user, user?.uidRestaurant]);

  const changeToFinish = async (command) => {
    const docRef = doc(
      db,
      "restaurants",
      user?.uidRestaurant,
      "comandas",
      command.uidOrder,
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      try {
        await updateDoc(docRef, {
          state: 3,
        });
        sendPushNotification();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changeToPreparing = async (command) => {
    const docRef = doc(
      db,
      "restaurants",
      user?.uidRestaurant,
      "comandas",
      command.uidOrder,
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      try {
        await updateDoc(docRef, {
          state: 2,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const goProfile = () => {
    navigate("/profile");
  };

  const sendPushNotification = async () => {
    try {
      await fetch("http://localhost:3001/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Título de la Notificación",
          body: "Cuerpo de la Notificación",
        }),
      });
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
    }
    // try {
    //   await fetch("https://fcm.googleapis.com/fcm/send", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization:
    //         "key=AAAAjS_rHrQ:APA91bFIpxZwmJhO_6DJ6Kf4uHKXYuz86RJGYbUPhWqm4Qco5TeQytN1s5HmxQTzY2oUfEqtt3n3fNqhfDWv-Wnaw50C41c2C4qBmQ4cJnozWExbtMTUv2DJZXEHgHtGRIhtV5LbG1HX", // Reemplaza con tu clave de servidor de Firebase
    //     },
    //     body: JSON.stringify({
    //       to: token,
    //       notification: {
    //         title: "Título de la notificación",
    //         body: "Cuerpo de la notificación",
    //       },
    //     }),
    //   });
    // } catch (error) {
    //   console.error("Error al enviar la notificación:", error);
    // }
  };
  return (
    <>
      <div class="flex justify-between px-3 py-3 items-center w-full bg-gradient-to-l from-teal-600 to-teal-100">
        <img class="w-16" src={logo} alt="Your Company" />
        <button onClick={() => goProfile()}>
          <svg
            class="h-10 w-10 text-teal-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      {commands.length > 0 && (
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col ml-10 mr-40">
            <h1 class="font-bold text-3xl my-6 mx-2/4">Listado de comandas</h1>
            {commands.map(
              (command) =>
                command.state === 1 && (
                  <div
                    class="max-w-sm rounded overflow-hidden shadow-lg mb-10"
                    key={command.id}
                  >
                    {command.description && (
                      <span class="text-xl px-6 font-bold italic text-red-400">
                        Comentario:({command.description})
                      </span>
                    )}
                    {command.order.map((ord) => (
                      <div key={ord.id}>
                        <div class="px-6 py-2 flex flex-col">
                          <span class="font-bold text-2xl mb-2">
                            {ord.amount}x {ord.name}
                          </span>
                          <span class="text-gray-700 text-xl">
                            {ord.ingredients}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div class="px-3 py-2 bg-teal-300 font-bold flex justify-center rounded">
                      <button onClick={() => changeToPreparing(command)}>
                        Aceptar comanda
                      </button>
                    </div>
                  </div>
                ),
            )}
          </div>
          <div class="flex flex-col">
            <h1 class="font-bold text-3xl my-6 mx-2/4">
              Comandas en preparación
            </h1>
            {commands.map(
              (command) =>
                command.state === 2 && (
                  <div
                    class="max-w-sm rounded overflow-hidden shadow-lg mb-10"
                    key={command.id}
                  >
                    {command.description && (
                      <span class="text-xl px-6 font-bold italic text-red-400">
                        Comentario:({command.description})
                      </span>
                    )}
                    {command.order.map((ord) => (
                      <div key={ord.id}>
                        <div class="px-6 py-2 flex flex-col">
                          <span class="font-bold text-2xl mb-2">
                            {ord.amount}x {ord.name}
                          </span>
                          <span class="text-gray-700 text-xl">
                            {ord.ingredients}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div class="px-3 py-2 bg-green-300 font-bold flex justify-center rounded">
                      <button onClick={() => changeToFinish(command)}>
                        Terminar comanda
                      </button>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChefPage;
