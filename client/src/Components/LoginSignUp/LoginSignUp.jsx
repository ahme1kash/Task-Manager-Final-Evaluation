import React, { useState } from "react";
import "./LoginSignUp.css";
import user_icon from "../../assets/person.png";
import axios from "axios";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import hide_password_icon from "../../assets/hide password.png";
import show_password_icon from "../../assets/show password.png";
import robo_pic from "../../assets/robopic.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import robo_back from "../../assets/robo back.png";
const LoginSignUp = () => {
  const [activity, setActivity] = useState("Register");
  const users = {
    name: "",
    email: "",
    password: "",
  };
  const [user, setUser] = useState(users);
  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const navigate = useNavigate();
  const submitForm = async (e) => {
    try {
      e.preventDefault();
      if (activity == "Register") {
        console.log(activity);
        console.log(user);
        await axios.post(
          "https://task-manager-final-evaluation-backend.vercel.app/api/auth/register",
          { user },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        toast.success(" User Registered Successfully", {
          position: "top-right",
        });
      } else if (activity == "Login") {
        const response = await axios.post(
          "https://task-manager-final-evaluation-backend.vercel.app/api/auth/login",
          user,

          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        localStorage.setItem("Token", response.data.token);
        toast.success(" User Logged In Successfully", {
          position: "top-right",
        });
        navigate("/home");
      }
    } catch (err) {
      // console.log(z)
      // res.status(200).json({ message: 'Resource created successfully!' });
      //   toast.success("New User Added Successfully", { position: "top-right" });
      //   navigate("/");
      if (err.response) {
        console.error("Response error:", err.response.data);
      } else if (err.request) {
        console.error("Request error:", err.request);
      }
      console.error("Axios error:", err.message);
      console.log("Error encountered in subitting data", err.message);
      toast.error("Data failed to get submitted successfully", {
        position: "top-right",
      });
      navigate("/");
    }
  };
  return (
    <div className="login-signup container">
      <div className="welcome">
        <div className="robowelcome">
          <img className="robo" src={robo_pic} alt="robopic" />
        </div>
        <div className="greet">
          <h3 className="greet-text"> Welcome aboard my friend</h3>
          <h3 className="start"> just a couple of clicks and we start</h3>
        </div>
      </div>
      <div className="signandregister">
        <div className="login-signup header">
          <div className="text">{activity}</div>
        </div>
        <form className="inputs" onSubmit={submitForm}>
          {activity === "Login" ? (
            <div></div>
          ) : (
            <div className="input">
              <img src={user_icon} alt="usericon" />
              <input
                type="text"
                placeholder="Name"
                autoComplete="off"
                id="name"
                name="name"
                onChange={inputHandler}
                value={user.name}
              />
            </div>
          )}

          <div className="input">
            <img src={email_icon} alt="emailicon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              onChange={inputHandler}
              value={user.email}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="passwordicon" />
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              placeholder="Password"
              onChange={inputHandler}
              value={user.password}
            />
            {/* <img src={hide_password_icon} alt="hidepassword" />
            <img src={show_password_icon} alt="showpassowrd" /> */}
          </div>
          {activity === "Login" ? (
            <div></div>
          ) : (
            <div className="input">
              <img src={password_icon} alt="passwordicon" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                autoComplete="off"
                onChange={inputHandler}
                value={user.confirmPassword}
              />
              {/* <img src={hide_password_icon} alt="hidepassword" /> */}
              {/* <img src={show_password_icon} alt="showpassowrd" /> */}
            </div>
          )}

          <div className="submit-container">
            {/* <button type="submit" className="submit">
              {activity}
            </button> */}
            <button
              className={activity === "Login" ? "submit gray" : "submit"}
              onClick={() => {
                setActivity(activity);
              }}
            >
              {activity === "Login" ? "Log in" : "Register"}
            </button>
            {activity == "Register" ? (
              <p className="acc">Have an Account</p>
            ) : (
              <p className="acc">Have no Account yet?</p>
            )}
            &nbsp; &nbsp;
            <div
              className={activity === "Register" ? "submit gray" : "submit"}
              onClick={() => {
                setActivity(activity === "Register" ? "Login" : "Register");
              }}
            >
              {activity === "Register" ? "Log in" : "Register"}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSignUp;
