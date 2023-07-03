import express from "express";
import { signIn, signUp } from "../controllers/userController";
import { checkUserRegistration } from "../middleware/checkUserRegistration";

const router = express.Router();

router.post("/", checkUserRegistration, signUp);
router.post("/sign-in", signIn);

export default router;
