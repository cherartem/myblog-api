import express from "express";
import {
  readAllPublishedArticles,
  readPublishedArticle,
} from "../controllers/articleController";

const router = express.Router();

router.get("/", readAllPublishedArticles);
router.get("/:articleId", readPublishedArticle);

export default router;
