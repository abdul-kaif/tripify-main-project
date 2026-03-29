import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/admin-auth`,
          { withCredentials: true }
        );

        if (res.data.check) {
          setIsAdmin(true);
        }
      } catch (error) {
        setIsAdmin(false);
      }

      setLoading(false);
    };

    if (currentUser) {
      checkAdmin();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) return <Spinner />;

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}