import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import Session from "../models/Session.js"; // імпортуй свою модель сесії

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createHttpError(401, "No access token provided");
    }

    const token = authHeader.split(" ")[1];
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createHttpError(401, "Access token expired");
      }
      throw createHttpError(401, "Invalid access token");
    }

    // ✅ Додаємо перевірку сесії
    const session = await Session.findOne({
      userId: payload.userId,
      accessToken: token,
    });

    if (!session) {
      
      throw createHttpError(401, "Session not found or already logged out");
    }

    req.user = { _id: payload.userId };
    next();
  } catch (error) {
    next(error);
  }
};
