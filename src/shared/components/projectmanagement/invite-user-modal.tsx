"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTeamStore, UserRole } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import SidePanel from "./side-panel"

interface InviteUserModalProps {
    isOpen: boolean
    onClose: () => void
}

const schema = z.object({
    name: z.string().trim().min(2, "Please enter the full name").max(80, "Name too long"),
    email: z.string().trim().email("Enter a valid email address"),
    role: z.enum(["MEMBER", "ADMIN", "VIEWER"]),
})

type FormValues = z.infer<typeof schema>

export function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
    const { addMember } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const [isLoading, setIsLoading] = useState(false)

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
        defaultValues: { name: "", email: "", role: "MEMBER" },
    })

    const role = watch("role")

    React.useEffect(() => {
        if (isOpen) reset()
    }, [isOpen, reset])

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        await new Promise((r) => setTimeout(r, 400))

        addMember({
            id: `u-${Date.now()}`,
            workspaceId: activeWorkspaceId || 'ws-1',
            name: values.name,
            email: values.email,
            avatar: `https://i.pravatar.cc/150?u=${values.email}`,
            role: values.role as UserRole,
            joinedAt: new Date().toISOString().split('T')[0],
            projectsCount: 0,
        })

        setIsLoading(false)
        onClose()
        reset()
    }

    return (
        <SidePanel
            open={isOpen}
            onClose={onClose}
            title="Invite People"
            description="Add a new member to this workspace and assign their role."
            width="md"
            footer={
                <div className="flex items-center justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose} className="font-bold text-slate-600 rounded-none">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="invite-user-form"
                        disabled={!isValid || isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                            </>
                        ) : (
                            "Send Invitation"
                        )}
                    </Button>
                </div>
            }
        >
            <form id="invite-user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Full Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input {...register("name")} placeholder="e.g. John Doe" className="rounded-none" />
                    {errors.name && <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Email Address <span className="text-rose-500">*</span>
                    </Label>
                    <Input type="email" {...register("email")} placeholder="name@company.com" className="rounded-none" />
                    {errors.email && <p className="text-[11px] font-semibold text-rose-600">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Role & Permissions
                    </Label>
                    <Select value={role} onValueChange={(v) => setValue("role", v as any, { shouldValidate: true })}>
                        <SelectTrigger className="rounded-none">
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-slate-400" />
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MEMBER">Member (Default)</SelectItem>
                            <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                            <SelectItem value="VIEWER">Viewer (Read Only)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                    They will receive an email with a link to join this workspace. You can change permissions later in settings.
                </p>
            </form>
        </SidePanel>
    )
}
