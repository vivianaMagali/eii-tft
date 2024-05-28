import React, { useState } from "react";

const MenuCard = ({ product, orders, setOrders }) => {
  const [quantity, setQuantity] = useState(0);

  const addProduct = () => {
    setQuantity(quantity + 1);
    let updatedOrders = [...orders];
    const existingItem = updatedOrders.find(
      (item) => item.name === product.name,
    );

    if (existingItem) {
      updatedOrders = updatedOrders.map((item) =>
        item.name === product.name
          ? { ...item, amount: item.amount + 1 }
          : item,
      );
    } else {
      updatedOrders = [...orders, { ...product, amount: 1 }];
    }
    setOrders(updatedOrders);
  };

  const removeProduct = () => {
    setQuantity(quantity - 1);
    let updatedOrders = [...orders];
    updatedOrders = updatedOrders
      .map((item) => {
        if (item.name === product.name) {
          if (item.amount !== 1) {
            return { ...item, amount: item.amount - 1 };
          } else {
            return null;
          }
        } else {
          return item;
        }
      })
      .filter((item) => item !== null);
    setOrders(updatedOrders);
  };

  return (
    <div className="relative my-5 mx-5 flex w-96 h-52 flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div className="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700">
        <img
          src={product.img}
          alt="maravilloso"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-6">
        <h6 className="mb-4 block font-sans text-base font-semibold uppercase leading-relaxed tracking-normal text-teal-500 antialiased">
          {product.name}
        </h6>
        <h4 className="mb-2 block font-sans text-sm font-normal leading-relaxed text-gray-700 antialiased h-20">
          {product.ingredients}
        </h4>
        <div className="flex flex-row items-center justify-between">
          <h3>{product.price}€</h3>
          <div className="left-0 flex flex-row items-center justify-end">
            {quantity !== 0 && (
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
            )}
            <span className="font-sans text-base font-semibold">
              {quantity}
            </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
