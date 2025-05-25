import { prisma } from "../client/index.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { generateAccessTokenAndRefreshToken } from "../utils/jwtToken.js";
import { options } from "../utils/cookiesOptions.js";
import { validateSchema } from "../utils/validateSchema.js";
import { loginSchema, registerSchema } from "../validation/zodValidation.js";
import { ResendMailer } from "../utils/mail.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = validateSchema(registerSchema, req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Validation Error:- ", result));
  }

  const foundedUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (foundedUser) {
    throw new ApiError(400, "User already exists");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  const token = await crypto.randomBytes(18).toString("hex");

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: encryptedPassword,
      verificationToken: token,
      verificationTokenExpiry: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  if (!user) {
    throw new ApiError(500, "User not created");
  }
  const link = `${process.env.CLIENT_URL}/auth/verify/${token}`;
  const mail = new ResendMailer(email);

  const emailHTML = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <h2 style="color: #2d3748;">Welcome to Our App 👋</h2>
    <p style="font-size: 16px; color: #4a5568;">
      Thank you for signing up! Please verify your account by clicking the button below:
    </p>
    <a href="${link}" style="display: inline-block; margin: 20px 0; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: bold;">
      Verify Account
    </a>
    <p style="font-size: 14px; color: #718096;">
      If the button doesn't work, you can copy and paste this URL into your browser:
    </p>
    <p style="font-size: 14px; color: #3182ce; word-break: break-all;">
      <a href="${link}" style="color: #3182ce;">${link}</a>
    </p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #a0aec0;">
      If you didn’t create an account, you can safely ignore this email.
    </p>
  </div>
`;

  await mail.sendMail({
    subject: "Verify Your Email – Action Required",
    html: emailHTML,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "User created successfully"));

  //   console.log(req);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      verificationToken: token,
      verificationTokenExpiry: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVarifyed: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  //   const mail = new ResendMailer(user.email);

  //   const emailHTML = `
  //   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f8f9fa; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
  //     <h2 style="color: #38a169;">✅ Account Verified Successfully</h2>
  //     <p style="font-size: 16px; color: #4a5568;">
  //       Hi <strong>${user.name || "there"}</strong>,<br><br>
  //       Your account has been verified successfully. You can now log in and start using all the features of our platform.
  //     </p>
  //     <a href="${
  //       process.env.CLIENT_URL
  //     }/login" style="display: inline-block; margin: 20px 0; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: bold;">
  //       Go to Dashboard
  //     </a>
  //     <hr style="margin-top: 30px;" />
  //     <p style="font-size: 14px; color: #a0aec0;">
  //       If you didn’t verify your account or this wasn't you, please contact our support team immediately.
  //     </p>
  //   </div>
  // `;

  //   await mail.sendMail({
  //     subject: "🎉 Your Account is Now Verified!",
  //     html: emailHTML,
  //   });

  return res
    .status(200)
    .json(new ApiResponse(200, "User verified successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = validateSchema(loginSchema, req.body);

  if (!result.success) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Validation Error:- ", result));
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) throw new ApiError(400, "User not found");

  if (!user.isVarifyed) throw new ApiError(400, "User not verified");

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new ApiError(400, "Invalid password");

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user.id);

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      accessToken: accessToken,
    },
  });

  if (!updatedUser) throw new ApiError(500, "User not updated");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        profile: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          isVarifyed: updatedUser.isVarifyed,
        },
      })
    );
});

export const getUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const findUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!findUser) throw new ApiError(400, "User not found");

  return res
    .status(200)
    .cookie("accessToken", req.accessToken, options)
    .cookie("refreshToken", req.refreshToken, options)
    .json(
      new ApiResponse(200, "User fetched successfullu", {
        profile: {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          role: findUser.role,
          isVarifyed: findUser.isVarifyed,
        },
      })
    );
});

export const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "user logged out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) throw new ApiError(401, "unAuthorized");

  const user_id = await jwt.verify(refreshToken, process.env.REFRESHTOKEN);

  // console.log(user_id);

  if (!user_id) throw new ApiError(403, "unAuthorized");

  const { accessToken } = await generateAccessTokenAndRefreshToken(user_id.id);

  await prisma.user.update({
    where: {
      id: user_id.id,
    },
    data: {
      accessToken: accessToken,
    },
  });

  // console.log(accessToken);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "Access token refreshed successfully"));
});

export const check = asyncHandler(async (req, res) => {
  console.log(req.user);
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    user: req.user,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new ApiError(400, "User not found");

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) throw new ApiError(400, "Invalid password");

  const encryptedPassword = await bcrypt.hash(newPassword, 10);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      password: encryptedPassword,
    },
  });

  if (!updatedUser) throw new ApiError(500, "User not updated");
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "Password updated SuccessFully"));
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: name,
      email: email,
    },
  });

  if (!updatedUser) throw new ApiError(500, "User not updated");

  return res
    .status(200)
    .json(new ApiResponse(200, "User updated successfully"));
});
