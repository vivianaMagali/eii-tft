import React, { useContext, useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { FirebaseContext } from "../firebase";
import logo from "../assets/logo-removebg-preview.png";
import { db } from "../firebase/firebase";

const ChefPage = () => {
  const { user } = useContext(FirebaseContext);
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
    console.log(command.uidOrder);
    console.log(user?.uidRestaurant);
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
      } catch (error) {
        console.log(error);
      }
    }
  };

  const changeToPreparing = async (command) => {
    console.log(command.uidOrder);
    console.log(user?.uidRestaurant);
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

  return (
    <>
      <div className="flex justify-between px-3 py-3 items-center w-full bg-gradient-to-l from-teal-600 to-teal-100">
        <img className="w-16" src={logo} alt="Your Company" />
        <h1>Comandas</h1>
      </div>
      {commands.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col ml-10 mr-40">
            <h1 className="font-bold text-3xl my-6 mx-2/4">
              Listado de comandas
            </h1>
            {commands.map(
              (command) =>
                command.state === 1 &&
                command.order.map((ord) => (
                  <div className="max-w-sm rounded overflow-hidden shadow-lg mb-10">
                    <div className="px-6 py-4">
                      <div className="font-bold text-2xl mb-2">
                        {ord.amount}x {ord.name}
                      </div>
                      <p className="text-gray-700 text-xl">{ord.ingredients}</p>

                      {ord.comment && (
                        <span className="text-xl">
                          Comentario: {ord.comment}
                        </span>
                      )}
                    </div>
                    <div className="px-3 py-2 bg-teal-300 font-bold flex justify-center rounded">
                      <button onClick={() => changeToPreparing()}>
                        Aceptar comanda
                      </button>
                    </div>
                  </div>
                )),
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-3xl my-6 mx-2/4">
              Comandas en preparación
            </h1>
            {commands.map(
              (command) =>
                command.state === 2 &&
                command.order.map((ord, index) => (
                  <div
                    key={command.uid}
                    className="max-w-sm rounded overflow-hidden shadow-lg mb-10"
                  >
                    <div className="px-6 py-4">
                      <div className="font-bold text-2xl mb-2">
                        {ord.amount}x {ord.name}
                      </div>
                      <p className="text-gray-700 text-xl">{ord.ingredients}</p>

                      {ord.comment && (
                        <span className="text-xl">
                          Comentario: {ord.comment}
                        </span>
                      )}
                    </div>
                    <div className="px-3 py-2 bg-green-300 font-bold flex justify-center rounded">
                      <button onClick={() => changeToFinish(command)}>
                        Terminar comanda
                      </button>
                    </div>
                  </div>
                )),
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChefPage;
