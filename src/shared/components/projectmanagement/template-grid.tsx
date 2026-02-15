"use client"

import React, { useState, useEffect } from "react"
import { useTemplates } from "@/shared/hooks/use-templates"
import TemplateCard from "./template-card"
import { Search, Filter, Plus, LayoutGrid, List as ListIcon, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TemplateGridProps {
    onSelect: (templateId: string) => void
    onCreateNew: () => void
}

/**
 * SOURCE OF TRUTH: Project Template Hub
 */
export default function TemplateGrid({ onSelect, onCreateNew }: TemplateGridProps) {
    const { fetchTemplates, isLoading, error } = useTemplates()
    const [templates, setTemplates] = useState<any[]>([])
    const [activeCategory, setActiveCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const load = async () => {
            const data = await fetchTemplates(activeCategory === "All" ? undefined : { category: activeCategory })
            setTemplates(data)
        }
        load()
    }, [activeCategory, fetchTemplates])

    const filteredTemplates = templates.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const categories = ["All", "Software", "Business", "Marketing", "Design", "Operations"]

    if (error) {
        return (
            <div className="h-96 flex flex-col items-center justify-center text-rose-500 font-black uppercase tracking-widest gap-4">
                <span className="p-4 bg-rose-50 rounded-full">⚠️</span>
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* 1. Filtering & Search Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                                ${activeCategory === cat
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="SEARCH TEMPLATES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-10 w-64 bg-white border-slate-200 rounded-xl text-[12px] font-black uppercase tracking-widest focus:ring-8 focus:ring-indigo-500/5 transition-all"
                        />
                    </div>
                    <Button
                        onClick={onCreateNew}
                        className="h-10 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] uppercase tracking-widest gap-2 shadow-lg"
                    >
                        <Plus size={16} />
                        Save as Template
                    </Button>
                </div>
            </div>

            {/* 2. Content Grid */}
            {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                    <Loader2 size={40} className="animate-spin text-indigo-500" />
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center text-center opacity-30 gap-4">
                    <Sparkles size={48} className="text-slate-200" />
                    <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">No templates found in this category</p>
                    <Button variant="link" onClick={() => setActiveCategory("All")} className="text-indigo-600 font-black uppercase tracking-[0.2em] text-[10px]">Clear Filters</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {filteredTemplates.map(template => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onSelect={() => onSelect(template.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
