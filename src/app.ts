import express, { Application, Request, Response } from "express";
import "dotenv/config";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
