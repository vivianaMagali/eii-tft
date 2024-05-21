import React, { useContext, useEffect, useState } from "react";
import appFirebase from "../firebase/credentials";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import logo from "../assets/logo-removebg-preview.png";
import { FirebaseContext } from "../firebase";
import RestaurantCard from "./RestaurantCard";
import RestaurantSearch from "./RestaurantSearch";

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
      <div className="flex justify-between px-3 py-3 items-center w-full bg-gradient-to-l from-teal-600 to-teal-100 ">
        <img className="w-12" src={logo} alt="Your Company" />
        <RestaurantSearch restaurantList={restaurantList} />
      </div>
      <h1 className="font-bold text-xl mb-2">Restaurantes</h1>
      <div className="w-full flex flex-row flex-wrap">
        {restaurantList?.length > 0 &&
          restaurantList?.map((restaurant) => (
            <div className="w-auto p-2" key={restaurant.uid}>
              <RestaurantCard restaurant={restaurant} />
            </div>
          ))}
      </div>
      <button onClick={() => signOut(auth)}>cerrar sesión</button>
    </>
  );
};

export default Home;
