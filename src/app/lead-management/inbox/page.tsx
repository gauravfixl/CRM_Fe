"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    Inbox,
    Clock,
    UserPlus,
    MessageSquare,
    Search,
    MoreVertical,
    Plus,
    Trash2,
    FileText,
} from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"
import LeadSideForm, { type LeadFormShape } from '@/shared/components/lead-management/sheets/LeadSideForm'
import MoveOwnerSide from '@/shared/components/lead-management/sheets/MoveOwnerSide'
import { DeleteConfirmationModal } from '@/shared/components/lead-management/modals/DeleteConfirmationModal'
import { Textarea } from '@/shared/components/ui/textarea'
import { SideFormSheet, Field } from '@/shared/components/ui/side-form-sheet'
import { validateField } from '@/shared/components/lead-management/lead-validation'

interface InboxLead {
    id: number | string
    name: string
    company: string
    email?: string
    type: "Unassigned" | "SLA Breach" | "Stale"
    time: string
    priority: "Low" | "Medium" | "High" | "Critical"
    score: number
    ownerName?: string
    notes?: string[]
}

const INITIAL_LEADS: InboxLead[] = [
    { id: 1, name: "Rahul Sharma", company: "TechNova Solutions", email: "rahul@technova.com", type: "Unassigned", time: "15m ago", priority: "High", score: 85 },
    { id: 2, name: "Amit Patel", company: "Global Logistics", email: "amit@globallogistics.com", type: "SLA Breach", time: "4h ago", priority: "Critical", score: 92 },
    { id: 3, name: "Sneha Gupta", company: "Retail Hub", email: "sneha@retailhub.in", type: "Stale", time: "3 days ago", priority: "Medium", score: 65 },
    { id: 4, name: "Vikram Singh", company: "Infinite Loop Inc", email: "vikram@infiniteloop.com", type: "Unassigned", time: "1h ago", priority: "High", score: 78 },
]

const FILTERS = ['All', 'Unassigned', 'SLA Breaches', 'Stale']

export default function LeadInboxPage() {
    const router = useRouter()
    const { toast } = useToast()

    const [leads, setLeads] = useState<InboxLead[]>(INITIAL_LEADS)
    const [filter, setFilter] = useState('All')
    const [search, setSearch] = useState("")

    // Side-form states
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingLead, setEditingLead] = useState<InboxLead | null>(null)
    const [isAssignOpen, setIsAssignOpen] = useState(false)
    const [assignTarget, setAssignTarget] = useState<InboxLead | null>(null)
    const [isNoteOpen, setIsNoteOpen] = useState(false)
    const [noteTarget, setNoteTarget] = useState<InboxLead | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<InboxLead | null>(null)

    // Note form
    const [noteText, setNoteText] = useState("")
    const [noteError, setNoteError] = useState<string | null>(null)
    const [noteTouched, setNoteTouched] = useState(false)

    const counts = useMemo(() => ({
        All: leads.length,
        Unassigned: leads.filter(l => l.type === 'Unassigned').length,
        'SLA Breaches': leads.filter(l => l.type === 'SLA Breach').length,
        Stale: leads.filter(l => l.type === 'Stale').length,
    }), [leads])

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase()
        return leads.filter(l => {
            if (filter === 'Unassigned' && l.type !== 'Unassigned') return false
            if (filter === 'SLA Breaches' && l.type !== 'SLA Breach') return false
            if (filter === 'Stale' && l.type !== 'Stale') return false
            if (!q) return true
            return l.name.toLowerCase().includes(q) || l.company.toLowerCase().includes(q)
        })
    }, [leads, filter, search])

    const openCreate = () => {
        setEditingLead(null)
        setIsFormOpen(true)
    }

    const openEdit = (lead: InboxLead) => {
        setEditingLead(lead)
        setIsFormOpen(true)
    }

    const handleSubmitLead = (data: LeadFormShape) => {
        if (editingLead) {
            setLeads(prev => prev.map(l => l.id === editingLead.id
                ? { ...l, name: data.name, company: data.company, email: data.email, ownerName: data.ownerName }
                : l
            ))
            toast({ title: "Lead updated", description: data.name })
        } else {
            const newLead: InboxLead = {
                id: `n_${Date.now()}`,
                name: data.name,
                company: data.company,
                email: data.email,
                type: data.ownerName === "Unassigned" ? "Unassigned" : "SLA Breach",
                time: "Just now",
                priority: data.priority as InboxLead["priority"],
                score: 50,
                ownerName: data.ownerName,
            }
            setLeads(prev => [newLead, ...prev])
            toast({ title: "Lead created", description: data.name })
        }
        setIsFormOpen(false)
        setEditingLead(null)
    }

    const handleAssignClick = (lead: InboxLead) => {
        setAssignTarget(lead)
        setIsAssignOpen(true)
    }

    const handleAssignConfirm = (owner: string, note?: string) => {
        if (!assignTarget) return
        setLeads(prev => prev.map(l => l.id === assignTarget.id
            ? { ...l, ownerName: owner, type: owner === "Unassigned" ? "Unassigned" : l.type === "Unassigned" ? "SLA Breach" : l.type }
            : l
        ))
        toast({
            title: "Lead reassigned",
            description: `${assignTarget.name} → ${owner}${note ? ` · ${note}` : ""}`,
        })
        setIsAssignOpen(false)
        setAssignTarget(null)
    }

    const handleNoteClick = (lead: InboxLead) => {
        setNoteTarget(lead)
        setNoteText("")
        setNoteError(null)
        setNoteTouched(false)
        setIsNoteOpen(true)
    }

    const handleNoteSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const err = validateField("note", noteText) ?? (noteText.trim() === "" ? "Note cannot be empty" : null)
        setNoteTouched(true)
        if (err) {
            setNoteError(err)
            toast({ title: "Cannot save note", description: err, variant: "destructive" })
            return
        }
        if (noteTarget) {
            setLeads(prev => prev.map(l => l.id === noteTarget.id
                ? { ...l, notes: [...(l.notes ?? []), noteText.trim()] }
                : l
            ))
            toast({ title: "Note added", description: `to ${noteTarget.name}` })
        }
        setIsNoteOpen(false)
        setNoteTarget(null)
        setNoteText("")
    }

    const handleViewProfile = (lead: InboxLead) => {
        openEdit(lead)
    }

    const handleArchive = (lead: InboxLead) => {
        setLeads(prev => prev.filter(l => l.id !== lead.id))
        toast({ title: "Archived", description: `${lead.name} moved to archive.` })
    }

    const handleMarkTrash = (lead: InboxLead) => {
        setDeleteTarget(lead)
        setIsDeleteOpen(true)
    }

    const confirmDelete = () => {
        if (!deleteTarget) return
        setLeads(prev => prev.filter(l => l.id !== deleteTarget.id))
        toast({ title: "Lead deleted", description: deleteTarget.name })
        setIsDeleteOpen(false)
        setDeleteTarget(null)
    }

    return (
        <div className="space-y-6" style={{ zoom: 0.9 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Inbox className="h-6 w-6 text-orange-500" />
                        Lead Inbox
                    </h1>
                    <p className="text-sm text-slate-500">Leads requiring immediate attention and intervention.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => router.push('/lead-management/inbox/new')}
                        variant="outline"
                        size="sm"
                        className="h-9 rounded-none border-slate-200 text-slate-700 font-semibold"
                    >
                        <FileText className="h-4 w-4 mr-1.5" /> All Categories
                    </Button>
                    <Button
                        onClick={openCreate}
                        size="sm"
                        className="h-9 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                        <Plus className="h-4 w-4 mr-1.5" /> New Lead
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 bg-white p-2 rounded-none shadow-sm border border-slate-100">
                <div className="flex items-center gap-2">
                    {FILTERS.map((item) => (
                        <Button
                            key={item}
                            variant={filter === item ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setFilter(item)}
                            className={`rounded-none ${filter === item ? "bg-indigo-600 hover:bg-indigo-700 shadow-sm text-white" : "text-slate-500"}`}
                        >
                            {item}
                            <Badge className="ml-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-none" variant="secondary">
                                {counts[item as keyof typeof counts]}
                            </Badge>
                        </Button>
                    ))}
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Find a lead..."
                        className="pl-8 h-9 rounded-none border-slate-200 focus:ring-indigo-500"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {visible.length === 0 ? (
                    <Card className="rounded-none border-none shadow-sm bg-white">
                        <CardContent className="p-10 text-center">
                            <Inbox className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                            <p className="text-[14px] font-semibold text-slate-700">No leads match the current view</p>
                            <p className="text-[12px] text-slate-500 mt-1">Try a different filter or clear the search.</p>
                        </CardContent>
                    </Card>
                ) : (
                    visible.map((lead) => (
                        <Card key={lead.id} className="rounded-none border-none shadow-sm hover:shadow-md transition-all group">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-none flex items-center justify-center font-bold text-sm ${
                                            lead.type === 'SLA Breach' ? 'bg-rose-100 text-rose-600' :
                                            lead.type === 'Unassigned' ? 'bg-blue-100 text-blue-600' :
                                            'bg-amber-100 text-amber-600'
                                        }`}>
                                            {lead.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-slate-900">{lead.name}</h3>
                                                <Badge variant="outline" className={`text-[10px] rounded-none ${
                                                    lead.priority === 'Critical' ? 'border-rose-200 text-rose-600 bg-rose-50' : 'border-slate-200'
                                                }`}>
                                                    {lead.priority}
                                                </Badge>
                                                {lead.ownerName && lead.ownerName !== "Unassigned" && (
                                                    <Badge variant="outline" className="text-[10px] rounded-none border-emerald-200 text-emerald-700 bg-emerald-50">
                                                        {lead.ownerName}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500">{lead.company}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-slate-700 flex items-center justify-end gap-1">
                                                <Clock className="h-3 w-3" /> {lead.time}
                                            </p>
                                            <p className={`text-[10px] font-medium ${
                                                lead.type === 'SLA Breach' ? 'text-rose-500' : 'text-slate-400'
                                            }`}>
                                                {lead.type}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAssignClick(lead)}
                                                className="h-8 text-xs rounded-none border-indigo-100 text-indigo-600 hover:bg-indigo-50"
                                            >
                                                <UserPlus className="h-3.5 w-3.5 mr-1" /> Assign
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleNoteClick(lead)}
                                                className="h-8 text-xs rounded-none border-slate-100 text-slate-600 hover:bg-slate-50"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5 mr-1" /> Note
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                        <MoreVertical className="h-4 w-4 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none">
                                                    <DropdownMenuItem onClick={() => handleViewProfile(lead)} className="rounded-none cursor-pointer">View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEdit(lead)} className="rounded-none cursor-pointer">Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleArchive(lead)} className="rounded-none cursor-pointer">Archive</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleMarkTrash(lead)} className="rounded-none cursor-pointer text-rose-600">
                                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Side-slide forms */}
            <LeadSideForm
                open={isFormOpen}
                onOpenChange={(o) => { setIsFormOpen(o); if (!o) setEditingLead(null) }}
                initialData={editingLead ? {
                    id: String(editingLead.id),
                    name: editingLead.name,
                    email: editingLead.email ?? "",
                    company: editingLead.company,
                    source: "Direct",
                    score: editingLead.score,
                    status: "Active",
                    stage: "Discovery",
                    lastActivity: editingLead.time,
                    value: "",
                    ownerName: editingLead.ownerName ?? "Unassigned",
                    slaStatus: 'healthy',
                    tags: [],
                } as any : null}
                onSubmit={handleSubmitLead}
            />

            <MoveOwnerSide
                open={isAssignOpen}
                onOpenChange={(o) => { setIsAssignOpen(o); if (!o) setAssignTarget(null) }}
                onConfirm={handleAssignConfirm}
                selectedCount={1}
            />

            <SideFormSheet
                open={isNoteOpen}
                onOpenChange={(o) => { setIsNoteOpen(o); if (!o) { setNoteTarget(null); setNoteText(""); setNoteError(null); setNoteTouched(false) } }}
                title="Add Note"
                description={noteTarget ? `Add a quick note to ${noteTarget.name}'s record.` : "Add a quick note."}
                icon={<MessageSquare className="w-5 h-5" />}
                onSubmit={handleNoteSubmit}
                submitLabel="Save Note"
                width="md"
                accentColor="#0ea5e9"
            >
                <Field
                    label="Note"
                    required
                    error={noteTouched ? noteError ?? undefined : undefined}
                    hint="Max 500 characters"
                >
                    <Textarea
                        value={noteText}
                        onChange={(e) => {
                            setNoteText(e.target.value)
                            if (noteTouched) {
                                const err = validateField("note", e.target.value) ?? (e.target.value.trim() === "" ? "Note cannot be empty" : null)
                                setNoteError(err)
                            }
                        }}
                        onBlur={() => {
                            setNoteTouched(true)
                            setNoteError(validateField("note", noteText) ?? (noteText.trim() === "" ? "Note cannot be empty" : null))
                        }}
                        placeholder="Decision-maker engaged on call. Asked for pricing comparison."
                        rows={5}
                        className="rounded-none border-[#E5E7EB] text-[13px]"
                    />
                </Field>
            </SideFormSheet>

            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setDeleteTarget(null) }}
                onConfirm={confirmDelete}
                title="Delete this lead?"
                description="This action cannot be undone. The lead and all activity history will be permanently removed."
                itemName={deleteTarget?.name}
            />
        </div>
    )
}
