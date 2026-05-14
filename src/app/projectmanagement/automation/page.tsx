"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Zap,
    Plus,
    Play,
    Pause,
    Trash2,
    ChevronRight,
    Bot,
    CheckCircle2,
    Loader2,
    Edit3
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import SidePanel from "@/shared/components/projectmanagement/side-panel"
import { useAutomationStore, type TriggerType, type ActionType, type AutomationRule } from "@/shared/data/automation-store"

const TRIGGERS: { value: TriggerType; label: string }[] = [
    { value: "ISSUE_CREATED", label: "Issue is created" },
    { value: "ISSUE_UPDATED", label: "Issue is updated" },
    { value: "STATUS_CHANGED", label: "Status changes" },
    { value: "DUE_DATE_REACHED", label: "Due date reached" },
    { value: "ASSIGNED", label: "Issue assigned" },
]
const ACTIONS: { value: ActionType; label: string }[] = [
    { value: "ASSIGN_USER", label: "Assign user" },
    { value: "ADD_COMMENT", label: "Add comment" },
    { value: "MOVE_TO_STATUS", label: "Move to status" },
    { value: "NOTIFY_SLACK", label: "Notify Slack" },
    { value: "SET_PRIORITY", label: "Set priority" },
]

const schema = z.object({
    name: z.string().trim().min(2, "Rule name must be at least 2 characters").max(80),
    description: z.string().max(300).optional().or(z.literal("")),
    trigger: z.enum(["ISSUE_CREATED", "ISSUE_UPDATED", "STATUS_CHANGED", "DUE_DATE_REACHED", "ASSIGNED"]),
    action: z.enum(["ASSIGN_USER", "ADD_COMMENT", "MOVE_TO_STATUS", "NOTIFY_SLACK", "SET_PRIORITY"]),
})
type FormValues = z.infer<typeof schema>

export default function AutomationPage() {
    const [mounted, setMounted] = useState(false)
    const { rules, addRule, updateRule, deleteRule, toggleRule } = useAutomationStore()
    const [isOpen, setIsOpen] = useState(false)
    const [editing, setEditing] = useState<AutomationRule | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all")

    useEffect(() => {
        setMounted(true)
        useAutomationStore.persist.rehydrate()
    }, [])

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { name: "", description: "", trigger: "ISSUE_CREATED", action: "ASSIGN_USER" },
    })

    const trigger = watch("trigger")
    const action = watch("action")

    useEffect(() => {
        if (isOpen && editing) {
            reset({
                name: editing.name,
                description: editing.description,
                trigger: editing.trigger,
                action: editing.action,
            })
        } else if (isOpen) {
            reset({ name: "", description: "", trigger: "ISSUE_CREATED", action: "ASSIGN_USER" })
        }
    }, [isOpen, editing, reset])

    if (!mounted) return null

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 200))
        if (editing) {
            updateRule(editing.id, {
                name: values.name,
                description: values.description || "",
                trigger: values.trigger,
                action: values.action,
            })
        } else {
            addRule({
                name: values.name,
                description: values.description || "",
                trigger: values.trigger,
                action: values.action,
                enabled: true,
            })
        }
        setIsLoading(false)
        setIsOpen(false)
        setEditing(null)
        reset()
    }

    const filteredRules = rules.filter(r => filter === "all" || (filter === "enabled" ? r.enabled : !r.enabled))

    const kpis = [
        { label: "Total Rules", value: rules.length, icon: <Bot size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", click: () => setFilter("all") },
        { label: "Active", value: rules.filter(r => r.enabled).length, icon: <Play size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", click: () => setFilter("enabled") },
        { label: "Disabled", value: rules.filter(r => !r.enabled).length, icon: <Pause size={18} />, color: "text-amber-800", bg: "bg-amber-100", click: () => setFilter("disabled") },
        { label: "Runs (Total)", value: rules.reduce((s, r) => s + r.runs, 0), icon: <Zap size={18} />, color: "text-rose-800", bg: "bg-rose-100", click: () => setFilter("all") },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Zap size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Automation</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Rules that fire when something happens in your projects.
                    </p>
                </div>
                <Button onClick={() => { setEditing(null); setIsOpen(true) }} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <Plus size={14} strokeWidth={3} /> New Rule
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={stat.click}
                        className={`block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer text-left ${stat.bg}`}
                    >
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-500/60" />
                        </div>
                    </button>
                ))}
            </div>

            <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                {filteredRules.length === 0 ? (
                    <div className="py-12 text-center">
                        <Bot size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No automation rules yet.</p>
                        <Button onClick={() => { setEditing(null); setIsOpen(true) }} className="mt-3 h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 rounded-none">
                            <Plus size={14} strokeWidth={3} /> Create your first rule
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filteredRules.map(rule => (
                            <div key={rule.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors">
                                <div className={`h-9 w-9 flex items-center justify-center rounded-none ${rule.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                                    {rule.enabled ? <CheckCircle2 size={16} /> : <Pause size={16} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 truncate">{rule.name}</h4>
                                    <p className="text-[11px] font-medium text-slate-500 truncate">{rule.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className="bg-indigo-50 text-indigo-700 text-[9px] font-bold rounded-none">
                                            When: {TRIGGERS.find(t => t.value === rule.trigger)?.label}
                                        </Badge>
                                        <Badge className="bg-amber-50 text-amber-700 text-[9px] font-bold rounded-none">
                                            Then: {ACTIONS.find(a => a.value === rule.action)?.label}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center text-[11px] font-bold text-slate-500 gap-1">
                                    <Zap size={12} />
                                    {rule.runs} runs
                                </div>
                                <button type="button" onClick={() => toggleRule(rule.id)} className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-none" aria-label="Toggle rule">
                                    {rule.enabled ? <Pause size={16} /> : <Play size={16} />}
                                </button>
                                <button type="button" onClick={() => { setEditing(rule); setIsOpen(true) }} className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-none">
                                    <Edit3 size={16} />
                                </button>
                                <button type="button" onClick={() => { if (confirm("Delete this automation rule?")) deleteRule(rule.id) }} className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-none" aria-label="Delete rule">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <SidePanel
                open={isOpen}
                onClose={() => { setIsOpen(false); setEditing(null) }}
                title={editing ? "Edit Automation Rule" : "Create Automation Rule"}
                description="Fire an action automatically when a trigger condition is met."
                width="lg"
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditing(null) }} className="font-bold text-slate-600 rounded-none">Cancel</Button>
                        <Button type="submit" form="create-rule-form" disabled={!isValid || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : editing ? "Save Changes" : "Create Rule"}
                        </Button>
                    </div>
                }
            >
                <form id="create-rule-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rule Name <span className="text-rose-500">*</span></Label>
                        <Input {...register("name")} placeholder="e.g. Auto-assign bugs" className="rounded-none" />
                        {errors.name && <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                        <Textarea {...register("description")} placeholder="What does this rule do?" className="min-h-[90px] resize-none rounded-none" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">When (Trigger)</Label>
                        <Select value={trigger} onValueChange={(v) => setValue("trigger", v as TriggerType, { shouldValidate: true })}>
                            <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{TRIGGERS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Then (Action)</Label>
                        <Select value={action} onValueChange={(v) => setValue("action", v as ActionType, { shouldValidate: true })}>
                            <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{ACTIONS.map(a => <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </form>
            </SidePanel>
        </div>
    )
}
