"use client"

import * as React from "react"
import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import LeadSideForm, {
    type LeadFormShape,
} from "@/shared/components/lead-management/sheets/LeadSideForm"

/**
 * Self-triggered wrapper around the unified `LeadSideForm`.
 *
 * Use this when you want a one-line "Add Lead" button + sheet pair.
 * Use `LeadSideForm` directly when the parent owns the open state
 * (e.g. inbox pages where edit/create are driven from row actions).
 */
interface AddLeadSideFormProps {
    triggerLabel?: string
    onCreated?: (data: LeadFormShape) => void
}

export default function AddLeadSideForm({
    triggerLabel = "Add Lead",
    onCreated,
}: AddLeadSideFormProps) {
    const { toast } = useToast()
    const [open, setOpen] = useState(false)

    const handleSubmit = (data: LeadFormShape) => {
        onCreated?.(data)
        toast({
            title: "Lead created",
            description: `${data.name} added to pipeline.`,
        })
        setOpen(false)
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 px-4 rounded-none shadow-sm transition-colors"
            >
                <Plus className="mr-2 h-4 w-4" /> {triggerLabel}
            </Button>

            <LeadSideForm
                open={open}
                onOpenChange={setOpen}
                onSubmit={handleSubmit}
            />
        </>
    )
}
