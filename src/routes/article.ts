import express from "express";
import { createArticle, readArticle } from "../controllers/articleController";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.post("/", isAuth, createArticle);
router.get("/:articleId", readArticle);

export default router;
