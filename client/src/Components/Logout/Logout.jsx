import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logout_icon from "../../assets/logout.png";
const Logout = () => {
  const navigate = useNavigate();
  const LogoutAction = async () => {
    try {
      const Token = localStorage.getItem("Token");
      await axios.post(
        "https://task-manager-final-evaluation-backend.vercel.app//api/auth/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Bearer ${Token}`,
          },
        }
      );
      toast.success(" User Logged Out Successfully", {
        position: "top-right",
      });
      localStorage.removeItem("Token");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Logout Action Failed", {
        position: "top-right",
      });
    }
  };
  return (
    <button
      onClick={LogoutAction}
      alt="Logout"
      style={{
        display: "inline-flex",
        border: "none",
        background: "transparent",
        gap: "0.7em",
        fontWeight: "bold",
        color: "red",
        fontSize: "1em",
      }}
    >
      <img src={logout_icon} alt="logout-icon" />
      Logout
    </button>
  );
};
export default Logout;
