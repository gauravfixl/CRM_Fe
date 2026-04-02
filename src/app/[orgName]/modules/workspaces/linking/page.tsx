"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Link2, Plus, Trash2, ArrowRight, Search, AlertTriangle,
    Shield, GitBranch, Copy, Eye, X, Filter, MoreHorizontal,
    ArrowRightLeft, Ban, CheckCircle2, Circle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, type Issue } from "@/shared/data/issue-store"
import { useIssueLinkStore, type IssueLink, type LinkType } from "@/shared/data/issue-link-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

const linkTypeBadge: Record<string, string> = {
    blocks: "bg-red-100 text-red-700",
    is_blocked_by: "bg-orange-100 text-orange-700",
    relates_to: "bg-blue-100 text-blue-700",
    duplicates: "bg-purple-100 text-purple-700",
    is_duplicated_by: "bg-purple-100 text-purple-700",
    clones: "bg-teal-100 text-teal-700",
}

const linkTypeLabels: Record<string, string> = {
    blocks: "Blocks",
    is_blocked_by: "Is Blocked By",
    relates_to: "Relates To",
    duplicates: "Duplicates",
    is_duplicated_by: "Is Duplicated By",
    clones: "Clones",
}

const statusColors: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600", IN_PROGRESS: "bg-blue-100 text-blue-700",
    DONE: "bg-green-100 text-green-700", BACKLOG: "bg-zinc-50 text-zinc-500",
    BLOCKED: "bg-red-100 text-red-600",
}

export default function LinkingPage() {
    const params = useParams()
    const { issues } = useIssueStore()
    const { links, addLink, deleteLink } = useIssueLinkStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [filterType, setFilterType] = useState<string>("all")
    const [sourceSearch, setSourceSearch] = useState("")
    const [targetSearch, setTargetSearch] = useState("")
    const [selectedSource, setSelectedSource] = useState<Issue | null>(null)
    const [selectedTarget, setSelectedTarget] = useState<Issue | null>(null)
    const [newLinkType, setNewLinkType] = useState<LinkType>("blocks")
    const [showSourceDropdown, setShowSourceDropdown] = useState(false)
    const [showTargetDropdown, setShowTargetDropdown] = useState(false)

    const workspaceProjects = useMemo(() =>
        projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId),
        [projects, activeWorkspaceId]
    )

    useEffect(() => {
        if (!selectedProjectId && workspaceProjects.length > 0) {
            setSelectedProjectId(workspaceProjects[0].id)
        }
    }, [workspaceProjects, selectedProjectId])

    const projectIssues = issues.filter(i => i.projectId === selectedProjectId)

    const filteredLinks = useMemo(() => {
        if (filterType === "all") return links
        return links.filter(l => l.linkType === filterType)
    }, [links, filterType])

    const blockedIssues = useMemo(() => {
        const blockedLinks = links.filter(l => l.linkType === "is_blocked_by")
        return blockedLinks.map(l => {
            const blocked = projectIssues.find(i => i.id === l.sourceIssueId)
            const blocker = projectIssues.find(i => i.id === l.targetIssueId)
            return { link: l, blocked, blocker }
        }).filter(x => x.blocked && x.blocker && x.blocker.status !== "DONE")
    }, [links, projectIssues])

    const blockingIssues = useMemo(() => {
        const blockingLinks = links.filter(l => l.linkType === "blocks")
        return blockingLinks.map(l => {
            const blocker = projectIssues.find(i => i.id === l.sourceIssueId)
            const blocked = projectIssues.find(i => i.id === l.targetIssueId)
            return { link: l, blocker, blocked }
        }).filter(x => x.blocker && x.blocked)
    }, [links, projectIssues])

    const totalLinks = links.length
    const blockedCount = links.filter(l => l.linkType === "is_blocked_by").length
    const blockingCount = links.filter(l => l.linkType === "blocks").length
    const relatedCount = links.filter(l => l.linkType === "relates_to").length

    const handleCreateLink = () => {
        if (!selectedSource || !selectedTarget) { toast.error("Select both source and target issues"); return }
        if (selectedSource.id === selectedTarget.id) { toast.error("Cannot link an issue to itself"); return }
        const existing = links.find(l => l.sourceIssueId === selectedSource.id && l.targetIssueId === selectedTarget.id && l.linkType === newLinkType)
        if (existing) { toast.error("This link already exists"); return }
        addLink({
            id: `link-${Date.now()}`,
            sourceIssueId: selectedSource.id,
            sourceIssueTitle: selectedSource.title,
            targetIssueId: selectedTarget.id,
            targetIssueTitle: selectedTarget.title,
            linkType: newLinkType,
            createdBy: "Current User",
            createdAt: new Date().toISOString(),
        })
        toast.success("Link created successfully")
        setSelectedSource(null); setSelectedTarget(null); setSourceSearch(""); setTargetSearch("")
        setShowCreateDialog(false)
    }

    const handleDeleteLink = (linkId: string) => {
        deleteLink(linkId)
        toast.success("Link deleted")
    }

    const sourceResults = projectIssues.filter(i => i.title.toLowerCase().includes(sourceSearch.toLowerCase()) || i.id.toLowerCase().includes(sourceSearch.toLowerCase())).slice(0, 6)
    const targetResults = projectIssues.filter(i => i.title.toLowerCase().includes(targetSearch.toLowerCase()) || i.id.toLowerCase().includes(targetSearch.toLowerCase())).slice(0, 6)

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 space-y-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Projects</span>
                <span className="text-[10px] text-zinc-300">/</span>
                <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wide">Dependencies</span>
            </div>

            {/* Project Selector */}
            <div className="flex items-center gap-2">
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger className="h-8 w-48 rounded-md border-zinc-200 text-xs font-medium">
                        <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                    <SelectContent>
                        {workspaceProjects.map(p => (
                            <SelectItem key={p.id} value={p.id} className="text-xs">{p.icon} {p.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Issue Dependencies</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Manage links and dependencies between issues</p>
                </div>
                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Link
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><Link2 className="w-4 h-4 text-indigo-500" /><span className="text-xs font-medium text-zinc-500">Total Links</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{totalLinks}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><Ban className="w-4 h-4 text-red-500" /><span className="text-xs font-medium text-zinc-500">Blocked Issues</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{blockedCount}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><Shield className="w-4 h-4 text-orange-500" /><span className="text-xs font-medium text-zinc-500">Blocking Issues</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{blockingCount}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><ArrowRightLeft className="w-4 h-4 text-blue-500" /><span className="text-xs font-medium text-zinc-500">Related</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{relatedCount}</span></SmallCardContent></SmallCard>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="h-8 w-[160px] text-xs"><SelectValue placeholder="Filter by type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Link Types</SelectItem>
                        {Object.entries(linkTypeLabels).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>

            {/* Links Table */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50">
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Source Issue</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Link Type</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Target Issue</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Created</TableHead>
                            <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLinks.map(link => (
                            <TableRow key={link.id} className="hover:bg-zinc-50">
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-zinc-400">{link.sourceIssueId}</span>
                                        <span className="text-xs text-zinc-700">{link.sourceIssueTitle}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`text-[9px] h-5 ${linkTypeBadge[link.linkType] || "bg-zinc-100 text-zinc-600"}`}>
                                        {linkTypeLabels[link.linkType] || link.linkType}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-zinc-400">{link.targetIssueId}</span>
                                        <span className="text-xs text-zinc-700">{link.targetIssueTitle}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-xs text-zinc-500">{new Date(link.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 hover:text-red-600" onClick={() => handleDeleteLink(link.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredLinks.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="text-center text-xs text-zinc-400 py-8">No links found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dependency Visualization */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-zinc-900 mb-4">Dependency Visualization</h2>
                <div className="flex gap-6">
                    {/* Blocked column */}
                    <div className="flex-1">
                        <h3 className="text-[11px] font-semibold text-red-600 uppercase mb-3 flex items-center gap-1.5">
                            <Ban className="w-3.5 h-3.5" /> Blocked Issues
                        </h3>
                        <div className="space-y-2">
                            {blockedIssues.map(({ link, blocked }) => blocked && (
                                <div key={link.id} className="border border-red-200 rounded-lg p-3 bg-red-50/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-red-400">{blocked.id}</span>
                                        <span className="text-xs font-medium text-zinc-800">{blocked.title}</span>
                                    </div>
                                    <Badge className={`text-[9px] h-4 mt-1.5 ${statusColors[blocked.status] || "bg-zinc-100"}`}>{blocked.status.replace(/_/g, " ")}</Badge>
                                </div>
                            ))}
                            {blockedIssues.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No blocked issues</p>}
                        </div>
                    </div>

                    {/* SVG Arrows */}
                    <div className="w-16 flex items-center justify-center relative">
                        <svg className="w-full" style={{ height: Math.max(100, Math.max(blockedIssues.length, blockingIssues.length) * 70) }}>
                            {blockedIssues.map((_, idx) => {
                                const fromY = idx * 70 + 30
                                const toIdx = Math.min(idx, blockingIssues.length - 1)
                                const toY = toIdx * 70 + 30
                                if (blockingIssues.length === 0) return null
                                return (
                                    <g key={idx}>
                                        <line x1="0" y1={fromY} x2="64" y2={toY} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#depArrow)" />
                                    </g>
                                )
                            })}
                            <defs>
                                <marker id="depArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                                    <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
                                </marker>
                            </defs>
                        </svg>
                    </div>

                    {/* Blocking column */}
                    <div className="flex-1">
                        <h3 className="text-[11px] font-semibold text-orange-600 uppercase mb-3 flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" /> Blocking Issues
                        </h3>
                        <div className="space-y-2">
                            {blockingIssues.map(({ link, blocker }) => blocker && (
                                <div key={link.id} className="border border-orange-200 rounded-lg p-3 bg-orange-50/50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-orange-400">{blocker.id}</span>
                                        <span className="text-xs font-medium text-zinc-800">{blocker.title}</span>
                                    </div>
                                    <Badge className={`text-[9px] h-4 mt-1.5 ${statusColors[blocker.status] || "bg-zinc-100"}`}>{blocker.status.replace(/_/g, " ")}</Badge>
                                </div>
                            ))}
                            {blockingIssues.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No blocking issues</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actively Blocked Section */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-5">
                <h2 className="text-sm font-semibold text-zinc-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> Actively Blocked Issues
                </h2>
                <p className="text-xs text-zinc-500 mb-3">Issues blocked by dependencies that are not yet completed</p>
                <div className="space-y-2">
                    {blockedIssues.map(({ link, blocked, blocker }) => blocked && blocker && (
                        <div key={link.id} className="flex items-center gap-3 p-3 bg-red-50/30 border border-red-100 rounded-lg">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-zinc-400">{blocked.id}</span>
                                    <span className="text-xs font-medium text-zinc-800">{blocked.title}</span>
                                </div>
                                <span className="text-[10px] text-zinc-400">Blocked by: {blocker.id} — {blocker.title}</span>
                            </div>
                            <Badge className={`text-[9px] h-4 ${statusColors[blocker.status] || "bg-zinc-100"}`}>{blocker.status.replace(/_/g, " ")}</Badge>
                        </div>
                    ))}
                    {blockedIssues.length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No actively blocked issues</p>}
                </div>
            </div>

            {/* Create Link Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={(open) => { setShowCreateDialog(open); if (!open) { setSelectedSource(null); setSelectedTarget(null); setSourceSearch(""); setTargetSearch("") } }}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900">Create Issue Link</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Define a dependency between two issues</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        {/* Source */}
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Source Issue</label>
                            {selectedSource ? (
                                <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-md border">
                                    <span className="text-[10px] font-mono text-zinc-400">{selectedSource.id}</span>
                                    <span className="text-xs text-zinc-700 flex-1">{selectedSource.title}</span>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => { setSelectedSource(null); setSourceSearch("") }}><X className="w-3 h-3" /></Button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400" />
                                    <Input className="h-8 text-xs pl-8" placeholder="Search issues..." value={sourceSearch}
                                        onChange={e => { setSourceSearch(e.target.value); setShowSourceDropdown(true) }}
                                        onFocus={() => setShowSourceDropdown(true)} />
                                    {showSourceDropdown && sourceSearch && (
                                        <div className="absolute z-50 top-9 left-0 right-0 bg-white border border-zinc-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                            {sourceResults.map(i => (
                                                <button key={i.id} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 text-left border-b border-zinc-50 last:border-0"
                                                    onClick={() => { setSelectedSource(i); setSourceSearch(""); setShowSourceDropdown(false) }}>
                                                    <span className="text-[10px] font-mono text-zinc-400">{i.id}</span>
                                                    <span className="text-xs text-zinc-700">{i.title}</span>
                                                </button>
                                            ))}
                                            {sourceResults.length === 0 && <div className="text-center text-xs text-zinc-400 py-3">No issues found</div>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Link Type */}
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Link Type</label>
                            <Select value={newLinkType} onValueChange={v => setNewLinkType(v as LinkType)}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(linkTypeLabels).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Target */}
                        <div>
                            <label className="text-xs font-medium text-zinc-500 block mb-1">Target Issue</label>
                            {selectedTarget ? (
                                <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-md border">
                                    <span className="text-[10px] font-mono text-zinc-400">{selectedTarget.id}</span>
                                    <span className="text-xs text-zinc-700 flex-1">{selectedTarget.title}</span>
                                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => { setSelectedTarget(null); setTargetSearch("") }}><X className="w-3 h-3" /></Button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400" />
                                    <Input className="h-8 text-xs pl-8" placeholder="Search issues..." value={targetSearch}
                                        onChange={e => { setTargetSearch(e.target.value); setShowTargetDropdown(true) }}
                                        onFocus={() => setShowTargetDropdown(true)} />
                                    {showTargetDropdown && targetSearch && (
                                        <div className="absolute z-50 top-9 left-0 right-0 bg-white border border-zinc-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                            {targetResults.map(i => (
                                                <button key={i.id} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 text-left border-b border-zinc-50 last:border-0"
                                                    onClick={() => { setSelectedTarget(i); setTargetSearch(""); setShowTargetDropdown(false) }}>
                                                    <span className="text-[10px] font-mono text-zinc-400">{i.id}</span>
                                                    <span className="text-xs text-zinc-700">{i.title}</span>
                                                </button>
                                            ))}
                                            {targetResults.length === 0 && <div className="text-center text-xs text-zinc-400 py-3">No issues found</div>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={handleCreateLink}>Create Link</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
