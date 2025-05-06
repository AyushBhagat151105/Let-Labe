import { prisma } from "../client/index.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.lib.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
    console.log("Contoler results log:-  ", results);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      console.log("-----------Result--------------", result.status?.id);

      if (result.status?.id !== 3) {
        throw new ApiError(
          400,
          `Testcase ${i + 1} failed for language ${language}`
        );
      }
    }
  }

  console.log(req.user_id);

  const Problem = await prisma.problem.create({
    data: {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
      userId: req.user_id,
    },
  });
  if (!Problem) {
    throw new ApiError(400, "Failed To create Probem");
  }

  return res.status(201).json(
    new ApiResponse(201, "New Problem created sussesfull", {
      data: {
        Problem,
      },
    })
  );
});

export const getAllProblems = asyncHandler(async (req, res) => {});

export const getProblemsById = asyncHandler(async (req, res) => {});

export const updateProblem = asyncHandler(async (req, res) => {});

export const deleteProblem = asyncHandler(async (req, res) => {});

export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {});
