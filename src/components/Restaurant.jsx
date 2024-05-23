import React, { useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router";
import { db } from "../firebase/firebase";

const Restaurant = () => {
  const { id } = useParams();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (!id) return;

    const restaurantDocRef = doc(db, "restaurants", id);

    const inventoryCollectionRef = collection(restaurantDocRef, "inventory");

    const unsubscribe = onSnapshot(inventoryCollectionRef, (snapshot) => {
      setMenu(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [id]);

  console.log("menu", menu);
  return <div>Restaurant: {id}</div>;
};

export default Restaurant;
