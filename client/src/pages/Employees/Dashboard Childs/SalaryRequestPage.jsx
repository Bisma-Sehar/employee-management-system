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

export const EmployeeSalaryRequestPage = () => {
    const [employee, setEmployee] = useState(null)
    const [salaryRequests, setSalaryRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [canRequestThisMonth, setCanRequestThisMonth] = useState(true)
    const [message, setMessage] = useState("")
    
    const [formData, setFormData] = useState({
        requestedAmount: "",
        currentSalary: "",
        reason: "",
        effectiveDate: ""
    })

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    // Fetch Employee Profile and Salary Requests
    const fetchData = async () => {
        try {
            // Get employee profile
            const profileRes = await apiService.get('/api/v1/employee/me', {
                withCredentials: true
            });
            
            if (profileRes.data.success) {
                const employeeData = profileRes.data.data;
                setEmployee(employeeData);

                // Get employee's salary records (this would be salary requests in a real system)
                // For now, we'll simulate this with the existing salary endpoint
                try {
                    const salaryRes = await apiService.get('/api/v1/salary/all', {
                        withCredentials: true
                    });
                    
                    if (salaryRes.data.success) {
                        // Filter salary records for current employee
                        const employeeSalaries = salaryRes.data.data.filter(
                            salary => salary.employee._id === employeeData._id
                        );
                        setSalaryRequests(employeeSalaries);
                        
                        // Check if salary request was already made this month
                        const thisMonthRequest = employeeSalaries.find(salary => {
                            const salaryDate = new Date(salary.createdAt);
                            return salaryDate.getMonth() === currentMonth && 
                                   salaryDate.getFullYear() === currentYear;
                        });
                        
                        if (thisMonthRequest) {
                            setCanRequestThisMonth(false);
                            setMessage("You have already submitted a salary request this month");
                        }
                    }
                } catch (error) {
                    // If salary endpoint is not accessible for employees, that's fine
                    console.log("Salary data not accessible for employee");
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage("Error loading salary data");
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
        const { requestedAmount, currentSalary, reason, effectiveDate } = formData;
        
        if (!requestedAmount || !currentSalary || !reason || !effectiveDate) {
            setMessage("All fields are required");
            return false;
        }
        
        const requested = parseFloat(requestedAmount);
        const current = parseFloat(currentSalary);
        
        if (isNaN(requested) || isNaN(current) || requested <= 0 || current <= 0) {
            setMessage("Please enter valid salary amounts");
            return false;
        }
        
        if (requested <= current) {
            setMessage("Requested salary must be higher than current salary");
            return false;
        }
        
        const effectiveDateObj = new Date(effectiveDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (effectiveDateObj < today) {
            setMessage("Effective date cannot be in the past");
            return false;
        }
        
        if (reason.length < 20) {
            setMessage("Reason must be at least 20 characters long");
            return false;
        }
        
        return true;
    };

    const handleSubmitSalaryRequest = async (e) => {
        e.preventDefault();
        
        if (!canRequestThisMonth) {
            setMessage("You can only submit one salary request per month");
            return;
        }
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        try {
            // In a real system, this would be a salary request endpoint
            // For now, we'll simulate it by creating a salary record with pending status
            const response = await apiService.post('/api/v1/salary/create-salary', {
                employeeID: employee._id,
                basicpay: parseFloat(formData.requestedAmount),
                bonusePT: 0, // No bonus for request
                deductionPT: 0, // No deduction for request
                duedate: formData.effectiveDate,
                currency: "USD",
                status: "Pending",
                isRequest: true, // Flag to indicate this is a request
                requestReason: formData.reason,
                currentSalary: parseFloat(formData.currentSalary)
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setMessage("Salary request submitted successfully");
                setIsDialogOpen(false);
                setCanRequestThisMonth(false);
                setFormData({
                    requestedAmount: "",
                    currentSalary: "",
                    reason: "",
                    effectiveDate: ""
                });
                
                // Refresh data
                await fetchData();
            }
        } catch (error) {
            console.error("Error submitting salary request:", error);
            setMessage(error.response?.data?.message || "Error submitting salary request");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'bg-green-100 text-green-800';
            case 'Delayed':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const calculateIncrease = (current, requested) => {
        const increase = requested - current;
        const percentage = ((increase / current) * 100).toFixed(1);
        return { increase, percentage };
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <Loading />
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="salary-request-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="salary-request-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Salary Request</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={!canRequestThisMonth}
                        >
                            Request Salary Increase
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Submit Salary Request</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmitSalaryRequest} className="space-y-4">
                            <div>
                                <Label htmlFor="currentSalary">Current Salary</Label>
                                <Input
                                    id="currentSalary"
                                    name="currentSalary"
                                    type="number"
                                    step="0.01"
                                    value={formData.currentSalary}
                                    onChange={handleInputChange}
                                    placeholder="Enter your current salary"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="requestedAmount">Requested Salary</Label>
                                <Input
                                    id="requestedAmount"
                                    name="requestedAmount"
                                    type="number"
                                    step="0.01"
                                    value={formData.requestedAmount}
                                    onChange={handleInputChange}
                                    placeholder="Enter requested salary amount"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="effectiveDate">Effective Date</Label>
                                <Input
                                    id="effectiveDate"
                                    name="effectiveDate"
                                    type="date"
                                    value={formData.effectiveDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="reason">Justification</Label>
                                <Textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    placeholder="Please provide detailed justification for salary increase (minimum 20 characters)"
                                    required
                                    minLength={20}
                                />
                            </div>
                            {formData.currentSalary && formData.requestedAmount && (
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Increase:</strong> ${(parseFloat(formData.requestedAmount) - parseFloat(formData.currentSalary)).toFixed(2)} 
                                        ({(((parseFloat(formData.requestedAmount) - parseFloat(formData.currentSalary)) / parseFloat(formData.currentSalary)) * 100).toFixed(1)}%)
                                    </p>
                                </div>
                            )}
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit Salary Request'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.includes('Error') || message.includes('cannot') || message.includes('must') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {message}
                </div>
            )}

            <div className="salary-request-info p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Salary Request Guidelines</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• You can only submit one salary request per month</li>
                    <li>• Current month: {monthNames[currentMonth]} {currentYear}</li>
                    <li>• Provide detailed justification for your request</li>
                    <li>• Requests are reviewed by HR and management</li>
                    <li>• Processing time is typically 2-4 weeks</li>
                </ul>
            </div>

            <div className="salary-request-data flex flex-col gap-4 md:pe-5 overflow-auto">
                {salaryRequests && salaryRequests.length > 0 ? (
                    <div className="grid gap-4">
                        {salaryRequests
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((salary) => (
                                <Card key={salary._id} className="w-full">
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-center">
                                            <div>
                                                <span className="text-lg">Salary Record</span>
                                                <p className="text-sm text-gray-600 font-normal">
                                                    Due: {new Date(salary.duedate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge className={getStatusColor(salary.status)}>
                                                {salary.status}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Basic Pay</p>
                                                <p className="font-semibold text-lg">${salary.basicpay}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Bonuses</p>
                                                <p className="font-semibold text-green-600">+${salary.bonuses}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Deductions</p>
                                                <p className="font-semibold text-red-600">-${salary.deductions}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Net Pay</p>
                                                <p className="font-bold text-lg">${salary.netpay}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>Created: {new Date(salary.createdAt).toLocaleDateString()}</p>
                                            {salary.paymentdate && (
                                                <p>Paid: {new Date(salary.paymentdate).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No salary records found</p>
                        <p className="text-sm text-gray-400 mt-2">Submit your first salary request using the button above</p>
                    </div>
                )}
            </div>
        </div>
    )
}