import React, { useEffect, useState, useContext } from "react";
import logo from "../assets/logo-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../firebase";
import {
  collection,
  getDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import InventoryChart from "./InventoryChart";
import ProductForm from "./ProductForm";

const AdminPage = () => {
  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productSelected, setProductSelected] = useState();
  const [menus, setMenus] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [collectionSelected, setCollection] = useState();

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
      setMenus(snapshot.docs.map((doc) => doc.data()));
    });

    const drinksCollectionRef = collection(restaurantDocRef, "drinks");

    const unsubscribeDrinks = onSnapshot(drinksCollectionRef, (snapshot) => {
      setDrinks(snapshot.docs.map((doc) => doc.data()));
    });

    return () => {
      unsubscribeInventory();
      unsubscribeMenu();
      unsubscribeDrinks();
    };
  }, [user]);

  const goProfile = () => {
    navigate("/profile");
  };

  const deleteProduct = async (nameCollection, uid) => {
    const docRef = doc(
      db,
      "restaurants",
      user?.uidRestaurant,
      nameCollection,
      uid,
    );
    try {
      await deleteDoc(docRef);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="flex justify-between px-3 py-3 items-center w-full bg-gradient-to-l from-teal-600 to-teal-100">
        <img className="w-16" src={logo} alt="Your Company" />
        <button onClick={() => goProfile()}>
          <svg
            className="h-10 w-10 text-teal-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <InventoryChart inventoryData={inventory}></InventoryChart>
      <div className="m-5 flex flex-col justify-center items-center">
        <div className="mt-5 mx-5">
          <button
            onClick={() => {
              setShowForm(true);
              setProductSelected(undefined);
              setCollection("inventory");
            }}
            className="px-2 py-2 text-white rounded font-bold bg-teal-600"
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
        <h1 className="font-bold text-xl m-5">Listado del inventario</h1>
        <table className="table-auto bg-white shadow-md rounded-lg mx-5 p-5 w-full">
          <thead className="">
            <tr>
              <th className="">Nombre</th>
              <th className="">Ingredientes</th>
              <th>Precio</th>
              <th>Cantidad</th>
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
                <td>{product.price}</td>
                <td>{product.amount}</td>
                <td>{product.type}</td>
                <td>{product.producer}</td>
                <td>
                  <button
                    onClick={() => deleteProduct("inventory", product.uid)}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setCollection("inventory");
                      setProductSelected(product);
                    }}
                  >
                    <svg
                      className="h-5 w-5 text-teal-500"
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
        <div className="mt-5 mx-5">
          <button
            onClick={() => {
              setShowForm(true);
              setProductSelected(undefined);
              setCollection("menu");
            }}
            className="px-2 py-2 text-white rounded font-bold bg-teal-600"
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
        <h1 className="font-bold text-xl m-5">Carta disponible</h1>
        <table className="table-auto bg-white shadow-md rounded-lg mx-5 p-5 w-full">
          <thead className="">
            <tr>
              <th></th>
              <th className="">Nombre</th>
              <th className="">Ingredientes</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.uid}>
                <td>
                  <img src={menu.img} className="w-16" alt="img-product" />
                </td>
                <td>{menu.name}</td>
                <td>{menu.ingredients}</td>
                <td>{menu.price}€</td>
                <td>
                  <button onClick={() => deleteProduct("menu", menu.uid)}>
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
                      setCollection("menu");
                    }}
                  >
                    <svg
                      className="h-5 w-5 text-teal-500"
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
            {drinks.map((drink) => (
              <tr key={drink.uid}>
                <td>
                  <img src={drink.img} className="w-14" alt="img-product" />
                </td>
                <td>{drink.name}</td>
                <td>{drink.ingredients}</td>
                <td>{drink.price}€</td>
                <td>
                  <button onClick={() => deleteProduct("drinks", drink.uid)}>
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setProductSelected(drink);
                      setCollection("drinks");
                    }}
                  >
                    <svg
                      className="h-5 w-5 text-teal-500"
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
    </>
  );
};

export default AdminPage;
