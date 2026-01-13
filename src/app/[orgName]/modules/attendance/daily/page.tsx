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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, Search, Users, CheckCircle, XCircle, AlertCircle, Timer } from 'lucide-react'
import { cn } from "@/lib/utils"

const attendanceData = [
  {
    id: "EMP-001",
    name: "Alice Johnson",
    department: "Engineering",
    checkIn: "09:00 AM",
    checkOut: "06:15 PM",
    status: "Present",
    workingHours: "9h 15m",
    overtime: "0h 15m",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "EMP-002",
    name: "Bob Smith",
    department: "Marketing",
    checkIn: "09:30 AM",
    checkOut: "06:00 PM",
    status: "Present",
    workingHours: "8h 30m",
    overtime: "0h 0m",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "EMP-003",
    name: "Carol Davis",
    department: "HR",
    checkIn: "10:00 AM",
    checkOut: "-",
    status: "Late",
    workingHours: "7h 30m",
    overtime: "0h 0m",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "EMP-004",
    name: "David Wilson",
    department: "Design",
    checkIn: "-",
    checkOut: "-",
    status: "Absent",
    workingHours: "0h 0m",
    overtime: "0h 0m",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "EMP-005",
    name: "Emma Brown",
    department: "Finance",
    checkIn: "08:45 AM",
    checkOut: "05:45 PM",
    status: "Present",
    workingHours: "9h 0m",
    overtime: "0h 0m",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Present":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Late":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Absent":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "On Leave":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Present":
      return <CheckCircle className="h-4 w-4" />
    case "Late":
      return <AlertCircle className="h-4 w-4" />
    case "Absent":
      return <XCircle className="h-4 w-4" />
    case "On Leave":
      return <Timer className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function DailyAttendancePage() {
  const [date, setDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const filteredAttendance = attendanceData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || record.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const presentCount = attendanceData.filter(record => record.status === "Present").length
  const lateCount = attendanceData.filter(record => record.status === "Late").length
  const absentCount = attendanceData.filter(record => record.status === "Absent").length
  const totalEmployees = attendanceData.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Attendance</h1>
          <p className="text-muted-foreground">
            Track employee attendance and working hours
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
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
              Expected today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">
              {((presentCount / totalEmployees) * 100).toFixed(1)}% attendance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
            <p className="text-xs text-muted-foreground">
              Late arrivals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-muted-foreground">
              Not present
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>
            Real-time attendance tracking for {format(date || new Date(), "MMMM d, yyyy")}
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
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Working Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={record.avatar || "/placeholder.svg"} alt={record.name} />
                        <AvatarFallback>
                          {record.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-sm text-muted-foreground">{record.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-3 w-3" />
                      {record.checkIn}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-3 w-3" />
                      {record.checkOut}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{record.workingHours}</TableCell>
                  <TableCell className={record.overtime !== "0h 0m" ? "text-orange-600 font-medium" : ""}>
                    {record.overtime}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(record.status)}
                        <span>{record.status}</span>
                      </div>
                    </Badge>
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
