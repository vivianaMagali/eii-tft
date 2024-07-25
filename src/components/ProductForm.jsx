import React, { useState, useContext } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import {
  db,
  storage,
  getDownloadURL,
  uploadBytes,
  ref,
} from "../firebase/firebase";
import { FirebaseContext } from "../firebase";
import ModalConfirmation from "./ModalConfirmation";
import { typeProducts } from "../utils";

const ProductForm = ({ collectionSelected, setShowForm, productSelected }) => {
  const { user } = useContext(FirebaseContext);
  const objectInventory = {
    name: productSelected?.name,
    ingredients: productSelected?.ingredients,
    price: productSelected?.price,
    amount: productSelected?.amount,
    producer: productSelected?.producer,
    type: productSelected?.type || typeProducts.other,
  };

  const objectMenu = {
    name: productSelected?.name,
    ingredients: productSelected?.ingredients,
    price: productSelected?.price,
    img: productSelected?.img,
    type: productSelected?.type || typeProducts.starter,
  };

  const defaultValueForm = () => {
    if (collectionSelected === "inventory") {
      return objectInventory;
    } else if (collectionSelected === "menu") {
      return objectMenu;
    }
  };

  const [formData, setFormData] = useState(defaultValueForm());
  const [showModalConfirm, setShowConfirmOrderModal] = useState(false);

  const uploadImage = async (image) => {
    const imageRef = ref(storage, "images/" + image.name);
    try {
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.log("Upload failed", error);
      throw error;
    }
  };

  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const url = await uploadImage(files[0]);
      setFormData((prevData) => ({
        ...prevData,
        [name]: url,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const isEditMode = !!productSelected;
  const confirmAction = async () => {
    try {
      const collectionRef = collection(
        db,
        "restaurants",
        user.uidRestaurant,
        collectionSelected,
      );
      // Eliminar el campo ingredients si el tipo es Bebida
      let formDataUpdate;
      if (formData.type === typeProducts.drink) {
        const { ingredients, ...rest } = formData;
        formDataUpdate = { ...rest };
      }
      if (isEditMode) {
        const docRef = doc(collectionRef, productSelected.uid);
        await updateDoc(docRef, formDataUpdate || formData);
      } else {
        const collectionRef = collection(
          db,
          "restaurants",
          user.uidRestaurant,
          collectionSelected,
        );
        const docRef = await addDoc(collectionRef, formDataUpdate || formData);
        await updateDoc(docRef, { uid: docRef.id });
      }
    } catch (error) {
      console.log("error", error);
    }
    setShowForm(false);
    setShowConfirmOrderModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmOrderModal(true);
  };

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      class="fixed z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div class="relative w-6/12 bg-white rounded overflow-auto">
        <div class="flex items-center justify-between p-4 rounded-lg">
          <h3 class="text-gray-900 text-lg font-semibold">
            {isEditMode ? "Modificar producto" : "Añadir Producto"}
          </h3>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
        <form
          class="m-4 flex flex-col justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div class="w-full mb-1">
            <label
              htmlFor="type"
              class="block text-sm font-medium text-gray-900"
            >
              Tipo de producto
            </label>
            <select
              id="type"
              name="type"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
              defaultValue={productSelected && productSelected?.type}
              onChange={handleInputChange}
            >
              <option value={typeProducts.main}>{typeProducts.main}</option>
              <option value={typeProducts.starter}>
                {typeProducts.starter}
              </option>
              <option value={typeProducts.pizza}>{typeProducts.pizza}</option>
              <option value={typeProducts.hambur}>{typeProducts.hambur}</option>
              <option value={typeProducts.drink}>{typeProducts.drink}</option>
            </select>
          </div>
          <div class="w-full mb-1">
            <label
              htmlFor="name"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Nombre*
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              defaultValue={productSelected?.name}
              onChange={handleInputChange}
              required
              class="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
            />
          </div>
          {formData?.type !== typeProducts.drink && (
            <div class="w-full mb-1">
              <label
                htmlFor="ingredients"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Ingredientes
              </label>
              <input
                id="ingredients"
                name="ingredients"
                type="text"
                autoComplete="name"
                onChange={handleInputChange}
                defaultValue={productSelected?.ingredients}
                class="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
              />
            </div>
          )}

          <div class="w-full mb-1">
            <label
              htmlFor="price"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Precio*
            </label>
            <div class="flex items-center">
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                autoComplete="price"
                onChange={handleInputChange}
                defaultValue={productSelected?.price}
                required
                class="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
              />
              <span>€</span>
            </div>
          </div>
          {collectionSelected === "drinks" || collectionSelected === "menu" ? (
            <div class="w-full mb-1">
              <div class="flex items-center">
                {formData?.img && (
                  <img src={formData?.img} class="w-16 mr-5 mt-3" alt="img" />
                )}
                <input
                  required={formData?.img ? false : true}
                  name="img"
                  id="img"
                  type="file"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ) : (
            <>
              <div class="w-full mb-1">
                <label
                  htmlFor="amount"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Cantidad*
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  autoComplete="amount"
                  onChange={handleInputChange}
                  defaultValue={productSelected?.amount}
                  required
                  class="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div class="w-full mb-1">
                <label
                  htmlFor="producer"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Productor*
                </label>
                <input
                  id="producer"
                  name="producer"
                  type="text"
                  autoComplete="producer"
                  onChange={handleInputChange}
                  defaultValue={productSelected?.producer}
                  required
                  class="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            class="flex justify-center rounded-md bg-teal-600 m-3 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            {isEditMode ? "Actualizar producto" : "Añadir producto"}
          </button>
        </form>
      </div>
      {showModalConfirm && (
        <ModalConfirmation
          title={isEditMode ? "Modificar producto" : "Añadir Producto"}
          setShowConfirmOrderModal={setShowConfirmOrderModal}
          confirmAction={confirmAction}
        />
      )}
    </div>
  );
};

export default ProductForm;
