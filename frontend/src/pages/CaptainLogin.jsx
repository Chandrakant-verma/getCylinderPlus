import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../contexts/CaptainContext";
import "./CaptainLogin.css";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const captain = {
        email,
        password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captain,
      );

      if (response.status === 200) {
        const data = response.data;

        setCaptain(data.captain);

        localStorage.setItem("token", data.token);

        navigate("/captains/home");
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
    <div className="captain-login-page">
      <div className="captain-login-overlay"></div>

      <div className="captain-login-card">
        <h1 className="logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        <p className="portal-title">Captain Login</p>
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
          
          <button type="submit" className="captain-login-btn">
            Login
          </button>
        </form>

        <p className="register-text">
          Join a fleet?
          <Link to="/captains/signup"> Register as Captain</Link>
        </p>

        <Link to="/users/login" className="user-login-link">
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
