"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import {
    Search,
    ChevronRight,
    Clock,
    X,
    Filter,
    AlertCircle,
    FileText,
    FolderOpen,
    MessageSquare,
    User,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"

type SearchScope = "all" | "issues" | "projects" | "people" | "comments"

const MOCK_PEOPLE = [
    { id: "u1", name: "John Doe", email: "john@fixl.com", role: "Developer", avatar: "https://i.pravatar.cc/150?u=u1" },
    { id: "u2", name: "Jane Smith", email: "jane@fixl.com", role: "Designer", avatar: "https://i.pravatar.cc/150?u=u2" },
    { id: "u3", name: "Alex Johnson", email: "alex@fixl.com", role: "PM", avatar: "https://i.pravatar.cc/150?u=u3" },
    { id: "u4", name: "Emily Davis", email: "emily@fixl.com", role: "QA Lead", avatar: "https://i.pravatar.cc/150?u=u4" },
]

const MOCK_COMMENTS = [
    { id: "c1", issueId: "ISSUE-01", issueKey: "ISSUE-01", text: "Added JWT validation for all API endpoints", author: "John Doe", createdAt: "2026-03-28" },
    { id: "c2", issueId: "ISSUE-02", issueKey: "ISSUE-02", text: "Responsive breakpoints need testing on iPad Pro", author: "Jane Smith", createdAt: "2026-03-29" },
    { id: "c3", issueId: "ISSUE-03", issueKey: "ISSUE-03", text: "Z-index fix applied, need to verify with modal open", author: "Alex Johnson", createdAt: "2026-03-30" },
    { id: "c4", issueId: "ISSUE-01", issueKey: "ISSUE-01", text: "Auth middleware is now passing all integration tests", author: "Emily Davis", createdAt: "2026-04-01" },
]

const STATUS_COLORS: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-600",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    IN_REVIEW: "bg-purple-100 text-purple-700",
    DONE: "bg-green-100 text-green-700",
    BACKLOG: "bg-zinc-100 text-zinc-500",
}

const PRIORITY_COLORS: Record<string, string> = {
    URGENT: "bg-red-100 text-red-700",
    HIGH: "bg-orange-100 text-orange-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-zinc-100 text-zinc-600",
}

export default function SearchPage() {
    const params = useParams()
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()

    const [query, setQuery] = useState("")
    const [scope, setScope] = useState<SearchScope>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [priorityFilter, setPriorityFilter] = useState<string>("all")
    const [projectFilter, setProjectFilter] = useState<string>("all")
    const [recentSearches, setRecentSearches] = useState<string[]>(["auth middleware", "responsive", "sprint 24", "z-index", "mobile"])
    const [jumpToKey, setJumpToKey] = useState("")

    const addToRecent = useCallback((term: string) => {
        if (!term.trim()) return
        setRecentSearches(prev => {
            const filtered = prev.filter(s => s !== term)
            return [term, ...filtered].slice(0, 5)
        })
    }, [])

    const handleSearch = (value: string) => {
        setQuery(value)
        if (value.length > 2) {
            addToRecent(value)
        }
    }

    const handleJumpToIssue = () => {
        const found = issues.find(i => i.id.toLowerCase() === jumpToKey.trim().toLowerCase())
        if (found) {
            toast.success(`Found: ${found.title}`)
            setQuery(found.title)
            setScope("issues")
        } else {
            toast.error(`Issue "${jumpToKey}" not found`)
        }
        setJumpToKey("")
    }

    const lowerQuery = query.toLowerCase()

    const filteredIssues = useMemo(() => {
        if (!lowerQuery) return []
        let result = issues.filter(i =>
            i.title.toLowerCase().includes(lowerQuery) ||
            i.id.toLowerCase().includes(lowerQuery) ||
            i.description.toLowerCase().includes(lowerQuery)
        )
        if (statusFilter !== "all") result = result.filter(i => i.status === statusFilter)
        if (priorityFilter !== "all") result = result.filter(i => i.priority === priorityFilter)
        if (projectFilter !== "all") result = result.filter(i => i.projectId === projectFilter)
        return result
    }, [issues, lowerQuery, statusFilter, priorityFilter, projectFilter])

    const filteredProjects = useMemo(() => {
        if (!lowerQuery) return []
        return projects.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.key.toLowerCase().includes(lowerQuery) ||
            (p.description || "").toLowerCase().includes(lowerQuery)
        )
    }, [projects, lowerQuery])

    const filteredPeople = useMemo(() => {
        if (!lowerQuery) return []
        return MOCK_PEOPLE.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.email.toLowerCase().includes(lowerQuery) ||
            p.role.toLowerCase().includes(lowerQuery)
        )
    }, [lowerQuery])

    const filteredComments = useMemo(() => {
        if (!lowerQuery) return []
        return MOCK_COMMENTS.filter(c =>
            c.text.toLowerCase().includes(lowerQuery) ||
            c.author.toLowerCase().includes(lowerQuery) ||
            c.issueKey.toLowerCase().includes(lowerQuery)
        )
    }, [lowerQuery])

    const totalResults = filteredIssues.length + filteredProjects.length + filteredPeople.length + filteredComments.length

    const showIssues = scope === "all" || scope === "issues"
    const showProjects = scope === "all" || scope === "projects"
    const showPeople = scope === "all" || scope === "people"
    const showComments = scope === "all" || scope === "comments"

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* BREADCRUMB */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-zinc-600">SEARCH</span>
                </div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Global Search</h1>
            </div>

            {/* SEARCH BAR */}
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        className="h-11 pl-10 text-sm border-zinc-300 focus-visible:ring-indigo-500"
                        placeholder="Search issues, projects, people, comments..."
                        value={query}
                        onChange={e => handleSearch(e.target.value)}
                        autoFocus
                    />
                    {query && (
                        <Button
                            variant="ghost"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => setQuery("")}
                        >
                            <X className="h-3.5 w-3.5 text-zinc-400" />
                        </Button>
                    )}
                </div>

                {/* SCOPE & FILTERS */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex gap-1">
                        {(["all", "issues", "projects", "people", "comments"] as SearchScope[]).map(s => (
                            <Button
                                key={s}
                                variant={scope === s ? "default" : "outline"}
                                className={`h-7 rounded-md text-[10px] font-medium px-2.5 active:scale-95 capitalize ${scope === s ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                                onClick={() => setScope(s)}
                            >
                                {s}
                                {query && s === "issues" && <Badge className="ml-1 h-4 text-[9px] bg-indigo-100 text-indigo-700">{filteredIssues.length}</Badge>}
                                {query && s === "projects" && <Badge className="ml-1 h-4 text-[9px] bg-indigo-100 text-indigo-700">{filteredProjects.length}</Badge>}
                                {query && s === "people" && <Badge className="ml-1 h-4 text-[9px] bg-indigo-100 text-indigo-700">{filteredPeople.length}</Badge>}
                                {query && s === "comments" && <Badge className="ml-1 h-4 text-[9px] bg-indigo-100 text-indigo-700">{filteredComments.length}</Badge>}
                            </Button>
                        ))}
                    </div>
                    <div className="h-4 w-px bg-zinc-200 mx-1" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-7 w-[120px] text-[10px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="TODO">Todo</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="IN_REVIEW">In Review</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                            <SelectItem value="BACKLOG">Backlog</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger className="h-7 w-[120px] text-[10px]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priorities</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                        <SelectTrigger className="h-7 w-[130px] text-[10px]">
                            <SelectValue placeholder="Project" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projects.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* JUMP TO ISSUE */}
            <SmallCard>
                <SmallCardContent className="flex items-center gap-2 py-2">
                    <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-500">Jump to issue:</span>
                    <Input
                        className="h-7 w-[160px] text-xs"
                        placeholder="e.g. ISSUE-01"
                        value={jumpToKey}
                        onChange={e => setJumpToKey(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleJumpToIssue()}
                    />
                    <Button
                        className="h-7 rounded-md text-[10px] font-medium px-2.5 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={handleJumpToIssue}
                        disabled={!jumpToKey.trim()}
                    >
                        Go
                    </Button>
                </SmallCardContent>
            </SmallCard>

            {/* RECENT SEARCHES (when no query) */}
            {!query && (
                <SmallCard>
                    <SmallCardHeader>
                        <span className="text-xs font-medium text-zinc-900">Recent Searches</span>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((term, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    className="h-7 rounded-md text-[10px] font-medium px-2.5 active:scale-95"
                                    onClick={() => { setQuery(term); addToRecent(term) }}
                                >
                                    <Clock className="h-3 w-3 mr-1 text-zinc-400" />
                                    {term}
                                </Button>
                            ))}
                            {recentSearches.length > 0 && (
                                <Button
                                    variant="ghost"
                                    className="h-7 text-[10px] text-zinc-400 px-2"
                                    onClick={() => setRecentSearches([])}
                                >
                                    Clear all
                                </Button>
                            )}
                        </div>
                    </SmallCardContent>
                </SmallCard>
            )}

            {/* SEARCH RESULTS */}
            {query && (
                <div className="flex flex-col gap-4">
                    <div className="text-xs text-zinc-500">
                        {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;{query}&quot;
                    </div>

                    {/* ISSUES */}
                    {showIssues && filteredIssues.length > 0 && (
                        <SmallCard>
                            <SmallCardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-3.5 w-3.5 text-zinc-400" />
                                    <span className="text-xs font-medium text-zinc-900">Issues</span>
                                    <Badge variant="outline" className="text-[10px]">{filteredIssues.length}</Badge>
                                </div>
                            </SmallCardHeader>
                            <SmallCardContent>
                                <div className="flex flex-col divide-y">
                                    {filteredIssues.map(issue => (
                                        <div key={issue.id} className="flex items-center gap-3 py-2 hover:bg-zinc-50 px-1 rounded cursor-pointer">
                                            <span className="text-[10px] font-mono text-zinc-400 w-[70px]">{issue.id}</span>
                                            <span className="text-xs font-medium text-zinc-900 flex-1">{issue.title}</span>
                                            <Badge className={`text-[9px] ${STATUS_COLORS[issue.status] || "bg-zinc-100 text-zinc-600"}`}>{issue.status.replace("_", " ")}</Badge>
                                            <Badge className={`text-[9px] ${PRIORITY_COLORS[issue.priority] || ""}`}>{issue.priority}</Badge>
                                            <span className="text-[10px] text-zinc-400">{projects.find(p => p.id === issue.projectId)?.name || ""}</span>
                                        </div>
                                    ))}
                                </div>
                            </SmallCardContent>
                        </SmallCard>
                    )}

                    {/* PROJECTS */}
                    {showProjects && filteredProjects.length > 0 && (
                        <SmallCard>
                            <SmallCardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FolderOpen className="h-3.5 w-3.5 text-zinc-400" />
                                    <span className="text-xs font-medium text-zinc-900">Projects</span>
                                    <Badge variant="outline" className="text-[10px]">{filteredProjects.length}</Badge>
                                </div>
                            </SmallCardHeader>
                            <SmallCardContent>
                                <div className="flex flex-col divide-y">
                                    {filteredProjects.map(project => (
                                        <div key={project.id} className="flex items-center gap-3 py-2 hover:bg-zinc-50 px-1 rounded cursor-pointer">
                                            <span className="text-lg">{project.icon}</span>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-xs font-medium text-zinc-900">{project.name}</span>
                                                <span className="text-[10px] text-zinc-400">{project.description || `${project.category} - ${project.methodology}`}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">{project.key}</Badge>
                                            <Badge className={`text-[9px] ${project.status === "Active" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>{project.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </SmallCardContent>
                        </SmallCard>
                    )}

                    {/* PEOPLE */}
                    {showPeople && filteredPeople.length > 0 && (
                        <SmallCard>
                            <SmallCardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5 text-zinc-400" />
                                    <span className="text-xs font-medium text-zinc-900">People</span>
                                    <Badge variant="outline" className="text-[10px]">{filteredPeople.length}</Badge>
                                </div>
                            </SmallCardHeader>
                            <SmallCardContent>
                                <div className="flex flex-col divide-y">
                                    {filteredPeople.map(person => (
                                        <div key={person.id} className="flex items-center gap-3 py-2 hover:bg-zinc-50 px-1 rounded cursor-pointer">
                                            <img src={person.avatar} alt={person.name} className="h-7 w-7 rounded-full" />
                                            <div className="flex flex-col flex-1">
                                                <span className="text-xs font-medium text-zinc-900">{person.name}</span>
                                                <span className="text-[10px] text-zinc-400">{person.email}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">{person.role}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </SmallCardContent>
                        </SmallCard>
                    )}

                    {/* COMMENTS */}
                    {showComments && filteredComments.length > 0 && (
                        <SmallCard>
                            <SmallCardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />
                                    <span className="text-xs font-medium text-zinc-900">Comments</span>
                                    <Badge variant="outline" className="text-[10px]">{filteredComments.length}</Badge>
                                </div>
                            </SmallCardHeader>
                            <SmallCardContent>
                                <div className="flex flex-col divide-y">
                                    {filteredComments.map(comment => (
                                        <div key={comment.id} className="flex flex-col gap-1 py-2 hover:bg-zinc-50 px-1 rounded cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono text-zinc-400">{comment.issueKey}</span>
                                                <span className="text-[10px] text-zinc-400">by {comment.author}</span>
                                                <span className="text-[10px] text-zinc-300 ml-auto">{comment.createdAt}</span>
                                            </div>
                                            <span className="text-xs text-zinc-700">{comment.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </SmallCardContent>
                        </SmallCard>
                    )}

                    {/* NO RESULTS */}
                    {totalResults === 0 && (
                        <div className="text-center py-12">
                            <Search className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
                            <p className="text-sm text-zinc-500">No results found for &quot;{query}&quot;</p>
                            <p className="text-xs text-zinc-400 mt-1">Try different keywords or adjust filters</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
