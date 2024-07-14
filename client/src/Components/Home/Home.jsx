import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";
console.log("Hello");
const Home = () => {
  const [user, setUser] = useState();
  const date = new Date(Date.now());
  // const month =
  useEffect(() => {
    const fetchUserData = async () => {
      const local_url = import.meta.env.VITE_LOCAL_URL;
      const Token = localStorage.getItem("Token");
      let response = await axios.get(`${local_url}/api/user/getUser`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: `Bearer ${Token}`,
        },
      });

      setUser(response.data.name);
    };
    fetchUserData();
  }, [user]);
  return (
    <div>
      <h3 className="homewelcome">
        Welcome! <span>&nbsp;&nbsp;&nbsp;{user}&nbsp;&nbsp;</span>
        <span className="todaysdate">
          {date.getDate()}&nbsp;
          {date.toLocaleString("en-US", { month: "short" })},
          {date.getFullYear()}
        </span>
      </h3>
      <br></br>
      <br></br>
      <h2 className="boardheading">Board</h2>
    </div>
  );
};

export default Home;
