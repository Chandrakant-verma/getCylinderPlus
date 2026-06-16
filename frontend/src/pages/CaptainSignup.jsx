import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../contexts/CaptainContext";
import "./CaptainSignup.css";
import { useEffect } from "react";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [errors, setErrors] = useState({});
  const [branches, setBreanches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/get-branches`,
        );

        setBreanches(branchResponse.data.branches);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBranches();
  }, []);

  const { setCaptain } = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    setErrors({});

    try {
      const captainData = {
        firstName,
        lastName,
        email,
        address,
        contactNumber,
        password,
        branch,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData,
      );

      if (response.status === 201) {
        const data = response.data;

        setCaptain(data.captain);

        localStorage.setItem("token", data.token);

        navigate("/captains/home");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setErrors({
          general: err.response.data.message,
        });
      }

      if (err.response?.data?.errors) {
        const backendErrors = {};

        err.response.data.errors.forEach((error) => {
          backendErrors[error.path] = error.msg;
        });

        setErrors(backendErrors);
      }

      console.error(err);
    }
  };

  const useCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/maps/get-address-from-coordinate?lat=${lat}&lng=${lng}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
            .then((res) => res.json())
            .then((data) => {
              setAddress(data);
            });
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      },
      (error) => {
        console.error("Location error:", error);
      },
    );
  };

  return (
    <div className="captain-page">
      <div className="captain-overlay"></div>

      <div className="captain-card">
        <h1 className="logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        <p className="portal-title">Captain Registration</p>

        <form onSubmit={submitHandler}>
          <h3>Captain Name</h3>

          <div className="name-row">
            <input
              className={`input-field ${errors.firstName ? "error" : ""}`}
              required
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  firstName: "",
                }));
              }}
            />

            {errors.firstName && (
              <p className="error-text">{errors.firstName}</p>
            )}

            <input
              className={`input-field ${errors.lastName ? "error" : ""}`}
              required
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  lastName: "",
                }));
              }}
            />

            {errors.lastName && <p className="error-text">{errors.lastName}</p>}
          </div>

          <h3>Email Address</h3>

          <input
            className={`input-field ${errors.email ? "error" : ""}`}
            required
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              setErrors((prev) => ({
                ...prev,
                email: "",
              }));
            }}
          />

          {errors.email && <p className="error-text">{errors.email}</p>}

          <h3>Password</h3>

          <input
            className={`input-field ${errors.password ? "error" : ""}`}
            required
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              setErrors((prev) => ({
                ...prev,
                password: "",
              }));
            }}
          />

          {errors.password && <p className="error-text">{errors.password}</p>}

          <h3>Address</h3>

          <input
            className={`input-field ${errors.address ? "error" : ""}`}
            required
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);

              setErrors((prev) => ({
                ...prev,
                address: "",
              }));
            }}
          />

          {errors.address && <p className="error-text">{errors.address}</p>}

          <button
            type="button"
            className="location-btn"
            onClick={useCurrentLocation}
          ></button>

          <h3>Contact Number</h3>

          <input
            className={`input-field ${errors.contactNumber ? "error" : ""}`}
            required
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => {
              setContactNumber(e.target.value);

              setErrors((prev) => ({
                ...prev,
                contactNumber: "",
              }));
            }}
          />

          {errors.contactNumber && (
            <p className="error-text">{errors.contactNumber}</p>
          )}

          <h3>Select Branch</h3>

          <select
            className={`input-field ${errors.branch ? "error" : ""}`}
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);

              setErrors((prev) => ({
                ...prev,
                branch: "",
              }));
            }}
            required
          >
            <option value="">Select a Branch</option>

            {branches.map((branchItem) => (
              <option key={branchItem._id} value={branchItem._id}>
                {branchItem.branchName}
              </option>
            ))}
          </select>

          {errors.branch && <p className="error-text">{errors.branch}</p>}

          {errors.general && <div className="error-box">{errors.general}</div>}

          <button type="submit" className="captain-btn">
            Create Captain Account
          </button>
        </form>

        <p className="login-text">
          Already have an account?
          <Link to="/captains/login"> Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
