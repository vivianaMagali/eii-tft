import React, { useState } from "react";

const RestaurantSearch = ({ filterRestaurants }) => {
  const [text, setText] = useState();

  const handleTextChange = (e) => {
    const textInput = e.target.value;
    setText(textInput);
    filterRestaurants(textInput);
  };

  return (
    <div class="relative w-72 mb-5">
      <input
        id="text"
        name="text"
        type="text"
        placeholder="Elegir restaurante..."
        onChange={handleTextChange}
        required
        value={text}
        class="block w-full px-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ringt-teal-600 sm:text-sm sm:leading-6"
      />
    </div>
  );
};

export default RestaurantSearch;
