import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/images/login.png";
import { toast } from "react-toastify";
import { apiFetch } from "../services/api";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Weak");
    } else if (
      password.length >= 6 &&
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)
    ) {
      setPasswordStrength("Medium");
    } else if (
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
        password
      )
    ) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== 10) {
      toast.error(t("signup.phone_length_error"));
      return;
    }

    try {
      const res = await apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data?.success) {
        toast.success(data?.message);
        navigate("/login");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }

  };

  return (
    <div className="w-full mx-auto h-screen flex justify-center items-center bg-[#FFF1DA]">
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FFF1DA]">
        <div className="w-[90%] bg-white md:w-[60%] mx-auto flex flex-col rounded-md gap-6">

          {/* Heading */}
          <h1 className="text-center text-lg mt-6 font-medium md:text-3xl md:font-bold text-gray-800">
            {t("signup.heading")} <span className="text-[#FF7D68]">Tripify</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-5 h-auto md:h-[600px] rounded-md items-center justify-center p-4">
            <div className="w-full md:w-1/2 flex justify-center">
              <img src={loginImage} alt="Login" className="max-h-[300px]" />
            </div>

            <form onSubmit={handleSubmit} className="w-full md:w-1/2 px-4">
              <div>
                <label>{t("signup.username_label")}</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                  placeholder={t("signup.username_placeholder")}
                />
              </div>

              <div>
                <label>{t("signup.email_label")}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                  placeholder={t("signup.email_placeholder")}
                />
              </div>

              <div className="mt-4">
                <label>{t("signup.password_label")}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                  placeholder={t("signup.password_placeholder")}
                />

                {passwordStrength && (
                  <p
                    className={`mt-2 text-sm ${passwordStrength === "Weak"
                        ? "text-red-500"
                        : passwordStrength === "Medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                  >
                    {t(`signup.password_${passwordStrength.toLowerCase()}`)}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <label>{t("signup.address_label")}</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                  placeholder={t("signup.address_placeholder")}
                />
              </div>

              <div className="mt-4">
                <label>{t("signup.phone_label")}</label>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                  placeholder={t("signup.phone_placeholder")}
                />
              </div>

              <button className="w-full bg-[#EB662B] text-white p-3 mt-4 rounded-md">
                {t("signup.signup_button")}
              </button>

              <p className="my-4 text-center">
                {t("signup.already_have_account")}{" "}
                <span className="text-[#EB662B]">
                  <Link to="/login">{t("signup.login_link")}</Link>
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
