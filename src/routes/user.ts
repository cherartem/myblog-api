import express from "express";
import { getUserData, signIn, signUp } from "../controllers/userController";
import { checkUserRegistration } from "../middleware/checkUserRegistration";
import { isAuth } from "../middleware/isAuth";
import { revokeRefreshTokens } from "../controllers/tokenController";

const router = express.Router();

router.post("/", checkUserRegistration, signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", isAuth, revokeRefreshTokens);
router.get("/greeting-data", isAuth, getUserData);

export default router;
