import { sign } from "jsonwebtoken";
import { IUser } from "../models/user";

export const createAccessToken = (user: IUser) => {
  return sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "10m",
  });
};

export const createRefreshToken = (user: IUser) => {
  return sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};
