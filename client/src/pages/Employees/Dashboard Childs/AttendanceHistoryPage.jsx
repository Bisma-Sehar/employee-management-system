import { useEffect, useState } from "react"
import { Loading } from "../../../components/common/loading.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Badge } from "../../../components/ui/badge.jsx"
import { Button } from "../../../components/ui/button.jsx"
import { apiService } from "../../../redux/apis/apiService.js"

export const EmployeeAttendanceHistoryPage = () => {
    const [attendance, setAttendance] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [calendarData, setCalendarData] = useState([])

    // Fetch Employee Attendance
    const fetchAttendance = async () => {
        try {
            // Get employee profile first
            const profileRes = await apiService.get('/api/v1/employee/me', {
                withCredentials: true
            });
            
            if (profileRes.data.success && profileRes.data.data.attendance) {
                const attendanceRes = await apiService.get(`/api/v1/attendance/${profileRes.data.data.attendance}`, {
                    withCredentials: true
                });
                
                if (attendanceRes.data.success) {
                    setAttendance(attendanceRes.data.data);
                    generateCalendarData(attendanceRes.data.data.attendancelog);
                }
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateCalendarData = (attendanceLog) => {
        const year = selectedYear;
        const month = selectedMonth;
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
        
        const calendar = [];
        const currentDate = new Date(startDate);
        
        // Generate 6 weeks (42 days) to cover the entire month view
        for (let i = 0; i < 42; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const attendanceRecord = attendanceLog.find(
                log => new Date(log.logdate).toISOString().split('T')[0] === dateStr
            );
            
            calendar.push({
                date: new Date(currentDate),
                dateStr: dateStr,
                isCurrentMonth: currentDate.getMonth() === month,
                isToday: dateStr === new Date().toISOString().split('T')[0],
                status: attendanceRecord ? attendanceRecord.logstatus : null
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setCalendarData(calendar);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present':
                return 'bg-green-500 text-white';
            case 'Absent':
                return 'bg-red-500 text-white';
            case 'Not Specified':
                return 'bg-gray-400 text-white';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getAttendanceStats = () => {
        if (!attendance) return { present: 0, absent: 0, total: 0, rate: 0 };
        
        const monthLogs = attendance.attendancelog.filter(log => {
            const logDate = new Date(log.logdate);
            return logDate.getMonth() === selectedMonth && logDate.getFullYear() === selectedYear;
        });
        
        const present = monthLogs.filter(log => log.logstatus === 'Present').length;
        const absent = monthLogs.filter(log => log.logstatus === 'Absent').length;
        const total = monthLogs.length;
        const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
        
        return { present, absent, total, rate };
    };

    const changeMonth = (direction) => {
        let newMonth = selectedMonth + direction;
        let newYear = selectedYear;
        
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }
        
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    useEffect(() => {
        if (attendance) {
            generateCalendarData(attendance.attendancelog);
        }
    }, [selectedMonth, selectedYear, attendance]);

    if (loading) {
        return <Loading />
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const stats = getAttendanceStats();

    return (
        <div className="attendance-history-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="attendance-history-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Attendance History</h1>
            </div>

            <div className="attendance-history-data flex flex-col gap-4 md:pe-5">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                                <p className="text-sm text-gray-600">Present Days</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                                <p className="text-sm text-gray-600">Absent Days</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                                <p className="text-sm text-gray-600">Total Days</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600">{stats.rate}%</p>
                                <p className="text-sm text-gray-600">Attendance Rate</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <Button 
                                variant="outline" 
                                onClick={() => changeMonth(-1)}
                                className="px-3 py-1"
                            >
                                ←
                            </Button>
                            <span className="text-xl font-bold">
                                {monthNames[selectedMonth]} {selectedYear}
                            </span>
                            <Button 
                                variant="outline" 
                                onClick={() => changeMonth(1)}
                                className="px-3 py-1"
                            >
                                →
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {dayNames.map(day => (
                                <div key={day} className="text-center font-semibold text-gray-600 p-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendarData.map((day, index) => (
                                <div
                                    key={index}
                                    className={`
                                        relative p-2 text-center border rounded-lg min-h-[60px] flex flex-col justify-center
                                        ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                                        ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                                    `}
                                >
                                    <div className="text-sm font-medium">
                                        {day.date.getDate()}
                                    </div>
                                    {day.status && day.isCurrentMonth && (
                                        <div className="mt-1">
                                            <Badge 
                                                size="sm" 
                                                className={`text-xs ${getStatusColor(day.status)}`}
                                            >
                                                {day.status === 'Present' ? 'P' : 
                                                 day.status === 'Absent' ? 'A' : 'NS'}
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span>Present</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded"></div>
                                <span>Absent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                <span>Not Specified</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}