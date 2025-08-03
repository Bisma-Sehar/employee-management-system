import { useEffect, useState } from "react"
import { Loading } from "../../../components/common/loading.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Badge } from "../../../components/ui/badge.jsx"
import { apiService } from "../../../redux/apis/apiService.js"

export const EmployeeSalaryHistoryPage = () => {
    const [employee, setEmployee] = useState(null)
    const [salaries, setSalaries] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalEarned: 0,
        averageSalary: 0,
        lastPayment: null,
        pendingAmount: 0
    })

    // Fetch Employee Profile and Salary History
    const fetchData = async () => {
        try {
            // Get employee profile
            const profileRes = await apiService.get('/api/v1/employee/me', {
                withCredentials: true
            });
            
            if (profileRes.data.success) {
                const employeeData = profileRes.data.data;
                setEmployee(employeeData);

                // Get employee's salary records
                try {
                    const salaryRes = await apiService.get('/api/v1/salary/all', {
                        withCredentials: true
                    });
                    
                    if (salaryRes.data.success) {
                        // Filter salary records for current employee
                        const employeeSalaries = salaryRes.data.data.filter(
                            salary => salary.employee._id === employeeData._id
                        );
                        setSalaries(employeeSalaries);
                        calculateStats(employeeSalaries);
                    }
                } catch (error) {
                    console.log("Salary data not accessible for employee");
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (salaryData) => {
        if (!salaryData || salaryData.length === 0) {
            return;
        }

        const paidSalaries = salaryData.filter(s => s.status === 'Paid');
        const pendingSalaries = salaryData.filter(s => s.status === 'Pending');
        
        const totalEarned = paidSalaries.reduce((sum, s) => sum + s.netpay, 0);
        const averageSalary = paidSalaries.length > 0 ? totalEarned / paidSalaries.length : 0;
        const pendingAmount = pendingSalaries.reduce((sum, s) => sum + s.netpay, 0);
        
        // Find last payment
        const lastPayment = paidSalaries
            .filter(s => s.paymentdate)
            .sort((a, b) => new Date(b.paymentdate) - new Date(a.paymentdate))[0];

        setStats({
            totalEarned,
            averageSalary,
            lastPayment,
            pendingAmount
        });
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div className="salary-history-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="salary-history-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Salary History</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(stats.totalEarned)}
                            </p>
                            <p className="text-sm text-gray-600">Total Earned</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(stats.averageSalary)}
                            </p>
                            <p className="text-sm text-gray-600">Average Salary</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                                {formatCurrency(stats.pendingAmount)}
                            </p>
                            <p className="text-sm text-gray-600">Pending Amount</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">
                                {stats.lastPayment 
                                    ? new Date(stats.lastPayment.paymentdate).toLocaleDateString()
                                    : 'N/A'
                                }
                            </p>
                            <p className="text-sm text-gray-600">Last Payment</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="salary-history-data flex flex-col gap-4 md:pe-5 overflow-auto">
                {salaries && salaries.length > 0 ? (
                    <div className="grid gap-4">
                        {salaries
                            .sort((a, b) => new Date(b.duedate) - new Date(a.duedate))
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
                                                <p className="font-semibold text-lg">
                                                    {formatCurrency(salary.basicpay)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Bonuses</p>
                                                <p className="font-semibold text-green-600">
                                                    +{formatCurrency(salary.bonuses)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Deductions</p>
                                                <p className="font-semibold text-red-600">
                                                    -{formatCurrency(salary.deductions)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Net Pay</p>
                                                <p className="font-bold text-xl">
                                                    {formatCurrency(salary.netpay)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div>
                                                <p><strong>Currency:</strong> {salary.currency}</p>
                                                <p><strong>Created:</strong> {new Date(salary.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                {salary.paymentdate && (
                                                    <p><strong>Paid:</strong> {new Date(salary.paymentdate).toLocaleDateString()}</p>
                                                )}
                                                {salary.status === 'Pending' && (
                                                    <p className="text-yellow-600"><strong>Status:</strong> Awaiting payment</p>
                                                )}
                                                {salary.status === 'Delayed' && (
                                                    <p className="text-red-600"><strong>Status:</strong> Payment delayed</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Payment Timeline */}
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        salary.status === 'Paid' ? 'bg-green-500' :
                                                        salary.status === 'Delayed' ? 'bg-red-500' :
                                                        'bg-yellow-500'
                                                    }`}></div>
                                                    <span className="text-gray-600">
                                                        {salary.status === 'Paid' ? 'Payment Completed' :
                                                         salary.status === 'Delayed' ? 'Payment Delayed' :
                                                         'Payment Pending'}
                                                    </span>
                                                </div>
                                                {salary.status === 'Pending' && (
                                                    <span className="text-gray-500">
                                                        Expected: {new Date(salary.duedate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No salary records found</p>
                        <p className="text-sm text-gray-400 mt-2">Your salary history will appear here once HR processes your salary</p>
                    </div>
                )}
            </div>
        </div>
    )
}