import React, { useContext, useEffect, useState } from "react";
import { AdminDataContext } from "../contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminProtectedWrapper.css";

const AdminProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setAdmin } = useContext(AdminDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.log("token nahi hai");
      navigate("admins/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/admins/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setAdmin(response.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("admins/login");
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

export default AdminProtectedWrapper;
