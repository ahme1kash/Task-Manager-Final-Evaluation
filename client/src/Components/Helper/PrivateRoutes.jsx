import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Helper from "./Helper.jsx";

const PrivateRoutes = () => {
  const token = Helper();
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
