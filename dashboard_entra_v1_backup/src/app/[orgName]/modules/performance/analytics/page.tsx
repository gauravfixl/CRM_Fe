"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendingUp, TrendingDown, Target, Users, DollarSign, Clock, BarChart3, PieChart } from 'lucide-react'
import { Bar, BarChart, Line, LineChart, Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const monthlyData = [
  { month: "Jan", revenue: 45000, leads: 120, conversions: 22 },
  { month: "Feb", revenue: 52000, leads: 135, conversions: 28 },
  { month: "Mar", revenue: 48000, leads: 128, conversions: 25 },
  { month: "Apr", revenue: 61000, leads: 142, conversions: 32 },
  { month: "May", revenue: 55000, leads: 138, conversions: 29 },
  { month: "Jun", revenue: 67000, leads: 156, conversions: 38 },
]

const departmentData = [
  { name: "Sales", value: 35, color: "#0088FE" },
  { name: "Marketing", value: 25, color: "#00C49F" },
  { name: "Engineering", value: 20, color: "#FFBB28" },
  { name: "Support", value: 15, color: "#FF8042" },
  { name: "Others", value: 5, color: "#8884D8" },
]

const kpiData = [
  {
    title: "Revenue Growth",
    value: "+23.5%",
    change: "+2.1%",
    trend: "up",
    description: "vs last month",
    icon: DollarSign,
  },
  {
    title: "Lead Conversion",
    value: "18.2%",
    change: "+1.4%",
    trend: "up",
    description: "conversion rate",
    icon: Target,
  },
  {
    title: "Customer Satisfaction",
    value: "94.8%",
    change: "-0.3%",
    trend: "down",
    description: "satisfaction score",
    icon: Users,
  },
  {
    title: "Avg Response Time",
    value: "2.4h",
    change: "-0.6h",
    trend: "up",
    description: "response time",
    icon: Clock,
  },
]

const teamPerformance = [
  { name: "Sarah Wilson", department: "Sales", score: 95, target: 100, achievement: "95%" },
  { name: "Michael Chen", department: "Marketing", score: 88, target: 90, achievement: "98%" },
  { name: "Lisa Anderson", department: "Engineering", score: 92, target: 85, achievement: "108%" },
  { name: "David Kim", department: "Support", score: 87, target: 90, achievement: "97%" },
  { name: "Emma Brown", department: "Finance", score: 91, target: 88, achievement: "103%" },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into business performance and metrics
          </p>
        </div>
        <Select defaultValue="last-30-days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 90 days</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className={`flex items-center ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {kpi.change}
                </span>
                <span className="ml-1">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Department Performance
            </CardTitle>
            <CardDescription>Performance distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lead Conversion Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Conversion Analytics</CardTitle>
          <CardDescription>Track leads and conversion rates over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="leads" fill="#00C49F" name="Total Leads" />
              <Bar yAxisId="left" dataKey="conversions" fill="#0088FE" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance Overview</CardTitle>
          <CardDescription>Individual performance metrics and goal achievement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.department}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Score: {member.score}/{member.target}</div>
                    <div className="text-xs text-muted-foreground">Target Achievement</div>
                  </div>
                  <div className="w-32">
                    <Progress value={(member.score / member.target) * 100} className="h-2" />
                  </div>
                  <Badge 
                    className={
                      member.score >= member.target 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }
                  >
                    {member.achievement}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
