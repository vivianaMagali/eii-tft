import React from "react";

const OrderSummary = ({ orders }) => {
  return (
    <div className="w-1/3 mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-teal-600 text-white py-4 px-6 text-center">
          <h1 className="text-2xl font-semibold">Tu pedido</h1>
        </div>
        <div className="py-8 px-6">
          {orders.map((order) => (
            <ul className="mb-8">
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
          <div className="flex justify-center">
            <button className="font-bold text-white bg-teal-600 py-2 px-4 rounded-e-full rounded-s-full hover:bg-teal-400">
              Confirmar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
