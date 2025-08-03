import { EmployeeLogin } from "../pages/Employees/emplyoeelogin.jsx";
import { EmployeeDashboard } from "../pages/Employees/employeedashboard.jsx";
import { EmployeeDashboardLayout } from "../pages/Employees/EmployeeDashboardLayout.jsx";
import { ProtectedRoutes } from "./protectedroutes.jsx";
import { ForgotPassword } from "../pages/Employees/forgotpassword.jsx";
import { ResetEmailConfirm } from "../pages/Employees/resetemailconfirm.jsx";
import { ResetPassword } from "../pages/Employees/resetpassword.jsx";
import { EntryPage } from "../pages/Employees/EntryPage.jsx";
import { EmployeeProfilePage } from "../pages/Employees/Dashboard Childs/ProfilePage.jsx";
import { EmployeeAttendancePage } from "../pages/Employees/Dashboard Childs/AttendancePage.jsx";
import { EmployeeAttendanceHistoryPage } from "../pages/Employees/Dashboard Childs/AttendanceHistoryPage.jsx";
import { EmployeeLeaveRequestPage } from "../pages/Employees/Dashboard Childs/LeaveRequestPage.jsx";
import { EmployeeSalaryRequestPage } from "../pages/Employees/Dashboard Childs/SalaryRequestPage.jsx";
import { EmployeeSalaryHistoryPage } from "../pages/Employees/Dashboard Childs/SalaryHistoryPage.jsx";

export const EmployeeRoutes = [
  {
    path: "/",
    element: <EntryPage />,
  },
  {
    path: "/auth/employee/login",
    element: <EmployeeLogin />,
  },
  {
    path: "/auth/employee/employee-dashboard",
    element: (
      <ProtectedRoutes>
        <EmployeeDashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/employee/dashboard",
    element: (
      <ProtectedRoutes>
        <EmployeeDashboardLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/employee/dashboard/profile",
        element: <EmployeeProfilePage />,
      },
      {
        path: "/employee/dashboard/attendance",
        element: <EmployeeAttendancePage />,
      },
      {
        path: "/employee/dashboard/attendance-history",
        element: <EmployeeAttendanceHistoryPage />,
      },
      {
        path: "/employee/dashboard/leave-request",
        element: <EmployeeLeaveRequestPage />,
      },
      {
        path: "/employee/dashboard/salary-request",
        element: <EmployeeSalaryRequestPage />,
      },
      {
        path: "/employee/dashboard/salary-history",
        element: <EmployeeSalaryHistoryPage />,
      },
    ],
  },
  {
    path: "/auth/employee/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/auth/employee/reset-email-confirmation",
    element: <ResetEmailConfirm />,
  },
  {
    path: "/auth/employee/resetpassword/:token",
    element: <ResetPassword />,
  },
];

