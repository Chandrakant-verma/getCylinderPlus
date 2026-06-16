import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../contexts/CaptainContext";
import { SocketContext } from "../contexts/SocketContext";
import LiveTrackForCaptain from "../components/LiveTrackForCaptain";
import Successful from "../components/Successful";
import OrderReached from "../components/OrderReached";
import WaitingPayment from "./CaptainWaitingPayment";
import "./CaptainHome.css";

const CaptainHome = () => {
  const { orders, setOrders } = useContext(CaptainDataContext);
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const { currentOrder, setCurrentOrder } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const { deliveryStage, setDeliveryStage } = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const [msg, setMsg] = useState();

  console.log(deliveryStage, currentOrder);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/captains/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setCaptain(data.captain);
      } else {
        console.error("Failed to fetch captain profile");
      }
    } catch (error) {
      console.error("Error fetching captain profile:", error);
    }
  };

  socket.on("order_made", (data) => {
    setMsg(data.time);
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/captains/assigned-orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();

          const orders = data.orders || [];

          setOrders(orders);

          const paymentPendingOrder = orders.find(
            (order) =>
              order.deliveryStatus === "reached" &&
              order.paymentStatus === "pending",
          );

          if (paymentPendingOrder) {
            setCurrentOrder(paymentPendingOrder);
            setDeliveryStage("waiting-payment");
          }
        } else {
          console.error("Failed to fetch assigned orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    fetchProfile();
  }, [msg]);

  useEffect(() => {
    if (!captain?._id) return;

    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });
  }, [socket, captain]);

  useEffect(() => {
    socket.on("payment_completed", (data) => {
      if (currentOrder && data.orderId === currentOrder._id) {
        setDeliveryStage("successful");
      }
    });

    return () => {
      socket.off("payment_completed");
    };
  }, [socket, currentOrder]);

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
    <div className="captain-home">
      <div className="home-content">
        {/* Header */}
        <div className="home-header">
          <h1 className="logo">
            <span className="get">get</span>
            <span className="cylinder">Cylinder</span>
          </h1>

          <div className="captain-name">
            Welcome, {captain?.name?.firstName || "Captain"}
          </div>
        </div>

        {/* Delivery Flow */}
        {/* <div className="delivery-stage">
          {deliveryStage === "tracking" && currentOrder && (
            <LiveTrackForCaptain />
          )}

          {deliveryStage === "reached" && currentOrder && <OrderReached />}

          {deliveryStage === "waiting-payment" && <WaitingPayment />}

          {deliveryStage === "successful" && <Successful />}
        </div> */}

        {/* Orders */}
        <h2 className="orders-title">Orders Assigned To Your Branch</h2>

        <div className="orders-grid">
          {orders?.length > 0 ? (
            orders.map((order) => (
              <div className="order-card" key={order._id}>
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>

                <p>
                  <strong>Customer:</strong>{" "}
                  {typeof order.user === "object"
                    ? `${order.user?.firstName || ""} ${
                        order.user?.lastName || ""
                      }`
                    : order.user}
                </p>

                <p>
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </p>

                <p>
                  <strong>Status:</strong> {order.deliveryStatus}
                </p>

                <p>
                  <strong>Address:</strong> {order.shippingAddress}
                </p>

                {order.deliveryStatus === "reached" &&
                order.paymentStatus === "pending" ? (
                  <button
                    className="deliver-btn"
                    onClick={() => {
                      setCurrentOrder(order);

                      navigate("/captains/waiting-payment");
                    }}
                  >
                    Check Payment
                  </button>
                ) : (
                  <button
                    className="deliver-btn"
                    onClick={() => {
                      setCurrentOrder(order);

                      navigate("/captains/live-track");
                    }}
                  >
                    Start Delivery
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="dashboard-card">
              <p>No orders are currently assigned to your branch.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;
