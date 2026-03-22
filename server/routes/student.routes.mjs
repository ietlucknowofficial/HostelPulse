import express from 'express'
import {authMiddleware } from "../middleware/auth.middleware.mjs"

import  {completeProfile} from "../controllers/student.controller.mjs";
import { roleMiddleware } from '../middleware/role.middleware.mjs';
import { createComplaint, deleteStudentComplaints, reopenStudentComplaints, viewStudentComplaints } from '../controllers/complaint.controller.mjs';
const router=express.Router()

router.post('/complete-profile',authMiddleware,roleMiddleware("student"),completeProfile)
router.post('/create-complaint',authMiddleware,roleMiddleware("student"),createComplaint)
router.get('/complaints',authMiddleware,roleMiddleware('student'),viewStudentComplaints)
router.delete('/:id/delete',authMiddleware,roleMiddleware('student'),deleteStudentComplaints)
router.put('/:id/reopen',authMiddleware,roleMiddleware('student'),reopenStudentComplaints)
export default router