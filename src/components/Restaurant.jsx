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
  const [quantities, setQuantities] = useState({});

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

  const resetQuantities = () => {
    setQuantities({});
  };

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
            resetQuantities={resetQuantities}
          />
        )}
        <div class="flex sm:w-full sm:px-0 flex-col lg:flex-row justify-center my-14 px-8">
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
                    quantity={quantities[menu.name] || 0}
                    setQuantity={(newQuantity) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [menu.name]: newQuantity,
                      }))
                    }
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
                    quantity={quantities[drink.name] || 0}
                    setQuantity={(newQuantity) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [drink.name]: newQuantity,
                      }))
                    }
                  />
                ))}
            </div>
          </div>
          <div class="mt-8 lg:mt-0 lg:ml-8 lg:w-2/3">
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
        </div>
      </RestaurantContext.Provider>
    </div>
  );
};

export default Restaurant;
