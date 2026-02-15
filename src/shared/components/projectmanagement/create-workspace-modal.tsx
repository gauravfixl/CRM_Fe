"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { Loader2, LayoutGrid, CheckCircle } from "lucide-react"

interface CreateWorkspaceModalProps {
    isOpen: boolean
    onClose: () => void
}

const INDUSTRIES = [
    "Technology",
    "Marketing",
    "Design",
    "Education",
    "Finance",
    "Healthcare",
    "Other"
]

const ICONS = ["🏢", "🚀", "💻", "🎨", "📈", "🏥", "🌍", "⚡", "🔥", "💎"]

export default function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
    const { addWorkspace } = useWorkspaceStore()
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: Details, 2: Success

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        industry: "",
        description: "",
        icon: "🏢"
    })

    const handleCreate = async () => {
        if (!formData.name) return

        setIsLoading(true)

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newWorkspace = {
            id: `ws-${Date.now()}`,
            name: formData.name,
            slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
            icon: formData.icon,
            createdAt: new Date().toISOString(),
            description: formData.description,
            industry: formData.industry,
            purpose: "Team Collaboration"
        }

        addWorkspace(newWorkspace)
        setStep(2)
        setIsLoading(false)

        // Auto close after success? Or let user close.
        // Let's reset and close after a brief delay or let user click "Go to Workspace"
    }

    // Reset state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setStep(1)
            setFormData({ name: "", slug: "", industry: "", description: "", icon: "🏢" })
            setIsLoading(false)
        }
    }, [isOpen])

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-white border-slate-200">
                {step === 1 ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black text-slate-800 tracking-tight">Create New Workspace</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                Setup a new environment for your team's projects.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workspace Name</Label>
                                <Input
                                    placeholder="e.g. Acme Corp"
                                    className="font-bold text-slate-800"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industry</Label>
                                    <Select
                                        value={formData.industry}
                                        onValueChange={(val) => setFormData({ ...formData, industry: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INDUSTRIES.map(ind => (
                                                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Icon</Label>
                                    <Select
                                        value={formData.icon}
                                        onValueChange={(val) => setFormData({ ...formData, icon: val })}
                                    >
                                        <SelectTrigger>
                                            <span className="text-lg leading-none">{formData.icon}</span>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <div className="grid grid-cols-5 gap-1 p-2">
                                                {ICONS.map(icon => (
                                                    <div
                                                        key={icon}
                                                        className={`h-8 w-8 flex items-center justify-center rounded-md cursor-pointer hover:bg-slate-100 ${formData.icon === icon ? 'bg-indigo-50 border border-indigo-200' : ''}`}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setFormData({ ...formData, icon })
                                                        }}
                                                    >
                                                        {icon}
                                                    </div>
                                                ))}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                                <Textarea
                                    placeholder="What's this workspace for?"
                                    className="resize-none h-20 text-[13px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="ghost" onClick={onClose} className="font-bold text-slate-500">Cancel</Button>
                            <Button
                                onClick={handleCreate}
                                disabled={!formData.name || isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-lg shadow-indigo-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Workspace"
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Workspace Ready!</h3>
                        <p className="text-sm text-slate-500 font-medium max-w-[260px]">
                            <span className="font-bold text-slate-800">{formData.name}</span> has been created successfully. You're now switched to this workspace.
                        </p>
                        <Button
                            onClick={onClose}
                            className="bg-slate-900 text-white font-bold w-full max-w-[200px] mt-4"
                        >
                            Get Started
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
