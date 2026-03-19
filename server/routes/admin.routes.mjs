import express from 'express'
import { viewComplaints,resolveComplaint, complaintStatus } from "../controllers/complaint.controller.mjs";
import { authMiddleware } from "../middleware/auth.middleware.mjs";
import { roleMiddleware } from "../middleware/role.middleware.mjs";

const router=express.Router()

router.get('/all-complaints',authMiddleware,roleMiddleware('admin'),viewComplaints)
router.put('/:id/resolve',authMiddleware,roleMiddleware('admin'),resolveComplaint)
router.put('/:id/status',authMiddleware,roleMiddleware('admin'),complaintStatus)
export default router;