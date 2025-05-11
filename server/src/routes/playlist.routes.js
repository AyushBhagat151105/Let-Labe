import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllListDetails,
  getPlayListDetails,
  removeProblemFormPlaylist,
} from "../controller/playlist.controller.js";
import { generalLimiter } from "../utils/rateLimit.js";

export const playListRoutes = Router();

playListRoutes.get("/", isAuth, getAllListDetails);

playListRoutes.get("/:playlistId", isAuth, getPlayListDetails);

playListRoutes.post("/create-playlist", isAuth, generalLimiter, createPlaylist);

playListRoutes.post(
  "/:playlistId/add-problem",
  isAuth,
  generalLimiter,
  addProblemToPlaylist
);

playListRoutes.delete("/:playlistId/delete", isAuth, deletePlaylist);

playListRoutes.delete(
  "/:platlistId/remove-problem",
  isAuth,
  removeProblemFormPlaylist
);
