import { prisma } from "../client/index.js";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user_id;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden - you dont have permission");
  }

  next();
});
