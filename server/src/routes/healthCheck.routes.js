import { Router } from "express";
import { healthCheck } from "../controller/healthcheck.controller.js";

export const healthCheckRouter = Router();

healthCheckRouter.get("/", healthCheck);
