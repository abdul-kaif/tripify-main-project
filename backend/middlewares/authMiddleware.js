import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// ================================
// Require Sign In Middleware
// ================================
export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.cookies?.X_TTMS_access_token;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Token not provided!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("Auth middleware error:", error);

    return res.status(401).send({
      success: false,
      message: "Unauthorized access",
    });
  }
};

// ================================
// Admin Access Middleware
// ================================
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.user_role === 1) {
      next();
    } else {
      return res.status(403).send({
        success: false,
        message: "Unauthorized Access",
      });
    }
  } catch (error) {
    console.log("Admin middleware error:", error);

    return res.status(500).send({
      success: false,
      message: "Error in admin middleware",
    });
  }
};