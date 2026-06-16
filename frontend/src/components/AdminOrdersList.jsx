import React, { useEffect, useState } from "react";
import "./AdminOrdersList.css";

const AdminOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/admins/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await response.json();

        setOrders(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const groupedData = {};

  orders.forEach((order) => {
    const branchName = order.branch?.branchName || "Unknown Branch";

    const userId = order.user?._id;

    const userName = `${order.user?.name?.firstName || ""}
      ${order.user?.name?.lastName || ""}`;

    if (!groupedData[branchName]) {
      groupedData[branchName] = {};
    }

    if (!groupedData[branchName][userId]) {
      groupedData[branchName][userId] = {
        userName,
        pending: [],
        cancelled: [],
        delivered: [],
      };
    }

    groupedData[branchName][userId][order.deliveryStatus]?.push(order);
  });

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
    <div className="orders-page">
      <div className="orders-overlay"></div>

      <div className="orders-content">
        <h1 className="orders-title">Orders Dashboard</h1>

        {Object.entries(groupedData).map(([branchName, users]) => (
          <div key={branchName} className="branch-section">
            <h2 className="branch-title">{branchName}</h2>

            {Object.entries(users).map(([userId, userData]) => (
              <div key={userId} className="user-section">
                <h3 className="user-title">{userData.userName}</h3>

                {/* Pending */}

                <div className="status-block">
                  <h4 className="pending">
                    Pending Orders ({userData.pending.length})
                  </h4>

                  {userData.pending.map((order) => (
                    <div key={order._id} className="order-card">
                      <p>Amount: ₹{order.totalAmount}</p>

                      <p>
                        Address:
                        {order.shippingAddress}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Delivered */}

                <div className="status-block">
                  <h4 className="delivered">
                    Delivered Orders ({userData.delivered.length})
                  </h4>

                  {userData.delivered.map((order) => (
                    <div key={order._id} className="order-card">
                      <p>Amount: ₹{order.totalAmount}</p>

                      <p>
                        Address:
                        {order.shippingAddress}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Cancelled */}

                <div className="status-block">
                  <h4 className="cancelled">
                    Cancelled Orders ({userData.cancelled.length})
                  </h4>

                  {userData.cancelled.map((order) => (
                    <div key={order._id} className="order-card">
                      <p>Amount: ₹{order.totalAmount}</p>

                      <p>
                        Address:
                        {order.shippingAddress}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersList;
