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
import { useDispatch } from "react-redux"
import { HandleEmployeeLogout } from "@/redux/Thunks/EmployeeThunk"

export function EmployeeDashboardSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(HandleEmployeeLogout()).unwrap();
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear localStorage and navigate even if API call fails
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3 p-2">
              <NavLink
                to={"/employee/dashboard/profile"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/dashboard.png" alt="" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Profile</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/employee/dashboard/attendance"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/attendance.png" alt="Attendance" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Attendance</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/employee/dashboard/attendance-history"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/attendance.png" alt="History" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Attendance History</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/employee/dashboard/leave-request"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/leave.png" alt="" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Leave Request</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/employee/dashboard/salary-request"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/salary.png" alt="" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Salary Request</button>
                </SidebarMenuItem>
              </NavLink>

              <NavLink
                to={"/employee/dashboard/salary-history"}
                className={({ isActive }) =>
                  isActive ? "bg-blue-200 rounded-lg" : ""
                }
              >
                <SidebarMenuItem className="flex gap-4 hover:bg-blue-200 rounded-lg">
                  <img src="/../../src/assets/HR-Dashboard/salary.png" alt="" className="w-7 ms-2 my-1"/>
                  <button className="text-[16px]">Salary History</button>
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
          <span className="text-[16px] font-medium">Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}