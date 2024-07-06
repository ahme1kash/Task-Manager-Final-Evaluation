import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Structure.css";

const Structure = () => {
  return (
    <div className="structure">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Structure;
