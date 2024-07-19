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
import ModalConfirmation from "./ModalConfirmation";

const CashierPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(FirebaseContext);
  const [commands, setCommands] = useState([]);
  const [showPaid, setShowPaid] = useState(false);
  const [showModalConfirm, setShowConfirmOrderModal] = useState(false);
  const [commandSelected, setCommandSelected] = useState();

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

  const confirmAction = async () => {
    const docRef = doc(
      db,
      "restaurants",
      user?.uidRestaurant,
      "comandas",
      commandSelected.uidOrder,
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
    setShowConfirmOrderModal(false);
  };

  const paidOrder = async (command) => {
    setCommandSelected(command);
    setShowConfirmOrderModal(true);
  };

  return (
    <>
      {showModalConfirm && (
        <ModalConfirmation
          title={"Cerrar transacción"}
          setShowConfirmOrderModal={setShowConfirmOrderModal}
          confirmAction={confirmAction}
        />
      )}
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
        <button onClick={() => setShowPaid(!showPaid)}>
          <svg
            class="h-10 w-10 text-teal-200"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <rect x="5" y="3" width="14" height="18" rx="2" />{" "}
            <line x1="9" y1="7" x2="15" y2="7" />{" "}
            <line x1="9" y1="11" x2="15" y2="11" />{" "}
            <line x1="9" y1="15" x2="13" y2="15" />
          </svg>
        </button>
      </div>
      {commands.length > 0 && (
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col justify-center items-center">
            <h1 class="font-bold text-2xl my-6 mx-2/4">
              Comandas pendientes de pago
            </h1>
            {commands.map(
              (command) =>
                !command.paymentStatus && (
                  <div
                    class="max-w-sm rounded overflow-hidden shadow-lg mb-10 min-w-96"
                    key={command.id}
                  >
                    <div class="flex flex-col">
                      <span class="px-6 font-bold italic">
                        Identificador: {command.orderId}
                      </span>
                      {command?.table && (
                        <span class="px-6 font-bold underline">
                          Mesa: {command.table}
                        </span>
                      )}
                    </div>

                    {command.order.map((ord) => (
                      <div key={ord.id}>
                        <div class="px-6 flex flex-col">
                          <span class="font-bold">
                            {ord.amount}x {ord.name}
                          </span>
                          <span class="text-gray-700">{ord.ingredients}</span>
                        </div>
                      </div>
                    ))}
                    <div class="font-bold flex justify-between items-center rounded my-2 mx-2">
                      <button
                        class=" bg-teal-300 rounded mr-2 px-3 py-2"
                        onClick={() => paidOrder(command)}
                      >
                        Efectivo
                      </button>
                      <span class="font-bold">Total: {command.total}€</span>
                      <button
                        class=" bg-teal-300 rounded px-3 py-2"
                        onClick={() => paidOrder(command)}
                      >
                        Tarjeta
                      </button>
                    </div>
                  </div>
                ),
            )}
          </div>
          {showPaid && (
            <div class="flex flex-col ml-10 mr-40">
              <h1 class="font-bold text-2xl my-6 mx-2/4">Comandas pagadas</h1>
              {commands.map(
                (command) =>
                  command.paymentStatus && (
                    <div
                      class="max-w-sm rounded overflow-hidden shadow-lg mb-10 min-w-96"
                      key={command.id}
                    >
                      <div class="flex flex-col">
                        <span class="px-6 font-bold italic">
                          Identificador: {command.orderId}
                        </span>
                        {command?.table && (
                          <span class="px-6 font-bold underline">
                            Mesa: {command.table}
                          </span>
                        )}
                      </div>

                      {command.order.map((ord) => (
                        <div key={ord.id}>
                          <div class="px-6 flex flex-col">
                            <span class="font-bold">
                              {ord.amount}x {ord.name}
                            </span>
                            <span class="text-gray-700">{ord.ingredients}</span>
                          </div>
                        </div>
                      ))}

                      <span class="px-6 text-sm italic my-5">
                        {command.date}
                      </span>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CashierPage;
