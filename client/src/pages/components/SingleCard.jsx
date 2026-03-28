import { Link } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import { Rating } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import AskAIModal from "./AskAIModal";
import axios from "axios";
import { useTranslation } from "react-i18next";

const SingleCard = ({ packageData }) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);
  const [aiReply, setAIReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [defaultPrompt, setDefaultPrompt] = useState("");

  const handleAsk = async (question) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/ask`, {
        question,
        context: defaultPrompt, // ✅ send context separately
      });

      if (!res.data.success) {
        setAIReply(t("singleCardPage.ai.error"));
        return;
      }

      setAIReply(res.data.response || t("singleCardPage.ai.noAnswer"));
    } catch (error) {
      console.error(error);
      setAIReply(t("singleCardPage.ai.error"));
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-[260px] h-[360px] mx-auto flex flex-col border rounded-lg overflow-hidden shadow-md bg-white transition-transform duration-300 hover:scale-105"
    >
      {/* -------------------- IMAGE -------------------- */}
      <Link
        to={`/package/${packageData._id}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img
          src={packageData.packageImages[0]}
          alt={packageData.packageName}
          className="w-full h-[140px] object-cover"
        />
      </Link>

      {/* -------------------- CONTENT -------------------- */}
      <div className="p-3 flex flex-col items-start gap-1 flex-1">
        <p className="text-sm text-[#717171]">
          {packageData.packageDestination}
        </p>

        <h2 className="text-[#05073C] text-lg font-semibold">
          {packageData.packageName}
        </h2>

        {/* Duration */}
        {(Number(packageData.packageDays) > 0 ||
          Number(packageData.packageNights) > 0) && (
            <p className="flex text-sm items-center gap-2 text-[#717171]">
              <FaClock />

              {Number(packageData.packageDays) > 0 &&
                (packageData.packageDays > 1
                  ? `${packageData.packageDays} ${t(
                    "singleCardPage.duration.days"
                  )}`
                  : `${packageData.packageDays} ${t(
                    "singleCardPage.duration.day"
                  )}`)}

              {Number(packageData.packageDays) > 0 &&
                Number(packageData.packageNights) > 0 &&
                " - "}

              {Number(packageData.packageNights) > 0 &&
                (packageData.packageNights > 1
                  ? `${packageData.packageNights} ${t(
                    "singleCardPage.duration.nights"
                  )}`
                  : `${packageData.packageNights} ${t(
                    "singleCardPage.duration.night"
                  )}`)}
            </p>
          )}

        {/* Price */}
        <div className="flex items-center justify-between gap-2 w-full mt-1 text-sm">
          <span className="text-gray-600">
            {t("singleCardPage.price.from")}
          </span>

          {packageData.packageOffer &&
            packageData.packageDiscountPrice ? (
            <span className="flex gap-2 items-center">
              <span className="line-through text-gray-500">
                ₹{packageData.packagePrice}
              </span>
              <span className="font-semibold text-green-600">
                ₹{packageData.packageDiscountPrice}
              </span>
            </span>
          ) : (
            <span className="font-semibold text-green-600">
              ₹{packageData.packagePrice}
            </span>
          )}
        </div>

        {/* Ratings */}
        {packageData.packageTotalRatings > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <Rating
              value={packageData.packageRating}
              size="small"
              readOnly
              precision={0.1}
            />
            <span className="text-gray-500 text-sm">
              ({packageData.packageTotalRatings})
            </span>
          </div>
        )}
      </div>

      {/* -------------------- ASK AI BUTTON -------------------- */}
      <button
        className="px-6 py-1 bg-[#EB662B] text-white"
        onClick={() => {
          setShowModal(true);
          setDefaultPrompt(`
Package details:
Name: ${packageData.packageName}
Destination(s): ${packageData.packageDestination}
Duration: ${packageData.packageDays} Days and ${packageData.packageNights} Nights
Accommodation: ${packageData.packageAccommodation}
Activities: ${packageData.packageActivities}
Meals: ${packageData.packageMeals}
Transportation: ${packageData.packageTransportation}
Price: ₹${packageData.packagePrice}
Discounted Price: ${packageData.packageDiscountPrice || "N/A"}
Offer: ${packageData.packageOffer ? "Yes" : "No"}
Description: ${packageData.packageDescription}
`);
        }}
      >
        {t("singleCardPage.askAI")}
      </button>


      {/* -------------------- AI MODAL -------------------- */}
      <AskAIModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAsk={handleAsk}
        reply={aiReply}
        loading={loading}
        defaultPrompt={defaultPrompt}
      />
    </motion.div>
  );
};

export default SingleCard;
