"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Crown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTeamStore } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import SidePanel from "./side-panel"

interface CreateTeamModalProps {
    isOpen: boolean
    onClose: () => void
}

const AVATARS = ["🎨", "🚀", "💅", "⚙️", "📊", "🔒", "🌐", "📱"]

const schema = z.object({
    name: z.string().trim().min(2, "Team name must be at least 2 characters").max(60, "Too long"),
    description: z.string().max(300, "Description is too long").optional().or(z.literal("")),
    leadId: z.string().min(1, "Please select a team lead"),
    avatar: z.string().min(1, "Pick a team avatar"),
})

type FormValues = z.infer<typeof schema>

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
    const { addTeam, getMembersByWorkspace } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const [isLoading, setIsLoading] = useState(false)

    const workspaceMembers = activeWorkspaceId ? getMembersByWorkspace(activeWorkspaceId) : []

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { name: "", description: "", leadId: "", avatar: "🎨" },
    })

    const leadId = watch("leadId")
    const avatar = watch("avatar")

    React.useEffect(() => {
        if (isOpen) reset()
    }, [isOpen, reset])

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        await new Promise((r) => setTimeout(r, 400))

        addTeam({
            id: `team-${Date.now()}`,
            workspaceId: activeWorkspaceId || 'ws-1',
            name: values.name,
            description: values.description || "",
            memberIds: [values.leadId],
            leadId: values.leadId,
            avatar: values.avatar,
            createdAt: new Date().toISOString().split('T')[0],
        })

        setIsLoading(false)
        onClose()
        reset()
    }

    return (
        <SidePanel
            open={isOpen}
            onClose={onClose}
            title="Create New Team"
            description="Organize members into a squad inside this workspace."
            width="lg"
            footer={
                <div className="flex items-center justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose} className="font-bold text-slate-600 rounded-none">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-team-form"
                        disabled={!isValid || isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                            </>
                        ) : (
                            "Create Team"
                        )}
                    </Button>
                </div>
            }
        >
            <form id="create-team-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Team Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input {...register("name")} placeholder="e.g. Frontend Core" className="rounded-none" />
                    {errors.name && <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Avatar <span className="text-rose-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2 flex-wrap">
                        {AVATARS.map(a => (
                            <button
                                key={a}
                                type="button"
                                onClick={() => setValue("avatar", a, { shouldValidate: true })}
                                className={`h-10 w-10 border-2 flex items-center justify-center text-xl transition-all rounded-none ${avatar === a ? "border-indigo-600 bg-indigo-50" : "border-slate-200 hover:border-slate-300"}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                    {errors.avatar && <p className="text-[11px] font-semibold text-rose-600">{errors.avatar.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                    <Textarea
                        {...register("description")}
                        placeholder="What does this team do?"
                        className="min-h-[100px] rounded-none resize-none"
                    />
                    {errors.description && <p className="text-[11px] font-semibold text-rose-600">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Team Lead <span className="text-rose-500">*</span>
                    </Label>
                    <Select value={leadId} onValueChange={(v) => setValue("leadId", v, { shouldValidate: true })}>
                        <SelectTrigger className="rounded-none">
                            <div className="flex items-center gap-2">
                                <Crown size={14} className="text-amber-500" />
                                <SelectValue placeholder="Select a lead..." />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {workspaceMembers.length > 0 ? workspaceMembers.map(m => (
                                <SelectItem key={m.id} value={m.id} className="font-medium">
                                    {m.name} — {m.role}
                                </SelectItem>
                            )) : (
                                <div className="p-3 text-xs text-slate-400 italic">No members in this workspace yet.</div>
                            )}
                        </SelectContent>
                    </Select>
                    {errors.leadId && <p className="text-[11px] font-semibold text-rose-600">{errors.leadId.message}</p>}
                </div>
            </form>
        </SidePanel>
    )
}
