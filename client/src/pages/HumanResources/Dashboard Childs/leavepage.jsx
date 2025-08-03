import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetAllLeaves, HandleCreateLeave, HandleUpdateLeaveByHR, HandleDeleteLeave } from "../../../redux/Thunks/LeaveThunk.js"
import { fetchEmployeesIDs } from "../../../redux/Thunks/EmployeesIDsThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { Button } from "../../../components/ui/button.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { Textarea } from "../../../components/ui/textarea.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Badge } from "../../../components/ui/badge.jsx"

export const HRLeavePage = () => {
    const dispatch = useDispatch()
    const leaveState = useSelector((state) => state.LeaveReducer)
    const employeesIDState = useSelector((state) => state.EMployeesIDReducer)
    const hrState = useSelector((state) => state.HRReducer)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [selectedLeave, setSelectedLeave] = useState(null)
    
    const [formData, setFormData] = useState({
        employeeID: "",
        startdate: "",
        enddate: "",
        title: "",
        reason: ""
    })

    const [statusUpdate, setStatusUpdate] = useState({
        leaveID: "",
        status: "",
        HRID: ""
    })

    useEffect(() => {
        dispatch(HandleGetAllLeaves())
        dispatch(fetchEmployeesIDs({ apiroute: "GETALL" }))
    }, [])

    useEffect(() => {
        if (leaveState.fetchData) {
            dispatch(HandleGetAllLeaves())
        }
    }, [leaveState.fetchData])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCreateLeave = async (e) => {
        e.preventDefault()
        try {
            await dispatch(HandleCreateLeave(formData)).unwrap()
            setIsCreateDialogOpen(false)
            setFormData({
                employeeID: "",
                startdate: "",
                enddate: "",
                title: "",
                reason: ""
            })
        } catch (error) {
            console.error("Error creating leave:", error)
        }
    }

    const handleStatusUpdate = async (leaveID, newStatus) => {
        try {
            await dispatch(HandleUpdateLeaveByHR({
                leaveID: leaveID,
                status: newStatus,
                HRID: hrState.data?.data?._id
            })).unwrap()
        } catch (error) {
            console.error("Error updating leave status:", error)
        }
    }

    const handleDeleteLeave = async (leaveID) => {
        if (window.confirm("Are you sure you want to delete this leave request?")) {
            try {
                await dispatch(HandleDeleteLeave(leaveID)).unwrap()
            } catch (error) {
                console.error("Error deleting leave:", error)
            }
        }
    }

    const calculateLeaveDays = (startDate, endDate) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        return diffDays
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800'
            case 'Rejected':
                return 'bg-red-100 text-red-800'
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (leaveState.isLoading) {
        return <Loading />
    }

    return (
        <div className="leave-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="leave-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Leave Management</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Create Leave Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Leave Request</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateLeave} className="space-y-4">
                            <div>
                                <Label htmlFor="employeeID">Employee</Label>
                                <Select onValueChange={(value) => handleSelectChange("employeeID", value)}>
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
                            <div>
                                <Label htmlFor="title">Leave Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Annual Leave, Sick Leave"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="startdate">Start Date</Label>
                                <Input
                                    id="startdate"
                                    name="startdate"
                                    type="date"
                                    value={formData.startdate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="enddate">End Date</Label>
                                <Input
                                    id="enddate"
                                    name="enddate"
                                    type="date"
                                    value={formData.enddate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="reason">Reason</Label>
                                <Textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    placeholder="Please provide reason for leave"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Create Leave Request</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="leave-data flex flex-col gap-4 md:pe-5 overflow-auto">
                {leaveState.data && leaveState.data.length > 0 ? (
                    <div className="grid gap-4">
                        {leaveState.data.map((leave) => (
                            <Card key={leave._id} className="w-full">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <div>
                                            <span className="text-lg">{leave.title}</span>
                                            <p className="text-sm text-gray-600 font-normal">
                                                {leave.employee?.firstname} {leave.employee?.lastname} - {leave.employee?.department}
                                            </p>
                                        </div>
                                        <Badge className={getStatusColor(leave.status)}>
                                            {leave.status}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Start Date</p>
                                            <p className="font-semibold">{new Date(leave.startdate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">End Date</p>
                                            <p className="font-semibold">{new Date(leave.enddate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Duration</p>
                                            <p className="font-semibold">{calculateLeaveDays(leave.startdate, leave.enddate)} days</p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600">Reason</p>
                                        <p className="text-sm">{leave.reason}</p>
                                    </div>
                                    {leave.approvedby && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600">Approved/Rejected by</p>
                                            <p className="text-sm">{leave.approvedby.firstname} {leave.approvedby.lastname}</p>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-gray-500">
                                            Applied: {new Date(leave.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2">
                                            {leave.status === 'Pending' && (
                                                <>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                                        onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="text-red-600 border-red-600 hover:bg-red-50"
                                                        onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDeleteLeave(leave._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No leave requests found</p>
                    </div>
                )}
            </div>
        </div>
    )
}