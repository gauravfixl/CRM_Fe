"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Star,
    MessageSquare,
    Smile,
    Meh,
    Frown,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    TrendingUp,
    Quote,
    Send,
    ThumbsUp,
    BarChart3,
    ArrowRight
} from "lucide-react"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"

// Types
interface FeedbackEntry {
    id: number;
    account: string;
    nps: number;
    csat: number; // 1-5
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    comment: string;
    date: string;
}

const initialFeedback: FeedbackEntry[] = [
    { id: 1, account: "Global Dynamics", nps: 10, csat: 5, sentiment: "Positive", comment: "The platform's new analytics dashboard is a game changer for our executive team.", date: "2024-10-12" },
    { id: 2, account: "DataScale Inc", nps: 9, csat: 4, sentiment: "Positive", comment: "Good support response times, looking forward to the mobile app update.", date: "2024-10-08" },
    { id: 3, account: "Innova Hub", nps: 5, csat: 3, sentiment: "Neutral", comment: "Complex setup process, but the features are robust once configured.", date: "2024-10-05" },
    { id: 4, account: "Swift Apps", nps: 3, csat: 2, sentiment: "Negative", comment: "Experienced some latency during peak hours last week. Needs optimization.", date: "2024-09-28" },
    { id: 5, account: "Horizon Media", nps: 8, csat: 4, sentiment: "Positive", comment: "Very satisfied with the integration capabilities. Saved us hours of manual work.", date: "2024-09-20" },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        amber: "from-amber-50 to-amber-100/50 border-amber-200/50 text-amber-600",
        rose: "from-rose-50 to-rose-100/50 border-rose-200/50 text-rose-600",
    }
    const currentClasses = colorClasses[color] || colorClasses.blue
    return (
        <Card className={cn("bg-gradient-to-br border shadow-none transition-all hover:shadow-md", currentClasses.split(' ').slice(0, 3).join(' '))}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide font-outfit mb-2">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight leading-none">{value}</h3>
                        <p className="mt-2 text-xs font-medium text-slate-400 font-outfit">{subValue}</p>
                    </div>
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-white/60 shadow-sm border border-white/50", currentClasses.split(' ').pop())}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function FeedbackPage() {
    const [feedback, setFeedback] = useState<FeedbackEntry[]>(initialFeedback)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingFeedback, setEditingFeedback] = useState<FeedbackEntry | null>(null)
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<FeedbackEntry>>({
        account: '',
        nps: 10,
        csat: 5,
        sentiment: 'Positive',
        comment: '',
        date: new Date().toISOString().split('T')[0]
    })

    const metrics = useMemo(() => {
        const total = feedback.length
        const avgNps = (feedback.reduce((sum, f) => sum + f.nps, 0) / total).toFixed(1)
        const positiveCount = feedback.filter(f => f.sentiment === 'Positive').length
        const sentimentRate = ((positiveCount / total) * 100).toFixed(0)

        return { total, avgNps, sentimentRate: `${sentimentRate}%`, responses: total }
    }, [feedback])

    const filteredFeedback = useMemo(() => {
        return feedback.filter(f => f.account.toLowerCase().includes(search.toLowerCase()))
    }, [feedback, search])

    const handleDelete = (id: number) => {
        setFeedback(prev => prev.filter(f => f.id !== id))
        toast({ title: "Feedback Removed", description: "Entry deleted from historical records." })
    }

    const handleSave = () => {
        if (!formData.account || !formData.comment) return

        if (editingFeedback) {
            setFeedback(prev => prev.map(f => f.id === editingFeedback.id ? { ...f, ...formData } as FeedbackEntry : f))
            toast({ title: "Feedback Updated", description: "Survey record refreshed." })
        } else {
            const newId = feedback.length > 0 ? Math.max(...feedback.map(f => f.id)) + 1 : 1
            setFeedback(prev => [...prev, { ...formData, id: newId } as FeedbackEntry])
            toast({ title: "Response Recorded", description: "New survey data captured." })
        }
        setIsDialogOpen(false)
        setEditingFeedback(null)
        setFormData({ account: '', nps: 10, csat: 5, sentiment: 'Positive', comment: '', date: new Date().toISOString().split('T')[0] })
    }

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment) {
            case 'Positive': return <Smile className="h-4 w-4 text-emerald-500" />
            case 'Negative': return <Frown className="h-4 w-4 text-rose-500" />
            default: return <Meh className="h-4 w-4 text-amber-500" />
        }
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Feedback & <span className="text-emerald-600">NPS Vault</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Voice of the customer repository. Monitor Net Promoter Score and satisfaction trends.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingFeedback(null); setFormData({ account: '', nps: 10, csat: 5, sentiment: 'Positive', comment: '', date: new Date().toISOString().split('T')[0] }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-emerald-600/20 gap-2">
                            <Plus className="h-5 w-5" /> Add Survey Response
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingFeedback ? 'Update Response' : 'Log New Response'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Account</Label>
                                <Input value={formData.account} onChange={e => setFormData({ ...formData, account: e.target.value })} placeholder="e.g. Acme Corp" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">NPS Score (0-10)</Label>
                                    <Input type="number" min="0" max="10" value={formData.nps} onChange={e => setFormData({ ...formData, nps: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Sentiment</Label>
                                    <Select value={formData.sentiment} onValueChange={(v: any) => setFormData({ ...formData, sentiment: v })}>
                                        <SelectTrigger><SelectValue placeholder="Sentiment" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Positive">Positive</SelectItem>
                                            <SelectItem value="Neutral">Neutral</SelectItem>
                                            <SelectItem value="Negative">Negative</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Client Comment / Quote</Label>
                                <Textarea value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} placeholder="Enter verbatim feedback..." className="min-h-[100px]" />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" /> Save Feedback
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Avg. NPS Score" value={metrics.avgNps} subValue="Portfolio Benchmark" icon={BarChart3} color="emerald" />
                <MetricBox title="Positive Sentiment" value={metrics.sentimentRate} subValue="Verbatim Happiness" icon={Smile} color="blue" />
                <MetricBox title="Total Responses" value={metrics.responses} subValue="Last 90 Days" icon={MessageSquare} color="amber" />
                <MetricBox title="Promoters" value="12" subValue="Advocacy Potential" icon={ThumbsUp} color="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-sm font-outfit">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Verbatim Feedback Log</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by client..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {filteredFeedback.map((item) => (
                                <div key={item.id} className="group relative p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-md hover:border-emerald-100 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                <Building2 className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 font-outfit">{item.account}</p>
                                                <p className="text-[10px] font-semibold text-slate-400 font-outfit">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-end">
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                                    item.sentiment === 'Positive' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                        item.sentiment === 'Negative' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                            "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    NPS: {item.nps}
                                                </span>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-emerald-600 transition-colors">
                                                        <MoreVertical className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl">
                                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                                        setEditingFeedback(item)
                                                        setFormData(item)
                                                        setIsDialogOpen(true)
                                                    }}>
                                                        <PencilLine className="h-4 w-4" /> Edit Entry
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                        <Send className="h-4 w-4" /> Forward to Team
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer border-t mt-1" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="h-4 w-4" /> Delete Record
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Quote className="absolute -left-2 -top-2 h-8 w-8 text-emerald-600/5 rotate-180" />
                                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed pl-4 italic font-outfit relative z-10">
                                            "{item.comment}"
                                        </p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            {getSentimentIcon(item.sentiment)}
                                            <span className="text-[11px] font-bold text-slate-500 font-outfit capitalize">{item.sentiment} Sentiment</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("h-3 w-3", i < item.csat ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6">NPS Distribution</h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Promoters (9-10)', count: 18, color: 'bg-emerald-500', pct: 65 },
                                { label: 'Passives (7-8)', count: 8, color: 'bg-amber-500', pct: 25 },
                                { label: 'Detractors (0-6)', count: 3, color: 'bg-rose-500', pct: 10 },
                            ].map((d, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-bold font-outfit">
                                        <span className="text-slate-600">{d.label}</span>
                                        <span className="text-slate-900">{d.count} accounts</span>
                                    </div>
                                    <Progress value={d.pct} className={cn("h-1.5 bg-slate-50", d.color)} />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-emerald-100 bg-emerald-50/10 p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-16 w-16 bg-emerald-600/5 rounded-bl-full transition-transform group-hover:scale-150" />
                        <h3 className="text-xs font-bold text-emerald-600 tracking-wider flex items-center gap-2 font-outfit">
                            <TrendingUp className="h-4 w-4" /> AI Sentiment Pulse
                        </h3>
                        <p className="mt-4 text-[13px] font-medium text-slate-600 leading-relaxed font-outfit">
                            Current portfolio sentiment is <span className="text-emerald-600 font-bold">Trending Up</span>. Expansion potential is high in the E-commerce segment.
                        </p>
                        <Button variant="outline" className="w-full mt-6 py-5 border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-50 font-outfit">
                            Detailed AI Report
                        </Button>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6">Recurring Themes</h3>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { text: 'Speed', type: 'Positive' },
                                { text: 'Mobile UX', type: 'Neutral' },
                                { text: 'Analytics', type: 'Positive' },
                                { text: 'Billing', type: 'Negative' },
                                { text: 'Integrations', type: 'Positive' },
                            ].map((tag, i) => (
                                <span key={i} className={cn(
                                    "px-2.5 py-1 rounded-lg text-[10px] font-bold font-outfit border cursor-pointer hover:shadow-sm transition-all",
                                    tag.type === 'Positive' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        tag.type === 'Negative' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                            "bg-amber-50 text-amber-600 border-amber-100"
                                )}>
                                    {tag.text}
                                </span>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Feedback Loop</h3>
                            <ArrowRight className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-[11px] font-bold text-slate-600 leading-tight font-outfit">
                                4 unresolved negative feedback entries require executive follow-up.
                            </p>
                            <Button className="mt-3 w-full py-2 bg-slate-900 text-white rounded-lg text-[10px] font-bold">
                                View Action Items
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
