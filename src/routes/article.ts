import express from "express";
import {
  createArticle,
  readArticle,
  updateArticle,
} from "../controllers/articleController";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.post("/", isAuth, createArticle);
router.get("/:articleId", readArticle);
router.post("/:articleId", isAuth, updateArticle);

export default router;
