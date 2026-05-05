"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Download,
    Globe,
    Code2,
    ShieldCheck,
    Zap,
    Copy,
    CheckCircle2,
    MessageSquare,
    Webhook,
    Terminal,
    Settings2,
    RefreshCw,
    ExternalLink,
    PieChart,
    Activity,
    Plus,
    LayoutDashboard,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    CheckCircle,
    Info,
    Layers,
    Cpu
} from "lucide-react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { CustomButton } from "@/shared/components/custom/CustomButton"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { toast } from "sonner"
import { Progress } from "@/shared/components/ui/progress"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"

export default function LeadCapturePage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isFormActive, setIsFormActive] = useState(true)
    const [isProvisionOpen, setIsProvisionOpen] = useState(false)
    const [editingEndpoint, setEditingEndpoint] = useState<any>(null)
    const [captureEndpoints, setCaptureEndpoints] = useState([
        {
            id: "1",
            name: "Primary website contact form",
            origin: "https://acme.com",
            leadsCaptured: "1,240",
            status: "Active",
            trustScore: "98%",
            lastActivity: "12 Min ago"
        },
        {
            id: "2",
            name: "Spring campaign landing",
            origin: "https://promo.acme.com",
            leadsCaptured: "842",
            status: "Active",
            trustScore: "95%",
            lastActivity: "45 Min ago"
        },
        {
            id: "3",
            name: "Legacy intake portal",
            origin: "https://old.acme.org",
            leadsCaptured: "124",
            status: "Inactive",
            trustScore: "82%",
            lastActivity: "2 Days ago"
        }
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        toast.promise(new Promise(res => setTimeout(res, 1200)), {
            loading: "Synchronizing capture protocol...",
            success: () => {
                setIsLoading(false)
                return msg
            },
            error: "Synchronization failed"
        })
    }

    const openProvisionDialog = () => {
        setEditingEndpoint({ id: Math.random().toString(36).substr(2, 9), name: "", origin: "", leadsCaptured: "0", status: "Active", trustScore: "100%", lastActivity: "Just now" })
        setIsProvisionOpen(true)
    }

    const saveEndpoint = (e: React.FormEvent) => {
        e.preventDefault()
        const name = (editingEndpoint?.name || "").trim()
        const origin = (editingEndpoint?.origin || "").trim()

        if (!name) {
            toast.error("Gateway name is required")
            return
        }
        if (name.length < 3) {
            toast.error("Name must be at least 3 characters")
            return
        }
        if (!origin) {
            toast.error("Origin URL is required")
            return
        }
        if (!/^https?:\/\/[\w.-]+(:\d+)?(\/.*)?$/i.test(origin)) {
            toast.error("Origin must be a valid URL (starting with http:// or https://)")
            return
        }
        setCaptureEndpoints(prev => {
            const exists = prev.find(e => e.id === editingEndpoint.id)
            if (exists) return prev.map(e => e.id === editingEndpoint.id ? { ...editingEndpoint, name, origin } : e)
            return [...prev, { ...editingEndpoint, name, origin }]
        })
        setIsProvisionOpen(false)
        toast.success("Capture gateway provisioned successfully")
    }

    const deleteGateway = (id: string) => {
        setCaptureEndpoints(prev => prev.filter(e => e.id !== id))
        toast.success("Capture node decommissioned")
    }

    const toggleGatewayStatus = (id: string) => {
        setCaptureEndpoints(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e))
        toast.success("Gateway lifecycle state updated")
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-left font-outfit">
            <SubHeader
                title="Lead Capture & Intake Gateways"
                breadcrumbItems={[
                    { label: "Lead Management", href: "/modules/settings/entitlements/leads" },
                    { label: "Capture Protocol", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            variant="outline"
                            onClick={() => handleAction("Capture API Keys Rotated Successfully")}
                            className="rounded-xl h-10 px-6 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium hover:bg-zinc-50 transition-all shadow-sm text-blue-600 hover:text-blue-700 hover:border-blue-200"
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-2" />
                            Rotate Api Key
                        </CustomButton>
                        <CustomButton
                            onClick={openProvisionDialog}
                            className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-8 shadow-xl shadow-blue-500/20 border-0"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Provision Gateway
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Protocol HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Intake Throughput</p>
                                <p className="text-white text-xl font-semibold">2.4k/Mo</p>
                                <p className="text-[10px] text-white/80">+12.5% Intake Velocity</p>
                            </div>
                            <Webhook className="w-4 h-4 text-white" />
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Operational Health</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">99.9%</p>
                                <p className="text-[10px] text-emerald-600 font-medium">Node Availability</p>
                            </div>
                            <Activity className="w-4 h-4 text-emerald-500" />
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Global Gateways</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">08</p>
                                <p className="text-[10px] text-indigo-600 font-medium">Intake Clusters</p>
                            </div>
                            <Globe className="w-4 h-4 text-indigo-500" />
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Intelligent Routing</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">Active</p>
                                <p className="text-[10px] text-amber-600 font-medium">Load Balancer Matrix</p>
                            </div>
                            <Cpu className="w-4 h-4 text-amber-500" />
                        </SmallCardContent>
                    </SmallCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Inbound Gateway Registry + summary (left) */}
                    <div className="lg:col-span-8 flex flex-col gap-4 self-start">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md overflow-hidden text-left">
                            <div className="px-4 py-2 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/40 dark:bg-zinc-900/40">
                                <div className="text-left space-y-1">
                                    <h4 className="text-base font-medium text-gray-900 dark:text-zinc-100 leading-none">
                                        Capture Waypoint Registry
                                    </h4>
                                    <p className="text-[11px] text-zinc-400 leading-none">
                                        Synchronized gateways for institutional lead ingestion
                                    </p>
                                </div>
                                <Badge className="bg-blue-600 text-white rounded-full border-0 text-[10px] font-semibold px-4 py-1 shadow-md">
                                    Live Protocol
                                </Badge>
                            </div>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 text-left">
                                        <TableRow className="border-b border-zinc-100 dark:border-zinc-800 px-2">
                                            <TableHead className="px-3 py-1.5 text-[11px] font-medium text-gray-500">
                                                Gateway Identity
                                            </TableHead>
                                            <TableHead className="px-3 py-1.5 text-[11px] font-medium text-gray-500 text-center">
                                                Intake Volume
                                            </TableHead>
                                            <TableHead className="px-3 py-1.5 text-[11px] font-medium text-gray-500 text-center">
                                                Fidelity Score
                                            </TableHead>
                                            <TableHead className="px-3 py-1.5 text-[11px] font-medium text-gray-500 text-right">
                                                Last Ingestion
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                                        {captureEndpoints.map((gateway) => (
                                            <TableRow
                                                key={gateway.id}
                                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-all group"
                                            >
                                                <TableCell className="px-3 py-1.5">
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${gateway.status === "Active"
                                                                    ? "bg-blue-600 text-white shadow-blue-500/30"
                                                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                                                                }`}
                                                        >
                                                            <Webhook className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex flex-col space-y-1">
                                                            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                                                                {gateway.name}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <Globe className="w-3 h-3 text-zinc-300" />
                                                                <span className="text-[11px] text-zinc-400 leading-none">
                                                                    {gateway.origin}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-3 py-1.5 text-center">
                                                    <div className="flex flex-col items-center space-y-1">
                                                        <span className="text-lg font-semibold text-zinc-900 dark:text-white tabular-nums leading-none">
                                                            {gateway.leadsCaptured}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-400 leading-none">
                                                            Leads Ingested
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-3 py-1.5 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                            <span className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                                                                {gateway.trustScore}
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            value={parseInt(gateway.trustScore)}
                                                            className="h-1.5 w-24 bg-zinc-100 dark:bg-zinc-800"
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-3 py-1.5 text-right">
                                                    <div className="flex flex-col items-end space-y-1">
                                                        <div className="flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-200 leading-none">
                                                            <Activity className="w-3 h-3 text-blue-500" />
                                                            <span>{gateway.lastActivity}</span>
                                                        </div>
                                                        <span
                                                            className={`text-[10px] font-medium leading-none ${gateway.status === "Active"
                                                                    ? "text-emerald-600"
                                                                    : "text-rose-500"
                                                                }`}
                                                        >
                                                            {gateway.status} Status
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Capture Summary Strip (fills middle space beside right column) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-600">Average Time To First Response</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">2.3 Minutes</p>
                                </div>
                                <span className="text-[10px] text-emerald-600 font-medium">Within Target</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-600">Verified Capture Gateways</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">6 Of 8</p>
                                </div>
                                <span className="text-[10px] text-blue-600 font-medium">Two In Draft</span>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-600">Weekend Auto-Routing</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">Enabled</p>
                                </div>
                                <span className="text-[10px] text-amber-600 font-medium">High Traffic Hours</span>
                            </div>
                        </div>

                        {/* Recent Activity + Tips row to further fill space */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-4">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Capture Activity</h4>
                                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                                    <div className="flex items-center justify-between">
                                        <span>Primary Website Contact Form</span>
                                        <span className="text-[11px] text-emerald-600">+34 Leads In Last Hour</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Spring Campaign Landing</span>
                                        <span className="text-[11px] text-blue-600">+12 Leads In Last Hour</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Legacy Intake Portal</span>
                                        <span className="text-[11px] text-zinc-400">Idle For 2 Days</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-4">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Optimization Tips</h4>
                                <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300 list-disc list-inside">
                                    <li>Keep at least one backup capture form active.</li>
                                    <li>Archive inactive portals older than thirty days.</li>
                                    <li>Rotate API keys every ninety days.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* API Configuration Panel */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md p-6 text-left">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-6 pb-4 border-b border-zinc-50 dark:border-zinc-800 flex items-center gap-3 leading-none">
                                <Terminal className="w-5 h-5 text-blue-600" /> Api Access Authority
                            </h3>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-medium text-zinc-500">Global Capture Secret</Label>
                                    <div className="relative group">
                                        <Input
                                            value="sk_live_51Mv4...9x3vL"
                                            readOnly
                                            className="bg-zinc-50/50 dark:bg-zinc-950 font-mono text-[11px] h-10 pr-10 rounded-xl border-zinc-100 dark:border-zinc-800"
                                        />
                                        <CustomButton
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-zinc-300 hover:text-blue-600 rounded-xl"
                                            onClick={() => {
                                                navigator.clipboard.writeText("sk_live_51Mv4...9x3vL")
                                                toast.success("API Secret copied to secure clipboard")
                                            }}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </CustomButton>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-medium text-zinc-500">Capture Status</Label>
                                    <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl border border-zinc-100/30 dark:border-zinc-800/30 group">
                                        <div className="flex flex-col space-y-2">
                                            <span className="text-xs font-semibold transition-colors group-hover:text-blue-600 leading-none">Master Ingestion</span>
                                            <span className="text-[10px] font-medium text-zinc-400 leading-none">Global Status Control</span>
                                        </div>
                                        <Switch
                                            checked={isFormActive}
                                            onCheckedChange={(val) => {
                                                setIsFormActive(val)
                                                toast.info(`Global capture status synchronized: ${val ? 'Active' : 'Disabled'}`)
                                            }}
                                            className="data-[state=checked]:bg-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-100/30 dark:border-blue-900/30 relative overflow-hidden group">
                                    <Sparkles className="absolute -bottom-10 -right-10 h-32 w-32 text-blue-600 opacity-5 group-hover:rotate-45 transition-transform" />
                                    <div className="flex items-center gap-3 mb-3 text-blue-600 relative z-10 font-semibold text-[11px]">
                                        <ShieldCheck className="w-5 h-5" />
                                        Encryption Protocol
                                    </div>
                                    <p className="text-[10px] font-medium text-zinc-500 text-left leading-relaxed relative z-10">
                                        All inbound lead ingestion data is encrypted with AES-256 and verified against the active origin whitelist.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Integration Quicklinks */}
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md p-6 space-y-4 text-left">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 leading-none">Implementation Assets</h3>
                            <div className="space-y-3">
                                {[
                                    { name: "Rest Api Documentation", icon: <Terminal className="w-4 h-4" /> },
                                    { name: "Webform Js Sdk", icon: <Code2 className="w-4 h-4" /> },
                                    { name: "React Capture Hooks", icon: <Layers className="w-4 h-4" /> },
                                    { name: "Webhook Payload Specs", icon: <Webhook className="w-4 h-4" /> },
                                ].map((asset, i) => (
                                    <div key={i} onClick={() => toast.info(`Opening ${asset.name}...`)} className="flex items-center justify-between p-3 bg-zinc-50/30 dark:bg-zinc-950/20 rounded-xl hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-blue-100/30">
                                        <div className="flex items-center gap-4 text-left">
                                            <span className="text-zinc-300 group-hover:text-blue-500 transition-colors">{asset.icon}</span>
                                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform">{asset.name}</span>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Algorithmic Security Matrix */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md p-6 relative overflow-hidden group text-left">
                    <Activity className="absolute -bottom-20 -right-20 h-96 w-96 text-indigo-600 opacity-5 group-hover:scale-110 transition-transform pointer-events-none" />
                    <div className="relative z-10 w-full text-left">
                        <div className="flex items-center justify-between mb-8 border-b border-zinc-50 dark:border-zinc-800/50 pb-6">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center rounded-xl font-semibold border border-blue-100/30 dark:border-blue-800/30 shadow-inner group-hover:rotate-12 transition-all">
                                    <ShieldCheck className="w-8 h-8 group-hover:scale-125 transition-transform" />
                                </div>
                                <div className="text-left space-y-2">
                                    <h3 className="text-base font-medium text-gray-900 dark:text-zinc-100 leading-none">Gateway Integrity Matrix</h3>
                                    <p className="text-[10px] text-zinc-400 font-medium mt-1 leading-none">Global intake encryption and protocol verification audit</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge className="bg-indigo-600 text-white border-0 text-[10px] font-semibold rounded-full px-5 py-2 shadow-md shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer" onClick={() => toast.info("Initializing global gateway re-scan")}>Re-scan Gateways</Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                            {[
                                { title: "Origin Whitelist Sync", val: "Active", meta: "Dns Verified", icon: <Globe className="w-4 h-4" /> },
                                { title: "Spam Sequestration", val: "Enabled", meta: "Ai Hardened", icon: <ShieldCheck className="w-4 h-4" /> },
                                { title: "Ingestion Fidelity", val: "Optimal", meta: "Schema Validated", icon: <CheckCircle className="w-4 h-4" /> },
                            ].map((audit, i) => (
                                <div key={i} className="flex flex-col space-y-6 group/audit cursor-default">
                                    <div className="flex items-center gap-4">
                                        <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_12px_rgba(37,99,235,0.7)]" />
                                        <span className="text-[10px] font-semibold text-zinc-400 transition-colors group-hover/audit:text-blue-500 leading-none">{audit.title}</span>
                                    </div>
                                    <span className="text-2xl font-semibold text-zinc-900 dark:text-white leading-none tabular-nums">{audit.val}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-blue-600 dark:text-blue-400 opacity-60 group-hover/audit:rotate-12 transition-transform">{audit.icon}</span>
                                        <span className="text-[10px] text-zinc-500 font-medium leading-none">{audit.meta}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* Provision Gateway — side sheet */}
            <SideFormSheet
                open={isProvisionOpen}
                onOpenChange={(o) => {
                    setIsProvisionOpen(o)
                    if (!o) setEditingEndpoint(null)
                }}
                title="Provision New Gateway"
                description="Configure institutional intake endpoints for lead ingestion."
                icon={<Webhook className="w-5 h-5" />}
                width="md"
                onSubmit={saveEndpoint}
                submitLabel="Authorize Gateway"
            >
                {editingEndpoint && (
                    <div className="space-y-4">
                        <Field
                            label="Gateway Name"
                            required
                            hint="3-80 characters; descriptive label"
                        >
                            <Input
                                placeholder="e.g. Website Contact Form"
                                value={editingEndpoint.name ?? ''}
                                onChange={(e) => setEditingEndpoint(prev => prev ? { ...prev, name: e.target.value } : prev)}
                                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                                maxLength={80}
                            />
                        </Field>

                        <Field
                            label="Origin URL / Source"
                            required
                            hint="Must start with http:// or https://"
                        >
                            <Input
                                placeholder="https://yourdomain.com"
                                value={editingEndpoint.origin ?? ''}
                                onChange={(e) => setEditingEndpoint(prev => prev ? { ...prev, origin: e.target.value } : prev)}
                                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary font-mono text-[13px]"
                                maxLength={200}
                                type="url"
                            />
                        </Field>

                        <Field label="Initial Trust Protocol" hint="Sandboxed gateways don't capture leads until activated">
                            <Select
                                value={editingEndpoint.status ?? 'Active'}
                                onValueChange={(v) => setEditingEndpoint(prev => prev ? { ...prev, status: v } : prev)}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Operational (Active)</SelectItem>
                                    <SelectItem value="Inactive">Sandboxed (Inactive)</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                            <Webhook className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11.5px] text-[#475569] leading-relaxed">
                                After provisioning, share the gateway URL with your dev team to embed the intake script or webhook.
                            </p>
                        </div>
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
