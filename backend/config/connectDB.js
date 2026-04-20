import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      family: 4
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error connecting to DB:", error.message);
    process.exit(1);
  }
};