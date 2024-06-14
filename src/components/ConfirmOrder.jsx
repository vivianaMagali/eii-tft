import React, { useContext, useState } from "react";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { useParams } from "react-router";
import { formatDate } from "../utils";
import { FirebaseContext } from "../firebase";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Direction from "./Direction";

const ConfirmOrder = ({
  orders,
  setShowConfirmOrderModal,
  restaurant,
  setShowOrderSummary,
  total,
}) => {
  const [place, setPlace] = useState(null);
  const { id } = useParams();
  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const saveOrder = async (e) => {
    e.preventDefault();
    const dateNow = new Date();
    var inputElement = document.querySelector(
      ".my-2 .Field_container__t90fB .Field_field__DxK5r input",
    );
    var inputValue = inputElement?.value;
    const getData = () => {
      if (e.target.category.value === "home") {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: 1,
          userUid: user.uid,
          category: e.target.category.value,
          placeId: place,
          direction: inputValue,
          detail: e.target.detail.value,
          description: e.target.description.value,
          name: restaurant.basic_information.name,
          total,
        };
      } else if (e.target.category.value === "local") {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: 1,
          userUid: user.uid,
          category: e.target.category.value,
          table: e.target.table.value,
          description: e.target.description.value,
          name: restaurant.basic_information.name,
          total,
        };
      } else {
        return {
          date: formatDate(dateNow),
          order: orders,
          state: 1,
          userUid: user.uid,
          direction: restaurant.basic_information.direction,
          category: e.target.category.value,
          description: e.target.description.value,
          name: restaurant.basic_information.name,
          total,
        };
      }
    };
    const docData = getData();
    try {
      const comandasRef = collection(db, "restaurants", id, "comandas");
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
      setShowConfirmOrderModal(false);
      setShowOrderSummary(false);
      navigate(`/restaurant/${restaurant.uid}`, { state: { restaurant } });
    } catch (e) {
      console.error("Error añadiendo el documento: ", e);
    }
  };

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white w-96 h-5/6 rounded flex flex-col justify-center items-center overflow-y-scroll">
        <div className="relative w-full h-5/6 bg-white rounded-lg dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirmar pedido
            </h3>
            <button
              type="button"
              onClick={() => setShowConfirmOrderModal(false)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
            >
              <svg
                className="w-3 h-3"
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
          <form className="p-4 md:p-5" onSubmit={saveOrder}>
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tus productos
              </label>

              {orders?.map((order, index) => (
                <ul className="mb-8" key={`${order.name + "-" + index}`}>
                  <li className="flex justify-between mb-2 text-sm">
                    <div>
                      <span className="font-semibold">x{order.amount}</span>
                      <span> {order.name}</span>
                    </div>
                    <span className="text-gray-600">
                      {order.amount * order.price}€
                    </span>
                  </li>
                  {order.ingredients && (
                    <span className="text-xs">({order.ingredients})</span>
                  )}
                </ul>
              ))}
            </div>
            <div className="flex justify-end">
              <span
                htmlFor="price"
                className="block mb-2 font-bold text-sm text-gray-900 dark:text-white"
              >
                Total: {total?.toFixed(2)}€
              </span>
            </div>
            <Direction restaurant={restaurant} />
            <div className="flex justify-center">
              <button
                type="submit"
                className="text-white mt-2 bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
              >
                Aceptar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
