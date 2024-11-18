import express, { Request, Response } from "express";
import { connectToDB, Config } from "./core";
import { analyticsRouter, authRouter } from "./routes";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors(Config.corsOptions));
app.use("/auth", authRouter);
app.use("/analytics", analyticsRouter);

app.get("/dashboard", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../src/public", "dashboard.html"));
});

app.get("/status", (req: Request, res: Response) => {
  const statuses = ["Operational", "Degraded", "Maintenance", "Offline"];

  const randomIndex = Math.floor(Math.random() * statuses.length);

  res.json({ status: statuses[randomIndex] });
});

app.get("/script.js", (req: Request, res: Response) => {
  res.type("application/javascript");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.sendFile(path.resolve(__dirname, "public", "analytics-client.js"));
});

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
