import express from "express";
import { register,  sendResetEmail, resetPassword } from "../controllers/auth.js";
import validateBody from "../middlewares/validateBody.js";
import { registerSchema, resetPasswordSchema, sendResetEmailSchema } from "../schema/authSchemas.js";
import { login } from "../controllers/auth.js";
import { loginSchema } from "../schema/authSchemas.js";
import { refresh } from "../controllers/auth.js";
import{logout} from "../controllers/auth.js"
// import upload from "../middlewares/upload.js";
// import { createContactController, updateContactController } from "../controllers/contacts.js";
// import isValidId from "../middlewares/isValidId.js";
// import { updateContactSchema } from "../schema/contactSchemas.js";
// import ctrlWrapper from "../utils/ctrlWrapper.js";


const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/send-reset-email", validateBody(sendResetEmailSchema), sendResetEmail);
router.post("/reset-pwd", validateBody(resetPasswordSchema), resetPassword);
export default router;