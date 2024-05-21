import React, { useContext, useEffect, useState } from "react";
import appFirebase from "../firebase/credentials";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

import { FirebaseContext } from "../firebase";
import RestaurantCard from "./RestaurantCard";

const auth = getAuth(appFirebase);

const Home = () => {
  const [restaurantList, setRestaurantList] = useState();

  // const { firebase } = useContext(FirebaseContext);
  // console.log("firebase", firebase);

  useEffect(() => {
    const pruebaRef = collection(db, "restaurants");
    getDocs(pruebaRef).then((result) => {
      setRestaurantList(
        result.docs.map((doc) => {
          return doc.data();
        }),
      );
    });
  }, []);

  console.log("restaurantList", restaurantList);
  return (
    <>
      <h1 className="uppercase font-bold text-xl mb-2">Restaurantes</h1>
      {restaurantList?.length > 0 &&
        restaurantList?.map((restaurant) => (
          <RestaurantCard key={restaurant.uid} restaurant={restaurant} />
        ))}
      <button onClick={() => signOut(auth)}>cerrar sesión</button>
    </>
  );
};

export default Home;
