import express from "express";
import { isAuth } from "../middleware/isAuth";
import {
  createArticle,
  deleteArticle,
  readAllArticles,
  readArticle,
  updateArticle,
} from "../controllers/articleController";

const router = express.Router();

router.get("/", isAuth, readAllArticles);
router.post("/", isAuth, createArticle);
router.get("/:articleId", isAuth, readArticle);
router.post("/:articleId", isAuth, updateArticle);
router.delete("/:articleId", isAuth, deleteArticle);

export default router;
