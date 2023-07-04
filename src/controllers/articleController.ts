import expressAsyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../types/request";
import { Response, Request } from "express";
import { body, validationResult } from "express-validator";
import he from "he";
import { Article } from "../models/article";

export const createArticle = [
  body("title", "This field is required")
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 70 })
    .withMessage("This field should be between 1 and 70 characters long")
    .escape(),
  body("description", "This field is required")
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 300 })
    .withMessage("This field should be between 1 and 300 characters long")
    .escape(),
  body("content", "This field is required").trim().notEmpty().escape(),

  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        errors: validationErrors.array(),
        formData: {
          title: he.decode(req.body.title),
          description: he.decode(req.body.description),
          content: he.decode(req.body.content),
        },
      });
      return;
    }

    await Article.create({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
    });

    res.status(200).json({
      message: "Successfully created a new article",
    });
  }),
];

export const readArticle = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { articleId } = req.params;

    const article = await Article.findById(articleId).exec();

    if (!article) {
      res.status(404).json({
        message: "Article not found",
      });
      return;
    }

    res.status(200).json({
      article,
    });
  }
);

export const updateArticle = [
  body("title", "This field is required")
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 70 })
    .withMessage("This field should be between 1 and 70 characters long")
    .escape(),
  body("description", "This field is required")
    .trim()
    .notEmpty()
    .isLength({ min: 1, max: 300 })
    .withMessage("This field should be between 1 and 300 characters long")
    .escape(),
  body("content", "This field is required").trim().notEmpty().escape(),

  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationErrors = validationResult(req);
    const { articleId } = req.params;

    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        errors: validationErrors.array(),
        formData: {
          title: he.decode(req.body.title),
          description: he.decode(req.body.description),
          content: he.decode(req.body.content),
        },
      });
      return;
    }

    await Article.findByIdAndUpdate(articleId, {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
    });

    res.status(200).json({
      message: "Successfully updated the article",
    });
  }),
];
