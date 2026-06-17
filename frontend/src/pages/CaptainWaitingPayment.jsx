import "./CaptainWaitingPayment.css";

const WaitingPayment = () => {
  return (
    <div className="waiting-payment-page">
      <div className="waiting-payment">
        <h2>OTP Verified</h2>

        <p>
          Waiting for customer payment...
        </p>
      </div>
    </div>
  );
};

export default WaitingPayment;