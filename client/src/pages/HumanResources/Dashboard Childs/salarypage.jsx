import { ListWrapper } from "../../../components/common/Dashboard/ListDesigns"
import { HeadingBar } from "../../../components/common/Dashboard/ListDesigns"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { HandleGetAllSalaries } from "../../../redux/Thunks/SalaryThunk.js"
import { Loading } from "../../../components/common/loading.jsx"
import { ListItems } from "../../../components/common/Dashboard/ListDesigns"
import { ListContainer } from "../../../components/common/Dashboard/ListDesigns"
import { Button } from "../../../components/ui/button.jsx"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog.jsx"
import { Input } from "../../../components/ui/input.jsx"
import { Label } from "../../../components/ui/label.jsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.jsx"
import { HandleCreateSalary, HandleUpdateSalary, HandleDeleteSalary } from "../../../redux/Thunks/SalaryThunk.js"
import { fetchEmployeesIDs } from "../../../redux/Thunks/EmployeesIDsThunk.js"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card.jsx"
import { Badge } from "../../../components/ui/badge.jsx"

export const HRSalaryPage = () => {
    const dispatch = useDispatch()
    const salaryState = useSelector((state) => state.SalaryReducer)
    const employeesIDState = useSelector((state) => state.EMployeesIDReducer)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [selectedSalary, setSelectedSalary] = useState(null)
    
    const [formData, setFormData] = useState({
        employeeID: "",
        basicpay: "",
        bonusePT: "",
        deductionPT: "",
        duedate: "",
        currency: "USD",
        status: "Pending"
    })

    const table_headings = ["Employee", "Basic Pay", "Bonuses", "Deductions", "Net Pay", "Due Date", "Status", "Actions"]

    useEffect(() => {
        dispatch(HandleGetAllSalaries())
        dispatch(fetchEmployeesIDs({ apiroute: "GETALL" }))
    }, [])

    useEffect(() => {
        if (salaryState.fetchData) {
            dispatch(HandleGetAllSalaries())
        }
    }, [salaryState.fetchData])

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

    const handleCreateSalary = async (e) => {
        e.preventDefault()
        try {
            await dispatch(HandleCreateSalary(formData)).unwrap()
            setIsCreateDialogOpen(false)
            setFormData({
                employeeID: "",
                basicpay: "",
                bonusePT: "",
                deductionPT: "",
                duedate: "",
                currency: "USD",
                status: "Pending"
            })
        } catch (error) {
            console.error("Error creating salary:", error)
        }
    }

    const handleUpdateSalary = async (e) => {
        e.preventDefault()
        try {
            await dispatch(HandleUpdateSalary({
                salaryID: selectedSalary._id,
                ...formData
            })).unwrap()
            setIsUpdateDialogOpen(false)
            setSelectedSalary(null)
        } catch (error) {
            console.error("Error updating salary:", error)
        }
    }

    const handleDeleteSalary = async (salaryID) => {
        if (window.confirm("Are you sure you want to delete this salary record?")) {
            try {
                await dispatch(HandleDeleteSalary(salaryID)).unwrap()
            } catch (error) {
                console.error("Error deleting salary:", error)
            }
        }
    }

    const openUpdateDialog = (salary) => {
        setSelectedSalary(salary)
        setFormData({
            employeeID: salary.employee._id,
            basicpay: salary.basicpay,
            bonusePT: (salary.bonuses / salary.basicpay * 100).toFixed(2),
            deductionPT: (salary.deductions / salary.basicpay * 100).toFixed(2),
            duedate: new Date(salary.duedate).toISOString().split('T')[0],
            currency: salary.currency,
            status: salary.status
        })
        setIsUpdateDialogOpen(true)
    }

    if (salaryState.isLoading) {
        return <Loading />
    }

    return (
        <div className="salary-page-content w-full mx-auto my-10 flex flex-col gap-5 h-[94%]">
            <div className="salary-heading flex justify-between items-center md:pe-5">
                <h1 className="min-[250px]:text-xl md:text-4xl font-bold">Salary Management</h1>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Create Salary
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Salary Record</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateSalary} className="space-y-4">
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
                                <Label htmlFor="basicpay">Basic Pay</Label>
                                <Input
                                    id="basicpay"
                                    name="basicpay"
                                    type="number"
                                    value={formData.basicpay}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="bonusePT">Bonus Percentage</Label>
                                <Input
                                    id="bonusePT"
                                    name="bonusePT"
                                    type="number"
                                    step="0.01"
                                    value={formData.bonusePT}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="deductionPT">Deduction Percentage</Label>
                                <Input
                                    id="deductionPT"
                                    name="deductionPT"
                                    type="number"
                                    step="0.01"
                                    value={formData.deductionPT}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="duedate">Due Date</Label>
                                <Input
                                    id="duedate"
                                    name="duedate"
                                    type="date"
                                    value={formData.duedate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="currency">Currency</Label>
                                <Select onValueChange={(value) => handleSelectChange("currency", value)} defaultValue="USD">
                                    <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="PKR">PKR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Create Salary</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="salary-data flex flex-col gap-4 md:pe-5 overflow-auto">
                {salaryState.data && salaryState.data.length > 0 ? (
                    <div className="grid gap-4">
                        {salaryState.data.map((salary) => (
                            <Card key={salary._id} className="w-full">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{salary.employee?.firstname} {salary.employee?.lastname}</span>
                                        <Badge variant={
                                            salary.status === 'Paid' ? 'success' : 
                                            salary.status === 'Delayed' ? 'destructive' : 'secondary'
                                        }>
                                            {salary.status}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Basic Pay</p>
                                            <p className="font-semibold">{salary.currency} {salary.basicpay}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Bonuses</p>
                                            <p className="font-semibold text-green-600">+{salary.currency} {salary.bonuses}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Deductions</p>
                                            <p className="font-semibold text-red-600">-{salary.currency} {salary.deductions}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Net Pay</p>
                                            <p className="font-bold text-lg">{salary.currency} {salary.netpay}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-600">
                                            Due: {new Date(salary.duedate).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => openUpdateDialog(salary)}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDeleteSalary(salary._id)}
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
                        <p className="text-gray-500">No salary records found</p>
                    </div>
                )}
            </div>

            {/* Update Dialog */}
            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Salary Record</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateSalary} className="space-y-4">
                        <div>
                            <Label htmlFor="basicpay">Basic Pay</Label>
                            <Input
                                id="basicpay"
                                name="basicpay"
                                type="number"
                                value={formData.basicpay}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="bonusePT">Bonus Percentage</Label>
                            <Input
                                id="bonusePT"
                                name="bonusePT"
                                type="number"
                                step="0.01"
                                value={formData.bonusePT}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="deductionPT">Deduction Percentage</Label>
                            <Input
                                id="deductionPT"
                                name="deductionPT"
                                type="number"
                                step="0.01"
                                value={formData.deductionPT}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="duedate">Due Date</Label>
                            <Input
                                id="duedate"
                                name="duedate"
                                type="date"
                                value={formData.duedate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select onValueChange={(value) => handleSelectChange("status", value)} value={formData.status}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Delayed">Delayed</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full">Update Salary</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}