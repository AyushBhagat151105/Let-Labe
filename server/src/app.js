import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;


const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per 15 minutes
  message: { error: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 login attempts per 15 minutes
  message: { error: 'Too many authentication attempts, please try again later.' }
});


app.use(generalLimiter);


app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.SECOND_CLIENT_URL],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("src/public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// APP MAIN ROUTES
import { authRouter } from "./routes/auth.routes.js";
import { problemRoutes } from "./routes/problem.routes.js";
import { executeRoutes } from "./routes/execute.routes.js";
import { submissionRoutes } from "./routes/submission.routes.js";
import { playListRoutes } from "./routes/playlist.routes.js";
import { healthCheckRouter } from "./routes/healthCheck.routes.js";

app.use("/api/v1/health-check", healthCheckRouter);

// Apply stricter rate limit to auth routes
app.use("/api/v1/auth", authLimiter, authRouter);

app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executeRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playListRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
