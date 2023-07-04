import express from "express";
import { createArticle } from "../controllers/articleController";
import { isAuth } from "../middleware/isAuth";

const router = express.Router();

router.post("/", isAuth, createArticle);

export default router;
