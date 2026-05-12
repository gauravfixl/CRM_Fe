"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Search, Download, Store, Star, Tag,
    Trash2, Filter, MoreVertical, Eye, Activity,
    CheckCircle2, Zap, Package, ShieldCheck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { toast } from "@/shared/utils/toast"

type App = {
    id: string
    name: string
    publisher: string
    category: 'Communication' | 'Productivity' | 'Analytics' | 'Marketing' | 'Finance' | 'AI'
    description: string
    rating: number
    installs: number
    pricing: 'Free' | 'Paid' | 'Freemium'
    installed: boolean
    enabled: boolean
    verified: boolean
    version: string
    iconColor: string
}

const APPS: App[] = [
    { id: "AP-001", name: "Slack", publisher: "Slack Technologies", category: "Communication", description: "Send CRM alerts and updates to your Slack channels in real time.", rating: 4.8, installs: 12420, pricing: "Free", installed: true, enabled: true, verified: true, version: "2.4.1", iconColor: "indigo" },
    { id: "AP-002", name: "Zapier", publisher: "Zapier Inc.", category: "Productivity", description: "Connect your CRM to 6000+ apps without code.", rating: 4.7, installs: 9840, pricing: "Freemium", installed: true, enabled: true, verified: true, version: "3.1.0", iconColor: "amber" },
    { id: "AP-003", name: "Google Workspace", publisher: "Google", category: "Productivity", description: "Sync contacts, calendars, and emails with your Google account.", rating: 4.9, installs: 18200, pricing: "Free", installed: true, enabled: true, verified: true, version: "1.8.0", iconColor: "blue" },
    { id: "AP-004", name: "Mailchimp", publisher: "Intuit Mailchimp", category: "Marketing", description: "Sync subscribers between your CRM and Mailchimp audiences.", rating: 4.5, installs: 8240, pricing: "Freemium", installed: false, enabled: false, verified: true, version: "2.0.4", iconColor: "yellow" },
    { id: "AP-005", name: "QuickBooks", publisher: "Intuit", category: "Finance", description: "Two-way sync of customers and invoices with QuickBooks.", rating: 4.6, installs: 5840, pricing: "Paid", installed: false, enabled: false, verified: true, version: "1.5.2", iconColor: "emerald" },
    { id: "AP-006", name: "Tableau", publisher: "Salesforce", category: "Analytics", description: "Build advanced dashboards on top of your CRM data.", rating: 4.7, installs: 3220, pricing: "Paid", installed: false, enabled: false, verified: true, version: "1.2.0", iconColor: "cyan" },
    { id: "AP-007", name: "Calendly", publisher: "Calendly", category: "Productivity", description: "Auto-create CRM records from Calendly bookings.", rating: 4.8, installs: 7820, pricing: "Freemium", installed: true, enabled: false, verified: true, version: "1.9.1", iconColor: "rose" },
    { id: "AP-008", name: "DocuSign", publisher: "DocuSign", category: "Productivity", description: "Send and sign contracts directly from CRM records.", rating: 4.6, installs: 4520, pricing: "Paid", installed: false, enabled: false, verified: true, version: "2.3.0", iconColor: "violet" },
    { id: "AP-009", name: "ChatGPT Connector", publisher: "OpenAI", category: "AI", description: "Embed ChatGPT-powered assistants directly into your CRM.", rating: 4.9, installs: 9120, pricing: "Freemium", installed: false, enabled: false, verified: true, version: "0.9.5", iconColor: "emerald" },
    { id: "AP-010", name: "HubSpot Connector", publisher: "Fixl", category: "Marketing", description: "Bi-directional sync of HubSpot contacts and deals.", rating: 4.4, installs: 2840, pricing: "Free", installed: false, enabled: false, verified: true, version: "1.0.3", iconColor: "orange" },
]

const CATEGORIES: App['category'][] = ["Communication", "Productivity", "Analytics", "Marketing", "Finance", "AI"]

const ICON_COLOR: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
}

export default function MarketplacePage() {
    const router = useRouter()
    const [apps, setApps] = React.useState<App[]>(APPS)
    const [search, setSearch] = React.useState("")
    const [categoryFilter, setCategoryFilter] = React.useState("all")
    const [pricingFilter, setPricingFilter] = React.useState("all")

    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<App | null>(null)

    const stats = React.useMemo(() => ({
        total: apps.length,
        installed: apps.filter(a => a.installed).length,
        enabled: apps.filter(a => a.enabled).length,
        avgRating: (apps.reduce((a, x) => a + x.rating, 0) / apps.length).toFixed(1),
    }), [apps])

    const filtered = React.useMemo(() => apps.filter(a => {
        const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.publisher.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())
        const matchCategory = categoryFilter === "all" || a.category === categoryFilter
        const matchPricing = pricingFilter === "all" || a.pricing === pricingFilter
        return matchSearch && matchCategory && matchPricing
    }), [apps, search, categoryFilter, pricingFilter])

    const handleInstall = (id: string) => {
        setApps(apps.map(a => a.id === id ? { ...a, installed: true, enabled: true } : a))
        const app = apps.find(a => a.id === id)
        toast.success(`${app?.name} installed`)
    }

    const handleUninstall = (id: string) => {
        setApps(apps.map(a => a.id === id ? { ...a, installed: false, enabled: false } : a))
        const app = apps.find(a => a.id === id)
        toast.success(`${app?.name} removed`)
    }

    const handleToggle = (id: string, current: boolean) => {
        setApps(apps.map(a => a.id === id ? { ...a, enabled: !current } : a))
        toast.success(current ? "App disabled" : "App enabled")
    }

    const openDetail = (a: App) => { setSelected(a); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Available Apps", value: String(stats.total), subtitle: "In the marketplace", icon: Store, color: "indigo", trend: `+${stats.total}`, path: "/client-management/integrations/marketplace" },
        { title: "Installed", value: String(stats.installed), subtitle: "On your workspace", icon: Package, color: "emerald", trend: `+${stats.installed}`, path: "/client-management/integrations/marketplace" },
        { title: "Active", value: String(stats.enabled), subtitle: "Currently running", icon: Activity, color: "violet", trend: `+${stats.enabled}`, path: "/client-management/integrations/marketplace" },
        { title: "Avg. Rating", value: stats.avgRating, subtitle: "User satisfaction", icon: Star, color: "amber", trend: "+0.1", path: "/client-management/integrations/marketplace" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        App <span className="text-indigo-600">Marketplace</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Browse and install pre-built integrations to extend your CRM.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => router.push('/client-management/integrations/api')}>
                        Build Custom App
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => {
                    const cc = colorMap[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                                            <span className={`text-xs font-bold ${cc.text}`}>{kpi.trend}</span>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-400">{kpi.subtitle}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-none flex items-center justify-center ${cc.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${cc.text}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card className="rounded-none">
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-base font-semibold">Browse Apps</CardTitle>
                        <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} apps</Badge>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-44 h-9 rounded-none"><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent className="rounded-none">
                                <SelectItem value="all">All Categories</SelectItem>
                                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search apps..." value={search} onChange={e => setSearch(e.target.value)}
                                className="pl-10 rounded-none w-64 h-9" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.length > 0 ? filtered.map(a => (
                            <Card key={a.id} className="rounded-none cursor-pointer hover:shadow-md transition border border-slate-100" onClick={() => openDetail(a)}>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`h-12 w-12 rounded-none border flex items-center justify-center ${ICON_COLOR[a.iconColor]}`}>
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {a.verified && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                                            <Badge className="rounded-none bg-slate-100 text-slate-600 text-[10px]">{a.pricing}</Badge>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{a.name}</h3>
                                    <p className="text-[11px] text-slate-500 font-medium">{a.publisher}</p>
                                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 min-h-[32px]">{a.description}</p>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-3 text-[11px]">
                                            <span className="flex items-center gap-1 text-amber-600 font-bold">
                                                <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" /> {a.rating}
                                            </span>
                                            <span className="flex items-center gap-1 text-slate-500 font-semibold">
                                                <Download className="h-3 w-3" /> {a.installs.toLocaleString()}
                                            </span>
                                        </div>
                                        <Badge className="rounded-none bg-slate-100 text-slate-700 text-[10px]">{a.category}</Badge>
                                    </div>
                                    <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        {a.installed ? (
                                            <>
                                                <Button variant="outline" className="flex-1 h-9 rounded-none text-xs" onClick={() => handleUninstall(a.id)}>
                                                    <Trash2 className="h-3 w-3 mr-1" />Remove
                                                </Button>
                                                <div className="flex items-center gap-2 border border-slate-100 px-2">
                                                    <Switch checked={a.enabled} onCheckedChange={() => handleToggle(a.id, a.enabled)} className="data-[state=checked]:bg-indigo-600 scale-75" />
                                                </div>
                                            </>
                                        ) : (
                                            <Button className="flex-1 h-9 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white text-xs" onClick={() => handleInstall(a.id)}>
                                                <Download className="h-3 w-3 mr-1" />Install
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="col-span-3 px-6 py-12 text-center text-sm text-slate-500">No apps match your filters.</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Apps</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Category</Label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Pricing</Label>
                            <Select value={pricingFilter} onValueChange={setPricingFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Pricing</SelectItem>
                                    <SelectItem value="Free">Free</SelectItem>
                                    <SelectItem value="Freemium">Freemium</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setCategoryFilter("all"); setPricingFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">App Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className={`h-14 w-14 rounded-none border flex items-center justify-center ${ICON_COLOR[selected.iconColor]}`}>
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                            {selected.verified && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                                        </div>
                                        <p className="text-sm text-slate-500">{selected.publisher}</p>
                                        <p className="text-[11px] text-slate-400 font-mono">v{selected.version}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Category</p><Badge className="rounded-none">{selected.category}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Pricing</p><Badge className="rounded-none">{selected.pricing}</Badge></div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase">Rating</p>
                                        <p className="flex items-center gap-1 font-semibold text-slate-900">
                                            <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" /> {selected.rating}
                                        </p>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Installs</p><p className="font-semibold text-slate-900">{selected.installs.toLocaleString()}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                {selected.installed ? (
                                    <>
                                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => handleToggle(selected.id, selected.enabled)}>
                                            {selected.enabled ? "Disable" : "Enable"}
                                        </Button>
                                        <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleUninstall(selected.id); setIsDetailOpen(false) }}>
                                            <Trash2 className="h-4 w-4 mr-2" />Uninstall
                                        </Button>
                                    </>
                                ) : (
                                    <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => { handleInstall(selected.id); setIsDetailOpen(false) }}>
                                        <Download className="h-4 w-4 mr-2" />Install App
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
