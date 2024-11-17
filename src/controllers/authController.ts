import { generateAccessToken, verifyAccessToken } from "./tokenContoller";
import { Request, Response, NextFunction } from "express";

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
};

export default auth;
