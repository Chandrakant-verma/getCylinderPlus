import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FiHome,
  FiPackage,
  FiBell,
  FiUser,
} from "react-icons/fi";

import "./BottomNavbar.css";

const BottomNavbar = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname.includes("/login") ||
    location.pathname.includes("/signup");

  if (hideNavbar) {
    return null;
  }

  const isUser = location.pathname.startsWith("/users");
  const isCaptain = location.pathname.startsWith("/captains");
  const isAdmin = location.pathname.startsWith("/admins");

  let homeRoute = "/";
  let profileRoute = "/";
  let ordersRoute = "/";
  let notificationRoute = "/";

  if (isUser) {
    homeRoute = "/users/home";
    profileRoute = "/users/profile";
    ordersRoute = "/users/orders";
    notificationRoute = "/users/notifications"
  }

  if (isCaptain) {
    homeRoute = "/captains/home";
    profileRoute = "/captains/profile";
    ordersRoute = "/captains/orders";
    notificationRoute = "/captains/notifications"
  }

  if (isAdmin) {
    homeRoute = "/admins/home";
    profileRoute = "/admins/profile";
    ordersRoute = "/admins/ordersList";
    notificationRoute = "/admins/notifications"
  }

  return (
    <div className="bottom-nav">
      <Link
        to={homeRoute}
        className={
          location.pathname === homeRoute
            ? "nav-item active"
            : "nav-item"
        }
      >
        <FiHome className="nav-icon" />
        <span>Home</span>
      </Link>

      {/* <Link
        to={ordersRoute}
        className={
          location.pathname === ordersRoute
            ? "nav-item active"
            : "nav-item"
        }
      >
        <FiPackage className="nav-icon" />
        <span>Orders</span>
      </Link> */}

      <Link
        to= {notificationRoute}
        className={
          location.pathname === notificationRoute
            ? "nav-item active"
            : "nav-item"
        }
      >
        <FiBell className="nav-icon" />
        <span>Alerts</span>
      </Link>

      <Link
        to={profileRoute}
        className={
          location.pathname === profileRoute
            ? "nav-item active"
            : "nav-item"
        }
      >
        <FiUser className="nav-icon" />
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavbar;