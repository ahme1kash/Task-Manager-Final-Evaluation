import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Analytics.css";
const Analytics = () => {
  const [countTaskProfile, setCountProfile] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const Token = localStorage.getItem("Token");

      let response = await axios.get(
        "http://localhost:3010/api/count/readCount",

        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Bearer ${Token}`,
          },
        }
      );
      console.log(response.data.counts, typeof response.data.counts);
      setCountProfile(response.data.counts);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1 className="header">Analytics</h1>
      <div className="container">
        <div className="leftcontainer">
          <div className="leftblock">
            <ul>
              <li>
                <p>Backlog Tasks</p>
                <p>90</p>
              </li>
              <li>To-do Tasks</li>
              <li>In-Progress Tasks</li>
              <li>Completed Tasks</li>
            </ul>
          </div>
        </div>
        <div className="rightcontainer">
          <div className="rightblock">
            <ul>
              <li>Low Priority</li>
              <li>Moderate Priority</li>
              <li>High Priority</li>
              <li>Due Date Tasks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
