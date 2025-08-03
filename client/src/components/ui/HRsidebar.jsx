

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavLink, useNavigate } from "react-router-dom"





export function HRdashboardSidebar() {
  const navigate = useNavigate();



  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/auth/HR/login");       
  };



  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3 p-2">
              <NavLink
                to={"/HR/dashboard/dashboard-data"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/dashboard.png" alt="" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Dashboard</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/HR/dashboard/employees"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/employee-2.png" alt="" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Employees</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/HR/dashboard/departments"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/department.png" alt="" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Departments</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/HR/dashboard/salaries"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/salary.png" alt="" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Salaries</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/HR/dashboard/leaves"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/leave.png" alt="" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Leaves</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/HR/dashboard/attendance"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/attendance.png" alt="Attendance" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Attendance</button>
                </SidebarMenuItem>
              </NavLink>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      


      <SidebarFooter className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-600 hover:bg-red-100 rounded-lg px-3 py-2 w-full"
        >
          <img
            src="/../../src/assets/HR-Dashboard/logout.png"
            alt="Logout"
            className="w-6"
          />
          <span className="text-[16px] font-medium"></span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}

