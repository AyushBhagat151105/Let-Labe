import { pollBatchResults, submitBatch } from "../lib/judge0.lib.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const executeCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  const userId = req.user_id;

  // Validate test cases

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    return ApiError(400, "Invalid or Missing test cases");
  }

  // Prepare each test cases for judge0 batch

  const submissions = stdin.map((input) => ({
    source_code,
    language_id,
    stdin: input,
  }));

  // snec batch of submissions to judge0

  const submitResponse = await submitBatch(submissions);

  const tokens = submitResponse.map((res) => res.token);

  const results = await pollBatchResults(tokens);

  if (!results) throw new ApiError(401, "Sever Problem or wrong code", results);

  return res
    .status(200)
    .json(new ApiResponse(200, "Problem sumbited", results));
});
