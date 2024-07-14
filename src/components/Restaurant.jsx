import React, { useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useParams } from "react-router";
import { db } from "../firebase/firebase";
import MenuCard from "./MenuCard";
import OrderSummary from "./OrderSummary";
import ConfirmOrder from "./ConfirmOrder";
import Header from "./Header";
import { RestaurantContext } from "../firebase/context";

const Restaurant = () => {
  const { id } = useParams();
  const [menus, setMenus] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState();
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const location = useLocation();
  const { restaurant } = location.state || {};

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
    <div class="flex flex-col">
      <RestaurantContext.Provider
        value={{ basicInformation: restaurant.basicInformation }}
      >
        <Header />
        {showConfirmOrderModal && (
          <ConfirmOrder
            orders={orders}
            setOrders={setOrders}
            setShowConfirmOrderModal={setShowConfirmOrderModal}
            restaurant={restaurant}
            setShowOrderSummary={setShowOrderSummary}
            total={total}
          />
        )}
        <div class="flex flex-row justify-center my-14 px-8">
          <div class="flex flex-col justify-center">
            <span class="px-8 font-bold uppercase flex justify-center">
              Comidas
            </span>
            <div class="flex flex-row flex-wrap items-start justify-center">
              {menus?.length > 0 &&
                menus.map((menu) => (
                  <MenuCard
                    key={menu.name}
                    product={menu}
                    orders={orders}
                    setOrders={setOrders}
                    setShowOrderSummary={setShowOrderSummary}
                  />
                ))}
            </div>
            <span class="px-8 font-bold uppercase flex justify-center">
              Bebidas
            </span>
            <div class="flex flex-row flex-wrap items-start justify-center">
              {drinks?.length > 0 &&
                drinks.map((drink) => (
                  <MenuCard
                    key={drink.name}
                    product={drink}
                    orders={orders}
                    setOrders={setOrders}
                    setShowOrderSummary={setShowOrderSummary}
                  />
                ))}
            </div>
          </div>

          <OrderSummary
            class="duration-75"
            orders={orders}
            setShowConfirmOrderModal={setShowConfirmOrderModal}
            showOrderSummary={showOrderSummary}
            setShowOrderSummary={setShowOrderSummary}
            total={total}
            setTotal={setTotal}
          />
        </div>
      </RestaurantContext.Provider>
    </div>
  );
};

export default Restaurant;
