import { registerUser } from "../services/auth.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { loginUser } from "../services/auth.js";
import { refreshSession } from "../services/auth.js";
import { logoutUser } from "../services/auth.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendResetPasswordEmail } from "../services/emailService.js";
import Session from '../models/Session.js';
import bcrypt from 'bcrypt';
import Contact from "../models/contact.js";

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
    data: { accessToken, sessionId },
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
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(204).end();
});

export const sendResetEmail = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found!");
  }
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
  await sendResetPasswordEmail(email, token);
  res.status(200).json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
});

export const resetPassword = ctrlWrapper(async (req, res) => {
  const { token, password } = req.body;
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, "Token is expired or invalid.");
  }
  const user = await User.findOne({ email: payload.email });
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

export const createContact = ctrlWrapper(async (req, res) => {
  const { name, email, phone } = req.body;
  const photo = req.file?.path || null;
  const newContact = await Contact.create({ name, email, phone, photo });
  res.status(201).json({ status: 201, data: newContact });
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const photo = req.file?.path;
  const updateData = { name, email, phone };
  if (photo) updateData.photo = photo;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
  if (!updatedContact) {
    throw createHttpError(404, "Contact not found");
  }
  res.json({ status: 200, data: updatedContact });
});