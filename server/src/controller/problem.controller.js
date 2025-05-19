import { prisma } from "../client/index.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.lib.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateSchema } from "../utils/validateSchema.js";
import { createProblemSchema } from "../validation/zodValidation.js";

const checkRefrenceSolution = async (referenceSolution, testcases) => {
  for (const [language, solutionCode] of Object.entries(referenceSolution)) {
    const languageId = getJudge0LanguageId(language);

    if (!languageId)
      throw new ApiError(400, `${language} Language is not supported`);

    const submissions = testcases.map(({ input, output }) => {
      return {
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      };
    });

    console.log(submissions);

    const submissionResults = await submitBatch(submissions);

    console.log(submissionResults);

    const tokens = submissionResults.map((res) => res.token);

    console.log(tokens);

    const results = await pollBatchResults(tokens);

    console.log(results);

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      if (result.status.id !== 3) {
        throw new ApiError(
          400,
          `Testcase ${i + 1} failed for language ${language}`
        );
      }
    }
  }
};

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
    hints,
    editorial,
    referenceSolutions,
  } = req.body;

  const result = validateSchema(createProblemSchema, req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Validation Error:- ", result));
  }

  const alreadyhave = await prisma.problem.findFirst({
    where: {
      title: title,
    },
  });

  if (alreadyhave) {
    return res.status(400).json(new ApiResponse(400, "Problem already thaer"));
  }

  await checkRefrenceSolution(referenceSolutions, testcases);

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
      hints,
      editorial,
      referenceSolutions,
      userId: req.user.id,
    },
  });
  if (!Problem) {
    throw new ApiError(400, "Failed To create Probem");
  }

  return res.status(201).json(
    new ApiResponse(201, "New Problem created sussesfull", {
      Problem,
    })
  );
});

export const getAllProblems = asyncHandler(async (req, res) => {
  const problems = await prisma.problem.findMany();

  if (!problems) throw new ApiError(400, "Failed to get Problems");

  return res
    .status(200)
    .json(new ApiResponse(200, "Problems Found", { problems }));
});

export const getProblemsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const problem = await prisma.problem.findUnique({
    where: {
      id: id,
    },
  });

  if (!problem) throw new ApiError(400, "May be Id is wrong");

  return res
    .status(200)
    .json(new ApiResponse(200, "Problem Find", { problem }));
});

export const updateProblem = asyncHandler(async (req, res) => {
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
  const { id } = req.params;

  const result = validateSchema(createProblemSchema, req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Validation Error:- ", result));
  }

  checkRefrenceSolution(referenceSolutions, testcases);

  const Problem = await prisma.problem.update({
    where: {
      id: id,
    },
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
      Problem,
    })
  );
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new ApiError(400, "Give id");

  const deleteProblem = await prisma.problem.delete({
    where: {
      id: id,
    },
  });

  if (!deleteProblem) throw new ApiError(404, "Not found");

  return res.status(200).json(new ApiResponse(200, "Problem deleted"));
});

export const getAllProblemsSolvedByUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  console.log(userId);

  const problems = await prisma.problem.findMany({
    where: {
      ProblemSolved: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      ProblemSolved: {
        where: {
          userId: userId,
        },
      },
    },
  });

  if (!problems) throw new ApiError(404, "No Solved Problem found");

  return res
    .status(200)
    .json(new ApiResponse(200, "All solved problem fetched", problems));
});
