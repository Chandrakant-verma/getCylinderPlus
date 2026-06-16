import React from "react";
import { Link } from "react-router-dom";
import "./Successful.css";

const UserSuccessful = () => {
  return (
    <div className="success-container">
      <div className="success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1 className="success-logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        <h2 className="success-title">
          Delivery Successful!
        </h2>

        <p className="success-text">
          Your cylinder has been delivered successfully.
        </p>

        <p className="success-text secondary">
          Thank you for choosing getCylinder.
        </p>

        <Link to="/users/home">
          <button className="home-btn">
            Go To Home
          </button>
        </Link>

      </div>
    </div>
  );
};

export default UserSuccessful;