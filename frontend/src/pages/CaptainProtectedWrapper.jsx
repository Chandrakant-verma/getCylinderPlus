import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../contexts/CaptainContext";
import "./CaptainProtectedWrapper.css"

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/captains/login");
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCaptain(response.data.captain);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        navigate("/captains/login");
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

export default CaptainProtectWrapper;
