import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Loading } from "../../../components/common/loading.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"

export const EmployeeProfilePage = () => {
    const [employee, setEmployee] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch Employee Profile
    const fetchProfile = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_EMPLOYEE_API}/api/v1/employee/me`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setEmployee(data.data || null);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div className="profile-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="profile-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Employee Profile</h1>
            </div>

            <div className="profile-data flex flex-col gap-4 md:pe-5">
                {employee ? (
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600">First Name</p>
                                    <p className="font-semibold text-lg">{employee.firstname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Last Name</p>
                                    <p className="font-semibold text-lg">{employee.lastname}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold">{employee.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Contact Number</p>
                                    <p className="font-semibold">{employee.contactnumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Department</p>
                                    <p className="font-semibold">{employee.department?.name || "Not Assigned"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Role</p>
                                    <p className="font-semibold">{employee.role || "Employee"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Employee ID</p>
                                    <p className="font-semibold">{employee._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Joined Date</p>
                                    <p className="font-semibold">{new Date(employee.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No profile data available</p>
                    </div>
                )}
            </div>
        </div>
    )
}