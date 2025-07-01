import { registerUser } from "../services/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { loginUser } from "../services/auth.js";
import { refreshSession } from "../services/auth.js";
import { logoutUser } from "../services/auth.js";
import createHttpError from "http-errors";


export const register = ctrlWrapper(async (req, res) => {
    const userData = await registerUser(req.body);

    res.status(201).json({
        status: "success",
        message: "Successfully registered a user!",
        data: userData,
    });
});

export const login = ctrlWrapper(async (req, res) => {
    const { accessToken, refreshToken, sessionId } = await loginUser(req.body);
  
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, 
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, 
    });
  
    res.status(200).json({
      status: "success",
      message: "Successfully logged in an user!",
      data: {
        accessToken,
        sessionId,
      },
    });
});
  


export const loginController = async (req, res) => {
  
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await loginUser({ email, password });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      status: "success",
      message: "Successfully logged in an user!",
      data: { accessToken },
    });
  
};

export const refresh = ctrlWrapper(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      throw createHttpError(401, "No refresh token provided");
    }
  
    const newAccessToken = await refreshSession(refreshToken);
  
    res.status(200).json({
      status: "success",
      message: "Successfully refreshed a session!",
      data: { accessToken: newAccessToken },
    });
});
  
export const logout = ctrlWrapper(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const sessionId = req.body.sessionId;
  
    if (!refreshToken || !sessionId) {
      throw createHttpError(400, "Missing refresh token or session ID");
    }
  
    await logoutUser(sessionId, refreshToken);
  
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  
    res.status(204).end(); 
  });