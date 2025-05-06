import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.lib.js";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Prisma } from "@prisma/client";

export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "You are not allowed to create problems");
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        throw new ApiError(400, `Language ${language} is not supported`);
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults(tokens);
    }
  } catch (error) {
    console.log("create problems error:- ", error);
    throw new ApiError(400, "Error in Createing Problem", error);
  }
});

export const getAllProblems = asyncHandler(async (req, res) => {});

export const getProblemsById = asyncHandler(async (req, res) => {});

export const updateProblem = asyncHandler(async (req, res) => {});

export const deleteProblem = asyncHandler(async (req, res) => {});

export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {});
