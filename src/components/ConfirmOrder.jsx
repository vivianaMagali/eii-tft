import React, { useContext, useState } from "react";
import PlacesPicker from "@tasiodev/react-places-autocomplete";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { useParams } from "react-router";
import { formatDate } from "../utils";
import { FirebaseContext } from "../firebase";
import { db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const ConfirmOrder = ({
  orders,
  setShowConfirmOrderModal,
  restaurant,
  setShowOrderSummary,
  total,
}) => {
  const [selectedOptionPlace, setSelectedOptionPlace] = useState("home");
  const [place, setPlace] = useState(null);
  const { id } = useParams();
  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const saveOrder = async (e) => {
    e.preventDefault();
    var inputElement = document.querySelector(
      ".my-2 .Field_container__t90fB .Field_field__DxK5r input",
    );
    var inputValue = inputElement.value;

    const dateNow = new Date();
    const docData = {
      date: formatDate(dateNow),
      order: orders,
      state: 1,
      userUid: user.uid,
      category: e.target.category.value,
      placeId: place,
      direction: inputValue,
      detail: e.target.detail.value,
      description: e.target.description.value,
    };

    try {
      const comandasRef = collection(db, "restaurants", id, "comandas");
      const docRef = await addDoc(comandasRef, docData);
      const updatedDocData = {
        ...docData,
        uidOrder: docRef.id,
      };
      await setDoc(docRef, updatedDocData);
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

              {orders.map((order, index) => (
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
                Total: {total}€
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                ¿Dónde deseas comerlo?
              </label>
              <select
                id="category"
                name="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={selectedOptionPlace}
                onChange={(e) => setSelectedOptionPlace(e.target.value)}
              >
                <option defaultValue="home" value="home">
                  A domicilio
                </option>
                <option value="pickup">Recogida en local</option>
                <option value="local">En el local</option>
              </select>
            </div>
            {selectedOptionPlace === "home" && (
              <div className="my-2">
                <PlacesPicker
                  id="prueba"
                  gMapsKey="AIzaSyDbKaQl6IEo_hLQ-qBLV-uPEEaIvbe8ULk"
                  onChange={setPlace}
                  placeholder="Busca una dirección..."
                  mapExpanded={true}
                  disableMap={true}
                />
                <input
                  required
                  className="bg-gray-50 border my-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Nº piso, portal, etc."
                  name="detail"
                />
              </div>
            )}
            {selectedOptionPlace === "pickup" && (
              <span>{restaurant.basic_information.direction}</span>
            )}
            {selectedOptionPlace === "local" && (
              <>
                <span
                  htmlFor="name"
                  className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {restaurant.basic_information.direction}
                </span>
              </>
            )}
            <div className="col-span-2">
              <label
                htmlFor="description"
                className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                ¿Deseas añadir un comentario?
              </label>
              <textarea
                id="description"
                rows="4"
                name="description"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                placeholder="Ej: el bocadillo partido a la mitad"
              ></textarea>
            </div>
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
