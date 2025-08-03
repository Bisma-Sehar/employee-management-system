import { HRSignupPage } from "../pages/HumanResources/HRSignup";
import { HRLogin } from "../pages/HumanResources/HRlogin";
import { HRDashbaord } from "../pages/HumanResources/HRdashbaord";
import { VerifyEmailPage } from "../pages/HumanResources/verifyemailpage.jsx";
import { HRForgotPasswordPage } from "../pages/HumanResources/forgotpassword.jsx";
import { ResetMailConfirmPage } from "../pages/HumanResources/resetmailconfirm.jsx";
import { ResetHRPasswordPage } from "../pages/HumanResources/resetpassword.jsx";
import { ResetHRVerifyEmailPage } from "../pages/HumanResources/resetemail.jsx";
import { HRDashboardPage } from "../pages/HumanResources/Dashboard Childs/dashboardpage.jsx";
import { HRProtectedRoutes } from "./HRprotectedroutes.jsx";
import { HREmployeesPage } from "../pages/HumanResources/Dashboard Childs/employeespage.jsx";
import { HRDepartmentPage } from "../pages/HumanResources/Dashboard Childs/departmentpage.jsx";
import { HRSalaryPage } from "../pages/HumanResources/Dashboard Childs/salarypage.jsx";
import { HRLeavePage } from "../pages/HumanResources/Dashboard Childs/leavepage.jsx";
import { HRAttendancePage } from "../pages/HumanResources/Dashboard Childs/attendancepage.jsx";



export const HRRoutes = [
  {
    path: "/auth/HR/signup",
    element: <HRSignupPage />,
  },
  {
    path: "/auth/HR/login",
    element: <HRLogin />,
  },
  {
    path: "/HR/dashboard",
    element: (
      <HRProtectedRoutes role="HR-Admin">
        <HRDashbaord />
      </HRProtectedRoutes>
    ),
    children: [
      {
        path: "/HR/dashboard/dashboard-data",
        element: <HRDashboardPage />,
      },
      {
        path: "/HR/dashboard/employees",
        element: <HREmployeesPage />,
      },
      {
        path: "/HR/dashboard/departments",
        element: <HRDepartmentPage />,
      },
      {
        path: "/HR/dashboard/salaries",
        element: <HRSalaryPage />,
      },
      {
        path: "/HR/dashboard/leaves",
        element: <HRLeavePage />,
      },
      {
        path: "/HR/dashboard/attendance",
        element: <HRAttendancePage />,
      },
    ],
  },
  {
    path: "/auth/HR/verify-email",
    element: <VerifyEmailPage />,
  },
  {
    path: "/auth/HR/reset-email-validation",
    element: <ResetHRVerifyEmailPage />,
  },
  {
    path: "/auth/HR/forgot-password",
    element: <HRForgotPasswordPage />,
  },
  {
    path: "/auth/HR/reset-email-confirmation",
    element: <ResetMailConfirmPage />,
  },
  {
    path: "/auth/HR/resetpassword/:token",
    element: <ResetHRPasswordPage />,
  },
];
