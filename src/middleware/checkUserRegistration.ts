import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";

export const checkUserRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const numOfUsers = await User.count().exec();

  if (numOfUsers > 0) {
    res.status(403).json({
      message: "User registration is not allowed",
    });
  } else {
    next();
  }
};
