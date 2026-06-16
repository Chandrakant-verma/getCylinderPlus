import React, { useContext, useState } from "react";
import axios from "axios";
import { AdminDataContext } from "../contexts/AdminContext";
import "./AdminHome.css";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const { admin } = useContext(AdminDataContext);

  const [branchName, setBranchName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const [newPrice, setNewPrice] = useState();
  const [activeSection, setActiveSection] = useState(null);

  const fetchSuggestions = async (value) => {
    setBranchAddress(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions?input=${encodeURIComponent(value)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      console.log(response.data);

      setSuggestions(response.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const updatePrice = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admins/setPrice?price=${encodeURIComponent(newPrice)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // console.log(response.data);
      setNewPrice("");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const createBranch = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admins/branches`,
        {
          branchName,
          branchAddress,
          contactNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("Branch Created Successfully");

      setBranchName("");
      setBranchAddress("");
      setContactNumber("");
      setSuggestions([]);
    } catch (err) {
      console.log(err);
      alert("Failed to create branch");
    }
  };

  return (
    <div className="admin-home-container">
      <div className="admin-overlay"></div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>
            Welcome {admin?.name?.firstName} {admin?.name?.lastName}
          </h1>

          <p>Manage Branches, Captains and Orders</p>
        </div>

        <div className="admin-main-buttons">
          <button
            className="admin-main-btn"
            onClick={() =>
              setActiveSection(activeSection === "insights" ? null : "insights")
            }
          >
            Dashboard Insights
          </button>

          <button
            className="admin-main-btn"
            onClick={() =>
              setActiveSection(activeSection === "price" ? null : "price")
            }
          >
            Update Cylinder Price
          </button>

          <button
            className="admin-main-btn"
            onClick={() =>
              setActiveSection(activeSection === "branch" ? null : "branch")
            }
          >
            Add New Branch
          </button>
        </div>

        {activeSection === "insights" && (
          <div className="admin-actions-card">
            <Link to="/admins/usersList" className="dashboard-link">
              See Users
            </Link>

            <Link to="/admins/captainsList" className="dashboard-link">
              See Captains
            </Link>

            <Link to="/admins/ordersList" className="dashboard-link">
              See Orders
            </Link>

            <Link to="/admins/analyze" className="dashboard-link">
              Analyze Data
            </Link>
          </div>
        )}

        {activeSection === "price" && (
          <div className="admin-price-card">
            <h2>Change Cylinder Price</h2>

            <input
              type="number"
              placeholder="Enter new cylinder price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />

            <button onClick={updatePrice}>Update Price</button>
          </div>
        )}

        {activeSection === "branch" && (
          <form className="branch-form" onSubmit={createBranch}>
            <h2>Add New Branch</h2>

            <input
              type="text"
              placeholder="Branch Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />

            <div className="autocomplete-wrapper">
              <input
                type="text"
                placeholder="Branch Address"
                value={branchAddress}
                onChange={(e) => fetchSuggestions(e.target.value)}
                required
              />

              {suggestions.length > 0 && (
                <div className="suggestions-box">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => {
                        setBranchAddress(item);
                        setSuggestions([]);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />

            <button type="submit" className="create-branch-btn">
              Create Branch
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
