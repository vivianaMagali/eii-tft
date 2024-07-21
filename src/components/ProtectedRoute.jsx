import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, userRole, redirectTo, children }) => {
  if (allowedRoles.includes(userRole)) {
    console.log("entro en el if");
    return children;
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
