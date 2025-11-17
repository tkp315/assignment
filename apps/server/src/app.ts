import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL!],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "20Kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

import userRouter from "./routes/user.routes.ts";
import taskRouter from "./routes/task.routes.ts";

app.use("/api/auth", userRouter);
app.use("/api/tasks", taskRouter);

export default app;
