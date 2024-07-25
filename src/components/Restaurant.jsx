import React, { useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router";
import { db } from "../firebase/firebase";
import MenuCard from "./MenuCard";
import OrderSummary from "./OrderSummary";
import ConfirmOrder from "./ConfirmOrder";
import Header from "./Header";
import { RestaurantContext } from "../firebase/context";
import { typeProducts } from "../utils";

const Restaurant = () => {
  const { id } = useParams();
  const [menus, setMenus] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [starters, setStarters] = useState([]);
  const [mains, setMains] = useState([]);
  const savedOrdersLocalStorage = localStorage.getItem("savedOrders");
  const savedOrders = JSON.parse(savedOrdersLocalStorage);
  const [orders, setOrders] = useState(savedOrders ? savedOrders : []);
  const [total, setTotal] = useState();
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [restaurant, setRestaurant] = useState({});

  useEffect(() => {
    if (!id) return;

    const restaurantDocRef = doc(db, "restaurants", id);

    const unsubscribeRestaurant = onSnapshot(restaurantDocRef, (snapshot) => {
      setRestaurant(snapshot.data());
    });

    const menuCollectionRef = collection(restaurantDocRef, "menu");

    const unsubscribeProducts = onSnapshot(menuCollectionRef, (snapshot) => {
      setMenus(
        snapshot.docs
          .map((doc) => doc.data())
          .filter((data) => data.type === typeProducts.menu),
      );
      setDrinks(
        snapshot.docs
          .map((doc) => doc.data())
          .filter((data) => data.type === typeProducts.drink),
      );
      setStarters(
        snapshot.docs
          .map((doc) => doc.data())
          .filter((data) => data.type === typeProducts.starter),
      );
      setMains(
        snapshot.docs
          .map((doc) => doc.data())
          .filter((data) => data.type === typeProducts.main),
      );
    });

    return () => {
      unsubscribeProducts();
      unsubscribeRestaurant();
    };
  }, [id]);

  const resetQuantities = () => {
    setQuantities({});
  };

  return (
    <div class="flex flex-col">
      <RestaurantContext.Provider
        value={{
          basicInformation: restaurant.basicInformation,
          uidRestaurant: restaurant.uid,
        }}
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
        <div class="flex flex-col lg:flex-row justify-center my-14 px-8">
          <div class="flex flex-col justify-center">
            <span class="px-8 font-bold uppercase flex justify-center">
              Entrantes
            </span>
            <div class="flex flex-row flex-wrap items-start justify-center">
              {starters?.length > 0 &&
                starters.map((starter) => (
                  <MenuCard
                    key={starter.uid}
                    product={starter}
                    orders={orders}
                    setOrders={setOrders}
                    setShowOrderSummary={setShowOrderSummary}
                    quantity={quantities[starter.name] || 0}
                    setQuantity={(newQuantity) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [starter.name]: newQuantity,
                      }))
                    }
                  />
                ))}
            </div>
            <span class="px-8 font-bold uppercase flex justify-center">
              Menús
            </span>
            <div class="flex flex-row flex-wrap items-start justify-center">
              {menus?.length > 0 &&
                menus.map((menu) => (
                  <MenuCard
                    key={menu.uid}
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
              Principales
            </span>
            <div class="flex flex-row flex-wrap items-start justify-center">
              {mains?.length > 0 &&
                mains.map((main) => (
                  <MenuCard
                    key={main.uid}
                    product={main}
                    orders={orders}
                    setOrders={setOrders}
                    setShowOrderSummary={setShowOrderSummary}
                    quantity={quantities[main.name] || 0}
                    setQuantity={(newQuantity) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [main.name]: newQuantity,
                      }))
                    }
                  />
                ))}
            </div>

            <span class="px-8 font-bold uppercase flex justify-center">
              Bebidas
            </span>
            <div class="flex flex-row flex-wrap items-start justify-center">
              {drinks?.length &&
                drinks.map((drink) => (
                  <MenuCard
                    key={drink.uid}
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
