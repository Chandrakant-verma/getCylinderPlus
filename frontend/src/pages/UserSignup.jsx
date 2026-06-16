import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../contexts/UserContxt";
import "./UserSignup.css";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    setErrors({});

    const newUser = {
      firstName,
      lastName,
      email,
      password,
      address,
      contactNumber,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser,
      );

      if (!response) {
        return;
      }

      if (response.status === 201) {
        const data = response.data;
        setSuccessMessage(response.data.message);

        setUser(data.user);

        localStorage.setItem("token", data.token);

        navigate("/users/home");
      }

      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setAddress("");
      setContactNumber("");
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({
          general: error.response.data.message,
        });
      }

      if (error.response?.data?.errors) {
        const backendErrors = {};

        error.response.data.errors.forEach((err) => {
          backendErrors[err.path] = err.msg;
        });

        setErrors(backendErrors);
      }

      console.error(error);
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

          console.log(response);
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
    <div className="signup-page">
      <div className="signup-overlay"></div>

      <div className="signup-card">
        <h1 className="logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={submitHandler}>
          <h3>What's your name?</h3>

          <div className="name-row">
            <input
              className="input-field"
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
              className="input-field"
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
            className="input-field"
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

          <h3>Contact Number</h3>

          <input
            className="input-field"
            required
            type="tel"
            placeholder="+91 XXXXX XXXXX"
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

          <h3>Delivery Address</h3>

          <input
            className="input-field"
            required
            type="text"
            placeholder="Enter delivery address"
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

          <h3>Create Password</h3>

          <input
            className="input-field"
            required
            type="password"
            placeholder="Enter password"
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

          <button type="submit" className="signup-btn">
            Create Account
          </button>
        </form>

        <p className="login-text">
          Already have an account?
          <Link to="/users/login"> Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
