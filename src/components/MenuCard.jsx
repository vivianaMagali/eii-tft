import React, { useEffect, useState } from "react";

const MenuCard = ({ product, orders, setOrders, setShowOrderSummary }) => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (orders.length > 0) {
      setShowOrderSummary(true);
    }
  }, [orders, setShowOrderSummary]);

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
    <div class="relative my-5 mx-2 flex max-w-md h-72 flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
      <div class="relative w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700">
        <img
          src={product.img}
          alt="maravilloso"
          class="h-full w-full object-cover"
        />
      </div>
      <div class="flex flex-col justify-between p-6 w-full">
        <div>
          <h6 class="mb-4 block font-sans text-base font-semibold uppercase leading-relaxed tracking-normal text-teal-500 antialiased">
            {product.name}
          </h6>
          <h4 class="mb-2 block font-sans text-sm font-normal leading-relaxed text-gray-700 antialiased h-20">
            {product.ingredients}
          </h4>
        </div>
        <div class="flex flex-row items-center justify-between space-x-2 w-full">
          <h3>{product.price}€</h3>
          <div class="flex flex-row items-center">
            <button
              class={`${
                quantity === 0 ? "invisible" : "visible"
              } flex select-none items-center rounded-lg py-3 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-teal-500 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
              type="button"
              onClick={() => removeProduct()}
            >
              <svg
                class="h-6 w-6 text-teal-500"
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
            <span class="font-sans text-base font-semibold">{quantity}</span>
            <button
              class="flex select-none items-center rounded-lg py-3 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-teal-500 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={() => addProduct()}
            >
              <svg
                class="h-6 w-6 text-teal-500"
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
