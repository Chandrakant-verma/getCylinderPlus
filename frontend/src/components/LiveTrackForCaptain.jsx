import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoadScript,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { SocketContext } from "../contexts/SocketContext";
import { CaptainDataContext } from "../contexts/CaptainContext";
import "./LiveTrackForCaptain.css";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const LiveTrackForCaptain = () => {
  const { socket } = useContext(SocketContext);
  const { deliveryStage, setDeliveryStage } = useContext(CaptainDataContext);
  const { currentOrder, setCurrentOrder } = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const [captainLocation, setCaptainLocation] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [icons, setIcons] = useState(null);

  // Get customer coordinates
  useEffect(() => {
    if (!currentOrder?.shippingAddress) return;

    const fetchCoordinates = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates?address=${encodeURIComponent(
            currentOrder.shippingAddress,
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await res.json();

        setUserPosition({
          lat: Number(data.lat),
          lng: Number(data.lng),
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoordinates();
  }, [currentOrder]);

  // Get captain live location
  useEffect(() => {
    if (!currentOrder?.user) return;

    const updatePosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCaptainLocation(locationData);

          socket.emit(`location_update_from_captain_for_server`, {
            userId: currentOrder.user,
            locationData: locationData,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
      );
    };

    updatePosition();

    const interval = setInterval(updatePosition, 10000);

    return () => clearInterval(interval);
  }, [socket, currentOrder]);

  // Create route
  useEffect(() => {
    if (!window.google) return;
    if (!captainLocation) return;
    if (!userPosition) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: captainLocation,
        destination: userPosition,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log("Directions status:", status);

        if (status === "OK") {
          setDirections(result);
        }
      },
    );
  }, [captainLocation, userPosition]);

  return (
    <div className="captain-tracking-page">
      <div className="captain-tracking-header">
        <h1 className="captain-tracking-logo">
          <span className="get">get</span>
          <span className="cylinder">Cylinder</span>
        </h1>

        <p>Navigate To Customer</p>
      </div>

      <div className="captain-map-container">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          {captainLocation && userPosition && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
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
          )}
        </LoadScript>
      </div>

      <div className="reached-section">
        <button
          className="reached-btn"
          onClick={() => {
            navigate("/captains/reached");
          }}
        >
          Reached Customer
        </button>
      </div>
    </div>
  );
};

export default LiveTrackForCaptain;
