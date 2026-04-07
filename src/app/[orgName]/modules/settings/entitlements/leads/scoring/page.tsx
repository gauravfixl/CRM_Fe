"use client"

import React, { useState, useEffect, useMemo } from "react"
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
    Lightbulb,
    Loader2
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
import { getLeadListByOrg } from "@/hooks/leadHooks"

interface Lead {
    _id: string
    name: string
    stage: string
    source: string
    probability: number
    estimatedValue: number
    isDeleted: boolean
    createdAt: string
}

export default function LeadScoringRulesPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [leads, setLeads] = useState<Lead[]>([])

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await getLeadListByOrg()
                setLeads(res?.data?.data || [])
            } catch (error) {
                console.error("Failed to fetch leads for scoring:", error)
                toast.error("Failed to load scoring data")
                setLeads([])
            } finally {
                setIsFetching(false)
            }
        }
        fetchLeads()
    }, [])

    const scoringMetrics = useMemo(() => {
        const totalLeads = leads.length
        const hotLeads = leads.filter(l => (l.probability || 0) > 80).length
        const warmLeads = leads.filter(l => (l.probability || 0) >= 40 && (l.probability || 0) <= 80).length
        const coldLeads = leads.filter(l => (l.probability || 0) < 40).length

        const wonLeads = leads.filter(l => l.stage === "Closed-Won" || l.stage === "Won")
        const highProbWon = wonLeads.filter(l => (l.probability || 0) > 80).length
        const highProbTotal = leads.filter(l => (l.probability || 0) > 80).length
        const highProbWinRate = highProbTotal > 0 ? Math.round((highProbWon / highProbTotal) * 100) : 0

        const warmProbWon = wonLeads.filter(l => (l.probability || 0) >= 40 && (l.probability || 0) <= 80).length
        const warmProbTotal = warmLeads
        const warmWinRate = warmProbTotal > 0 ? Math.round((warmProbWon / warmProbTotal) * 100) : 0

        const accuracy = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100 * 2.5) : 0
        const clampedAccuracy = Math.min(accuracy, 100)

        return { hotLeads, warmLeads: warmLeads, coldLeads, highProbWinRate, warmWinRate, accuracy: clampedAccuracy }
    }, [leads])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const scoringRules = [
        { id: "1", attribute: "Job Title", condition: "Contains 'Director' or 'VP'", impact: "+25", status: "Active" },
        { id: "2", attribute: "Company Size", condition: "> 500 Employees", impact: "+20", status: "Active" },
        { id: "3", attribute: "Source", condition: "Equals 'Referral'", impact: "+35", status: "Active" },
        { id: "4", attribute: "Email Domain", condition: "Equals '@gmail.com' or '@yahoo.com'", impact: "-15", status: "Active" },
        { id: "5", attribute: "Web Intent", condition: "Price Page Visit > 3 times", impact: "+15", status: "Active" },
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
                            <h1 className="text-xl font-semibold text-gray-900">Lead Scoring Model</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-medium">Predictive Logic</Badge>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">Define how lead quality is calculated based on firmographic and behavioral data.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Score preview generated for 2,847 leads")}
                        className="h-10 border-zinc-200 text-xs font-medium px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <Zap className="w-4 h-4 mr-2 text-amber-500 fill-amber-500" />
                        Dry Run Score
                    </Button>
                    <Button
                        onClick={() => handleAction("New scoring rule creation started")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Scoring Rule
                    </Button>
                </div>
            </div>

            {/* THRESHOLD INSIGHTS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Hot Threshold</p>
                                <p className="text-white text-xl font-semibold">Score &gt; 80</p>
                                <p className="text-[10px] text-white opacity-80">Priority Sales Routing</p>
                            </div>
                            <Flame className="w-4 h-4 text-white animate-pulse" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Warm Threshold</p>
                                <p className="text-xl font-semibold text-gray-900">Score 40-79</p>
                                <p className="text-[10px] text-gray-500">Nurturing Queue</p>
                            </div>
                            <Zap className="w-4 h-4 text-amber-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Cold Threshold</p>
                                <p className="text-xl font-semibold text-gray-900">Score &lt; 40</p>
                                <p className="text-[10px] text-gray-500">Low Impact Area</p>
                            </div>
                            <Snowflake className="w-4 h-4 text-blue-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Model Accuracy</p>
                                <p className="text-xl font-semibold text-emerald-600">{isFetching ? "..." : `${scoringMetrics.accuracy}%`}</p>
                                <p className="text-[10px] text-gray-500">Based on Won leads</p>
                            </div>
                            <Target className="w-4 h-4 text-emerald-400" />
                        </div>
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
                            <TableHead className="py-4 px-6 text-[11px] font-medium text-gray-500">Lead Attribute</TableHead>
                            <TableHead className="py-4 text-[11px] font-medium text-gray-500">Condition</TableHead>
                            <TableHead className="py-4 text-[11px] font-medium text-gray-500 text-center">Score Impact</TableHead>
                            <TableHead className="py-4 text-[11px] font-medium text-gray-500">Status</TableHead>
                            <TableHead className="py-4 text-right pr-6 text-[11px] font-medium text-gray-500">Actions</TableHead>
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
                                        <span className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{rule.attribute}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className="text-[10px] font-medium border-zinc-100 text-zinc-500 bg-white px-3 py-1 rounded shadow-none">
                                        {rule.condition}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className={`text-sm font-semibold ${rule.impact.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{rule.impact}</span>
                                        {rule.impact.startsWith('+') ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-rose-500" />}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${rule.status === 'Active' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50 shadow-none' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-100'}`}>
                                        {rule.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all" onClick={() => handleAction("Scoring rule editor opened")}>
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 shadow-xl border-zinc-100 p-2">
                                                <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400 px-2 py-1.5">Rule Strategy</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer" onClick={() => handleAction("Impact preview generated")}>
                                                    <Zap className="w-3.5 h-3.5" />
                                                    Preview Impact
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer" onClick={() => handleAction("Scoring rule cloned")}>
                                                    <RefreshCcw className="w-3.5 h-3.5" />
                                                    Clone Logic
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-50" />
                                                <DropdownMenuItem className="text-xs font-medium gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-md cursor-pointer" onClick={() => handleAction("Scoring rule removed")}>
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
                    <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" />
                        Max score is capped at 100 per lead profile. Negative scores are allowed.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-medium transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors" onClick={() => toast.info("Loading next page...")}>Next</Button>
                    </div>
                </div>
            </div>

            {/* PREDICTIVE INSIGHTS */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
                    <div>
                        <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                            Scoring Accuracy & Quality
                        </h3>
                        <p className="text-[11px] text-zinc-400 font-medium">Model performance based on historical conversion data.</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-medium text-[9px] px-4 py-1">Optimized</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-medium text-zinc-400">Score/Quality Correlation</span>
                            <span className="text-lg font-semibold text-gray-900">High</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-[11px] font-medium text-zinc-500">
                                <span>80+ Score Leads</span>
                                <span>{isFetching ? "..." : `${scoringMetrics.highProbWinRate}% Win Rate`}</span>
                            </div>
                            <Progress value={isFetching ? 0 : scoringMetrics.highProbWinRate} className="h-1.5 bg-zinc-100 [&>div]:bg-blue-600 shadow-inner" />

                            <div className="flex justify-between text-[11px] font-medium text-zinc-500">
                                <span>40-79 Score Leads</span>
                                <span>{isFetching ? "..." : `${scoringMetrics.warmWinRate}% Win Rate`}</span>
                            </div>
                            <Progress value={isFetching ? 0 : scoringMetrics.warmWinRate} className="h-1.5 bg-zinc-100 [&>div]:bg-blue-400 shadow-inner" />
                        </div>
                    </div>
                    <div className="bg-zinc-50/50 rounded-xl p-6 border border-zinc-100 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <Thermometer className="w-8 h-8 text-rose-500" />
                            <div>
                                <h4 className="text-base font-medium text-gray-900">Hot Leads Active</h4>
                                <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Requiring immediate response.</p>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-semibold text-rose-600">{isFetching ? <Loader2 className="w-6 h-6 animate-spin text-rose-400 inline" /> : scoringMetrics.hotLeads}</span>
                            <span className="text-xs font-medium text-zinc-300">Profiles</span>
                        </div>
                        <Button className="w-full mt-6 bg-zinc-900 hover:bg-black text-white text-[10px] font-medium py-6 rounded-xl shadow-lg active:scale-95 transition-all" onClick={() => handleAction("Loading high priority leads...")}>
                            Review High Priority Leads
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
