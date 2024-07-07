import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Analytics.css";
const Analytics = () => {
  const [countTaskProfile, setCountProfile] = useState([]);
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
      <h1 className=" header">Analytics</h1>
      <div className=" container">
        <div className=" leftcontainer">
          <div className=" leftblock">
            <ul>
              <li>
                Backlog Tasks &nbsp;&nbsp;&nbsp;&nbsp;
                {countTaskProfile["backlog_count"]}
              </li>
              <li>
                To-do Tasks&nbsp;&nbsp;&nbsp;&nbsp;
                {countTaskProfile["to_do_count"]}
              </li>
              <li>
                In-Progress Tasks &nbsp;&nbsp;&nbsp;&nbsp;
                {countTaskProfile["in_progress_count"]}
              </li>
              <li>
                Completed Tasks &nbsp;&nbsp;&nbsp;&nbsp;
                {countTaskProfile["done_count"]}
              </li>
            </ul>
          </div>
        </div>
        <div className=" rightcontainer">
          <div className=" rightblock">
            <ul>
              <li>
                Low Priority&nbsp;&nbsp;&nbsp;&nbsp;
                {countTaskProfile["low_priority_count"]}
              </li>
              <li>
                Moderate Priority&nbsp;&nbsp;&nbsp;&nbsp;
                {countTaskProfile["moderate_priority_count"]}
              </li>
              <li>
                High Priority&nbsp;&nbsp;&nbsp;&nbsp;
                {countTaskProfile["high_priority_count"]}
              </li>
              <li>
                Due Date Tasks&nbsp;&nbsp;&nbsp;&nbsp;
                {countTaskProfile["due_date_count"]}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
