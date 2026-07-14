import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import user_icon from "../../assets/person.png";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import API_BASE_URL from "../../config/api.js";

const Settings = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: localStorage.getItem("UserName") || "",
    email: localStorage.getItem("UserEmail") || "",
    old_password: "",
    new_password: "",
  });
  const [saving, setSaving] = useState(false);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitSettings = async (e) => {
    e.preventDefault();

    const payload = {};
    if (form.name.trim()) payload.name = form.name.trim();
    if (form.email.trim()) payload.email = form.email.trim();
    if (form.old_password) payload.old_password = form.old_password;
    if (form.new_password) payload.new_password = form.new_password;

    if (!Object.keys(payload).length) {
      toast.error("Please enter profile changes", { position: "top-center" });
      return;
    }

    setSaving(true);
    try {
      const Token = localStorage.getItem("Token");
      const response = await axios.put(`${API_BASE_URL}/api/user/updateUser`, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: `Bearer ${Token}`,
        },
      });

      if (form.new_password) {
        localStorage.removeItem("Token");
        localStorage.removeItem("UserName");
        localStorage.removeItem("UserEmail");
        toast.success("Password updated. Please login again", { position: "top-center" });
        navigate("/");
        return;
      }

      const updatedUser = response.data.user;
      if (updatedUser?.name) localStorage.setItem("UserName", updatedUser.name);
      if (updatedUser?.email) localStorage.setItem("UserEmail", updatedUser.email);

      setForm((current) => ({
        ...current,
        name: updatedUser?.name || current.name,
        email: updatedUser?.email || current.email,
        old_password: "",
        new_password: "",
      }));
      toast.success("Profile updated", { position: "top-center" });
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update profile", {
        position: "top-center",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="settings-page">
      <h1>Settings</h1>
      <form className="settings-form" onSubmit={submitSettings}>
        <label className="settings-input">
          <img src={user_icon} alt="name" />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
          />
        </label>

        <label className="settings-input">
          <img src={email_icon} alt="email" />
          <input
            type="email"
            name="email"
            placeholder="Update Email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
          />
        </label>

        <label className="settings-input">
          <img src={password_icon} alt="old password" />
          <input
            type="password"
            name="old_password"
            placeholder="Old Password"
            value={form.old_password}
            onChange={updateField}
            autoComplete="current-password"
          />
        </label>

        <label className="settings-input">
          <img src={password_icon} alt="new password" />
          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            value={form.new_password}
            onChange={updateField}
            autoComplete="new-password"
          />
        </label>

        <button className="settings-submit" type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update"}
        </button>
      </form>
    </main>
  );
};

export default Settings;
