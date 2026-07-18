import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api.js";
import codesandbox_icon from "../../assets/codesandbox.png";
import "./PublicTask.css";

const priorityClass = {
  "HIGH PRIORITY": "high",
  "MODERATE PRIORITY": "moderate",
  "LOW PRIORITY": "low",
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const PublicTask = () => {
  const { task_id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/share/public/${task_id}`);
        setTask(response.data.task);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [task_id]);

  if (loading) {
    return <div className="public-task-page">Loading...</div>;
  }

  if (!task) {
    return <div className="public-task-page">Task not found</div>;
  }

  const completedCount = task.task_steps?.filter((step) => step.done).length || 0;
  const totalCount = task.task_steps?.length || 0;

  return (
    <main className="public-task-page">
      <div className="public-brand">
        <img src={codesandbox_icon} alt="Pro Manage" />
        <span>Pro Manage</span>
      </div>

      <article className="public-task-card">
        <div className="public-priority">
          <span className={`public-priority-dot ${priorityClass[task.task_priority] || "low"}`}></span>
          {task.task_priority}
        </div>
        <h1>{task.task_title}</h1>
        <h2>
          Checklist ({completedCount}/{totalCount})
        </h2>
        <div className="public-checklist">
          {task.task_steps?.map((step, index) => (
            <label className={`public-checklist-item ${step.done ? "completed" : ""}`} key={index}>
              <input type="checkbox" checked={Boolean(step.done)} readOnly onClick={(e) => e.preventDefault()} />
              <span>{step.description}</span>
            </label>
          ))}
        </div>
        {task.due_date && (
          <div className="public-due-date">
            <span>Due Date</span>
            <strong>{formatDate(task.due_date)}</strong>
          </div>
        )}
      </article>
    </main>
  );
};

export default PublicTask;
