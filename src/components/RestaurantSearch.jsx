import React from "react";

const RestaurantSearch = ({ restaurantList }) => {
  return (
    <form class="mx-auto w-1/3 m-5">
      <div class="relative w-full">
        <input
          type="search"
          id="search-dropdown"
          class="block p-2.5 w-full z-20 text-sm rounded-e-lg rounded-s-lg border-s-2 border-gray-500 focus:ring-teal-500 focus:border-teal-500 dark:text-white dark:focus:border-teal-500"
          placeholder="Restaurante..."
          required
        />
        <button
          type="submit"
          class="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-teal-400 rounded-e-lg border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
        >
          <svg
            class="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span class="sr-only">Search</span>
        </button>
      </div>
    </form>
  );
};

export default RestaurantSearch;
