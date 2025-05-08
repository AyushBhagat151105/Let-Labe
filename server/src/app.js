import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("src/public"));

// APP MAIN ROUTES
import { authRouter } from "./routes/auth.routes.js";
import { problemRoutes } from "./routes/problem.routes.js";
import { executeRoutes } from "./routes/execute.routes.js";
import { submissionRoutes } from "./routes/submission.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executeRoutes);
app.use("/api/v1/submission", submissionRoutes)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
