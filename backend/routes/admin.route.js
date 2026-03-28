import express from "express";
import User from "../models/user.model.js";
import Package from "../models/package.model.js";
import Booking from "../models/booking.model.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const packages = await Package.countDocuments();
    const bookings = await Booking.countDocuments();

    res.status(200).send({
      success: true,
      stats: {
        users,
        packages,
        bookings
      }
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching admin stats"
    });
  }
});

export default router;