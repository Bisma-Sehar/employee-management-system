import express from 'express'
import { HandleCreateSalary, HandleAllSalary, HandleSalary, HandleUpdateSalary, HandleDeleteSalary } from '../controllers/Salary.controller.js'
import { VerifyhHRToken, VerifyEmployeeToken } from '../middlewares/Auth.middleware.js'
import { RoleAuthorization } from '../middlewares/RoleAuth.middleware.js'
import { Salary } from '../models/Salary.model.js'

const router = express.Router()

router.post("/create-salary", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleCreateSalary)

router.get("/all", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleAllSalary)

router.get("/:salaryID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleSalary)

router.patch("/update-salary", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleUpdateSalary)

router.delete("/delete-salary/:salaryID", VerifyhHRToken, RoleAuthorization("HR-Admin"), HandleDeleteSalary)


// Employee routes for salary access
router.get("/employee/salaries", VerifyEmployeeToken, async (req, res) => {
  try {
    const salaries = await Salary.find({ employee: req.EMid }).sort({ duedate: -1 });
    res.status(200).json({ success: true, data: salaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/employee/:salaryID", VerifyEmployeeToken, async (req, res) => {
  try {
    const { salaryID } = req.params;
    const salary = await Salary.findOne({
      _id: salaryID,
      employee: req.EMid
    }).populate("employee", "firstname lastname department");
    
    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }
    
    res.status(200).json({ success: true, data: salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router