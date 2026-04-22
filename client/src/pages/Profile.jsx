import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../redux/user/userSlice";

import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../services/api";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const [activePanelId, setActivePanelId] = useState(1);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await apiFetch("/api/auth/logout");
      const data = await res.json();

      if (!data?.success) {
        dispatch(logOutFailure(data?.message));
        return;
      }

      dispatch(logOutSuccess());
      navigate("/login");
      toast.success(data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(t("profile.confirm_delete"));

    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const res = await apiFetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!data?.success) {
          dispatch(deleteUserAccountFailure(data?.message));
          toast.error(t("profile.error_general"));
          return;
        }

        dispatch(deleteUserAccountSuccess());
        toast.success(data?.message);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex w-full flex-wrap max-sm:flex-col p-2">
      {currentUser ? (
        <>
          {/* LEFT SIDE */}
          <div className="w-[25%] p-3 max-sm:w-full">
            <div className="flex flex-col items-center gap-4 p-3 rounded-lg shadow-lg">
              
              <div className="w-full flex flex-col items-center relative">
               <img
  // src={
  //   currentUser?.avatar && currentUser.avatar !== ""
  //     ? currentUser.avatar
  //     : "/default-avatar.png"
  // }
  // alt={t("profile.profile_photo")}
  // className="w-36 h-36 rounded-full object-cover"
  // onError={(e) => {
  //   e.target.src = "/default-avatar.png";
  // }}
/>
              </div>

              <p>
                <span className="font-semibold bg-white">
                  {t("profile.logged_in_info")}
                </span>
              </p>

              <div className="w-full flex justify-between px-1">
                <button
                  onClick={() => setActivePanelId(3)}
                  className="px-8 bg-[#6358DC] text-white text-lg font-semibold flex items-center justify-center my-3 border p-1 rounded-lg"
                >
                  {t("profile.edit_profile")}
                </button>
              </div>

              <div className="w-full flex flex-col gap-3 shadow-2xl rounded-lg p-3 break-all">
                <p>{t("profile.name")}</p>
                <p className="text-base font-semibold py-2 border px-3">
                  {currentUser.username}
                </p>

                <p>{t("profile.email")}</p>
                <p className="text-base font-semibold py-2 border px-3">
                  {currentUser.email}
                </p>

                <p>{t("profile.phone")}</p>
                <p className="text-base font-semibold py-2 border px-3">
                  {currentUser.phone}
                </p>

                <p>{t("profile.address")}</p>
                <p className="text-base font-semibold py-2 border px-3">
                  {currentUser.address}
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleLogout}
                    className="px-4 bg-[#6358DC] text-white text-sm font-semibold my-3 border p-1 rounded-lg"
                  >
                    {t("profile.logout")}
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 bg-orange-600 text-white text-sm font-semibold my-3 border p-1 rounded-lg"
                  >
                    {t("profile.delete_account")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-[75%] max-sm:w-full">
            <nav className="w-full border-b-4 border-blue-500 py-2">
              <div className="w-full flex gap-2">
                <button
                  className={
                    activePanelId === 1
                      ? "p-1 rounded-t bg-[#6358DC] text-white"
                      : "p-1 rounded-t"
                  }
                  onClick={() => setActivePanelId(1)}
                >
                  {t("profile.bookings")}
                </button>

                <button
                  className={
                    activePanelId === 2
                      ? "p-1 rounded-t bg-[#6358DC] text-white"
                      : "p-1 rounded-t"
                  }
                  onClick={() => setActivePanelId(2)}
                >
                  {t("profile.history")}
                </button>
              </div>
            </nav>

            <div className="main flex flex-wrap">
              {activePanelId === 1 && <MyBookings />}
              {activePanelId === 2 && <MyHistory />}
              {activePanelId === 3 && <UpdateProfile />}
            </div>
          </div>
        </>
      ) : (
        <div>
          <p className="text-red-700">{t("profile.login_first")}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
