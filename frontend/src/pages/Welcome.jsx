import React from "react";
import { Link } from "react-router-dom";
import "./Welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="overlay"></div>

      <div className="welcome-content">
        <h1>
          <span className="logo-get">get</span>
          <span className="logo-cylinder">Cylinder</span>
        </h1>

        <p>
          Fast. Safe. Reliable.
          <br />
          LPG Cylinder Delivery at your doorstep.
        </p>

        <Link to="/users/login" className="continue-btn">
          Continue
        </Link>
      </div>

      <div className="admin-section">
        <Link to="/admins/login" className="admin-link">
          Continue as Admin
        </Link>
      </div>
    </div>
  );
};

export default Welcome;