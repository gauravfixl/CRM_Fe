"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Plus, Search, Calendar, FileText, Scale, Clock, AlertTriangle, CheckCircle, Users } from 'lucide-react'

const cases = [
  {
    id: "CASE-2024-001",
    title: "Smith vs. Johnson Construction",
    client: "Robert Smith",
    caseType: "Contract Dispute",
    status: "Active",
    priority: "High",
    assignedLawyer: "Sarah Wilson",
    courtDate: "2024-02-15",
    filingDate: "2024-01-10",
    estimatedValue: "$125,000",
    description: "Contract dispute regarding construction delays and cost overruns",
  },
  {
    id: "CASE-2024-002",
    title: "Davis Family Estate Planning",
    client: "Margaret Davis",
    caseType: "Estate Planning",
    status: "In Progress",
    priority: "Medium",
    assignedLawyer: "Michael Chen",
    courtDate: null,
    filingDate: "2024-01-05",
    estimatedValue: "$50,000",
    description: "Comprehensive estate planning including will, trust, and tax optimization",
  },
  {
    id: "CASE-2024-003",
    title: "Tech Corp IP Infringement",
    client: "Tech Innovations Inc",
    caseType: "Intellectual Property",
    status: "Pending",
    priority: "High",
    assignedLawyer: "Lisa Anderson",
    courtDate: "2024-03-20",
    filingDate: "2023-12-20",
    estimatedValue: "$500,000",
    description: "Patent infringement case involving software algorithms",
  },
  {
    id: "CASE-2024-004",
    title: "Green Energy Merger",
    client: "Green Solutions LLC",
    caseType: "Corporate Law",
    status: "Completed",
    priority: "Low",
    assignedLawyer: "David Kim",
    courtDate: null,
    filingDate: "2023-11-15",
    estimatedValue: "$75,000",
    description: "Merger and acquisition legal services for renewable energy company",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Completed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    case "On Hold":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle className="h-4 w-4" />
    case "In Progress":
      return <Clock className="h-4 w-4" />
    case "Pending":
      return <AlertTriangle className="h-4 w-4" />
    case "Completed":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredCases = cases.filter(caseItem =>
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.caseType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCases = cases.length
  const activeCases = cases.filter(c => c.status === "Active" || c.status === "In Progress").length
  const pendingCases = cases.filter(c => c.status === "Pending").length
  const completedCases = cases.filter(c => c.status === "Completed").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Management</h1>
          <p className="text-muted-foreground">
            Manage legal cases, track progress, and monitor deadlines
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>
                Add a new legal case with client and case details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="case-title">Case Title</Label>
                  <Input id="case-title" placeholder="Enter case title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input id="client-name" placeholder="Enter client name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="case-type">Case Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract-dispute">Contract Dispute</SelectItem>
                      <SelectItem value="estate-planning">Estate Planning</SelectItem>
                      <SelectItem value="intellectual-property">Intellectual Property</SelectItem>
                      <SelectItem value="corporate-law">Corporate Law</SelectItem>
                      <SelectItem value="family-law">Family Law</SelectItem>
                      <SelectItem value="criminal-law">Criminal Law</SelectItem>
                      <SelectItem value="personal-injury">Personal Injury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assigned-lawyer">Assigned Lawyer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lawyer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                      <SelectItem value="michael-chen">Michael Chen</SelectItem>
                      <SelectItem value="lisa-anderson">Lisa Anderson</SelectItem>
                      <SelectItem value="david-kim">David Kim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated-value">Estimated Value</Label>
                  <Input id="estimated-value" placeholder="$0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Case Description</Label>
                <Textarea id="description" placeholder="Detailed description of the case" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="filing-date">Filing Date</Label>
                  <Input id="filing-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="court-date">Court Date (Optional)</Label>
                  <Input id="court-date" type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Case</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCases}</div>
            <p className="text-xs text-muted-foreground">
              All time cases
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCases}</div>
            <p className="text-xs text-muted-foreground">
              Currently working
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCases}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting action
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCases}</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Overview</CardTitle>
          <CardDescription>
            Comprehensive view of all legal cases and their current status
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases..."
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
                <TableHead>Case Details</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned Lawyer</TableHead>
                <TableHead>Court Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{caseItem.title}</div>
                      <div className="text-sm text-muted-foreground">{caseItem.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{caseItem.client}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{caseItem.caseType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(caseItem.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(caseItem.status)}
                        <span>{caseItem.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(caseItem.priority)}>
                      {caseItem.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{caseItem.assignedLawyer}</TableCell>
                  <TableCell>
                    {caseItem.courtDate ? (
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-3 w-3" />
                        {caseItem.courtDate}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{caseItem.estimatedValue}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit case</DropdownMenuItem>
                        <DropdownMenuItem>View documents</DropdownMenuItem>
                        <DropdownMenuItem>Schedule hearing</DropdownMenuItem>
                        <DropdownMenuItem>Generate report</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Close case
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
