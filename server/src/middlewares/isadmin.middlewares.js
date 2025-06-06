import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkAdmin = asyncHandler(async (req, res, next) => {
  if ((req.user?.role !== req.user?.role) === "ADMIN")
    throw new ApiError(403, "UnAuthorized request");

  next();
});
