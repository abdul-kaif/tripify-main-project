import React, { useEffect, useState } from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import Map from "../components/Map";
import StripePayment from "../components/StripePayment";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../services/api";

const Booking = () => {
  const { t } = useTranslation();

  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);

  const handleClick = () => setShowMap(true);

  const [packageData, setPackageData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageRating: 0,
    packageTotalRatings: 0,
    packageImages: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [bookingData, setBookingData] = useState({
    totalPrice: 0,
    packageDetails: null,
    buyer: null,
    persons: 1,
    date: null
  });

  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/package/get-package-data/${params?.packageId}`);
      const data = await res.json();

      if (data?.success) {
        setPackageData({
          packageName: data?.packageData?.packageName,
          packageDescription: data?.packageData?.packageDescription,
          packageDestination: data?.packageData?.packageDestination,
          packageDays: data?.packageData?.packageDays,
          packageNights: data?.packageData?.packageNights,
          packageAccommodation: data?.packageData?.packageAccommodation,
          packageTransportation: data?.packageData?.packageTransportation,
          packageMeals: data?.packageData?.packageMeals,
          packageActivities: data?.packageData?.packageActivities,
          packagePrice: data?.packageData?.packagePrice,
          packageDiscountPrice: data?.packageData?.packageDiscountPrice,
          packageOffer: data?.packageData?.packageOffer,
          packageRating: data?.packageData?.packageRating,
          packageTotalRatings: data?.packageData?.packageTotalRatings,
          packageImages: data?.packageData?.packageImages
        });
      } else {
        setError(data?.message || "Something went wrong!");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookPackage = async () => {
    if (
      bookingData.packageDetails === "" ||
      bookingData.buyer === "" ||
      bookingData.totalPrice <= 0 ||
      bookingData.persons <= 0 ||
      bookingData.date === ""
    ) {
      alert(t("bookingPage.booking.allFieldsRequired"));
      return;
    }

    localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    alert(t("bookingPage.booking.proceedingPayment"));
  };

  useEffect(() => {
    if (params?.packageId) getPackageData();

    let date = new Date().toISOString().substring(0, 10);
    let d = date.substring(0, 8) + (parseInt(date.substring(8)) + 1);
    setCurrentDate(d);
  }, [params?.packageId]);

  useEffect(() => {
    if (packageData && params?.packageId) {
      setBookingData({
        ...bookingData,
        packageDetails: params?.packageId,
        buyer: currentUser?._id,
        totalPrice: packageData?.packageDiscountPrice
          ? packageData?.packageDiscountPrice * bookingData?.persons
          : packageData?.packagePrice * bookingData?.persons
      });
    }
  }, [packageData, params]);

  return (
    <div className="w-full flex flex-col items-center rounded-full">
      <div className="w-[95%] rounded-lg flex flex-col items-center p-6 shadow-md gap-6">
        
        <h1 className="text-center font-bold text-2xl">
          {t("bookingPage.booking.title")}
        </h1>

        {/* USER INFO */}
        <div className="w-full flex flex-wrap justify-center gap-2">
          
          <div className="pr-3 md:border-r md:pr-6">
            <div className="w-full bg-[#EB662B]">
              <div className="text-white p-6 rounded-md flex flex-col gap-6">

                <div className="flex flex-col gap-4">

                  <div>
                    <label className="font-semibold">
                      {t("bookingPage.user.username")}:
                    </label>
                    <input
                      disabled
                      value={currentUser.username}
                      className="w-full mt-2 p-3 bg-gray-200 border rounded-md text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">
                      {t("bookingPage.user.email")}:
                    </label>
                    <input
                      disabled
                      value={currentUser.email}
                      className="w-full mt-2 p-3 bg-gray-200 border rounded-md text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">
                      {t("bookingPage.user.address")}:
                    </label>
                    <textarea
                      disabled
                      value={currentUser.address}
                      className="w-full mt-2 p-3 bg-gray-200 border rounded-md text-gray-800 resize-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">
                      {t("bookingPage.user.phone")}:
                    </label>
                    <input
                      disabled
                      value={currentUser.phone}
                      className="w-full mt-2 p-3 bg-gray-200 border rounded-md text-gray-800"
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* PACKAGE SECTION */}
          <div className="pl-3 md:border-l md:pl-6">
            <div className="flex flex-col gap-1">

              <div className="flex flex-wrap gap-6">
                <img
                  className="w-28"
                  src={`${packageData.packageImages[0]}`}
                  alt={t("bookingPage.booking.title")}
                />

                <div>
                  <p className="font-semibold text-lg capitalize">
                    {packageData.packageName}
                  </p>

                  <p className="flex gap-2 text-green-700 items-center font-semibold capitalize">
                    <FaMapMarkerAlt onClick={handleClick} className="cursor-pointer" />
                    {packageData.packageDestination}
                  </p>

                  {(+packageData.packageDays > 0 || +packageData.packageNights > 0) && (
                    <p className="flex items-center gap-2 my-2">
                      <FaClock />

                      {+packageData.packageDays > 0 &&
                        `${packageData.packageDays} ${
                          packageData.packageDays > 1
                            ? t("bookingPage.package.days")
                            : t("bookingPage.package.day")
                        }`}

                      {+packageData.packageDays > 0 && +packageData.packageNights > 0 && " - "}

                      {+packageData.packageNights > 0 &&
                        `${packageData.packageNights} ${
                          packageData.packageNights > 1
                            ? t("bookingPage.package.nights")
                            : t("bookingPage.package.night")
                        }`}
                    </p>
                  )}
                </div>
              </div>

              {/* DATE */}
              <div className="flex gap-4 items-center justify-center my-1">
                <label className="font-semibold">
                  {t("bookingPage.package.selectDate")}:
                </label>
                <input
                  type="date"
                  min={currentDate}
                  className="border rounded"
                  onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                  }
                />
              </div>

              {/* PRICE */}
              <p className="flex gap-1 text-xl justify-center items-center font-semibold">
                {t("bookingPage.package.price")}:
                {packageData.packageOffer ? (
                  <>
                    <span className="line-through text-gray-700">
                      ₹{packageData.packagePrice}
                    </span>

                    -
                    <span>₹{packageData.packageDiscountPrice}</span>

                    <span className="ml-3 bg-[#EB662B] text-white px-5 rounded text-xs md:text-lg">
                      {Math.floor(
                        ((packageData.packagePrice - packageData.packageDiscountPrice) /
                          packageData.packagePrice) *
                          100
                      )}
                      {t("bookingPage.package.off")}
                    </span>
                  </>
                ) : (
                  <span className="text-[#EB662B]">₹{packageData.packagePrice}</span>
                )}
              </p>

              {/* COUNTER */}
              <div className="flex items-center border-2 rounded-full px-2 w-max gap-3">

                <button
                  className="p-2 bg-gray-100 rounded-full font-semibold hover:bg-red-500"
                  onClick={() => {
                    if (bookingData.persons > 1) {
                      setBookingData({
                        ...bookingData,
                        persons: bookingData.persons - 1,
                        totalPrice: packageData.packageDiscountPrice
                          ? packageData.packageDiscountPrice * (bookingData.persons - 1)
                          : packageData.packagePrice * (bookingData.persons - 1)
                      });
                    }
                  }}
                >
                  -
                </button>

                <input
                  disabled
                  type="text"
                  value={bookingData.persons}
                  className="border text-center text-lg w-12 rounded-full"
                />

                <button
                  className="p-2 bg-gray-100 rounded-full font-semibold hover:bg-green-400"
                  onClick={() => {
                    if (bookingData.persons < 10) {
                      setBookingData({
                        ...bookingData,
                        persons: bookingData.persons + 1,
                        totalPrice: packageData.packageDiscountPrice
                          ? packageData.packageDiscountPrice * (bookingData.persons + 1)
                          : packageData.packagePrice * (bookingData.persons + 1)
                      });
                    }
                  }}
                >
                  +
                </button>
              </div>

              {/* TOTAL PRICE */}
              <p className="text-xl font-semibold">
                {t("bookingPage.package.totalPrice")}:{" "}
                <span className="text-[#EB662B]">
                  ₹
                  {packageData.packageDiscountPrice
                    ? packageData.packageDiscountPrice * bookingData.persons
                    : packageData.packagePrice * bookingData.persons}
                </span>
              </p>

              {/* PAYMENT SECTION */}
              <div className="my-2 max-w-[300px]">
                {/* <p className="font-semibold">
                  Payment:
                  {!instance
                    ? t("bookingPage.payment.notReady")
                    : t("bookingPage.payment.warning")}
                </p> */}
              </div>

              <StripePayment handleBookPackage={handleBookPackage} />

            </div>
          </div>
        </div>
      </div>

      {showMap && <Map destinationName={packageData.packageDestination} />}
    </div>
  );
};

export default Booking;