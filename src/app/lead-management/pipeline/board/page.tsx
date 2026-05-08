"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd"
import {
    Search,
    Plus,
    MoreHorizontal,
    Filter,
    LayoutGrid,
    List,
    Settings2,
    Zap,
    Clock,
    MoreVertical,
    ChevronLeft,
    HandMetal,
    Pencil,
    Trash2,
    UserCog,
    X
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/shared/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/shared/components/ui/alert-dialog"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { usePipelineData, PipelineLead } from "@/shared/hooks/use-pipeline-data"

import { PipelineOpportunitySheet, OpportunityFormData } from "@/shared/components/lead-management/modals/PipelineOpportunitySheet"
import { PipelineOwnerSheet } from "@/shared/components/lead-management/modals/PipelineOwnerSheet"

const COL_IDS = ["new", "contacted", "engaged", "qualified", "proposal", "negotiation", "pending", "won", "lost"]
const COL_TITLES: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    engaged: "Engaged",
    qualified: "Qualified",
    proposal: "Proposal Shared",
    negotiation: "Negotiation",
    pending: "Decision Pending",
    won: "Won",
    lost: "Lost"
}

interface QuickFilters {
    priority: "all" | "low" | "medium" | "high"
    owner: string
    minScore: string
    minValue: string
}

const DEFAULT_FILTERS: QuickFilters = {
    priority: "all",
    owner: "all",
    minScore: "",
    minValue: ""
}

export default function PipelineBoardPage() {
    const { leads, isLoaded, addLead, moveLead, updateLead, deleteLead } = usePipelineData()
    const [searchTerm, setSearchTerm] = useState("")
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    // Modal & Sheet States
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
    const [isOwnerSheetOpen, setIsOwnerSheetOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<PipelineLead | null>(null)

    // Quick Filters
    const [filters, setFilters] = useState<QuickFilters>(DEFAULT_FILTERS)
    const [filterDraft, setFilterDraft] = useState<QuickFilters>(DEFAULT_FILTERS)
    const [filterOpen, setFilterOpen] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            setIsRefreshing(false)
            toast({ title: "Engine Refreshed", description: "Pipeline data is now up to date." })
        }, 1200)
    }

    const ownerOptions = useMemo(() => {
        const set = new Set<string>()
        leads.forEach((l) => set.add(l.owner))
        return Array.from(set)
    }, [leads])

    const activeFilterCount = useMemo(() => {
        let c = 0
        if (filters.priority !== "all") c++
        if (filters.owner !== "all") c++
        if (filters.minScore) c++
        if (filters.minValue) c++
        return c
    }, [filters])

    const matchesFilters = (l: PipelineLead) => {
        if (filters.priority !== "all" && l.priority !== filters.priority) return false
        if (filters.owner !== "all" && l.owner !== filters.owner) return false
        if (filters.minScore) {
            const s = parseInt(filters.minScore) || 0
            if (l.score < s) return false
        }
        if (filters.minValue) {
            const v = parseInt(filters.minValue) || 0
            const cardVal = parseInt((l.value || "").replace(/[^0-9]/g, "")) || 0
            if (cardVal < v) return false
        }
        return true
    }

    const getColumns = () => {
        return COL_IDS.map(id => ({
            id,
            title: COL_TITLES[id],
            cards: leads.filter(l => l.stage === id && matchesFilters(l) && (
                l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.owner.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        }))
    }

    const columns = getColumns()
    const visibleLeads = columns.flatMap(c => c.cards)
    const totalValue = useMemo(() => {
        return visibleLeads.reduce((acc, c) => acc + (parseInt((c.value || "").replace(/[^0-9]/g, "")) || 0), 0)
    }, [visibleLeads])

    const onDragEnd = (result: DropResult) => {
        const { draggableId, destination } = result
        if (!destination) return

        moveLead(draggableId, destination.droppableId)

        const destTitle = COL_TITLES[destination.droppableId]
        toast({
            title: "Stage Updated",
            description: `Moved to ${destTitle}`,
            duration: 2000,
        })
    }

    const calculateColValue = (cards: PipelineLead[]) => {
        const total = cards.reduce((acc, card) => {
            const val = parseInt(card.value.replace(/[^0-9]/g, '')) || 0
            return acc + val
        }, 0)
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total)
    }

    const handleAddOpportunity = (data: OpportunityFormData) => {
        addLead({
            name: data.name,
            company: data.company,
            value: data.value,
            score: Math.floor(Math.random() * 30) + 60,
            owner: data.ownerName,
            lastActivity: "Just now",
            stageTime: "0d",
            tags: data.tags || [],
            priority: data.priority,
            email: data.email,
            source: data.source,
            stage: data.stage,
        })
        setIsAddSheetOpen(false)
        toast({ title: "Opportunity Added", description: `${data.name} has been added to the pipeline.` })
    }

    const handleEditOpportunity = (data: OpportunityFormData) => {
        if (!selectedCard) return
        updateLead(selectedCard.id, {
            name: data.name,
            company: data.company,
            value: data.value,
            owner: data.ownerName,
            tags: data.tags || [],
            priority: data.priority,
            email: data.email,
            source: data.source,
            stage: data.stage,
        })
        setIsEditSheetOpen(false)
        setSelectedCard(null)
        toast({ title: "Opportunity Updated", description: `${data.name} has been updated.` })
    }

    const handleConfirmDelete = () => {
        if (!selectedCard) return
        const name = selectedCard.name
        deleteLead(selectedCard.id)
        setIsDeleteOpen(false)
        setSelectedCard(null)
        toast({ title: "Opportunity Deleted", description: `${name} removed from pipeline.`, variant: "destructive" })
    }

    const handleMarkLost = (cardId: string) => {
        moveLead(cardId, 'lost')
        toast({
            title: "Lead Disqualified",
            description: `Lead moved to lost leads.`,
            variant: "destructive"
        })
    }

    const handleReassign = (newOwner: string) => {
        if (!selectedCard) return
        updateLead(selectedCard.id, { owner: newOwner })
        setIsOwnerSheetOpen(false)
        setSelectedCard(null)
        toast({ title: "Owner Updated", description: `Reassigned to ${newOwner}` })
    }

    const handleApplyFilters = () => {
        setFilters(filterDraft)
        setFilterOpen(false)
        toast({ title: "Filters Applied", description: "Pipeline is now filtered by your selection." })
    }

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTERS)
        setFilterDraft(DEFAULT_FILTERS)
        setFilterOpen(false)
    }

    const handleExportCSV = () => {
        const headers = ["ID", "Name", "Company", "Value", "Score", "Owner", "Stage", "Last Activity", "Tags"]
        const rows: string[][] = []

        columns.forEach(col => {
            col.cards.forEach(card => {
                rows.push([
                    card.id,
                    card.name,
                    card.company,
                    card.value,
                    card.score.toString(),
                    card.owner,
                    col.title,
                    card.lastActivity,
                    card.tags.join("; ")
                ])
            })
        })

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `Pipeline_Export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({ title: "Export Successful", description: "Pipeline data exported to CSV." })
    }

    if (!isClient) return null

    const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue)

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] space-y-6 animate-in fade-in duration-500 p-1" style={{ zoom: 0.9 }}>

            {/* Header / Roadmap Navigator (light indigo background) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-indigo-50 p-4 rounded-none border border-indigo-100 shadow-sm shrink-0">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-2 h-7 text-slate-500 hover:text-indigo-600 font-medium text-[10px]"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="h-3 w-3 mr-1" /> Portfolio
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-none bg-white text-indigo-600 shadow-inner border border-indigo-100">
                            <HandMetal className="h-4 w-4" />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-semibold tracking-tight text-slate-900 leading-none">Pipeline Board</h1>
                            <p className="text-[11px] text-slate-600 font-medium mt-0.5">Interactive lifecycle stage management engine.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-white p-1 rounded-none flex mr-2 border border-slate-200">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('grid')}
                            className={`h-8 w-8 p-0 rounded-none ${view === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <LayoutGrid size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('list')}
                            className={`h-8 w-8 p-0 rounded-none ${view === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <List size={16} />
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/lead-management/settings/pipeline')}
                        className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-medium text-[12px] rounded-none"
                    >
                        <Settings2 className="h-4 w-4 mr-2 text-slate-400" /> Board Setup
                    </Button>
                    <Button
                        onClick={() => setIsAddSheetOpen(true)}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 shadow-indigo-100 shadow-lg border-none rounded-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Opportunity
                    </Button>
                </div>
            </div>

            {/* Sub-Header / Control Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-emerald-50 p-2 rounded-none border border-emerald-100 shrink-0">
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-[350px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find by name, owner or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 border-slate-200 bg-white text-[13px] rounded-none shadow-none focus-visible:ring-indigo-500"
                        />
                    </div>

                    <Popover open={filterOpen} onOpenChange={(o) => {
                        setFilterOpen(o)
                        if (o) setFilterDraft(filters)
                    }}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 px-4 border-slate-200 bg-white text-slate-600 font-medium rounded-none shadow-sm relative"
                            >
                                <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" /> Quick Filters
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-2 bg-indigo-600 text-white border-none h-5 px-1.5 text-[10px] rounded-none">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4 rounded-none border-slate-200 shadow-xl">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[13px] font-semibold text-slate-900">Quick Filters</h4>
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="text-[11px] font-medium text-indigo-600 hover:underline"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-slate-500">Priority</label>
                                        <Select
                                            value={filterDraft.priority}
                                            onValueChange={(v) => setFilterDraft({ ...filterDraft, priority: v as any })}
                                        >
                                            <SelectTrigger className="h-9 rounded-none border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Priorities</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold uppercase text-slate-500">Owner</label>
                                        <Select
                                            value={filterDraft.owner}
                                            onValueChange={(v) => setFilterDraft({ ...filterDraft, owner: v })}
                                        >
                                            <SelectTrigger className="h-9 rounded-none border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Owners</SelectItem>
                                                {ownerOptions.map((o) => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold uppercase text-slate-500">Min Score</label>
                                            <Input
                                                name="minScore"
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={filterDraft.minScore}
                                                onChange={(e) => setFilterDraft({ ...filterDraft, minScore: e.target.value })}
                                                placeholder="0-100"
                                                className="h-9 rounded-none border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold uppercase text-slate-500">Min Value $</label>
                                            <Input
                                                name="minValue"
                                                type="number"
                                                min="0"
                                                value={filterDraft.minValue}
                                                onChange={(e) => setFilterDraft({ ...filterDraft, minValue: e.target.value })}
                                                placeholder="0"
                                                className="h-9 rounded-none border-slate-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleApplyFilters}
                                    className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 rounded-none border-none text-[12px] font-semibold"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-4 px-4 py-2 bg-white rounded-none border border-slate-200 shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium">Total value</span>
                            <span className="text-[14px] font-semibold text-slate-900 tracking-tight tabular-nums">{formattedTotal}</span>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium">Velocity</span>
                            <span className="text-[14px] font-semibold text-emerald-600 tracking-tight tabular-nums">+12%</span>
                        </div>
                    </div>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 bg-white rounded-none shadow-sm">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 rounded-none shadow-xl border-slate-200">
                            <DropdownMenuItem onClick={() => router.push('/lead-management/activities')} className="text-[12px] font-medium py-2 cursor-pointer rounded-none">Stage History</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportCSV} className="text-[12px] font-medium py-2 cursor-pointer rounded-none">Export Board</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                disabled={isRefreshing}
                                onClick={handleRefresh}
                                className="text-[12px] font-bold py-2 text-indigo-600 disabled:opacity-50 cursor-pointer rounded-none"
                            >
                                {isRefreshing ? "Refreshing..." : "Refresh Engine"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={`flex-1 overflow-x-auto overflow-y-auto pb-4 custom-scrollbar flex gap-5 min-h-0 ${view === 'list' ? 'flex-col' : ''}`}>
                    {columns.map((column) => (
                        <div key={column.id} className="flex flex-col w-[320px] shrink-0 min-h-full">
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-3 px-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[13px] font-semibold text-slate-700">{column.title}</h3>
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-medium text-[10px] px-1.5 h-5 rounded-none border-none">
                                        {column.cards.length}
                                    </Badge>
                                </div>
                                <span className="text-[11px] font-medium text-slate-400">{calculateColValue(column.cards)}</span>
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => {
                                    const colColors: Record<string, string> = {
                                        new: "bg-slate-50 border-slate-200",
                                        contacted: "bg-blue-50 border-blue-200",
                                        engaged: "bg-indigo-50 border-indigo-200",
                                        qualified: "bg-emerald-50 border-emerald-200",
                                        proposal: "bg-amber-50 border-amber-200",
                                        negotiation: "bg-orange-50 border-orange-200",
                                        pending: "bg-rose-50 border-rose-200",
                                        won: "bg-emerald-50 border-emerald-200",
                                        lost: "bg-rose-50 border-rose-200"
                                    }
                                    const stageStyles = colColors[column.id] || "bg-slate-50/30 border-slate-100"

                                    return (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 flex flex-col gap-3 p-3 rounded-none border-2 border-dashed transition-all duration-200 min-h-[650px] ${snapshot.isDraggingOver
                                                ? "bg-indigo-100 border-indigo-300 scale-[1.01]"
                                                : stageStyles
                                                }`}
                                        >
                                            {column.cards.map((card: PipelineLead, index: number) => (
                                                <Draggable key={card.id} draggableId={card.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{ ...provided.draggableProps.style }}
                                                            className={`group ${snapshot.isDragging ? "z-50" : ""}`}
                                                        >
                                                            <Card className={`border-none shadow-sm hover:shadow-md transition-all duration-200 rounded-none overflow-hidden cursor-grab active:cursor-grabbing ${snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-500 rotate-2" : "ring-1 ring-slate-100"
                                                                }`}>
                                                                <CardContent className="p-4 bg-white space-y-3">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <h4 className="text-[14px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[180px]">
                                                                                    {card.name}
                                                                                </h4>
                                                                                {card.score > 85 && (
                                                                                    <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                                                )}
                                                                            </div>
                                                                            <p className="text-[11px] font-medium text-slate-500 truncate">{card.company}</p>
                                                                        </div>
                                                                        <DropdownMenu modal={false}>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none hover:bg-slate-100 -mr-1">
                                                                                    <MoreVertical size={14} className="text-slate-400" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-44 rounded-none p-1 shadow-xl border-slate-200">
                                                                                <DropdownMenuItem
                                                                                    onClick={() => {
                                                                                        setSelectedCard(card)
                                                                                        setIsEditSheetOpen(true)
                                                                                    }}
                                                                                    className="text-[11px] font-medium py-2 cursor-pointer rounded-none"
                                                                                >
                                                                                    <Pencil className="h-3 w-3 mr-2" /> Edit Opportunity
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    onClick={() => {
                                                                                        setSelectedCard(card)
                                                                                        setIsOwnerSheetOpen(true)
                                                                                    }}
                                                                                    className="text-[11px] font-medium py-2 cursor-pointer rounded-none"
                                                                                >
                                                                                    <UserCog className="h-3 w-3 mr-2" /> Reassign Owner
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    onClick={() => toast({ title: "Activity Logger", description: `Initializing interaction log for ${card.company}.` })}
                                                                                    className="text-[11px] font-medium py-2 cursor-pointer rounded-none"
                                                                                >
                                                                                    Log Interaction
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuSeparator />
                                                                                {column.id !== 'lost' && (
                                                                                    <DropdownMenuItem
                                                                                        onClick={() => handleMarkLost(card.id)}
                                                                                        className="text-[11px] font-semibold py-2 text-rose-500 focus:text-rose-600 focus:bg-rose-50 cursor-pointer rounded-none"
                                                                                    >
                                                                                        <X className="h-3 w-3 mr-2" /> Mark as Lost
                                                                                    </DropdownMenuItem>
                                                                                )}
                                                                                <DropdownMenuItem
                                                                                    onClick={() => {
                                                                                        setSelectedCard(card)
                                                                                        setIsDeleteOpen(true)
                                                                                    }}
                                                                                    className="text-[11px] font-semibold py-2 text-rose-500 focus:text-rose-600 focus:bg-rose-50 cursor-pointer rounded-none"
                                                                                >
                                                                                    <Trash2 className="h-3 w-3 mr-2" /> Delete
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>

                                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                                        {card.tags.map(tag => (
                                                                            <Badge key={tag} className="bg-indigo-50 text-indigo-600 border-none text-[9px] font-medium px-1.5 h-4.5 rounded-none">
                                                                                {tag}
                                                                            </Badge>
                                                                        ))}
                                                                        {card.priority === 'high' && (
                                                                            <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-medium px-1.5 h-4.5 rounded-none">
                                                                                Priority
                                                                            </Badge>
                                                                        )}
                                                                    </div>

                                                                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[13px] font-semibold text-slate-900">{card.value}</span>
                                                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                                                <Clock className="h-3 w-3" />
                                                                                <span className="text-[10px] font-medium"> {card.stageTime} in stage</span>
                                                                            </div>
                                                                        </div>
                                                                        <Avatar className="h-7 w-7 border-2 border-white shadow-sm rounded-none">
                                                                            <AvatarFallback className="bg-slate-100 text-[10px] font-medium text-slate-500 rounded-none">
                                                                                {card.owner.split(' ').map(n => n[0]).join('')}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    );
                                }}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {/* Add Sheet */}
            <PipelineOpportunitySheet
                isOpen={isAddSheetOpen}
                onClose={() => setIsAddSheetOpen(false)}
                onSubmit={handleAddOpportunity}
                title="Create New Opportunity"
                stages={columns.map(c => ({ id: c.id, title: c.title }))}
            />

            {/* Edit Sheet */}
            <PipelineOpportunitySheet
                isOpen={isEditSheetOpen}
                onClose={() => {
                    setIsEditSheetOpen(false)
                    setSelectedCard(null)
                }}
                onSubmit={handleEditOpportunity}
                initialData={selectedCard}
                title="Edit Opportunity"
                stages={columns.map(c => ({ id: c.id, title: c.title }))}
            />

            {/* Owner Sheet */}
            <PipelineOwnerSheet
                isOpen={isOwnerSheetOpen}
                onClose={() => {
                    setIsOwnerSheetOpen(false)
                    setSelectedCard(null)
                }}
                onConfirm={handleReassign}
                selectedCount={1}
                currentOwner={selectedCard?.owner}
            />

            {/* Delete Confirm */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="rounded-none border-slate-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this opportunity?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedCard ? `"${selectedCard.name}" will be permanently removed from the pipeline.` : "This action cannot be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-rose-600 hover:bg-rose-700 rounded-none"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 0;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    )
}
