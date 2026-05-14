"use client"

import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import {
    ArrowUpRight,
    Users,
    HeartPulse,
    DollarSign,
    AlertCircle,
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
    Clock,
    Pencil,
    Trash2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Progress } from "@/shared/components/ui/progress"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { toast } from "@/shared/utils/toast"
import { getAllClients, getClientsActivity } from "@/modules/crm/clients/hooks/clientHooks"

// Mock data
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

const initialRiskClients = [
    { id: 1, name: 'Acme Corp', logo: 'AC', health: 42, mrr: '$4,200', reason: 'Low platform usage', status: 'critical', lastContact: '5 days ago', csm: 'John Doe' },
    { id: 2, name: 'Stark Industries', logo: 'SI', health: 58, mrr: '$12,500', reason: 'Unresolved support tickets', status: 'warning', lastContact: '2 days ago', csm: 'Sarah Smith' },
    { id: 3, name: 'Globex Corporation', logo: 'GL', health: 65, mrr: '$2,100', reason: 'Payment failed', status: 'warning', lastContact: '1 day ago', csm: 'Alex Wong' },
    { id: 4, name: 'Wayne Enterprises', logo: 'WE', health: 38, mrr: '$8,900', reason: 'Contract expiring soon', status: 'critical', lastContact: '7 days ago', csm: 'Maria Garcia' },
]

const initialRenewals = [
    { id: 1, name: 'CloudScale Inc', date: 'Oct 12, 2024', value: '$12k', probability: 'High', daysLeft: 5, csm: 'John Doe' },
    { id: 2, name: 'DataFlow Systems', date: 'Oct 15, 2024', value: '$8.5k', probability: 'Medium', daysLeft: 8, csm: 'Sarah Smith' },
    { id: 3, name: 'GreenEnergy Co', date: 'Oct 22, 2024', value: '$45k', probability: 'High', daysLeft: 15, csm: 'Alex Wong' },
    { id: 4, name: 'Swift Logistics', date: 'Nov 02, 2024', value: '$2.2k', probability: 'At Risk', daysLeft: 26, csm: 'Maria Garcia' },
    { id: 5, name: 'TechFlow Solutions', date: 'Nov 08, 2024', value: '$18k', probability: 'High', daysLeft: 32, csm: 'David Chen' },
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

const quickActions = [
    { title: "Add New Client", icon: Plus, color: "indigo", action: "add-client" },
    { title: "Schedule Review", icon: Calendar, color: "emerald", action: "schedule-review", path: "/client-management/communication/templates" },
    { title: "Send Survey", icon: MessageSquare, color: "violet", action: "send-survey", path: "/client-management/communication/campaigns" },
    { title: "Generate Report", icon: FileText, color: "amber", action: "generate-report", path: "/client-management/reports/custom" },
]

const initialTasks = [
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

const recentAlerts = [
    { id: 1, type: "Health Drop", client: "Acme Corp", message: "Health score dropped to 42", severity: "critical", time: "5m ago" },
    { id: 2, type: "Payment Failed", client: "Globex", message: "Payment failed for invoice #INV-2024-001", severity: "high", time: "15m ago" },
    { id: 3, type: "Contract Expiring", client: "Wayne Enterprises", message: "Contract expires in 7 days", severity: "warning", time: "1h ago" },
    { id: 4, type: "Support Escalation", client: "Stark Industries", message: "Ticket escalated to management", severity: "high", time: "2h ago" },
]

// Validation helpers
const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    email: (v: string) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "Enter a valid email address" : "",
    phone: (v: string) => v && !/^[+\d][\d\s().-]{6,20}$/.test(v.trim()) ? "Enter a valid phone number" : "",
    website: (v: string) => v && !/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([/?#].*)?$/i.test(v.trim()) ? "Enter a valid website (e.g., example.com)" : "",
    number: (v: string) => v && !/^\d+(\.\d{1,2})?$/.test(v.toString().trim()) ? "Enter a valid number" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

const colorMap: Record<string, { bg: string; iconBg: string; iconColor: string; border: string }> = {
    indigo: { bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', border: 'border-indigo-200/50' },
    emerald: { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', border: 'border-emerald-200/50' },
    violet: { bg: 'bg-gradient-to-br from-violet-50 to-violet-100/50', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', border: 'border-violet-200/50' },
    rose: { bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', border: 'border-rose-200/50' },
    cyan: { bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100/50', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600', border: 'border-cyan-200/50' },
    amber: { bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', border: 'border-amber-200/50' },
}

const MetricCard = ({ title, value, change, trend, icon: Icon, color, onClick }: {
    title: string; value: string; change: string; trend: "up" | "down"; icon: any; color: string; onClick?: () => void
}) => {
    const cc = colorMap[color] || colorMap.indigo
    return (
        <Card className={`rounded-none cursor-pointer transition-all duration-200 hover:shadow-lg ${cc.bg} ${cc.border} border`} onClick={onClick}>
            <CardContent className="p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-none ${cc.iconBg} shadow-sm`}>
                            <Icon className={`h-5 w-5 ${cc.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{title}</p>
                            <p className="text-2xl font-bold text-slate-900">{value}</p>
                        </div>
                    </div>
                    <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        <ArrowUpRight className={`h-4 w-4 ${trend === 'down' ? 'rotate-90' : ''}`} />
                        <span className="text-sm font-medium">{change}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const QuickActionCard = ({ title, icon: Icon, color, onClick }: { title: string; icon: any; color: string; onClick: () => void }) => (
    <Card className="rounded-none cursor-pointer transition-all duration-200 hover:shadow-md" onClick={onClick}>
        <CardContent className="p-4 text-center">
            <div className={`mx-auto mb-3 p-3 rounded-none bg-${color}-100 w-fit`}>
                <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
            <p className="text-sm font-medium text-slate-900">{title}</p>
        </CardContent>
    </Card>
)

export default function ClientManagementPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = React.useState("")
    const [selectedTab, setSelectedTab] = React.useState("overview")
    const [selectedPeriod, setSelectedPeriod] = React.useState("Last 30 Days")
    const [clients, setClients] = React.useState<any[]>([])

    // Forms
    const [isClientFormOpen, setIsClientFormOpen] = React.useState(false)
    const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [detailData, setDetailData] = React.useState<any>(null)
    const [detailType, setDetailType] = React.useState<"client" | "renewal" | "activity" | "alert" | "opportunity" | null>(null)

    // Lists
    const [riskClients, setRiskClients] = React.useState(initialRiskClients)
    const [renewals, setRenewals] = React.useState(initialRenewals)
    const [tasks, setTasks] = React.useState(initialTasks)

    // Client form
    const [editingClientId, setEditingClientId] = React.useState<number | null>(null)
    const [clientForm, setClientForm] = React.useState({
        companyName: "", contactName: "", email: "", phone: "", industry: "", tier: "", mrr: "", website: "", address: "", notes: ""
    })
    const [clientErrors, setClientErrors] = React.useState<Record<string, string>>({})

    // Task form
    const [editingTaskId, setEditingTaskId] = React.useState<number | null>(null)
    const [taskForm, setTaskForm] = React.useState({ title: "", priority: "Medium", due: "Today" })
    const [taskErrors, setTaskErrors] = React.useState<Record<string, string>>({})

    // Filter state
    const [filterForm, setFilterForm] = React.useState({ tier: "all", status: "all", health: "all" })

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientsRes] = await Promise.allSettled([
                    getAllClients(),
                    getClientsActivity()
                ])
                if (clientsRes.status === 'fulfilled') {
                    const data = clientsRes.value?.data?.clients || clientsRes.value?.data || []
                    if (Array.isArray(data)) setClients(data)
                }
            } catch (err) {
                console.error('Failed to fetch client data:', err)
            }
        }
        fetchData()
    }, [])

    const totalClients = clients.length
    const getDataForPeriod = (period: string) => {
        const multipliers = { "Last 30 Days": 1, "Last 90 Days": 2.8, "Year to Date": 8.5, "Previous Quarter": 2.2 }
        const m = multipliers[period as keyof typeof multipliers] || 1
        return {
            kpiStats: [
                { title: "Annual Recurring Revenue", value: `$${(1.24 * m).toFixed(1)}M`, change: `+${(12.5 * m / 2).toFixed(1)}%`, trend: "up" as const, icon: DollarSign, color: "indigo", path: "/client-management/revenue/overview" },
                { title: "Total Active Clients", value: totalClients > 0 ? `${totalClients}` : `${Math.round(342 * m / 2)}`, change: totalClients > 0 ? `${totalClients} total` : `+${Math.round(4 * m)}`, trend: "up" as const, icon: Users, color: "emerald", path: "/client-management/customers" },
                { title: "Average Health Score", value: `${Math.round(84 + (m - 1) * 3)}/100`, change: `+${(2.1 * m / 3).toFixed(1)}%`, trend: "up" as const, icon: HeartPulse, color: "violet", path: "/client-management/customers/health" },
                { title: "Gross Churn Rate", value: `${(1.2 / m).toFixed(1)}%`, change: `-${(0.4 * m / 2).toFixed(1)}%`, trend: "down" as const, icon: AlertCircle, color: "rose", path: "/client-management/analytics/retention" },
                { title: "Net Revenue Retention", value: `${Math.round(118 + (m - 1) * 5)}%`, change: `+${(3.2 * m / 2).toFixed(1)}%`, trend: "up" as const, icon: TrendingUp, color: "cyan", path: "/client-management/analytics/revenue" },
                { title: "Customer Lifetime Value", value: `$${(45.2 * m / 2).toFixed(1)}k`, change: `+${(8.1 * m / 3).toFixed(1)}%`, trend: "up" as const, icon: Target, color: "amber", path: "/client-management/analytics/cohorts" },
            ],
            revenueData: revenueData.map(item => ({
                ...item,
                revenue: Math.round(item.revenue * m / 2),
                retention: Math.min(99, Math.round(item.retention + (m - 1) * 2)),
                expansion: Math.round(item.expansion * m / 3)
            })),
            supportMetrics: [
                { title: "Open Tickets", value: `${Math.round(23 * m / 2)}`, change: `-${(12 * m / 4).toFixed(0)}%`, trend: "down", color: "rose", path: "/client-management/support/tickets" },
                { title: "Avg Response Time", value: `${(2.4 / m).toFixed(1)}h`, change: `-${(18 * m / 3).toFixed(0)}%`, trend: "down", color: "emerald", path: "/client-management/support/sla" },
                { title: "Resolution Rate", value: `${Math.min(99, Math.round(94 + (m - 1) * 2))}%`, change: `+${(3 * m / 2).toFixed(0)}%`, trend: "up", color: "indigo", path: "/client-management/support/overview" },
                { title: "CSAT Score", value: `${Math.min(5, (4.7 + (m - 1) * 0.1)).toFixed(1)}/5`, change: `+${(0.2 * m / 2).toFixed(1)}`, trend: "up", color: "violet", path: "/client-management/customers/feedback" },
            ]
        }
    }
    const currentData = getDataForPeriod(selectedPeriod)

    // Filter risk clients via search term
    const filteredRiskClients = React.useMemo(() => {
        const q = searchTerm.trim().toLowerCase()
        if (!q) return riskClients
        return riskClients.filter(c => c.name.toLowerCase().includes(q) || c.csm.toLowerCase().includes(q))
    }, [riskClients, searchTerm])

    // ---- Client form handlers ----
    const openAddClient = () => {
        setEditingClientId(null)
        setClientForm({ companyName: "", contactName: "", email: "", phone: "", industry: "", tier: "", mrr: "", website: "", address: "", notes: "" })
        setClientErrors({})
        setIsClientFormOpen(true)
    }

    const validateClient = (): boolean => {
        const errs: Record<string, string> = {}
        errs.companyName = validators.required(clientForm.companyName) || validators.minLen(2)(clientForm.companyName)
        errs.contactName = validators.required(clientForm.contactName) || validators.minLen(2)(clientForm.contactName)
        errs.email = validators.required(clientForm.email) || validators.email(clientForm.email)
        errs.phone = validators.phone(clientForm.phone)
        errs.website = validators.website(clientForm.website)
        errs.mrr = validators.number(clientForm.mrr)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setClientErrors(errs)
        return Object.keys(errs).length === 0
    }

    const setClientField = (field: string, value: string) => {
        setClientForm(prev => ({ ...prev, [field]: value }))
        if (clientErrors[field]) setClientErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const handleSaveClient = async () => {
        if (!validateClient()) {
            toast.error("Please correct the highlighted fields")
            return
        }
        try {
            const { addClient } = await import("@/modules/crm/clients/hooks/clientHooks")
            await addClient(clientForm)
            toast.success(`Client "${clientForm.companyName}" added successfully`)
            const res = await getAllClients()
            const data = res?.data?.clients || res?.data || []
            if (Array.isArray(data)) setClients(data)
        } catch {
            toast.success(`Client "${clientForm.companyName}" added locally`)
        }
        setIsClientFormOpen(false)
    }

    // ---- Task form handlers ----
    const openAddTask = () => {
        setEditingTaskId(null)
        setTaskForm({ title: "", priority: "Medium", due: "Today" })
        setTaskErrors({})
        setIsTaskFormOpen(true)
    }

    const openEditTask = (task: typeof initialTasks[0]) => {
        setEditingTaskId(task.id)
        setTaskForm({ title: task.title, priority: task.priority, due: task.due })
        setTaskErrors({})
        setIsTaskFormOpen(true)
    }

    const validateTask = (): boolean => {
        const errs: Record<string, string> = {}
        errs.title = validators.required(taskForm.title) || validators.minLen(3)(taskForm.title)
        errs.priority = validators.required(taskForm.priority)
        errs.due = validators.required(taskForm.due)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setTaskErrors(errs)
        return Object.keys(errs).length === 0
    }

    const setTaskField = (field: string, value: string) => {
        setTaskForm(prev => ({ ...prev, [field]: value }))
        if (taskErrors[field]) setTaskErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const handleSaveTask = () => {
        if (!validateTask()) {
            toast.error("Please correct the highlighted fields")
            return
        }
        if (editingTaskId) {
            setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, ...taskForm } : t))
            toast.success("Task updated")
        } else {
            setTasks([{ id: Date.now(), ...taskForm, status: 'pending' }, ...tasks])
            toast.success("Task added")
        }
        setIsTaskFormOpen(false)
    }

    const handleToggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t))
    }

    const handleDeleteTask = (id: number) => {
        setTasks(tasks.filter(t => t.id !== id))
        toast.success("Task removed")
    }

    // ---- Detail open ----
    const openDetail = (type: typeof detailType, data: any) => {
        setDetailType(type)
        setDetailData(data)
        setIsDetailOpen(true)
    }

    // ---- Renewal CRUD (delete only - inline) ----
    const handleDeleteRenewal = (id: number) => {
        setRenewals(renewals.filter(r => r.id !== id))
        toast.success("Renewal dismissed")
    }

    const handleApplyFilter = () => {
        toast.success("Filters applied")
        setIsFilterOpen(false)
    }

    const handleResetFilter = () => {
        setFilterForm({ tier: "all", status: "all", health: "all" })
        toast.success("Filters reset")
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Client Management</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">Manage your client relationships and drive growth</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-white border border-slate-200 rounded-none px-3 py-1.5 shadow-sm mr-2">
                                <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                <select
                                    className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-slate-700 outline-none"
                                    value={selectedPeriod}
                                    onChange={(e) => { setSelectedPeriod(e.target.value); toast.success(`Data updated for ${e.target.value}`) }}
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
                                    className="pl-10 w-64 rounded-none"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                                <Filter className="h-4 w-4 mr-2" />Filter
                            </Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-none h-10 shadow-sm" onClick={openAddClient}>
                                <Plus className="h-4 w-4 mr-2" />Add Client
                            </Button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-2">
                        {currentData.kpiStats.map((stat, i) => (
                            <MetricCard key={i} {...stat} onClick={() => router.push(stat.path)} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 rounded-none">
                        <TabsTrigger value="overview" className="rounded-none">Overview</TabsTrigger>
                        <TabsTrigger value="health" className="rounded-none">Health</TabsTrigger>
                        <TabsTrigger value="revenue" className="rounded-none">Revenue</TabsTrigger>
                        <TabsTrigger value="support" className="rounded-none">Support</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-3">
                                        {quickActions.map((action, i) => (
                                            <QuickActionCard
                                                key={i}
                                                title={action.title}
                                                icon={action.icon}
                                                color={action.color}
                                                onClick={() => {
                                                    if (action.action === 'add-client') openAddClient()
                                                    else if (action.path) router.push(action.path)
                                                }}
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2 rounded-none">
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold">Revenue Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={currentData.revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* At-Risk Clients */}
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-semibold">At-Risk Clients</CardTitle>
                                    <Badge variant="destructive" className="rounded-none">{filteredRiskClients.length}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {filteredRiskClients.slice(0, 4).map((client) => (
                                            <div key={client.id}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-none cursor-pointer hover:bg-slate-100 transition"
                                                onClick={() => openDetail("client", client)}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-none flex items-center justify-center">
                                                        <span className="text-sm font-medium text-indigo-600">{client.logo}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{client.name}</p>
                                                        <p className="text-sm text-slate-500">{client.reason}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2">
                                                        <Progress value={client.health} className="w-16" />
                                                        <span className="text-sm font-medium text-slate-500">{client.health}%</span>
                                                    </div>
                                                    <p className="text-sm text-slate-400">{client.mrr}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {filteredRiskClients.length === 0 && (
                                            <p className="text-center text-sm text-slate-400 py-6">No clients match the search.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Renewals */}
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-semibold">Upcoming Renewals</CardTitle>
                                    <Badge variant="secondary" className="rounded-none">{renewals.length}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {renewals.slice(0, 4).map((renewal) => (
                                            <div key={renewal.id}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-none cursor-pointer hover:bg-slate-100 transition group"
                                                onClick={() => openDetail("renewal", renewal)}
                                            >
                                                <div>
                                                    <p className="font-medium text-slate-900">{renewal.name}</p>
                                                    <p className="text-sm text-slate-500">{renewal.date} • {renewal.daysLeft}d left</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="font-medium text-slate-900">{renewal.value}</p>
                                                        <Badge
                                                            variant={renewal.probability === 'High' ? 'default' : renewal.probability === 'Medium' ? 'secondary' : 'destructive'}
                                                            className="rounded-none"
                                                        >
                                                            {renewal.probability}
                                                        </Badge>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-rose-500 opacity-0 group-hover:opacity-100"
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteRenewal(renewal.id) }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        {renewals.length === 0 && (
                                            <p className="text-center text-sm text-slate-400 py-6">No upcoming renewals.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Activities & Tasks */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-semibold">Recent Activities</CardTitle>
                                    <Button variant="ghost" size="sm" className="text-indigo-600 text-xs rounded-none" onClick={() => router.push('/client-management/communication/history')}>View All</Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-5">
                                        {recentActivities.map((activity) => (
                                            <div key={activity.id}
                                                className="flex items-start space-x-4 cursor-pointer hover:bg-slate-50 p-2 -mx-2 transition"
                                                onClick={() => openDetail("activity", activity)}
                                            >
                                                <div className={`mt-0.5 p-2 rounded-none ${activity.bg} shrink-0`}>
                                                    <activity.icon className={`h-4 w-4 ${activity.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] text-slate-700 leading-tight">
                                                        <span className="font-semibold text-slate-900">{activity.user}</span> {activity.action} <span className="font-semibold text-slate-900">{activity.target}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1 flex items-center">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-semibold">My Tasks for Today</CardTitle>
                                    <Badge variant="outline" className="text-indigo-600 border-indigo-200 rounded-none">{tasks.filter(t => t.status === 'pending').length} Pending</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {tasks.map((task) => (
                                            <div key={task.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-none hover:bg-slate-50/80 transition group">
                                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                    <button
                                                        onClick={() => handleToggleTask(task.id)}
                                                        className={`w-5 h-5 rounded-none border-2 flex items-center justify-center transition-colors shrink-0 ${task.status === 'done' ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 hover:border-indigo-400'}`}
                                                    >
                                                        {task.status === 'done' && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                                                    </button>
                                                    <span className={`text-[13px] font-medium truncate ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-slate-700'}`}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 shrink-0">
                                                    <Badge className={`text-[10px] font-bold rounded-none ${task.priority === 'Critical' ? 'bg-rose-100 text-rose-600 hover:bg-rose-100' :
                                                        task.priority === 'High' ? 'bg-orange-100 text-orange-600 hover:bg-orange-100' :
                                                            'bg-slate-100 text-slate-500 hover:bg-slate-100'}`}>
                                                        {task.priority}
                                                    </Badge>
                                                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditTask(task)}>
                                                            <Pencil className="h-3.5 w-3.5 text-slate-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteTask(task.id)}>
                                                            <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="outline" className="w-full mt-2 border-dashed border-gray-300 text-slate-400 text-[13px] h-10 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 rounded-none" onClick={openAddTask}>
                                            <Plus className="h-4 w-4 mr-2" />Add New Task
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Health Tab */}
                    <TabsContent value="health" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="rounded-none">
                                <CardHeader><CardTitle className="text-base font-semibold">Health Score Distribution</CardTitle></CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={healthDistribution} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                                {healthDistribution.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="rounded-none">
                                <CardHeader><CardTitle className="text-base font-semibold">Critical Alerts</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentAlerts.map((alert) => (
                                            <div key={alert.id}
                                                className="flex items-start space-x-3 p-3 bg-slate-50 rounded-none cursor-pointer hover:bg-slate-100 transition"
                                                onClick={() => openDetail("alert", alert)}
                                            >
                                                <AlertCircle className={`h-5 w-5 mt-0.5 ${alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'}`} />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-medium text-slate-900">{alert.type}</p>
                                                        <span className="text-xs text-slate-400">{alert.time}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-500">{alert.client}: {alert.message}</p>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { title: "Monthly Recurring Revenue", value: "$103.3k", change: "+8.2% from last month", color: "emerald", icon: TrendingUp, path: "/client-management/revenue/overview" },
                                { title: "Net Revenue Retention", value: "118%", change: "+3.2% from last quarter", color: "indigo", icon: Target, path: "/client-management/analytics/revenue" },
                                { title: "Expansion Revenue", value: "$18.7k", change: "+15.4% this month", color: "violet", icon: ArrowUpRight, path: "/client-management/revenue/expansion" },
                                { title: "Revenue at Risk", value: "$12.4k", change: "3 contracts expiring", color: "amber", icon: AlertCircle, path: "/client-management/revenue/renewals" },
                            ].map((m, i) => {
                                const cc = colorMap[m.color] || colorMap.indigo
                                return (
                                    <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} border ${cc.border}`} onClick={() => router.push(m.path)}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">{m.title}</p>
                                                    <p className="text-xl font-bold text-slate-900">{m.value}</p>
                                                </div>
                                                <div className={cc.iconColor}><m.icon className="h-5 w-5" /></div>
                                            </div>
                                            <p className={`text-xs ${cc.iconColor} mt-1`}>{m.change}</p>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="rounded-none">
                                <CardHeader><CardTitle className="text-base font-semibold">Revenue Trend (6 Months)</CardTitle></CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={currentData.revenueData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} />
                                            <Line type="monotone" dataKey="expansion" stroke="#10b981" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="rounded-none">
                                <CardHeader><CardTitle className="text-base font-semibold">Client Status</CardTitle></CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={clientStatusData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                                {clientStatusData.map((entry, i) => (<Cell key={`cell-${i}`} fill={entry.color} />))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="rounded-none">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-semibold">Expansion Opportunities</CardTitle>
                                    <Badge variant="secondary" className="rounded-none">{expansionOpportunities.length}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {expansionOpportunities.map((o) => (
                                            <div key={o.id}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-none cursor-pointer hover:bg-slate-100 transition"
                                                onClick={() => openDetail("opportunity", o)}
                                            >
                                                <div>
                                                    <p className="font-medium text-slate-900">{o.client}</p>
                                                    <p className="text-sm text-slate-500">{o.opportunity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-slate-900">{o.value}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <Progress value={o.probability} className="w-16" />
                                                        <span className="text-sm text-slate-500">{o.probability}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-none">
                                <CardHeader><CardTitle className="text-base font-semibold">Top Revenue Clients</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'TechFlow Solutions', revenue: '$24,500', growth: '+12%', logo: 'TF' },
                                            { name: 'DataCorp Inc', revenue: '$18,200', growth: '+8%', logo: 'DC' },
                                            { name: 'CloudScale Inc', revenue: '$15,800', growth: '+15%', logo: 'CS' },
                                            { name: 'GreenEnergy Co', revenue: '$12,400', growth: '+5%', logo: 'GE' },
                                        ].map((client, i) => (
                                            <div key={i}
                                                className="flex items-center justify-between p-3 bg-slate-50 rounded-none cursor-pointer hover:bg-slate-100 transition"
                                                onClick={() => openDetail("client", { ...client, mrr: client.revenue, health: 90, reason: 'Top performer', csm: 'Account Manager' })}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-none flex items-center justify-center">
                                                        <span className="text-sm font-medium text-indigo-600">{client.logo}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900">{client.name}</p>
                                                        <p className="text-sm text-emerald-600">{client.growth} growth</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-slate-900">{client.revenue}</p>
                                                    <p className="text-sm text-slate-400">monthly</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="rounded-none">
                            <CardHeader><CardTitle className="text-base font-semibold">Revenue by Subscription Tier</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={tierData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
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
                            {currentData.supportMetrics.map((metric, i) => (
                                <Card key={i} className="rounded-none cursor-pointer hover:shadow-md transition" onClick={() => router.push(metric.path)}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                                                <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                                            </div>
                                            <div className={`flex items-center space-x-1 ${metric.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                <ArrowUpRight className={`h-4 w-4 ${metric.trend === 'down' ? 'rotate-90' : ''}`} />
                                                <span className="text-sm font-medium">{metric.change}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="rounded-none">
                            <CardHeader><CardTitle className="text-base font-semibold">Recent Support Activities</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-center space-x-4 cursor-pointer hover:bg-slate-50 p-2 -mx-2 transition" onClick={() => openDetail("activity", activity)}>
                                            <div className={`p-2 rounded-none ${activity.bg}`}>
                                                <activity.icon className={`h-4 w-4 ${activity.color}`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm">
                                                    <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                                                </p>
                                                <p className="text-xs text-slate-400">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* ==================== Add/Edit Client Sheet ==================== */}
            <Sheet open={isClientFormOpen} onOpenChange={setIsClientFormOpen}>
                <SheetContent side="right" className="sm:max-w-lg w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900">
                            {editingClientId ? "Edit Client" : "Add New Client"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">Fill in the details below to {editingClientId ? "update" : "add"} a client.</p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <h4 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Company Information</h4>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Company Name <span className="text-rose-500">*</span></Label>
                            <Input value={clientForm.companyName} onChange={e => setClientField("companyName", e.target.value)} placeholder="Acme Corp" className={`h-10 rounded-none ${clientErrors.companyName ? "border-rose-500" : ""}`} />
                            {clientErrors.companyName && <p className="text-[11px] text-rose-500">{clientErrors.companyName}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Industry</Label>
                                <Select value={clientForm.industry} onValueChange={(v) => setClientField("industry", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="finance">Finance</SelectItem>
                                        <SelectItem value="healthcare">Healthcare</SelectItem>
                                        <SelectItem value="retail">Retail</SelectItem>
                                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                        <SelectItem value="education">Education</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Tier</Label>
                                <Select value={clientForm.tier} onValueChange={(v) => setClientField("tier", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="starter">Starter</SelectItem>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="enterprise">Enterprise</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Website</Label>
                                <Input value={clientForm.website} onChange={e => setClientField("website", e.target.value)} placeholder="example.com" className={`h-10 rounded-none ${clientErrors.website ? "border-rose-500" : ""}`} />
                                {clientErrors.website && <p className="text-[11px] text-rose-500">{clientErrors.website}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">MRR ($)</Label>
                                <Input type="number" value={clientForm.mrr} onChange={e => setClientField("mrr", e.target.value)} placeholder="5000" className={`h-10 rounded-none ${clientErrors.mrr ? "border-rose-500" : ""}`} />
                                {clientErrors.mrr && <p className="text-[11px] text-rose-500">{clientErrors.mrr}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Address</Label>
                            <Input value={clientForm.address} onChange={e => setClientField("address", e.target.value)} placeholder="123 Main St, City" className="h-10 rounded-none" />
                        </div>

                        <h4 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase pt-3 border-t">Primary Contact</h4>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Name <span className="text-rose-500">*</span></Label>
                                <Input value={clientForm.contactName} onChange={e => setClientField("contactName", e.target.value)} placeholder="John Doe" className={`h-10 rounded-none ${clientErrors.contactName ? "border-rose-500" : ""}`} />
                                {clientErrors.contactName && <p className="text-[11px] text-rose-500">{clientErrors.contactName}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Phone</Label>
                                <Input value={clientForm.phone} onChange={e => setClientField("phone", e.target.value)} placeholder="+1 555-1234" className={`h-10 rounded-none ${clientErrors.phone ? "border-rose-500" : ""}`} />
                                {clientErrors.phone && <p className="text-[11px] text-rose-500">{clientErrors.phone}</p>}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Email <span className="text-rose-500">*</span></Label>
                            <Input type="email" value={clientForm.email} onChange={e => setClientField("email", e.target.value)} placeholder="john@example.com" className={`h-10 rounded-none ${clientErrors.email ? "border-rose-500" : ""}`} />
                            {clientErrors.email && <p className="text-[11px] text-rose-500">{clientErrors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Notes</Label>
                            <Textarea value={clientForm.notes} onChange={e => setClientField("notes", e.target.value)} placeholder="Additional notes..." className="rounded-none min-h-[80px]" />
                        </div>
                    </div>

                    <div className="p-5 border-t border-slate-100 flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsClientFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={handleSaveClient}>
                            {editingClientId ? "Save Changes" : "Add Client"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* ==================== Add/Edit Task Sheet ==================== */}
            <Sheet open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-pink-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900">
                            {editingTaskId ? "Edit Task" : "Add New Task"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">Track your daily client management tasks.</p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Task Title <span className="text-rose-500">*</span></Label>
                            <Input value={taskForm.title} onChange={e => setTaskField("title", e.target.value)} placeholder="e.g., Follow-up with Acme Corp" className={`h-10 rounded-none ${taskErrors.title ? "border-rose-500" : ""}`} />
                            {taskErrors.title && <p className="text-[11px] text-rose-500">{taskErrors.title}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Priority <span className="text-rose-500">*</span></Label>
                            <Select value={taskForm.priority} onValueChange={(v) => setTaskField("priority", v)}>
                                <SelectTrigger className={`h-10 rounded-none ${taskErrors.priority ? "border-rose-500" : ""}`}><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                            {taskErrors.priority && <p className="text-[11px] text-rose-500">{taskErrors.priority}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Due <span className="text-rose-500">*</span></Label>
                            <Select value={taskForm.due} onValueChange={(v) => setTaskField("due", v)}>
                                <SelectTrigger className={`h-10 rounded-none ${taskErrors.due ? "border-rose-500" : ""}`}><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Today">Today</SelectItem>
                                    <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                                    <SelectItem value="This Week">This Week</SelectItem>
                                    <SelectItem value="Next Week">Next Week</SelectItem>
                                </SelectContent>
                            </Select>
                            {taskErrors.due && <p className="text-[11px] text-rose-500">{taskErrors.due}</p>}
                        </div>
                    </div>

                    <div className="p-5 border-t border-slate-100 flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsTaskFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={handleSaveTask}>
                            {editingTaskId ? "Save Changes" : "Add Task"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* ==================== Filter Sheet ==================== */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900">Filter Clients</SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">Narrow down the client view.</p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Tier</Label>
                            <Select value={filterForm.tier} onValueChange={v => setFilterForm({ ...filterForm, tier: v })}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Tiers</SelectItem>
                                    <SelectItem value="starter">Starter</SelectItem>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={filterForm.status} onValueChange={v => setFilterForm({ ...filterForm, status: v })}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="at-risk">At Risk</SelectItem>
                                    <SelectItem value="churned">Churned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Health Score</Label>
                            <Select value={filterForm.health} onValueChange={v => setFilterForm({ ...filterForm, health: v })}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Ranges</SelectItem>
                                    <SelectItem value="excellent">Excellent (90-100)</SelectItem>
                                    <SelectItem value="good">Good (70-89)</SelectItem>
                                    <SelectItem value="fair">Fair (50-69)</SelectItem>
                                    <SelectItem value="poor">Poor (0-49)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="p-5 border-t border-slate-100 flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={handleResetFilter}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={handleApplyFilter}>Apply Filters</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* ==================== Detail Sheet (clickable rows) ==================== */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900 capitalize">
                            {detailType} Details
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">Quick info on the selected record.</p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {detailData && detailType === "client" && (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-none flex items-center justify-center text-indigo-600 font-semibold">{detailData.logo}</div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{detailData.name}</p>
                                        <p className="text-xs text-slate-500">{detailData.csm}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">MRR</p><p className="font-semibold text-slate-900">{detailData.mrr}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Health</p><p className="font-semibold text-slate-900">{detailData.health}%</p></div>
                                    {detailData.lastContact && <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Last Contact</p><p className="font-semibold text-slate-900">{detailData.lastContact}</p></div>}
                                    {detailData.status && <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Status</p><Badge className={`rounded-none ${detailData.status === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>{detailData.status}</Badge></div>}
                                </div>
                                {detailData.reason && (
                                    <div className="pt-3 border-t">
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Reason</p>
                                        <p className="text-sm text-slate-700">{detailData.reason}</p>
                                    </div>
                                )}
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-none mt-4" onClick={() => { setIsDetailOpen(false); router.push('/client-management/customers') }}>
                                    View Full Profile
                                </Button>
                            </>
                        )}

                        {detailData && detailType === "renewal" && (
                            <>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="font-semibold text-slate-900 text-lg">{detailData.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Renewal Date</p><p className="font-semibold text-slate-900">{detailData.date}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Value</p><p className="font-semibold text-slate-900">{detailData.value}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Probability</p><Badge className="rounded-none">{detailData.probability}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Days Left</p><p className="font-semibold text-slate-900">{detailData.daysLeft}d</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">CSM</p><p className="font-semibold text-slate-900">{detailData.csm}</p></div>
                                </div>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-none mt-4" onClick={() => { setIsDetailOpen(false); router.push('/client-management/revenue/renewals') }}>
                                    Go to Renewals
                                </Button>
                            </>
                        )}

                        {detailData && detailType === "activity" && (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-none ${detailData.bg}`}>
                                        <detailData.icon className={`h-5 w-5 ${detailData.color}`} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{detailData.user}</p>
                                        <p className="text-xs text-slate-500">{detailData.time}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-sm text-slate-700">
                                        <span className="font-semibold">{detailData.user}</span> {detailData.action} <span className="font-semibold">{detailData.target}</span>.
                                    </p>
                                </div>
                            </>
                        )}

                        {detailData && detailType === "alert" && (
                            <>
                                <div className="flex items-start gap-3">
                                    <AlertCircle className={`h-6 w-6 mt-0.5 ${detailData.severity === 'critical' ? 'text-red-500' : detailData.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'}`} />
                                    <div>
                                        <p className="font-semibold text-slate-900">{detailData.type}</p>
                                        <p className="text-xs text-slate-500">{detailData.time}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t space-y-2">
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Client</p><p className="font-semibold text-slate-900">{detailData.client}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Message</p><p className="text-sm text-slate-700">{detailData.message}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Severity</p>
                                        <Badge className={`rounded-none ${detailData.severity === 'critical' ? 'bg-rose-100 text-rose-600' : detailData.severity === 'high' ? 'bg-orange-100 text-orange-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {detailData.severity}
                                        </Badge>
                                    </div>
                                </div>
                            </>
                        )}

                        {detailData && detailType === "opportunity" && (
                            <>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Client</p>
                                    <p className="font-semibold text-slate-900 text-lg">{detailData.client}</p>
                                </div>
                                <div className="pt-3 border-t space-y-2">
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Opportunity</p><p className="font-semibold text-slate-900">{detailData.opportunity}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Value</p><p className="font-semibold text-slate-900">{detailData.value}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase tracking-wider">Stage</p><Badge className="rounded-none">{detailData.stage}</Badge></div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Probability</p>
                                        <div className="flex items-center gap-3">
                                            <Progress value={detailData.probability} className="flex-1" />
                                            <span className="text-sm font-semibold text-slate-700">{detailData.probability}%</span>
                                        </div>
                                    </div>
                                </div>
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-none mt-4" onClick={() => { setIsDetailOpen(false); router.push('/client-management/revenue/opportunities') }}>
                                    View All Opportunities
                                </Button>
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
