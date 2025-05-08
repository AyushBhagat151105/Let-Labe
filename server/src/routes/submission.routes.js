import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import { checkAdmin } from "../middlewares/isadmin.middlewares.js";
import {
  getAllSubmission,
  getAllSubmissionForProblem,
  getAllTheSubmissionsForProblem,
} from "../controller/submission.controller.js";

export const submissionRoutes = Router();

submissionRoutes.get("/get-all-submission", isAuth, getAllSubmission);
submissionRoutes.get(
  "/get-all-submission/:problemId",
  isAuth,
  getAllSubmissionForProblem
);

submissionRoutes.get(
  "/get-submissions-count/:problemId",
  isAuth,
  getAllTheSubmissionsForProblem
);
