import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { hash, compare } from "bcryptjs";
import passwordSchema from "../auth/passwordSchema";
import he from "he";
import { User } from "../models/user";
import { createAccessToken, createRefreshToken } from "../auth/jwtTokens";
import { sendRefreshToken } from "../auth/sendRefreshToken";
import { AuthenticatedRequest } from "../types/request";
import { Article } from "../models/article";

export const signUp = [
  body("fullname", "This field is required").trim().notEmpty().escape(),
  body("username", "This field is required").trim().notEmpty().escape(),
  body("password", "This field is required")
    .trim()
    .notEmpty()
    .custom((value) => {
      if (!passwordSchema.validate(value)) {
        throw new Error(
          "Password should have a minimum length of 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one symbol"
        );
      } else {
        return true;
      }
    })
    .escape(),
  body("confirmPassword", "This field is required")
    .trim()
    .escape()
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      } else {
        return true;
      }
    }),

  expressAsyncHandler(async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        errors: validationErrors.array(),
      });
    } else {
      const hashedPassword = await hash(req.body.password, 15);

      await User.create({
        fullname: req.body.fullname,
        username: req.body.username,
        password: hashedPassword,
      });

      res.status(200).json({
        message: "You have successfully signed up",
      });
    }
  }),
];

export const signIn = [
  body("username", "This field is required")
    .trim()
    .notEmpty()
    .escape()
    .custom(async (value) => {
      const user = await User.findOne({ username: value }).exec();

      if (!user) {
        throw new Error("A user with this username does not exist");
      } else {
        return true;
      }
    }),
  body("password", "This field is required")
    .trim()
    .notEmpty()
    .escape()
    .custom(async (value, { req }) => {
      const user = await User.findOne({ username: req.body.username }).exec();
      const match = await compare(value, user!.password);

      if (!match) {
        throw new Error("Incorrect password");
      } else {
        return true;
      }
    }),

  expressAsyncHandler(async (req: Request, res: Response) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        errors: validationErrors.array(),
      });
    } else {
      const user = await User.findOne({ username: req.body.username });

      const accessToken = createAccessToken(user!);
      const refreshToken = createRefreshToken(user!);

      sendRefreshToken(res, refreshToken);

      res.status(200).json({
        message: "You have successfully signed in",
        accessToken,
      });
    }
  }),
];

export const getUserData = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const [user, numOfArticles] = await Promise.all([
      User.findById(req.user?.userId, "fullname").exec(),
      Article.count().exec(),
    ]);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      fullname: user.fullname,
      numOfArticles,
    });
  }
);
