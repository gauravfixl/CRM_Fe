"use client"

import React from "react"
import { ProjectTemplate } from "@/shared/data/template-store"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Layout, Globe2, Sparkles, ChevronRight, BarChart3, Clock } from "lucide-react"

interface TemplateCardProps {
    template: ProjectTemplate
    onSelect: (template: ProjectTemplate) => void
}

/**
 * Premium Template Card Component
 * SOURCE OF TRUTH: UI/UX Phase 5 Specs
 */
export default function TemplateCard({ template, onSelect }: TemplateCardProps) {
    return (
        <Card
            className="group relative overflow-hidden rounded-[40px] border-2 border-slate-100 bg-white transition-all hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
            onClick={() => onSelect(template)}
        >
            {/* Preview Image Area */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                    src={template.previewImage}
                    alt={template.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {template.recommended && (
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-indigo-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border-none shadow-lg flex items-center gap-1.5">
                            <Sparkles size={10} />
                            Recommended
                        </Badge>
                    </div>
                )}

                {template.isSystem && (
                    <div className="absolute top-4 right-4 focus-within:">
                        <Badge className="bg-white/90 backdrop-blur-md text-slate-800 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border-none shadow-sm flex items-center gap-1.5">
                            <Globe2 size={10} className="text-indigo-500" />
                            System
                        </Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-8 space-y-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{template.category}</p>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                        {template.name}
                    </h3>
                </div>

                <p className="text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                    {template.description}
                </p>

                <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Layout size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{template.boardType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">v{template.version}.0</span>
                    </div>
                </div>
            </CardContent>

            <div className="px-8 pb-8">
                <Button className="w-full bg-slate-50 hover:bg-indigo-600 text-slate-600 hover:text-white font-black text-[11px] uppercase tracking-widest h-12 rounded-2xl transition-all group-hover:shadow-xl group-hover:shadow-indigo-500/20 gap-2 border-2 border-slate-100 group-hover:border-indigo-600">
                    Use Template
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
        </Card>
    )
}
