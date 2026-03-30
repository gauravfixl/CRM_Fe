"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ReleaseGroupModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    groupName?: string
    groupId?: string
    onGroupReleased?: (groupId: string) => void
}

export function ReleaseGroupModal({ open, onOpenChange, groupName, groupId, onGroupReleased }: ReleaseGroupModalProps) {
    const [loading, setLoading] = useState(false)
    const [confirmation, setConfirmation] = useState("")

    const handleSubmit = async () => {
        if (confirmation !== groupName) {
            toast.error("Please type the group name to confirm")
            return
        }

        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            onGroupReleased?.(groupId || "")
            toast.success(`Group "${groupName}" has been released and moved to deleted groups`)
            setConfirmation("")
            onOpenChange(false)
        } catch {
            toast.error("Failed to release group")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = (value: boolean) => {
        if (!value) setConfirmation("")
        onOpenChange(value)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[440px] rounded-none p-0 gap-0">
                <div className="p-6 pb-4 bg-red-50 dark:bg-red-950/30">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-5 h-5 text-red-600" />
                            <DialogTitle className="text-lg font-bold text-red-700 dark:text-red-400">Release Group</DialogTitle>
                        </div>
                        <DialogDescription className="text-red-600/80">
                            This action will move the group to deleted items. It can be restored within 30 days.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold text-red-700 dark:text-red-400">Warning</p>
                            <p className="text-red-600/80 mt-1">
                                All members will lose their group-based access. Linked resources and permissions will be revoked immediately.
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            Type <span className="font-semibold text-zinc-900 dark:text-white">{groupName}</span> to confirm:
                        </p>
                        <Input
                            placeholder="Type group name..."
                            className="rounded-none h-10"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <CustomButton variant="outline" className="rounded-none" onClick={() => handleClose(false)} disabled={loading}>
                        Cancel
                    </CustomButton>
                    <CustomButton
                        className="rounded-none bg-red-600 text-white hover:bg-red-700"
                        onClick={handleSubmit}
                        disabled={loading || confirmation !== groupName}
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Release Group
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
