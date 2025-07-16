import { registerUser } from "../services/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { loginUser } from "../services/auth.js";
import { refreshSession } from "../services/auth.js";
import { logoutUser } from "../services/auth.js";
import createHttpError from "http-errors";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import Session from "../models/Session.js";




export const register = ctrlWrapper(async (req, res) => {
    const userData = await registerUser(req.body);

    res.status(201).json({
        status: 201,
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
  
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
  
    res.status(200).json({
      status: 200,
      message: "Successfully logged in an user!",
      data: {
        accessToken,
        sessionId,
      },
    });
});


export const refresh = ctrlWrapper(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
  
    if (!refreshToken) {
      throw createHttpError(401, "No refresh token provided");
    }
  
    const newAccessToken = await refreshSession(refreshToken);
  
    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken: newAccessToken },
    });
});
  
export const logout = ctrlWrapper(async (req, res) => {
  const { refreshToken } = req.cookies; 

  if (!refreshToken) {
    throw createHttpError(400, "Missing refresh token");
  }

  await logoutUser(refreshToken); 
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  res.status(204).send();
});

export const sendResetEmail = ctrlWrapper(async (req, res) => {
  const { email } = req.body;

  
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  
  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset your password",
    text: `Click here to reset your password: ${resetLink}`,
    html: `<p>Click here to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  };

 
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }

  res.status(200).json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
});

export const resetPassword = ctrlWrapper(async (req, res) => {
  const { token, password } = req.body;

 
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const { email } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    status: 200,
    message: "Password has been successfully reset.",
    data: {},
  });
});