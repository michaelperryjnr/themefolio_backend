import { generateAccessToken, verifyAccessToken } from "./tokenContoller";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { hash } from "crypto";

const auth = {
  generateAccessToken,
  async verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send("Access denied");
    }

    try {
      const decoded = verifyAccessToken(token);
      req.body = decoded;
      next();
    } catch (error) {
      res.status(401).send("Invalid token");
    }
  },
  async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  },
};

export default auth;
