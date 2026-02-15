"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    BookOpen,
    Plus,
    Search,
    FileText,
    Folder,
    Clock,
    ChevronRight,
    MoreHorizontal,
    Star,
    Edit3,
    Share2,
    Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useWikiStore, WikiPage as WikiPageType } from "@/shared/data/wiki-store"
import { formatDistanceToNow } from "date-fns"

export default function WikiPage() {
    const { id } = useParams()
    const projectId = id as string
    const projectName = id === "p1" ? "Website Redesign" : "Project"

    const { getPagesByProject, addPage, updatePage, toggleStar, deletePage } = useWikiStore()
    const [mounted, setMounted] = useState(false)
    const [search, setSearch] = useState("")

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingPage, setEditingPage] = useState<WikiPageType | null>(null)
    const [formData, setFormData] = useState({ title: "", folder: "General", content: "" })

    React.useEffect(() => {
        setMounted(true)
        useWikiStore.persist.rehydrate()
    }, [])

    const pages = getPagesByProject(projectId).filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.folder.toLowerCase().includes(search.toLowerCase())
    )

    const handleOpenCreate = () => {
        setEditingPage(null)
        setFormData({ title: "", folder: "General", content: "" })
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (page: WikiPageType) => {
        setEditingPage(page)
        setFormData({ title: page.title, folder: page.folder, content: page.content })
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (!formData.title.trim()) return

        if (editingPage) {
            updatePage(editingPage.id, {
                title: formData.title,
                folder: formData.folder,
                content: formData.content
            })
        } else {
            addPage({
                id: `wiki-${Date.now()}`,
                projectId,
                title: formData.title,
                folder: formData.folder,
                content: formData.content,
                author: "You", // Mock user
                updatedAt: new Date().toISOString(),
                starred: false
            })
        }
        setIsDialogOpen(false)
    }

    if (!mounted) return null

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{projectName} Wiki</h1>
                        <p className="text-[13px] text-slate-500 font-medium italic">Project documentation, guidelines, and knowledge base.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 font-bold text-slate-600">
                        <Folder className="h-4 w-4" />
                        Collections
                    </Button>
                    <Button onClick={handleOpenCreate} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                        <Plus className="h-4 w-4 stroke-[3px]" />
                        New Page
                    </Button>
                </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search pages..."
                            className="pl-8 h-9 text-[12px] bg-slate-50 border-slate-200"
                        />
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Favorites</p>
                        {pages.filter(p => p.starred).map(p => (
                            <div key={p.id} onClick={() => handleOpenEdit(p)} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 cursor-pointer group">
                                <FileText size={14} className="text-indigo-500" />
                                <span className="text-[13px] font-semibold text-slate-700 truncate">{p.title}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-1 pt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Collections</p>
                        {Array.from(new Set(pages.map(p => p.folder))).map(folder => (
                            <div key={folder} onClick={() => setSearch(folder)} className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-100 cursor-pointer group">
                                <div className="flex items-center gap-2">
                                    <Folder size={14} className="text-slate-400" />
                                    <span className="text-[13px] font-semibold text-slate-700">{folder}</span>
                                </div>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight lowercase first-letter:uppercase">Recent Pages</h2>
                        <Button variant="ghost" size="sm" className="text-indigo-600 font-bold text-[12px]">View Directory</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pages.map((page) => (
                            <Card key={page.id} onClick={() => handleOpenEdit(page)} className="border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer group">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" onClick={() => toggleStar(page.id)} className="h-8 w-8 text-slate-400">
                                                <Star size={14} className={page.starred ? "fill-amber-500 text-amber-500" : ""} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                                <MoreHorizontal size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="text-[15px] font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors mb-1 truncate">{page.title}</h3>
                                    <p className="text-[12px] text-slate-500 font-medium mb-4 flex items-center gap-1.5">
                                        <Badge variant="secondary" className="p-0 h-auto text-indigo-500 font-bold hover:bg-transparent bg-transparent border-none">{page.folder}</Badge>
                                        <span className="text-slate-300">•</span>
                                        Updated {formatDistanceToNow(new Date(page.updatedAt))} ago
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${page.author}`} />
                                                <AvatarFallback>U</AvatarFallback>
                                            </Avatar>
                                            <span className="text-[11px] font-bold text-slate-400 tracking-wider">BY {page.author.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Add New Page Card Mock */}
                        <div onClick={handleOpenCreate} className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 hover:border-indigo-200 transition-all cursor-pointer group min-h-[220px]">
                            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors">
                                <Plus size={20} className="text-slate-400 group-hover:text-indigo-600" />
                            </div>
                            <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-600">Create New Page</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Page Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
                    <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            {editingPage ? "Edit Wiki Page" : "Create New Page"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Page Title</label>
                                <Input
                                    className="font-bold text-slate-800"
                                    placeholder="e.g. Q1 Roadmap"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Folder/Collection</label>
                                <Input
                                    placeholder="e.g. General"
                                    value={formData.folder}
                                    onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Content</label>
                            <Textarea
                                className="min-h-[300px] resize-none font-medium text-slate-700 leading-relaxed p-4"
                                placeholder="Start writing your documentation..."
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-between pt-2">
                            {editingPage && (
                                <Button
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 text-[12px] font-bold"
                                    onClick={() => { deletePage(editingPage.id); setIsDialogOpen(false); }}
                                >
                                    Delete Page
                                </Button>
                            )}
                            <div className={`flex gap-3 ${!editingPage && 'ml-auto'}`}>
                                <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="font-bold text-slate-500">Cancel</Button>
                                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">Save Page</Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
