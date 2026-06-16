import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileCard.css";

const ProfileCard = ({ name, email, address, contactNumber, branch, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    if (role === "User") {
      navigate("/users/login");
    } else if (role === "Captain") {
      navigate("/captains/login");
    } else {
      navigate("/admins/login");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>{name}</h1>

        <span className="role-badge">{role}</span>

        <div className="profile-details">
          <div>
            <strong>Email</strong>
            <p>{email}</p>
          </div>

          {address && (
            <div>
              <strong>Address</strong>
              <p>{address}</p>
            </div>
          )}

          {contactNumber && (
            <div>
              <strong>Contact Number</strong>
              <p>{contactNumber}</p>
            </div>
          )}

          {branch && (
            <div>
              <strong>Branch</strong>
              <p>{branch}</p>
            </div>
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
