export const APIsEndPoints = {
    LOGIN: "/api/auth/employee/login",
    LOGOUT: "/api/auth/employee/logout",
    CHECKELOGIN: "/api/auth/employee/check-login",
    FORGOT_PASSWORD: "/api/auth/employee/forgot-password",
    RESET_PASSWORD: (token) => `/api/auth/employee/reset-password/${token}`
}

export const HREndPoints = {
    SIGNUP: "/api/auth/HR/signup",
    CHECKLOGIN: "/api/auth/HR/check-login",
    LOGIN: "/api/auth/HR/login",
    LOGOUT: "/api/auth/HR/logout",
    VERIFY_EMAIL: "/api/auth/HR/verify-email",
    CHECK_VERIFY_EMAIL: "/api/auth/HR/check-verify-email",
    RESEND_VERIFY_EMAIL: "/api/auth/HR/resend-verify-email",
    FORGOT_PASSWORD: "/api/auth/HR/forgot-password",
    RESET_PASSWORD: (token) => `/api/auth/HR/reset-password/${token}`
}

export const DashboardEndPoints = {
    GETDATA: "/api/v1/dashboard/HR-dashboard"
}

export const HREmployeesPageEndPoints = {
    GETALL: "/api/v1/employee/all",
    ADDEMPLOYEE: "/api/auth/employee/signup",
    GETONE: (EMID) => `/api/v1/employee/by-HR/${EMID}`,
    DELETE: (EMID) => `/api/v1/employee/delete-employee/${EMID}`
}

export const HRDepartmentPageEndPoints = {
    GETALL: "/api/v1/department/all",
    CREATE: "/api/v1/department/create-department",
    UPDATE: "/api/v1/department/update-department",
    DELETE: "/api/v1/department/delete-department"
}

export const EmployeesIDsEndPoints = {
    GETALL: "/api/v1/employee/all-employees-ids",
}

export const SalaryEndPoints = {
    CREATE: "/api/v1/salary/create-salary",
    GETALL: "/api/v1/salary/all",
    GETONE: (salaryID) => `/api/v1/salary/${salaryID}`,
    UPDATE: "/api/v1/salary/update-salary",
    DELETE: (salaryID) => `/api/v1/salary/delete-salary/${salaryID}`
}

export const LeaveEndPoints = {
    CREATE: "/api/v1/leave/create-leave",
    HR_CREATE: "/api/v1/leave/HR-create-leave",
    GETALL: "/api/v1/leave/all",
    GETONE: (leaveID) => `/api/v1/leave/${leaveID}`,
    UPDATE_BY_EMPLOYEE: "/api/v1/leave/employee-update-leave",
    UPDATE_BY_HR: "/api/v1/leave/HR-update-leave",
    DELETE: (leaveID) => `/api/v1/leave/delete-leave/${leaveID}`
}

export const AttendanceEndPoints = {
    INITIALIZE: "/api/v1/attendance/initialize",
    HR_INITIALIZE: "/api/v1/attendance/HR-initialize",
    GETALL: "/api/v1/attendance/all",
    GETONE: (attendanceID) => `/api/v1/attendance/${attendanceID}`,
    UPDATE: "/api/v1/attendance/update-attendance",
    DELETE: (attendanceID) => `/api/v1/attendance/delete-attendance/${attendanceID}`
}