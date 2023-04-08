import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnection = async () => {
  const uri = process.env.CLUSTER;
  try {
    await mongoose.connect(uri!, {});

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};
