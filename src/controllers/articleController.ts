import expressAsyncHandler from "express-async-handler";
import { AuthenticatedRequest } from "../types/request";
import { Response, Request } from "express";
import { body, validationResult } from "express-validator";
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
  body("isPublished", "This field is required")
    .trim()
    .notEmpty()
    .isBoolean()
    .withMessage("This field must be a boolean")
    .toBoolean(),

  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      res.status(400).json({
        errors: validationErrors.array(),
      });
      return;
    }

    await Article.create({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      isPublished: req.body.isPublished,
    });

    res.status(200).json({
      message: "Successfully created a new article",
    });
  }),
];

export const readPublishedArticle = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { articleId } = req.params;

    const article = await Article.findById(articleId).exec();

    if (!article || article.isPublished === false) {
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

export const readAnyArticle = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
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
      });
      return;
    }

    const article = await Article.findById(articleId).exec();

    if (!article) {
      res.status(404).json({
        message: "Article not found",
      });
      return;
    }

    article.title = req.body.title;
    article.description = req.body.description;
    article.content = req.body.content;

    await article.save();

    res.status(200).json({
      message: "Successfully updated the article",
    });
  }),
];

export const deleteArticle = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { articleId } = req.params;

    const article = await Article.findById(articleId).exec();

    if (!article) {
      res.status(404).json({
        message: "Article not found",
      });
      return;
    }

    await Article.deleteOne({ _id: articleId });

    res.status(200).json({
      message: "Successfully deleted the article",
    });
  }
);

export const readAllPublishedArticles = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const cursor = req.query.cursor ? Number(req.query.cursor) : 0;
    const pageSize = 5;

    const [totalArticles, articles] = await Promise.all([
      Article.count({ isPublished: true }).exec(),
      Article.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .skip(cursor)
        .limit(pageSize)
        .exec(),
    ]);

    let nextCursor = null;
    if (cursor + pageSize < totalArticles) {
      nextCursor = cursor + pageSize;
    }

    res.status(200).json({
      data: articles,
      nextCursor,
    });
  }
);

export const readAllArticles = expressAsyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const cursor = req.query.cursor ? Number(req.query.cursor) : 0;
    const pageSize = 5;

    const [totalArticles, articles] = await Promise.all([
      Article.count().exec(),
      Article.find()
        .sort({ createdAt: -1 })
        .skip(cursor)
        .limit(pageSize)
        .exec(),
    ]);

    let nextCursor = null;
    if (cursor + pageSize < totalArticles) {
      nextCursor = cursor + pageSize;
    }

    res.status(200).json({
      data: articles,
      nextCursor,
    });
  }
);

export const changeVisibilityStatus = [
  body("isPublished", "This field is required")
    .trim()
    .notEmpty()
    .isBoolean()
    .withMessage("This field must be a boolean")
    .toBoolean(),

  expressAsyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { articleId } = req.params;

    const article = await Article.findById(articleId).exec();

    if (!article) {
      res.status(404).json({
        message: "Article not found",
      });
      return;
    }

    article.isPublished = req.body.isPublished;

    await article.save();

    res.status(200).json({
      message: "The visibility status has been successfully updated",
    });
  }),
];
