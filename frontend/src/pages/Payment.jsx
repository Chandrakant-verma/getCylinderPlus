import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderDataContext } from "../contexts/OrderContext";
import "./Payment.css";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { order, setOrder } = useContext(OrderDataContext);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Already loaded, no need to do anything
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      // Fallback: inject script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load Razorpay. Check your internet connection.");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/users/create-order`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,

        name: "getCylinder",

        description: "Cylinder Delivery Payment",

        handler: async function (response) {
          const verifyRes = await fetch(
            `${import.meta.env.VITE_BASE_URL}/users/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },

              body: JSON.stringify(response),
            },
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Payment Successful");
            setOrder(null);
            navigate("/users/successful");
          }
        },
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        alert("Payment failed");
      });

      razorpay.open();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        <h1 className="payment-logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>
        <h2 className="payment-title">Complete Your Payment</h2>

        <div className="order-details">
          <div className="detail-row">
            <span>Name</span>
            <strong>
              {order.user?.firstName} {order.user?.lastName}
            </strong>
          </div>
          <div className="detail-row">
            <span>Total Amount</span>
            <strong>₹{order.totalAmount}</strong>
          </div>
          <div className="detail-row">
            <span>Status</span>
            <strong>{order.deliveryStatus}</strong>
          </div>
          <div className="detail-row">
            <span>Address</span>
            <strong>{order.shippingAddress}</strong>
          </div>
        </div>

        <button className="pay-btn" onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
