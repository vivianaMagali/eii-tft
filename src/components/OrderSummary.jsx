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
  }, [orders, setTotal]);

  return (
    <div class="w-full">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="bg-teal-600 text-white py-4 px-6 text-center">
          <h1 class="text-2xl font-semibold">Tu pedido</h1>
        </div>
        {orders.length > 0 ? (
          <div class="py-8 px-6">
            {orders.map((order, index) => (
              <ul class="mb-8" key={`${order.name + "-" + index}`}>
                <li class="flex justify-between mb-2">
                  <div>
                    <span class="font-semibold">x{order.amount}</span>
                    <span> {order.name}</span>
                  </div>
                  <span class="text-gray-600">
                    {(order.amount * order.price)?.toFixed(2)}€
                  </span>
                </li>
              </ul>
            ))}
            <div>
              <span class="font-semibold flex justify-end">
                Total: {total?.toFixed(2)}€
              </span>
            </div>
            <div class="flex justify-center">
              <button
                onClick={() => confirmOrder()}
                data-modal-target="crud-modal"
                data-modal-toggle="crud-modal"
                class="block text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
              >
                Confirmar pedido
              </button>
            </div>
          </div>
        ) : (
          <p class="py-8 px-6">No tienes ningún producto añadido aún</p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
