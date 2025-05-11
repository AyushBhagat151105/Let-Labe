import { prisma } from "../client/index.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateSchema } from "../utils/validateSchema.js";
import { createPlaylistSchema } from "../validation/zodValidation.js";

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const result = validateSchema(createPlaylistSchema, req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Validation Error:- ", result));
  }

  const userId = req.user_id;

  //   console.log(userId);

  const playlist = await prisma.playlist.create({
    data: {
      name,
      description,
      userId,
    },
  });

  if (!playlist) throw new ApiError(400, "Filde");

  return res.status(201).json(new ApiResponse(201, "Created"));
});
export const getAllListDetails = asyncHandler(async (req, res) => {
  const playlist = await prisma.playlist.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) throw new ApiError(404, "Not Found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist finded", playlist));
});
export const getPlayListDetails = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await prisma.playlist.findUnique({
    where: {
      userId: req.user.id,
      id: playlistId,
    },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
    },
  });

  if (!playlist) throw new ApiError(404, "Not Found");

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist finded", playlist));
});
export const addProblemToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Give all fildes properly");
  }

  const problemsInPlaylist = await prisma.problemInPlaylist.createMany({
    data: problemIds.map((problemId) => ({
      playlistId,
      problemId,
    })),
  });

  if (!problemsInPlaylist) throw new ApiError(400, "Filde");

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Problems added to playlist", problemsInPlaylist)
    );
});
export const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const deleted = await prisma.playlist.delete({
    where: {
      id: playlistId,
      userId: req.user_id,
    },
  });

  return res
    .status(204)
    .json(new ApiResponse(204, "Playlist deleted", deleted));
});
export const removeProblemFormPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;

  if (!Array.isArray(problemIds) || problemIds.length === 0) {
    throw new ApiError(400, "Give all fildes properly");
  }

  const deletedProblem = await prisma.problemInPlaylist.deleteMany({
    where: {
      playlistId,
      problemId: {
        in: problemIds,
      },
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Problems deleted to playlist", deletedProblem));
});
