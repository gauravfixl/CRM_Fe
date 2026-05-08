"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Filter, Sliders, RotateCcw } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { validateField } from "../lead-validation"

const SOURCES = ["Google", "LinkedIn", "Direct", "Referral", "Web Form", "Twitter", "Campaign", "Other"]
const OWNERS = ["Rajesh Kumar", "Anita Sharma", "Sunil Moitra", "Priya Singh"]
const STATUSES = ["New", "Awaiting Assignment", "Assigned", "SLA Breached", "Inactive", "Stagnant", "Priority"]

export interface FiltersShape {
    source: string
    owner: string
    status: string
    scoreRange: [number, number]
    minProjectValue: string
}

const DEFAULTS: FiltersShape = {
    source: "all",
    owner: "all",
    status: "all",
    scoreRange: [0, 100],
    minProjectValue: "",
}

interface LeadFiltersSideProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentFilters: FiltersShape
    onApply: (filters: FiltersShape) => void
}

export default function LeadFiltersSide({
    open, onOpenChange, currentFilters, onApply,
}: LeadFiltersSideProps) {
    const { toast } = useToast()
    const [filters, setFilters] = useState<FiltersShape>(currentFilters)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (open) {
            setFilters(currentFilters)
            setErrors({})
            setTouched({})
        }
    }, [open, currentFilters])

    const setField = <K extends keyof FiltersShape>(k: K, v: FiltersShape[K]) => {
        setFilters((prev) => ({ ...prev, [k]: v }))
        if (touched[k]) {
            const err = k === "minProjectValue" ? validateField("minProjectValue", v) : null
            setErrors((prev) => ({ ...prev, [k]: err ?? "" }))
        }
    }

    const onBlur = <K extends keyof FiltersShape>(k: K) => {
        setTouched((prev) => ({ ...prev, [k]: true }))
        const err = k === "minProjectValue" ? validateField("minProjectValue", filters[k]) : null
        setErrors((prev) => ({ ...prev, [k]: err ?? "" }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const minErr = validateField("minProjectValue", filters.minProjectValue)
        if (minErr) {
            setErrors({ minProjectValue: minErr })
            setTouched({ minProjectValue: true })
            toast({ title: "Invalid filter value", description: minErr, variant: "destructive" })
            return
        }
        if (filters.scoreRange[0] > filters.scoreRange[1]) {
            toast({
                title: "Invalid score range",
                description: "Min score cannot exceed max score.",
                variant: "destructive",
            })
            return
        }
        onApply(filters)
    }

    const handleReset = () => {
        setFilters(DEFAULTS)
        setErrors({})
        setTouched({})
        onApply(DEFAULTS)
        toast({ title: "Filters reset", description: "All criteria cleared." })
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Advanced Filters"
            description="Narrow the inbox view by source, owner, score, and project value."
            icon={<Sliders className="w-5 h-5" />}
            onSubmit={handleSubmit}
            submitLabel="Apply Filters"
            width="md"
            accentColor="#8b5cf6"
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="h-10 px-4 rounded-none border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
                    >
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-10 px-4 rounded-none border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form={undefined}
                        onClick={(e) => handleSubmit(e as any)}
                        className="h-10 px-5 rounded-none text-white"
                        style={{ background: "#8b5cf6", boxShadow: "0 4px 12px #8b5cf633" }}
                    >
                        Apply Filters
                    </Button>
                </>
            }
        >
            <div className="space-y-5">
                <Field label="Lead Source">
                    <Select value={filters.source} onValueChange={(v) => setField("source", v)}>
                        <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            {SOURCES.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Owner">
                    <Select value={filters.owner} onValueChange={(v) => setField("owner", v)}>
                        <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Owners</SelectItem>
                            {OWNERS.map((o) => (
                                <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Status">
                    <Select value={filters.status} onValueChange={(v) => setField("status", v)}>
                        <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field
                    label="Score Range"
                    hint={`Currently ${filters.scoreRange[0]} – ${filters.scoreRange[1]}`}
                >
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            value={filters.scoreRange[0]}
                            onChange={(e) => setField("scoreRange", [Number(e.target.value) || 0, filters.scoreRange[1]])}
                            placeholder="Min"
                            className="h-10 rounded-none border-[#E5E7EB] text-[13px] tabular-nums"
                        />
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            value={filters.scoreRange[1]}
                            onChange={(e) => setField("scoreRange", [filters.scoreRange[0], Number(e.target.value) || 100])}
                            placeholder="Max"
                            className="h-10 rounded-none border-[#E5E7EB] text-[13px] tabular-nums"
                        />
                    </div>
                </Field>

                <Field
                    label="Min Project Value"
                    error={touched.minProjectValue ? errors.minProjectValue : undefined}
                    hint="e.g. 25000, $1.2M, ₹5,00,000 — leave blank for no minimum"
                >
                    <Input
                        value={filters.minProjectValue}
                        onChange={(e) => setField("minProjectValue", e.target.value)}
                        onBlur={() => onBlur("minProjectValue")}
                        placeholder="$25,000"
                        className="h-10 rounded-none border-[#E5E7EB] text-[13px] tabular-nums"
                    />
                </Field>
            </div>
        </SideFormSheet>
    )
}
