"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search, Building, Users, TrendingUp } from 'lucide-react'

const departments = [
  {
    id: 1,
    name: "Engineering",
    description: "Software development and technical operations",
    head: "John Smith",
    headAvatar: "/placeholder.svg?height=32&width=32",
    employeeCount: 15,
    budget: "$2,500,000",
    status: "Active",
  },
  {
    id: 2,
    name: "Marketing",
    description: "Brand management and customer acquisition",
    head: "Sarah Johnson",
    headAvatar: "/placeholder.svg?height=32&width=32",
    employeeCount: 8,
    budget: "$800,000",
    status: "Active",
  },
  {
    id: 3,
    name: "Human Resources",
    description: "Employee relations and organizational development",
    head: "Mike Wilson",
    headAvatar: "/placeholder.svg?height=32&width=32",
    employeeCount: 5,
    budget: "$400,000",
    status: "Active",
  },
  {
    id: 4,
    name: "Finance",
    description: "Financial planning and accounting operations",
    head: "Emily Davis",
    headAvatar: "/placeholder.svg?height=32&width=32",
    employeeCount: 6,
    budget: "$600,000",
    status: "Active",
  },
]

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">
            Manage organizational departments and their structure
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Across organization
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.3M</div>
            <p className="text-xs text-muted-foreground">
              Annual allocation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Per department
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredDepartments.map((department) => (
          <Card key={department.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {department.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit department</DropdownMenuItem>
                    <DropdownMenuItem>Manage budget</DropdownMenuItem>
                    <DropdownMenuItem>View employees</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Archive department
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-lg">{department.name}</CardTitle>
              <CardDescription>{department.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={department.headAvatar || "/placeholder.svg"} alt={department.head} />
                    <AvatarFallback>
                      {department.head.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">Department Head</div>
                    <div className="text-sm text-muted-foreground">{department.head}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Employees</div>
                  <div className="text-2xl font-bold">{department.employeeCount}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Budget</div>
                  <div className="text-2xl font-bold">{department.budget}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
