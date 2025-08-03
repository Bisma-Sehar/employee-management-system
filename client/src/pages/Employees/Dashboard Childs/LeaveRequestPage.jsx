import { useEffect, useState } from "react"
import { Loading } from "../../../components/common/loading.jsx"
import { Button } from "../../../components/ui/button.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Badge } from "../../../components/ui/badge.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { Textarea } from "../../../components/ui/textarea.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog.jsx"
import { apiService } from "../../../redux/apis/apiService.js"

export const EmployeeLeaveRequestPage = () => {
    const [employee, setEmployee] = useState(null)
    const [leaves, setLeaves] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [canRequestToday, setCanRequestToday] = useState(true)
    const [message, setMessage] = useState("")
    
    const [formData, setFormData] = useState({
        startdate: "",
        enddate: "",
        title: "",
        reason: ""
    })

    const today = new Date().toISOString().split('T')[0]

    // Fetch Employee Profile and Leaves
    const fetchData = async () => {
        try {
            // Get employee profile
            const profileRes = await apiService.get('/api/v1/employee/me', {
                withCredentials: true
            });
            
            if (profileRes.data.success) {
                const employeeData = profileRes.data.data;
                setEmployee(employeeData);

                // Get employee's leave requests
                const leavesRes = await apiService.get('/api/v1/leave/all', {
                    withCredentials: true
                });
                
                if (leavesRes.data.success) {
                    // Filter leaves for current employee
                    const employeeLeaves = leavesRes.data.data.filter(
                        leave => leave.employee._id === employeeData._id
                    );
                    setLeaves(employeeLeaves);
                    
                    // Check if leave request was already made today
                    const todayRequest = employeeLeaves.find(
                        leave => new Date(leave.createdAt).toISOString().split('T')[0] === today
                    );
                    
                    if (todayRequest) {
                        setCanRequestToday(false);
                        setMessage("You have already submitted a leave request today");
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage("Error loading leave data");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const { startdate, enddate, title, reason } = formData;
        
        if (!startdate || !enddate || !title || !reason) {
            setMessage("All fields are required");
            return false;
        }
        
        const start = new Date(startdate);
        const end = new Date(enddate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (start < today) {
            setMessage("Start date cannot be in the past");
            return false;
        }
        
        if (end < start) {
            setMessage("End date cannot be before start date");
            return false;
        }
        
        if (reason.length < 10) {
            setMessage("Reason must be at least 10 characters long");
            return false;
        }
        
        return true;
    };

    const handleSubmitLeave = async (e) => {
        e.preventDefault();
        
        if (!canRequestToday) {
            setMessage("You can only submit one leave request per day");
            return;
        }
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        try {
            const response = await apiService.post('/api/v1/leave/create-leave', {
                employeeID: employee._id,
                ...formData
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setMessage("Leave request submitted successfully");
                setIsDialogOpen(false);
                setCanRequestToday(false);
                setFormData({
                    startdate: "",
                    enddate: "",
                    title: "",
                    reason: ""
                });
                
                // Refresh data
                await fetchData();
            }
        } catch (error) {
            console.error("Error submitting leave request:", error);
            setMessage(error.response?.data?.message || "Error submitting leave request");
        } finally {
            setSubmitting(false);
        }
    };

    const calculateLeaveDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div className="leave-request-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="leave-request-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Leave Requests</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={!canRequestToday}
                        >
                            Request Leave
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Submit Leave Request</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmitLeave} className="space-y-4">
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
                                    min={new Date().toISOString().split('T')[0]}
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
                                    min={formData.startdate || new Date().toISOString().split('T')[0]}
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
                                    placeholder="Please provide detailed reason for leave (minimum 10 characters)"
                                    required
                                    minLength={10}
                                />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Leave Request'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.includes('Error') || message.includes('cannot') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {message}
                </div>
            )}

            <div className="leave-request-data flex flex-col gap-4 md:pe-5 overflow-auto">
                {leaves && leaves.length > 0 ? (
                    <div className="grid gap-4">
                        {leaves
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((leave) => (
                                <Card key={leave._id} className="w-full">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <div>
                                                <span className="text-lg">{leave.title}</span>
                                                <p className="text-sm text-gray-600 font-normal">
                                                    Submitted: {new Date(leave.createdAt).toLocaleDateString()}
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
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    {leave.status === 'Approved' ? 'Approved by' : 'Rejected by'}
                                                </p>
                                                <p className="text-sm font-medium">
                                                    {leave.approvedby.firstname} {leave.approvedby.lastname}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No leave requests found</p>
                        <p className="text-sm text-gray-400 mt-2">Submit your first leave request using the button above</p>
                    </div>
                )}
            </div>
        </div>
    )
}