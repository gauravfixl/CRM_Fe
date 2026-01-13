"use client"

import { useState } from "react"
import {
  Eye,
  Clock,
  FileText,
  Mail,
  Activity,
  BarChart3,
  Plus,
  Shield,
  Key,
  LogIn,
  StopCircle,
  Globe,
  CheckCircle,
  Star,
  UserPlus,
  Send,
  Phone,
  Building,
  Calendar,
  Archive,
  AlertTriangle,
  MessageSquare,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from "recharts"
// import AppLayout from "@/components/layout/app-layout"
import AccessRequestModal from "@/components/support/request-access-modal"

// Mock data
const tickets = [
  {
    id: "TK-001",
    customer: "John Smith",
    subject: "Login issues with mobile app",
    status: "Open",
    priority: "High",
    assignedTime: "2 hours ago",
    createdAt: "2024-01-15T10:30:00Z",
    lastUpdate: "2024-01-15T12:30:00Z",
    description:
      "Customer is unable to log into the mobile application. Error message appears when entering credentials. This has been happening since the latest app update.",
    customerInfo: {
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      company: "Tech Solutions Inc.",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Premium",
      satisfaction: 4.5,
    },
    tags: ["mobile", "login", "urgent"],
    slaStatus: "At Risk",
    timeToResolve: "4h 30m remaining",
  },
  {
    id: "TK-002",
    customer: "Sarah Johnson",
    subject: "Billing inquiry about subscription",
    status: "Pending",
    priority: "Medium",
    assignedTime: "4 hours ago",
    createdAt: "2024-01-15T08:00:00Z",
    lastUpdate: "2024-01-15T11:00:00Z",
    description:
      "Customer has questions about their subscription billing cycle and wants to upgrade their plan. They're also asking about enterprise features.",
    customerInfo: {
      email: "sarah.j@company.com",
      phone: "+1 (555) 987-6543",
      company: "Marketing Pro LLC",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Business",
      satisfaction: 4.8,
    },
    tags: ["billing", "upgrade", "subscription"],
    slaStatus: "On Track",
    timeToResolve: "20h 15m remaining",
  },
  {
    id: "TK-003",
    customer: "Mike Davis",
    subject: "Feature request for dashboard",
    status: "Resolved",
    priority: "Low",
    assignedTime: "1 day ago",
    createdAt: "2024-01-14T14:00:00Z",
    lastUpdate: "2024-01-15T09:00:00Z",
    description:
      "Customer requested additional filtering options in the main dashboard view. They want to be able to filter by date ranges and custom fields.",
    customerInfo: {
      email: "mike.davis@startup.io",
      phone: "+1 (555) 456-7890",
      company: "Startup Innovations",
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "Starter",
      satisfaction: 4.2,
    },
    tags: ["feature-request", "dashboard", "enhancement"],
    slaStatus: "Resolved",
    timeToResolve: "Completed",
  },
]

const chatMessages = [
  {
    id: 1,
    sender: "John Smith",
    message: "Hi, I'm having trouble logging into the mobile app. It keeps showing an error message.",
    timestamp: "2:30 PM",
    isCustomer: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    sender: "You",
    message:
      "Hi John! I'm sorry to hear you're experiencing login issues. Can you tell me what error message you're seeing exactly?",
    timestamp: "2:32 PM",
    isCustomer: false,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    sender: "John Smith",
    message:
      "It says 'Authentication failed. Please check your credentials and try again.' But I'm sure my password is correct.",
    timestamp: "2:35 PM",
    isCustomer: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    sender: "You",
    message:
      "Thank you for that information. This might be related to the recent app update. Let me check your account status and get this resolved for you.",
    timestamp: "2:37 PM",
    isCustomer: false,
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const analyticsData = {
  ticketTrends: [
    { month: "Jan", open: 45, resolved: 38, pending: 12 },
    { month: "Feb", open: 52, resolved: 45, pending: 15 },
    { month: "Mar", open: 48, resolved: 42, pending: 18 },
    { month: "Apr", open: 61, resolved: 55, pending: 14 },
    { month: "May", open: 58, resolved: 52, pending: 16 },
    { month: "Jun", open: 65, resolved: 58, pending: 19 },
  ],
  priorityDistribution: [
    { name: "High", value: 35, color: "#ef4444" },
    { name: "Medium", value: 45, color: "#f59e0b" },
    { name: "Low", value: 20, color: "#10b981" },
  ],
  responseTime: [
    { day: "Mon", avgTime: 2.5 },
    { day: "Tue", avgTime: 1.8 },
    { day: "Wed", avgTime: 3.2 },
    { day: "Thu", avgTime: 2.1 },
    { day: "Fri", avgTime: 2.8 },
    { day: "Sat", avgTime: 4.1 },
    { day: "Sun", avgTime: 3.5 },
  ],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-red-100 text-red-800 border-red-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Resolved":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200"
    case "Medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "Low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getSLAColor = (status: string) => {
  switch (status) {
    case "At Risk":
      return "text-red-600"
    case "Breached":
      return "text-red-800"
    case "On Track":
      return "text-green-600"
    case "Resolved":
      return "text-gray-600"
    default:
      return "text-gray-600"
  }
}

export default function SupportDashboard() {
  const [selectedTicket, setSelectedTicket] = useState(tickets[0])
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [chatMessage, setChatMessage] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [isAccessRequestOpen, setIsAccessRequestOpen] = useState(false)

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = statusFilter === "all" || ticket.status.toLowerCase() === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority.toLowerCase() === priorityFilter
    return matchesStatus && matchesPriority
  })

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage("")
    }
  }

  return (
    // <AppLayout searchPlaceholder="Search tickets, customers...">
    <>
      <div className="flex flex-1 overflow-hidden">
        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-gray-200 px-4 sm:px-6">
              <TabsList className="grid w-full max-w-md sm:max-w-2xl grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="sessions" className="text-xs sm:text-sm">
                  Sessions
                </TabsTrigger>
                <TabsTrigger value="tickets" className="text-xs sm:text-sm">
                  Tickets
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm">
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="flex-1 overflow-auto">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Welcome Message */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Support Agent Dashboard</h1>
                    <p className="text-gray-600">Manage client organization access and support sessions</p>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    onClick={() => setIsAccessRequestOpen(true)}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Request Access
                  </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-green-900">Active Sessions</CardTitle>
                      <Shield className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-900">3</div>
                      <p className="text-xs text-green-700 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        Currently accessing orgs
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-yellow-900">Pending Requests</CardTitle>
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-900">2</div>
                      <p className="text-xs text-yellow-700">Awaiting approval</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-blue-900">Organizations</CardTitle>
                      <Globe className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-900">24</div>
                      <p className="text-xs text-blue-700">Total accessible</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-purple-900">Actions Today</CardTitle>
                      <Activity className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-900">47</div>
                      <p className="text-xs text-purple-700">Support actions logged</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                        <Plus className="h-5 w-5" />
                        <span className="text-sm">New Ticket</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                        <UserPlus className="h-5 w-5" />
                        <span className="text-sm">Add Customer</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Knowledge Base</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                        <BarChart3 className="h-5 w-5" />
                        <span className="text-sm">Generate Report</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">Ticket TK-001 was updated by John Doe</p>
                          <p className="text-xs text-gray-500">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">New ticket TK-005 assigned to you</p>
                          <p className="text-xs text-gray-500">15 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">Customer Sarah Johnson replied to TK-002</p>
                          <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="flex-1 overflow-auto">
              <div className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Active Support Sessions</h2>
                    <p className="text-gray-600">Currently active organization access sessions</p>
                  </div>
                  <Button
                    onClick={() => setIsAccessRequestOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Sessions with active organization access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <Shield className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium truncate">Tech Solutions Inc.</h4>
                            <p className="text-sm text-gray-500 truncate">billing, users • 22h 15m remaining</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Active
                          </Badge>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                            <LogIn className="h-4 w-4 mr-2" />
                            Access
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                            <StopCircle className="h-4 w-4 mr-2" />
                            End
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tickets" className="flex-1 overflow-auto">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ticket Queue Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Queue</CardTitle>
                    <CardDescription>Manage and track all support tickets</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[100px]">Ticket ID</TableHead>
                          <TableHead className="min-w-[150px]">Customer</TableHead>
                          <TableHead className="min-w-[200px]">Subject</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="min-w-[100px]">Priority</TableHead>
                          <TableHead className="min-w-[100px]">SLA</TableHead>
                          <TableHead className="min-w-[120px]">Assigned Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTickets.map((ticket) => (
                          <TableRow
                            key={ticket.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <TableCell className="font-medium">{ticket.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 min-w-0">
                                <Avatar className="h-6 w-6 shrink-0">
                                  <AvatarImage src={ticket.customerInfo.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {ticket.customer
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate">{ticket.customer}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <span className="truncate block">{ticket.subject}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={`text-sm font-medium ${getSLAColor(ticket.slaStatus)}`}>
                                {ticket.slaStatus}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-500">{ticket.assignedTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 overflow-auto">
              <div className="p-4 sm:p-6 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                  <p className="text-gray-600">Comprehensive insights into your support performance</p>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">94.2%</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +2.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">First Response</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1.2h</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        -0.3h from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">CSAT Score</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.8</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +0.2 from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ticket Trends</CardTitle>
                      <CardDescription>Monthly ticket volume and resolution</CardDescription>
                    </CardHeader>
               <CardContent>
  <div className="w-full h-[250px] sm:h-[300px]">
    <ChartContainer
      config={{
        open: { label: "Open", color: "#3b82f6" },
        resolved: { label: "Resolved", color: "#10b981" },
        pending: { label: "Pending", color: "#f59e0b" },
      }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={analyticsData.ticketTrends}>
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="open" stroke="var(--color-open)" strokeWidth={2} />
          <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" strokeWidth={2} />
          <Line type="monotone" dataKey="pending" stroke="var(--color-pending)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  </div>
</CardContent>

                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Priority Distribution</CardTitle>
                      <CardDescription>Current ticket priority breakdown</CardDescription>
                    </CardHeader>
                  <CardContent>
  <div className="w-full h-[250px] sm:h-[300px] flex items-center justify-center">
    <ChartContainer
      config={{
        high: { label: "High", color: "#ef4444" },
        medium: { label: "Medium", color: "#f59e0b" },
        low: { label: "Low", color: "#10b981" },
      }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={analyticsData.priorityDistribution}
            cx="50%"
            cy="50%"
            outerRadius="70%"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {analyticsData.priorityDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  </div>
</CardContent>

                  </Card>
                </div>

                {/* Full Width Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Average Response Time</CardTitle>
                    <CardDescription>Daily response time trends (in hours)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        avgTime: { label: "Avg Response Time", color: "#8b5cf6" },
                      }}
                      className="h-[250px] sm:h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.responseTime}>
                          <XAxis dataKey="day" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="avgTime" fill="var(--color-avgTime)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Right Panel - Ticket Details */}
        <div className="w-80 xl:w-96 border-l border-gray-200 bg-white flex-col shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Ticket Details</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Ticket Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Ticket ID</span>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{selectedTicket.id}</span>
                </div>
                <h4 className="font-semibold text-gray-900 leading-tight">{selectedTicket.subject}</h4>

                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Badge>
                  <Badge variant="outline" className={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">SLA Status:</span>
                  <span className={`font-medium ${getSLAColor(selectedTicket.slaStatus)}`}>
                    {selectedTicket.slaStatus}
                  </span>
                </div>

                {selectedTicket.timeToResolve !== "Completed" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Time to Resolve:</span>
                      <span className="font-medium">{selectedTicket.timeToResolve}</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                )}
              </div>

              <Separator />

              {/* Customer Information */}
              <div className="space-y-4">
                <h5 className="font-medium text-gray-900">Customer Information</h5>

                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={selectedTicket.customerInfo.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedTicket.customer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{selectedTicket.customer}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.customerInfo.tier} Customer</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{selectedTicket.customerInfo.satisfaction}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{selectedTicket.customerInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{selectedTicket.customerInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{selectedTicket.customerInfo.company}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Ticket Description */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900">Description</h5>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedTicket.description}</p>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900">Tags</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedTicket.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Timeline */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900">Timeline</h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-gray-500">Created:</span>
                    <span className="truncate">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-gray-500">Last Update:</span>
                    <span className="truncate">{new Date(selectedTicket.lastUpdate).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Chat Section */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900">Live Chat</h5>
                <div className="border rounded-lg">
                  <ScrollArea className="h-48 p-3">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 ${message.isCustomer ? "justify-start" : "justify-end"}`}
                        >
                          {message.isCustomer && (
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarImage src={message.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">C</AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              message.isCustomer ? "bg-gray-100 text-gray-900" : "bg-blue-600 text-white"
                            }`}
                          >
                            <p className="break-words">{message.message}</p>
                            <p className={`text-xs mt-1 ${message.isCustomer ? "text-gray-500" : "text-blue-100"}`}>
                              {message.timestamp}
                            </p>
                          </div>
                          {!message.isCustomer && (
                            <Avatar className="h-6 w-6 shrink-0">
                              <AvatarImage src={message.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">A</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="border-t p-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 min-w-0"
                      />
                      <Button size="icon" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Internal Notes */}
              <div className="space-y-3">
                <h5 className="font-medium text-gray-900">Internal Notes</h5>
                <Textarea placeholder="Add internal note..." className="min-h-[80px]" />
                <Button size="sm" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Resolved
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Escalate
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AccessRequestModal isOpen={isAccessRequestOpen} onClose={() => setIsAccessRequestOpen(false)} />
        </>
    // </AppLayout>
  )
}
