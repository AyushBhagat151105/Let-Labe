export const options = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV !== "development",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
