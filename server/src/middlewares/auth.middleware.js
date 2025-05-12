import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../client/index.js";

export const isAuth = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) throw new ApiError(403, "UnAuthorized Token");

  const decoded = jwt.verify(accessToken, process.env.ACCESSTOKEN);

  // console.log(decoded);

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.id,
    },
  });

  if (!user) throw new ApiError(404, "User not found");

  req.user = user;

  next();
});
