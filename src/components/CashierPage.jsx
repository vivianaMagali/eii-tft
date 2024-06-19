import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-removebg-preview.png";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { FirebaseContext } from "../firebase";
import { db } from "../firebase/firebase";

const CashierPage = () => {
  const navigate = useNavigate();
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

  const goProfile = () => {
    navigate("/profile");
  };

  const paidOrder = async (command) => {
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
          paymentStatus: true,
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
        <button onClick={() => goProfile()}>
          <svg
            className="h-10 w-10 text-teal-200"
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
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col ml-10 mr-40">
            <h1 className="font-bold text-2xl my-6 mx-2/4">
              Listado de comandas
            </h1>
            {commands.map(
              (command) =>
                !command.paymentStatus && (
                  <div
                    className="max-w-sm rounded overflow-hidden shadow-lg mb-10"
                    key={command.id}
                  >
                    {command.order.map((ord) => (
                      <div key={ord.id}>
                        <div className="px-6 flex flex-col">
                          <span className="font-bold">
                            {ord.amount}x {ord.name}
                          </span>
                          <span className="text-gray-700">
                            {ord.ingredients}
                          </span>
                        </div>
                        {ord.comment && <span>Comentario: {ord.comment}</span>}
                      </div>
                    ))}
                    <div className="font-bold flex justify-between items-center rounded my-2 mx-2">
                      <button
                        className=" bg-teal-300 rounded mr-2 px-3 py-2"
                        onClick={() => paidOrder(command)}
                      >
                        Efectivo
                      </button>
                      <span className="font-bold">Total: {command.total}€</span>
                      <button
                        className=" bg-teal-300 rounded px-3 py-2"
                        onClick={() => paidOrder(command)}
                      >
                        Tarjeta
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

export default CashierPage;
