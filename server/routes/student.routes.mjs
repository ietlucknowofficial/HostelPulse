import express from 'express'
import {authMiddleware } from "../middleware/auth.middleware.mjs"

import  {completeProfile} from "../controllers/student.controller.mjs";
import { roleMiddleware } from '../middleware/role.middleware.mjs';
import { createComplaint } from '../controllers/complaint.controller.mjs';
const router=express.Router()

router.post('/complete-profile',authMiddleware,roleMiddleware("student"),completeProfile)
router.post('/create-complaint',authMiddleware,roleMiddleware("student"),createComplaint)
export default router