import React, { useContext } from "react";
import { getAuth, signOut } from "firebase/auth";
import appFirebase from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { FirebaseContext } from "../firebase";

const Profile = () => {
  const auth = getAuth(appFirebase);
  const navigate = useNavigate();
  const { user } = useContext(FirebaseContext);

  const logout = () => {
    signOut(auth);
    navigate("/login");
  };
  return (
    <>
      <Header />
      <div class="flex flex-col items-center">
        <img
          src={user?.img}
          alt=""
          class="w-40 border-4 border-white rounded-full"
        />
        <div class="flex items-center space-x-2 mt-2">
          <p class="text-2xl">{user?.name}</p>
        </div>
        <p class="text-gray-700">{user?.email}</p>
        {user?.role && <p class="text-gray-700">{user?.role}</p>}
        <p class="text-sm text-gray-500">{user?.phone}</p>
        <button
          class="block text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800"
          onClick={() => logout()}
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default Profile;
