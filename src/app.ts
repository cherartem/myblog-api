import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import compression from "compression";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./middleware/errors";
import logger from "morgan";
import "dotenv/config";

const app: Application = express();

import userRouter from "./routes/user";
import refreshTokenRouter from "./routes/refreshToken";
import articleRouter from "./routes/article";
import cmsArticleRouter from "./routes/cms";

if (process.env.DB_CONNECTION) {
  mongoose.connect(process.env.DB_CONNECTION);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", () => {
    console.log("Connected successfully");
  });
}

app.use(compression());
app.use(helmet());

app.use(
  cors({
    origin: [
      "https://myblog-cms.vercel.app",
      "https://myblog-cherartem.vercel.app",
    ],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouter);
app.use("/api/refresh-token", refreshTokenRouter);
app.use("/api/articles", articleRouter);
app.use("/api/cms/articles", cmsArticleRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);
