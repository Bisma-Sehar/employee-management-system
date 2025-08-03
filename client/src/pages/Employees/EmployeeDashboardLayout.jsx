import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { EmployeeDashboardSidebar } from "../../components/ui/EmployeeSidebar.jsx"
import { Outlet } from "react-router-dom"
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"

export const EmployeeDashboardLayout = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const pathArray = location.pathname.split("/")

    useEffect(() => {
        // If user is on the base dashboard route, redirect to profile
        if (location.pathname === "/employee/dashboard") {
            navigate("/employee/dashboard/profile")
        }
    }, [location.pathname, navigate])

    return (
        <div className="employee-dashboard-container flex">
            <div className="EmployeeDashboard-sidebar">
                <SidebarProvider>
                    <EmployeeDashboardSidebar />
                    <div className="sidebar-container min-[250px]:absolute md:relative">
                        <SidebarTrigger />
                    </div>
                </SidebarProvider>
            </div>
            <div className="employee-dashboard-container h-screen w-full min-[250px]:mx-1 md:mx-2 flex flex-col">
                <Outlet />
            </div>
        </div>
    )
}