import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware";
import { checkAdmin } from "../middlewares/isadmin.middlewares";
import { createProblem } from "../controller/problem.controller.js";

export const problemRoutes = Router();

problemRoutes.post("/create-problem", isAuth, checkAdmin, createProblem);
