import React, { useContext } from "react";
import { FirebaseContext } from "../firebase";

const Record = ({ setShowRecord }) => {
  const { record } = useContext(FirebaseContext);

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      class="fixed z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div class="relative w-6/12 h-5/6 bg-white rounded overflow-auto">
        <div class="flex items-center justify-between p-4 rounded-lg">
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
          <span class="text-gray-900 text-lg font-semibold">Historial</span>
          <button
            type="button"
            onClick={() => setShowRecord(false)}
            class="text-gray-400 bg-transparent hover:bg-gray-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-white"
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
        {record.length > 0 ? (
          <div class="w-11/12 mx-auto">
            {record.map((record, index) => (
              <div
                key={index}
                class="bg-white shadow-md rounded overflow-hidden my-3 py-2"
              >
                <div class="bg-teal-600 text-white py-2 px-3 text-center">
                  <h1 class="text-2xl font-semibold">{record.name}</h1>
                </div>
                <span class="italic text-xs flex justify-end px-3">
                  {record.date}
                </span>
                {record.order.map((order, index) => (
                  <ul class="py-1 px-3" key={`${order.name + "-" + index}`}>
                    <li class="flex justify-between mb-1">
                      <div>
                        <span class="font-semibold">x{order.amount}</span>
                        <span> {order.name}</span>
                      </div>
                      <span class="text-gray-600">
                        {order.amount * order.price}€
                      </span>
                    </li>
                  </ul>
                ))}

                <div>
                  <span class="font-semibold flex justify-end px-3">
                    Total: {record.total?.toFixed(2)}€
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Record;
