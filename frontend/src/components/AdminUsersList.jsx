import React, { useContext, useEffect, useState } from "react";
import { AdminDataContext } from "../contexts/AdminContext";
import "./AdminUsersList.css";

const AdminUsersList = () => {
  const { admin } = useContext(AdminDataContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admins/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setUsers(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const groupedUsers = users.reduce((acc, user) => {
    const branchName = user.branch?.branchName || "No Branch";

    if (!acc[branchName]) {
      acc[branchName] = [];
    }

    acc[branchName].push(user);

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
    <div className="users-page">
      <div className="users-overlay"></div>

      <div className="users-content">
        <h1 className="users-title">Users Dashboard</h1>

        <p className="users-subtitle">Users categorized by branch</p>

        {Object.keys(groupedUsers).map((branch) => (
          <div key={branch} className="branch-section">
            <h2 className="branch-title">{branch}</h2>

            <div className="users-grid">
              {groupedUsers[branch].map((user) => (
                <div key={user._id} className="user-card">
                  <h3>
                    {user.name?.firstName} {user.name?.lastName}
                  </h3>

                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>

                  <p>
                    <strong>Phone:</strong> {user.contactNumber}
                  </p>

                  <p>
                    <strong>Address:</strong> {user.address}
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

export default AdminUsersList;
