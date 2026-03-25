"use client"

import React, { useState, useEffect } from "react"
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
    ArrowUpDown,
    Calendar,
    Settings2,
    Users,
    Zap,
    Clock,
    DollarSign,
    MoreVertical,
    ChevronLeft,
    HandMetal
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { usePipelineData, PipelineLead } from "@/shared/hooks/use-pipeline-data"

import { LeadFormModal } from "@/shared/components/lead-management/modals/LeadFormModal"
import { MoveOwnerModal } from "@/shared/components/lead-management/modals/MoveOwnerModal"

// --- Types ---
interface PipelineCard {
    id: string
    name: string
    company: string
    value: string
    score: number
    owner: string
    ownerAvatar?: string
    lastActivity: string
    stageTime: string
    tags: string[]
    priority: 'low' | 'medium' | 'high'
    email?: string // Added for compatibility with LeadFormModal
    source?: string
    stage?: string
}

interface Column {
    id: string
    title: string
    cards: PipelineCard[]
}

// --- Mock Data ---
const INITIAL_COLUMNS: Column[] = [
    {
        id: "new",
        title: "New",
        cards: [
            { id: "1", name: "Aarav Mehta", company: "TechFlow Systems", value: "$12,400", score: 88, owner: "Rajesh K.", lastActivity: "12m ago", stageTime: "1d", tags: ["Enterprise"], priority: 'high' },
        ]
    },
    {
        id: "contacted",
        title: "Contacted",
        cards: [
            { id: "7", name: "Olivia Taylor", company: "Taylor Retail", value: "$8,500", score: 78, owner: "Anita S.", lastActivity: "15m ago", stageTime: "1d", tags: ["Retail"], priority: 'medium' },
        ]
    },
    {
        id: "engaged",
        title: "Engaged",
        cards: [
            { id: "5", name: "Emma Wilson", company: "Creative Solutions", value: "$15,200", score: 67, owner: "Rajesh K.", lastActivity: "3h ago", stageTime: "4d", tags: ["Design"], priority: 'medium' },
        ]
    },
    {
        id: "qualified",
        title: "Qualified",
        cards: [
            { id: "8", name: "James Anderson", company: "Anderson Finance", value: "$32,000", score: 55, owner: "Rajesh K.", lastActivity: "1d ago", stageTime: "5d", tags: ["Finance"], priority: 'low' },
        ]
    },
    {
        id: "proposal",
        title: "Proposal Shared",
        cards: [
            { id: "12", name: "Mia Garcia", company: "HealthCare Plus", value: "$55,000", score: 89, owner: "Rajesh K.", lastActivity: "1h ago", stageTime: "3d", tags: ["Healthcare"], priority: 'high' },
        ]
    },
    {
        id: "negotiation",
        title: "Negotiation",
        cards: [
            { id: "14", name: "Ava Robinson", company: "Robinson Realty", value: "$95,000", score: 74, owner: "Anita S.", lastActivity: "2h ago", stageTime: "8d", tags: ["Real Estate"], priority: 'medium' },
        ]
    },
    {
        id: "pending",
        title: "Decision Pending",
        cards: [
            { id: "18", name: "Charlotte Walker", company: "Media Net", value: "$42,000", score: 85, owner: "Anita S.", lastActivity: "30m ago", stageTime: "12d", tags: ["Media"], priority: 'high' },
        ]
    },
    {
        id: "won",
        title: "Won",
        cards: [
            { id: "15", name: "Ethan Clark", company: "Tech IO", value: "$150,000", score: 95, owner: "Rajesh K.", lastActivity: "1d ago", stageTime: "20d", tags: ["SaaS"], priority: 'high' },
        ]
    },
    {
        id: "lost",
        title: "Lost",
        cards: [
            { id: "4", name: "Michael Chen", company: "Startups.io", value: "$5,000", score: 34, owner: "Anita S.", lastActivity: "1w ago", stageTime: "15d", tags: ["SME"], priority: 'low' },
        ]
    }
]

export default function PipelineBoardPage() {
    const { leads, isLoaded, addLead, moveLead, updateLead } = usePipelineData()
    const [searchTerm, setSearchTerm] = useState("")
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

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

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<PipelineLead | null>(null)

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

    const getColumns = () => {
        return COL_IDS.map(id => ({
            id,
            title: COL_TITLES[id],
            cards: leads.filter(l => l.stage === id && (
                l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.owner.toLowerCase().includes(searchTerm.toLowerCase())
            ))
        }))
    }

    const columns = getColumns()

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
        const totalValue = cards.reduce((acc, card) => {
            const val = parseInt(card.value.replace(/[^0-9]/g, '')) || 0
            return acc + val
        }, 0)
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalValue)
    }

    const handleAddOpportunity = (data: any) => {
        addLead({
            name: data.name,
            company: data.company || "Unknown Company",
            value: data.value || "$0",
            score: Math.floor(Math.random() * 100),
            owner: data.ownerName || "Unassigned",
            lastActivity: "Just now",
            stageTime: "0d",
            tags: data.tags || [],
            priority: data.priority || 'medium',
            email: data.email || "",
            source: data.source || "Direct",
            stage: data.stage || "new"
        })
        setIsAddModalOpen(false)
        toast({ title: "Opportunity Added", description: `${data.name} has been added to the pipeline.` })
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
        setIsOwnerModalOpen(false)
        setSelectedCard(null)
        toast({ title: "Owner Updated", description: `Reassigned to ${newOwner}` })
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

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] space-y-6 animate-in fade-in duration-500 p-1">

            {/* Header / Roadmap Navigator */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shrink-0">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-2 h-7 text-slate-400 hover:text-indigo-600 font-medium text-[10px]"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="h-3 w-3 mr-1" /> Portfolio
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shadow-inner">
                            <HandMetal className="h-4 w-4" />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-semibold tracking-tight text-slate-900 leading-none">Pipeline Board</h1>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Interactive lifecycle stage management engine.</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-slate-100 p-1 rounded-xl flex mr-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('grid')}
                            className={`h-8 w-8 p-0 rounded-lg ${view === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <LayoutGrid size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('list')}
                            className={`h-8 w-8 p-0 rounded-lg ${view === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <List size={16} />
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/lead-management/settings/pipeline')}
                        className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-medium text-[12px]"
                    >
                        <Settings2 className="h-4 w-4 mr-2 text-slate-400" /> Board Setup
                    </Button>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 shadow-indigo-100 shadow-lg border-none"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Opportunity
                    </Button>
                </div>
            </div>

            {/* Sub-Header / Control Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-xl shrink-0">
                <div className="flex items-center gap-2 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-[350px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find by name, owner or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 border-slate-100 bg-white/80 backdrop-blur-sm text-[13px] rounded-xl shadow-none focus-visible:ring-indigo-500"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast({ title: "Filters Applied", description: "Showing personalized view." })}
                        className="h-10 px-4 border-slate-100 bg-white text-slate-600 font-medium rounded-xl shadow-sm"
                    >
                        <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" /> Quick Filters
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-4 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium">Total value</span>
                            <span className="text-[14px] font-semibold text-slate-900 tracking-tight tabular-nums">$215,600</span>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium">Velocity</span>
                            <span className="text-[14px] font-semibold text-emerald-600 tracking-tight tabular-nums">+12%</span>
                        </div>
                    </div>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-10 w-10 border-slate-100 bg-white rounded-xl shadow-sm">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-slate-100">
                            <DropdownMenuItem onClick={() => router.push('/lead-management/activities')} className="text-[12px] font-medium py-2 cursor-pointer">Stage History</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportCSV} className="text-[12px] font-medium py-2 cursor-pointer">Export Board</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                disabled={isRefreshing}
                                onClick={handleRefresh}
                                className="text-[12px] font-bold py-2 text-indigo-600 disabled:opacity-50 cursor-pointer"
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
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-500 font-medium text-[10px] px-1.5 h-5 rounded-md border-none">
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
                                            className={`flex-1 flex flex-col gap-3 p-3 rounded-2xl border-2 border-dashed transition-all duration-200 min-h-[650px] ${snapshot.isDraggingOver
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
                                                            <Card className={`border-none shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing ${snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-500 rotate-2" : "ring-1 ring-slate-100"
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
                                                                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-slate-100 -mr-1">
                                                                                    <MoreVertical size={14} className="text-slate-400" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-xl">
                                                                                <DropdownMenuItem
                                                                                    onClick={() => {
                                                                                        setSelectedCard(card)
                                                                                        setIsOwnerModalOpen(true)
                                                                                    }}
                                                                                    className="text-[11px] font-medium py-2 cursor-pointer"
                                                                                >
                                                                                    Quick Assignment
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem
                                                                                    onClick={() => toast({ title: "Activity Logger", description: `Initializing interaction log for ${card.company}.` })}
                                                                                    className="text-[11px] font-medium py-2 cursor-pointer"
                                                                                >
                                                                                    Log Interaction
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuSeparator />
                                                                                {column.id !== 'lost' && (
                                                                                    <DropdownMenuItem
                                                                                        onClick={() => handleMarkLost(card.id)}
                                                                                        className="text-[11px] font-semibold py-2 text-rose-500 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                                                                                    >
                                                                                        Mark as Lost
                                                                                    </DropdownMenuItem>
                                                                                )}
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>

                                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                                        {card.tags.map(tag => (
                                                                            <Badge key={tag} className="bg-indigo-50 text-indigo-600 border-none text-[9px] font-medium px-1.5 h-4.5 rounded">
                                                                                {tag}
                                                                            </Badge>
                                                                        ))}
                                                                        {card.priority === 'high' && (
                                                                            <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-medium px-1.5 h-4.5 rounded">
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
                                                                        <Avatar className="h-7 w-7 border-2 border-white shadow-sm">
                                                                            <AvatarFallback className="bg-slate-100 text-[10px] font-medium text-slate-500">
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

            {/* Modals */}
            <LeadFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddOpportunity}
                title="Create New Opportunity"
                stages={columns.map(c => ({ id: c.id, title: c.title }))}
            />

            <MoveOwnerModal
                isOpen={isOwnerModalOpen}
                onClose={() => setIsOwnerModalOpen(false)}
                onConfirm={handleReassign}
                selectedCount={1}
            />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    )
}
