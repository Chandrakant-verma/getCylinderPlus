import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LiveTrackForUser.css";

import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { SocketContext } from "../contexts/SocketContext";
import { UserDataContext } from "../contexts/UserContxt";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const LiveTracking = () => {
  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  const [driverReady, setDriverReady] = useState(false);

  const [captainLocation, setCaptainLocation] = useState(null);

  const [userPosition, setUserPosition] = useState(null);

  const [directions, setDirections] = useState(null);

  const [otp, setOtp] = useState(null);

  const [icons, setIcons] = useState(null);

  // Get user coordinates and OTP
  useEffect(() => {
    if (!user?.address) return;

    const fetchCoordinates = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/maps/get-coordinates?address=${encodeURIComponent(user.address)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await res.json();

        setUserPosition({
          lat: data.lat,
          lng: data.lng,
        });
      } catch (err) {
        console.log(err);
      }
    };

    const getOtp = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/users/get-otp`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const temp = await res.json();

        setOtp(temp);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCoordinates();
    getOtp();
  }, [user]);

  // Socket listeners
  useEffect(() => {
    if (!socket || !user?._id) return;

    const locationHandler = (data) => {
      if (data.userId == user._id) {
        setCaptainLocation({
          lat: data.locationData.lat,
          lng: data.locationData.lng,
        });

        setDriverReady(true);
      }
    };

    socket.on("payment_completed", () => {
      navigate("/users/successful");
    });

    // const reachedHandler = (data) => {
    //   if (data.userId === user._id) {
    //     navigate("/users/successful");
    //   }
    // };

    socket.on("otp_verified", () => {
      navigate("/users/payment");
    });

    socket.on("locaton_update_from_captain_throught_server", locationHandler);

    //socket.on("reached", reachedHandler);

    return () => {
      socket.off(
        "locaton_update_from_captain_throught_server",
        locationHandler,
      );

      //socket.off("reached", reachedHandler);
    };
  }, [socket, user, navigate]);

  // Generate route
  useEffect(() => {
    if (!window.google || !captainLocation || !userPosition) return;

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin: captainLocation,
        destination: userPosition,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        }
      },
    );
  }, [captainLocation, userPosition]);

  if (!driverReady || !captainLocation || !userPosition) {
    return (
      <div className="tracking-page">
        <div className="tracking-header">
          <h1 className="tracking-logo">
            <span className="get">get</span>
            <span className="cylinder">Cylinder</span>
          </h1>

          <p>Live Delivery Tracking</p>
        </div>

        <div className="tracking-loading">
          <div className="tracking-loading-card">
            <div className="truck-icon">
              <img
                src="https://res.cloudinary.com/dftacepnw/image/upload/v1781441948/edited-photo_komop5.png"
                alt="Truck"
              />
            </div>

            <h2>Driver is not ready yet</h2>

            <p>Waiting for driver's live location...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <h1 className="tracking-logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        <p>Live Delivery Tracking</p>
      </div>

      <div className="otp-display">
        OTP : <span>{otp}</span>
      </div>

      <div className="tracking-map-container">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={captainLocation}
            zoom={15}
            onLoad={() => {
              setIcons({
                captain: {
                  url: "https://res.cloudinary.com/dftacepnw/image/upload/v1781441948/edited-photo_komop5.png",

                  scaledSize: new window.google.maps.Size(70, 70),
                },

                user: {
                  url: "https://res.cloudinary.com/dftacepnw/image/upload/v1781459080/pngtree-3d-profile-icon-png-image_16279302-removebg-preview_upuiqp.png",

                  scaledSize: new window.google.maps.Size(55, 55),
                },
              });
            }}
          >
            <Marker position={captainLocation} icon={icons?.captain} />

            <Marker position={userPosition} icon={icons?.user} />

            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: "#2E7D32",
                    strokeWeight: 7,
                    strokeOpacity: 1,
                  },
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default LiveTracking;
