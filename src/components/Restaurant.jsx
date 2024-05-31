import React, { useState, useEffect, useContext, createContext } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useLocation, useParams } from "react-router";
import { db } from "../firebase/firebase";
import MenuCard from "./MenuCard";
import OrderSummary from "./OrderSummary";
import ConfirmOrder from "./ConfirmOrder";
import Header from "./Header";

const RestaurantContext = createContext();

export const useRestaurant = () => {
  return useContext(RestaurantContext);
};

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
    <div className="flex flex-col">
      <Header />
      {showConfirmOrderModal && (
        <ConfirmOrder
          orders={orders}
          setShowConfirmOrderModal={setShowConfirmOrderModal}
          restaurant={restaurant}
          setShowOrderSummary={setShowOrderSummary}
          total={total}
        />
      )}
      <div className="flex flex-row justify-center my-14 px-8">
        <div className="flex flex-col justify-center">
          <span className="px-8">Comidas</span>
          <div className="flex flex-row flex-wrap items-start">
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
          <span className="px-8">Bebidas</span>
          <div className="flex flex-row flex-wrap items-start">
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
        {orders.length > 0 ? (
          <OrderSummary
            className="duration-75"
            orders={orders}
            setShowConfirmOrderModal={setShowConfirmOrderModal}
            showOrderSummary={showOrderSummary}
            setShowOrderSummary={setShowOrderSummary}
            total={total}
            setTotal={setTotal}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Restaurant;
