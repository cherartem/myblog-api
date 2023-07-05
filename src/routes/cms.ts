import express from "express";
import { isAuth } from "../middleware/isAuth";
import {
  changeVisibilityStatus,
  createArticle,
  deleteArticle,
  readAllArticles,
  readAnyArticle,
  updateArticle,
} from "../controllers/articleController";

const router = express.Router();

router.get("/", isAuth, readAllArticles);
router.post("/", isAuth, createArticle);
router.get("/:articleId", isAuth, readAnyArticle);
router.post("/:articleId", isAuth, updateArticle);
router.delete("/:articleId", isAuth, deleteArticle);
router.post("/:articleId/is-published", isAuth, changeVisibilityStatus);

export default router;
