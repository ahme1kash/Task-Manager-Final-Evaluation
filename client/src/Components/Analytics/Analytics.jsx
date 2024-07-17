import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Analytics.css";
const Analytics = () => {
  const [countTaskProfile, setCountProfile] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const Token = localStorage.getItem("Token");
      const local_url = import.meta.env.VITE_LOCAL_URL;
      let response = await axios.get(
        `${local_url}/api/count/readCount`,

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
              <li className="listtasks">
                Backlog Tasks
                <span className="taskstatus">
                  {countTaskProfile["backlog_count"] || 0}
                </span>
              </li>

              <li className="listtasks">
                To-do Tasks
                <span className="taskstatus">
                  {countTaskProfile["to_do_count"] || 0}
                </span>
              </li>
              <li className="listtasks">
                In-Progress Tasks
                <span className="taskstatus">
                  {countTaskProfile["in_progress_count"] || 0}
                </span>
              </li>
              <li className="listtasks">
                Completed Tasks
                <span className="taskstatus">
                  {countTaskProfile["done_count"] || 0}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className=" rightcontainer">
          <div className=" rightblock">
            <ul>
              <li className="listtasks">
                Low Priority
                <span className="taskstatus">
                  {countTaskProfile["low_priority_count"] || 0}
                </span>
              </li>
              <li className="listtasks">
                Moderate Priority
                <span className="taskstatus">
                  {countTaskProfile["moderate_priority_count"] || 0}
                </span>
              </li>
              <li className="listtasks">
                High Priority
                <span className="taskstatus">
                  {countTaskProfile["high_priority_count"] || 0}
                </span>
              </li>
              <li className="listtasks">
                Due Date Tasks
                <span className="taskstatus">
                  {countTaskProfile["due_date_count"] || 0}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
