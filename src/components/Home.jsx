import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import RestaurantCard from "./RestaurantCard";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import RestaurantSearch from "./RestaurantSearch";

const Home = () => {
  const [restaurantList, setRestaurantList] = useState();
  const [filteredRestaurant, setFilteredRestaurant] = useState();
  const navigate = useNavigate();

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

  const filterRestaurants = (text) => {
    if (text?.trim() === "") {
      setFilteredRestaurant(restaurantList);
    } else {
      const filtered = restaurantList.filter((restaurant) =>
        restaurant?.basic_information?.name
          ?.toLowerCase()
          .includes(text?.toLowerCase()),
      );
      setFilteredRestaurant(filtered);
    }
  };

  return (
    <>
      <Header />
      <div class="flex flex-col items-center justify-center">
        <RestaurantSearch filterRestaurants={filterRestaurants} />
        <h1 class="font-bold text-xl my-3">¿Dónde deseas comer?</h1>
        <div class="w-full flex flex-row flex-wrap justify-center items-start">
          {filteredRestaurant?.length > 0 ? (
            filteredRestaurant?.map((restaurant) => (
              <button
                class="w-auto p-2 hover:scale-[1.1] duration-75"
                key={restaurant.uid}
                onClick={() => getRestaurant(restaurant)}
              >
                <RestaurantCard restaurant={restaurant} />
              </button>
            ))
          ) : (
            <span>
              Lo lamentamos, no exite ningún restaurante con ese nombre
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
