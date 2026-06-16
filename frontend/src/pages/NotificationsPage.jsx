import React, { useContext, useEffect, useState } from "react";
import "./NotificationsPage.css";
import { SocketContext } from "../contexts/SocketContext";
import {MdNotificationsActive} from "react-icons/md";

const NotificationsPage = () => {
  const { socket } = useContext(SocketContext);
  const [activeMessage, setActiveMessage] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = () => {
      setActiveMessage(true);
    };

    const handleReached = () => {
      setActiveMessage(false);
    };

    socket.on(
      "locaton_update_from_captain_throught_server",
      handleLocationUpdate,
    );
    socket.on("reached", handleReached);

    return () => {
      socket.off(
        "locaton_update_from_captain_throught_server",
        handleLocationUpdate,
      );
      socket.off("reached", handleReached);
    };
  }, [socket]);

  return (
    <div className="notifications-page">
      <div className="notifications-overlay"></div>

      <div className="notifications-content">
        <div className="notifications-card">
          {activeMessage ? (
            <>
              <div className="truck-icon">
                <img
                  src="https://res.cloudinary.com/dftacepnw/image/upload/v1781441948/edited-photo_komop5.png"
                  alt="Truck"
                />
              </div>
              <h1>Driver is on the way</h1>
              <p>to track your order go to home page and click on the track order</p>
            </>
          ) : (
            <>
              
              <div className="notification-icon">
                <MdNotificationsActive size={50} />
              </div>
              <h1>No Notifications</h1>
              <p>
                You're all caught up.
                <br />
                New notifications will appear here.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
