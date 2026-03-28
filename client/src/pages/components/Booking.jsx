import destination from "../../assets/images/destination.png";
import payment from "../../assets/images/payment.png";
import vehicle from "../../assets/images/vehicle.png";
import booking_right from "../../assets/images/booking_right.jpg";
import { motion } from "framer-motion";
import logo1 from "../../assets/images/logo1.png";
import logo2 from "../../assets/images/logo2.png";
import logo3 from "../../assets/images/logo3.png";
import logo4 from "../../assets/images/logo4.png";
import logo5 from "../../assets/images/logo5.png";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Booking = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const steps = [
    {
      id: 1,
      image: destination,
      title: t("bookingSectionPage.steps.chooseDestination"),
      description: t("bookingSectionPage.steps.chooseDestinationDesc"),
    },
    {
      id: 2,
      image: payment,
      title: t("bookingSectionPage.steps.makePayment"),
      description: t("bookingSectionPage.steps.makePaymentDesc"),
    },
    {
      id: 3,
      image: vehicle,
      title: t("bookingSectionPage.steps.reachAirport"),
      description: t("bookingSectionPage.steps.reachAirportDesc"),
    },
  ];

  return (
    <div className="my-16">

      {/* Animated Heading */}
      <motion.h4
        className="text-[#DF6951] text-center md:text-start text-lg font-semibold md:text-xl md:font-bold"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        {t("bookingSectionPage.easyFast")}
      </motion.h4>

      <motion.h1
        className="text-[#181E4B] text-center md:text-start text-5xl font-bold my-4 capitalize"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        {t("bookingSectionPage.mainHeading.line1")} <br />{" "}
        {t("bookingSectionPage.mainHeading.line2")}
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-10 items-center">
        
        {/* Left Steps Section */}
        <div className="w-full md:w-1/2 px-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex gap-8 my-2 py-3"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
                ease: "easeOut",
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={step.image} alt="" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[#5E6282] text-lg font-semibold md:text-xl md:font-bold">
                  {step.title}
                </h2>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Image Card */}
        <motion.div
          className="w-full md:w-1/2 px-2"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1.1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-[370px] w-full mx-auto h-[300px] bg-white rounded-md flex flex-col items-center px-3 ">

            <motion.img
              src={booking_right}
              className="transition-transform hover:scale-105 duration-300 ease-in-out"
              alt=""
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            />

            <h1 className="text-gray-800 my-4 text-lg font-semibold md:text-xl md:font-bold">
              {t("bookingSectionPage.rightCard.tripTitle")}
            </h1>

            <div className="flex items-center justify-around gap-3 text-sm text-gray-600">
              <p>{t("bookingSectionPage.rightCard.date")}</p> |
              <p>{t("bookingSectionPage.rightCard.tripName")}</p>
            </div>

            <div className="flex items-center justify-around gap-5 my-3 text-sm text-gray-700 font-medium">
              <p>{t("bookingSectionPage.rightCard.peopleGoing")}</p>
              <p>{t("bookingSectionPage.rightCard.price")}</p>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Logo section */}
      <div className="flex flex-wrap items-center justify-center gap-5 my-10">
        {[logo1, logo2, logo3, logo4, logo5].map((logo, index) =>
          isMobile ? (
            <img key={index} src={logo} alt="" />
          ) : (
            <motion.img
              key={index}
              src={logo}
              alt=""
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.4,
                delay: index * 0.15,
                ease: "easeOut",
              }}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Booking;
