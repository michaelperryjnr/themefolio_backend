import jwt from "jsonwebtoken";
import { Config } from "../core";

async function generateAccessToken(username: string) {
  return await jwt.sign({ username }, Config.JWT_SECRET, {
    expiresIn: "1h",
  });
}

async function verifyAccessToken(token: string) {
  return await jwt.verify(token, Config.JWT_SECRET);
}

export { generateAccessToken, verifyAccessToken };
