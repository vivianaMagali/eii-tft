import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import RestaurantCard from "./RestaurantCard";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Home = () => {
  const [restaurantList, setRestaurantList] = useState();
  const navigate = useNavigate();
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

  return (
    <>
      <Header />
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
    </>
  );
};

export default Home;
