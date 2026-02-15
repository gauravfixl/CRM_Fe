"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    BarChart3,
    Plus,
    MoreVertical,
    Search,
    Filter,
    Activity,
    Zap,
    Target,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    Trash2,
    TrendingUp,
    TrendingDown,
    Thermometer,
    Flame,
    Snowflake,
    Lightbulb
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

export default function LeadScoringRulesPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const scoringRules = [
        { id: "1", attribute: "Job Title", condition: "Contains 'Director' or 'VP'", impact: "+25", status: "ACTIVE" },
        { id: "2", attribute: "Company Size", condition: "> 500 Employees", impact: "+20", status: "ACTIVE" },
        { id: "3", attribute: "Source", condition: "Equals 'Referral'", impact: "+35", status: "ACTIVE" },
        { id: "4", attribute: "Email Domain", condition: "Equals '@gmail.com' or '@yahoo.com'", impact: "-15", status: "ACTIVE" },
        { id: "5", attribute: "Web Intent", condition: "Price Page Visit > 3 times", impact: "+15", status: "ACTIVE" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Lead Scoring Model</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-bold uppercase tracking-widest">Predictive Logic</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Define how lead quality is calculated based on firmographic and behavioral data.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Score preview generated for 2,847 leads")}
                        className="h-10 border-zinc-200 text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <Zap className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" />
                        Dry Run Score
                    </Button>
                    <Button
                        onClick={() => handleAction("New scoring rule creation started")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Scoring Rule
                    </Button>
                </div>
            </div>

            {/* THRESHOLD INSIGHTS - PREMIUM 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-blue-800 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Hot Threshold</p>
                        <Flame className="w-4 h-4 text-white animate-pulse" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">Score &gt; 80</p>
                        <p className="text-[10px] text-white">Priority Sales Routing</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Warm Threshold</p>
                        <Zap className="w-4 h-4 text-amber-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">Score 40-79</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Nurturing Queue</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20_40_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Cold Threshold</p>
                        <Snowflake className="w-4 h-4 text-blue-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">Score &lt; 40</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Low Impact Area</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Model Accuracy</p>
                        <Target className="w-4 h-4 text-emerald-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-emerald-600">88.4%</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Based on Won leads</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SCORING RULES TABLE */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mt-2">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search scoring rules..."
                            className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Lead Attribute</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Condition</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Score Impact</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Status</TableHead>
                            <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scoringRules.map((rule) => (
                            <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-blue-600 transition-all shadow-sm">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-black text-zinc-900 uppercase tracking-tight italic group-hover:text-blue-600 transition-colors">{rule.attribute}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className="text-[10px] font-bold border-zinc-100 text-zinc-500 bg-white px-3 py-1 rounded shadow-none">
                                        {rule.condition}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className={`text-sm font-black ${rule.impact.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{rule.impact}</span>
                                        {rule.impact.startsWith('+') ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${rule.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50 shadow-none' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-100'}`}>
                                        {rule.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all">
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 shadow-xl border-zinc-100 p-2">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 px-2 py-1.5">Rule Strategy</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                    <Zap className="w-3.5 h-3.5" />
                                                    Preview Impact
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                    <RefreshCcw className="w-3.5 h-3.5" />
                                                    Clone Logic
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-50" />
                                                <DropdownMenuItem className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-md cursor-pointer">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Remove Rule
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" />
                        Max score is capped at 100 per lead profile. Negative scores are allowed.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>

            {/* PREDICTIVE INSIGHTS - 3D GLASS STYLE */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
                    <div>
                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest italic flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                            Scoring Accuracy & Quality
                        </h3>
                        <p className="text-[11px] text-zinc-400 font-medium">Model performance based on historical conversion data.</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase px-4 py-1 tracking-widest">Optimized</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Score/Quality Correlation</span>
                            <span className="text-lg font-black text-zinc-900">High</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-bold text-zinc-500">
                                <span>80+ Score Leads</span>
                                <span>74% Win Rate</span>
                            </div>
                            <Progress value={74} className="h-1.5 bg-zinc-100 [&>div]:bg-blue-600 shadow-inner" />

                            <div className="flex justify-between text-[11px] font-bold text-zinc-500">
                                <span>40-79 Score Leads</span>
                                <span>32% Win Rate</span>
                            </div>
                            <Progress value={32} className="h-1.5 bg-zinc-100 [&>div]:bg-blue-400 shadow-inner" />
                        </div>
                    </div>
                    <div className="bg-zinc-50/50 rounded-xl p-6 border border-zinc-100 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <Thermometer className="w-8 h-8 text-rose-500" />
                            <div>
                                <h4 className="text-sm font-black text-zinc-900 tracking-tight uppercase">Hot Leads Active</h4>
                                <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Requiring immediate response.</p>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-rose-600">84</span>
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Profiles</span>
                        </div>
                        <Button className="w-full mt-6 bg-zinc-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest py-6 rounded-xl shadow-lg active:scale-95 transition-all">
                            Review High Priority Leads
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
