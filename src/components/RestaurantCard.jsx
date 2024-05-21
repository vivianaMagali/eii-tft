import React from "react";

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img
        className="w-full"
        src={restaurant.img}
        alt="Sunset in the mountains"
      />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {restaurant.basic_information.name}
        </div>
        <p className="text-gray-700 text-base flex items-center">
          <svg
            class="h-4 w-4 text-teal-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />{" "}
            <circle cx="12" cy="10" r="3" />
          </svg>{" "}
          <p>{restaurant.basic_information.direction}</p>
        </p>
        <p className="text-gray-700 text-base flex items-center">
          <svg
            class="h-5 w-5 text-teal-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />{" "}
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <p>{restaurant.basic_information.schedule}</p>
        </p>
        <p className="text-gray-700 text-base flex items-center">
          <svg
            class="h-4 w-4 text-teal-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
          </svg>
          <p>{restaurant.basic_information.phone}</p>
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          #{restaurant.basic_information.kind_food}
        </span>
      </div>
    </div>
  );
};

export default RestaurantCard;
