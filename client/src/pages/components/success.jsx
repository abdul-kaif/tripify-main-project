import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../services/api";

const Success = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const sendDataToBackend = async () => {
      const bookingData = JSON.parse(localStorage.getItem("pendingBooking"));

      if (!bookingData) {
        console.log('No booking data found in localStorage');
        setLoading(false);
        return;
      }

      try {
        const res = await apiFetch(
          `/api/booking/book-package/${bookingData.packageDetails}`,
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(bookingData),
          }
        );

        const data = await res.json();

        if (data.success) {
          localStorage.removeItem("bookingData");
        }
      } catch (error) {
        console.log("Error saving booking:", error);
      }

      setLoading(false);
    };

    sendDataToBackend();
  }, []);

  return (
    <div className="w-full flex justify-center items-center min-h-[70vh] flex-col px-4">
      {loading ? (
        <p className="text-xl font-semibold">
          {t("successPage.processing")}
        </p>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            {t("successPage.paymentSuccess")}
          </h1>

          <p className="text-lg mb-5 text-gray-700">
            {t("successPage.bookingConfirmed")}
          </p>

          <button
            onClick={() =>
              navigate(`/profile/${currentUser?.user_role === 1 ? "admin" : "user"}`)
            }
            className="px-4 py-2 bg-[#EB662B] text-white rounded-lg hover:opacity-90"
          >
            {t("successPage.goToProfile")}
          </button>
        </>
      )}
    </div>
  );
};

export default Success;
