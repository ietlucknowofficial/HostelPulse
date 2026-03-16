import express from 'express'
import {authMiddleware } from "../middleware/auth.middleware.mjs"

import  {completeProfile} from "../controllers/student.controller.mjs";
import { roleMiddleware } from '../middleware/role.middleware.mjs';
import { createComplaint } from '../controllers/complaint.controller.mjs';
const router=express.Router()

router.post('/complete-profile',authMiddleware,roleMiddleware("Student"),completeProfile)
export default router