"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Share2,
    Megaphone,
    Target,
    Activity,
    ChevronLeft,
    Calendar,
    Download,
    Filter,
    ArrowUpRight,
    TrendingUp,
    PieChart as PieChartIcon,
    DollarSign,
    Zap,
    Scale,
    Layers,
    MousePointer2,
    Globe,
    Linkedin,
    Facebook,
    Mail,
    X
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    PieChart,
    Pie
} from "recharts"

const SOURCE_VOLUME_DATA = [
    { name: "Meta Ads", leads: 1240, mqls: 420 },
    { name: "Google Ads", leads: 980, mqls: 310 },
    { name: "LinkedIn", leads: 450, mqls: 280 },
    { name: "Organic", leads: 2100, mqls: 850 },
    { name: "Referral", leads: 120, mqls: 95 },
]

const CAMPAIGN_ROI_DATA = [
    { name: "Q1 Outreach", spend: 45000, revenue: 185000 },
    { name: "Webinar", spend: 12000, revenue: 42000 },
    { name: "Social APAC", spend: 25000, revenue: 110000 },
    { name: "Email Blast", spend: 5000, revenue: 21000 },
]

const COLORS = ["#6366f1", "#06b6d4", "#ec4899", "#10b981", "#f59e0b"]

export default function SourceCampaignReportsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [showRoiForm, setShowRoiForm] = useState(false)
    const [campaignName, setCampaignName] = useState("")
    const [spend, setSpend] = useState("")
    const [revenue, setRevenue] = useState("")
    const [roiErrors, setRoiErrors] = useState<{ name?: string; spend?: string; revenue?: string }>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleRoiCalc = () => {
        const newErrors: { name?: string; spend?: string; revenue?: string } = {}
        if (!campaignName.trim()) newErrors.name = "Campaign name is required"
        else if (campaignName.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
        if (!spend.trim()) newErrors.spend = "Spend is required"
        else if (!/^\d+(\.\d+)?$/.test(spend) || parseFloat(spend) <= 0) newErrors.spend = "Enter a positive number"
        if (!revenue.trim()) newErrors.revenue = "Revenue is required"
        else if (!/^\d+(\.\d+)?$/.test(revenue) || parseFloat(revenue) < 0) newErrors.revenue = "Enter a non-negative number"

        if (Object.keys(newErrors).length) {
            setRoiErrors(newErrors)
            return
        }
        setRoiErrors({})
        const roi = (parseFloat(revenue) / parseFloat(spend)).toFixed(2)
        toast({ title: "ROI Calculated", description: `${campaignName}: ${roi}x return on $${spend} spend.` })
        setCampaignName("")
        setSpend("")
        setRevenue("")
        setShowRoiForm(false)
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }}>
            <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-pink-50 p-6 rounded-none border border-pink-100 shadow-sm">
                    <div className="space-y-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-pink-600">
                            <ChevronLeft className="h-3 w-3 mr-1" /> Back
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white text-pink-600 border border-pink-100 shadow-sm">
                                    <Share2 className="h-5 w-5" />
                                </div>
                                <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                    Source & Campaign Performance
                                </h1>
                            </div>
                            <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                                Attribution-based reports identifying your most profitable lead channels and campaign initiatives.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={() => setShowRoiForm(true)} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                            <DollarSign className="h-4 w-4 mr-2 text-slate-400" /> ROI Calculator
                        </Button>
                        <Button onClick={() => toast({ title: "Export Started", description: "Downloading report data..." })} className="h-10 bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 shadow-pink-100 shadow-lg border-none">
                            <Download className="h-4 w-4 mr-2" /> Export JSON
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Lead Volume by Traffic Source</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Comparison of raw leads vs qualified MQL volume by origin channel.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">Leads</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">MQLs</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SOURCE_VOLUME_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '0', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="leads" fill="#6366f1" radius={[0, 0, 0, 0]} barSize={40} />
                                    <Bar dataKey="mqls" fill="#10b981" radius={[0, 0, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8 flex flex-col">
                        <div className="space-y-1 mb-8">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Campaign Spend vs Rev</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Efficiency of capital allocation per initiative.</p>
                        </div>
                        <div className="h-[250px] w-full flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={CAMPAIGN_ROI_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="revenue">
                                        {CAMPAIGN_ROI_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 pt-6 border-t border-slate-50">
                            {CAMPAIGN_ROI_DATA.map((c, i) => (
                                <div key={i} className="flex justify-between items-center text-[12px] font-bold">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                        <span className="text-slate-600 line-clamp-1 max-w-[120px]">{c.name}</span>
                                    </div>
                                    <span className="text-indigo-600">{(c.revenue / c.spend).toFixed(1)}x ROI</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Meta Ads Efficiency", val: "18.2%", detail: "Avg CPL: $24.50", icon: Facebook, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "LinkedIn SQL Ratio", val: "42.5%", detail: "Avg CPL: $110.20", icon: Linkedin, color: "text-indigo-600", bg: "bg-indigo-50" },
                            { label: "Organic Yield", val: "32.4%", detail: "High Quality Band", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Email Conversion", val: "8.4%", detail: "Retention Focus", icon: Mail, color: "text-pink-600", bg: "bg-pink-50" },
                        ].map((s, i) => (
                            <Card key={i} className={`border-none shadow-sm ring-1 ring-slate-100 rounded-none ${s.bg} p-6 space-y-4 group hover:ring-indigo-100 transition-all`}>
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-xl bg-white border border-transparent group-hover:border-slate-100 ${s.color}`}>
                                        <s.icon size={20} />
                                    </div>
                                    <ArrowUpRight size={14} className="text-slate-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                                    <h4 className="text-[20px] font-black text-slate-900">{s.val}</h4>
                                    <p className="text-[11px] text-slate-600 font-medium">{s.detail}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card className="lg:col-span-12 border-none shadow-xl shadow-indigo-100/20 ring-1 ring-slate-100 rounded-none bg-slate-900 text-white p-8 overflow-hidden relative group">
                        <div className="absolute bottom-0 right-0 p-12 opacity-5 scale-150">
                            <Zap size={200} />
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                            <div className="flex-1 space-y-4">
                                <div className="p-3 rounded-2xl bg-amber-500 w-fit">
                                    <DollarSign size={24} className="text-white" />
                                </div>
                                <h3 className="text-[24px] font-black tracking-tighter">Budget Optimization Advisory</h3>
                                <p className="text-[15px] text-slate-400 font-medium leading-relaxed max-w-2xl">
                                    Your <strong>Organic</strong> and <strong>LinkedIn</strong> channels are showing 4x the yield of <strong>Meta Ads</strong>. Reducing Meta spend by 15% and reallocating to LinkedIn could yield an additional 42 SQLs this quarter.
                                </p>
                                <Button onClick={() => toast({ title: "Action Taken", description: "Reallocation request initiated." })} className="h-11 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl border-none">Execute Reallocation</Button>
                            </div>
                            <div className="w-[300px] h-[200px] bg-white/5 border border-white/10 rounded-none p-6 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-500 uppercase">Projected Extra Revenue</p>
                                    <h4 className="text-[32px] font-black tabular-nums text-emerald-400">$64,500</h4>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                    <Activity size={14} className="text-emerald-500" /> Confidence: 92% (High)
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>

            </div>

            {/* Right Slide-in ROI Form */}
            {showRoiForm && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowRoiForm(false)} />
                    <div className="relative h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-[18px] font-bold text-slate-900">ROI Calculator</h3>
                                <p className="text-[12px] text-slate-500">Estimate return on a campaign</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowRoiForm(false)} className="h-9 w-9 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Campaign Name <span className="text-rose-500">*</span></label>
                                <Input
                                    type="text"
                                    value={campaignName}
                                    onChange={(e) => { setCampaignName(e.target.value); if (roiErrors.name) setRoiErrors({ ...roiErrors, name: undefined }) }}
                                    placeholder="e.g. Q3 LinkedIn Push"
                                    className={roiErrors.name ? "border-rose-500" : ""}
                                />
                                {roiErrors.name && <p className="text-[11px] text-rose-500 font-medium">{roiErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Spend (USD) <span className="text-rose-500">*</span></label>
                                <Input
                                    type="number"
                                    value={spend}
                                    onChange={(e) => { setSpend(e.target.value); if (roiErrors.spend) setRoiErrors({ ...roiErrors, spend: undefined }) }}
                                    placeholder="e.g. 25000"
                                    min="0"
                                    step="0.01"
                                    className={roiErrors.spend ? "border-rose-500" : ""}
                                />
                                {roiErrors.spend && <p className="text-[11px] text-rose-500 font-medium">{roiErrors.spend}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Revenue (USD) <span className="text-rose-500">*</span></label>
                                <Input
                                    type="number"
                                    value={revenue}
                                    onChange={(e) => { setRevenue(e.target.value); if (roiErrors.revenue) setRoiErrors({ ...roiErrors, revenue: undefined }) }}
                                    placeholder="e.g. 100000"
                                    min="0"
                                    step="0.01"
                                    className={roiErrors.revenue ? "border-rose-500" : ""}
                                />
                                {roiErrors.revenue && <p className="text-[11px] text-rose-500 font-medium">{roiErrors.revenue}</p>}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button variant="outline" onClick={() => setShowRoiForm(false)} className="flex-1">Cancel</Button>
                            <Button onClick={handleRoiCalc} className="flex-1 bg-pink-600 hover:bg-pink-700 text-white">Calculate</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
