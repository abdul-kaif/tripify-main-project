import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

// ============================
// Test Controller
// ============================
export const test = (req, res) => {
  return res.send("Hello From Test!");
};

// ============================
// Signup Controller
// ============================
export const signupController = async (req, res) => {
  try {
    const { username, email, password, address, phone } = req.body;

    if (!username || !email || !password || !address || !phone) {
      return res.status(400).send({
        success: false,
        message: "All fields are required!",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).send({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
      phone,
    });

    await newUser.save();

    return res.status(201).send({
      success: true,
      message: "User created successfully",
    });

  } catch (error) {
    console.log("Signup error:", error);

    return res.status(500).send({
      success: false,
      message: "Server error during signup",
    });
  }
};

// ============================
// Login Controller
// ============================
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    }

    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "4d" }
    );

    const { password: pass, ...rest } = validUser._doc;

    // Production check
    const isProd = process.env.NODE_ENV_CUSTOM === "production";

    res.cookie("X_TTMS_access_token", token, {
      httpOnly: true,
      secure: true,          // required for HTTPS (Render)
      sameSite: "none",      // required for cross-origin cookies
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).send({
      success: true,
      message: "Login successful",
      user: rest,
    });

  } catch (error) {
    console.log("Login error:", error);

    return res.status(500).send({
      success: false,
      message: "Server error during login",
    });
  }
};

// ============================
// Logout Controller
// ============================
export const logOutController = (req, res) => {
  try {
    res.clearCookie("X_TTMS_access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).send({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.log("Logout error:", error);

    return res.status(500).send({
      success: false,
      message: "Logout failed",
    });
  }
};