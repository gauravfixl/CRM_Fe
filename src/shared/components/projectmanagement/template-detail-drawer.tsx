"use client"

import React from "react"
import { useTemplateStore } from "@/shared/data/template-store"
import { SheetContent } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    X,
    Zap,
    Layout,
    ListTodo,
    Layers,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    BarChart3,
    Settings2
} from "lucide-react"

interface TemplateDetailDrawerProps {
    templateId: string
    onClose: () => void
    onUse: (templateId: string) => void
}

/**
 * SOURCE OF TRUTH: Template Blueprint View
 */
export default function TemplateDetailDrawer({ templateId, onClose, onUse }: TemplateDetailDrawerProps) {
    const { templates } = useTemplateStore()
    const template = templates.find(t => t.id === templateId)

    if (!template) return null

    return (
        <SheetContent className="sm:max-w-[700px] p-0 border-l border-slate-200 shadow-2xl flex flex-col h-full bg-white font-sans overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8 h-20 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <Zap size={20} className="fill-current" />
                    </div>
                    <div>
                        <h4 className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.2em] leading-none">Template Blueprint</h4>
                        <p className="text-[14px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{template.id}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 text-slate-400 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-all">
                    <X size={24} />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-10 space-y-12 pb-24">
                    {/* 1. visual Banner */}
                    <div className="relative h-64 rounded-[40px] overflow-hidden border-4 border-slate-50 shadow-inner group">
                        <img
                            src={template.previewImage}
                            alt={template.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-none">
                                {template.name}
                            </h2>
                            <div className="flex items-center gap-3 mt-4">
                                <Badge className="bg-white/20 backdrop-blur-md text-white border-none font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                                    {template.category}
                                </Badge>
                                <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                                    {template.boardType}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* 2. Overview */}
                    <section className="space-y-6">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                            Executive Overview
                            <div className="h-[1px] flex-1 bg-slate-100" />
                        </h3>
                        <p className="text-lg font-medium text-slate-600 leading-relaxed">
                            {template.description}
                        </p>
                    </section>

                    {/* 3. Included Components (Blueprint logic) */}
                    <section className="space-y-6">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                            Operational Components
                            <div className="h-[1px] flex-1 bg-slate-100" />
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { title: "Custom Board", icon: <Layout />, desc: `${template.boardType} architecture` },
                                { title: "Workflow States", icon: <Layers />, desc: "Standard agile states" },
                                { title: "Issue Types", icon: <ListTodo />, desc: "Task, Bug, Story" },
                                { title: "Security Rules", icon: <ShieldCheck />, desc: "Default permission set" }
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] space-y-3">
                                    <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-slate-800 shadow-sm border border-slate-100">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4. Expected Outcome */}
                    <div className="p-8 bg-indigo-600 rounded-[40px] shadow-2xl shadow-indigo-200 text-white space-y-6 overflow-hidden relative">
                        <BarChart3 size={150} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
                        <h3 className="text-xl font-black uppercase tracking-tight">Rapid Deployment Expected</h3>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90 max-w-[80%]">
                            By using this template, you'll reduce setup time by ~75% and ensure your team follows organization-wide best practices.
                        </p>
                        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={16} />
                            Verified for {template.category} workflows
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Persistence Actions */}
            <div className="h-28 px-10 border-t border-slate-100 bg-white flex items-center justify-end gap-6 sticky bottom-0 z-10">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="h-12 px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-all"
                >
                    Dismiss
                </Button>
                <Button
                    onClick={() => onUse(template.id)}
                    className="h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    Initialize Template
                    <ArrowRight size={18} />
                </Button>
            </div>
        </SheetContent>
    )
}
