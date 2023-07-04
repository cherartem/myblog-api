import express from "express";
import { refreshToken } from "../controllers/refreshTokenController";

const router = express.Router();

router.post("/", refreshToken);

export default router;
