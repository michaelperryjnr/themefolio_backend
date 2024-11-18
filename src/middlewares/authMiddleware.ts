import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../controllers/tokenContoller";

interface JWTPayload {
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied");
  }

  try {
    const decoded = (await verifyAccessToken(token)) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};

export default authMiddleware;
