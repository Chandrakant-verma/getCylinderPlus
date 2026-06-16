import React, { useEffect, useState } from "react";
import "./AdminCaptainsList.css";

const AdminCaptainsList = () => {
  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admins/captains`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setCaptains(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaptains();
  }, []);

  const groupedCaptains = captains.reduce((acc, captain) => {
    const branchName =
      captain.branch?.branchName || "No Branch";

    if (!acc[branchName]) {
      acc[branchName] = [];
    }

    acc[branchName].push(captain);

    return acc;
  }, {});

  if (loading) {
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

  return (
    <div className="captains-page">
      <div className="captains-overlay"></div>

      <div className="captains-content">
        <h1 className="captains-title">
          Captains Dashboard
        </h1>

        <p className="captains-subtitle">
          Delivery captains categorized by branch
        </p>

        {Object.keys(groupedCaptains).map((branch) => (
          <div
            key={branch}
            className="branch-section"
          >
            <h2 className="branch-title">
              {branch}
            </h2>

            <div className="captains-grid">
              {groupedCaptains[branch].map((captain) => (
                <div
                  key={captain._id}
                  className="captain-card"
                >
                  <h3>
                    {captain.name?.firstName}{" "}
                    {captain.name?.lastName}
                  </h3>

                  <p>
                    <strong>Email:</strong>{" "}
                    {captain.email}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {captain.contactNumber}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {captain.status || "Available"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCaptainsList;