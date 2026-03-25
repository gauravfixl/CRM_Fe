"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Search,
    Filter,
    Download,
    Trash2,
    UserPlus,
    MoreHorizontal,
    ChevronLeft,
    Calendar,
    Layers,
    FileSpreadsheet,
    Settings2,
    Database,
    ArrowUpDown,
    History,
    GitBranch,
    Zap
} from 'lucide-react'
import { LeadInboxTable, Lead } from '@/shared/components/lead-management/LeadInboxTable'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"
import { axiosInstance as axios } from "@/lib/axios"

import { LeadFormModal } from '@/shared/components/lead-management/modals/LeadFormModal'
import { DeleteConfirmationModal } from '@/shared/components/lead-management/modals/DeleteConfirmationModal'
import { AdvancedFilterModal } from '@/shared/components/lead-management/modals/AdvancedFilterModal'
import { MoveOwnerModal } from '@/shared/components/lead-management/modals/MoveOwnerModal'
import { BatchTaggingModal } from '@/shared/components/lead-management/modals/BatchTaggingModal'
import { ImportLeadsModal } from '@/shared/components/lead-management/modals/ImportLeadsModal'

const CATEGORY_CONFIG: Record<string, { title: string; desc: string; icon: any; accent: string }> = {
    all: { title: "All Leads", desc: "The complete master list of all lead records stored in the platform.", icon: Database, accent: "indigo" },
    active: { title: "Active Leads", desc: "Shows only leads that are currently being worked on in the pipeline.", icon: Layers, accent: "emerald" },
    converted: { title: "Converted Leads", desc: "Shows leads that successfully reached the conversion outcome.", icon: UserPlus, accent: "teal" },
    lost: { title: "Lost Leads", desc: "Shows leads that are marked as lost, disqualified, or not proceeding.", icon: Trash2, accent: "rose" },
    archived: { title: "Archived Leads", desc: "Stores leads that are inactive, aged-out, or intentionally removed from active workflows.", icon: History, accent: "slate" },
    saved: { title: "Saved Views", desc: "User-created or system-defined filtered views of leads that can be saved, shared, and reused.", icon: Settings2, accent: "amber" },
}

const MASTER_LEAD_DB: Lead[] = [
    { id: '1', name: "Aarav Mehta", email: "aarav@tech.com", company: "TechFlow Systems", source: "Google", score: 88, status: "Negotiation", stage: "Hot", lastActivity: "12m ago", value: "$12,400", slaStatus: 'healthy', tags: ["Enterprise"], ownerName: "Rajesh K." },
    { id: '2', name: "Sarah Jenkins", email: "sarah.j@global.inc", company: "Global Inc.", source: "LinkedIn", score: 92, status: "Converted", stage: "Closed Won", lastActivity: "2d ago", value: "$45,000", slaStatus: 'healthy', tags: ["VIP"], ownerName: "Anita S." },
    { id: '3', name: "Ishaan Gupta", email: "ishaan@innovate.com", company: "Innovate Labs", source: "Direct", score: 45, status: "Discovery", stage: "Cold", lastActivity: "5d ago", value: "$28,000", slaStatus: 'warning', tags: ["Startup"], ownerName: "Rajesh K." },
    { id: '4', name: "Michael Chen", email: "m.chen@startups.io", company: "Startups.io", source: "Referral", score: 34, status: "Lost", stage: "Lost", lastActivity: "1w ago", value: "$5,000", slaStatus: 'breached', tags: ["SME"], lostReason: "Budget", ownerName: "Anita S." },
    { id: '5', name: "Emma Wilson", email: "emma@creative.co", company: "Creative Solutions", source: "Website", score: 67, status: "Active", stage: "Warm", lastActivity: "3h ago", value: "$15,200", slaStatus: 'healthy', tags: ["Design"], ownerName: "Rajesh K." },
    { id: '6', name: "David Miller", email: "david@construction.net", company: "Miller Construction", source: "Google", score: 22, status: "Archived", stage: "Archived", lastActivity: "3mo ago", value: "$120,000", slaStatus: 'breached', tags: ["Construction"], ownerName: "Unassigned" },
    { id: '7', name: "Olivia Taylor", email: "olivia@retail.com", company: "Taylor Retail", source: "LinkedIn", score: 78, status: "Active", stage: "Hot", lastActivity: "15m ago", value: "$8,500", slaStatus: 'healthy', tags: ["Retail"], ownerName: "Anita S." },
    { id: '8', name: "James Anderson", email: "james@finance.org", company: "Anderson Finance", source: "Direct", score: 55, status: "Active", stage: "Warm", lastActivity: "1d ago", value: "$32,000", slaStatus: 'warning', tags: ["Finance"], ownerName: "Rajesh K." },
    { id: '9', name: "Lucas Martin", email: "lucas@logistics.ly", company: "Logistics.ly", source: "Google", score: 81, status: "Converted", stage: "Closed Won", lastActivity: "3d ago", value: "$67,000", slaStatus: 'healthy', tags: ["Logistics"], ownerName: "Anita S." },
    { id: '10', name: "Sophia White", email: "sophia@edu.net", company: "EduNet", source: "Webinar", score: 40, status: "Lost", stage: "Disqualified", lastActivity: "2w ago", value: "$2,500", slaStatus: 'healthy', tags: ["Education"], lostReason: "Timing", ownerName: "Rajesh K." },
    { id: '11', name: "Daniel Thompson", email: "dan@auto.com", company: "AutoMotive Group", source: "Referral", score: 62, status: "Active", stage: "Cold", lastActivity: "4d ago", value: "$19,000", slaStatus: 'warning', tags: ["Auto"], ownerName: "Anita S." },
    { id: '12', name: "Mia Garcia", email: "mia@health.care", company: "HealthCare Plus", source: "Direct", score: 89, status: "Negotiation", stage: "Hot", lastActivity: "1h ago", value: "$55,000", slaStatus: 'healthy', tags: ["Healthcare"], ownerName: "Rajesh K." },
    { id: '13', name: "William Martinez", email: "william@law.firm", company: "Martinez Law", source: "LinkedIn", score: 28, status: "Archived", stage: "Archived", lastActivity: "6mo ago", value: "$10,000", slaStatus: 'breached', tags: ["Legal"], ownerName: "Unassigned" },
    { id: '14', name: "Ava Robinson", email: "ava@realestate.com", company: "Robinson Realty", source: "Google", score: 74, status: "Active", stage: "Warm", lastActivity: "2h ago", value: "$95,000", slaStatus: 'healthy', tags: ["Real Estate"], ownerName: "Anita S." },
    { id: '15', name: "Ethan Clark", email: "ethan@tech.io", company: "Tech IO", source: "Website", score: 95, status: "Converted", stage: "Closed Won", lastActivity: "1d ago", value: "$150,000", slaStatus: 'healthy', tags: ["SaaS"], ownerName: "Rajesh K." },
    { id: '16', name: "Isabella Rodriguez", email: "isabella@food.co", company: "Food Co.", source: "Referral", score: 50, status: "Lost", stage: "Lost", lastActivity: "1mo ago", value: "$8,000", slaStatus: 'healthy', tags: ["F&B"], lostReason: "Competitor", ownerName: "Anita S." },
    { id: '17', name: "Mason Lewis", email: "mason@travel.com", company: "Travel World", source: "Google", score: 60, status: "Active", stage: "Cold", lastActivity: "5h ago", value: "$14,000", slaStatus: 'warning', tags: ["Travel"], ownerName: "Rajesh K." },
    { id: '18', name: "Charlotte Walker", email: "charlotte@media.net", company: "Media Net", source: "LinkedIn", score: 85, status: "Active", stage: "Hot", lastActivity: "30m ago", value: "$42,000", slaStatus: 'healthy', tags: ["Media"], ownerName: "Anita S." },
    { id: '19', name: "Benjamin Hall", email: "ben@energy.corp", company: "Energy Corp", source: "Direct", score: 30, status: "Archived", stage: "Archived", lastActivity: "4mo ago", value: "$200,000", slaStatus: 'breached', tags: ["Energy"], ownerName: "Unassigned" },
    { id: '20', name: "Amelia Allen", email: "amelia@fashion.com", company: "Fashion Week", source: "Webinar", score: 70, status: "Active", stage: "Warm", lastActivity: "1d ago", value: "$25,000", slaStatus: 'healthy', tags: ["Fashion"], ownerName: "Rajesh K." }
]

const getMockData = (cat: string): Lead[] => {
    switch (cat) {
        case 'active':
            return MASTER_LEAD_DB.filter(l => !['Converted', 'Lost', 'Archived'].includes(l.status))
        case 'converted':
            return MASTER_LEAD_DB.filter(l => l.status === 'Converted')
        case 'lost':
            return MASTER_LEAD_DB.filter(l => l.status === 'Lost')
        case 'archived':
            return MASTER_LEAD_DB.filter(l => l.status === 'Archived')
        case 'saved':
            return MASTER_LEAD_DB.filter(l => l.score > 80) // Example: "High Value Leads"
        case 'all':
        default:
            return MASTER_LEAD_DB
    }
}

type SortOption = 'value' | 'score' | 'activity' | 'created'

export default function LeadDatabasePage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const category = (params.category as string) || 'all'
    const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.all

    const [allLeads, setAllLeads] = React.useState<Lead[]>([])
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [loading, setLoading] = React.useState(true)

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false)
    const [isMoveOwnerModalOpen, setIsMoveOwnerModalOpen] = React.useState(false)
    const [isBatchTaggingModalOpen, setIsBatchTaggingModalOpen] = React.useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = React.useState(false)
    const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = React.useState("")
    const [advancedFilters, setAdvancedFilters] = React.useState({
        source: 'all',
        owner: 'all',
        status: 'all',
        scoreRange: [0, 100],
        minProjectValue: '',
    })
    const [sortConfig, setSortConfig] = React.useState<{ key: SortOption; direction: 'asc' | 'desc' }>({
        key: 'value',
        direction: 'desc'
    })

    // Pagination State
    const [currentPage, setCurrentPage] = React.useState(1)
    const itemsPerPage = 7

    React.useEffect(() => {
        setLoading(true)
        const fetchLeads = async () => {
            try {
                const response = await axios.get('/lead/getAllLeads')
                const apiLeads = response?.data?.leads || response?.data || []
                if (Array.isArray(apiLeads) && apiLeads.length > 0) {
                    // Map API leads to Lead interface
                    const mapped: Lead[] = apiLeads.map((l: any) => ({
                        id: l._id || l.id,
                        name: l.name || l.firstName || `${l.firstName || ''} ${l.lastName || ''}`.trim() || 'Unknown',
                        email: l.email || '',
                        company: l.company || l.companyName || '',
                        source: l.source || 'Direct',
                        score: l.score || l.leadScore || 0,
                        status: l.stage || l.status || 'New',
                        stage: l.stage || l.status || 'New',
                        lastActivity: l.updatedAt ? getTimeAgo(l.updatedAt) : '--',
                        value: l.value || l.dealValue ? `$${(l.value || l.dealValue || 0).toLocaleString()}` : '$0',
                        slaStatus: 'healthy' as const,
                        tags: l.tags || [],
                        ownerName: l.assignedTo?.fullName || l.assignedTo?.email || l.owner || 'Unassigned',
                        lostReason: l.lostReason || undefined,
                    }))
                    // Filter based on category
                    const filtered = filterByCategory(mapped, category)
                    setAllLeads(filtered)
                } else {
                    // Fallback to mock data if API returns nothing
                    setAllLeads(getMockData(category))
                }
            } catch (err) {
                console.error('Failed to fetch leads, using mock data:', err)
                setAllLeads(getMockData(category))
            } finally {
                setLoading(false)
            }
        }
        fetchLeads()
    }, [category])

    // Helper: time ago string
    function getTimeAgo(dateStr: string) {
        const now = new Date().getTime()
        const date = new Date(dateStr).getTime()
        const diff = now - date
        const mins = Math.floor(diff / 60000)
        if (mins < 60) return `${mins}m ago`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        if (days < 7) return `${days}d ago`
        if (days < 30) return `${Math.floor(days / 7)}w ago`
        return `${Math.floor(days / 30)}mo ago`
    }

    function filterByCategory(leads: Lead[], cat: string): Lead[] {
        switch (cat) {
            case 'active': return leads.filter(l => !['Converted', 'Won', 'Lost', 'Closed Won', 'Closed Lost', 'Archived', 'Rejected'].includes(l.status))
            case 'converted': return leads.filter(l => ['Converted', 'Won', 'Closed Won'].includes(l.status))
            case 'lost': return leads.filter(l => ['Lost', 'Closed Lost', 'Rejected'].includes(l.status))
            case 'archived': return leads.filter(l => l.status === 'Archived')
            case 'saved': return leads.filter(l => l.score > 80)
            case 'all': default: return leads
        }
    }

    // --- Helpers ---
    const parseCurrency = (val: string) => parseInt(val?.replace(/[^0-9]/g, '')) || 0

    const parseTime = (timeStr: string) => {
        // Simple mock parser for "12m ago", "2d ago"
        const now = new Date().getTime()
        if (!timeStr) return now
        const num = parseInt(timeStr.replace(/[^0-9]/g, '')) || 0
        if (timeStr.includes('m ago')) return now - num * 60 * 1000
        if (timeStr.includes('h ago')) return now - num * 60 * 60 * 1000
        if (timeStr.includes('d ago')) return now - num * 24 * 60 * 60 * 1000
        if (timeStr.includes('w ago')) return now - num * 7 * 24 * 60 * 60 * 1000
        if (timeStr.includes('mo ago')) return now - num * 30 * 24 * 60 * 60 * 1000
        return now
    }

    // --- Derived State (Filtering & Sorting) ---
    const filteredLeads = React.useMemo(() => {
        let result = allLeads.filter(l => {
            const matchesSearch =
                l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.email.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesSource = advancedFilters.source === 'all' || l.source === advancedFilters.source;
            const matchesOwner = advancedFilters.owner === 'all' || l.ownerName === advancedFilters.owner;
            const matchesScore = l.score >= advancedFilters.scoreRange[0] && l.score <= advancedFilters.scoreRange[1];

            const leadVal = parseCurrency(l.value);
            const matchesValue = !advancedFilters.minProjectValue || leadVal >= parseInt(advancedFilters.minProjectValue);

            return matchesSearch && matchesSource && matchesOwner && matchesScore && matchesValue;
        })

        result.sort((a, b) => {
            let valA, valB;

            switch (sortConfig.key) {
                case 'value':
                    valA = parseCurrency(a.value)
                    valB = parseCurrency(b.value)
                    break;
                case 'score':
                    valA = a.score
                    valB = b.score
                    break;
                case 'activity':
                    valA = parseTime(a.lastActivity)
                    valB = parseTime(b.lastActivity)
                    break;
                default:
                    return 0;
            }

            return sortConfig.direction === 'asc' ? valA - valB : valB - valA
        })

        return result
    }, [allLeads, searchQuery, sortConfig])

    // --- Derived State (Pagination) ---
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
    const paginatedLeads = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredLeads.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredLeads, currentPage, itemsPerPage])

    // --- Handlers ---

    const handleSort = (key: SortOption, direction: 'asc' | 'desc') => {
        setSortConfig({ key, direction })
        toast({
            title: "Sorting Updated",
            description: `Ordered by ${key} (${direction === 'asc' ? 'Low to High' : 'High to Low'})`,
        })
    }

    const handleCreateSubmit = (data: any) => {
        const newLead: Lead = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            score: 50, // Default score
            lastActivity: 'Just now',
            slaStatus: 'healthy',
        }
        setAllLeads([newLead, ...allLeads])
        setIsCreateModalOpen(false)
        toast({
            title: "Lead Created",
            description: `${data.name} has been successfully added.`,
        })
    }

    const handleEditSubmit = (data: any) => {
        if (!selectedLead) return
        setAllLeads(allLeads.map(l => l.id === selectedLead.id ? { ...l, ...data } : l))
        setIsEditModalOpen(false)
        setSelectedLead(null)
        toast({
            title: "Lead Updated",
            description: `Details for ${data.name} have been updated.`,
        })
    }

    const handleDeleteConfirm = () => {
        if (!selectedLead) return
        setAllLeads(allLeads.filter(l => l.id !== selectedLead.id))
        setIsDeleteModalOpen(false)
        setSelectedLead(null)
        toast({
            title: "Lead Deleted",
            description: "The record has been permanently removed.",
        })
    }

    const handleCreateEntry = () => setIsCreateModalOpen(true)

    const handleAdvancedFilter = () => setIsFilterModalOpen(true)

    const applyAdvancedFilters = (filters: any) => {
        setAdvancedFilters(filters)
        setIsFilterModalOpen(false)
        setCurrentPage(1)
        toast({
            title: "Filters Applied",
            description: "Database view has been restricted to your selection.",
        })
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1)
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    const handleLeadAction = (lead: Lead, action: string) => {
        if (action === 'Open Full Profile') {
            setSelectedLead(lead)
            setIsEditModalOpen(true)
        } else if (action === 'Archive') {
            handleLeadActionInternal(lead, 'Archive')
        } else {
            toast({
                title: action,
                description: `Processing ${action} for ${lead.name}`,
            })
        }
    }

    const handleLeadActionInternal = (lead: Lead, action: string) => {
        if (['Archive', 'Delete', 'Convert'].includes(action)) {
            setAllLeads(prev => prev.filter(l => l.id !== lead.id))
            toast({ title: "Success", description: `${lead.name} moved to ${action}.` })
        }
    }

    const handleBulkAction = (action: string) => {
        if (action === 'Archive') {
            setAllLeads(prev => prev.filter(l => !selectedIds.includes(l.id)))
            toast({ title: "Bulk Archive", description: `${selectedIds.length} leads moved to archives.` })
            setSelectedIds([])
        } else if (action === 'Delete' || action === 'Delete Permanently') {
            setAllLeads(prev => prev.filter(l => !selectedIds.includes(l.id)))
            toast({ title: "Bulk Delete", description: `${selectedIds.length} records purged successfully.`, variant: "destructive" })
            setSelectedIds([])
        } else if (action === 'Move Owner') {
            setIsMoveOwnerModalOpen(true)
        } else if (action === 'Batch Tagging') {
            setIsBatchTaggingModalOpen(true)
        }
    }

    const confirmBulkOwnerMove = (newOwner: string) => {
        setAllLeads(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, ownerName: newOwner } : l))
        setIsMoveOwnerModalOpen(false)
        setSelectedIds([])
        toast({ title: "Ownership Transferred", description: `Selected leads reassigned to ${newOwner}.` })
    }

    const confirmBatchTagging = (tags: string[]) => {
        setAllLeads(prev => prev.map(l => selectedIds.includes(l.id) ? { ...l, tags: [...(l.tags || []), ...tags.filter(t => !l.tags?.includes(t))] } : l))
        setIsBatchTaggingModalOpen(false)
        setSelectedIds([])
        toast({ title: "Tags Applied", description: `Added ${tags.length} labels to selection.` })
    }

    const handleImport = () => setIsImportModalOpen(true)

    const handleExport = () => {
        const headers = ["Name", "Email", "Company", "Source", "Score", "Value", "Owner"]
        const data = filteredLeads.map(l => [l.name, l.email, l.company, l.source, l.score, l.value, l.ownerName])

        const csvContent = [headers, ...data].map(e => e.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
            title: "Export Successful",
            description: `Generated ${filteredLeads.length} record CSV download.`,
        })
    }

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/lead-management')}
                        className="-ml-2 h-7 text-[10px] font-semibold text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back to Dashboard
                    </Button>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${config.accent}-50 text-${config.accent}-600`}>
                                <config.icon className="h-5 w-5" />
                            </div>
                            <h1 className="text-[20px] font-semibold tracking-tight text-slate-900">
                                {config.title}
                            </h1>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium max-w-xl">
                            {config.desc}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <Button variant="outline" onClick={handleExport} className="h-9 border-slate-200 text-slate-600 font-semibold bg-white px-4 shadow-sm hover:bg-slate-50 rounded-xl">
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-slate-400" /> Export CSV
                    </Button>
                    <Button onClick={handleCreateEntry} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 shadow-md border-none rounded-xl transition-all active:scale-95">
                        <UserPlus className="h-4 w-4 mr-2" /> Create Entry
                    </Button>
                </div>
            </div>

            {/* Database Control Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-[450px]">
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Find by name, company, or email address..."
                            className="pl-11 h-12 border-slate-200 bg-white text-[13px] font-semibold shadow-none focus-visible:ring-indigo-500 rounded-xl"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAdvancedFilter} className="h-10 px-4 gap-2 border-slate-200 text-slate-600 font-semibold bg-white rounded-xl">
                        <Filter className="h-4 w-4 text-slate-400" /> Filters
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-10 px-4 gap-2 border-slate-200 text-slate-600 font-semibold bg-white rounded-xl">
                                <ArrowUpDown className="h-4 w-4 text-slate-400" /> Sort: {sortConfig.key === 'value' ? 'Value' : sortConfig.key === 'score' ? 'Score' : 'Activity'}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-2xl border-slate-100">
                            <DropdownMenuItem onClick={() => handleSort('value', 'desc')} className="text-[12.5px] font-semibold py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                Highest Value ($)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSort('value', 'asc')} className="text-[12.5px] font-semibold py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                Lowest Value ($)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1.5" />
                            <DropdownMenuItem onClick={() => handleSort('score', 'desc')} className="text-[12.5px] font-semibold py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                Highest Score
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSort('score', 'asc')} className="text-[12.5px] font-semibold py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                Lowest Score
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1.5" />
                            <DropdownMenuItem onClick={() => handleSort('activity', 'desc')} className="text-[12.5px] font-semibold py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                Most Recent Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSort('activity', 'asc')} className="text-[12.5px] font-semibold py-2.5 cursor-pointer hover:bg-slate-50 rounded-lg">
                                Oldest Activity
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 text-[11px] font-semibold text-slate-500 px-4 rounded-lg hover:bg-white hover:text-indigo-600 disabled:opacity-50 transition-all shadow-none"
                            disabled={selectedIds.length === 0}
                            onClick={() => handleBulkAction('Archive')}
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-2 opacity-60" /> Bulk Archive
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 text-[11px] font-semibold text-slate-500 px-4 rounded-lg hover:bg-white hover:text-indigo-600 disabled:opacity-50 transition-all shadow-none"
                            disabled={selectedIds.length === 0}
                            onClick={() => handleBulkAction('Move Owner')}
                        >
                            <UserPlus className="h-3.5 w-3.5 mr-2 opacity-60" /> Move Owner
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5 shadow-2xl border-slate-100">
                            <DropdownMenuItem
                                onClick={() => handleBulkAction('Batch Tagging')}
                                className="text-[12.5px] font-semibold py-2.5 rounded-lg cursor-pointer"
                            >
                                Batch Tagging
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleImport}
                                className="text-[12.5px] font-semibold py-2.5 rounded-lg cursor-pointer"
                            >
                                Import from Excel
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1.5" />
                            <DropdownMenuItem
                                className="text-[12.5px] font-bold py-2.5 rounded-lg text-rose-500 focus:bg-rose-50 focus:text-rose-600 cursor-pointer"
                                onClick={() => handleBulkAction('Delete Permanently')}
                            >
                                Delete Entire Selection
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Data Presentation */}
            <div className="animate-in fade-in slide-in-from-top-1 duration-700 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
                        <div className="h-8 w-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-sm font-semibold tracking-tight">Syncing Database...</p>
                    </div>
                ) : (
                    <LeadInboxTable
                        leads={paginatedLeads}
                        category={category}
                        selectedIds={selectedIds}
                        onSelectionChange={setSelectedIds}
                        onLeadAction={handleLeadAction}
                    />
                )}
            </div>

            {/* Database Pagination & Status */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 py-5 bg-white rounded-2xl border border-slate-100 shadow-sm mt-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-6">
                    <div className="space-y-0.5 text-center lg:text-left">
                        <p className="text-[14px] font-semibold text-slate-900 leading-none">{filteredLeads.length} Recorded Leads</p>
                        <p className="text-[11px] font-medium text-slate-400">Filtered from master database</p>
                    </div>
                    <div className="h-8 w-px bg-slate-100 hidden lg:block"></div>
                    <p className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg hidden lg:flex items-center gap-1.5">
                        <Zap className="h-3 w-3 fill-current" /> Live sync
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <Button
                        variant="ghost"
                        className="h-10 px-4 text-[11px] font-semibold text-slate-400 disabled:opacity-50 rounded-lg"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </Button>
                    <div className="flex gap-1.5 px-2 py-1 bg-slate-50/80 rounded-xl">
                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                            <Button
                                key={i}
                                size="sm"
                                onClick={() => handlePageChange(i + 1)}
                                className={`h-8 w-8 text-[11px] font-semibold rounded-lg transition-all ${currentPage === i + 1
                                    ? "bg-white border border-slate-200 text-indigo-600 shadow-sm scale-110"
                                    : "bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        {totalPages > 5 && <span className="text-slate-300 self-center">...</span>}
                    </div>
                    <Button
                        variant="ghost"
                        className="h-10 px-4 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:text-slate-300 rounded-lg"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next Page
                    </Button>
                </div>
            </div>

            {/* Modals */}
            <LeadFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
                title="Create New Lead"
            />

            <LeadFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedLead(null)
                }}
                initialData={selectedLead}
                onSubmit={handleEditSubmit}
                title="Edit Lead Details"
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedLead(null)
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Lead Record"
                description="Are you sure you want to delete this lead? This action cannot be undone and all associated activity logs will be lost."
                itemName={selectedLead?.name}
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

            <ImportLeadsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={() => { }} // Placeholder for actual ingestion logic
            />
        </div>
    )
}
