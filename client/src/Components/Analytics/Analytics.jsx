import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Analytics.css";
import API_BASE_URL from "../../config/api.js";

const leftMetrics = [
  ["Backlog Tasks", "backlog_count"],
  ["To-do Tasks", "to_do_count"],
  ["In-Progress Tasks", "in_progress_count"],
  ["Completed Tasks", "done_count"],
];

const rightMetrics = [
  ["Low Priority", "low_priority_count"],
  ["Moderate Priority", "moderate_priority_count"],
  ["High Priority", "high_priority_count"],
  ["Due Date Tasks", "due_date_count"],
];

const Analytics = () => {
  const [countTaskProfile, setCountProfile] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const Token = localStorage.getItem("Token");

      let response = await axios.get(
        `${API_BASE_URL}/api/count/readCount`,

        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Bearer ${Token}`,
          },
        },
      );
      setCountProfile(response.data.counts);
    };
    fetchData();
  }, []);
  return (
    <div className="analytics-page">
      <h1 className="analytics-header">Analytics</h1>
      <div className="analytics-container">
        {[leftMetrics, rightMetrics].map((metrics, index) => (
          <section className="analytics-card" key={index}>
            {metrics.map(([label, key]) => (
              <div className="analytics-row" key={key}>
                <span className="analytics-label">{label}</span>
                <strong className="analytics-count">
                  {String(countTaskProfile[key] ?? 0).padStart(1, "0")}
                </strong>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
