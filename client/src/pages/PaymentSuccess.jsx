import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg text-center">

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Your booking has been successfully confirmed.
        </p>

        <Link
          to="/bookings"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg"
        >
          View My Bookings
        </Link>

      </div>

    </div>
  );
};

export default PaymentSuccess;