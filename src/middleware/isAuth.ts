import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AuthenticatedRequest, Payload } from "../types/request";

export const isAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  try {
    const token = authorizationHeader.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!) as Payload;
    req.user = payload;
  } catch (err) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  next();
};
