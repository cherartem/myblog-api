import expressAsyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AuthenticatedRequest, Payload } from "../types/request";
import { User } from "../models/user";
import { createAccessToken, createRefreshToken } from "../auth/jwtTokens";
import { sendRefreshToken } from "../auth/sendRefreshToken";

export const refreshToken = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.jid;

    if (!token) {
      res.status(400).json({
        message: "Missing token",
        accessToken: "",
      });
      return;
    }

    let payload: Payload | null = null;

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as Payload;
    } catch (err) {
      res.status(400).json({
        message: "Invalid token",
        accessToken: "",
      });
      return;
    }

    const user = await User.findById(payload.userId).exec();

    if (!user) {
      res.status(404).json({
        message: "User not found",
        accessToken: "",
      });
      return;
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      res.status(400).json({
        message: "Invalid token",
        accessToken: "",
      });
      return;
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    sendRefreshToken(res, refreshToken);

    res.status(200).json({
      message: "Successfully created new access token",
      accessToken,
    });
  }
);

export const revokeRefreshTokens = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    await User.findByIdAndUpdate(req.user?.userId, {
      $inc: {
        tokenVersion: 1,
      },
    }).exec();

    res.status(200).json({
      message: "Successfully signed out",
    });
  }
);
