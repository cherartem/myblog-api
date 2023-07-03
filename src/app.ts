import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import "dotenv/config";

const app: Application = express();

if (process.env.DB_CONNECTION) {
  mongoose.connect(process.env.DB_CONNECTION);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("open", () => {
    console.log("Connected successfully");
  });
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

const port = process.env.PORT || 5000;

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
