import React, { useEffect, useState, useContext } from "react";
import logo from "../assets/logo-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../firebase";
import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import InventoryChart from "./InventoryChart";
import ProductForm from "./ProductForm";

const AdminPage = () => {
  const { user } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

    return () => {
      unsubscribeInventory();
    };
  }, [user]);

  const goProfile = () => {
    navigate("/profile");
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
      <div className="flex justify-end mt-5 mx-5">
        <button
          onClick={() => setShowForm(true)}
          className="px-2 py-2 bg-teal-300 rounded font-bold text-teal-800"
        >
          Añadir producto
        </button>
        {showForm && <ProductForm setShowForm={setShowForm}></ProductForm>}
      </div>
      <InventoryChart inventoryData={inventory}></InventoryChart>
    </>
  );
};

export default AdminPage;
