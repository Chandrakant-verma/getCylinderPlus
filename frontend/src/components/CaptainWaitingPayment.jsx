import { SocketContext } from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

const WaitingPayment = () => {

  const {socket} = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
  socket.on("payment_completed", (data) => {
    if (data.orderId === currentOrder._id) {
      navigate("/captains/home");
    }
  });

  return () => {
    socket.off("payment_completed");
  };
}, [socket, currentOrder]);

  return (
    <div className="reached-container">
      <div className="reached-card">

        <h2 className="reached-title">
          Waiting For Customer Payment
        </h2>

        <p className="reached-subtitle">
          OTP verified successfully.
          Delivery will complete automatically after payment.
        </p>

      </div>
    </div>
  );
};

export default WaitingPayment;