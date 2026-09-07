import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { OrderDataContext } from "../contexts/OrderContext";
import { SocketContext } from "../contexts/SocketContext";
import { UserDataContext } from "../contexts/UserContxt";
import LiveTrack from "./LiveTrackForUser";
import { Link } from "react-router-dom";
import "./UserManageOrder.css";

const UserManageOrder = () => {
  const { socket } = useContext(SocketContext);
  const { order, setOrder } = useContext(OrderDataContext);
  const { user, setUser} = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    navigate("/users/track-order", {
      state: {
        order,
      },
    });
  };

  const onCancelOrder = async () => {

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/users/orders/cancel/${order._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    socket.emit("canceled_from_user", { branch: order.branch });

    setOrder([]);
  };
  return (
    <div className="manage-order-container">
      <div className="manage-order-card">
        <h1 className="manage-logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        <h2 className="manage-title">Manage Your Order</h2>

        <div className="order-details">
          <div className="detail-row">
            <span>Name</span>
            <strong>{user.name.firstName}</strong>
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

        <div className="action-buttons">
          <button className="track-btn" onClick={handleTrackOrder}>
            Track Order
          </button>

          <button className="cancel-btn" onClick={onCancelOrder}>
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManageOrder;
