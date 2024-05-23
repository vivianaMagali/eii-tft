import React, { useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router";
import { db } from "../firebase/firebase";

const Restaurant = () => {
  const { id } = useParams();
  const [menus, setMenus] = useState([]);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    if (!id) return;

    const restaurantDocRef = doc(db, "restaurants", id);

    const menuCollectionRef = collection(restaurantDocRef, "menu");

    const unsubscribeMenu = onSnapshot(menuCollectionRef, (snapshot) => {
      setMenus(snapshot.docs.map((doc) => doc.data()));
    });

    const drinksCollectionRef = collection(restaurantDocRef, "drinks");

    const unsubscribeDrinks = onSnapshot(drinksCollectionRef, (snapshot) => {
      setDrinks(snapshot.docs.map((doc) => doc.data()));
    });

    return () => {
      unsubscribeMenu();
      unsubscribeDrinks();
    };
  }, [id]);

  console.log("menus", menus);
  console.log("drinks", drinks);
  return (
    <div className="flex flex-row flex-wrap justify-center items-start">
      {menus?.length > 0 &&
        menus?.map((menu) => (
          <div className="relative my-5 mx-5 flex w-96 h-52 flex-row rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
            <div className="relative m-0 w-2/5 shrink-0 overflow-hidden rounded-xl rounded-r-none bg-white bg-clip-border text-gray-700">
              <img
                src={menu.img}
                alt="maravilloso"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <h6 className="mb-4 block font-sans text-base font-semibold uppercase leading-relaxed tracking-normal text-teal-500 antialiased">
                {menu.name}
              </h6>
              <h4 className="mb-2 block font-sans text-sm font-normal leading-relaxed text-gray-700 antialiased h-20">
                {menu.ingredients}
              </h4>
              <div className="flex flex-row items-center justify-between">
                <h3>{menu.price}€</h3>
                <div className="left-0 flex flex-row items-center justify-end">
                  <button
                    className="flex select-none items-center rounded-lg py-3 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-teal-500 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                  >
                    <svg
                      class="h-6 w-6 text-teal-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <span className="font-sans text-base font-semibold">1</span>
                  <button
                    className="flex select-none items-center rounded-lg py-3 px-3 text-center align-middle font-sans text-xs font-bold uppercase text-teal-500 transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                  >
                    <svg
                      class="h-6 w-6 text-teal-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Restaurant;
