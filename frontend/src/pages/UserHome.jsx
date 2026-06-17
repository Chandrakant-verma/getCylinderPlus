import UserManageOerder from "../components/UserManageOrder";
import UserZeroActiveOrder from "../components/UserZeroActiveOrder";
import UserPaymentPending from "../components/UserPaymentPending";
import { OrderDataContext } from "../contexts/OrderContext";
import { UserDataContext } from "../contexts/UserContxt";
import { SocketContext } from "../contexts/SocketContext";
import React, { useContext, useEffect } from "react";
import "./UserHome.css";
import Payment from "./Payment";

const UserHome = () => {
  const { order, setOrder } = useContext(OrderDataContext);
  const { user, setUser } = useContext(UserDataContext);
  const { socket } = useContext(SocketContext);

  const needsPayment =
    order?.deliveryStatus === "reached" && order?.paymentStatus === "pending";

  const activeDelivery = order?.deliveryStatus === "pending";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });

    fetch(`${import.meta.env.VITE_BASE_URL}/users/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const orders = data.orders || [];

        const orderToShow =
          orders.find(
            (order) =>
              order.deliveryStatus === "reached" &&
              order.paymentStatus === "pending",
          ) ||
          orders.find((order) => order.deliveryStatus === "pending") ||
          null;

        setOrder(orderToShow);
      });
  }, [socket, order]);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join", {
      userId: user._id,
      userType: "user",
    });
  }, [socket, user]);

  return (
    <div className="user-home">
      <div className="home-overlay"></div>

      <header className="home-header">
        <div className="welcome-text">
          Welcome, {user?.name.firstName || "User"}
        </div>
      </header>

      {needsPayment ? (
        <Payment />
      ) : activeDelivery ? (
        <UserManageOerder />
      ) : (
        <UserZeroActiveOrder />
      )}
    </div>
  );
};

export default UserHome;
