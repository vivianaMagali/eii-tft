import React, { useState } from "react";
import PlacesPicker from "@tasiodev/react-places-autocomplete";

const ConfirmOrder = ({ orders, setShowModal }) => {
  const [selectedOptionPlace, setSelectedOptionPlace] = useState("home");
  const [value, setValue] = useState(null);

  return (
    <div
      id="crud-modal"
      tabindex="-1"
      aria-hidden="true"
      className="fixed z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white w-96 rounded flex flex-col justify-center items-center gap-5">
        <div className="relative w-full bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Confirmar pedido
            </h3>
            <button
              type="button"
              onClick={() => setShowModal(false)}
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
          <form className="p-4 md:p-5">
            <div className="col-span-2">
              <label
                for="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tus productos
              </label>

              {orders.map((order, index) => (
                <ul className="mb-8" key={`${order.name + "-" + index}`}>
                  <li className="flex justify-between mb-2">
                    <div>
                      <span className="font-semibold">x{order.amount}</span>
                      <span> {order.name}</span>
                      <span>({order.ingredients})</span>
                    </div>
                    <span className="text-gray-600">
                      {order.amount * order.price}€
                    </span>
                  </li>
                </ul>
              ))}
            </div>
            <div className="flex justify-end">
              <span
                for="price"
                className="block mb-2 font-bold text-sm text-gray-900 dark:text-white"
              >
                Total: 30€
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                for="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                ¿Dónde deseas comerlo?
              </label>
              <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={selectedOptionPlace}
                onChange={(e) => setSelectedOptionPlace(e.target.value)}
              >
                <option selected value="home">
                  A domicilio
                </option>
                <option value="pickup">Recogida en local</option>
                <option value="local">En el local</option>
              </select>
            </div>
            {selectedOptionPlace === "home" && (
              <div className="my-2">
                <PlacesPicker
                  gMapsKey="AIzaSyDbKaQl6IEo_hLQ-qBLV-uPEEaIvbe8ULk"
                  onChange={setValue}
                  placeholder="Busca una dirección..."
                  mapExpanded={true}
                  disableMap={true}
                />
              </div>
            )}
            {selectedOptionPlace === "pickup" && <p>pickup</p>}
            {selectedOptionPlace === "local" && (
              <>
                <span
                  for="name"
                  className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Dirección del restaurante (?)
                </span>
              </>
            )}
            <div className="col-span-2">
              <label
                for="description"
                className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                ¿Deseas añadir un comentario?
              </label>
              <textarea
                id="description"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
                placeholder="ej: el bocadillo partido a la mitad"
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
