import express, { Request, Response } from "express";
import { connectToDB, Config } from "./core";
import { analyticsRouter, authRouter } from "./routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors(Config.corsOptions));
app.use("/api/auth", authRouter);
app.use("/api/analytics", analyticsRouter);

connectToDB()
  .then(() => {
    app.listen(Config.PORT, () => {
      console.log(`Server is running on port ${Config.PORT}`);
    });
  })
  .catch((error) => {
    // clean up and exit
    console.error(error);
    process.exit(1);
  });
