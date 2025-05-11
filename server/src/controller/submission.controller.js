import { prisma } from "../client/index.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllSubmission = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) throw new ApiError(403, "Unauthorized");

  const submission = await prisma.submission.findMany({
    where: {
      userId: userId,
    },
  });

  if (!submission) throw new ApiError(400, "Not found");

  res
    .status(200)
    .json(new ApiResponse(200, "Submissions fetched successfully", submission));
});
export const getAllSubmissionForProblem = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  if (!userId) throw new ApiError(403, "Unauthorized");

  const { problemId } = req.params;

  const submissions = await prisma.submission.findMany({
    where: {
      userId: userId,
      problemId: problemId,
    },
  });
  if (!submissions) throw new ApiError(400, "Not found");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Submissions for problem fetched successfully",
        submissions
      )
    );
});
export const getAllTheSubmissionsForProblem = asyncHandler(async (req, res) => {
  const { problemId } = req.params;
  if (!problemId) throw new ApiError(400, "file the parms");

  const submission = await prisma.submission.count({
    where: {
      problemId: problemId,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "All Submissions for problem count fetched successfully",
        submission
      )
    );
});
