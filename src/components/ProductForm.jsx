import React, { useState, useContext } from "react";
import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { FirebaseContext } from "../firebase";

const ProductForm = ({ setShowForm }) => {
  const { user } = useContext(FirebaseContext);
  const [selectedOptionProductType, setSelectedOptionProductType] =
    useState("main");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, ingredients, price, amount, producer, type } = e.target;
    const newProduct = {
      name: name.value,
      ingredients: ingredients.value,
      price: price.value,
      amountInventory: amount.value,
      producer: producer.value,
      type: type.value,
    };
    try {
      const inventoryRef = collection(
        db,
        "restaurants",
        user.uidRestaurant,
        "inventory",
      );
      const docRef = await addDoc(inventoryRef, newProduct);
      await updateDoc(docRef, { uidInventory: docRef.id });
    } catch (error) {
      console.log("error", error);
    }
  };
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              <span>Producto Nuevo</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
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
          <form
            className="m-4 flex flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <div className="w-full mb-1">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nombre*
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="w-full mb-1">
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ingredientes*
              </label>
              <input
                id="ingredients"
                name="ingredients"
                type="text"
                autoComplete="name"
                required
                className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="w-full mb-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Precio*
              </label>
              <input
                id="price"
                name="price"
                type="number"
                autoComplete="price"
                required
                className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="w-full mb-1">
              <label
                htmlFor="amount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cantidad*
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                autoComplete="amount"
                required
                className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="w-full mb-1">
              <label
                htmlFor="producer"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Productor*
              </label>
              <input
                id="producer"
                name="producer"
                type="text"
                autoComplete="producer"
                required
                className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="w-full mb-1">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Tipo de producto
              </label>
              <select
                id="type"
                name="type"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={selectedOptionProductType}
                onChange={(e) => setSelectedOptionProductType(e.target.value)}
              >
                <option value="starter">Entrante</option>
                <option value="main">Principal</option>
                <option value="main">Pizza</option>
                <option value="main">Hamburguesa</option>
                <option value="drink">Bebida</option>
              </select>
            </div>
            <button
              type="submit"
              className="flex justify-center rounded-md bg-teal-600 m-3 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Añadir producto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
