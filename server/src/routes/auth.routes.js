import { Router } from "express";
import {
  getUser,
  login,
  logout,
  refreshAccessToken,
  register,
  verifyEmail,
} from "../controller/auth.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/verify-email/:token", verifyEmail);
authRouter.post("/login", login);
authRouter.get("/", isAuth, getUser);
authRouter.post("/logout", isAuth, logout);
authRouter.post("/refresh-token", isAuth, refreshAccessToken);
