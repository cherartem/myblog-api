import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const err = new Error("Not found");
  res.status(404);
  next(err);
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: err.stack,
  });
};
