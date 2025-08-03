import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetAllAttendance, HandleInitializeAttendance, HandleUpdateAttendance, HandleDeleteAttendance } from "../../../redux/Thunks/AttendanceThunk.js"
import { fetchEmployeesIDs } from "../../../redux/Thunks/EmployeesIDsThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { Button } from "../../../components/ui/button.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Badge } from "../../../components/ui/badge.jsx"

export const HRAttendancePage = () => {
    const dispatch = useDispatch()
    const attendanceState = useSelector((state) => state.AttendanceReducer)
    const employeesIDState = useSelector((state) => state.EMployeesIDReducer)
    const [isInitializeDialogOpen, setIsInitializeDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [selectedAttendance, setSelectedAttendance] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date())
    
    const [initializeData, setInitializeData] = useState({
        employeeID: ""
    })

    const [updateData, setUpdateData] = useState({
        attendanceID: "",
        status: "",
        currentdate: ""
    })

    useEffect(() => {
        dispatch(HandleGetAllAttendance())
        dispatch(fetchEmployeesIDs({ apiroute: "GETALL" }))
    }, [])

    useEffect(() => {
        if (attendanceState.fetchData) {
            dispatch(HandleGetAllAttendance())
        }
    }, [attendanceState.fetchData])

    const handleInitializeAttendance = async (e) => {
        e.preventDefault()
        try {
            await dispatch(HandleInitializeAttendance(initializeData)).unwrap()
            setIsInitializeDialogOpen(false)
            setInitializeData({ employeeID: "" })
        } catch (error) {
            console.error("Error initializing attendance:", error)
        }
    }

    const handleUpdateAttendance = async (attendanceID, status, date) => {
        try {
            await dispatch(HandleUpdateAttendance({
                attendanceID: attendanceID,
                status: status,
                currentdate: date
            })).unwrap()
        } catch (error) {
            console.error("Error updating attendance:", error)
        }
    }

    const handleDeleteAttendance = async (attendanceID) => {
        if (window.confirm("Are you sure you want to delete this attendance record?")) {
            try {
                await dispatch(HandleDeleteAttendance(attendanceID)).unwrap()
            } catch (error) {
                console.error("Error deleting attendance:", error)
            }
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present':
                return 'bg-green-100 text-green-800'
            case 'Absent':
                return 'bg-red-100 text-red-800'
            case 'Not Specified':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatDate = (date) => {
        return new Date(date).toISOString().split('T')[0]
    }

    const getTodayAttendanceStatus = (attendanceLog) => {
        const today = formatDate(new Date())
        const todayLog = attendanceLog.find(log => formatDate(log.logdate) === today)
        return todayLog ? todayLog.logstatus : 'Not Specified'
    }

    const getAttendanceStats = (attendanceLog) => {
        const present = attendanceLog.filter(log => log.logstatus === 'Present').length
        const absent = attendanceLog.filter(log => log.logstatus === 'Absent').length
        const total = attendanceLog.length
        return { present, absent, total }
    }

    if (attendanceState.isLoading) {
        return <Loading />
    }

    return (
        <div className="attendance-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="attendance-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Attendance Management</h1>
                <Dialog open={isInitializeDialogOpen} onOpenChange={setIsInitializeDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Initialize Attendance
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Initialize Employee Attendance</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleInitializeAttendance} className="space-y-4">
                            <div>
                                <Label htmlFor="employeeID">Employee</Label>
                                <Select onValueChange={(value) => setInitializeData({ employeeID: value })}>
                                    <SelectValue placeholder="Select Employee" />
                                    <SelectContent>
                                        {employeesIDState.data?.map((employee) => (
                                            <SelectItem key={employee._id} value={employee._id}>
                                                {employee.firstname} {employee.lastname}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Initialize Attendance</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="attendance-data flex flex-col gap-4 md:pe-5 overflow-auto">
                {attendanceState.data && attendanceState.data.length > 0 ? (
                    <div className="grid gap-4">
                        {attendanceState.data.map((attendance) => {
                            const stats = getAttendanceStats(attendance.attendancelog)
                            const todayStatus = getTodayAttendanceStatus(attendance.attendancelog)
                            
                            return (
                                <Card key={attendance._id} className="w-full">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <div>
                                                <span className="text-lg">
                                                    {attendance.employee?.firstname} {attendance.employee?.lastname}
                                                </span>
                                                <p className="text-sm text-gray-600 font-normal">
                                                    {attendance.employee?.department}
                                                </p>
                                            </div>
                                            <Badge className={getStatusColor(todayStatus)}>
                                                Today: {todayStatus}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Total Days</p>
                                                <p className="font-semibold text-lg">{stats.total}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Present</p>
                                                <p className="font-semibold text-lg text-green-600">{stats.present}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Absent</p>
                                                <p className="font-semibold text-lg text-red-600">{stats.absent}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Attendance Rate</p>
                                                <p className="font-semibold text-lg">
                                                    {stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-2">Recent Attendance Log</p>
                                            <div className="max-h-32 overflow-y-auto">
                                                {attendance.attendancelog
                                                    .sort((a, b) => new Date(b.logdate) - new Date(a.logdate))
                                                    .slice(0, 5)
                                                    .map((log, index) => (
                                                        <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                                                            <span className="text-sm">{new Date(log.logdate).toLocaleDateString()}</span>
                                                            <Badge size="sm" className={getStatusColor(log.logstatus)}>
                                                                {log.logstatus}
                                                            </Badge>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                                    onClick={() => handleUpdateAttendance(attendance._id, 'Present', formatDate(new Date()))}
                                                >
                                                    Mark Present
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                                    onClick={() => handleUpdateAttendance(attendance._id, 'Absent', formatDate(new Date()))}
                                                >
                                                    Mark Absent
                                                </Button>
                                            </div>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDeleteAttendance(attendance._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No attendance records found</p>
                        <p className="text-sm text-gray-400 mt-2">Initialize attendance for employees to start tracking</p>
                    </div>
                )}
            </div>
        </div>
    )
}