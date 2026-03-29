import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(null);

  const authCheck = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/admin-auth`,
        {
          withCredentials: true,
        }
      );

      if (res.data.check) {
        setOk(true);
      } else {
        setOk(false);
      }
    } catch (error) {
      setOk(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      authCheck();
    } else {
      setOk(false);
    }
  }, [currentUser]);

  if (ok === null) {
    return <Spinner />;
  }

  return ok ? <Outlet /> : <Navigate to="/login" />;
}