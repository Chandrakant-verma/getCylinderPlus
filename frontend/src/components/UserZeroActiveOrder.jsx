import React, { useContext, useEffect, useState } from "react";
import { OrderDataContext } from "../contexts/OrderContext";
import { UserDataContext } from "../contexts/UserContxt";
import { SocketContext } from "../contexts/SocketContext";
import "./UserZeroActiveOrder.css";

const UserZeroActiveOrder = () => {
  const { order, setOrder } = useContext(OrderDataContext);
  const { user, setUser } = useContext(UserDataContext);
  const [totalAmount, setTotalAmount] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
  const getPrice = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/price`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();


      setTotalAmount(data.price); // optional

    } catch (err) {
      console.log(err);
    }
  };

  getPrice();
});

  const makeOrder = async () => {
    setError(null);

    socket.emit("order_made_from_user", { branch: user.branch });

    if (!totalAmount || !user?.address) {
      setError("Please provide both total amount and shipping address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            totalAmount: totalAmount,
            shippingAddress: user.address,
            branch: user.branch,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const data = await response.json();
      setOrder(data.order);
      setTotalAmount(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-order-container">
      <div className="user-order-card">
        <h1 className="order-logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        <h2 className="order-title">No Active Orders</h2>

        <p className="order-subtitle">Book a new LPG cylinder for delivery.</p>

        <div className="order-field">
          <label>Total Amount</label>

          <input type="text" value={totalAmount} readOnly />
        </div>

        <div className="order-field">
          <label>Shipping Address</label>

          <input type="text" value={user?.address || ""} readOnly />
        </div>

        {error && <div className="order-error">{error}</div>}

        <button className="order-btn" onClick={makeOrder} disabled={loading}>
          {loading ? "Submitting..." : "Order Cylinder"}
        </button>
      </div>
    </div>
  );
};

export default UserZeroActiveOrder;
