import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/isadmin.middlewares.js";
import { executeCode } from "../controller/execute.controller.js";
import { generalLimiter } from "../utils/rateLimit.js";

export const executeRoutes = Router();

executeRoutes.post("/", isAuth, generalLimiter,executeCode);
