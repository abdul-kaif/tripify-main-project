import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import packageRoute from "./routes/package.route.js";
import ratingRoute from "./routes/rating.route.js";
import bookingRoute from "./routes/booking.route.js";
import paymentRoutes from "./routes/payment.routes.js";
import { connectDB } from "./config/connectDB.js";
import askAiRoutes from "./routes/askAi.route.js";
import adminRoutes from "./routes/admin.route.js";

// ---- FIXED DIRNAME SETUP ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- LOAD ENV (CORRECT WAY) ----
dotenv.config();


const app = express();

connectDB();
console.log("SERVER_URL:", process.env.SERVER_URL);



app.use(
  cors({
    origin: ["http://localhost:5173", "https://tripify-main.onrender.com"],
    credentials: true,
  })
);


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static("uploads"));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);
app.use("/payment", paymentRoutes);
app.use("/api/ai/ask",askAiRoutes);
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV_CUSTOM === "production") {
  const clientPath = path.join(__dirname, "../client/dist");

  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Welcome to travel and tourism app");
  });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
