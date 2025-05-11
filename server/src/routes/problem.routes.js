import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/isadmin.middlewares.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemsById,
  updateProblem,
} from "../controller/problem.controller.js";
import { generalLimiter } from "../utils/rateLimit.js";

export const problemRoutes = Router();

problemRoutes.post(
  "/create-problem",
  generalLimiter,
  isAuth,
  checkAdmin,
  createProblem
);

problemRoutes.get("/get-all-problems", isAuth, getAllProblems);

problemRoutes.get("/get-problem/:id", isAuth, getProblemsById);

problemRoutes.put("/update-problem/:id", isAuth, checkAdmin, updateProblem);

problemRoutes.delete("/delete-problem/:id", isAuth, checkAdmin, deleteProblem);

problemRoutes.get("/get-solved-problems", isAuth, getAllProblemsSolvedByUser);
