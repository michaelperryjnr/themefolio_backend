import { Router, Request, Response } from "express";
import { Config as config } from "../core";
import { auth } from "../controllers";

const authRouter = Router();

authRouter.post("/api/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (
    username === config.ADMIN_USERNAME &&
    password === config.ADMIN_PASSWORD
  ) {
    const token = auth.generateAccessToken(username);
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

export default authRouter;
