import express from "express";
import { register } from "../controllers/auth.js";
import validateBody from "../middlewares/validateBody.js";
import { registerSchema } from "../schema/authSchemas.js";
import { login } from "../controllers/auth.js";
import { loginSchema } from "../schema/authSchemas.js";
import { refresh } from "../controllers/auth.js";
import{logout} from "../controllers/auth.js"

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema),login)
router.post("/refresh", refresh);
router.post("/logout", logout)


export default router;