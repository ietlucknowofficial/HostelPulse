import express from 'express'
import {authMiddleware } from "../middleware/auth.middleware.mjs"

import  {completeProfile} from "../controllers/student.controller.mjs";
const router=express.Router()

router.post('/complete-profile',authMiddleware,completeProfile)
export default router