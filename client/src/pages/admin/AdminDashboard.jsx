import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../../redux/user/userSlice";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import "./styles/DashboardStyle.css";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { apiFetch } from "../../services/api";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  const [activePanelId, setActivePanelId] = useState(1);

  const [stats, setStats] = useState({
    users: 0,
    packages: 0,
    bookings: 0,
  });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: null,
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

  /* ADMIN STATS */
  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await apiFetch("/api/admin/stats");
        const data = await res.json();
        if (data?.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getStats();
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await apiFetch("/api/auth/logout");
      const data = await res.json();
      if (data?.success !== true) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      toast.success(t("admin.dashboard.messages.logoutSuccess"));
    } catch (error) {}
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(t("admin.dashboard.messages.confirmDelete"));
    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const res = await apiFetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data?.success === false) {
          dispatch(deleteUserAccountFailure(data?.message));
          toast.error(t("admin.dashboard.errors.general"));
          return;
        }
        dispatch(deleteUserAccountSuccess());
        toast.success(t("admin.dashboard.messages.deleteSuccess"));
      } catch (error) {}
    }
  };

  return (
    <div className="flex w-full flex-wrap max-sm:flex-col gap-16 p-2">
      {currentUser ? (
        <>
          {/* LEFT SIDEBAR */}
          <div className="w-[25%] p-3 max-sm:w-full">
            <div className="flex flex-col items-center gap-4 p-3 rounded-lg shadow-lg">
              <div className="w-full flex flex-col items-center relative">
               {/* <img
  src={formData?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
  alt="profile"
  className="w-36 h-36 object-cover rounded-full border border-gray-300"
  onError={(e) => {
    e.target.src = "https://randomuser.me/api/portraits/men/32.jpg";
  }}
/> */}
              </div>

              <p className="w-full text-center border-b">
                <span className="font-semibold">Logged in user information</span>
              </p>

              <div className="w-full flex justify-between px-1">
                <button
                  onClick={() => setActivePanelId(8)}
                  className="px-8 bg-[#EB662B] text-white font-semibold rounded-lg p-1"
                >
                  Edit Profile
                </button>
              </div>

              <div className="w-full flex flex-col gap-3 shadow-2xl rounded-lg p-3 break-all">
                <p>Name</p>
                <p className="border p-2">{currentUser.username}</p>

                <p>Email</p>
                <p className="border p-2">{currentUser.email}</p>

                <p>Phone</p>
                <p className="border p-2">{currentUser.phone}</p>

                <p>Address</p>
                <p className="border p-2">{currentUser.address}</p>

                <div className="flex justify-between">
                  <button
                    onClick={handleLogout}
                    className="px-4 bg-[#6358DC] text-white rounded-lg p-1"
                  >
                    Logout
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 bg-[#EB662B] text-white rounded-lg p-1"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-[65%] max-sm:w-full">
            <div className="main-div">

              {/* ADMIN STATS */}
              <div className="flex gap-4 mb-6">
                <div className="bg-white shadow p-4 rounded">
                  <h3>Total Users</h3>
                  <h1>{stats.users}</h1>
                </div>

                <div className="bg-white shadow p-4 rounded">
                  <h3>Total Packages</h3>
                  <h1>{stats.packages}</h1>
                </div>

                <div className="bg-white shadow p-4 rounded">
                  <h3>Total Bookings</h3>
                  <h1>{stats.bookings}</h1>
                </div>
              </div>

              {/* NAVBAR */}
              <nav className="w-full border-b-4 border-[#EB662B] py-3 overflow-x-auto navbar">
                <div className="flex gap-2">
                  <button onClick={() => setActivePanelId(1)}>Bookings</button>
                  <button onClick={() => setActivePanelId(2)}>Add Packages</button>
                  <button onClick={() => setActivePanelId(3)}>All Packages</button>
                  <button onClick={() => setActivePanelId(4)}>Users</button>
                  <button onClick={() => setActivePanelId(5)}>Payments</button>
                  <button onClick={() => setActivePanelId(6)}>Ratings</button>
                  <button onClick={() => setActivePanelId(7)}>History</button>
                </div>
              </nav>

              <div className="content-div flex flex-wrap my-5">
                {activePanelId === 1 ? (
                  <AllBookings />
                ) : activePanelId === 2 ? (
                  <AddPackages />
                ) : activePanelId === 3 ? (
                  <AllPackages />
                ) : activePanelId === 4 ? (
                  <AllUsers />
                ) : activePanelId === 5 ? (
                  <Payments />
                ) : activePanelId === 6 ? (
                  <RatingsReviews />
                ) : activePanelId === 7 ? (
                  <History />
                ) : activePanelId === 8 ? (
                  <AdminUpdateProfile />
                ) : (
                  <div>Page Not Found</div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-red-700">Please login first</p>
      )}
    </div>
  );
};

export default AdminDashboard;