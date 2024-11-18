import { config } from "dotenv";
config();
import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: ["theniitettey.live", "www.theniitettey.live", "localhost"],
  methods: ["GET", "POST"],
};

const Config = {
  JWT_SECRET: process.env.JWT_SECRET! || "shit_x_wavy",
  MONGO_URI: process.env.MONGO_URI!,
  ADMIN_USERNAME: "admin",
  ADMIN_PASSWORD: "admin@123",
  PORT: process.env.PORT || 5000,
  SALT_ROUNDS: process.env.SALT_ROUNDS! || 10,
  corsOptions: corsOptions,
};

export default Config;
