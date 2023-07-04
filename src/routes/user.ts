import express from "express";
import { signIn, signUp } from "../controllers/userController";
import { checkUserRegistration } from "../middleware/checkUserRegistration";
import { isAuth } from "../middleware/isAuth";
import { revokeRefreshTokens } from "../controllers/tokenController";

const router = express.Router();

router.post("/", checkUserRegistration, signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", isAuth, revokeRefreshTokens);

export default router;
