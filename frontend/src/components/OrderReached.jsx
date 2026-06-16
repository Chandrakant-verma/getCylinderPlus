import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../contexts/CaptainContext";
import { SocketContext } from "../contexts/SocketContext";
import "./OrderReached.css";

const OrderReached = () => {
  const [otp, setOtp] = useState("");
  const { currentOrder, setCurrentOrder } = useContext(CaptainDataContext);
  const { deliveryStage, setDeliveryStage } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/captains/verifyOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: currentOrder._id,
            otp,
          }),
        },
      );

      const data = await res.json();

      // if (res.ok) {
      //   setDeliveryStage("successful");
      //   socket.emit('successfully delivered',{userId : currentOrder.user});

      if (res.ok) {
        socket.emit("otp_verified", {
          userId: currentOrder.user,
        });

        alert("OTP verified successfully.");

        navigate("/captains/home");
      } else {
        alert(data.message || "Failed to complete delivery");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="reached-container">
      <div className="reached-card">
        <h1 className="reached-logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        <h2 className="reached-title">Complete Delivery</h2>

        <p className="reached-subtitle">
          Verify customer OTP and payment status.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="reached-field">
            <label>Delivery OTP</label>

            <input
              type="text"
              value={otp}
              maxLength={6}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          <button type="submit" className="complete-btn" disabled={!otp}>
            Complete Delivery
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderReached;
