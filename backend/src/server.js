import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = new Set((process.env.CLIENT_URL || "").split(",").filter(Boolean));

app.use(
  cors({
    origin(origin, callback) {
      const isLocalVite =
        /^http:\/\/(localhost|127\.0\.0\.1):517\d$/.test(origin || "") ||
        /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}):517\d$/.test(origin || "");

      if (!origin || allowedOrigins.has(origin) || isLocalVite) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Team Task Manager API is running" });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`API running on port ${port}`));
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
