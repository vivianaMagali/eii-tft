import React, { useContext } from "react";
import order from "../assets/comida.png";
import { FirebaseContext } from "../firebase";
import { getKeyByValue, stateOrders } from "../utils";

const WaitTime = ({ setShowWaitTime }) => {
  const { record } = useContext(FirebaseContext);

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white rounded flex flex-col justify-center items-center">
        <div className="relative w-full h-5/6 bg-white rounded-lg dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <img src={order} alt="icon-order" className="h-12 w-12" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tiempo de espera
            </h3>
            <button
              type="button"
              onClick={() => setShowWaitTime(false)}
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
        </div>
        {record.map(
          (rcd) =>
            rcd.state !== stateOrders.TERMINADO && (
              <div className="my-2 flex flex-col">
                <span>Restaurante: {rcd.name}</span>
                <span>Pedido: {rcd.orderId}</span>
                <span>Estado: {getKeyByValue(rcd.state)}</span>
                <span>Tiempo restante aprox: {rcd.waitTime} min.</span>
              </div>
            ),
        )}
      </div>
    </div>
  );
};

export default WaitTime;
