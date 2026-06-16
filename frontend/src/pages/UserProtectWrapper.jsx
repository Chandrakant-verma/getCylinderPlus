import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../contexts/UserContxt";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProtectedWrapper.css"

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/users/login");
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        navigate("/users/login");
      });
  }, [token]);

  if (isLoading) {
  return (
    <div className="loading-page">
      <div className="loading-card">
        <div className="loading-icon">
          <img
            src="https://res.cloudinary.com/dftacepnw/image/upload/v1781441948/edited-photo_komop5.png"
            alt="Loading"
          />
        </div>

        <h2>Loading</h2>

        <p>Please wait...</p>
      </div>
    </div>
  );
}

  return <>{children}</>;
};

export default UserProtectWrapper;
