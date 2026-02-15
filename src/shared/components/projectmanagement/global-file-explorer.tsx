"use client"

import React, { useState, useMemo } from "react"
import { useDocumentStore } from "@/shared/data/document-store"
import { useProjectStore } from "@/shared/data/projects-store"
import {
    FileText,
    FileType,
    Download,
    Trash2,
    Search,
    FileImage,
    FileArchive,
    FileVideo,
    User,
    SearchX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default function GlobalFileExplorer() {
    const { documents, deleteDocument } = useDocumentStore()
    const { projects } = useProjectStore()

    // Filters State
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedProject, setSelectedProject] = useState<string>("all")
    const [selectedType, setSelectedType] = useState<string>("all")

    // Filtered Documents
    const filteredDocs = useMemo(() => {
        return documents.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesProject = selectedProject === "all" || doc.projectId === selectedProject
            const matchesType = selectedType === "all" || doc.type.includes(selectedType)
            return matchesSearch && matchesProject && matchesType
        })
    }, [documents, searchQuery, selectedProject, selectedType])

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    const getFileIcon = (type: string) => {
        if (type.includes('image')) return <FileImage className="text-pink-500" />
        if (type.includes('pdf')) return <FileText className="text-rose-500" />
        if (type.includes('zip') || type.includes('archive')) return <FileArchive className="text-amber-500" />
        if (type.includes('video')) return <FileVideo className="text-indigo-500" />
        return <FileType className="text-slate-400" />
    }

    return (
        <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 outline-none"
                    >
                        <option value="all">All Projects</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 outline-none"
                    >
                        <option value="all">All File Types</option>
                        <option value="image">Images</option>
                        <option value="pdf">PDFs</option>
                        <option value="video">Videos</option>
                    </select>
                </div>
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                        <div key={doc.id} className="group p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 bg-slate-50 rounded-lg flex items-center justify-center text-xl shadow-sm">
                                    {getFileIcon(doc.type)}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600 rounded">
                                        <Download size={14} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteDocument(doc.id, "current-user")}
                                        className="h-7 w-7 text-slate-400 hover:text-rose-600 rounded"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1 mb-4">
                                <h4 className="text-sm font-bold text-slate-800 truncate" title={doc.name}>{doc.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                    <span>{formatSize(doc.file?.size || doc.image?.size || 0)}</span>
                                    <span>•</span>
                                    <span className="uppercase">{doc.type.split('/')[1] || 'FILE'}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <User size={12} className="text-slate-300" />
                                    <span className="truncate max-w-[80px]">{doc.uploaderName}</span>
                                </div>
                                <span>
                                    {(() => {
                                        try {
                                            const date = new Date(doc.uploadedAt);
                                            return isNaN(date.getTime()) ? '' : format(date, 'MMM dd, yyyy');
                                        } catch (e) { return ''; }
                                    })()}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <SearchX size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-sm font-semibold text-slate-600">No matching files found</p>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                        <Button
                            variant="outline"
                            onClick={() => { setSearchQuery(""); setSelectedProject("all"); setSelectedType("all"); }}
                            className="mt-4 h-8 px-4 text-xs"
                        >
                            Reset Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
