import React, { useEffect } from "react";

const OrderSummary = ({
  orders,
  setShowConfirmOrderModal,
  showOrderSummary,
  total,
  setTotal,
}) => {
  const confirmOrder = () => {
    setShowConfirmOrderModal(true);
  };

  useEffect(() => {
    setTotal(
      orders.reduce((acc, order) => acc + order.amount * order.price, 0),
    );
  }, [orders]);

  return showOrderSummary ? (
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
  ) : null;
};

export default OrderSummary;
