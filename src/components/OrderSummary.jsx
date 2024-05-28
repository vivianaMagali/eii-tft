import React, { useState, useEffect } from "react";

const OrderSummary = ({ orders, setShowModal }) => {
  const [total, setTotal] = useState();

  const confirmOrder = () => {
    setShowModal(true);
  };

  useEffect(() => {
    setTotal(
      orders.reduce((acc, order) => acc + order.amount * order.price, 0),
    );
  }, [orders]);

  return (
    <div className="w-1/3 mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-teal-600 text-white py-4 px-6 text-center">
          <h1 className="text-2xl font-semibold">Tu pedido</h1>
        </div>
        <div className="py-8 px-6">
          {orders.map((order, index) => (
            <ul className="mb-8" key={`${order.name + "-" + index}`}>
              <li className="flex justify-between mb-2">
                <div>
                  <span className="font-semibold">x{order.amount}</span>
                  <span> {order.name}</span>
                </div>
                <span className="text-gray-600">
                  {order.amount * order.price}€
                </span>
              </li>
              {/* <li className="flex justify-between mb-2">
                <button
                  className="flex select-none items-center rounded-lg py-3 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-teal-500 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => removeProduct()}
                >
                  <svg
                    className="h-6 w-6 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button
                  className="flex select-none items-center rounded-lg py-3 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-teal-500 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => addProduct()}
                >
                  <svg
                    className="h-6 w-6 text-teal-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </li> */}
            </ul>
          ))}
          <div>
            <span className="font-semibold flex justify-end">
              Total: {total?.toFixed(2)}€
            </span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => confirmOrder()}
              // className="font-bold text-white bg-teal-600 py-2 px-4 rounded-e-full rounded-s-full hover:bg-teal-400"
              data-modal-target="crud-modal"
              data-modal-toggle="crud-modal"
              className="block text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
            >
              Confirmar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
