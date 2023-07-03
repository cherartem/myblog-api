import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import { hash, compare } from "bcryptjs";
import passwordSchema from "../auth/passwordSchema";
import he from "he";
import { User } from "../models/user";

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
        formData: {
          fullname: he.decode(req.body.fullname),
          username: he.decode(req.body.username),
          password: he.decode(req.body.password),
          confirmPassword: he.decode(req.body.confirmPassword),
        },
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
