import React, { useContext, useEffect, useState } from "react";
import appFirebase from "../firebase/credentials";
import { getAuth, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import logo from "../assets/logo-removebg-preview.png";
import { FirebaseContext } from "../firebase";
import RestaurantCard from "./RestaurantCard";
import RestaurantSearch from "./RestaurantSearch";
import { useNavigate } from "react-router-dom";

const auth = getAuth(appFirebase);

const Home = () => {
  const [restaurantList, setRestaurantList] = useState();
  const navigate = useNavigate();

  // const { firebase } = useContext(FirebaseContext);
  // console.log("firebase", firebase);

  useEffect(() => {
    const pruebaRef = collection(db, "restaurants");
    const unsubscribe = onSnapshot(pruebaRef, (snapshot) => {
      setRestaurantList(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  const getRestaurant = (restaurant) => {
    navigate(`/restaurant/${restaurant.uid}`, { state: { restaurant } });
  };

  const logout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <div className="flex justify-between px-3 py-3 items-center w-full bg-gradient-to-l from-teal-600 to-teal-100 ">
        <img className="w-16" src={logo} alt="Your Company" />
        <RestaurantSearch restaurantList={restaurantList} />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold text-xl my-3">¿Dónde deseas comer?</h1>
        <div className="w-full flex flex-row flex-wrap justify-center items-start">
          {restaurantList?.length > 0 &&
            restaurantList?.map((restaurant) => (
              <button
                className="w-auto p-2 hover:scale-[1.1] duration-75"
                key={restaurant.uid}
                onClick={() => getRestaurant(restaurant)}
              >
                <RestaurantCard restaurant={restaurant} />
              </button>
            ))}
        </div>
      </div>
      <button onClick={() => logout()}>cerrar sesión</button>
    </>
  );
};

export default Home;
