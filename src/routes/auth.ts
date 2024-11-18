import { Request, Response, NextFunction } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { auth } from "../controllers";
import { UserModel } from "../models";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error:
      "Too many login attempts. Please try again later. Probably after 15 minutes.",
  },
}) as express.RequestHandler;

const authRouter = express.Router();

authRouter.post(
  "/login",
  loginLimiter,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = loginSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({
          error: "Invalid input",
          details: result.error.issues,
        });
        return;
      }

      const { username, password } = result.data;

      const user = await UserModel.findOne({ username });

      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const passwordMatch = await auth.verifyPassword(password, user.password);

      if (!passwordMatch) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = await auth.generateAccessToken(username);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });

      res.status(200).json({
        message: "Login successful",
        user: { username },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: errorMessage });
    }
  }
);

export default authRouter;
