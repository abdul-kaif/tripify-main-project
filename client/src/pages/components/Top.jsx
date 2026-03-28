import t1 from "../../assets/images/t1.jpg";
import t2 from "../../assets/images/t2.jpg";
import t3 from "../../assets/images/t3.jpg";
import t4 from "../../assets/images/t4.jpg";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Top = () => {
  const { t } = useTranslation();

  const topSellings = [
    {
      id: 1,
      image: t1,
      destination: t("topDestinationsPage.destinations.mumbai"),
      price: "₹1k",
      duration: t("topDestinationsPage.duration.10days"),
    },
    {
      id: 2,
      image: t2,
      destination: t("topDestinationsPage.destinations.lakshadweep"),
      price: "₹2k",
      duration: t("topDestinationsPage.duration.5days"),
    },
    {
      id: 3,
      image: t3,
      destination: t("topDestinationsPage.destinations.shimla"),
      price: "₹3k",
      duration: t("topDestinationsPage.duration.13days"),
    },
    {
      id: 4,
      image: t4,
      destination: t("topDestinationsPage.destinations.hyderabad"),
      price: "₹2.5k",
      duration: t("topDestinationsPage.duration.13days"),
    },
  ];

  return (
    <div className="w-full mx-auto my-12">
      <h1 className="text-center text-gray-700 text-2xl font-semibold">
        {t("topDestinationsPage.topSelling")}
      </h1>

      <h1 className="my-2 text-center text-gray-900 text-4xl font-bold">
        {t("topDestinationsPage.topDestinations")}
      </h1>

      <div className="my-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center justify-center">
        {topSellings.map((item, index) => (
          <motion.div
            key={item.id}
            className="mx-auto flex flex-col items-center justify-center rounded-lg cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: index * 0.2,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
          >
            <div className="w-full h-[350px] overflow-hidden rounded-lg">
              <motion.img
                src={item.image}
                className="w-full h-full object-cover"
                alt={item.destination}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="flex items-center justify-around w-full mt-3">
              <h4 className="text-lg font-semibold text-gray-800">
                {item.destination}
              </h4>

              <p className="text-lg font-bold text-primary">
                {item.price}
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-3">{item.duration}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Top;
