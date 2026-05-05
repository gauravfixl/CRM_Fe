"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    FileText,
    Copy,
    Layout,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    Code,
    Sparkles,
    CheckCircle2,
    Clock,
    Zap,
    Tag,
    Share2,
    ChevronRight,
    ArrowUpRight,
    SearchIcon,
    RefreshCw,
    ShieldCheck,
    X,
    FolderHeart,
    Flame,
    History,
    FileJson,
    Settings2,
    Check,
    Layers,
    Star as StarIcon
} from "lucide-react"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
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
import { Textarea } from "@/shared/components/ui/textarea"
import { useToast } from "@/shared/components/ui/use-toast"
import { Badge } from "@/shared/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/shared/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"

// Types
interface Template {
    id: number;
    name: string;
    category: 'Onboarding' | 'Renewal' | 'Support' | 'Marketing' | 'Personal' | 'System';
    type: 'Email' | 'SMS' | 'Notification';
    lastUsed: string;
    usageCount: number;
    author: string;
    content: string;
    folder: 'active' | 'archives' | 'drafts' | 'trash';
    isStarred?: boolean;
}

const initialTemplates: Template[] = [
    { id: 1, name: "Executive QBR Invitation", category: "Renewal", type: "Email", lastUsed: "2 hours ago", usageCount: 145, author: "Sarah J.", content: "<h1>Hello {{account.name}},</h1><p>We would like to invite you to our quarterly...", folder: 'active', isStarred: true },
    { id: 2, name: "Technical Kickoff Checklist", category: "Onboarding", type: "Email", lastUsed: "Yesterday", usageCount: 82, author: "Mike W.", content: "Dear Team, finding the onboarding checklist below...", folder: 'active' },
    { id: 3, name: "SLA Resolution Alert", category: "Support", type: "SMS", lastUsed: "12 mins ago", usageCount: 1240, author: "System", content: "SLA ALERT: Case #{{case_id}} has been resolved with 99.9% uptime compliance.", folder: 'active' },
    { id: 4, name: "New Feature: AI Insights", category: "Marketing", type: "Email", lastUsed: "3 days ago", usageCount: 210, author: "Emily R.", content: "Exciting news! Our new AI Insights engine is now live...", folder: 'archives' },
    { id: 5, name: "Account Churn Risk Ping", category: "Personal", type: "Notification", lastUsed: "5 hours ago", usageCount: 15, author: "Sarah J.", content: "Heads up: Account health dropped below 20%. Execute retention sequence.", folder: 'drafts' },
    { id: 6, name: "Legacy System Alert", category: "System", type: "Notification", lastUsed: "2 months ago", usageCount: 0, author: "Admin", content: "System will undergo maintenance at UTC 02:00.", folder: 'trash' },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        indigo: "from-indigo-50 to-indigo-100/50 border-indigo-200/50 text-indigo-600",
        amber: "from-amber-50 to-amber-100/50 border-amber-200/50 text-amber-600",
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

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>(initialTemplates)
    const [search, setSearch] = useState("")
    const [currentFolder, setCurrentFolder] = useState<'active' | 'archives' | 'drafts' | 'trash'>('active')
    const [selectedEntries, setSelectedEntries] = useState<number[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [activeTemplate, setActiveTemplate] = useState<Template | null>(null)
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<Template>>({
        name: '',
        category: 'Onboarding',
        type: 'Email',
        lastUsed: 'Never',
        usageCount: 0,
        author: 'System Admin',
        content: '',
        folder: 'active'
    })

    const metrics = useMemo(() => {
        const total = templates.length
        const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0)
        const categories = new Set(templates.map(t => t.category)).size
        const automationRate = "88.4%"

        return { total, totalUsage: totalUsage.toLocaleString(), categories, automationRate }
    }, [templates])

    const filteredTemplates = useMemo(() => {
        return templates.filter(t =>
            t.folder === currentFolder &&
            (t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.category.toLowerCase().includes(search.toLowerCase()))
        )
    }, [templates, search, currentFolder])

    const handleDelete = (id: number) => {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, folder: 'trash' } as Template : t))
        toast({ title: "Moved to Trash", description: "Template blueprint has been archived for deletion." })
    }

    const handlePermanentDelete = (id: number) => {
        setTemplates(prev => prev.filter(t => t.id !== id))
        toast({ title: "Blueprint Purged", description: "Design has been permanently removed from library." })
    }

    const handleSave = () => {
        if (!formData.name) return

        if (editingTemplate) {
            setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...formData } as Template : t))
            toast({ title: "Blueprint Refined", description: "Template logic updated across all instances." })
        } else {
            const newId = templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1
            setTemplates(prev => [{ ...formData, id: newId, folder: 'active' } as Template, ...prev])
            toast({ title: "Design Published", description: "New reusable design committed to production vault." })
        }
        setIsDialogOpen(false)
        setEditingTemplate(null)
        setFormData({ name: '', category: 'Onboarding', type: 'Email', lastUsed: 'Never', usageCount: 0, author: 'System Admin', content: '', folder: 'active' })
    }

    const toggleStar = (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, isStarred: !t.isStarred } : t))
    }

    const toggleSelect = (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedEntries(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const selectAll = () => {
        if (selectedEntries.length === filteredTemplates.length) {
            setSelectedEntries([])
        } else {
            setSelectedEntries(filteredTemplates.map(t => t.id))
        }
    }

    const getFolderIcon = (id: string) => {
        switch (id) {
            case 'active': return <FileText className="h-4 w-4" />
            case 'archives': return <History className="h-4 w-4" />
            case 'drafts': return <PencilLine className="h-4 w-4" />
            case 'trash': return <Trash2 className="h-4 w-4" />
            default: return <FolderHeart className="h-4 w-4" />
        }
    }

    const folders = [
        { id: 'active', label: 'Prime Library', count: templates.filter(t => t.folder === 'active').length },
        { id: 'drafts', label: 'Workshop Drafts', count: templates.filter(t => t.folder === 'drafts').length },
        { id: 'archives', label: 'Legacy Vault' },
        { id: 'trash', label: 'Purge Queue' },
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit text-sm">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-outfit">
                            Communication <span className="text-emerald-600">Templates</span>
                        </h1>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-2 py-0.5 text-[10px] flex items-center gap-1.5 tracking-wider font-outfit">
                            <ShieldCheck className="h-3.5 w-3.5" /> Library Verified
                        </Badge>
                    </div>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Standardize client outreach with high-converting, reusable design frameworks.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 h-11 w-11 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all bg-white" onClick={() => toast({ title: "Library Sync", description: "Refreshing global template blueprints..." })}>
                                    <RefreshCw className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p className="font-outfit text-xs font-bold">Refresh Vault</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) { setEditingTemplate(null); setFormData({ name: '', category: 'Onboarding', type: 'Email', lastUsed: 'Never', usageCount: 0, author: 'System Admin', content: '', folder: 'active' }) }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-emerald-600/20 gap-2 transition-all hover:scale-[1.02]">
                                <Plus className="h-5 w-5" /> Design Blueprint
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[750px] font-outfit rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="px-8 py-6 bg-slate-50/80 border-b border-slate-100">
                                <DialogTitle className="text-xl font-bold flex items-center gap-2 font-outfit">
                                    <Layers className="h-5 w-5 text-emerald-600" />
                                    {editingTemplate ? 'Modify Design Logic' : 'New Design Blueprint'}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="px-8 py-8 grid gap-6 bg-white max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">Blueprint Title</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Executive QBR Invite"
                                            className="h-11 rounded-xl border-slate-200 font-medium font-outfit"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">Lifecycle Taxonomy</Label>
                                        <Select value={formData.category} onValueChange={(v: any) => setFormData({ ...formData, category: v })}>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 font-medium font-outfit"><SelectValue placeholder="Category" /></SelectTrigger>
                                            <SelectContent className="rounded-xl font-outfit">
                                                <SelectItem value="Onboarding" className="font-medium">Onboarding Pipeline</SelectItem>
                                                <SelectItem value="Renewal" className="font-bold text-emerald-600">Renewal Pursuit</SelectItem>
                                                <SelectItem value="Support" className="font-medium">Support Ops</SelectItem>
                                                <SelectItem value="Marketing" className="font-medium text-blue-600">Marketing Growth</SelectItem>
                                                <SelectItem value="Personal" className="font-medium">Personal Touch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">Protocol Type</Label>
                                        <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 font-medium font-outfit"><SelectValue placeholder="Protocol" /></SelectTrigger>
                                            <SelectContent className="rounded-xl font-outfit">
                                                <SelectItem value="Email" className="font-medium">Rich HTML: Email</SelectItem>
                                                <SelectItem value="SMS" className="font-medium">Plain Text: SMS</SelectItem>
                                                <SelectItem value="Notification" className="font-medium">JSON: Push Alert</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-slate-700 ml-1 font-outfit">Lead Designer</Label>
                                        <Input value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="h-11 rounded-xl border-slate-200 font-medium font-outfit" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-2 px-1">
                                        <Label className="font-bold text-slate-700 flex items-center gap-2 font-outfit">Design Workspace <Code className="h-4 w-4 text-emerald-600" /></Label>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[9px] font-bold text-slate-400 font-outfit">Handlebars / Liquid</Badge>
                                        </div>
                                    </div>
                                    <Textarea
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="<h1>Hello {{account.name}}!</h1>"
                                        className="min-h-[150px] font-mono text-xs bg-slate-50 border-slate-200 p-4 rounded-xl focus:ring-emerald-500/10 focus:border-emerald-400"
                                    />
                                </div>
                                <div className="p-5 bg-emerald-50/40 border border-emerald-100 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-emerald-50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[11.5px] font-bold text-emerald-800 font-outfit">Optimize with CopyBrain AI</p>
                                            <p className="text-[10px] font-medium text-emerald-600/70 font-outfit">Analyze sentiment and improve conversion velocity.</p>
                                        </div>
                                    </div>
                                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold px-4 h-9 font-outfit">Execute Generation</Button>
                                </div>
                            </div>
                            <DialogFooter className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 gap-3">
                                <Button variant="ghost" className="rounded-xl font-bold bg-white border border-slate-200 px-6 h-11 font-outfit" onClick={() => setIsDialogOpen(false)}>Stage Draft</Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-11 font-bold shadow-lg shadow-emerald-600/20 font-outfit" onClick={handleSave}>
                                    <Save className="h-4 w-4 mr-2" /> Publish Blueprint
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Total Blueprints" value={metrics.total} subValue="Inventory Assets" icon={FileText} color="emerald" />
                <MetricBox title="Global Dispatches" value={metrics.totalUsage} subValue="Last 90 Cycles" icon={Copy} color="blue" />
                <MetricBox title="Trigger Efficiency" value={metrics.automationRate} subValue="Auto Engagement" icon={Zap} color="indigo" />
                <MetricBox title="Lifecycle Categories" value={metrics.categories} subValue="Functional Nodes" icon={Layout} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm overflow-hidden p-3 h-fit sticky top-8">
                        <div className="space-y-1">
                            {folders.map((folder) => (
                                <button
                                    key={folder.id}
                                    onClick={() => { setCurrentFolder(folder.id as any); setSelectedEntries([]); }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all font-outfit font-bold text-[11.5px] group",
                                        currentFolder === folder.id
                                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                            : "text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn("transition-colors", currentFolder === folder.id ? "text-white" : "text-slate-400 group-hover:text-emerald-500")}>
                                            {getFolderIcon(folder.id)}
                                        </div>
                                        <span className="font-outfit">{folder.label}</span>
                                    </div>
                                    {folder.count ? (
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[9px] font-outfit",
                                            currentFolder === folder.id ? "bg-white text-emerald-600" : "bg-emerald-50 text-emerald-700"
                                        )}>
                                            {folder.count}
                                        </span>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 pt-4 border-t border-slate-50">
                            <p className="px-3 text-[10px] font-bold text-slate-400 tracking-widest mb-4 font-outfit">Priority Tags</p>
                            <div className="space-y-1.5">
                                {[
                                    { color: 'bg-emerald-500', name: 'Converted' },
                                    { color: 'bg-indigo-500', name: 'Strategic' },
                                    { color: 'bg-blue-500', name: 'Automated' },
                                ].map((tag, i) => (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group font-outfit">
                                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm ring-2 ring-white", tag.color)} />
                                        <span className="group-hover:text-emerald-600 transition-colors font-outfit">{tag.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Repository Area */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden font-outfit">
                        {/* Control Bar */}
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={selectAll}
                                    className={cn(
                                        "h-5 w-5 rounded border-2 flex items-center justify-center transition-all",
                                        selectedEntries.length === filteredTemplates.length && filteredTemplates.length > 0
                                            ? "bg-emerald-600 border-emerald-600"
                                            : "border-slate-200 hover:border-emerald-400"
                                    )}
                                >
                                    {selectedEntries.length === filteredTemplates.length && filteredTemplates.length > 0 && <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />}
                                </button>
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit capitalize">{currentFolder === 'active' ? 'Design Inventory' : currentFolder}</h2>
                                {selectedEntries.length > 0 && (
                                    <div className="h-4 w-px bg-slate-200 mx-1" />
                                )}
                                <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold font-outfit">
                                    {selectedEntries.length > 0 ? `${selectedEntries.length} selected` : `${filteredTemplates.length} assets`}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search blueprints..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none h-10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="rounded-xl text-slate-400 border-slate-200 h-10 w-10 hover:bg-slate-50"><Filter className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        {/* Bulk Actions Bar */}
                        {selectedEntries.length > 0 && (
                            <div className="px-6 py-3 bg-emerald-50/30 border-b border-emerald-100 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-emerald-700 hover:bg-white gap-2 font-outfit" onClick={() => toast({ title: "Bulk Duplicated", description: `${selectedEntries.length} designs cloned to drafts.` })}>
                                        <Copy className="h-3.5 w-3.5" /> Clone Selection
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-emerald-700 hover:bg-white gap-2 font-outfit" onClick={() => toast({ title: "Internal Shared", description: "Blueprints published to team workspace." })}>
                                        <Share2 className="h-3.5 w-3.5" /> Team Share
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-rose-700 hover:bg-white gap-2 font-outfit" onClick={() => {
                                        setTemplates(prev => prev.map(t => selectedEntries.includes(t.id) ? { ...t, folder: 'trash' } as Template : t));
                                        setSelectedEntries([]);
                                        toast({ title: "Moved to Purge", description: `${selectedEntries.length} designs staged for deletion.` });
                                    }}>
                                        <Trash2 className="h-3.5 w-3.5" /> Purge Records
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-slate-600" onClick={() => setSelectedEntries([])}><X className="h-4 w-4" /></Button>
                            </div>
                        )}

                        <div className="divide-y divide-slate-50">
                            {filteredTemplates.length > 0 ? filteredTemplates.map((t) => (
                                <div
                                    key={t.id}
                                    className={cn(
                                        "group relative p-6 hover:bg-slate-50/80 transition-all cursor-pointer border-l-4 border-transparent",
                                        t.isStarred && "bg-amber-50/10 border-l-amber-400",
                                        selectedEntries.includes(t.id) && "bg-emerald-50/40 border-l-emerald-600"
                                    )}
                                    onClick={() => { setActiveTemplate(t); setViewDialogOpen(true); }}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="flex flex-col items-center gap-3">
                                            <button
                                                onClick={(e) => toggleSelect(t.id, e)}
                                                className={cn(
                                                    "h-5 w-5 rounded border-2 flex items-center justify-center transition-all mt-1",
                                                    selectedEntries.includes(t.id) ? "bg-emerald-600 border-emerald-600" : "border-slate-200 group-hover:border-emerald-300"
                                                )}
                                            >
                                                {selectedEntries.includes(t.id) && <Check className="h-3.5 w-3.5 text-white stroke-[3px]" />}
                                            </button>
                                            <button onClick={(e) => toggleStar(t.id, e)} className="transition-transform active:scale-125">
                                                <Star Icon={StarIcon} className={cn("h-4.5 w-4.5 transition-colors shadow-none", t.isStarred ? "text-amber-400 fill-amber-400" : "text-slate-200 hover:text-amber-200")} />
                                            </button>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 ring-4 ring-slate-50/50">
                                                        <FileText className="h-4.5 w-4.5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[13.5px] font-bold text-slate-900 font-outfit">{t.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className={cn(
                                                                "px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest border shadow-sm font-outfit",
                                                                t.category === 'Renewal' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                    t.category === 'Onboarding' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                                                            )}>
                                                                {t.category}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-400 font-outfit ml-1 flex items-center gap-1.5">
                                                                {t.type === 'Email' ? <FileText className="h-3 w-3" /> : t.type === 'SMS' ? <Zap className="h-3 w-3 text-amber-500" /> : <Clock className="h-3 w-3" />}
                                                                {t.type} Protocol
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-slate-400 font-outfit tracking-widest">{t.lastUsed}</span>
                                                    <p className="text-[11px] font-bold text-slate-900 mt-1 font-outfit">{t.usageCount.toLocaleString()} Dispatches</p>
                                                </div>
                                            </div>
                                            <p className="text-[12px] font-medium text-slate-500 font-outfit line-clamp-1 pr-20 opacity-80 mt-2 bg-slate-50/50 p-2 rounded-lg border border-slate-50 border-dashed italic">
                                                "{t.content.substring(0, 100)}..."
                                            </p>
                                        </div>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-white border bg-white/50 shadow-sm" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingTemplate(t)
                                                            setFormData(t)
                                                            setIsDialogOpen(true)
                                                        }}>
                                                            <PencilLine className="h-4.5 w-4.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p className="font-outfit text-xs font-bold">Edit Design</p></TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white border bg-white/50 shadow-sm" onClick={(e) => e.stopPropagation()}>
                                                    <MoreVertical className="h-4.5 w-4.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 font-outfit rounded-2xl p-2 shadow-2xl border-slate-100">
                                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-emerald-50 focus:text-emerald-600 rounded-xl" onClick={(e) => { e.stopPropagation(); toast({ title: "Blueprint Cloned", description: "Draft added to your workshop." }) }}>
                                                    <Copy className="h-4 w-4" /> Duplicate Blueprint
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-emerald-50 focus:text-emerald-600 rounded-xl">
                                                    <Share2 className="h-4 w-4" /> Share with Team
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-emerald-50 focus:text-emerald-600 rounded-xl">
                                                    <FileJson className="h-4 w-4" /> Export as JSON
                                                </DropdownMenuItem>
                                                <div className="h-px bg-slate-50 my-2" />
                                                <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 text-rose-500 cursor-pointer font-bold text-[11px] focus:bg-rose-50 rounded-xl" onClick={(e) => { e.stopPropagation(); currentFolder === 'trash' ? handlePermanentDelete(t.id) : handleDelete(t.id); }}>
                                                    <Trash2 className="h-4 w-4" /> {currentFolder === 'trash' ? 'Purge Assets' : 'Burn Blueprint'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                </div>
                        )) : (
                        <div className="px-6 py-24 text-center">
                            <div className="h-24 w-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100/50 shadow-inner">
                                <Code className="h-10 w-10 text-slate-200" />
                            </div>
                            <h3 className="text-base font-bold text-slate-400 font-outfit mb-2">Clean Workspace</h3>
                            <p className="text-[12px] font-medium text-slate-300 font-outfit max-w-[200px] mx-auto">No design blueprints found for the current {currentFolder} segment.</p>
                        </div>
                            )}
                    </div>
                </div>
            </div>

            {/* Right Analytics Pane */}
            <div className="lg:col-span-3 space-y-6">
                <Card className="rounded-3xl border-slate-200 bg-white p-7 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-50/50 rounded-bl-full -z-0 group-hover:scale-150 transition-all duration-700" />
                    <h3 className="text-[10px] font-bold text-slate-400 tracking-widest font-outfit mb-8 relative z-10">High ROI Tags</h3>
                    <div className="flex flex-wrap gap-2.5 relative z-10">
                        {[
                            { text: 'Strategic QBR', usage: 1.2, color: 'emerald' },
                            { text: 'Personalized', usage: 2.4, color: 'blue' },
                            { text: 'SLA Dashboard', usage: 0.8, color: 'indigo' },
                            { text: 'AI Forecast', usage: 3.1, color: 'amber' },
                            { text: 'Video Demo', usage: 0.5, color: 'rose' },
                        ].map((tag, i) => (
                            <div key={i} className={cn(
                                "px-3.5 py-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 bg-white",
                                tag.color === 'emerald' ? "border-emerald-100 shadow-emerald-100/20 shadow-lg" : "border-slate-100 shadow-sm"
                            )}>
                                <Tag className={cn("h-3.5 w-3.5", tag.color === 'emerald' ? "text-emerald-500" : "text-slate-400")} />
                                <span className="text-[10.5px] font-bold text-slate-600 font-outfit whitespace-nowrap">{tag.text}</span>
                            </div>
                        ))}
                    </div>
                    <Button className="w-full mt-10 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-bold tracking-widest transition-all shadow-xl shadow-slate-200 font-outfit">
                        Tag Intelligence Hub
                    </Button>
                </Card>

                <Card className="rounded-3xl border-indigo-100 bg-indigo-50/10 p-7 shadow-sm group">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-[10px] font-bold text-slate-400 tracking-widest font-outfit">Optimization AI</h3>
                        <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                    </div>
                    <div className="space-y-5">
                        <div className="p-5 bg-white border border-indigo-100 rounded-2xl shadow-sm group-hover:shadow-xl transition-all h-fit">
                            <p className="text-[10px] font-bold text-rose-500 tracking-widest mb-2 font-outfit">Performance Alert</p>
                            <p className="text-[13px] font-bold text-slate-800 font-outfit leading-tight mb-2 font-outfit">Renewal Open-Rate Drop</p>
                            <p className="text-[11.5px] font-medium text-slate-500 font-outfit leading-relaxed">
                                Strategic QBR template showing fatigue. AI recommends <span className="text-indigo-600 font-bold italic">Dynamic Goal Injection</span> for 40% uptick.
                            </p>
                        </div>
                        <Button className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[11px] font-bold shadow-xl shadow-indigo-600/20 transition-all font-outfit">
                            Execute Auto-Rotation
                        </Button>
                    </div>
                </Card>

                <Card className="rounded-3xl border-slate-200 bg-white p-7 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between mb-8 text-slate-400">
                        <h3 className="text-[10px] font-bold tracking-widest font-outfit">Design Lineage</h3>
                        <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div className="space-y-5">
                        {[
                            { v: 'V2.6', date: 'Oct 14', author: 'Sarah J.', desc: 'High-Touch CTA Logic' },
                            { v: 'V2.4', date: 'Oct 12', author: 'Admin', desc: 'SLA Dashboard Bridge' },
                            { v: 'V2.3', date: 'Sep 28', author: 'Mike W.', desc: 'Responsive CSS Grid' },
                        ].map((v, i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer p-1 rounded-xl">
                                <div className="h-11 w-11 flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 group-hover:border-emerald-300 group-hover:bg-emerald-50 transition-all shadow-sm">
                                    <span className="text-[10.5px] font-black text-slate-800 font-outfit">{v.v}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] font-bold text-slate-700 font-outfit truncate group-hover:text-emerald-700 transition-colors tracking-tight">{v.desc}</p>
                                    <p className="text-[10px] font-medium text-slate-400 font-outfit mt-0.5">{v.author} • {v.date}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>

            {/* Comprehensive Blueprint Design Studio Modal */ }
    <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[850px] font-outfit rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
            {activeTemplate && (
                <div className="flex flex-col h-full max-h-[85vh]">
                    <div className="p-8 border-b border-slate-100 bg-slate-50/80">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-xl flex items-center justify-center text-white ring-4 ring-emerald-50">
                                    <FileText className="h-7 w-7" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">{activeTemplate.name}</h2>
                                    <p className="text-[12px] font-medium text-slate-400 flex items-center gap-2">
                                        <History className="h-3.5 w-3.5" /> Blueprint V2.6 • Authored by {activeTemplate.author}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Button variant="outline" className="rounded-xl h-11 px-6 text-[12px] font-bold gap-2 bg-white border-slate-200 shadow-sm hover:border-emerald-300 hover:text-emerald-600 font-outfit" onClick={() => { setEditingTemplate(activeTemplate); setFormData(activeTemplate); setIsDialogOpen(true); setViewDialogOpen(false); }}>
                                    <PencilLine className="h-4 w-4" /> Modify Design
                                </Button>
                                <Button variant="outline" className="rounded-xl h-11 px-6 text-[12px] font-bold gap-2 bg-white border-slate-200 shadow-sm font-outfit" onClick={() => toast({ title: "Blueprint Cloned", description: "Design duplicated to drafts." })}>
                                    <Copy className="h-4 w-4 text-slate-400" /> Duplicate
                                </Button>
                                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 font-outfit" onClick={() => { handleDelete(activeTemplate.id); setViewDialogOpen(false); }}>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className={cn("text-[10px] font-bold py-1 px-3 tracking-widest border-none text-white font-outfit",
                                activeTemplate.category === 'Renewal' ? 'bg-emerald-500' :
                                    activeTemplate.category === 'Marketing' ? 'bg-blue-500' : 'bg-indigo-500'
                            )}>{activeTemplate.category} Segment</Badge>
                            <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-slate-200 py-1 px-3 tracking-widest font-outfit">{activeTemplate.usageCount.toLocaleString()} Successful Dispatches</Badge>
                            <div className="h-4 w-px bg-slate-200 mx-1" />
                            <div className="flex items-center gap-1.5 text-emerald-600">
                                <ShieldCheck className="h-4 w-4 shadow-sm" />
                                <span className="text-[10px] font-bold tracking-widest font-outfit">Brand Compliance Verified</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-10 bg-white flex-1 overflow-y-auto">
                        <div className="space-y-10">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-[11px] font-bold text-slate-400 tracking-widest font-outfit">Blueprint Architecture (HTML/Liquid)</h4>
                                    <Badge variant="secondary" className="bg-slate-50 text-slate-500 text-[10px] font-mono px-2 py-0 font-outfit">Read-Only View</Badge>
                                </div>
                                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 font-mono text-emerald-400 text-[13px] leading-relaxed shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Code className="h-20 w-20" /></div>
                                    <pre className="whitespace-pre-wrap">{activeTemplate.content}</pre>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-bold text-slate-400 tracking-widest font-outfit">Performance Analytics</h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Avg. Open Velocity', value: '42s' },
                                            { label: 'Conversion Lift', value: '+18.4%' },
                                            { label: 'Mobile Optimization', value: '98/100' },
                                        ].map((stat, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-50">
                                                <span className="text-slate-500 font-bold text-[11px] font-outfit">{stat.label}</span>
                                                <span className="font-black text-slate-900 text-[12px] font-outfit">{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-bold text-slate-400 tracking-widest font-outfit">Active Variables</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['{{account.name}}', '{{contract.value}}', '{{qbr.date}}', '{{sla.uptime}}'].map((v, i) => (
                                            <Badge key={i} variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-mono text-[10px] py-1 px-2.5 rounded-lg">{v}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center px-10">
                        <p className="text-[11px] font-medium text-slate-400 italic font-outfit">SHA-256 Digest: B-772-X-TMPL-99</p>
                        <div className="flex gap-3">
                            <Button variant="ghost" className="rounded-xl font-bold text-xs px-6 h-11 font-outfit" onClick={() => setViewDialogOpen(false)}>Exit Studio</Button>
                            <Button className="bg-slate-900 hover:bg-emerald-600 text-white rounded-xl px-10 h-10 font-bold transition-all shadow-xl shadow-slate-200 font-outfit">
                                Execute Campaign Sync
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
    </Dialog>
        </div >
    )
}

const Star = ({ className, Icon }: { className?: string; Icon: any }) => (
    <Icon className={className} />
);
