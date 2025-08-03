import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Loading } from "../../../components/common/loading.jsx"
import { Button } from "../../../components/ui/button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Badge } from "../../../components/ui/badge.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.jsx"
import { apiService } from "../../../redux/apis/apiService.js"

export const EmployeeAttendancePage = () => {
    const [employee, setEmployee] = useState(null)
    const [attendance, setAttendance] = useState(null)
    const [todayStatus, setTodayStatus] = useState("Not Specified")
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [canMarkToday, setCanMarkToday] = useState(true)
    const [message, setMessage] = useState("")

    const today = new Date().toISOString().split('T')[0]

    // Fetch Employee Profile and Attendance
    const fetchData = async () => {
        try {
            // Get employee profile
            const profileRes = await apiService.get('/api/v1/employee/me', {
                withCredentials: true
            });
            
            if (profileRes.data.success) {
                const employeeData = profileRes.data.data;
                setEmployee(employeeData);

                // If employee has attendance record, fetch it
                if (employeeData.attendance) {
                    const attendanceRes = await apiService.get(`/api/v1/attendance/${employeeData.attendance}`, {
                        withCredentials: true
                    });
                    
                    if (attendanceRes.data.success) {
                        const attendanceData = attendanceRes.data.data;
                        setAttendance(attendanceData);
                        
                        // Check if attendance is already marked for today
                        const todayLog = attendanceData.attendancelog.find(
                            log => new Date(log.logdate).toISOString().split('T')[0] === today
                        );
                        
                        if (todayLog) {
                            setTodayStatus(todayLog.logstatus);
                            setCanMarkToday(false);
                            setMessage("Attendance already marked for today");
                        }
                    }
                } else {
                    // Initialize attendance if not exists
                    await initializeAttendance();
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage("Error loading attendance data");
        } finally {
            setLoading(false);
        }
    };

    const initializeAttendance = async () => {
        try {
            const response = await apiService.post('/api/v1/attendance/initialize', {
                employeeID: employee?._id
            }, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setAttendance(response.data.data);
                setMessage("Attendance initialized successfully");
            }
        } catch (error) {
            console.error("Error initializing attendance:", error);
            setMessage("Error initializing attendance");
        }
    };

    const handleMarkAttendance = async (status) => {
        if (!canMarkToday) {
            setMessage("Attendance already marked for today");
            return;
        }

        setUpdating(true);
        try {
            const response = await apiService.patch('/api/v1/attendance/update-attendance', {
                attendanceID: attendance._id,
                status: status,
                currentdate: today
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setTodayStatus(status);
                setCanMarkToday(false);
                setMessage(`Attendance marked as ${status} for today`);
                
                // Refresh attendance data
                await fetchData();
            }
        } catch (error) {
            console.error("Error marking attendance:", error);
            setMessage("Error marking attendance");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div className="attendance-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="attendance-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Mark Attendance</h1>
                <div className="text-sm text-gray-600">
                    Today: {new Date().toLocaleDateString()}
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {message}
                </div>
            )}

            <div className="attendance-data flex flex-col gap-4 md:pe-5">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>Today's Attendance</span>
                            <Badge className={
                                todayStatus === 'Present' ? 'bg-green-100 text-green-800' :
                                todayStatus === 'Absent' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }>
                                {todayStatus}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {canMarkToday ? (
                            <div className="space-y-4">
                                <p className="text-gray-600">Mark your attendance for today:</p>
                                <div className="flex gap-4">
                                    <Button 
                                        onClick={() => handleMarkAttendance('Present')}
                                        disabled={updating}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {updating ? 'Marking...' : 'Mark Present'}
                                    </Button>
                                    <Button 
                                        onClick={() => handleMarkAttendance('Absent')}
                                        disabled={updating}
                                        variant="destructive"
                                    >
                                        {updating ? 'Marking...' : 'Mark Absent'}
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Note: You can only mark attendance once per day.
                                </p>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-lg font-semibold">Attendance Status: {todayStatus}</p>
                                <p className="text-gray-600 mt-2">You have already marked your attendance for today.</p>
                                <p className="text-sm text-gray-500 mt-4">
                                    Come back tomorrow to mark your next attendance.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {attendance && (
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Recent Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {attendance.attendancelog
                                    .sort((a, b) => new Date(b.logdate) - new Date(a.logdate))
                                    .slice(0, 7)
                                    .map((log, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                            <span className="text-sm">{new Date(log.logdate).toLocaleDateString()}</span>
                                            <Badge className={
                                                log.logstatus === 'Present' ? 'bg-green-100 text-green-800' :
                                                log.logstatus === 'Absent' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }>
                                                {log.logstatus}
                                            </Badge>
                                        </div>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}