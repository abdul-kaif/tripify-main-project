import React from "react";
import { apiFetch } from "../../services/api";
const StripePayment = ({ handleBookPackage }) => {
  const handleStripe = async () => {
    handleBookPackage();

    try {
      const bookingData = JSON.parse(localStorage.getItem("pendingBooking"));
                 
      console.log("Booking data retrieved from localStorage:", bookingData);
      if (!bookingData) {
        console.log("No booking data found");
        return;
      }
      console.log(bookingData);
     const res = await apiFetch("/payment/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingData.totalPrice,
        }),
      });

         console.log('response:', res);

      const data = await res.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleStripe}
      className="p-2 mt-2 rounded bg-[#EB662B] text-white hover:opacity-90 cursor-pointer w-full"
    >
      Pay to Book
    </button>
  );
};

export default StripePayment;
