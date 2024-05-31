import React from "react";
import { getAuth, signOut } from "firebase/auth";
import appFirebase from "../firebase/credentials";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const auth = getAuth(appFirebase);
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth);
    navigate("/login");
  };
  return <button onClick={() => logout()}>cerrar sesión</button>;
};

export default Profile;
