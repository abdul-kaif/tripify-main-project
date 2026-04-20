import { useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./pages/components/Header";
import Profile from "./pages/Profile";
import About from "./pages/About";
import PrivateRoute from "./pages/Routes/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./pages/Routes/AdminRoute";
import UpdatePackage from "./pages/admin/UpdatePackage";
import Package from "./pages/Package";
import RatingsPage from "./pages/RatingsPage";
import Booking from "./pages/user/Booking";
import Search from "./pages/Search";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./pages/components/Footer";
import Blog from "./pages/Blog";
import Success from "./pages/components/success";
import { OpenRouter } from "@openrouter/sdk"
import Contact from "./pages/Contact";
import "leaflet/dist/leaflet.css";
import { FaRobot } from "react-icons/fa";
import AskAIModal from "./pages/components/AskAIModal";
import PaymentSuccess from "./pages/PaymentSuccess";

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [aiReply, setAIReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [defaultPrompt, setDefaultPrompt] = useState("");




 const handleAsk = async (question) => {
  if (loading) return;

  setLoading(true);

  try {
    const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/ai/ask`,
  { question },
  { withCredentials: true }
);

    if (!res.data.success) {
      setAIReply("AI is currently unavailable. Please try again.");
      return;
    }

    setAIReply(res.data.response || "No answer from AI.");
  } catch (error) {
    console.error("AI ERROR:", error);
    setAIReply("Something went wrong while contacting Tripify AI!");
  } finally {
    setLoading(false);
  }
};



  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="max-w-7xl mx-auto py-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment-success" element={<Success />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/search" element={<Search />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />

            {/* user */}
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="user" element={<Profile />} />
            </Route>

            {/* admin */}
            <Route path="/profile" element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route
                path="admin/update-package/:id"
                element={<UpdatePackage />}
              />
            </Route>

            <Route path="/about" element={<About />} />
            <Route path="/package/:id" element={<Package />} />
            <Route path="/package/ratings/:id" element={<RatingsPage />} />

            {/* checking user auth before booking */}
            <Route path="/booking" element={<PrivateRoute />}>
              <Route path=":packageId" element={<Booking />} />
            </Route>
          </Routes>
        </div>
        <ToastContainer />
        <Footer />
      </BrowserRouter>

      {/* WhatsApp Floating Button */}
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919155398930?text=Hello%20I%20want%20to%20know%20more%20about%20Tripify"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-xl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="30"
          width="30"
          fill="white"
          viewBox="0 0 32 32"
        >
          <path d="M16.001 3.2c-7.068 0-12.8 5.732-12.8 12.8 0 2.26.589 4.469 1.708 6.415L3.2 28.8l6.557-1.683c1.884.995 3.999 1.517 6.244 1.517h.001c7.068 0 12.8-5.732 12.8-12.8s-5.732-12.8-12.8-12.8zm0 23.467h-.001c-1.992 0-3.933-.52-5.632-1.503l-.403-.238-3.889.998 1.036-3.786-.263-.389a11.07 11.07 0 0 1-1.742-5.825c0-6.12 4.98-11.2 11.2-11.2 2.992 0 5.807 1.165 7.93 3.289a11.14 11.14 0 0 1 3.291 7.912c0 6.12-4.98 11.2-11.2 11.2zm6.195-8.365c-.337-.168-2.001-.988-2.313-1.101-.313-.112-.54-.168-.767.168-.225.337-.881 1.101-1.081 1.328-.2.225-.4.25-.737.083-.337-.168-1.422-.524-2.707-1.671-1-.893-1.675-1.997-1.873-2.334-.2-.337-.021-.52.147-.687.152-.151.337-.4.505-.603.168-.2.225-.337.337-.562.112-.225.056-.42-.028-.588-.084-.168-.767-1.852-1.051-2.53-.276-.662-.556-.573-.767-.584-.2-.012-.431-.012-.662-.012-.231 0-.606.084-.925.42-.318.337-1.213 1.186-1.213 2.893 0 1.707 1.243 3.354 1.415 3.583.168.225 2.45 3.741 5.937 5.243.831.358 1.48.571 1.985.732.833.266 1.59.228 2.188.139.667-.1 2.001-.817 2.287-1.606.28-.79.28-1.469.196-1.606-.084-.139-.308-.225-.645-.393z" />
        </svg>
      </a>


      {/* AI Floating Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl animate-bounce"
      >
        <FaRobot size={24} />
      </button>

      {/* AI Modal */}
      <AskAIModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAsk={handleAsk}
        reply={aiReply}
        loading={loading}
      />
    </>
  );
};

export default App;
