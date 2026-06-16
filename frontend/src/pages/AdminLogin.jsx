import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "./UserLogin.css";
import { AdminDataContext } from "../contexts/AdminContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { setAdmin } = useContext(AdminDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({});
    const adminData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admins/login`,
        adminData,
      );

      if (response.status === 200) {
        const data = response.data;

        setAdmin(data.admin);
        localStorage.setItem("token", data.token);
        console.log("admin home jane bola hai admin login ne");
        navigate("/admins/home");
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({
          general: error.response.data.message,
        });
      }

      if (error.response?.data?.errors) {
        const backendErrors = {};

        error.response.data.errors.forEach((err) => {
          backendErrors[err.path] = err.msg;
        });

        setErrors(backendErrors);
      }

      console.error(error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <div className="login-card">
        <h1 className="logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        {errors.general && <div className="error-box">{errors.general}</div>}

        <form onSubmit={submitHandler}>
          <h3>Email Address</h3>

          <input
            className={`input-field ${errors.email ? "error" : ""}`}
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }}
            type="email"
            placeholder="email@example.com"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
          <h3>Password</h3>

          <input
            className={`input-field ${errors.password ? "error" : ""}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              setErrors((prev) => ({
                ...prev,
                password: "",
              }));
            }}
            required
            type="password"
            placeholder="Enter password"
          />

          {errors.password && <p className="error-text">{errors.password}</p>}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <Link to="/captains/login" className="captain-link">
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
