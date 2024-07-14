import React, { useState } from "react";
import "./Settings.css";
import axios from "axios";
import user_icon from "../../assets/person.png";
import password_icon from "../../assets/password.png";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Settings = () => {
  const user_info = {
    name: "",
    old_password: "",
    new_password: "",
  };
  const [credentials, setCredentials] = useState(user_info);
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  const navigate = useNavigate();
  const submitForm = async (e) => {
    try {
      e.preventDefault();
      const Token = localStorage.getItem("Token");
      const local_url = import.meta.env.VITE_LOCAL_URL;
      const response = await axios.put(
        `${local_url}/api/user/updateUser`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Bearer ${Token}`,
          },
        }
      );
      toast.success(" User Profile Updated Successfully", response, {
        position: "top-center",
      });
      console.log("39", response);
      if (response.updatedCredentials) {
        navigate("/");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.log("Error encountered in subitting data", err.message);
      toast.error("Data failed to get submitted successfully", {
        position: "top-center",
      });
      navigate("/home");
    }
  };
  return (
    <div className="settings">
      <h1>Settings</h1>
      <div className="settingsform">
        {/* onSubmit={submitForm} */}
        <form className="settinginput" onSubmit={submitForm}>
          <div className="forminput">
            <img src={user_icon} alt="emailicon" />
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              onChange={inputHandler}
              value={credentials.name}
              autoComplete="off"
            />
          </div>
          <div className="forminput">
            <img src={password_icon} alt="passwordicon" />
            <input
              type="password"
              id="old_password"
              name="old_password"
              placeholder="Old password"
              onChange={inputHandler}
              value={credentials.old_password}
              autoComplete="new-password"
            />
          </div>
          <div className="forminput">
            <img src={password_icon} alt="passwordicon" />
            <input
              type="password"
              id="new_password"
              name="new_password"
              placeholder="Password"
              onChange={inputHandler}
              value={credentials.new_password}
              autoComplete="new-password"
            />
          </div>
          <div className="submit-settings-container">
            <button
              className="submitform"
              type="submit"
              // onClick={() => {
              //   setCredentials(credentials);
              // }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
