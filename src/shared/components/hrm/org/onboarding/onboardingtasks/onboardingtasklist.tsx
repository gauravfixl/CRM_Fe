"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Mail, Eye } from "lucide-react"

type Employee = {
  id: number
  name: string
  jobTitle: string
  department: string
  location: string
  joiningDate: string
  taskCompletion: string
  status: "not_initiated" | "in_progress" | "completed" | "skipped"
}

export default function OnboardingTasksPage() {
  const [tab, setTab] = useState("in_progress")
  const [filters, setFilters] = useState({
    department: "",
    location: "",
    workerType: "",
    businessUnit: "",
    search: "",
  })

  // mock data (later replace with API)
  const mockData: Employee[] = [
    {
      id: 1,
      name: "Abhijit Bhutkar",
      jobTitle: "Manager - Product",
      department: "Customer Success",
      location: "Chennai",
      joiningDate: "14 Nov, 2023",
      taskCompletion: "Tasks not assigned",
      status: "in_progress",
    },
    {
      id: 2,
      name: "Geraladine Venetia",
      jobTitle: "Senior Talent Magnet",
      department: "Human Resource",
      location: "Hyderabad",
      joiningDate: "01 Feb, 2018",
      taskCompletion: "Tasks not assigned",
      status: "in_progress",
    },
    {
      id: 3,
      name: "Johnny Snowey",
      jobTitle: "Senior Manager - Design",
      department: "Customer Success",
      location: "Bangalore",
      joiningDate: "14 Nov, 2023",
      taskCompletion: "Tasks not assigned",
      status: "in_progress",
    },
    {
      id: 4,
      name: "Kanan Gupta",
      jobTitle: "Service Manager - Product",
      department: "Product",
      location: "Bangalore",
      joiningDate: "25 Jan, 2024",
      taskCompletion: "Tasks not assigned",
      status: "completed",
    },
  ]

  const filteredData = useMemo(() => {
    return mockData.filter((emp) => {
      const matchStatus = emp.status === tab
      const matchSearch = emp.name.toLowerCase().includes(filters.search.toLowerCase())
      const matchDept = filters.department ? emp.department === filters.department : true
      const matchLoc = filters.location ? emp.location === filters.location : true
      return matchStatus && matchSearch && matchDept && matchLoc
    })
  }, [mockData, tab, filters])

  // Placeholder for API fetch
  // async function fetchData() { const res = await fetch("/api/onboarding"); const data = await res.json(); }

  return (
    <div className="space-y-3 text-xs">
      <div>
        <h1 className="text-sm font-semibold">Onboarding tasks</h1>
        <p className="text-[11px] text-muted-foreground">
          Track employees who are assigned onboarding tasks and employees whose onboarding is not initiated.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.department}
          onValueChange={(v) => setFilters({ ...filters, department: v })}
        >
          <SelectTrigger className="h-7 w-[150px] text-xs">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Customer Success">Customer Success</SelectItem>
            <SelectItem value="Product">Product</SelectItem>
            <SelectItem value="Human Resource">Human Resource</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.location}
          onValueChange={(v) => setFilters({ ...filters, location: v })}
        >
          <SelectTrigger className="h-7 w-[130px] text-xs">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Chennai">Chennai</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.workerType}
          onValueChange={(v) => setFilters({ ...filters, workerType: v })}
        >
          <SelectTrigger className="h-7 w-[120px] text-xs">
            <SelectValue placeholder="Worker Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-Time">Full-Time</SelectItem>
            <SelectItem value="Intern">Intern</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.businessUnit}
          onValueChange={(v) => setFilters({ ...filters, businessUnit: v })}
        >
          <SelectTrigger className="h-7 w-[120px] text-xs">
            <SelectValue placeholder="Business Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BU1">BU1</SelectItem>
            <SelectItem value="BU2">BU2</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="absolute left-2 top-1.5 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="h-7 w-[180px] pl-7 text-xs"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mt-1">
        <TabsList className="h-7 space-x-2 bg-muted p-0.5">
          <TabsTrigger value="not_initiated" className="h-6 text-xs">Not Initiated</TabsTrigger>
          <TabsTrigger value="in_progress" className="h-6 text-xs">In Progress</TabsTrigger>
          <TabsTrigger value="completed" className="h-6 text-xs">Completed</TabsTrigger>
          <TabsTrigger value="skipped" className="h-6 text-xs">Skipped</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card className="border">
        <CardContent className="p-2">
          <table className="w-full text-xs">
            <thead className="border-b bg-muted/40 text-[11px] font-medium">
              <tr className="text-left">
                <th className="py-1 px-2 font-medium">Name & Job Title</th>
                <th className="py-1 px-2 font-medium">Dept & Location</th>
                <th className="py-1 px-2 font-medium">Joining Date</th>
                <th className="py-1 px-2 font-medium">Task Completion</th>
                <th className="py-1 px-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length ? (
                filteredData.map((emp) => (
                  <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/10">
                    <td className="py-1.5 px-2">
                      <div className="font-medium">{emp.name}</div>
                      <div className="text-[11px] text-muted-foreground">{emp.jobTitle}</div>
                    </td>
                    <td className="py-1.5 px-2">
                      {emp.department}, {emp.location}
                    </td>
                    <td className="py-1.5 px-2">{emp.joiningDate}</td>
                    <td className="py-1.5 px-2">{emp.taskCompletion}</td>
                    <td className="py-1.5 px-2 text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-3 text-center text-muted-foreground text-[11px]">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
