"use client"

import React, { useState, useEffect } from "react"
import { Search, FileText, Folder, User, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useRouter } from "next/navigation"

interface GlobalSearchProps {
    isOpen: boolean
    onClose: () => void
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const [query, setQuery] = useState("")
    const router = useRouter()

    const { issues } = useIssueStore()
    const { projects } = useProjectStore()

    // Search results
    const searchIssues = query.trim()
        ? issues.filter(issue =>
            issue.name.toLowerCase().includes(query.toLowerCase()) ||
            issue.code.toLowerCase().includes(query.toLowerCase()) ||
            (issue.description && issue.description.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 5)
        : []

    const searchProjects = query.trim()
        ? projects.filter(project =>
            project.name.toLowerCase().includes(query.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(query.toLowerCase()))
        ).slice(0, 5)
        : []

    const handleSelectIssue = (issueId: string, projectId: string) => {
        router.push(`/projectmanagement/projects/${projectId}/board?task=${issueId}`)
        onClose()
        setQuery("")
    }

    const handleSelectProject = (projectId: string) => {
        router.push(`/projectmanagement/projects/${projectId}/summary`)
        onClose()
        setQuery("")
    }

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/" && !isOpen) {
                e.preventDefault()
                // Trigger open from parent
            }
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 gap-0">
                <DialogHeader className="p-4 pb-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for issues, projects, or people..."
                            className="pl-10 pr-10 h-12 text-[14px] font-medium border-none focus-visible:ring-0 bg-slate-50"
                            autoFocus
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-3 top-3 h-6 w-6 flex items-center justify-center rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </DialogHeader>

                <div className="max-h-[400px] overflow-y-auto p-4">
                    {!query.trim() ? (
                        <div className="text-center py-12">
                            <Search size={48} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-[13px] font-semibold text-slate-500">Start typing to search</p>
                            <p className="text-[11px] text-slate-400 mt-1">Search for issues, projects, or people</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Issues */}
                            {searchIssues.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
                                        Issues ({searchIssues.length})
                                    </h3>
                                    {searchIssues.map((issue) => (
                                        <button
                                            key={issue.id}
                                            onClick={() => handleSelectIssue(issue.id, issue.projectId)}
                                            className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                                        >
                                            <div className="shrink-0 p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                                <FileText size={16} className="text-indigo-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge className="bg-indigo-100 text-indigo-700 text-[9px] font-bold border-none">
                                                        {issue.code}
                                                    </Badge>
                                                    <Badge className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none">
                                                        {issue.type}
                                                    </Badge>
                                                </div>
                                                <p className="text-[13px] font-bold text-slate-900 truncate">
                                                    {issue.name}
                                                </p>
                                                {issue.description && (
                                                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                                        {issue.description}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Projects */}
                            {searchProjects.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
                                        Projects ({searchProjects.length})
                                    </h3>
                                    {searchProjects.map((project) => (
                                        <button
                                            key={project.id}
                                            onClick={() => handleSelectProject(project.id)}
                                            className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                                        >
                                            <div className="shrink-0 p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                                <Folder size={16} className="text-purple-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-bold text-slate-900 truncate">
                                                    {project.name}
                                                </p>
                                                {project.description && (
                                                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                                        {project.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className="bg-slate-100 text-slate-600 text-[9px] font-bold border-none">
                                                        {project.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* No Results */}
                            {searchIssues.length === 0 && searchProjects.length === 0 && (
                                <div className="text-center py-12">
                                    <Search size={48} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-[13px] font-semibold text-slate-500">No results found</p>
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Try searching with different keywords
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                        <div className="flex items-center gap-4">
                            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold">ESC</kbd> to close</span>
                        </div>
                        <span>{searchIssues.length + searchProjects.length} results</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
