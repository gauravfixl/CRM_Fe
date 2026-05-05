"use client"

import React, { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import {
    Package, Plus, MoreHorizontal, Rocket, Archive, CheckCircle2,
    Clock, Trash2, Edit3, Eye, Calendar, AlertTriangle, FileText,
    ChevronDown, ChevronRight, X, Tag, ArrowRight, Unlink, Link2, Search
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
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore, type Issue } from "@/shared/data/issue-store"
import { useVersionStore, type Version, type VersionStatus } from "@/shared/data/version-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { Select as ProjectSelect, SelectContent as PSC, SelectItem as PSI, SelectTrigger as PST, SelectValue as PSV } from "@/components/ui/select"

const versionStatusBadge: Record<string, string> = {
    unreleased: "bg-yellow-100 text-yellow-700",
    released: "bg-green-100 text-green-700",
    archived: "bg-zinc-100 text-zinc-500",
}
const statusColors: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600", IN_PROGRESS: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-purple-100 text-purple-700", DONE: "bg-green-100 text-green-700",
    BACKLOG: "bg-zinc-50 text-zinc-500", BLOCKED: "bg-red-100 text-red-600",
}
const priorityColors: Record<string, string> = {
    URGENT: "bg-red-100 text-red-700", HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700", LOW: "bg-blue-100 text-blue-700",
}

export default function ReleasesPage() {
    const params = useParams()
    const { issues } = useIssueStore()
    const { versions, addVersion, updateVersion, deleteVersion, releaseVersion, archiveVersion, linkIssue, unlinkIssue, moveUnfinishedIssues } = useVersionStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const workspaceProjects = useMemo(() => projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId), [projects, activeWorkspaceId])
    React.useEffect(() => { if (!selectedProjectId && workspaceProjects.length > 0) setSelectedProjectId(workspaceProjects[0].id) }, [workspaceProjects, selectedProjectId])

    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState<Version | null>(null)
    const [showReleaseDialog, setShowReleaseDialog] = useState<string | null>(null)
    const [expandedVersion, setExpandedVersion] = useState<string | null>(null)
    const [showNotesDialog, setShowNotesDialog] = useState<string | null>(null)
    const [moveToVersionId, setMoveToVersionId] = useState<string>("none")
    const [issueSearchQuery, setIssueSearchQuery] = useState("")
    const [newVersion, setNewVersion] = useState({ name: "", description: "", startDate: "", releaseDate: "" })

    const projectVersions = versions.filter(v => v.projectId === selectedProjectId)
    const projectIssues = issues.filter(i => i.projectId === selectedProjectId)

    const getVersionIssues = (version: Version): Issue[] => {
        return version.issueIds.map(id => projectIssues.find(i => i.id === id)).filter(Boolean) as Issue[]
    }

    const getIssueCounts = (version: Version) => {
        const vIssues = getVersionIssues(version)
        return {
            todo: vIssues.filter(i => ["TODO", "BACKLOG"].includes(i.status)).length,
            inProgress: vIssues.filter(i => ["IN_PROGRESS", "IN_REVIEW", "TESTING"].includes(i.status)).length,
            done: vIssues.filter(i => i.status === "DONE").length,
            total: vIssues.length,
        }
    }

    const totalVersions = projectVersions.length
    const releasedCount = projectVersions.filter(v => v.status === "released").length
    const unreleasedCount = projectVersions.filter(v => v.status === "unreleased").length
    const issuesInUnreleased = projectVersions.filter(v => v.status === "unreleased").reduce((s, v) => s + v.issueIds.length, 0)

    const handleCreateVersion = () => {
        if (!newVersion.name.trim()) { toast.error("Version name is required"); return }
        addVersion({
            id: `ver-${Date.now()}`, projectId: selectedProjectId, name: newVersion.name,
            description: newVersion.description,
            startDate: newVersion.startDate ? new Date(newVersion.startDate).toISOString() : new Date().toISOString(),
            releaseDate: newVersion.releaseDate ? new Date(newVersion.releaseDate).toISOString() : "",
            status: "unreleased", issueIds: [],
        })
        toast.success("Version created")
        setNewVersion({ name: "", description: "", startDate: "", releaseDate: "" })
        setShowCreateDialog(false)
    }

    const handleUpdateVersion = () => {
        if (!showEditDialog) return
        updateVersion(showEditDialog.id, {
            name: showEditDialog.name, description: showEditDialog.description,
            startDate: showEditDialog.startDate, releaseDate: showEditDialog.releaseDate,
        })
        toast.success("Version updated")
        setShowEditDialog(null)
    }

    const handleReleaseVersion = (versionId: string) => {
        const version = projectVersions.find(v => v.id === versionId)
        if (!version) return
        const vIssues = getVersionIssues(version)
        const unfinished = vIssues.filter(i => i.status !== "DONE")
        if (unfinished.length > 0 && moveToVersionId !== "none") {
            moveUnfinishedIssues(versionId, moveToVersionId, unfinished.map(i => i.id))
        }
        releaseVersion(versionId)
        toast.success(`${version.name} released!`)
        setShowReleaseDialog(null)
        setMoveToVersionId("none")
    }

    const handleArchive = (versionId: string) => {
        archiveVersion(versionId)
        toast.success("Version archived")
    }

    const handleDelete = (versionId: string) => {
        deleteVersion(versionId)
        toast.success("Version deleted")
    }

    const handleLinkIssue = (versionId: string, issueId: string) => {
        linkIssue(versionId, issueId)
        toast.success("Issue linked to version")
        setIssueSearchQuery("")
    }

    const handleUnlinkIssue = (versionId: string, issueId: string) => {
        unlinkIssue(versionId, issueId)
        toast.success("Issue unlinked from version")
    }

    const generateReleaseNotes = (version: Version) => {
        const vIssues = getVersionIssues(version)
        const done = vIssues.filter(i => i.status === "DONE")
        const byType: Record<string, Issue[]> = {}
        done.forEach(i => {
            if (!byType[i.type]) byType[i.type] = []
            byType[i.type].push(i)
        })
        return byType
    }

    const releaseDialogVersion = projectVersions.find(v => v.id === showReleaseDialog)
    const releaseDialogUnfinished = releaseDialogVersion ? getVersionIssues(releaseDialogVersion).filter(i => i.status !== "DONE") : []
    const notesVersion = projectVersions.find(v => v.id === showNotesDialog)
    const notesData = notesVersion ? generateReleaseNotes(notesVersion) : {}
    const otherUnreleased = projectVersions.filter(v => v.status === "unreleased" && v.id !== showReleaseDialog)

    // Timeline bar data
    const timelineVersions = projectVersions.filter(v => v.startDate && v.releaseDate)
    const tMin = timelineVersions.length > 0 ? new Date(Math.min(...timelineVersions.map(v => new Date(v.startDate).getTime()))) : new Date()
    const tMax = timelineVersions.length > 0 ? new Date(Math.max(...timelineVersions.map(v => new Date(v.releaseDate).getTime()))) : new Date(Date.now() + 90 * 86400000)
    const tRange = Math.max(1, (tMax.getTime() - tMin.getTime()) / 86400000)

    const unlinkedIssues = projectIssues.filter(i => {
        const linked = projectVersions.some(v => v.issueIds.includes(i.id))
        return !linked && i.title.toLowerCase().includes(issueSearchQuery.toLowerCase())
    })

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 space-y-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">Projects</span>
                <span className="text-[10px] text-zinc-300">/</span>
                <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wide">Releases</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Versions & Releases</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">Plan, track, and release software versions</p>
                </div>
                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Version
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><Package className="w-4 h-4 text-indigo-500" /><span className="text-xs font-medium text-zinc-500">Total Versions</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{totalVersions}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-xs font-medium text-zinc-500">Released</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{releasedCount}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-500" /><span className="text-xs font-medium text-zinc-500">Unreleased</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{unreleasedCount}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><div className="flex items-center gap-2"><Tag className="w-4 h-4 text-orange-500" /><span className="text-xs font-medium text-zinc-500">Issues in Unreleased</span></div></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{issuesInUnreleased}</span></SmallCardContent></SmallCard>
            </div>

            {/* Version Cards */}
            <div className="space-y-3">
                {projectVersions.map(version => {
                    const counts = getIssueCounts(version)
                    const pctDone = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0
                    const isExpanded = expandedVersion === version.id
                    const vIssues = getVersionIssues(version)
                    return (
                        <div key={version.id} className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <button onClick={() => setExpandedVersion(isExpanded ? null : version.id)} className="shrink-0">
                                            {isExpanded ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
                                        </button>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-zinc-900">{version.name}</h3>
                                                <Badge className={`text-[9px] h-4 ${versionStatusBadge[version.status]}`}>{version.status}</Badge>
                                            </div>
                                            <p className="text-xs text-zinc-500 mt-0.5 truncate">{version.description || "No description"}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setShowEditDialog({ ...version })}><Edit3 className="w-3.5 h-3.5 mr-2" /> Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setShowNotesDialog(version.id)}><FileText className="w-3.5 h-3.5 mr-2" /> Release Notes</DropdownMenuItem>
                                            {version.status === "unreleased" && (
                                                <DropdownMenuItem onClick={() => setShowReleaseDialog(version.id)}><Rocket className="w-3.5 h-3.5 mr-2" /> Release</DropdownMenuItem>
                                            )}
                                            {version.status !== "archived" && (
                                                <DropdownMenuItem onClick={() => handleArchive(version.id)}><Archive className="w-3.5 h-3.5 mr-2" /> Archive</DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(version.id)}><Trash2 className="w-3.5 h-3.5 mr-2" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="mt-3 flex items-center gap-4">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between text-[10px] text-zinc-400">
                                            <span>Progress</span><span>{pctDone}%</span>
                                        </div>
                                        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pctDone}%` }} />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 text-[10px] shrink-0">
                                        <span className="text-zinc-400">To Do <span className="font-semibold text-zinc-600">{counts.todo}</span></span>
                                        <span className="text-zinc-400">In Progress <span className="font-semibold text-blue-600">{counts.inProgress}</span></span>
                                        <span className="text-zinc-400">Done <span className="font-semibold text-green-600">{counts.done}</span></span>
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center gap-3 text-[10px] text-zinc-400">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {version.startDate ? new Date(version.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No start"}</span>
                                    <ArrowRight className="w-3 h-3" />
                                    <span>{version.releaseDate ? new Date(version.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No release date"}</span>
                                </div>
                            </div>

                            {/* Expanded: Issue list */}
                            {isExpanded && (
                                <div className="border-t border-zinc-200">
                                    <div className="p-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xs font-semibold text-zinc-700">Issues ({vIssues.length})</h4>
                                        </div>
                                        <div className="border border-zinc-200 rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-zinc-50">
                                                        <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Key</TableHead>
                                                        <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Title</TableHead>
                                                        <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Status</TableHead>
                                                        <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Priority</TableHead>
                                                        <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Type</TableHead>
                                                        <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-8"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {vIssues.map(issue => (
                                                        <TableRow key={issue.id}>
                                                            <TableCell className="text-[10px] font-mono text-zinc-400">{issue.id}</TableCell>
                                                            <TableCell className="text-xs text-zinc-700">{issue.title}</TableCell>
                                                            <TableCell><Badge className={`text-[9px] h-4 ${statusColors[issue.status] || "bg-zinc-100"}`}>{issue.status.replace(/_/g, " ")}</Badge></TableCell>
                                                            <TableCell><Badge className={`text-[9px] h-4 ${priorityColors[issue.priority] || ""}`}>{issue.priority}</Badge></TableCell>
                                                            <TableCell className="text-xs text-zinc-500">{issue.type}</TableCell>
                                                            <TableCell>
                                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400 hover:text-red-600" onClick={() => handleUnlinkIssue(version.id, issue.id)}>
                                                                    <Unlink className="w-3 h-3" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {vIssues.length === 0 && (
                                                        <TableRow><TableCell colSpan={6} className="text-center text-xs text-zinc-400 py-4">No issues in this version</TableCell></TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Add issue to version */}
                                        <div className="mt-3">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400" />
                                                <Input className="h-8 text-xs pl-8" placeholder="Search issues to add..." value={issueSearchQuery} onChange={e => setIssueSearchQuery(e.target.value)} />
                                            </div>
                                            {issueSearchQuery && (
                                                <div className="mt-1 border border-zinc-200 rounded-lg max-h-32 overflow-y-auto">
                                                    {unlinkedIssues.slice(0, 6).map(i => (
                                                        <button key={i.id} className="w-full flex items-center justify-between px-3 py-2 hover:bg-zinc-50 text-left border-b border-zinc-50 last:border-0"
                                                            onClick={() => handleLinkIssue(version.id, i.id)}>
                                                            <span className="text-xs text-zinc-700">{i.id} — {i.title}</span>
                                                            <Link2 className="w-3 h-3 text-indigo-500" />
                                                        </button>
                                                    ))}
                                                    {unlinkedIssues.length === 0 && <div className="text-center text-xs text-zinc-400 py-2">No matching issues</div>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
                {projectVersions.length === 0 && (
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-12 text-center text-zinc-400 text-sm">No versions yet. Create one to get started.</div>
                )}
            </div>

            {/* Timeline Bar */}
            {timelineVersions.length > 0 && (
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-4">
                    <h2 className="text-sm font-semibold text-zinc-900 mb-3">Release Timeline</h2>
                    <div className="space-y-2">
                        {timelineVersions.map(v => {
                            const startPct = ((new Date(v.startDate).getTime() - tMin.getTime()) / (tRange * 86400000)) * 100
                            const endPct = ((new Date(v.releaseDate).getTime() - tMin.getTime()) / (tRange * 86400000)) * 100
                            const widthPct = Math.max(3, endPct - startPct)
                            const colors: Record<string, string> = { unreleased: "#eab308", released: "#22c55e", archived: "#a1a1aa" }
                            return (
                                <div key={v.id} className="flex items-center gap-3">
                                    <span className="text-[10px] text-zinc-500 w-36 truncate shrink-0">{v.name}</span>
                                    <div className="flex-1 h-5 bg-zinc-50 rounded relative">
                                        <div className="absolute top-0.5 bottom-0.5 rounded" style={{ left: `${startPct}%`, width: `${widthPct}%`, backgroundColor: colors[v.status] || "#a1a1aa", opacity: 0.7 }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] text-zinc-400">
                        <span>{tMin.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                        <span>{tMax.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                    </div>
                </div>
            )}

            {/* Create Version Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900">Create Version</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Define a new software version</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-2">
                        <div><label className="text-xs font-medium text-zinc-500 block mb-1">Name</label>
                            <Input className="h-8 text-xs" value={newVersion.name} onChange={e => setNewVersion(p => ({ ...p, name: e.target.value }))} placeholder="e.g. v3.0" /></div>
                        <div><label className="text-xs font-medium text-zinc-500 block mb-1">Description</label>
                            <Input className="h-8 text-xs" value={newVersion.description} onChange={e => setNewVersion(p => ({ ...p, description: e.target.value }))} placeholder="What's in this version?" /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Start Date</label>
                                <Input type="date" className="h-8 text-xs" value={newVersion.startDate} onChange={e => setNewVersion(p => ({ ...p, startDate: e.target.value }))} /></div>
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Release Date</label>
                                <Input type="date" className="h-8 text-xs" value={newVersion.releaseDate} onChange={e => setNewVersion(p => ({ ...p, releaseDate: e.target.value }))} /></div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={handleCreateVersion}>Create Version</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Version Dialog */}
            <Dialog open={!!showEditDialog} onOpenChange={() => setShowEditDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900">Edit Version</DialogTitle>
                    </DialogHeader>
                    {showEditDialog && (
                        <div className="space-y-3 mt-2">
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Name</label>
                                <Input className="h-8 text-xs" value={showEditDialog.name} onChange={e => setShowEditDialog(p => p ? { ...p, name: e.target.value } : p)} /></div>
                            <div><label className="text-xs font-medium text-zinc-500 block mb-1">Description</label>
                                <Input className="h-8 text-xs" value={showEditDialog.description} onChange={e => setShowEditDialog(p => p ? { ...p, description: e.target.value } : p)} /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-zinc-500 block mb-1">Start Date</label>
                                    <Input type="date" className="h-8 text-xs" value={showEditDialog.startDate ? showEditDialog.startDate.split("T")[0] : ""} onChange={e => setShowEditDialog(p => p ? { ...p, startDate: e.target.value ? new Date(e.target.value).toISOString() : "" } : p)} /></div>
                                <div><label className="text-xs font-medium text-zinc-500 block mb-1">Release Date</label>
                                    <Input type="date" className="h-8 text-xs" value={showEditDialog.releaseDate ? showEditDialog.releaseDate.split("T")[0] : ""} onChange={e => setShowEditDialog(p => p ? { ...p, releaseDate: e.target.value ? new Date(e.target.value).toISOString() : "" } : p)} /></div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowEditDialog(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={handleUpdateVersion}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Release Confirmation Dialog */}
            <Dialog open={!!showReleaseDialog} onOpenChange={() => setShowReleaseDialog(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                            <Rocket className="w-4 h-4 text-indigo-500" /> Release {releaseDialogVersion?.name}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">This will mark the version as released with today&apos;s date</DialogDescription>
                    </DialogHeader>
                    {releaseDialogVersion && (
                        <div className="space-y-3 mt-2">
                            {releaseDialogUnfinished.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />
                                        <span className="text-xs font-medium text-yellow-700">{releaseDialogUnfinished.length} unfinished issue{releaseDialogUnfinished.length > 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="space-y-1 mb-2">
                                        {releaseDialogUnfinished.slice(0, 5).map(i => (
                                            <div key={i.id} className="text-[10px] text-yellow-700 flex items-center gap-1.5">
                                                <span className="font-mono">{i.id}</span> {i.title}
                                            </div>
                                        ))}
                                    </div>
                                    <label className="text-xs font-medium text-zinc-500 block mb-1">Move unfinished issues to:</label>
                                    <Select value={moveToVersionId} onValueChange={setMoveToVersionId}>
                                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select version" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Don&apos;t move</SelectItem>
                                            {otherUnreleased.map(v => (<SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {releaseDialogUnfinished.length === 0 && (
                                <p className="text-xs text-green-600 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> All issues are completed!</p>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowReleaseDialog(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700" onClick={() => handleReleaseVersion(showReleaseDialog!)}>Release Now</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Release Notes Dialog */}
            <Dialog open={!!showNotesDialog} onOpenChange={() => setShowNotesDialog(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-500" /> Release Notes — {notesVersion?.name}
                        </DialogTitle>
                    </DialogHeader>
                    {notesVersion && (
                        <div className="space-y-3 mt-2">
                            {Object.keys(notesData).length === 0 && <p className="text-xs text-zinc-400 text-center py-4">No completed issues to generate notes from</p>}
                            {Object.entries(notesData).map(([type, typeIssues]) => (
                                <div key={type}>
                                    <h4 className="text-xs font-semibold text-zinc-700 mb-1.5">{type === "BUG" ? "Bug Fixes" : type === "STORY" ? "New Features" : type === "TASK" ? "Tasks" : type}</h4>
                                    <ul className="space-y-1">
                                        {typeIssues.map(i => (
                                            <li key={i.id} className="text-xs text-zinc-600 flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                                                <span className="font-mono text-[10px] text-zinc-400">{i.id}</span> {i.title}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" size="sm" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowNotesDialog(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
