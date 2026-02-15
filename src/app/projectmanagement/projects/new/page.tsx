"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Layout,
    Layers,
    Target,
    ArrowLeft,
    Users,
    Trello,
    Briefcase,
    Shield,
    CheckCircle2,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { useTeamStore } from "@/shared/data/team-store"
import { useWorkflowStore } from "@/shared/data/workflow-store"
import { TEMPLATE_DEFINITIONS } from "@/shared/data/template-definitions"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const ICONS: Record<string, React.ReactNode> = {
    "Trello": <Trello />,
    "Layers": <Layers />,
    "Target": <Target />,
    "Briefcase": <Briefcase />,
    "Layout": <Layout />
}

export default function CreateProjectWizard() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>("kanban")
    const [projectName, setProjectName] = useState("")
    const [projectKey, setProjectKey] = useState("")
    const [leadId, setLeadId] = useState("")
    const [projectType, setProjectType] = useState<"team" | "company">("team")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { addProject } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const { getMembersByWorkspace } = useTeamStore()
    const { setConfig } = useWorkflowStore()

    const workspaceMembers = activeWorkspaceId ? getMembersByWorkspace(activeWorkspaceId) : []

    // Link definitions to array for mapping
    const TEMPLATE_LIST = Object.values(TEMPLATE_DEFINITIONS)

    // Auto-generate project key
    const generateKey = (name: string) => {
        const key = name.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 3)
        setProjectKey(key)
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setProjectName(val)
        if (val.length > 2) generateKey(val)
    }

    const isNextDisabled = step === 1 ? !selectedTemplate : !projectName || !leadId || isSubmitting

    const handleCreateProject = () => {
        setIsSubmitting(true)
        const newId = `p-${Date.now()}`

        // 1. Create Project Entry
        addProject({
            id: newId,
            workspaceId: activeWorkspaceId || 'ws-1',
            name: projectName,
            key: projectKey,
            status: "Active",
            leadId: leadId,
            memberIds: [leadId],
            members: 1,
            due: "TBD",
            category: selectedTemplate ? TEMPLATE_DEFINITIONS[selectedTemplate].type : "Business",
            icon: "🚀",
            type: projectType,
            starred: true
        })

        // 2. Seed Workflow & Board Configuration (The "Real" Implementation)
        if (selectedTemplate && TEMPLATE_DEFINITIONS[selectedTemplate]) {
            const template = TEMPLATE_DEFINITIONS[selectedTemplate]

            // Map template columns to the workflow config format
            const columns = template.columns.map((col, index) => ({
                id: `col-${index}`,
                name: col.name,
                key: col.key,
                color: col.color,
                order: index
            }))

            setConfig(newId, {
                boardId: `b-${newId}`,
                projectId: newId,
                columns: columns,
                transitions: [] // Default to all permitted for now
            })
        }

        router.push(`/projectmanagement/projects/${newId}/board?name=${encodeURIComponent(projectName)}`)
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Top Navigation */}
            <div className="h-[72px] border-b border-slate-100 flex items-center justify-between px-8 bg-white z-10 sticky top-0">
                <div className="flex items-center gap-5">
                    <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                        <ArrowLeft className="h-5 w-5 text-slate-500" />
                    </button>
                    <div className="h-5 w-[1.5px] bg-slate-200 mx-1" />
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 tracking-tight">New Project</h1>
                        <p className="text-[11px] font-semibold text-slate-500">{step === 1 ? "Choose Template" : "Final Details"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[11px] font-semibold text-slate-400 mr-4">Step {step} of 2</span>
                    <Button variant="ghost" onClick={() => router.back()} className="text-[13px] font-semibold text-slate-500 px-5">Cancel</Button>
                    <Button
                        disabled={isNextDisabled || isSubmitting}
                        onClick={() => {
                            if (step === 2) {
                                handleCreateProject()
                            } else {
                                setStep(2)
                            }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 px-8 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95 min-w-[140px] text-[13px]"
                    >
                        {isSubmitting ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            step === 2 ? 'Create Project' : 'Next Step'
                        )}
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center py-8 px-6 max-w-[1400px] mx-auto w-full origin-top" style={{ zoom: "0.8" }}>

                {step === 1 && (
                    <div className="w-full max-w-[1000px] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Choose a specialized template</h2>
                            <p className="text-slate-500 text-[15px] font-medium">Templates come with pre-configured boards, issue types, and automated workflows.</p>
                        </div>

                        <div className="w-full bg-slate-50/50 border border-slate-200 rounded-[32px] p-8 shadow-inner">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {TEMPLATE_LIST.map((tmpl) => (
                                    <div
                                        key={tmpl.id}
                                        onClick={() => setSelectedTemplate(tmpl.id)}
                                        className={`group cursor-pointer rounded-[20px] border p-5 transition-all duration-300 relative ${selectedTemplate === tmpl.id
                                            ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-200/50 scale-[1.02]'
                                            : 'border-white bg-white/60 hover:border-indigo-200 hover:shadow-lg'
                                            }`}
                                    >
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-xl mb-3 transition-transform group-hover:scale-110 group-hover:rotate-3 ${tmpl.color} shadow-sm border border-black/5`}>
                                            {ICONS[tmpl.iconType]}
                                        </div>
                                        <h3 className="text-[16px] font-bold text-slate-800 mb-1.5 truncate tracking-tight">{tmpl.title}</h3>
                                        <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-4 text-pretty h-[36px] line-clamp-2">"{tmpl.description}"</p>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100/80">
                                            <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-50 border-slate-200 text-slate-500 capitalize">{tmpl.type}</Badge>
                                            {selectedTemplate === tmpl.id && (
                                                <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-md shadow-indigo-200 animate-in zoom-in duration-300">
                                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="w-full max-w-[900px] space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Define your project parameters</h2>
                            <p className="text-slate-500 text-[15px] font-medium">Configure the project identity and assign the primary leadership.</p>
                        </div>

                        <div className="w-full bg-white border border-slate-200 rounded-[32px] p-8 shadow-2xl shadow-slate-200/50">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                {/* Left Form */}
                                <div className="md:col-span-7 space-y-6">
                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[12px] font-bold text-slate-700 ml-1">Project Identity / Name</label>
                                            <Input
                                                autoFocus
                                                placeholder="e.g. Mission Critical Redesign"
                                                value={projectName}
                                                onChange={handleNameChange}
                                                className="h-10 border-slate-200 focus:ring-4 focus:ring-indigo-500/10 text-[15px] font-semibold tracking-tight rounded-xl px-4 shadow-sm"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[12px] font-bold text-slate-700 ml-1">Appoint Project Lead</label>
                                            <Select value={leadId} onValueChange={setLeadId}>
                                                <SelectTrigger className="h-10 border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/10 px-4 shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <Users size={16} className="text-indigo-500" />
                                                        <SelectValue placeholder="Select from workspace members..." />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl shadow-xl border-slate-100 p-1.5 overflow-hidden">
                                                    {workspaceMembers.length > 0 ? workspaceMembers.map(m => (
                                                        <SelectItem key={m.id} value={m.id} className="font-medium p-2.5 rounded-lg text-[12px] focus:bg-indigo-50 focus:text-indigo-600 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold">{m.name[0]}</div>
                                                                {m.name} — {m.role}
                                                            </div>
                                                        </SelectItem>
                                                    )) : (
                                                        <div className="p-6 text-center text-slate-400 font-medium italic text-xs">No members found in workspace.</div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[10px] text-slate-400 font-medium leading-relaxed ml-1 pr-4 mt-1.5">
                                                * This individual will have full administrative control over transitions, board configurations, and team assignments.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5 pb-6 border-b border-slate-100">
                                        <div className="space-y-1.5">
                                            <label className="text-[12px] font-bold text-slate-700 ml-1">Visibility</label>
                                            <select className="w-full h-10 px-3 border border-slate-200 rounded-xl bg-slate-50 text-[13px] font-semibold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer">
                                                <option>Member Only</option>
                                                <option>Workspace Wide</option>
                                                <option>Restricted</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[12px] font-bold text-slate-700 ml-1">Reference Key</label>
                                            <Input
                                                value={projectKey}
                                                onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                                                maxLength={5}
                                                className="h-10 border-slate-200 bg-slate-50 flex items-center px-3 font-bold tracking-wider text-indigo-600 rounded-xl text-center text-[13px] shadow-sm uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-1">
                                        <label className="text-[12px] font-bold text-slate-700 ml-1">Architecture Strategy</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                onClick={() => setProjectType("team")}
                                                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 ${projectType === 'team' ? 'border-indigo-600 bg-indigo-50/30 shadow-md shadow-indigo-100/50' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <Users size={14} className={projectType === 'team' ? 'text-indigo-600' : 'text-slate-300'} />
                                                    <span className="text-[12px] font-bold text-slate-800 tracking-tight">Team-Managed</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Hyper-autonomous setup for agile squads.</p>
                                            </div>
                                            <div
                                                onClick={() => setProjectType("company")}
                                                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 ${projectType === 'company' ? 'border-indigo-600 bg-indigo-50/30 shadow-md shadow-indigo-100/50' : 'border-slate-100 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <Shield size={14} className={projectType === 'company' ? 'text-indigo-600' : 'text-slate-300'} />
                                                    <span className="text-[12px] font-bold text-slate-800 tracking-tight">Enterpise-Wide</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Centralized workflows and strict governance.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Preview Card */}
                                <div className="md:col-span-5">
                                    <Card className="border-none bg-indigo-50/40 p-5 flex flex-col items-center text-center space-y-4 sticky top-28 rounded-[28px] border border-indigo-100/50 backdrop-blur-sm">
                                        <div className="h-14 w-14 bg-white rounded-[20px] shadow-lg shadow-indigo-100/50 border border-slate-100 flex items-center justify-center text-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                            {selectedTemplate && ICONS[TEMPLATE_DEFINITIONS[selectedTemplate].iconType]}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[16px] font-bold text-slate-900 tracking-tight leading-none">{projectName || "Project Alpha"}</h4>
                                            <p className="text-[11px] font-bold text-indigo-600 tracking-widest">{projectKey || "KEY"}</p>
                                        </div>
                                        <div className="w-full space-y-2.5 pt-4 border-t border-indigo-100/60">
                                            <div className="flex justify-between text-[11px] font-semibold tracking-wide leading-none">
                                                <span className="text-slate-400">Template Engine</span>
                                                <span className="text-slate-700">{selectedTemplate ? TEMPLATE_DEFINITIONS[selectedTemplate].title : "None"}</span>
                                            </div>
                                            <div className="flex justify-between text-[11px] font-semibold tracking-wide leading-none">
                                                <span className="text-slate-400">Leadership Appointed</span>
                                                <span className="text-indigo-600">{leadId ? "Yes" : "Pending"}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/70 rounded-xl border border-white/60 flex items-center gap-2.5 w-full shadow-sm">
                                            <Zap size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                                            <p className="text-[10px] text-slate-500 font-medium text-left leading-relaxed pr-1 line-clamp-3">
                                                * Project architecture initialized on {selectedTemplate ? TEMPLATE_DEFINITIONS[selectedTemplate].title : "..."} framework.
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
