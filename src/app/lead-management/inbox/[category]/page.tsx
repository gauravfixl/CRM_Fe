"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Inbox,
    Search,
    Filter,
    Download,
    RefreshCcw,
    ArrowUpDown,
    ListFilter,
    Sparkles,
    ChevronLeft,
    AlertCircle,
    Zap,
    Target,
    Clock
} from 'lucide-react'
import { LeadInboxTable, Lead } from '@/shared/components/lead-management/LeadInboxTable'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"

import { LeadFormModal } from '@/shared/components/lead-management/modals/LeadFormModal'
import { DeleteConfirmationModal } from '@/shared/components/lead-management/modals/DeleteConfirmationModal'
import { AdvancedFilterModal } from '@/shared/components/lead-management/modals/AdvancedFilterModal'
import { MoveOwnerModal } from '@/shared/components/lead-management/modals/MoveOwnerModal'
import { BatchTaggingModal } from '@/shared/components/lead-management/modals/BatchTaggingModal'

const CATEGORY_MAP: Record<string, { title: string; desc: string; color: string; icon: any }> = {
    new: {
        title: "New Leads",
        desc: "Recent system entries awaiting initial classification and stage progression. Goal: Speed-to-Acknowledgment.",
        color: "text-blue-600",
        icon: Sparkles
    },
    unassigned: {
        title: "Unassigned Queue",
        desc: "Active leads with no assigned ownership. Requires manual assignment or rule-based distribution.",
        color: "text-indigo-600",
        icon: Inbox
    },
    pending: {
        title: "Pending Response",
        desc: "Assigned leads currently awaiting their first contact or follow-up action within the SLA window.",
        color: "text-amber-500",
        icon: Clock
    },
    "at-risk": {
        title: "At Risk & Escalate",
        desc: "Critical items requiring immediate intervention due to SLA breaches, stagnation, or high-value neglect.",
        color: "text-rose-600",
        icon: AlertCircle
    },
    inactive: {
        title: "Inactive Pipeline",
        desc: "Stagnant records with no movement or recorded engagement for > 7 days. Risk of pipeline leakage.",
        color: "text-slate-500",
        icon: RefreshCcw
    },
    "high-value": {
        title: "High Value / Intent",
        desc: "Elite opportunities surfacing based on scoring thresholds, enterprise tags, or urgent intent markers.",
        color: "text-violet-600",
        icon: Target
    },
    reopened: {
        title: "Reopened / Reactivated",
        desc: "Leads resurfacing after being marked as Lost or Inactive, often via re-engagement campaigns.",
        color: "text-emerald-600",
        icon: RefreshCcw
    },
}

const getMockData = (category: string): Lead[] => {
    // Advanced data generator for Senior-level implementation
    const generateLeads = (): Lead[] => {
        switch (category) {
            case 'new':
                return [
                    { id: 'n1', name: "Arjun Deshmukh", email: "arjun@vortex.io", company: "Vortex Solutions", source: "Direct", score: 45, status: "New", stage: "Discovery", lastActivity: "5m ago", value: "$15,000", slaStatus: 'healthy', slaTimeRemaining: '1h 55m', tags: ["SaaS"] },
                    { id: 'n2', name: "Sarah Jenkins", email: "s.jenkins@globex.com", company: "Globex Corp", source: "LinkedIn", score: 62, status: "New", stage: "Discovery", lastActivity: "22m ago", value: "$45,000", slaStatus: 'healthy', slaTimeRemaining: '1h 38m', tags: ["Enterprise"] },
                    { id: 'n3', name: "Rahul Varma", email: "rahul@startup.in", company: "Zest AI", source: "Google Ads", score: 32, status: "New", stage: "Discovery", lastActivity: "1h ago", value: "$8,500", slaStatus: 'healthy', slaTimeRemaining: '58m', tags: ["Series A"] },
                    { id: 'n4', name: "Emily Chen", email: "emily@designco.sg", company: "DesignCo", source: "Referral", score: 78, status: "New", stage: "Discovery", lastActivity: "2h ago", value: "$12,000", slaStatus: 'warning', slaTimeRemaining: '5m', tags: ["Agency"] },
                ]
            case 'unassigned':
                return [
                    { id: 'u1', name: "Michael Ross", email: "mike@pearson.com", company: "Pearson Hardman", source: "Web Form", score: 85, status: "Awaiting Assignment", stage: "Hot", lastActivity: "14m ago", value: "$120,000", slaStatus: 'warning', slaTimeRemaining: '12m', tags: ["VIP", "Legal"] },
                    { id: 'u2', name: "Deepika Padukone", email: "d.padu@ka.in", company: "Ka Enterprises", source: "LinkedIn", score: 92, status: "Awaiting Assignment", stage: "Hot", lastActivity: "45m ago", value: "$250,000", slaStatus: 'breached', slaTimeRemaining: undefined, tags: ["Enterprise"] },
                    { id: 'u3', name: "Aman Gupta", email: "aman@boat.com", company: "BoAt Lifestyle", source: "Direct", score: 65, status: "Awaiting Assignment", stage: "Warm", lastActivity: "3h ago", value: "$35,000", slaStatus: 'healthy', slaTimeRemaining: '2h 10m', tags: ["D2C"] },
                ]
            case 'pending':
                return [
                    { id: 'p1', name: "Steve Harvey", email: "steve@show.com", company: "Family Feud", source: "TV Ad", score: 55, status: "Assigned", stage: "Initial Pitch", lastActivity: "1d ago", value: "$22,000", ownerName: "Rajesh Kumar", slaStatus: 'warning', slaTimeRemaining: '45m', tags: ["Top Tier"] },
                    { id: 'p2', name: "Vikram Seth", email: "v.seth@books.com", company: "Penguin India", source: "Referral", score: 48, status: "Assigned", stage: "Discovery", lastActivity: "6h ago", value: "$5,000", ownerName: "Anita Sharma", slaStatus: 'healthy', slaTimeRemaining: '18h', tags: ["Author"] },
                ]
            case 'at-risk':
                return [
                    { id: 'r1', name: "Tony Stark", email: "tony@starkintl.com", company: "Stark Industries", source: "Direct", score: 98, status: "SLA Breached", stage: "Negotiation", lastActivity: "4d ago", value: "$1.2M", ownerName: "Sunil Moitra", slaStatus: 'breached', tags: ["MARVEL", "WHALE"] },
                    { id: 'r2', name: "Bruce Wayne", email: "bruce@waynecorp.com", company: "Wayne Enterprises", source: "Referral", score: 95, status: "Inactive", stage: "Proposal", lastActivity: "7d ago", value: "$850k", ownerName: "Anita Sharma", slaStatus: 'breached', tags: ["DC", "ULTRA"] },
                    { id: 'r3', name: "Harvey Specter", email: "harvey@ph.com", company: "Pearson Specter", source: "LinkedIn", score: 88, status: "Stagnant", stage: "Initial Pitch", lastActivity: "12d ago", value: "$150k", ownerName: "Rajesh Kumar", slaStatus: 'warning', slaTimeRemaining: 'Overdue', tags: ["Legal"] },
                ]
            case 'inactive':
                return [
                    { id: 'i1', name: "Walter White", email: "heisenberg@bluesky.com", company: "Gray Matter", source: "Direct", score: 20, status: "Dormant", stage: "Cold", lastActivity: "45d ago", value: "$500k", ownerName: "Rajesh Kumar", slaStatus: 'healthy', tags: ["Science"] },
                    { id: 'i2', name: "Jesse Pinkman", email: "capncook@albuquerque.biz", company: "Vamonos Pest", source: "Direct", score: 15, status: "Dormant", stage: "Cold", lastActivity: "60d ago", value: "$10k", ownerName: "Rajesh Kumar", slaStatus: 'healthy', tags: ["Field Trip"] },
                ]
            case 'high-value':
                return [
                    { id: 'h1', name: "Elon Musk", email: "elon@spacex.com", company: "SpaceX", source: "Twitter", score: 99, status: "Priority", stage: "Negotiation", lastActivity: "12m ago", value: "$10M+", ownerName: "Anita Sharma", slaStatus: 'healthy', slaTimeRemaining: '4h 2h', tags: ["Mars", "Enterprise"] },
                    { id: 'h2', name: "Jeff Bezos", email: "jeff@blueorigin.com", company: "Blue Origin", source: "LinkedIn", score: 98, status: "Priority", stage: "Proposal", lastActivity: "1h ago", value: "$8.5M", ownerName: "Sunil Moitra", slaStatus: 'healthy', slaTimeRemaining: '6h', tags: ["Apollo", "Ultra"] },
                ]
            case 'reopened':
                return [
                    { id: 'ro1', name: "Peter Parker", email: "spidey@dailybugle.com", company: "Daily Bugle", source: "Re-engagement", score: 65, status: "Reactivated", stage: "Discovery", lastActivity: "2h ago", value: "$2,500", ownerName: "Anita Sharma", slaStatus: 'healthy', slaTimeRemaining: '23h', tags: ["NYC"] },
                    { id: 'ro2', name: "Clark Kent", email: "superman@metropolis.com", company: "Daily Planet", source: "Campaign", score: 72, status: "Reactivated", stage: "Initial Pitch", lastActivity: "5h ago", value: "$14,000", ownerName: "Rajesh Kumar", slaStatus: 'healthy', slaTimeRemaining: '18h', tags: ["Metropolis"] },
                ]
            default:
                return []
        }
    }
    return generateLeads()
}

export default function LeadInboxPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()

    // Derived State
    const category = (params.category as string) || 'new'
    const config = CATEGORY_MAP[category] || CATEGORY_MAP.new

    // Local State
    const [leads, setLeads] = React.useState<Lead[]>([])
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [searchQuery, setSearchQuery] = React.useState("")
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc')
    const [loading, setLoading] = React.useState(false)

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
    const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false)
    const [isMoveOwnerModalOpen, setIsMoveOwnerModalOpen] = React.useState(false)
    const [isBatchTaggingModalOpen, setIsBatchTaggingModalOpen] = React.useState(false)

    // Advanced Filters State
    const [advancedFilters, setAdvancedFilters] = React.useState({
        source: 'all',
        owner: 'all',
        status: 'all',
        scoreRange: [0, 100],
        minProjectValue: '',
    })

    // Load data on category change
    React.useEffect(() => {
        setLoading(true)
        // Simulate network delay
        setTimeout(() => {
            setLeads(getMockData(category))
            setSelectedIds([])
            setLoading(false)
        }, 300)
    }, [category])

    // Filter & Sort Logic
    const filteredLeads = React.useMemo(() => {
        let result = leads.filter(l => {
            const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesSource = advancedFilters.source === 'all' || l.source === advancedFilters.source
            const matchesScore = l.score >= advancedFilters.scoreRange[0] && l.score <= advancedFilters.scoreRange[1]
            const matchesValue = !advancedFilters.minProjectValue ||
                (parseInt(l.value.replace(/[^0-9]/g, '')) >= parseInt(advancedFilters.minProjectValue))
            const matchesOwner = advancedFilters.owner === 'all' || l.ownerName === advancedFilters.owner

            return matchesSearch && matchesSource && matchesScore && matchesValue && matchesOwner
        })

        if (sortOrder === 'desc') {
            result.sort((a, b) => b.score - a.score)
        } else {
            result.sort((a, b) => a.score - b.score)
        }
        return result
    }, [leads, searchQuery, sortOrder, advancedFilters])

    // Handlers
    const handleLeadAction = (lead: Lead, action: string) => {
        if (action === 'Open Full Profile') {
            setSelectedLead(lead)
            setIsEditModalOpen(true)
            return
        }

        toast({
            title: `Action: ${action}`,
            description: `Processing request for ${lead.name}...`,
            duration: 2000,
        })

        // Simulate "Optimistic UI" updates based on action
        if (['Archive', 'Acknowledge', 'Move to Qualification', 'Manual Assignment', 'Reassign Immediate'].includes(action)) {
            // Remove from list after delay
            setTimeout(() => {
                setLeads(prev => prev.filter(p => p.id !== lead.id))
                toast({
                    title: "Success",
                    description: `Record moved from ${config.title} successfully.`,
                    variant: "default",
                })
            }, 800)
        }
    }

    const handleEditSubmit = (data: any) => {
        if (!selectedLead) return
        setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, ...data } : l))
        setIsEditModalOpen(false)
        setSelectedLead(null)
        toast({
            title: "Lead Updated",
            description: `Details for ${data.name} have been updated.`,
        })
    }

    const handleBulkAction = (action?: string) => {
        if (selectedIds.length === 0) {
            toast({
                title: "No Selection",
                description: "Please select at least one record to perform bulk actions.",
                variant: "destructive",
            })
            return
        }

        const effectiveAction = action || (
            category === 'unassigned' ? 'Assign' :
                category === 'at-risk' ? 'Escalate' :
                    category === 'pending' ? 'Nudge' : 'Process'
        )

        if (effectiveAction === 'Move Owner') {
            setIsMoveOwnerModalOpen(true)
            return
        }

        if (effectiveAction === 'Batch Tagging') {
            setIsBatchTaggingModalOpen(true)
            return
        }

        toast({
            title: `Bulk ${effectiveAction}`,
            description: `Processing ${effectiveAction} for ${selectedIds.length} records...`,
        })

        setTimeout(() => {
            setLeads(prev => prev.filter(l => !selectedIds.includes(l.id)))
            setSelectedIds([])
            toast({
                title: "Batch Complete",
                description: `${selectedIds.length} records processed successfully.`,
            })
        }, 1000)
    }

    const confirmBulkOwnerMove = (newOwner: string) => {
        setLeads(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, ownerName: newOwner } : l))
        setIsMoveOwnerModalOpen(false)
        setSelectedIds([])
        toast({ title: "Ownership Transferred", description: `Selected leads reassigned to ${newOwner}.` })
    }

    const confirmBatchTagging = (tags: string[]) => {
        setLeads(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, tags: [...(l.tags || []), ...tags.filter(t => !l.tags?.includes(t))] } : l))
        setIsBatchTaggingModalOpen(false)
        setSelectedIds([])
        toast({ title: "Tags Applied", description: `Added ${tags.length} labels to selection.` })
    }

    const handleExport = () => {
        const headers = ["Name", "Email", "Company", "Source", "Score", "Value", "Owner", "Tags"]
        const data = filteredLeads.map(l => [l.name, l.email, l.company, l.source, l.score, l.value, l.ownerName || 'Unassigned', l.tags.join("; ")])

        const csvContent = [headers, ...data].map(e => e.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `Inbox_${category}_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
            title: "Export Successful",
            description: `Generated ${filteredLeads.length} record CSV download.`,
        })
    }

    const applyAdvancedFilters = (filters: any) => {
        setAdvancedFilters(filters)
        setIsFilterModalOpen(false)
        toast({
            title: "Filters Applied",
            description: "Inbox view has been restricted to your selection.",
        })
    }

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">

            {/* Dynamic Context Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/lead-management')}
                        className="-ml-2 h-7 text-[11px] font-medium text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Control Center
                    </Button>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 ${config.color.replace('text-', 'bg-').replace('600', '50')} ${config.color}`}>
                            <config.icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-[24px] font-bold tracking-tight text-slate-900 leading-none">
                                {config.title}
                            </h1>
                            <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                                {config.desc}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="h-9 border-slate-200 text-slate-600 font-bold px-4 bg-white hover:bg-slate-50 shadow-sm transition-all hover:border-slate-300 rounded-xl"
                    >
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export List
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleBulkAction()}
                        className={`h-9 text-white font-bold px-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 rounded-xl ${category === 'at-risk' ? 'bg-rose-600 hover:bg-rose-700' :
                            category === 'pending' ? 'bg-amber-500 hover:bg-amber-600' :
                                'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {category === 'unassigned' ? 'Bulk Assign' :
                            category === 'at-risk' ? 'Escalate All' :
                                category === 'pending' ? 'Nudge All' : 'Bulk Action'}
                        {selectedIds.length > 0 && <span className="ml-2 bg-white/20 px-1.5 rounded text-[10px]">{selectedIds.length}</span>}
                    </Button>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-4 bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder={`Search ${config.title.toLowerCase()}...`}
                        className="pl-9 h-10 border-transparent bg-slate-50 focus:bg-white focus:border-indigo-100 transition-all font-medium text-[13px] rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 text-slate-500 font-medium text-[11px] hover:bg-slate-50 rounded-lg">
                                <ListFilter className="h-3.5 w-3.5 mr-2" /> Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl p-1 shadow-xl border-slate-100">
                            <DropdownMenuItem onClick={() => setIsFilterModalOpen(true)} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer">Advanced Filters</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBulkAction('Batch Tagging')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer">Batch Tagging</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBulkAction('Move Owner')} className="text-[12px] font-medium py-2 rounded-lg cursor-pointer">Move Owner</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="h-9 text-slate-500 font-medium text-[11px] hover:bg-slate-50 rounded-lg"
                    >
                        <ArrowUpDown className="h-3.5 w-3.5 mr-2" /> Sort {sortOrder === 'desc' ? 'Desc' : 'Asc'}
                    </Button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-lg"
                        onClick={() => {
                            setLoading(true)
                            setTimeout(() => {
                                setLeads(getMockData(category))
                                setLoading(false)
                                toast({ title: "Refreshed", description: "Data updated from server." })
                            }, 500)
                        }}
                    >
                        <RefreshCcw className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <LeadInboxTable
                    leads={filteredLeads}
                    category={category}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onLeadAction={handleLeadAction}
                />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-2">
                <p>Showing {filteredLeads.length} records</p>
                <p>Last synced: Just now</p>
            </div>

            {/* Modals */}
            <LeadFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedLead(null)
                }}
                initialData={selectedLead}
                onSubmit={handleEditSubmit}
                title="Review Lead Profile"
            />

            <AdvancedFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={applyAdvancedFilters}
                currentFilters={advancedFilters}
            />

            <MoveOwnerModal
                isOpen={isMoveOwnerModalOpen}
                onClose={() => setIsMoveOwnerModalOpen(false)}
                onConfirm={confirmBulkOwnerMove}
                selectedCount={selectedIds.length}
            />

            <BatchTaggingModal
                isOpen={isBatchTaggingModalOpen}
                onClose={() => setIsBatchTaggingModalOpen(false)}
                onConfirm={confirmBatchTagging}
                selectedCount={selectedIds.length}
            />
        </div>
    )
}
