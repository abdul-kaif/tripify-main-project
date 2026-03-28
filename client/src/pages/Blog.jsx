import React from "react";
import { motion } from "framer-motion";
import blog1 from "../assets/images/b1.png";
import blog2 from "../assets/images/b2.png";
import blog3 from "../assets/images/b3.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
const Blog = () => {
  const {t} = useTranslation();
  return (
    <div className="w-full py-16 bg-gray-100">
      <div className="max-w-screen-xl mx-auto px-6">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center text-[#05073C] mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {t("Blog_Welcome")}
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog 1 */}
          <motion.div
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={blog1}
              alt="Blog Image"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-[#05073C] mb-3">
                {t("Blog_First")}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                  {t("Blog_Des1")}
              </p>
              <a href="#" className="text-[#6358DC] font-semibold">
                {t("Blog_Read_More")} →
              </a>
            </div>
          </motion.div>

          {/* Blog 2 */}
          <motion.div
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={blog2}
              alt="Blog Image"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-[#05073C] mb-3">
                {t("Blog_Second")}
                
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {t("Blog_Des2")}
              </p>
              <a href="#" className="text-[#6358DC] font-semibold">
                {t("Blog_Read_More")} →
              </a>
            </div>
          </motion.div>

          {/* Blog 3 */}
          <motion.div
            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
          >
            <img
              src={blog3}
              alt="Blog Image"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-[#05073C] mb-3">
                {t("Blog_Third")}
                
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                {t("Blog_Des3")}
              </p>
              <a href="#" className="text-[#6358DC] font-semibold">
                {t("Blog_Read_More")} →
              </a>
            </div>
          </motion.div>
        </div>

        {/* Latest Blog Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-semibold text-[#05073C] mb-4">

             {t("Blog_Head")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("Blog_Des")}
          </p>
          <Link
            to={"/search"}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            href="#"
            className="mt-6 inline-block bg-[#EB662B] text-white py-3 px-8 rounded-lg text-lg font-semibold transition duration-300 hover:opacity-90"
          >
            {t("Blog_Lets_Explore_World" )}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
