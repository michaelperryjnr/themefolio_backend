import mongoose from "mongoose";
import Config from "./config";

async function connectToDB() {
  try {
    return mongoose
      .connect(Config.MONGO_URI)
      .then(() => console.log("Connected to DB Successfully"));
  } catch (error: any) {
    console.error("MongoDB Connection Error", error.message);
    process.exit(1);
  }
}

export default connectToDB;
