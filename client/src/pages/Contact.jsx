import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  });

  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .send(
        "service_lxiyfos",
        "template_ahdm1vp",
        formData,
        "NEJeSDbZxdKQAhRSY"
      )
      .then(
        () => {
          setIsSent(true);
          setFormData({ user_name: "", user_email: "", message: "" });
        },
        (error) => {
          console.error("FAILED...", error);
        }
      );
  };

  return (
    <div className="bg-[#EB662B] py-16 px-4 text-white rounded-md">
      <motion.div
        className="max-w-4xl mx-auto bg-white text-gray-900 rounded-2xl shadow-xl p-8 md:p-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#EB662B]">
          {t("contact.heading")}
        </h2>

        <p className="text-center mb-8">
          {t("contact.subtext")}
        </p>

        <form onSubmit={sendEmail} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium">
              {t("contact.your_name_label")}
            </label>
            <input
              type="text"
              name="user_name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
              placeholder={t("contact.your_name_placeholder")}
              value={formData.user_name}
              onChange={(e) =>
                setFormData({ ...formData, user_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              {t("contact.your_email_label")}
            </label>
            <input
              type="email"
              name="user_email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
              placeholder={t("contact.your_email_placeholder")}
              value={formData.user_email}
              onChange={(e) =>
                setFormData({ ...formData, user_email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              {t("contact.your_message_label")}
            </label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6358DC]"
              placeholder={t("contact.your_message_placeholder")}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
          </div>

          <div className="text-center">
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              className="bg-[#EB662B] text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              {t("contact.send_button")}
            </motion.button>

            {isSent && (
              <p className="text-green-600 font-medium mt-3">
                {t("contact.success_message")}
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
