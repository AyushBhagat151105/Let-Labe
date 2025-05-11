import { prisma } from "../client/index.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.lib.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateSchema } from "../utils/validateSchema.js";
import { executeCodeSchema } from "../validation/zodValidation.js";

export const executeCode = asyncHandler(async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  const userId = req.user.id;

  const result = validateSchema(executeCodeSchema, req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Validation Error:- ", result));
  }

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

  let allPassed = true;

  const detaildeResults = results.map((result, i) => {
    const stdout = result.stdout?.trim();
    const expected_output = expected_outputs[i]?.trim();
    const passed = stdout === expected_output;

    // console.log(`Testcase ${i + 1}`);
    // console.log(`Input ${stdin[i]}`);
    // console.log(`Expected Output for the testcase ${expected_output}`);
    // console.log(`Actual Output  ${stdout}`);

    // console.log(`Matched : ${passed}`);

    if (!passed) allPassed = false;

    return {
      testCase: i + 1,
      passed,
      stdout,
      expected: expected_output,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
    };
  });

  // console.log(detaildeResults);

  const submission = await prisma.submission.create({
    data: {
      userId,
      problemId,
      sourceCode: source_code,
      language: getLanguageName(language_id),
      stdin: stdin.join("\n"),
      stdout: JSON.stringify(detaildeResults.map((r) => r.stdout)),
      stderr: detaildeResults.some((r) => r.stderr)
        ? JSON.stringify(detaildeResults.map((r) => r.stderr))
        : null,
      compileOutput: detaildeResults.some((r) => r.compile_output)
        ? JSON.stringify(detaildeResults.map((r) => r.compile_output))
        : null,
      status: allPassed ? "Accepted" : "Wrong Answer",
      memory: detaildeResults.some((r) => r.memory)
        ? JSON.stringify(detaildeResults.map((r) => r.memory))
        : null,
      time: detaildeResults.some((r) => r.time)
        ? JSON.stringify(detaildeResults.map((r) => r.time))
        : null,
    },
  });

  if (!submission) throw new ApiError(400, "Submission failed");

  if (allPassed) {
    await prisma.problemSolved.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
      update: {},
      create: {
        userId,
        problemId,
      },
    });
  }

  const testCaseResult = detaildeResults.map((result) => ({
    submissionId: submission.id,
    testCase: result.testCase,
    passed: result.passed,
    stdout: result.stdout,
    expected: result.expected,
    stderr: result.stderr,
    compileOutput: result.compile_output,
    status: result.status,
    memory: result.memory,
    time: result.time,
  }));

  const data = await prisma.testCaseResult.createMany({
    data: testCaseResult,
  });

  if (!data) throw new ApiError(400, "Failed to add testCase Result");

  const submissionWithTestCase = await prisma.submission.findUnique({
    where: {
      id: submission.id,
    },
    include: {
      TestCaseResult: true,
    },
  });

  if (!submissionWithTestCase)
    throw new ApiError(400, "Failed to get submissions");

  return res
    .status(200)
    .json(new ApiResponse(200, "Problem sumbited", submissionWithTestCase));
});
