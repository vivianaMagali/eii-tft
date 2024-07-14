import React from "react";

const ModalConfirmation = ({
  title,
  setShowConfirmOrderModal,
  confirmAction,
}) => {
  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      class="fixed z-15 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div class="bg-white rounded flex flex-col justify-center items-center">
        <div class="relative w-full h-5/6 bg-white rounded-lg">
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 class="text-lg font-semibold dark:text-white flex justify-center items-center">
              <svg
                class="h-8 w-8 text-teal-500"
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
                <circle cx="12" cy="12" r="9" />{" "}
                <line x1="12" y1="8" x2="12" y2="12" />{" "}
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span class="ml-1 text-black">{title}</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowConfirmOrderModal(false)}
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
          <span class="text-lg mx-5 mt-5 dark:text-black flex justify-center items-center">
            ¿Estás seguro de realizar esta acción?
          </span>
          <div class="flex justify-center items-center p-4">
            <button
              class="flex justify-center rounded-md bg-gray-400 m-3 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              onClick={() => setShowConfirmOrderModal(false)}
            >
              <span>Cancelar</span>
            </button>
            <button
              class="flex justify-center rounded-md bg-teal-600 m-3 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              onClick={() => confirmAction()}
            >
              <span>Aceptar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;
