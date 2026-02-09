import express from "express"
import { signup } from "../controllers/auth.controller.mjs";
const router=express.Router()

//SignUp Route
router.post('/signup',signup);
export default router
