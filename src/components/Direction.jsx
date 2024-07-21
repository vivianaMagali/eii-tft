import React, { useState } from "react";
import PlacesPicker from "@tasiodev/react-places-autocomplete";

const Direction = ({ restaurant, setPlace }) => {
  const [selectedOptionPlace, setSelectedOptionPlace] = useState("home");

  return (
    <div class="col-span-2 sm:col-span-1">
      <label htmlFor="category" class="block mb-2 text-sm font-medium">
        ¿Dónde deseas comerlo?
      </label>
      <select
        id="category"
        name="category"
        class="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:focus:ring-primary-500 dark:focus:border-primary-500"
        value={selectedOptionPlace}
        onChange={(e) => setSelectedOptionPlace(e.target.value)}
      >
        <option value="home">A domicilio</option>
        <option value="pickup">Recogida en local</option>
        <option value="local">Estoy en una mesa</option>
      </select>

      {selectedOptionPlace === "home" && (
        <div class="my-2">
          <PlacesPicker
            gMapsKey="AIzaSyDbKaQl6IEo_hLQ-qBLV-uPEEaIvbe8ULk"
            onChange={setPlace}
            placeholder="Busca una dirección..."
            mapExpanded={true}
            disableMap={true}
          />
          <input
            required
            class="bg-gray-50 border my-2 border-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Nº piso, portal, etc."
            name="detail"
          />
        </div>
      )}

      {selectedOptionPlace === "pickup" && (
        <span
          htmlFor="pickup"
          name="pickup"
          class="block my-2 text-sm font-medium"
        >
          {restaurant.basic_information.direction}
        </span>
      )}

      {selectedOptionPlace === "local" && (
        <input
          required
          class="bg-gray-50 border my-2 border-gray-300 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Nº de mesa."
          name="table"
          type="number"
        />
      )}

      <div class="col-span-2">
        <label htmlFor="description" class="block my-2 text-sm font-medium">
          ¿Deseas añadir un comentario?
        </label>
        <textarea
          id="description"
          rows="4"
          name="description"
          class="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-teal-500 focus:border-teal-500 dark:focus:ring-teal-500 dark:focus:border-teal-500"
          placeholder="Ej: el bocadillo partido a la mitad"
        ></textarea>
      </div>
    </div>
  );
};

export default Direction;
