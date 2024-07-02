import React, { useState, useContext } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { FirebaseContext } from "../firebase";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import ModalConfirmation from "./ModalConfirmation";

const ProductForm = ({ collectionSelected, setShowForm, productSelected }) => {
  const { user } = useContext(FirebaseContext);
  const [selectedOptionProductType, setSelectedOptionProductType] = useState(
    productSelected ? productSelected?.type : "main",
  );

  const objectInventory = {
    name: productSelected?.name,
    ingredients: productSelected?.ingredients,
    price: productSelected?.price,
    amount: productSelected?.amount,
    producer: productSelected?.producer,
    type: productSelected?.type,
  };

  const objectMenu = {
    name: productSelected?.name,
    ingredients: productSelected?.ingredients,
    price: productSelected?.price,
    img: productSelected?.img,
  };

  const objectDrink = {
    name: productSelected?.name,
    price: productSelected?.price,
    img: productSelected?.img,
  };

  const defaultValueForm = () => {
    if (collectionSelected === "inventory") {
      return objectInventory;
    } else if (collectionSelected === "drinks") {
      return objectDrink;
    } else if (collectionSelected === "menu") {
      return objectMenu;
    }
  };

  const [formData, setFormData] = useState(defaultValueForm());
  const [showModalConfirm, setShowConfirmOrderModal] = useState(false);

  const uploadImage = async (image) => {
    const imageRef = ref(storage, image.name);
    try {
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      // const url = await getDownloadURL(imageRef);
      // setFormData((prevData) => ({
      //   ...prevData,
      //   img: url,
      // }));
      return downloadURL;
    } catch (error) {
      console.log("Upload failed", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? URL.createObjectURL(files[0]) : value,
    }));
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
      if (isEditMode) {
        const docRef = doc(collectionRef, productSelected.uid);
        await updateDoc(docRef, formData);
      } else {
        const collectionRef = collection(
          db,
          "restaurants",
          user.uidRestaurant,
          collectionSelected,
        );

        const docRef = await addDoc(collectionRef, formData);
        if (collectionSelected === "inventory") {
          await updateDoc(docRef, { uid: docRef.id });
        } else {
          await updateDoc(docRef, {
            uid: docRef.id,
            img: uploadImage(formData?.img),
          });
        }
      }
      setShowForm(false);
    } catch (error) {
      console.log("error", error);
    }
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
      className="fixed z-10 inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="bg-white h-5/6 w-6/12 rounded flex flex-col justify-center items-center overflow-y-scroll">
        <div className="relative w-full h-5/6 bg-white rounded-lg dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              <span>
                {isEditMode ? "Modificar producto" : "Añadir Producto"}
              </span>
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
                defaultValue={productSelected?.name}
                onChange={handleInputChange}
                required
                className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
              />
            </div>
            {collectionSelected !== "drinks" && (
              <div className="w-full mb-1">
                <label
                  htmlFor="ingredients"
                  className="block text-sm font-medium leading-6 text-gray-900"
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
                  className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
                />
              </div>
            )}

            <div className="w-full mb-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Precio*
              </label>
              <div className="flex items-center">
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  autoComplete="price"
                  onChange={handleInputChange}
                  defaultValue={productSelected?.price}
                  required
                  className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
                />
                <span>€</span>
              </div>
            </div>
            {collectionSelected === "drinks" ||
            collectionSelected === "menu" ? (
              <div className="w-full mb-1">
                <div className="flex items-center">
                  {formData?.img && (
                    <img
                      src={formData?.img}
                      className="w-16 mr-5 mt-3"
                      alt="img"
                    />
                  )}
                  <input
                    required
                    // className="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
                    name="img"
                    id="img"
                    type="file"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            ) : (
              <>
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
                    onChange={handleInputChange}
                    defaultValue={productSelected?.amount}
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
                    onChange={handleInputChange}
                    defaultValue={productSelected?.producer}
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
                    defaultValue={selectedOptionProductType}
                    onChange={(e) =>
                      setSelectedOptionProductType(e.target.value)
                    }
                  >
                    <option value="starter">Entrante</option>
                    <option value="main">Principal</option>
                    <option value="main">Pizza</option>
                    <option value="main">Hamburguesa</option>
                    <option value="drink">Bebida</option>
                  </select>
                </div>{" "}
              </>
            )}

            <button
              type="submit"
              className="flex justify-center rounded-md bg-teal-600 m-3 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              {isEditMode ? "Actualizar producto" : "Añadir producto"}
            </button>
          </form>
        </div>
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
