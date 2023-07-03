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

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
