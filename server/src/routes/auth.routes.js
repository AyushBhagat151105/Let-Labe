import { Router } from "express";
import {
  check,
  getUser,
  login,
  logout,
  refreshAccessToken,
  register,
  resetPassword,
  verifyEmail,
} from "../controller/auth.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../utils/rateLimit.js";

export const authRouter = Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/verify-email/:token", verifyEmail);
authRouter.post("/login", authLimiter, login);
authRouter.get("/", isAuth, getUser);
authRouter.post("/logout", isAuth, logout);
authRouter.post("/refresh-token", isAuth, refreshAccessToken);
authRouter.get("/check", isAuth, check);
authRouter.patch("/reset-password", isAuth, resetPassword);
