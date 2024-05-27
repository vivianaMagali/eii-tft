import React, { useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router";
import { db } from "../firebase/firebase";
import RestaurantSearch from "./RestaurantSearch";
import logo from "../assets/logo-removebg-preview.png";
import MenuCard from "./MenuCard";
import OrderSummary from "./OrderSummary";
import ConfirmOrder from "./ConfirmOrder";

const Restaurant = () => {
  const { id } = useParams();
  const [menus, setMenus] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between px-3 py-3 items-center w-full bg-gradient-to-l from-teal-600 to-teal-100">
          <img className="w-16" src={logo} alt="Your Company" />
          <RestaurantSearch />
        </div>
        {showModal && (
          <ConfirmOrder orders={orders} setShowModal={setShowModal} />
        )}
        <div className="flex flex-row justify-center my-14 px-8">
          <div className="flex flex-row flex-wrap items-start">
            {menus?.length > 0 &&
              menus.map((menu) => (
                <MenuCard
                  key={menu.name}
                  menu={menu}
                  orders={orders}
                  setOrders={setOrders}
                />
              ))}
          </div>

          {orders.length > 0 ? (
            <OrderSummary
              className="duration-75"
              orders={orders}
              setShowModal={setShowModal}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Restaurant;
