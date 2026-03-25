"use client"

import { useState, useMemo } from "react"
import {
    Search, Download, Store, Star,
    CheckCircle2, Zap, Activity, Sparkles,
    Grid, List, ExternalLink, Package,
    BarChart2, MessageSquare, CreditCard,
    Headphones, Brain, Mail, Link2, Settings
} from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog"
import { toast } from "@/shared/utils/toast"

type MarketplaceApp = {
    id: string
    name: string
    vendor: string
    category: string
    description: string
    rating: number
    reviews: number
    installs: number
    price: string
    installed: boolean
    featured: boolean
    icon: React.ElementType
    tags: string[]
}

const INITIAL_APPS: MarketplaceApp[] = [
    { id: "MP-001", name: "Slack connector", vendor: "Slack Technologies", category: "Communication", description: "Sync client notifications, alerts, and team updates directly to Slack channels with two-way message forwarding.", rating: 4.9, reviews: 2840, installs: 48200, price: "Free", installed: true, featured: true, icon: MessageSquare, tags: ["messaging", "alerts", "team"] },
    { id: "MP-002", name: "Stripe billing bridge", vendor: "Stripe Inc.", category: "Billing", description: "Automate invoicing, subscription lifecycle management, and payment tracking with deep Stripe integration.", rating: 4.8, reviews: 1920, installs: 32100, price: "Free", installed: true, featured: true, icon: CreditCard, tags: ["payments", "invoicing", "subscriptions"] },
    { id: "MP-003", name: "Zendesk support sync", vendor: "Zendesk", category: "Support", description: "Bi-directional ticket sync between your CRM and Zendesk. Escalate, assign, and resolve tickets from one place.", rating: 4.7, reviews: 1140, installs: 21400, price: "$29/mo", installed: false, featured: true, icon: Headphones, tags: ["tickets", "helpdesk", "support"] },
    { id: "MP-004", name: "OpenAI churn predictor", vendor: "Fixl Labs", category: "AI", description: "Machine learning model powered by OpenAI GPT-4 to predict churn risk based on client behavior and engagement.", rating: 4.6, reviews: 680, installs: 8900, price: "$49/mo", installed: true, featured: false, icon: Brain, tags: ["AI", "prediction", "churn"] },
    { id: "MP-005", name: "HubSpot contact sync", vendor: "HubSpot", category: "CRM", description: "Real-time contact and deal synchronization with HubSpot CRM, including field-level conflict resolution.", rating: 4.8, reviews: 2200, installs: 41000, price: "Free", installed: false, featured: true, icon: Link2, tags: ["contacts", "deals", "CRM"] },
    { id: "MP-006", name: "Mailchimp campaigns", vendor: "Intuit Mailchimp", category: "Marketing", description: "Run targeted email campaigns from client segments. Auto-sync subscriber lists and campaign analytics.", rating: 4.5, reviews: 1580, installs: 28000, price: "$19/mo", installed: false, featured: false, icon: Mail, tags: ["email", "campaigns", "segments"] },
    { id: "MP-007", name: "Revenue analytics pro", vendor: "Fixl Labs", category: "Analytics", description: "Advanced revenue reporting with cohort analysis, MRR tracking, net revenue retention, and forecasting dashboards.", rating: 4.9, reviews: 920, installs: 14200, price: "$39/mo", installed: true, featured: false, icon: BarChart2, tags: ["revenue", "analytics", "reporting"] },
    { id: "MP-008", name: "QuickBooks accounting", vendor: "Intuit", category: "Billing", description: "Seamless accounting sync with QuickBooks. Map invoices, expenses, and payment records automatically.", rating: 4.7, reviews: 1100, installs: 19400, price: "$24/mo", installed: false, featured: false, icon: CreditCard, tags: ["accounting", "invoices", "finance"] },
    { id: "MP-009", name: "Zapier automation hub", vendor: "Zapier", category: "Automation", description: "Trigger thousands of Zapier workflows from CRM events. Connect with 6000+ apps in minutes.", rating: 4.6, reviews: 3400, installs: 52000, price: "Free", installed: false, featured: true, icon: Zap, tags: ["automation", "workflows", "no-code"] },
]

const CATEGORIES = ["Communication", "Billing", "Support", "AI", "CRM", "Marketing", "Analytics", "Automation"]

const CATEGORY_COLORS: Record<string, string> = {
    Communication: "bg-indigo-50 text-indigo-600",
    Billing: "bg-emerald-50 text-emerald-600",
    Support: "bg-violet-50 text-violet-600",
    AI: "bg-rose-50 text-rose-600",
    CRM: "bg-blue-50 text-blue-600",
    Marketing: "bg-amber-50 text-amber-600",
    Analytics: "bg-cyan-50 text-cyan-600",
    Automation: "bg-orange-50 text-orange-600",
}

export default function MarketplacePage() {
    const [apps, setApps] = useState<MarketplaceApp[]>(INITIAL_APPS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [filterInstalled, setFilterInstalled] = useState("all")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [detailApp, setDetailApp] = useState<MarketplaceApp | null>(null)

    const stats = useMemo(() => ({
        installed: apps.filter(a => a.installed).length,
        available: apps.filter(a => !a.installed).length,
        categories: new Set(apps.map(a => a.category)).size,
        featured: apps.filter(a => a.featured).length,
    }), [apps])

    const filtered = useMemo(() => apps.filter(a => {
        const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchCategory = filterCategory === "all" || a.category === filterCategory
        const matchInstalled = filterInstalled === "all" || (filterInstalled === "installed" ? a.installed : !a.installed)
        return matchSearch && matchCategory && matchInstalled
    }), [apps, searchQuery, filterCategory, filterInstalled])

    const featured = useMemo(() => apps.filter(a => a.featured && !searchQuery && filterCategory === "all" && filterInstalled === "all"), [apps, searchQuery, filterCategory, filterInstalled])

    const handleInstall = (id: string, name: string) => {
        setApps(prev => prev.map(a => a.id === id ? { ...a, installed: true, installs: a.installs + 1 } : a))
        setDetailApp(null)
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: `Installing ${name}...`, success: `${name} installed successfully!`, error: "Installation failed" })
    }

    const handleUninstall = (id: string, name: string) => {
        setApps(prev => prev.map(a => a.id === id ? { ...a, installed: false } : a))
        setDetailApp(null)
        toast.success(`${name} uninstalled`)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Vendor", "Category", "Price", "Rating", "Reviews", "Installs", "Installed"], ...apps.map(a => [a.id, a.name, a.vendor, a.category, a.price, a.rating, a.reviews, a.installs, a.installed])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "marketplace.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Marketplace list exported")
    }

    const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString()

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Integration <span className="text-indigo-600">marketplace</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Browse and install pre-built integrations to extend your CRM capabilities</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}><Download className="w-4 h-4 text-slate-400" /> Export</Button>
                    <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1 bg-white shadow-sm">
                        <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"}`}><Grid className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-600"}`}><List className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Installed apps", value: stats.installed, icon: Package, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Available integrations", value: stats.available, icon: Store, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "App categories", value: stats.categories, icon: Activity, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Featured apps", value: stats.featured, icon: Sparkles, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}><stat.icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{apps.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Featured Banner */}
            {featured.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500" /> Featured integrations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {featured.slice(0, 3).map(app => (
                            <div key={app.id} onClick={() => setDetailApp(app)} className="relative p-5 rounded-[22px] bg-gradient-to-br from-indigo-50/80 to-slate-50/50 border border-indigo-100/50 shadow-sm cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all group overflow-hidden">
                                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${CATEGORY_COLORS[app.category] || "bg-white text-slate-500"} shadow-sm border border-black/5`}><app.icon className="w-5 h-5" /></div>
                                    {app.installed && <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold border-0 shadow-sm">Installed</Badge>}
                                </div>
                                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{app.name}</h4>
                                <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{app.description}</p>
                                <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-400 font-medium border-t border-indigo-100/30 pt-3">
                                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {app.rating}</span>
                                    <span>{fmt(app.installs)} installs</span>
                                    <span className={`ml-auto font-semibold ${app.price === "Free" ? "text-emerald-600" : "text-indigo-600"}`}>{app.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search integrations, vendors, or tags..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" /></div>
                <Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All categories</SelectItem>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                <Select value={filterInstalled} onValueChange={setFilterInstalled}><SelectTrigger className="w-40 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All apps</SelectItem><SelectItem value="installed">Installed</SelectItem><SelectItem value="available">Available</SelectItem></SelectContent></Select>
            </div>

            {/* Apps Grid / List */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(app => (
                        <Card key={app.id} onClick={() => setDetailApp(app)} className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white p-7 space-y-4 hover:shadow-2xl transition-all group cursor-pointer">
                            <div className="flex items-start justify-between">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${CATEGORY_COLORS[app.category] || "bg-slate-50 text-slate-500"}`}><app.icon className="w-6 h-6" /></div>
                                <div className="flex items-center gap-2">
                                    {app.featured && <Badge className="bg-amber-50 text-amber-600 text-[10px] font-semibold border-0">Featured</Badge>}
                                    {app.installed && <Badge className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold border-0">Installed</Badge>}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{app.name}</h4>
                                <p className="text-[11px] font-medium text-slate-400">{app.vendor}</p>
                                <p className="text-[12px] font-medium text-slate-500 leading-relaxed line-clamp-2">{app.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${CATEGORY_COLORS[app.category]}`}>{app.category}</Badge>
                                {app.tags.slice(0, 2).map(tag => <span key={tag} className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">#{tag}</span>)}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                                    <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {app.rating} ({app.reviews})</span>
                                    <span>{fmt(app.installs)} installs</span>
                                </div>
                                <span className={`text-sm font-semibold ${app.price === "Free" ? "text-emerald-600" : "text-slate-900"}`}>{app.price}</span>
                            </div>
                        </Card>
                    ))}
                    {filtered.length === 0 && <div className="col-span-3 py-16 text-center"><Store className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-slate-400 font-medium">No apps found.</p><Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterCategory("all"); setFilterInstalled("all") }}>Clear filters</Button></div>}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(app => (
                        <div key={app.id} onClick={() => setDetailApp(app)} className="flex items-center gap-5 p-5 bg-white rounded-2xl border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group cursor-pointer">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${CATEGORY_COLORS[app.category]}`}><app.icon className="w-6 h-6" /></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{app.name}</h4>
                                    <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${CATEGORY_COLORS[app.category]}`}>{app.category}</Badge>
                                    {app.installed && <Badge className="bg-emerald-50 text-emerald-600 text-[10px] font-semibold border-0">Installed</Badge>}
                                </div>
                                <p className="text-[12px] font-medium text-slate-400 truncate">{app.vendor} · {app.description}</p>
                            </div>
                            <div className="flex items-center gap-6 shrink-0 text-[11px] text-slate-400 font-medium">
                                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {app.rating}</span>
                                <span>{fmt(app.installs)}</span>
                                <span className={`font-semibold ${app.price === "Free" ? "text-emerald-600" : "text-slate-900"}`}>{app.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Dialog */}
            <Dialog open={!!detailApp} onOpenChange={() => setDetailApp(null)}>
                <DialogContent className="sm:max-w-[520px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    {detailApp && <>
                        <DialogHeader>
                            <div className="flex items-start gap-4 mb-2">
                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${CATEGORY_COLORS[detailApp.category]}`}><detailApp.icon className="w-7 h-7" /></div>
                                <div>
                                    <DialogTitle className="text-xl font-semibold text-slate-900">{detailApp.name}</DialogTitle>
                                    <p className="text-sm font-medium text-slate-400 mt-0.5">{detailApp.vendor}</p>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="space-y-5 py-2">
                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{detailApp.description}</p>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Rating", value: `${detailApp.rating} / 5` },
                                    { label: "Reviews", value: detailApp.reviews.toLocaleString() },
                                    { label: "Installs", value: fmt(detailApp.installs) },
                                ].map((m, i) => <div key={i} className="text-center p-3 bg-slate-50 rounded-xl"><p className="text-[10px] font-medium text-slate-400">{m.label}</p><p className="text-sm font-semibold text-slate-900">{m.value}</p></div>)}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {detailApp.tags.map(tag => <span key={tag} className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">#{tag}</span>)}
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div><p className="text-xs font-medium text-slate-400">Pricing</p><p className={`text-lg font-semibold ${detailApp.price === "Free" ? "text-emerald-600" : "text-slate-900"}`}>{detailApp.price}</p></div>
                                <Badge className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-0 ${CATEGORY_COLORS[detailApp.category]}`}>{detailApp.category}</Badge>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 mt-2">
                            <Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setDetailApp(null)}>Close</Button>
                            {detailApp.installed ? (
                                <Button className="rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-semibold px-6 gap-2 border border-slate-200" onClick={() => handleUninstall(detailApp.id, detailApp.name)}>
                                    <Settings className="w-4 h-4" /> Uninstall
                                </Button>
                            ) : (
                                <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 gap-2" onClick={() => handleInstall(detailApp.id, detailApp.name)}>
                                    <Download className="w-4 h-4" /> Install {detailApp.price !== "Free" && `· ${detailApp.price}`}
                                </Button>
                            )}
                        </DialogFooter>
                    </>}
                </DialogContent>
            </Dialog>
        </div>
    )
}
