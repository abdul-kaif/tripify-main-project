import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import RatingCard from "./RatingCard";
import { toast } from "react-toastify";
import MapModal from "./components/MapModal";
import { Autoplay } from "swiper/modules";
import { FaClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../services/api";

const Package = () => {
  const { t } = useTranslation();

  const [showMap, setShowMap] = useState(false);
  SwiperCore.use([Navigation]);

  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();

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
    packageImages: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [ratingsData, setRatingsData] = useState({
    rating: 0,
    review: "",
    packageId: params?.id,
    userRef: currentUser?._id,
    username: currentUser?.username,
    userProfileImg: currentUser?.avatar,
  });

  const [packageRatings, setPackageRatings] = useState([]);
  const [ratingGiven, setRatingGiven] = useState(false);

  const getPackageData = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/package/get-package-data/${params?.id}`);
      const data = await res.json();
      const pkg = data?.packageData || data?.data;

      if (data?.success) {
       setPackageData({
  packageName: pkg?.packageName,
  packageDescription: pkg?.packageDescription,
  packageDestination: pkg?.packageDestination,
  packageDays: pkg?.packageDays,
  packageNights: pkg?.packageNights,
  packageAccommodation: pkg?.packageAccommodation,
  packageTransportation: pkg?.packageTransportation,
  packageMeals: pkg?.packageMeals,
  packageActivities: pkg?.packageActivities,
  packagePrice: pkg?.packagePrice,
  packageDiscountPrice: pkg?.packageDiscountPrice,
  packageOffer: pkg?.packageOffer,
  packageRating: pkg?.packageRating,
  packageTotalRatings: pkg?.packageTotalRatings,
  packageImages: pkg?.packageImages,
});
      } else {
        setError(data?.message);
      }

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const giveRating = async () => {
    if (ratingGiven) {
      toast.error(t("package.already-rated"));
      return;
    }

    if (!ratingsData.rating && !ratingsData.review) {
      toast.error(t("package.atleast-one-required"));
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch("/api/rating/give-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ratingsData),
      });

      const data = await res.json();

      if (data?.success) {
        toast.success(t("package.rating-submitted"));
        getPackageData();
        getRatings();
        checkRatingGiven();
      } else {
        toast.error(t("package.something-wrong"));
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getRatings = async () => {
    try {
      const res = await apiFetch(`/api/rating/get-ratings/${params.id}/4`);
      const data = await res.json();
      setPackageRatings(data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const checkRatingGiven = async () => {
    try {
      const res = await apiFetch(
        `/api/rating/rating-given/${currentUser?._id}/${params?.id}`
      );
      const data = await res.json();
      setRatingGiven(data?.given);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (params.id) {
      getPackageData();
      getRatings();
    }
    if (currentUser) {
      checkRatingGiven();
    }
  }, [params.id, currentUser]);

  return (
    <div className="w-full">
      {loading && (
        <p className="text-center font-semibold">
          {t("package.loading")}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* --- Top Section --- */}
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Left */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h1 className="text-[#05073C] text-lg md:text-3xl font-semibold">
                {packageData.packageName}
              </h1>

              <div className="flex items-center gap-10 my-3">
                <p className="font-semibold">{packageData.packageDestination}</p>
                <p className="font-semibold">₹{packageData.packagePrice}</p>
              </div>

              {(packageData.packageDays > 0 ||
                packageData.packageNights > 0) && (
                <p className="flex items-center gap-2">
                  <FaClock />
                  {packageData.packageDays} {t("package.days")}
                  {" - "}
                  {packageData.packageNights} {t("package.nights")}
                </p>
              )}

              {packageData.packageTotalRatings > 0 && (
                <div className="flex items-center my-2">
                  <Rating
                    value={packageData.packageRating}
                    readOnly
                    precision={0.1}
                  />
                  <p>({packageData.packageTotalRatings})</p>
                </div>
              )}

              <div className="flex flex-col my-6">
                <div className="flex gap-5 items-center">
                  <h4 className="font-semibold">{t("package.activities")}</h4>
                  <p>{packageData.packageActivities}</p>
                </div>

                <div className="flex gap-5 items-center">
                  <h4 className="font-semibold">{t("package.meals")}</h4>
                  <p>{packageData.packageMeals}</p>
                </div>

                <div className="flex gap-5 items-center">
                  <h4 className="font-semibold">{t("package.transportation")}</h4>
                  <p>{packageData.packageTransportation}</p>
                </div>
              </div>
            </div>

            {/* Right: Images */}
            <div className="w-full md:w-1/2">
              <Swiper
                modules={[Autoplay]}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                loop
                className="w-full h-[300px] md:h-[400px]"
              >
                {packageData.packageImages?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={`${img}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* --- Description --- */}
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-10 py-16 px-4">

            <div className="w-full md:w-1/2 flex flex-col gap-6 mt-12">
              <p className="text-2xl font-semibold">
                {t("package.description")}
              </p>

              <p className="text-gray-700">
                {packageData.packageDescription}
              </p>

              <button
                onClick={() =>
                  currentUser
                    ? navigate(`/booking/${params.id}`)
                    : navigate("/login")
                }
                className="w-[200px] bg-[#EB662B] text-white p-3 rounded"
              >
                {t("package.book-now")}
              </button>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <h4 className="text-2xl font-semibold">
                {t("package.accommodation")}
              </h4>
              <p>{packageData.packageAccommodation}</p>
            </div>
          </div>

          <hr className="border border-[#EB662B]" />

          {/* --- Rating Section --- */}
          <div className="w-full flex flex-col py-16 items-center">
            <h4 className="text-xl">{t("package.rating-reviews")}</h4>

            {!ratingGiven && currentUser && (
              <div className="w-full sm:max-w-[640px] flex flex-col gap-2">
                <Rating
                  value={ratingsData.rating}
                  onChange={(e, newValue) =>
                    setRatingsData({ ...ratingsData, rating: newValue })
                  }
                />

                <textarea
                  className="w-full p-3 border rounded"
                  placeholder={t("package.write-review")}
                  value={ratingsData.review}
                  onChange={(e) =>
                    setRatingsData({ ...ratingsData, review: e.target.value })
                  }
                />

                <button
                  disabled={loading}
                  onClick={giveRating}
                  className="w-full p-2 bg-[#EB662B] text-white rounded"
                >
                  {loading ? t("package.loading") : t("package.submit")}
                </button>
              </div>
            )}

            <div className="mt-3 w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <RatingCard packageRatings={packageRatings} />
            </div>
          </div>
        </>
      )}

      {showMap && (
        <MapModal
          location={packageData.packageDestination}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};

export default Package;
