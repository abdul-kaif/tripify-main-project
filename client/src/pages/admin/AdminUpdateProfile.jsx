import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../services/api";

const AdminUpdateProfile = () => {
  const { t } = useTranslation();
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
    useState(true);

  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phone: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePass = (e) => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.name]: e.target.value,
    });
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();

    if (
      !avatarFile &&
      currentUser.username === formData.username &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      toast.error(t("admin.updateProfile.errors.noChange"));
      return;
    }

    try {
      dispatch(updateUserStart());

      const updatedForm = new FormData();
      updatedForm.append("username", formData.username);
      updatedForm.append("address", formData.address);
      updatedForm.append("phone", formData.phone);

      if (avatarFile) {
        updatedForm.append("avatar", avatarFile);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`,
        updatedForm
      );

      const data = res.data;
      if (data.success) {
        toast.success(data.message);
        dispatch(updateUserSuccess(data.user));
      } else {
        dispatch(updateUserFailure(data.message));
        toast.error(data.message);
      }
    } catch (error) {
      dispatch(updateUserFailure(t("admin.updateProfile.errors.somethingWrong")));
      toast.error(t("admin.updateProfile.errors.somethingWrong"));
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();

    if (
      updatePassword.oldpassword === "" ||
      updatePassword.newpassword === ""
    ) {
      toast.error(t("admin.updateProfile.errors.invalidPassword"));
      return;
    }

    if (updatePassword.oldpassword === updatePassword.newpassword) {
      toast.error(t("admin.updateProfile.errors.samePassword"));
      return;
    }

    try {
      dispatch(updatePassStart());

      const res = await apiFetch(
        `/api/user/update-password/${currentUser._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePassword),
        }
      );

      const data = await res.json();

      if (data.success === false && res.status !== 201 && res.status !== 200) {
        dispatch(updatePassFailure(data?.message));
        toast.error(t("admin.updateProfile.errors.sessionEnded"));
        return;
      }

      dispatch(updatePassSuccess());
      toast.success(t("admin.updateProfile.success.passwordUpdated"));

      setUpdatePassword({
        oldpassword: "",
        newpassword: "",
      });
    } catch (error) {
      toast.error(t("admin.updateProfile.errors.somethingWrong"));
    }
  };

  return (
    <div className="w-full h-[90vh] flex items-center bg-[#EB662B] rounded-md">
      <div className="w-[90%] bg-white md:w-[60%] mx-auto flex flex-col gap-6 rounded-md shadow-lg">
        
        {/* Heading */}
        <h1 className="text-center text-lg mt-6 font-medium md:text-3xl md:font-bold text-gray-800">
          {updateProfileDetailsPanel
            ? t("admin.updateProfile.heading.updateProfile")
            : t("admin.updateProfile.heading.changePassword")}
        </h1>

        <div className="flex flex-col gap-5 p-6">
          {/* Update Profile Panel */}
          {updateProfileDetailsPanel ? (
            <form className="w-full space-y-4">

              <div className="flex items-center gap-3">
                <label
                  htmlFor="avatarUpload"
                  className="cursor-pointer flex items-center gap-2 text-blue-600"
                >
                  <FiUpload />
                  {t("admin.updateProfile.actions.uploadAvatar")}
                </label>

                <input
                  type="file"
                  id="avatarUpload"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-full border"
                  />
                )}
              </div>

              <div>
                <label className="font-medium">
                  {t("admin.updateProfile.fields.username")}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="font-medium">
                  {t("admin.updateProfile.fields.address")}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  maxLength={200}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-medium">
                  {t("admin.updateProfile.fields.phone")}
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                />
              </div>

              <button
                disabled={loading}
                onClick={updateUserDetails}
                type="button"
                className="w-full bg-[#EB662B] text-white p-3 rounded-md hover:opacity-90"
              >
                {loading
                  ? t("General_Loading")
                  : t("admin.updateProfile.actions.update")}
              </button>

              <button
                disabled={loading}
                type="button"
                onClick={() => setUpdateProfileDetailsPanel(false)}
                className="w-full bg-red-600 text-white p-3 rounded-md hover:opacity-90"
              >
                {t("admin.updateProfile.actions.changePasswordBtn")}
              </button>
            </form>
          ) : (
            /* Update Password Panel */
            <form className="w-full space-y-4">

              <div>
                <label className="font-medium">
                  {t("admin.updateProfile.fields.oldPassword")}
                </label>
                <input
                  type="password"
                  name="oldpassword"
                  value={updatePassword.oldpassword}
                  onChange={handlePass}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="font-medium">
                  {t("admin.updateProfile.fields.newPassword")}
                </label>
                <input
                  type="password"
                  name="newpassword"
                  value={updatePassword.newpassword}
                  onChange={handlePass}
                  className="w-full mt-2 p-3 border rounded-md bg-gray-200 outline-none"
                />
              </div>

              <button
                disabled={loading}
                onClick={updateUserPassword}
                type="button"
                className="w-full bg-[#6358DC] text-white p-3 rounded-md hover:opacity-90"
              >
                {t("admin.updateProfile.actions.updatePassword")}
              </button>

              <button
                disabled={loading}
                type="button"
                onClick={() => {
                  setUpdateProfileDetailsPanel(true);
                  setUpdatePassword({
                    oldpassword: "",
                    newpassword: "",
                  });
                }}
                className="w-full bg-red-600 text-white p-3 rounded-md hover:opacity-90"
              >
                {t("admin.updateProfile.actions.back")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateProfile;
