import User from "../models/User.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import Session from "../models/Session.js";
import jwt from "jsonwebtoken";


export const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw createHttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    })

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  

};

export const loginUser = async ({ email, password }) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
    const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";
  

  
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, "Invalid email or password");
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createHttpError(401, "Invalid email or password");
    }
  
    await Session.findOneAndDelete({ userId: user._id });
  
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
  
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
    const newSession = await Session.create({
  userId: user._id,
  accessToken,
  refreshToken,
  accessTokenValidUntil,
  refreshTokenValidUntil,
});

return {
  accessToken,
  refreshToken,
  sessionId: newSession._id.toString(),
};
};
  
export const refreshSession = async (oldRefreshToken) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
    const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";

    const existingSession = await Session.findOne({ refreshToken: oldRefreshToken });
    if (!existingSession) {
      throw createHttpError(403, "Invalid refresh token");
    }
  
    
    let payload;
    try {
      payload = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw createHttpError(403, "Refresh token expired or invalid");
    }
  
    const userId = payload.userId;
  
  
    await Session.findOneAndDelete({ refreshToken: oldRefreshToken });
  
    
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
  
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
  
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
    await Session.create({
      userId,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });
  
    return accessToken;
};
  
export const logoutUser = async (sessionId, refreshToken) => {
  await Session.findOneAndDelete({ _id: sessionId, refreshToken });
}