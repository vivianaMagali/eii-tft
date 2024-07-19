import React, { useEffect, useState } from "react";
import { getCurrentLocation, haversineDistance } from "../utils";

const RestaurantCard = ({ restaurant }) => {
  const [distance, setDistance] = useState();
  const getLocation = async () => {
    try {
      const location = await getCurrentLocation();
      return location;
    } catch (error) {
      console.error("Error obtaining location:", error);
    }
  };

  useEffect(() => {
    const calculateDistance = async () => {
      try {
        getLocation().then((location) => {
          const restaurantLocation = {
            latitude: restaurant.basic_information.latitude,
            longitude: restaurant.basic_information.longitude,
          };
          const dist = haversineDistance(location, restaurantLocation);
          setDistance(dist);
        });
      } catch (error) {
        console.error("Error calculating distance:", error);
      }
    };

    calculateDistance();
  }, [restaurant]);

  return (
    <div class="w-80 rounded overflow-hidden shadow-lg">
      <img
        class="w-full h-44"
        src={restaurant.img}
        alt="Sunset in the mountains"
      />
      <div class="px-6 py-3 h-40">
        <div class="flex items-center justify-between">
          <p class="font-bold text-lg">{restaurant.basic_information.name}</p>
          <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 my-2">
            {restaurant.basic_information.kind_food}
          </span>
        </div>

        <div class="text-gray-700 text-base flex items-center py-1">
          <svg
            class="h-4 w-4 text-teal-500 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />{" "}
            <circle cx="12" cy="10" r="3" />
          </svg>{" "}
          <span class="text-xs">{restaurant.basic_information.direction}</span>
        </div>
        <div class="text-gray-700 text-base flex items-center pb-1">
          <svg
            class="h-4 w-4 text-teal-500 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />{" "}
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <span class="text-xs">{restaurant.basic_information.schedule}</span>
        </div>
        <div class="text-gray-700 text-base flex items-center">
          <svg
            class="h-4 w-4 text-teal-500 mr-1"
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
            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
          </svg>
          <span class="text-xs">{restaurant.basic_information.phone}</span>
        </div>
      </div>
      {!Number.isNaN(distance) ? (
        <div class="flex justify-end mx-2">
          <span class="text-xs">Distancia: {distance?.toFixed(2)} km</span>
        </div>
      ) : null}
    </div>
  );
};

export default RestaurantCard;
