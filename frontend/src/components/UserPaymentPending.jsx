import { SocketContext } from "../contexts/SocketContext";
import { useContext } from "react";
import { OrderDataContext } from "../contexts/OrderContext";

const UserPaymentPending = () => {
  const { socket } = useContext(SocketContext);
  const { order, setOrder } = useContext(OrderDataContext);

  return (
    <div>
      

      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default UserPaymentPending;
