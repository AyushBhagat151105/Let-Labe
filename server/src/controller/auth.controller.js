import { prisma } from "../client/index.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { MailTrap } from "../utils/mail.js";
import { generateAccessTokenAndRefreshToken } from "../utils/jwtToken.js";
import { options } from "../utils/cookiesOptions.js";


export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

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
    },
  });

  if (!user) {
    throw new ApiError(500, "User not created");
  }

  const link = `${process.env.CLIENT_URL}/auth/verify/${token}`;
  const mail = new MailTrap(email);

  mail.sendMail(`Your Account Verification Link: ${link}`);

  return res
    .status(200)
    .json(new ApiResponse(200, "User created successfully"));

  //   console.log(req);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  console.log(token);

  if (!token) {
    throw new ApiError(400, "Token is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      verificationToken: token,
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid token");
  }

  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVarifyed: true,
      verificationToken: null,
    },
  });

  const mail = new MailTrap(user.email);

  mail.sendMail(`Your Account is Verified`);

  return res
    .status(200)
    .json(new ApiResponse(200, "User verified successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

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
      refreshToken: refreshToken,
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
          isVarifyed: updatedUser.isVarifyed,
        },
      })
    );
});

export const getUser = asyncHandler(async (req, res) => {
  const { user_id } = req;

  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!user) throw new ApiError(400, "User not found");

  return res
    .status(200)
    .cookie("accessToken", req.accessToken, options)
    .cookie("refreshToken", req.refreshToken, options)
    .json(
      new ApiResponse(200, "User fetched successfullu", {
        profile: {
          id: user.id,
          name: user.name,
          email: user.email,
          isVarifyed: user.isVarifyed,
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

  console.log(user_id.id);

  if (!user_id) throw new ApiError(403, "unAuthorized");

  const { accessToken } = await generateAccessTokenAndRefreshToken(user_id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "Access token refreshed successfully"));
});
