"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Plus, Search, Users, Mail, Phone, Pencil, Trash2, Eye, FileText, Calendar, CreditCard, Clock } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

const initialEmployees = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    joinDate: "2023-01-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@company.com",
    phone: "+1 (555) 234-5678",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Active",
    joinDate: "2022-08-20",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@company.com",
    phone: "+1 (555) 345-6789",
    department: "HR",
    position: "HR Specialist",
    status: "On Leave",
    joinDate: "2023-03-10",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "On Leave":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Inactive":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export default function EmployeesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [employeeList, setEmployeeList] = useState(initialEmployees)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    position: ""
  })

  const filteredEmployees = employeeList.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [detailsTab, setDetailsTab] = useState("overview")

  const handleSaveEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast({ title: "Error", description: "Name and Email are required", variant: "destructive" })
      return
    }

    if (selectedEmployee) {
      // Edit Mode
      setEmployeeList(prev => prev.map(emp =>
        emp.id === selectedEmployee.id
          ? { ...emp, ...newEmployee }
          : emp
      ))
      toast({ title: "Success", description: "Employee updated successfully" })
    } else {
      // Add Mode
      const id = employeeList.length + 1
      const currentDate = new Date().toISOString().split('T')[0]
      const addedEmployee = {
        id,
        name: newEmployee.name,
        email: newEmployee.email,
        phone: "+1 (555) 000-0000",
        department: newEmployee.department,
        position: newEmployee.position,
        status: "Active",
        joinDate: currentDate,
        avatar: "/placeholder.svg?height=32&width=32"
      }
      setEmployeeList([...employeeList, addedEmployee])
      toast({ title: "Success", description: "Employee added successfully" })
    }

    setShowAddModal(false)
    setNewEmployee({ name: "", email: "", department: "", position: "" })
    setSelectedEmployee(null)
  }

  const openAddModal = () => {
    setSelectedEmployee(null)
    setNewEmployee({ name: "", email: "", department: "", position: "" })
    setShowAddModal(true)
  }

  const openEditModal = (employee: any) => {
    setSelectedEmployee(employee)
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position
    })
    setShowAddModal(true)
  }

  const openDetails = (employee: any, tab: string) => {
    setSelectedEmployee(employee)
    setDetailsTab(tab)
    setShowDetailsModal(true)
  }

  const toggleStatus = (id: number, newStatus: string) => {
    setEmployeeList(prev => prev.map(emp =>
      emp.id === id ? { ...emp, status: newStatus } : emp
    ))
    toast({
      title: newStatus === "Active" ? "Activated" : "Deactivated",
      description: `Employee has been marked as ${newStatus.toLowerCase()}.`
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your team members and their information
          </p>
        </div>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeList.length}</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeList.filter(e => e.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              94% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeList.filter(e => e.status === "On Leave").length}</div>
            <p className="text-xs text-muted-foreground">
              6% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(employeeList.map(e => e.department)).size}</div>
            <p className="text-xs text-muted-foreground">
              Across company
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            View and manage all employee information
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback>
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.joinDate}</TableCell>
                  <TableCell>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetails(employee, 'overview')}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(employee)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit employee
                        </DropdownMenuItem>
                        {employee.status === "Active" && (
                          <>
                            <DropdownMenuItem className="text-yellow-600" onClick={() => toggleStatus(employee.id, "On Leave")}>
                              <Clock className="mr-2 h-4 w-4" /> Mark On Leave
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => toggleStatus(employee.id, "Inactive")}>
                              <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                            </DropdownMenuItem>
                          </>
                        )}
                        {employee.status === "On Leave" && (
                          <>
                            <DropdownMenuItem className="text-green-600" onClick={() => toggleStatus(employee.id, "Active")}>
                              <Users className="mr-2 h-4 w-4" /> Mark Active
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => toggleStatus(employee.id, "Inactive")}>
                              <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                            </DropdownMenuItem>
                          </>
                        )}
                        {employee.status === "Inactive" && (
                          <DropdownMenuItem className="text-green-600" onClick={() => toggleStatus(employee.id, "Active")}>
                            <Users className="mr-2 h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Employee Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
            <DialogDescription>
              {selectedEmployee ? "Update employee details." : "Add a new employee to the directory."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="e.g. John Doe"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="e.g. john@company.com"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Input
                placeholder="e.g. Engineering"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Input
                placeholder="e.g. Developer"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleSaveEmployee}>{selectedEmployee ? "Save Changes" : "Add Employee"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Employee Details: {selectedEmployee?.name}</DialogTitle>
            <DialogDescription>
              View profile info, payroll history, and leave records.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <Tabs value={detailsTab} onValueChange={setDetailsTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="leave">Leave & Attendance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 py-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedEmployee.avatar} />
                    <AvatarFallback className="text-lg">{selectedEmployee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold">{selectedEmployee.name}</h3>
                    <p className="text-muted-foreground">{selectedEmployee.position}</p>
                    <Badge className={getStatusColor(selectedEmployee.status)}>{selectedEmployee.status}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Phone</label>
                    <p className="font-medium">{selectedEmployee.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Department</label>
                    <p className="font-medium">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Join Date</label>
                    <p className="font-medium">{selectedEmployee.joinDate}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payroll" className="py-4">
                <div className="rounded-md border p-4 bg-muted/50 text-center">
                  <CreditCard className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Latest Salary Slip</p>
                  <p className="font-bold text-lg mt-1">$4,500.00</p>
                  <p className="text-xs text-muted-foreground">Paid on May 30, 2023</p>
                  <Button variant="outline" size="sm" className="mt-4">View All Slips</Button>
                </div>
              </TabsContent>

              <TabsContent value="leave" className="py-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Card>
                    <CardHeader className="p-2"><CardTitle className="text-xs">Annual</CardTitle></CardHeader>
                    <CardContent className="p-2 text-xl font-bold">12/20</CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-2"><CardTitle className="text-xs">Sick</CardTitle></CardHeader>
                    <CardContent className="p-2 text-xl font-bold">5/10</CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="p-2"><CardTitle className="text-xs">Unpaid</CardTitle></CardHeader>
                    <CardContent className="p-2 text-xl font-bold">0</CardContent>
                  </Card>
                </div>
                <div className="text-sm font-medium mb-2">Recent Requests</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Sick Leave (2 Days)</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">Annual Leave (5 Days)</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
