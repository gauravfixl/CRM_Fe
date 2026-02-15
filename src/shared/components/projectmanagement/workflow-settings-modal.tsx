"use client"

import React, { useState, useEffect } from "react"
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    Layers,
    ArrowRightLeft,
    Plus,
    GripVertical,
    Trash2,
    Save,
    RotateCcw,
    CheckCircle2,
    Settings2
} from "lucide-react"
import { useWorkflowStore, Column, Transition } from "@/shared/data/workflow-store"

interface WorkflowSettingsModalProps {
    projectId: string
    onClose: () => void
}

/**
 * SOURCE OF TRUTH: Advanced Workflow Configuration
 * Allows dynamic column management and transition rule definition.
 */
export default function WorkflowSettingsModal({ projectId, onClose }: WorkflowSettingsModalProps) {
    const { getConfig, updateColumns, updateTransitions } = useWorkflowStore()
    const config = getConfig(projectId)

    // Local State
    const [localColumns, setLocalColumns] = useState<Column[]>([])
    const [localTransitions, setLocalTransitions] = useState<Transition[]>([])
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (config) {
            setLocalColumns([...config.columns].sort((a, b) => a.order - b.order))
            setLocalTransitions([...config.transitions])
        }
    }, [projectId])

    const handleAddColumn = () => {
        const newCol: Column = {
            id: `c-${Math.random().toString(36).substr(2, 5)}`,
            name: "New Phase",
            key: "CUSTOM",
            color: "#94a3b8",
            order: localColumns.length
        }
        setLocalColumns([...localColumns, newCol])
    }

    const handleRemoveColumn = (id: string) => {
        setLocalColumns(localColumns.filter(c => c.id !== id))
    }

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API sync
        setTimeout(() => {
            updateColumns(projectId, localColumns)
            updateTransitions(projectId, localTransitions)
            setIsSaving(false)
            onClose()
        }, 1200)
    }

    return (
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-none rounded-[40px] shadow-2xl">
            <div className="flex flex-col h-[700px] bg-white font-sans">
                {/* Custom Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                            <Settings2 size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black text-slate-800 uppercase tracking-tight">Workflow Architect</DialogTitle>
                            <DialogDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure project states and transition rules</DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden p-8">
                    <Tabs defaultValue="columns" className="h-full flex flex-col">
                        <TabsList className="bg-slate-100 p-1 rounded-2xl w-fit mb-8">
                            <TabsTrigger value="columns" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
                                <Layers size={14} className="mr-2" />
                                Columns
                            </TabsTrigger>
                            <TabsTrigger value="rules" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">
                                <ArrowRightLeft size={14} className="mr-2" />
                                Transitions
                            </TabsTrigger>
                        </TabsList>

                        {/* Column Management Content */}
                        <TabsContent value="columns" className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                            <div className="space-y-4">
                                {localColumns.map((col, idx) => (
                                    <div key={col.id} className="group p-4 bg-white border-2 border-slate-100 rounded-3xl flex items-center gap-4 hover:border-indigo-100 transition-all">
                                        <div className="cursor-grab text-slate-300 group-hover:text-indigo-400">
                                            <GripVertical size={20} />
                                        </div>
                                        <div className="h-8 w-8 rounded-lg overflow-hidden border-2 border-white shadow-sm flex-shrink-0" style={{ backgroundColor: col.color }} />
                                        <div className="flex-1 grid grid-cols-2 gap-4">
                                            <Input
                                                value={col.name}
                                                onChange={(e) => {
                                                    const newCols = [...localColumns]
                                                    newCols[idx].name = e.target.value
                                                    setLocalColumns(newCols)
                                                }}
                                                className="h-10 bg-slate-50 border-none font-bold text-[13px] rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                                            />
                                            <Input
                                                value={col.color}
                                                onChange={(e) => {
                                                    const newCols = [...localColumns]
                                                    newCols[idx].color = e.target.value
                                                    setLocalColumns(newCols)
                                                }}
                                                className="h-10 bg-slate-50 border-none font-mono text-[11px] rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all uppercase"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveColumn(col.id)}
                                            className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    onClick={handleAddColumn}
                                    className="w-full h-14 border-2 border-dashed border-slate-100 rounded-3xl text-slate-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50 font-black text-[11px] uppercase tracking-widest gap-2 transition-all"
                                >
                                    <Plus size={16} />
                                    Append New Mission Phase
                                </Button>
                            </div>
                        </TabsContent>

                        {/* Transitions / Rules Content */}
                        <TabsContent value="rules" className="flex-1">
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                                    <ArrowRightLeft size={32} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[12px] font-black uppercase tracking-widest text-slate-600">Transition logic generator</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[280px]">Define the legal status moves permissible for mission items</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer Controls */}
                <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-end gap-4">
                    <Button variant="ghost" onClick={onClose} className="h-12 px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-400">Cancel</Button>
                    <Button
                        disabled={isSaving}
                        onClick={handleSave}
                        className="h-12 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 gap-2"
                    >
                        {isSaving ? <RotateCcw size={16} className="animate-spin" /> : <Save size={16} />}
                        Commite Architecture
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}
