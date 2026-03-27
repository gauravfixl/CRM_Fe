"use client"

import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import {
    ArrowUpRight,
    Users,
    HeartPulse,
    DollarSign,
    AlertCircle,
    ChevronRight,
    Calendar,
    MessageSquare,
    CheckCircle2,
    Phone,
    FileText,
    TrendingUp,
    Target,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Clock
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Progress } from "@/shared/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { toast } from "@/shared/utils/toast"
import { getAllClients, getClientsActivity } from "@/modules/crm/clients/hooks/clientHooks"

// Enhanced Mock Data
const revenueData = [
    { name: 'Jan', revenue: 4000, retention: 95, expansion: 120 },
    { name: 'Feb', revenue: 4500, retention: 96, expansion: 135 },
    { name: 'Mar', revenue: 4200, retention: 94, expansion: 110 },
    { name: 'Apr', revenue: 5100, retention: 97, expansion: 155 },
    { name: 'May', revenue: 5800, retention: 98, expansion: 180 },
    { name: 'Jun', revenue: 6200, retention: 98, expansion: 195 },
]
const clientStatusData = [
    { name: 'Active', value: 280, color: '#10b981' },
    { name: 'At Risk', value: 45, color: '#f59e0b' },
    { name: 'Churned', value: 17, color: '#ef4444' },
]

const riskClients = [
    { id: 1, name: 'Acme Corp', logo: 'AC', health: 42, mrr: '$4,200', reason: 'Low platform usage', status: 'critical', lastContact: '5 days ago', csm: 'John Doe' },
    { id: 2, name: 'Stark Industries', logo: 'SI', health: 58, mrr: '$12,500', reason: 'Unresolved support tickets', status: 'warning', lastContact: '2 days ago', csm: 'Sarah Smith' },
    { id: 3, name: 'Globex Corporation', logo: 'GL', health: 65, mrr: '$2,100', reason: 'Payment failed', status: 'warning', lastContact: '1 day ago', csm: 'Alex Wong' },
    { id: 4, name: 'Wayne Enterprises', logo: 'WE', health: 38, mrr: '$8,900', reason: 'Contract expiring soon', status: 'critical', lastContact: '7 days ago', csm: 'Maria Garcia' },
]

const upcomingRenewals = [
    { id: 1, name: 'CloudScale Inc', date: 'Oct 12, 2024', value: '$12k', probability: 'High', color: 'emerald', daysLeft: 5, csm: 'John Doe' },
    { id: 2, name: 'DataFlow Systems', date: 'Oct 15, 2024', value: '$8.5k', probability: 'Medium', color: 'amber', daysLeft: 8, csm: 'Sarah Smith' },
    { id: 3, name: 'GreenEnergy Co', date: 'Oct 22, 2024', value: '$45k', probability: 'High', color: 'emerald', daysLeft: 15, csm: 'Alex Wong' },
    { id: 4, name: 'Swift Logistics', date: 'Nov 02, 2024', value: '$2.2k', probability: 'At Risk', color: 'rose', daysLeft: 26, csm: 'Maria Garcia' },
    { id: 5, name: 'TechFlow Solutions', date: 'Nov 08, 2024', value: '$18k', probability: 'High', color: 'emerald', daysLeft: 32, csm: 'David Chen' },
]

const recentActivities = [
    { id: 1, user: 'John Doe', avatar: 'JD', action: 'settled renewal for', target: 'Acme Corp', time: '12m ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 2, user: 'Sarah Smith', avatar: 'SS', action: 'added a note on', target: 'Stark Industries', time: '45m ago', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 3, user: 'Alex Wong', avatar: 'AW', action: 'upgraded subscription', target: 'Globex', time: '2h ago', icon: ArrowUpRight, color: 'text-violet-500', bg: 'bg-violet-50' },
    { id: 4, user: 'Maria Garcia', avatar: 'MG', action: 'scheduled call with', target: 'Wayne Enterprises', time: '3h ago', icon: Phone, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 5, user: 'David Chen', avatar: 'DC', action: 'sent proposal to', target: 'TechFlow Solutions', time: '5h ago', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
]

const tierData = [
    { name: 'Starter', clients: 120, revenue: 12000, color: '#6366f1' },
    { name: 'Professional', clients: 150, revenue: 45000, color: '#8b5cf6' },
    { name: 'Enterprise', clients: 52, revenue: 156000, color: '#a855f7' },
    { name: 'Custom', clients: 20, revenue: 80000, color: '#d946ef' },
]

const kpiStats = [
    { title: "Annual Recurring Revenue", value: "$1.24M", change: "+12.5%", trend: "up" as const, icon: DollarSign, color: "indigo", path: "/client-management/revenue" },
    { title: "Total Active Clients", value: "342", change: "+4", trend: "up" as const, icon: Users, color: "emerald", path: "/client-management/customers" },
    { title: "Average Health Score", value: "84/100", change: "+2.1%", trend: "up" as const, icon: HeartPulse, color: "violet", path: "/client-management/customers/health" },
    { title: "Gross Churn Rate", value: "1.2%", change: "-0.4%", trend: "down" as const, icon: AlertCircle, color: "rose", path: "/client-management/analytics/retention" },
    { title: "Net Revenue Retention", value: "118%", change: "+3.2%", trend: "up" as const, icon: TrendingUp, color: "cyan", path: "/client-management/analytics/revenue" },
    { title: "Customer Lifetime Value", value: "$45.2k", change: "+8.1%", trend: "up" as const, icon: Target, color: "amber", path: "/client-management/analytics/cohorts" },
]

const quickActions = [
    { title: "Add New Client", icon: Plus, color: "indigo", action: "add-client", path: "/client-management/customers?action=new" },
    { title: "Schedule Review", icon: Calendar, color: "emerald", action: "schedule-review", path: "/client-management/communication/templates" },
    { title: "Send Survey", icon: MessageSquare, color: "violet", action: "send-survey", path: "/client-management/communication/campaigns" },
    { title: "Generate Report", icon: FileText, color: "amber", action: "generate-report", path: "/client-management/reports/custom" },
]

const tasks = [
    { id: 1, title: 'Call Acme Corp for renewal', priority: 'High', due: 'Today', status: 'pending' },
    { id: 2, title: 'Review health score for Stark Industries', priority: 'Medium', due: 'Today', status: 'pending' },
    { id: 3, title: 'Prepare QBR for CloudScale', priority: 'High', due: 'Tomorrow', status: 'pending' },
    { id: 4, title: 'Respond to escalated ticket #402', priority: 'Critical', due: 'Today', status: 'done' },
]

const healthDistribution = [
    { name: 'Excellent (90-100)', value: 89, color: '#10b981', percentage: 26 },
    { name: 'Good (70-89)', value: 156, color: '#3b82f6', percentage: 46 },
    { name: 'Fair (50-69)', value: 52, color: '#f59e0b', percentage: 15 },
    { name: 'Poor (0-49)', value: 45, color: '#ef4444', percentage: 13 },
]

const expansionOpportunities = [
    { id: 1, client: 'TechFlow Solutions', opportunity: 'Enterprise Upgrade', value: '$24k', probability: 85, stage: 'Proposal' },
    { id: 2, client: 'DataCorp Inc', opportunity: 'Additional Licenses', value: '$12k', probability: 70, stage: 'Discussion' },
    { id: 3, client: 'CloudScale Inc', opportunity: 'Premium Support', value: '$8k', probability: 90, stage: 'Negotiation' },
    { id: 4, client: 'GreenEnergy Co', opportunity: 'Multi-year Contract', value: '$45k', probability: 60, stage: 'Evaluation' },
]

const supportMetrics = [
    { title: "Open Tickets", value: "23", change: "-12%", trend: "down", color: "rose" },
    { title: "Avg Response Time", value: "2.4h", change: "-18%", trend: "down", color: "emerald" },
    { title: "Resolution Rate", value: "94%", change: "+3%", trend: "up", color: "indigo" },
    { title: "CSAT Score", value: "4.7/5", change: "+0.2", trend: "up", color: "violet" },
]

const recentAlerts = [
    { id: 1, type: "Health Drop", client: "Acme Corp", message: "Health score dropped to 42", severity: "critical", time: "5m ago" },
    { id: 2, type: "Payment Failed", client: "Globex", message: "Payment failed for invoice #INV-2024-001", severity: "high", time: "15m ago" },
    { id: 3, type: "Contract Expiring", client: "Wayne Enterprises", message: "Contract expires in 7 days", severity: "warning", time: "1h ago" },
    { id: 4, type: "Support Escalation", client: "Stark Industries", message: "Ticket escalated to management", severity: "high", time: "2h ago" },
]

// Helper Components
const MetricCard = ({ title, value, change, trend, icon: Icon, color, path }: {
    title: string
    value: string
    change: string
    trend: "up" | "down"
    icon: any
    color: string
    path?: string
}) => {
    const router = useRouter()

    const handleClick = () => {
        if (path) {
            router.push(path)
        }
    }

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'indigo':
                return {
                    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50',
                    iconBg: 'bg-indigo-100',
                    iconColor: 'text-indigo-600',
                    border: 'border-indigo-200/50'
                }
            case 'emerald':
                return {
                    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    border: 'border-emerald-200/50'
                }
            case 'violet':
                return {
                    bg: 'bg-gradient-to-br from-violet-50 to-violet-100/50',
                    iconBg: 'bg-violet-100',
                    iconColor: 'text-violet-600',
                    border: 'border-violet-200/50'
                }
            case 'rose':
                return {
                    bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-600',
                    border: 'border-rose-200/50'
                }
            case 'cyan':
                return {
                    bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100/50',
                    iconBg: 'bg-cyan-100',
                    iconColor: 'text-cyan-600',
                    border: 'border-cyan-200/50'
                }
            case 'amber':
                return {
                    bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    border: 'border-amber-200/50'
                }
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-50 to-gray-100/50',
                    iconBg: 'bg-slate-100',
                    iconColor: 'text-slate-500',
                    border: 'border-slate-200/50'
                }
        }
    }

    const colorClasses = getColorClasses(color)

    return (
        <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-${color}-100/50 ${path ? 'hover:scale-[1.02]' : ''} ${colorClasses.bg} ${colorClasses.border} border`} onClick={handleClick}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${colorClasses.iconBg} shadow-sm`}>
                            <Icon className={`h-5 w-5 ${colorClasses.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 font-outfit">{title}</p>
                            <p className="text-2xl font-bold text-slate-900 font-outfit">{value}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            <ArrowUpRight className={`h-4 w-4 ${trend === 'down' ? 'rotate-90' : ''}`} />
                            <span className="text-sm font-medium font-outfit">{change}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const QuickActionCard = ({ title, icon: Icon, color, action, path, onAction }: {
    title: string
    icon: any
    color: string
    action: string
    path?: string
    onAction?: () => void
}) => {
    const router = useRouter()
    const handleAction = () => {
        if (onAction) {
            onAction()
        } else if (path) {
            router.push(path)
            toast.success(`Opening ${title}...`)
        } else {
            toast.success(`${title} action triggered`)
        }
    }

    return (
        <Card className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]" onClick={handleAction}>
            <CardContent className="p-4 text-center">
                <div className={`mx-auto mb-3 p-3 rounded-lg bg-${color}-100 w-fit`}>
                    <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
                <p className="text-sm font-medium text-slate-900 font-outfit">{title}</p>
            </CardContent>
        </Card>
    )
}

export default function ClientManagementPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedTab, setSelectedTab] = React.useState("overview")
    const [selectedPeriod, setSelectedPeriod] = React.useState("Last 30 Days")
    const [isAddClientDialogOpen, setIsAddClientDialogOpen] = React.useState(false)
    const [clients, setClients] = React.useState<any[]>([])
    const [activities, setActivities] = React.useState<any[]>([])
    const [loadingClients, setLoadingClients] = React.useState(true)

    // Fetch clients and activities from API
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsRes, activitiesRes] = await Promise.allSettled([
                    getAllClients(),
                    getClientsActivity()
                ])
                if (clientsRes.status === 'fulfilled') {
                    const data = clientsRes.value?.data?.clients || clientsRes.value?.data || []
                    if (Array.isArray(data)) setClients(data)
                }
                if (activitiesRes.status === 'fulfilled') {
                    const data = activitiesRes.value?.data?.activities || activitiesRes.value?.data || []
                    if (Array.isArray(data)) setActivities(data)
                }
            } catch (err) {
                console.error('Failed to fetch client data:', err)
            } finally {
                setLoadingClients(false)
            }
        }
        fetchData()
    }, [])

    const [clientFormData, setClientFormData] = React.useState({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        industry: "",
        tier: "",
        mrr: "",
        website: "",
        address: "",
        notes: ""
    })

    // Dynamic data based on selected period
    const totalClients = clients.length
    const getDataForPeriod = (period: string) => {
        const multipliers = {
            "Last 30 Days": 1,
            "Last 90 Days": 2.8,
            "Year to Date": 8.5,
            "Previous Quarter": 2.2
        }

        const multiplier = multipliers[period as keyof typeof multipliers] || 1

        return {
            kpiStats: [
                { title: "Annual Recurring Revenue", value: `$${(1.24 * multiplier).toFixed(1)}M`, change: `+${(12.5 * multiplier / 2).toFixed(1)}%`, trend: "up" as const, icon: DollarSign, color: "indigo", path: "/client-management/revenue" },
                { title: "Total Active Clients", value: totalClients > 0 ? `${totalClients}` : `${Math.round(342 * multiplier / 2)}`, change: totalClients > 0 ? `${totalClients} total` : `+${Math.round(4 * multiplier)}`, trend: "up" as const, icon: Users, color: "emerald", path: "/client-management/customers" },
                { title: "Average Health Score", value: `${Math.round(84 + (multiplier - 1) * 3)}/100`, change: `+${(2.1 * multiplier / 3).toFixed(1)}%`, trend: "up" as const, icon: HeartPulse, color: "violet", path: "/client-management/customers/health" },
                { title: "Gross Churn Rate", value: `${(1.2 / multiplier).toFixed(1)}%`, change: `-${(0.4 * multiplier / 2).toFixed(1)}%`, trend: "down" as const, icon: AlertCircle, color: "rose", path: "/client-management/analytics/retention" },
                { title: "Net Revenue Retention", value: `${Math.round(118 + (multiplier - 1) * 5)}%`, change: `+${(3.2 * multiplier / 2).toFixed(1)}%`, trend: "up" as const, icon: TrendingUp, color: "cyan", path: "/client-management/analytics/revenue" },
                { title: "Customer Lifetime Value", value: `$${(45.2 * multiplier / 2).toFixed(1)}k`, change: `+${(8.1 * multiplier / 3).toFixed(1)}%`, trend: "up" as const, icon: Target, color: "amber", path: "/client-management/analytics/cohorts" },
            ],
            revenueData: revenueData.map(item => ({
                ...item,
                revenue: Math.round(item.revenue * multiplier / 2),
                retention: Math.min(99, Math.round(item.retention + (multiplier - 1) * 2)),
                expansion: Math.round(item.expansion * multiplier / 3)
            })),
            supportMetrics: [
                { title: "Open Tickets", value: `${Math.round(23 * multiplier / 2)}`, change: `-${(12 * multiplier / 4).toFixed(0)}%`, trend: "down", color: "rose" },
                { title: "Avg Response Time", value: `${(2.4 / multiplier).toFixed(1)}h`, change: `-${(18 * multiplier / 3).toFixed(0)}%`, trend: "down", color: "emerald" },
                { title: "Resolution Rate", value: `${Math.min(99, Math.round(94 + (multiplier - 1) * 2))}%`, change: `+${(3 * multiplier / 2).toFixed(0)}%`, trend: "up", color: "indigo" },
                { title: "CSAT Score", value: `${Math.min(5, (4.7 + (multiplier - 1) * 0.1)).toFixed(1)}/5`, change: `+${(0.2 * multiplier / 2).toFixed(1)}`, trend: "up", color: "violet" },
            ]
        }
    }

    const currentData = getDataForPeriod(selectedPeriod)

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period)
        toast.success(`Data updated for ${period}`)
    }

    const handleAddClient = () => {
        setIsAddClientDialogOpen(true)
    }

    const handleFilter = () => {
        toast.success("Opening filter options...")
    }

    const handleAddTask = () => {
        toast.success("Add new task dialog opening...")
    }

    const handleViewAllActivities = () => {
        router.push('/client-management/communication/history')
        toast.success("Opening activity history...")
    }

    const handleClientFormChange = (field: string, value: string) => {
        setClientFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSaveClient = async () => {
        // Validation
        if (!clientFormData.companyName || !clientFormData.contactName || !clientFormData.email) {
            toast.error("Please fill in all required fields")
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(clientFormData.email)) {
            toast.error("Please enter a valid email address")
            return
        }

        // Save client via API
        try {
            const { addClient } = await import("@/modules/crm/clients/hooks/clientHooks")
            await addClient(clientFormData)
            toast.success(`Client "${clientFormData.companyName}" added successfully!`)
            // Refresh clients
            const res = await getAllClients()
            const data = res?.data?.clients || res?.data || []
            if (Array.isArray(data)) setClients(data)
        } catch (err) {
            console.error("Error saving client:", err)
            toast.error("Failed to save client")
        }
        setIsAddClientDialogOpen(false)

        // Reset form
        setClientFormData({
            companyName: "",
            contactName: "",
            email: "",
            phone: "",
            industry: "",
            tier: "",
            mrr: "",
            website: "",
            address: "",
            notes: ""
        })
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900 font-outfit">Client Management</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1 font-outfit">Manage your client relationships and drive growth</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm mr-2">
                                <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                <select
                                    className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer font-outfit text-slate-700 outline-none"
                                    value={selectedPeriod}
                                    onChange={(e) => handlePeriodChange(e.target.value)}
                                >
                                    <option value="Last 30 Days">Last 30 Days</option>
                                    <option value="Last 90 Days">Last 90 Days</option>
                                    <option value="Year to Date">Year to Date</option>
                                    <option value="Previous Quarter">Previous Quarter</option>
                                </select>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search clients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 font-outfit"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="font-outfit h-10" onClick={handleFilter}>
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 font-outfit h-10 shadow-sm" onClick={handleAddClient}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Client
                            </Button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {currentData.kpiStats.map((stat, index) => (
                            <MetricCard key={index} {...stat} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 font-outfit">
                        <TabsTrigger value="overview" className="font-outfit">Overview</TabsTrigger>
                        <TabsTrigger value="health" className="font-outfit">Health</TabsTrigger>
                        <TabsTrigger value="revenue" className="font-outfit">Revenue</TabsTrigger>
                        <TabsTrigger value="support" className="font-outfit">Support</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-outfit">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-3">
                                        {quickActions.map((action, index) => (
                                            <QuickActionCard
                                                key={index}
                                                {...action}
                                                onAction={action.action === "add-client" ? handleAddClient : undefined}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Revenue Trend */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="font-outfit">Revenue Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={currentData.revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" className="font-outfit" />
                                            <YAxis className="font-outfit" />
                                            <RechartsTooltip />
                                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* At-Risk Clients */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="font-outfit">At-Risk Clients</CardTitle>
                                    <Badge variant="destructive" className="font-outfit">{riskClients.length}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {riskClients.slice(0, 4).map((client) => (
                                            <div key={client.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-indigo-600 font-outfit">{client.logo}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 font-outfit">{client.name}</p>
                                                        <p className="text-sm text-slate-500 font-outfit">{client.reason}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2">
                                                        <Progress value={client.health} className="w-16" />
                                                        <span className="text-sm font-medium text-slate-500 font-outfit">{client.health}%</span>
                                                    </div>
                                                    <p className="text-sm text-slate-400 font-outfit">{client.mrr}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Renewals */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="font-outfit">Upcoming Renewals</CardTitle>
                                    <Badge variant="secondary" className="font-outfit">{upcomingRenewals.length}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {upcomingRenewals.slice(0, 4).map((renewal) => (
                                            <div key={renewal.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-slate-900 font-outfit">{renewal.name}</p>
                                                    <p className="text-sm text-slate-500 font-outfit">{renewal.date}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-slate-900 font-outfit">{renewal.value}</p>
                                                    <Badge
                                                        variant={renewal.probability === 'High' ? 'default' : renewal.probability === 'Medium' ? 'secondary' : 'destructive'}
                                                        className="font-outfit"
                                                    >
                                                        {renewal.probability}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Activities & Tasks Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="font-outfit">Recent Activities</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-indigo-600 font-outfit text-xs" onClick={handleViewAllActivities}>View All</Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-5">
                                        {recentActivities.map((activity) => (
                                            <div key={activity.id} className="flex items-start space-x-4">
                                                <div className={`mt-0.5 p-2 rounded-full ${activity.bg} shrink-0`}>
                                                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] text-slate-700 font-outfit leading-tight">
                                                        <span className="font-semibold text-slate-900">{activity.user}</span> {activity.action} <span className="font-semibold text-slate-900">{activity.target}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-400 font-outfit mt-1 flex items-center">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="font-outfit">My Tasks for Today</CardTitle>
                                    <Badge variant="outline" className="text-indigo-600 border-indigo-200">{tasks.filter(t => t.status === 'pending').length} Pending</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {tasks.map((task) => (
                                            <div key={task.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${task.status === 'done' ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 group-hover:border-indigo-400'}`}>
                                                        {task.status === 'done' && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                                    </div>
                                                    <span className={`text-[13px] font-medium font-outfit ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-slate-700'}`}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge className={`text-[10px] font-bold ${task.priority === 'Critical' ? 'bg-rose-100 text-rose-600 hover:bg-rose-100' :
                                                        task.priority === 'High' ? 'bg-orange-100 text-orange-600 hover:bg-orange-100' :
                                                            'bg-slate-100 text-slate-500 hover:bg-slate-100'
                                                        }`}>
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" className="w-full mt-2 border-dashed border-gray-300 text-slate-400 font-outfit text-[13px] h-10 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30" onClick={handleAddTask}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add New Task
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Health Tab */}
                    <TabsContent value="health" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Health Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-outfit">Health Score Distribution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={healthDistribution}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {healthDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Critical Alerts */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-outfit">Critical Alerts</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentAlerts.map((alert) => (
                                            <div key={alert.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                                                <AlertCircle className={`h-5 w-5 mt-0.5 ${alert.severity === 'critical' ? 'text-red-500' :
                                                    alert.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'
                                                    }`} />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-slate-900 font-outfit">{alert.type}</p>
                                                        <span className="text-xs text-slate-400 font-outfit">{alert.time}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 font-outfit">{alert.client}: {alert.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Revenue Tab */}
                    <TabsContent value="revenue" className="space-y-6">
                        {/* Revenue KPIs Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 font-outfit">Monthly Recurring Revenue</p>
                                            <p className="text-xl font-bold text-slate-900 font-outfit">$103.3k</p>
                                        </div>
                                        <div className="text-emerald-600">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-emerald-600 font-outfit mt-1">+8.2% from last month</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 font-outfit">Net Revenue Retention</p>
                                            <p className="text-xl font-bold text-slate-900 font-outfit">118%</p>
                                        </div>
                                        <div className="text-blue-600">
                                            <Target className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-blue-600 font-outfit mt-1">+3.2% from last quarter</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 font-outfit">Expansion Revenue</p>
                                            <p className="text-xl font-bold text-slate-900 font-outfit">$18.7k</p>
                                        </div>
                                        <div className="text-purple-600">
                                            <ArrowUpRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-purple-600 font-outfit mt-1">+15.4% this month</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200/50">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 font-outfit">Revenue at Risk</p>
                                            <p className="text-xl font-bold text-slate-900 font-outfit">$12.4k</p>
                                        </div>
                                        <div className="text-orange-600">
                                            <AlertCircle className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-orange-600 font-outfit mt-1">3 contracts expiring</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Revenue Trend Chart */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-outfit">Revenue Trend (6 Months)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={currentData.revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" className="font-outfit" />
                                            <YAxis className="font-outfit" />
                                            <RechartsTooltip />
                                            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} />
                                            <Line type="monotone" dataKey="expansion" stroke="#10b981" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Client Status Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-outfit">Client Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={clientStatusData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, value }) => `${name}: ${value}`}
                                            >
                                                {clientStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Expansion Opportunities */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="font-outfit">Expansion Opportunities</CardTitle>
                                    <Badge variant="secondary" className="font-outfit">{expansionOpportunities.length}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {expansionOpportunities.map((opportunity) => (
                                            <div key={opportunity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-slate-900 font-outfit">{opportunity.client}</p>
                                                    <p className="text-sm text-slate-500 font-outfit">{opportunity.opportunity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-slate-900 font-outfit">{opportunity.value}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <Progress value={opportunity.probability} className="w-16" />
                                                        <span className="text-sm text-slate-500 font-outfit">{opportunity.probability}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Revenue Clients */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-outfit">Top Revenue Clients</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'TechFlow Solutions', revenue: '$24,500', growth: '+12%', logo: 'TF' },
                                            { name: 'DataCorp Inc', revenue: '$18,200', growth: '+8%', logo: 'DC' },
                                            { name: 'CloudScale Inc', revenue: '$15,800', growth: '+15%', logo: 'CS' },
                                            { name: 'GreenEnergy Co', revenue: '$12,400', growth: '+5%', logo: 'GE' },
                                        ].map((client, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-indigo-600 font-outfit">{client.logo}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 font-outfit">{client.name}</p>
                                                        <p className="text-sm text-emerald-600 font-outfit">{client.growth} growth</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-slate-900 font-outfit">{client.revenue}</p>
                                                    <p className="text-sm text-slate-400 font-outfit">monthly</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Revenue by Tier */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-outfit">Revenue by Subscription Tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={tierData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" className="font-outfit" />
                                        <YAxis className="font-outfit" />
                                        <RechartsTooltip />
                                        <Bar dataKey="revenue" fill="#6366f1" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Support Tab */}
                    <TabsContent value="support" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {currentData.supportMetrics.map((metric, index) => (
                                <Card key={index}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 font-outfit">{metric.title}</p>
                                                <p className="text-2xl font-bold text-slate-900 font-outfit">{metric.value}</p>
                                            </div>
                                            <div className={`flex items-center space-x-1 ${metric.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                <ArrowUpRight className={`h-4 w-4 ${metric.trend === 'down' ? 'rotate-90' : ''}`} />
                                                <span className="text-sm font-medium font-outfit">{metric.change}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Support Tickets Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-outfit">Recent Support Activities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.filter(activity =>
                                        activity.action.includes('support') ||
                                        activity.action.includes('ticket') ||
                                        activity.action.includes('call')
                                    ).map((activity) => (
                                        <div key={activity.id} className="flex items-center space-x-4">
                                            <div className={`p-2 rounded-full ${activity.bg}`}>
                                                <activity.icon className={`h-4 w-4 ${activity.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-outfit">
                                                    <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                                                </p>
                                                <p className="text-xs text-slate-400 font-outfit">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add Client Dialog */}
            <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
                <DialogContent className="max-w-4xl w-[95vw] max-h-[85vh] overflow-y-auto font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold font-outfit">Add New Client</DialogTitle>
                        <DialogDescription className="font-outfit">
                            Fill in the details to add a new client to your system
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 py-4">
                        {/* Company Information */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900 font-outfit">Company Information</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="companyName" className="font-outfit text-xs">Company Name <span className="text-red-500">*</span></Label>
                                    <Input id="companyName" placeholder="Acme Corp" value={clientFormData.companyName} onChange={(e) => handleClientFormChange("companyName", e.target.value)} className="font-outfit text-sm h-9" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="industry" className="font-outfit text-xs">Industry</Label>
                                    <Select value={clientFormData.industry} onValueChange={(value) => handleClientFormChange("industry", value)}>
                                        <SelectTrigger className="font-outfit text-sm h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent><SelectItem value="technology">Technology</SelectItem><SelectItem value="finance">Finance</SelectItem><SelectItem value="healthcare">Healthcare</SelectItem><SelectItem value="retail">Retail</SelectItem><SelectItem value="manufacturing">Manufacturing</SelectItem><SelectItem value="education">Education</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="tier" className="font-outfit text-xs">Tier</Label>
                                    <Select value={clientFormData.tier} onValueChange={(value) => handleClientFormChange("tier", value)}>
                                        <SelectTrigger className="font-outfit text-sm h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent><SelectItem value="starter">Starter</SelectItem><SelectItem value="professional">Professional</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem><SelectItem value="custom">Custom</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="website" className="font-outfit text-xs">Website</Label>
                                    <Input id="website" placeholder="example.com" value={clientFormData.website} onChange={(e) => handleClientFormChange("website", e.target.value)} className="font-outfit text-sm h-9" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="mrr" className="font-outfit text-xs">MRR</Label>
                                    <Input id="mrr" placeholder="5000" type="number" value={clientFormData.mrr} onChange={(e) => handleClientFormChange("mrr", e.target.value)} className="font-outfit text-sm h-9" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="address" className="font-outfit text-xs">Address</Label>
                                    <Input id="address" placeholder="123 Main St" value={clientFormData.address} onChange={(e) => handleClientFormChange("address", e.target.value)} className="font-outfit text-sm h-9" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-3 pt-3 border-t">
                            <h3 className="text-sm font-semibold text-slate-900 font-outfit">Primary Contact</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="contactName" className="font-outfit text-xs">Name <span className="text-red-500">*</span></Label>
                                    <Input id="contactName" placeholder="John Doe" value={clientFormData.contactName} onChange={(e) => handleClientFormChange("contactName", e.target.value)} className="font-outfit text-sm h-9" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="font-outfit text-xs">Email <span className="text-red-500">*</span></Label>
                                    <Input id="email" type="email" placeholder="john@example.com" value={clientFormData.email} onChange={(e) => handleClientFormChange("email", e.target.value)} className="font-outfit text-sm h-9" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="font-outfit text-xs">Phone</Label>
                                    <Input id="phone" placeholder="+1 555-1234" value={clientFormData.phone} onChange={(e) => handleClientFormChange("phone", e.target.value)} className="font-outfit text-sm h-9" />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5 pt-3 border-t">
                            <Label htmlFor="notes" className="font-outfit text-xs">Notes</Label>
                            <Textarea id="notes" placeholder="Additional notes..." value={clientFormData.notes} onChange={(e) => handleClientFormChange("notes", e.target.value)} className="font-outfit text-sm min-h-[50px]" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsAddClientDialogOpen(false)}
                            className="font-outfit"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveClient}
                            className="bg-indigo-600 hover:bg-indigo-700 font-outfit"
                        >
                            Add Client
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
