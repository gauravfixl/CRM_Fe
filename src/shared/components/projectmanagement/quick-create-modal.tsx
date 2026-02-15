"use client"

import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Plus,
    Layout,
    CheckSquare,
    Users,
    FileText,
    Settings,
    ArrowRight,
    Rocket
} from "lucide-react"
import { useRouter } from "next/navigation"
import CreateProjectModal from "./create-project-modal"
import { CreateIssueModal } from "./create-issue-modal"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { useProjectStore } from "@/shared/data/projects-store"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface QuickCreateModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export default function QuickCreateModal({ isOpen, onOpenChange }: QuickCreateModalProps) {
    const router = useRouter()
    const { activeWorkspaceId } = useWorkspaceStore()
    const { getProjectsByWorkspace } = useProjectStore()

    // Get projects for active workspace
    const projects = activeWorkspaceId ? getProjectsByWorkspace(activeWorkspaceId) : []

    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
    const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false)
    const [selectedProjectId, setSelectedProjectId] = useState<string>("")
    const [actionStep, setActionStep] = useState<"SELECT" | "PROJECT_SELECT">("SELECT")
    const [targetAction, setTargetAction] = useState<"TASK" | "SPRINT" | null>(null)

    const handleActionClick = (action: string) => {
        if (action === "PROJECT") {
            setIsCreateProjectOpen(true)
            onOpenChange(false) // Close main modal, let sub-modal handle itself? 
            // Better: Keep main modal open? No, modals on top of modals is tricky.
            // Let's rely on the state of sub-modals.
            // But if I close main modal, the sub-modal state defined inside might be lost if it resets?
            // No, sub-modal state is outside this function.
            // Actually, sub-modals are rendered below. If QuickCreateModal unmounts (onClose), they unmount.
            // So sub-modals must be conditioned on state but outside the conditional render of "isOpen" of parent?
            // Or I keep parent open?
            // Strategy: QuickCreateModal stays mounted but hidden? Or better:
            // Render sub-modals conditionally based on state, and if they are open, QuickCreate is "hidden" or behind?
            // Let's try rendering sub-modals alongside the content.
        } else if (action === "TASK") {
            if (projects.length === 0) {
                alert("No projects found. Please create a project first.")
                return
            }
            if (projects.length === 1) {
                // Auto-select first project
                setSelectedProjectId(projects[0].id)
                setIsCreateIssueOpen(true)
            } else {
                setTargetAction("TASK")
                setActionStep("PROJECT_SELECT")
            }
        } else if (action === "SPRINT") {
            if (projects.length === 0) {
                alert("No projects found. Please create a project first.")
                return
            }
            if (projects.length === 1) {
                router.push(`/projectmanagement/projects/${projects[0].id}/backlog`)
                onOpenChange(false)
            } else {
                setTargetAction("SPRINT")
                setActionStep("PROJECT_SELECT")
            }
        }
    }

    const handleProjectSelect = (projectId: string) => {
        setSelectedProjectId(projectId)
        if (targetAction === "TASK") {
            setIsCreateIssueOpen(true)
        } else if (targetAction === "SPRINT") {
            router.push(`/projectmanagement/projects/${projectId}/backlog`)
            onOpenChange(false)
        }
    }

    // Reset state on open
    React.useEffect(() => {
        if (isOpen) {
            setActionStep("SELECT")
            setTargetAction(null)
        }
    }, [isOpen])

    return (
        <>
            <Dialog open={isOpen && !isCreateProjectOpen && !isCreateIssueOpen} onOpenChange={onOpenChange}>
                <DialogContent
                    className="max-w-2xl p-0 overflow-hidden rounded-[40px] border-none shadow-2xl origin-center bg-white"
                    style={{ zoom: 0.8 } as React.CSSProperties}
                >
                    <div className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-indigo-100">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight text-indigo-900">
                            {actionStep === "SELECT" ? "System Quick Action" : "Select Target Project"}
                        </DialogTitle>
                        <DialogDescription className="text-indigo-400 text-[11px] font-bold uppercase tracking-widest mt-1">
                            {actionStep === "SELECT" ? "Select a protocol to initialize new artifacts" : `Choose a project for your new ${targetAction?.toLowerCase()}`}
                        </DialogDescription>
                    </div>

                    <div className="p-8 bg-white max-h-[400px] overflow-y-auto">
                        {actionStep === "SELECT" ? (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleActionClick("PROJECT")}
                                    className="p-6 rounded-[32px] bg-indigo-50 border-2 border-transparent hover:border-indigo-100 hover:shadow-xl transition-all group relative overflow-hidden text-left"
                                >
                                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                        <Layout className="text-indigo-600" />
                                    </div>
                                    <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Launch New Project</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mt-2">Start a fresh mission with a template or from scratch</p>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={16} className="text-slate-400" />
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleActionClick("TASK")}
                                    className="p-6 rounded-[32px] bg-emerald-50 border-2 border-transparent hover:border-emerald-100 hover:shadow-xl transition-all group relative overflow-hidden text-left"
                                >
                                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                        <CheckSquare className="text-emerald-600" />
                                    </div>
                                    <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Create Mission Task</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mt-2">Add a high-priority item to an existing board</p>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={16} className="text-slate-400" />
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleActionClick("SPRINT")}
                                    className="p-6 rounded-[32px] bg-amber-50 border-2 border-transparent hover:border-amber-100 hover:shadow-xl transition-all group relative overflow-hidden text-left"
                                >
                                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                        <Rocket className="text-amber-600" />
                                    </div>
                                    <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Plan New Sprint</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mt-2">Initialize a specific sprint cycle for your team</p>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={16} className="text-slate-400" />
                                    </div>
                                </button>

                                <button
                                    className="p-6 rounded-[32px] bg-blue-50 border-2 border-transparent hover:border-blue-100 hover:shadow-xl transition-all group relative overflow-hidden text-left"
                                >
                                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                        <Users className="text-blue-600" />
                                    </div>
                                    <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Onboard Member</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mt-2">Invite a new specialist to the workspace</p>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={16} className="text-slate-400" />
                                    </div>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-[13px] font-bold text-slate-500 mb-2">Select a project to continue:</p>
                                <div className="grid gap-2">
                                    {projects.map(project => (
                                        <button
                                            key={project.id}
                                            onClick={() => handleProjectSelect(project.id)}
                                            className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all group text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-lg">
                                                    {project.name[0]}
                                                </div>
                                                <div>
                                                    <h4 className="text-[14px] font-bold text-slate-800">{project.name}</h4>
                                                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{project.key}</p>
                                                </div>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setActionStep("SELECT")}
                                    className="w-full mt-4 text-[12px] font-bold text-slate-500"
                                >
                                    Back to options
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white flex justify-between items-center border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Settings size={12} />
                            Protocol version 4.2.0-Active
                        </p>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 rounded-xl"
                        >
                            Dismiss
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Sub Modals */}
            <CreateProjectModal
                isOpen={isCreateProjectOpen}
                onClose={() => {
                    setIsCreateProjectOpen(false)
                    onOpenChange(false)
                }}
            />

            {selectedProjectId && (
                <CreateIssueModal
                    projectId={selectedProjectId}
                    isOpen={isCreateIssueOpen}
                    onClose={() => {
                        setIsCreateIssueOpen(false)
                        onOpenChange(false)
                    }}
                />
            )}
        </>
    )
}
