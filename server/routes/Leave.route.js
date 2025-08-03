import express from 'express'
import { HandleAllLeaves, HandleCreateLeave, HandleDeleteLeave, HandleLeave, HandleUpdateLeaveByEmployee, HandleUpdateLeavebyHR } from '../controllers/Leave.controller.js'
import { VerifyEmployeeToken, VerifyhHRToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'


const router = express.Router() 

router.post("/create-leave", VerifyEmployeeToken, HandleCreateLeave)

router.post("/HR-create-leave", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateLeave)

router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllLeaves)

router.get("/:leaveID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleLeave)

router.patch("/employee-update-leave", VerifyEmployeeToken, HandleUpdateLeaveByEmployee)

router.patch("/HR-update-leave", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateLeavebyHR)

router.delete("/delete-leave/:leaveID", VerifyEmployeeToken, HandleDeleteLeave)

// Employee routes for leave access
router.get("/employee/leaves", VerifyEmployeeToken, async (req, res) => {
  try {
    const { Leave } = await import('../models/Leave.model.js');
    const leaves = await Leave.find({ employee: req.EMid })
      .populate("approvedby", "firstname lastname")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router