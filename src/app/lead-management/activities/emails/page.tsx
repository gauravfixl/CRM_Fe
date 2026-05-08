"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Mail,
    Send,
    BarChart3,
    Search,
    Filter,
    ChevronLeft,
    Plus,
    Eye,
    MousePointer2,
    Clock,
    MessageSquare,
    ExternalLink,
    Layers,
    Edit2,
    Trash2,
    MoreHorizontal,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/shared/components/ui/sheet"
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { Label } from "@/shared/components/ui/label"

const EMAIL_STATS = [
    { label: "Emails Sent", val: "1,240", icon: Send, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Open Rate", val: "48.2%", icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Click Rate", val: "12.4%", icon: MousePointer2, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Replies", val: "84", icon: MessageSquare, color: "text-cyan-600", bg: "bg-cyan-50" },
]

const PERFORMANCE_MAILS = [
    { id: "EML-001", subject: "Re: Follow-up on Technical Vetting", lead: "Aarav Sharma", to: "aarav@nexustech.com", status: "Opened", time: "14m ago", opens: 3, clicks: 1, priority: "High" },
    { id: "EML-002", subject: "New Platform ROI Modeling - Deck Attached", lead: "Ishani Gupta", to: "ishani@quantum.io", status: "Clicked", time: "1h ago", opens: 5, clicks: 3, priority: "Critical" },
    { id: "EML-003", subject: "Introduction: Nexus Tech and Fixl", lead: "Zoya Khan", to: "zoya@khanco.in", status: "Sent", time: "4h ago", opens: 0, clicks: 0, priority: "Medium" },
]

const INITIAL_TEMPLATES = [
    { title: "Enterprise Intro", usage: 142, conversion: "18%" },
    { title: "Follow-up: No Reply", usage: 89, conversion: "12%" },
    { title: "Re-engagement: V2", usage: 64, conversion: "24%" },
]

type Mail = typeof PERFORMANCE_MAILS[number]
type Template = typeof INITIAL_TEMPLATES[number]
type ComposeErrors = Partial<Record<"to" | "subject" | "body", string>>
type TemplateErrors = Partial<Record<"title" | "conversion", string>>

const emptyCompose = { to: "", subject: "", body: "", priority: "Medium" }
const emptyTemplate = { title: "", conversion: "" }

export default function EmailsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [mails, setMails] = useState<Mail[]>(PERFORMANCE_MAILS)
    const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [priorityFilter, setPriorityFilter] = useState("all")
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [isTemplateOpen, setIsTemplateOpen] = useState(false)
    const [isSequenceOpen, setIsSequenceOpen] = useState(false)
    const [isPerfOpen, setIsPerfOpen] = useState(false)
    const [composeForm, setComposeForm] = useState(emptyCompose)
    const [composeErrors, setComposeErrors] = useState<ComposeErrors>({})
    const [templateForm, setTemplateForm] = useState(emptyTemplate)
    const [templateErrors, setTemplateErrors] = useState<TemplateErrors>({})

    useEffect(() => { setIsClient(true) }, [])

    const filteredMails = useMemo(() => {
        return mails.filter(m => {
            const q = searchQuery.toLowerCase()
            const matchesSearch =
                m.subject.toLowerCase().includes(q) ||
                m.lead.toLowerCase().includes(q) ||
                m.to.toLowerCase().includes(q)
            const matchesStatus = statusFilter === "all" || m.status === statusFilter
            const matchesPriority = priorityFilter === "all" || m.priority === priorityFilter
            return matchesSearch && matchesStatus && matchesPriority
        })
    }, [mails, searchQuery, statusFilter, priorityFilter])

    const activeFilterCount = [statusFilter, priorityFilter].filter(f => f !== "all").length

    const validateCompose = (): boolean => {
        const e: ComposeErrors = {}
        if (!composeForm.to.trim()) e.to = "Recipient email is required"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(composeForm.to.trim())) e.to = "Enter a valid email address"

        if (!composeForm.subject.trim()) e.subject = "Subject is required"
        else if (composeForm.subject.trim().length < 3) e.subject = "Subject must be at least 3 characters"
        else if (composeForm.subject.trim().length > 120) e.subject = "Subject must be under 120 characters"

        if (!composeForm.body.trim()) e.body = "Email body is required"
        else if (composeForm.body.trim().length < 10) e.body = "Body must be at least 10 characters"

        setComposeErrors(e)
        return Object.keys(e).length === 0
    }

    const validateTemplate = (): boolean => {
        const e: TemplateErrors = {}
        if (!templateForm.title.trim()) e.title = "Template name is required"
        else if (templateForm.title.trim().length < 3) e.title = "Name must be at least 3 characters"

        if (!templateForm.conversion.trim()) e.conversion = "Conversion goal is required"
        else if (!/^\d+(\.\d+)?%?$/.test(templateForm.conversion.trim())) e.conversion = "Enter a number with optional %"

        setTemplateErrors(e)
        return Object.keys(e).length === 0
    }

    const handleCompose = () => {
        if (!validateCompose()) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }
        const id = `EML-${String(mails.length + 1).padStart(3, "0")}`
        const leadName = composeForm.to.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, l => l.toUpperCase())
        setMails([{
            id,
            subject: composeForm.subject,
            lead: leadName,
            to: composeForm.to,
            status: "Sent",
            time: "Just now",
            opens: 0,
            clicks: 0,
            priority: composeForm.priority
        }, ...mails])
        setIsComposeOpen(false)
        setComposeForm(emptyCompose)
        toast({ title: "Email Sent", description: `Sent to ${composeForm.to}` })
    }

    const handleAddTemplate = () => {
        if (!validateTemplate()) {
            toast({ title: "Validation failed", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }
        const conv = templateForm.conversion.endsWith("%") ? templateForm.conversion : `${templateForm.conversion}%`
        setTemplates([{ title: templateForm.title, conversion: conv, usage: 0 }, ...templates])
        setIsTemplateOpen(false)
        setTemplateForm(emptyTemplate)
        toast({ title: "Template Saved", description: "New template added to the library." })
    }

    const handleDeleteMail = (id: string) => {
        setMails(mails.filter(m => m.id !== id))
        toast({ title: "Email Removed", description: "Tracking entry deleted." })
    }

    const handleDeleteTemplate = (i: number) => {
        setTemplates(templates.filter((_, idx) => idx !== i))
        toast({ title: "Template Removed", description: "Template deleted from library." })
    }

    const clearFilters = () => {
        setStatusFilter("all")
        setPriorityFilter("all")
    }

    if (!isClient) return null

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: "90%" }}>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-cyan-50/60 p-4 rounded-none border border-cyan-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-none bg-white text-cyan-600 border border-cyan-100 shadow-sm">
                                <Mail size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Email Outreach Intelligence</h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Track the performance of your communication engine. Audit open rates, link clicks, and automated sequence progression to refine your messaging.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => setIsPerfOpen(true)} variant="outline" className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5 rounded-none">
                        <BarChart3 className="h-4 w-4 mr-2 text-slate-400" /> Templates Performance
                    </Button>
                    <Button onClick={() => setIsComposeOpen(true)} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none rounded-none">
                        <Plus className="h-4 w-4 mr-2" /> Compose Email
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-5">
                    {EMAIL_STATS.map((s, i) => (
                        <Card key={i} className={`border-none shadow-sm ring-1 ring-slate-100 rounded-none ${s.bg} p-4 space-y-3`}>
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-none bg-white/80 ${s.color} shadow-sm`}>
                                    <s.icon size={18} />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-400/50">30D Summary</span>
                            </div>
                            <div className="space-y-0.5">
                                <p className={`text-[10px] font-semibold tracking-wider opacity-70 ${s.color}`}>{s.label}</p>
                                <h4 className="text-[20px] font-semibold text-slate-900">{s.val}</h4>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-sky-50/40 overflow-hidden p-6">
                    <div className="flex justify-between items-start mb-6 gap-4 flex-wrap">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Real-time Outreach Tracking</h3>
                            <p className="text-[11px] text-slate-500 font-semibold">Showing {filteredMails.length} of {mails.length} mails.</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="relative w-56">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                <Input
                                    placeholder="Search emails..."
                                    className="pl-9 h-9 rounded-none border-slate-200 bg-white text-[12px]"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-9 border-slate-200 bg-white text-slate-600 font-semibold px-3 gap-2 rounded-none text-[11px]">
                                        <Filter size={12} /> Filters
                                        {activeFilterCount > 0 && (
                                            <Badge className="bg-indigo-100 text-indigo-600 border-none font-bold text-[9px] h-4 rounded-none">{activeFilterCount}</Badge>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 bg-white border-slate-200 rounded-none p-4 space-y-3" align="end">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[12px] font-bold text-slate-900">Filters</h4>
                                        {activeFilterCount > 0 && (
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-rose-500" onClick={clearFilters}>Clear</Button>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Status</Label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200 text-[12px]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-white rounded-none">
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="Sent">Sent</SelectItem>
                                                <SelectItem value="Opened">Opened</SelectItem>
                                                <SelectItem value="Clicked">Clicked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold text-slate-500 uppercase">Priority</Label>
                                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                            <SelectTrigger className="h-9 rounded-none border-slate-200 text-[12px]"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-white rounded-none">
                                                <SelectItem value="all">All Priorities</SelectItem>
                                                <SelectItem value="Critical">Critical</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredMails.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-[13px] font-medium">No emails match your filters.</div>
                        ) : filteredMails.map((mail) => (
                            <div key={mail.id} className="p-4 rounded-none bg-white border border-slate-100 group hover:border-indigo-200 hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className={`h-12 w-12 rounded-none flex items-center justify-center border ${mail.status === 'Opened' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : mail.status === 'Clicked' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            <Send size={20} />
                                        </div>
                                        <div className="space-y-1 min-w-0">
                                            <h4 className="text-[14px] font-semibold text-slate-900 tracking-tight line-clamp-1">{mail.subject}</h4>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge className="bg-indigo-600 text-white border-none px-2 text-[9px] font-semibold rounded-none">{mail.lead}</Badge>
                                                <span className="text-[10px] font-medium text-slate-400 truncate">{mail.to}</span>
                                                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5"><Clock size={10} /> {mail.time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center">
                                            <p className="text-[9px] font-semibold text-slate-300">Opens</p>
                                            <div className="flex items-center gap-1">
                                                <Eye size={12} className="text-emerald-500" />
                                                <span className="text-[13px] font-semibold text-slate-900">{mail.opens}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[9px] font-semibold text-slate-300">Clicks</p>
                                            <div className="flex items-center gap-1">
                                                <MousePointer2 size={12} className="text-amber-500" />
                                                <span className="text-[13px] font-semibold text-slate-900">{mail.clicks}</span>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-none">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-white border-slate-200 rounded-none">
                                                <DropdownMenuItem onClick={() => toast({ title: "Email Opened", description: `Viewing tracking details for ${mail.id}` })} className="text-[12px] cursor-pointer">
                                                    <ExternalLink size={12} className="mr-2" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDeleteMail(mail.id)} className="text-[12px] text-rose-600 cursor-pointer">
                                                    <Trash2 size={12} className="mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="lg:col-span-4 space-y-5">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-slate-900 p-6 space-y-5 relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 text-indigo-400 translate-x-4 translate-y-4">
                            <Layers size={120} />
                        </div>
                        <h4 className="text-[16px] font-semibold">Active Nurture Sync</h4>
                        <div className="space-y-4 relative z-10">
                            <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                                Aarav Sharma has moved to Step 3 of the "Enterprise Discovery" sequence. Next automated mail in 2 days.
                            </p>
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                    <span>Sequence Progress</span>
                                    <span className="text-indigo-600">60%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white rounded-none overflow-hidden shadow-sm">
                                    <div className="h-full bg-indigo-500" style={{ width: '60%' }} />
                                </div>
                            </div>
                            <Button onClick={() => setIsSequenceOpen(true)} className="w-full h-10 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-none border-none text-[11px] shadow-lg shadow-indigo-200">
                                Edit Sequence
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-amber-50/50 p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[14px] font-semibold text-slate-900 tracking-tight">Winning Templates</h4>
                            <Button onClick={() => setIsTemplateOpen(true)} variant="ghost" size="icon" className="h-7 w-7 text-indigo-600 hover:bg-white rounded-none">
                                <Plus size={16} />
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {templates.map((t, i) => (
                                <div key={i} className="group flex items-center justify-between p-3 rounded-none bg-white border border-slate-100 hover:border-indigo-200 transition-all">
                                    <div className="space-y-0.5">
                                        <h5 className="text-[12px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{t.title}</h5>
                                        <p className="text-[10px] text-slate-400 font-semibold">{t.usage} times used</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-[12px] font-semibold text-emerald-500">{t.conversion}</p>
                                            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Conv.</p>
                                        </div>
                                        <Button onClick={() => handleDeleteTemplate(i)} size="icon" variant="ghost" className="h-7 w-7 text-slate-300 hover:text-rose-600 rounded-none">
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={() => toast({ title: "Templates Library", description: "Loading global library..." })}
                            variant="outline"
                            className="w-full h-9 border-slate-200 bg-white text-indigo-600 font-semibold text-[10px] rounded-none hover:bg-indigo-50">
                            Global Templates Library
                        </Button>
                    </Card>
                </div>

            </div>

            <Sheet open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-cyan-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900">Compose Email</SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">Send a tracked email to a lead.</p>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Recipient Email *</Label>
                                <Input
                                    type="email"
                                    placeholder="lead@company.com"
                                    className={`h-11 rounded-none border-slate-200 ${composeErrors.to ? "border-rose-400" : ""}`}
                                    value={composeForm.to}
                                    onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                                />
                                {composeErrors.to && <p className="text-[11px] text-rose-500 font-medium">{composeErrors.to}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Subject *</Label>
                                <Input
                                    placeholder="Email subject (3-120 chars)"
                                    className={`h-11 rounded-none border-slate-200 ${composeErrors.subject ? "border-rose-400" : ""}`}
                                    value={composeForm.subject}
                                    onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                                />
                                {composeErrors.subject && <p className="text-[11px] text-rose-500 font-medium">{composeErrors.subject}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Body *</Label>
                                <textarea
                                    placeholder="Write your message..."
                                    rows={8}
                                    className={`w-full rounded-none border border-slate-200 p-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-indigo-400 ${composeErrors.body ? "border-rose-400" : ""}`}
                                    value={composeForm.body}
                                    onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                                />
                                {composeErrors.body && <p className="text-[11px] text-rose-500 font-medium">{composeErrors.body}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Priority</Label>
                                <Select value={composeForm.priority} onValueChange={(val) => setComposeForm({ ...composeForm, priority: val })}>
                                    <SelectTrigger className="h-11 rounded-none border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-white rounded-none">
                                        <SelectItem value="Critical">Critical</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200 font-semibold" onClick={() => setIsComposeOpen(false)}>Cancel</Button>
                            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none" onClick={handleCompose}>
                                <Send className="h-4 w-4 mr-2" /> Send Email
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-amber-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900">Create New Template</SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">Save a reusable template for outreach.</p>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Template Name *</Label>
                                <Input
                                    placeholder="e.g., Enterprise Intro"
                                    className={`h-11 rounded-none border-slate-200 ${templateErrors.title ? "border-rose-400" : ""}`}
                                    value={templateForm.title}
                                    onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                                />
                                {templateErrors.title && <p className="text-[11px] text-rose-500 font-medium">{templateErrors.title}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Conversion Goal *</Label>
                                <Input
                                    placeholder="e.g., 18 or 18%"
                                    className={`h-11 rounded-none border-slate-200 ${templateErrors.conversion ? "border-rose-400" : ""}`}
                                    value={templateForm.conversion}
                                    onChange={(e) => setTemplateForm({ ...templateForm, conversion: e.target.value })}
                                />
                                {templateErrors.conversion && <p className="text-[11px] text-rose-500 font-medium">{templateErrors.conversion}</p>}
                            </div>
                        </div>

                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50 flex-row gap-3">
                            <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200 font-semibold" onClick={() => setIsTemplateOpen(false)}>Cancel</Button>
                            <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-none" onClick={handleAddTemplate}>Save Template</Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isSequenceOpen} onOpenChange={setIsSequenceOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-indigo-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900">Edit Nurture Sequence</SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">Customize the "Enterprise Discovery" sequence.</p>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {["Step 1: Case Study Intro", "Step 2: Pricing Logic", "Step 3: Executive Session"].map((step, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-none bg-slate-50 border border-slate-100">
                                    <span className="text-[12px] font-bold text-slate-700">{step}</span>
                                    <Badge className="bg-indigo-100 text-indigo-600 border-none font-bold text-[9px] rounded-none">Active</Badge>
                                </div>
                            ))}
                        </div>
                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <Button className="w-full h-11 bg-indigo-600 text-white font-bold rounded-none" onClick={() => { setIsSequenceOpen(false); toast({ title: "Sequence Saved", description: "Changes have been applied." }) }}>
                                Save Changes
                            </Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isPerfOpen} onOpenChange={setIsPerfOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md bg-white p-0 rounded-none border-l border-slate-200">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-6 border-b border-slate-100 bg-cyan-50/60">
                            <SheetTitle className="text-[18px] font-bold text-slate-900">Templates Performance</SheetTitle>
                            <p className="text-[12px] text-slate-500 font-medium">Conversion stats per template.</p>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {templates.map((t, i) => (
                                <div key={i} className="p-4 bg-slate-50 border border-slate-100 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <h5 className="text-[13px] font-semibold text-slate-900">{t.title}</h5>
                                        <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none">{t.conversion}</Badge>
                                    </div>
                                    <p className="text-[11px] text-slate-500">{t.usage} sends</p>
                                </div>
                            ))}
                        </div>
                        <SheetFooter className="p-6 border-t border-slate-100 bg-slate-50/50">
                            <Button className="w-full h-11 bg-indigo-600 text-white font-bold rounded-none" onClick={() => setIsPerfOpen(false)}>Close</Button>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    )
}
