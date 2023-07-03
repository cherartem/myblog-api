import express from "express";
import { signUp } from "../controllers/userController";
import { checkUserRegistration } from "../middleware/checkUserRegistration";

const router = express.Router();

router.post("/", checkUserRegistration, signUp);

export default router;
