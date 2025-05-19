import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Name must be at least 2 character long" }),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, {
      message:
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
});

export const createProblemSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description is required"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"], {
    required_error: "Difficulty Required fild must be like EASY,MEDIUM,HARD",
  }),
  tags: z
    .array(z.string({ required_error: "Tages are required" }))
    .min(1, "tags is required"),
  examples: z.record(
    z.object({
      input: z.string({ required_error: "input is required" }),
      output: z.string({ required_error: "output is required" }),
      explanation: z.string({ required_error: "explanation is required" }),
    })
  ),
  constraints: z
    .string({ required_error: "constraints is required" })
    .min(1, "constraints are required"),
  testcases: z.array(
    z.object({
      input: z.string({ required_error: "Inpute is required" }),
      output: z.string({ required_error: "output is required" }),
    })
  ),
  codeSnippets: z.record(
    z.string({ required_error: "codeSnippets is required" })
  ),
  referenceSolutions: z.record(
    z.string({ required_error: "referenceSolutions is required" })
  ),
  hints: z.string().min(1, "hints are required").optional(),
  Editorial: z.string().min(1, "Editorial are required").optional(),
});

export const executeCodeSchema = z.object({
  source_code: z.string({ required_error: "source_code is required" }),
  language_id: z.number({ required_error: "language id is required" }),
  stdin: z.array(z.string({ required_error: "inpute is required" })),
  expected_outputs: z.array(
    z.string({ required_error: "outpute is required" })
  ),
  problemId: z.string({ required_error: "problem id required" }).uuid(),
});

export const createPlaylistSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  description: z.string({ required_error: "Description is required" }),
});
