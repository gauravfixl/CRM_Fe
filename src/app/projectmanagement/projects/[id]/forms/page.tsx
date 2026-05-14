"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { FileText, Plus, Trash2, Edit3, ExternalLink, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SidePanel from "@/shared/components/projectmanagement/side-panel"

type FormStatus = "DRAFT" | "ACTIVE" | "ARCHIVED"

interface IntakeForm {
    id: string
    projectId: string
    title: string
    description: string
    fields: { name: string; type: "TEXT" | "TEXTAREA" | "EMAIL" | "NUMBER" }[]
    responses: number
    status: FormStatus
    createdAt: string
}

export default function FormsPage() {
    const { id } = useParams()
    const projectId = id as string
    const [forms, setForms] = useState<IntakeForm[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [fieldsText, setFieldsText] = useState("Name (TEXT)\nEmail (EMAIL)\nMessage (TEXTAREA)")

    const handleCreate = () => {
        if (!title.trim()) return
        const parsed = fieldsText.split("\n").map(line => {
            const m = line.match(/^(.+?)\s*\((TEXT|TEXTAREA|EMAIL|NUMBER)\)\s*$/i)
            if (!m) return null
            return { name: m[1].trim(), type: m[2].toUpperCase() as "TEXT" | "TEXTAREA" | "EMAIL" | "NUMBER" }
        }).filter(Boolean) as IntakeForm["fields"]

        setForms(prev => [{
            id: `form-${Date.now()}`,
            projectId,
            title: title.trim(),
            description: description.trim(),
            fields: parsed,
            responses: 0,
            status: "DRAFT",
            createdAt: new Date().toISOString(),
        }, ...prev])
        setTitle("")
        setDescription("")
        setFieldsText("Name (TEXT)\nEmail (EMAIL)\nMessage (TEXTAREA)")
        setIsOpen(false)
    }

    const cycleStatus = (id: string) => {
        const order: FormStatus[] = ["DRAFT", "ACTIVE", "ARCHIVED"]
        setForms(prev => prev.map(f => {
            if (f.id !== id) return f
            const idx = order.indexOf(f.status)
            return { ...f, status: order[(idx + 1) % order.length] }
        }))
    }

    return (
        <div className="flex flex-col h-full gap-5 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-indigo-600 text-white flex items-center justify-center rounded-none">
                        <FileText size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Forms</h1>
                        <p className="text-[12px] text-slate-500 font-medium">Create public intake forms that capture issues into this project.</p>
                    </div>
                </div>
                <Button onClick={() => setIsOpen(true)} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <Plus size={14} /> New Form
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {forms.length === 0 ? (
                    <div className="bg-slate-50 border border-dashed border-slate-200 py-12 text-center rounded-none">
                        <FileText size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No intake forms yet.</p>
                        <p className="text-[11px] text-slate-400 mt-1">Create one to collect issues from external users.</p>
                    </div>
                ) : (
                    forms.map(form => (
                        <Card key={form.id} className="border border-slate-200 shadow-sm bg-white rounded-none hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center rounded-none">
                                    <FileText size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{form.title}</h4>
                                    <p className="text-[11px] text-slate-500 truncate">{form.description || "No description"}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{form.fields.length} fields · {form.responses} responses</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => cycleStatus(form.id)}
                                    title="Click to cycle status"
                                >
                                    <Badge className={`text-[10px] font-bold rounded-none cursor-pointer ${form.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : form.status === "DRAFT" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}`}>
                                        {form.status}
                                    </Badge>
                                </button>
                                <button className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-indigo-600 rounded-none" title="Preview">
                                    <Eye size={14} />
                                </button>
                                <button onClick={() => setForms(prev => prev.filter(f => f.id !== form.id))} className="h-8 w-8 flex items-center justify-center text-slate-300 hover:text-rose-600 rounded-none">
                                    <Trash2 size={14} />
                                </button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <SidePanel
                open={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create Intake Form"
                description="Define fields users can fill to submit issues into this project."
                width="lg"
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="font-bold text-slate-600 rounded-none">Cancel</Button>
                        <Button onClick={handleCreate} disabled={!title.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none">Create Form</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Title <span className="text-rose-500">*</span></label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Bug Report" className="rounded-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this form for?" className="rounded-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fields (one per line, format: <code className="bg-slate-100 px-1">Name (TYPE)</code>)</label>
                        <Textarea value={fieldsText} onChange={(e) => setFieldsText(e.target.value)} className="font-mono text-xs min-h-[120px] rounded-none" />
                        <p className="text-[10px] text-slate-400">Allowed types: TEXT, TEXTAREA, EMAIL, NUMBER</p>
                    </div>
                </div>
            </SidePanel>
        </div>
    )
}
