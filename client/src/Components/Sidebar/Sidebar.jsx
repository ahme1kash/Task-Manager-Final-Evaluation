import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import codesandbox_icon from "../../assets/codesandbox.png";
import Logout from "../Logout/Logout.jsx";
import board_icon from "../../assets/board.png";
import database_icon from "../../assets/database.png";
import settings_icon from "../../assets/settings.png";
// import logout_icon from "../../assets/logout.png";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <span>
            <img src={codesandbox_icon} alt="codesandbox_icon" />
            Pro Manage
          </span>
        </li>
        <li className="board">
          <img src={board_icon} alt="home" />
          <NavLink id="navboard" className="link" to={"/home"}>
            Board
          </NavLink>
        </li>
        <li>
          <img src={database_icon} alt="database" />
          <NavLink className="link" id="navdb" to={"/home/analytics"}>
            Analytics
          </NavLink>
        </li>
        <li>
          <img src={settings_icon} alt="settings" />
          <NavLink className="link" id="navsettings" to={"/home/settings"}>
            Settings
          </NavLink>
        </li>
        <li className="logoutbtn">
          <Logout />
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
