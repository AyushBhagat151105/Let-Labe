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

export const playListRoutes = Router();

playListRoutes.get("/", isAuth, getAllListDetails);

playListRoutes.get("/:playlistId", isAuth, getPlayListDetails);

playListRoutes.post("/create-playlist", isAuth, createPlaylist);

playListRoutes.post("/:playlistId/add-problem", isAuth, addProblemToPlaylist);

playListRoutes.delete("/:playlistId/delete", isAuth, deletePlaylist);

playListRoutes.delete(
  "/:platlistId/remove-problem",
  isAuth,
  removeProblemFormPlaylist
);
