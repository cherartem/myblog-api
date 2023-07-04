import express from "express";
import {
  createArticle,
  deleteArticle,
  readAllArticles,
  readArticle,
  updateArticle,
} from "../controllers/articleController";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.get("/", readAllArticles);
router.post("/", isAuth, createArticle);
router.get("/:articleId", readArticle);
router.post("/:articleId", isAuth, updateArticle);
router.delete("/:articleId", isAuth, deleteArticle);

export default router;
