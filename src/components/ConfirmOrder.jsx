import React, { useContext, useState } from "react";
import { collection, addDoc, setDoc, getDocs } from "firebase/firestore";
import { useParams } from "react-router";
import { formatDate, generateUID, stateOrders } from "../utils";
import { FirebaseContext } from "../firebase";
import { db } from "../firebase/firebase";
import Direction from "./Direction";

const ConfirmOrder = ({
  orders,
  setOrders,
  setShowConfirmOrderModal,
  restaurant,
  setShowOrderSummary,
  total,
  resetQuantities,
}) => {
  const [place, setPlace] = useState(null);
  const { id } = useParams();
  const { user, token } = useContext(FirebaseContext);
  console.log("token", token);
  const saveOrder = async (e) => {
    e.preventDefault();
    const dateNow = new Date();
    var inputElement = document.querySelector(
      ".my-2 .Field_container__t90fB .Field_field__DxK5r input",
    );
    var inputValue = inputElement?.value;
    const comandasRef = collection(db, "restaurants", id, "comandas");
    const querySnapshot = await getDocs(comandasRef);

    const orderList = querySnapshot.size;
    const waitTime = Math.floor(orderList * restaurant.waitTime);

    const getData = () => {
      if (e.target.category.value === "home") {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: stateOrders.RECIBIDO,
          userUid: user.uid,
          category: e.target.category.value,
          placeId: place,
          direction: inputValue,
          detail: e.target.detail.value,
          description: e.target.description.value,
          name: restaurant.basic_information.name,
          total,
          orderId: generateUID(),
          waitTime: waitTime,
          paymentStatus: false,
          token,
        };
      } else if (e.target.category.value === "local") {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: stateOrders.RECIBIDO,
          userUid: user.uid,
          category: e.target.category.value,
          table: e.target.table.value,
          description: e.target.description.value,
          name: restaurant.basic_information.name,
          total,
          orderId: generateUID(),
          waitTime: waitTime,
          paymentStatus: false,
          token,
        };
      } else {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: stateOrders.RECIBIDO,
          userUid: user.uid,
          direction: restaurant.basic_information.direction,
          category: e.target.category.value,
          description: e.target.description.value,
          name: restaurant.basic_information.name,
          total,
          orderId: generateUID(),
          waitTime: waitTime,
          paymentStatus: false,
          token,
        };
      }
    };
    const docData = getData();
    console.log("docData", docData);
    try {
      const docRef = await addDoc(comandasRef, docData);
      const updatedDocData = {
        ...docData,
        uidOrder: docRef.id,
      };
      await setDoc(docRef, updatedDocData);
      const recordRef = collection(db, "users", user.uid, "record");
      const { userUid, ...rest } = docData;
      const docRecordRef = await addDoc(recordRef, rest);
      const updatedRecordDocData = {
        ...rest,
        userUid: user.uid,
        recordId: docRecordRef.id,
      };
      await setDoc(docRef, updatedDocData);
      await setDoc(docRecordRef, updatedRecordDocData);
      setOrders([]);
      setShowConfirmOrderModal(false);
      setShowOrderSummary(false);
      resetQuantities();
    } catch (e) {
      console.error("Error añadiendo el documento: ", e);
    }
  };

  return (
    <div class="fixed z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div class="relative min-w-96 max-h-full bg-white rounded overflow-auto">
        <div class="flex items-center justify-between p-4 rounded-lg">
          <h3 class="text-gray-900 text-lg font-semibold">Confirmar pedido</h3>
          <button
            type="button"
            onClick={() => setShowConfirmOrderModal(false)}
            class="bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            data-modal-toggle="crud-modal"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
        <form class="p-4 md:p-5" onSubmit={saveOrder}>
          <div class="col-span-2">
            <label htmlFor="name" class="block mb-2 text-sm font-medium">
              Tus productos
            </label>

            {orders?.map((order, index) => (
              <ul class="mb-8" key={`${order.name + "-" + index}`}>
                <li class="flex justify-between mb-2 text-sm">
                  <div>
                    <span class="font-semibold">x{order.amount}</span>
                    <span> {order.name}</span>
                  </div>
                  <span class="">
                    {(order.amount * order.price)?.toFixed(2)}€
                  </span>
                </li>
                {order.ingredients && (
                  <span class="text-xs">({order.ingredients})</span>
                )}
              </ul>
            ))}
          </div>
          <div class="flex justify-end">
            <span htmlFor="price" class="block mb-2 font-bold text-sm">
              Total: {total?.toFixed(2)}€
            </span>
          </div>
          <Direction restaurant={restaurant} setPlace={setPlace} />
          <div class="flex justify-center">
            <button
              type="submit"
              class="text-white mt-2 bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
            >
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmOrder;
