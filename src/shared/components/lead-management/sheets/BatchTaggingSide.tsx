"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Hash, Plus, X } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { useToast } from "@/shared/components/ui/use-toast"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { validateField } from "../lead-validation"

const PRESET_TAGS = [
    "Enterprise", "VIP", "SaaS", "Startup", "Finance", "Healthcare",
    "Follow-up", "Urgent", "Demo Scheduled", "Hot Lead", "Cold Outreach",
]

interface BatchTaggingSideProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (tags: string[]) => void
    selectedCount: number
}

export default function BatchTaggingSide({
    open, onOpenChange, onConfirm, selectedCount,
}: BatchTaggingSideProps) {
    const { toast } = useToast()
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [customTag, setCustomTag] = useState("")
    const [tagError, setTagError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            setSelectedTags([])
            setCustomTag("")
            setTagError(null)
        }
    }, [open])

    const togglePreset = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        )
    }

    const addCustom = () => {
        const v = customTag.trim()
        if (!v) return
        const err = validateField("customTag", v)
        if (err) {
            setTagError(err)
            return
        }
        if (selectedTags.includes(v)) {
            setTagError("Tag already added")
            return
        }
        setSelectedTags((prev) => [...prev, v])
        setCustomTag("")
        setTagError(null)
    }

    const removeTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedTags.length === 0) {
            toast({
                title: "No tags selected",
                description: "Pick at least one preset or add a custom tag.",
                variant: "destructive",
            })
            return
        }
        onConfirm(selectedTags)
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Batch Tag Management"
            description={`Apply tags to ${selectedCount} selected lead${selectedCount === 1 ? "" : "s"}.`}
            icon={<Hash className="w-5 h-5" />}
            onSubmit={handleSubmit}
            submitLabel={`Apply to ${selectedCount} Lead${selectedCount === 1 ? "" : "s"}`}
            submitDisabled={selectedTags.length === 0}
            width="md"
            accentColor="#6366f1"
        >
            <div className="space-y-5">
                <Field label="Popular Tags" hint="Click to toggle inclusion">
                    <div className="flex flex-wrap gap-1.5">
                        {PRESET_TAGS.map((tag) => {
                            const active = selectedTags.includes(tag)
                            return (
                                <button
                                    type="button"
                                    key={tag}
                                    onClick={() => togglePreset(tag)}
                                    className={`px-2.5 py-1 rounded-none text-[11.5px] font-semibold border transition-all ${
                                        active
                                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                            : "bg-white border-[#E5E7EB] text-[#64748B] hover:border-slate-300"
                                    }`}
                                >
                                    {tag}
                                </button>
                            )
                        })}
                    </div>
                </Field>

                <Field
                    label="Custom Tag"
                    error={tagError ?? undefined}
                    hint="Letters, digits, spaces, _, - · max 30 chars"
                >
                    <div className="flex gap-2">
                        <Input
                            value={customTag}
                            onChange={(e) => { setCustomTag(e.target.value); setTagError(null) }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); addCustom() }
                            }}
                            placeholder="Type a new tag..."
                            className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                        />
                        <Button
                            type="button"
                            onClick={addCustom}
                            variant="outline"
                            className="h-10 px-3 rounded-none border-[#E5E7EB] text-[12.5px]"
                        >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add
                        </Button>
                    </div>
                </Field>

                {selectedTags.length > 0 && (
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
                            Selected ({selectedTags.length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-none gap-1 text-[11.5px] font-medium"
                                >
                                    {tag}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-red-600"
                                        onClick={() => removeTag(tag)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </SideFormSheet>
    )
}
