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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Plus, Search, Mail, Phone, MapPin, Calendar, Users, UserCheck, UserX, Building } from 'lucide-react'

const employees = [
  {
    id: "EMP-001",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    phone: "+1 (555) 123-4567",
    position: "Senior Software Engineer",
    department: "Engineering",
    manager: "David Kim",
    salary: "$95,000",
    status: "Active",
    joinDate: "2023-01-15",
    location: "New York, NY",
    employeeType: "Full-time",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "EMP-002",
    name: "Bob Smith",
    email: "bob.smith@company.com",
    phone: "+1 (555) 234-5678",
    position: "Marketing Manager",
    department: "Marketing",
    manager: "Sarah Wilson",
    salary: "$75,000",
    status: "Active",
    joinDate: "2022-08-20",
    location: "Los Angeles, CA",
    employeeType: "Full-time",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "EMP-003",
    name: "Carol Davis",
    email: "carol.davis@company.com",
    phone: "+1 (555) 345-6789",
    position: "HR Specialist",
    department: "Human Resources",
    manager: "Mike Johnson",
    salary: "$65,000",
    status: "On Leave",
    joinDate: "2023-03-10",
    location: "Chicago, IL",
    employeeType: "Full-time",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "EMP-004",
    name: "David Wilson",
    email: "david.wilson@company.com",
    phone: "+1 (555) 456-7890",
    position: "UX Designer",
    department: "Design",
    manager: "Lisa Anderson",
    salary: "$70,000",
    status: "Active",
    joinDate: "2023-06-01",
    location: "Austin, TX",
    employeeType: "Contract",
    avatar: "/placeholder.svg?height=40&width=40",
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <UserCheck className="h-4 w-4" />
    case "On Leave":
      return <Calendar className="h-4 w-4" />
    case "Inactive":
      return <UserX className="h-4 w-4" />
    default:
      return <Users className="h-4 w-4" />
  }
}

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(emp => emp.status === "Active").length
  const onLeaveEmployees = employees.filter(emp => emp.status === "On Leave").length
  const departments = [...new Set(employees.map(emp => emp.department))].length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">
            Manage your workforce and track employee information
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create a new employee profile with their personal and job information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-id">Employee ID</Label>
                  <Input id="employee-id" placeholder="EMP-XXX" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter email address" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" placeholder="Enter job position" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input id="salary" placeholder="$0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join-date">Join Date</Label>
                  <Input id="join-date" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="david-kim">David Kim</SelectItem>
                      <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="lisa-anderson">Lisa Anderson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-type">Employee Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter work location" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {((activeEmployees / totalEmployees) * 100).toFixed(1)}% of workforce
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{onLeaveEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Currently unavailable
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments}</div>
            <p className="text-xs text-muted-foreground">
              Active departments
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>
            Complete overview of your workforce and their details
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
                <TableHead>Contact Info</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Manager</TableHead>
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
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                        <AvatarFallback>
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3 w-3" />
                        {employee.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-3 w-3" />
                        {employee.phone}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-3 w-3" />
                        {employee.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.position}</div>
                      <div className="text-sm text-muted-foreground">{employee.employeeType}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.department}</Badge>
                  </TableCell>
                  <TableCell>{employee.manager}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(employee.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(employee.status)}
                        <span>{employee.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-3 w-3" />
                      {employee.joinDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit employee</DropdownMenuItem>
                        <DropdownMenuItem>View payroll</DropdownMenuItem>
                        <DropdownMenuItem>Manage leave</DropdownMenuItem>
                        <DropdownMenuItem>Performance review</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
