import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessTokenAndRefreshToken } from "../utils/jwtToken.js";
import { prisma } from "../client/index.js";

export const isAuth = asyncHandler(async (req, res, next) => {
  let { accessToken, refreshToken: userRefreshToken } = req.cookies;

  if (!accessToken) {
    accessToken = req.headers.authorization?.split("Bearer ")[1];
    userRefreshToken = req.headers["x-refreshtoken"];
  }

  if (!accessToken || !userRefreshToken) {
    throw new ApiError(401, "Access or refresh token missing");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESSTOKEN);
    req.user_id = decoded.id;
    req.accessToken = accessToken;
    req.refreshToken = userRefreshToken;
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const payload = jwt.verify(userRefreshToken, process.env.REFRESHTOKEN);

      if (!payload) {
        throw new ApiError(401, "Refresh token invalid or expired");
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await generateAccessTokenAndRefreshToken(payload.id);

      await prisma.user.update({
        where: { id: payload.id },
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });

      req.user_id = payload.id;
      req.accessToken = newAccessToken;
      req.refreshToken = newRefreshToken;

      return next();
    }

    throw new ApiError(401, "Unauthorized: Invalid token");
  }
});
