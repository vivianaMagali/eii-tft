import React, { useContext } from "react";
import { FirebaseContext } from "../firebase";

const Record = ({ setShowRecord }) => {
  const { record } = useContext(FirebaseContext);

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="fixed z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white h-5/6 w-6/12 rounded flex flex-col justify-center items-center overflow-y-scroll">
        <div className="relative w-full h-5/6 bg-white rounded-lg dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex justify-center items-center">
              <span>Historial</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowRecord(false)}
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
          {record.length > 0 ? (
            <div className="w-11/12 mx-auto">
              {record.map((record, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg overflow-hidden my-3 py-2"
                >
                  <div className="bg-teal-600 text-white py-2 px-3 text-center">
                    <h1 className="text-2xl font-semibold">{record.name}</h1>
                  </div>
                  <span className="italic text-xs flex justify-end px-3">
                    {record.date}
                  </span>
                  {record.order.map((order, index) => (
                    <ul
                      className="py-1 px-3"
                      key={`${order.name + "-" + index}`}
                    >
                      <li className="flex justify-between mb-1">
                        <div>
                          <span className="font-semibold">x{order.amount}</span>
                          <span> {order.name}</span>
                        </div>
                        <span className="text-gray-600">
                          {order.amount * order.price}€
                        </span>
                      </li>
                    </ul>
                  ))}

                  <div>
                    <span className="font-semibold flex justify-end px-3">
                      Total: {record.total?.toFixed(2)}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Record;
