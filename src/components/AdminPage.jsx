import React, { useEffect, useState, useContext } from "react";
import { FirebaseContext } from "../firebase";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import InventoryChart from "./InventoryChart";
import ProductForm from "./ProductForm";
import ModalConfirmation from "./ModalConfirmation";
import Header from "./Header";
import { getProductType } from "../utils";

const AdminPage = () => {
  const { user } = useContext(FirebaseContext);
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productSelected, setProductSelected] = useState();
  const [products, setProducts] = useState([]);
  const [collectionSelected, setCollectionSelected] = useState();
  const [showModalConfirm, setShowConfirmOrderModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const inventoryRef = collection(
      db,
      "restaurants",
      user?.uidRestaurant,
      "inventory",
    );

    const unsubscribeInventory = onSnapshot(inventoryRef, (snapshot) => {
      setInventory(snapshot.docs.map((doc) => doc.data()));
    });

    const restaurantDocRef = doc(db, "restaurants", user?.uidRestaurant);

    const menuCollectionRef = collection(restaurantDocRef, "menu");

    const unsubscribeMenu = onSnapshot(menuCollectionRef, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => doc.data()));
    });

    return () => {
      unsubscribeInventory();
      unsubscribeMenu();
    };
  }, [user]);

  const deleteProduct = async () => {
    setShowConfirmOrderModal(true);
  };

  const confirmAction = async () => {
    const docRef = doc(
      db,
      "restaurants",
      user?.uidRestaurant,
      collectionSelected,
      productSelected.uid,
    );
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.log("error", error);
    }
    setShowConfirmOrderModal(false);
  };

  return (
    <>
      <Header />
      <InventoryChart inventoryData={inventory}></InventoryChart>
      <div class="m-5 flex flex-col justify-center items-center">
        <div class="mt-5 mx-5">
          <button
            onClick={() => {
              setShowForm(true);
              setProductSelected(undefined);
              setCollectionSelected("inventory");
            }}
            class="px-2 py-2 text-white rounded font-bold bg-teal-600"
          >
            Añadir producto al inventario
          </button>
          {showForm && (
            <ProductForm
              setShowForm={setShowForm}
              productSelected={productSelected}
              collectionSelected={collectionSelected}
            ></ProductForm>
          )}
        </div>
        <h1 class="font-bold text-xl m-5">Listado del inventario</h1>
        <table class="table-auto bg-white shadow-md rounded-lg mx-5 p-5 w-full">
          <thead>
            <tr class="text-left">
              <th>Nombre</th>
              <th>Ingredientes</th>
              <th>Precio</th>
              <th>Cantidad (kg o unidad)</th>
              <th>Tipo</th>
              <th>Productor</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((product) => (
              <tr key={product.uid}>
                <td>{product.name}</td>
                <td>{product.ingredients}</td>
                <td>{product.price}€</td>
                <td>{product.amount}</td>
                <td>{getProductType(product.type)}</td>
                <td>{product.producer}</td>
                <td>
                  <button
                    onClick={() => {
                      deleteProduct();
                      setProductSelected(product);
                      setCollectionSelected("inventory");
                    }}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setCollectionSelected("inventory");
                      setProductSelected(product);
                    }}
                  >
                    <svg
                      class="h-5 w-5 text-teal-500"
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
                      <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />{" "}
                      <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div class="mt-5 mx-5">
          <button
            onClick={() => {
              setShowForm(true);
              setProductSelected(undefined);
              setCollectionSelected("menu");
            }}
            class="px-2 py-2 mt-4 text-white rounded font-bold bg-teal-600"
          >
            Añadir producto a la carta
          </button>
          {showForm && (
            <ProductForm
              setShowForm={setShowForm}
              productSelected={productSelected}
              collectionSelected={collectionSelected}
            ></ProductForm>
          )}
        </div>
        <h1 class="font-bold text-xl m-5">Carta disponible</h1>
        <table class="table-auto bg-white shadow-md rounded-lg mx-5 p-5 w-full">
          <thead>
            <tr class="text-left">
              <th></th>
              <th>Nombre</th>
              <th>Ingredientes</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {products.map((menu) => (
              <tr key={menu.uid}>
                <td>
                  <img src={menu.img} class="w-16" alt="img-product" />
                </td>
                <td>{menu.name}</td>
                <td>{menu.ingredients}</td>
                <td>{menu.price}€</td>
                <td>
                  <button
                    onClick={() => {
                      deleteProduct();
                      setProductSelected(menu);
                      setCollectionSelected("menu");
                    }}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setProductSelected(menu);
                      setCollectionSelected("menu");
                    }}
                  >
                    <svg
                      class="h-5 w-5 text-teal-500"
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
                      <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />{" "}
                      <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModalConfirm && (
        <ModalConfirmation
          title={"Eliminar producto"}
          setShowConfirmOrderModal={setShowConfirmOrderModal}
          confirmAction={confirmAction}
        />
      )}
    </>
  );
};

export default AdminPage;
