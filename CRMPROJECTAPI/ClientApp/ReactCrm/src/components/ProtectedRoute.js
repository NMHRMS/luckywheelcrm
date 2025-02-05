import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || user.roleid !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
