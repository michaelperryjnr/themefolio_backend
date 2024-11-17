import { config } from "dotenv";
config();
import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: ["theniitettey.live"],
  methods: ["GET", "POST"],
};

const Config = {
  JWT_SECRET: process.env.JWT_SECRET! || "shit_x_wavy",
  MONGO_URI: process.env.MONGO_URI!,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME! || "admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin@123",
  PORT: process.env.PORT || 5000,
  corsOptions: corsOptions,
};

export default Config;
