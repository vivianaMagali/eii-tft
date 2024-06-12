import React from "react";
import { getAuth, signOut } from "firebase/auth";
import appFirebase from "../firebase/credentials";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Profile = () => {
  const auth = getAuth(appFirebase);
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth);
    navigate("/login");
  };
  return (
    <>
      <Header />
      <button onClick={() => logout()}>cerrar sesión</button>
    </>
  );
};

export default Profile;
