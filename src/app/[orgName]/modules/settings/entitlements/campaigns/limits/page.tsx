"use client"

import React, { useState, useMemo } from "react"
import {
    Send,
    Clock,
    AlertTriangle,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Pencil,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/shared/utils/toast"

type SendLimit = {
    id: string
    channel: string
    dailyLimit: number
    currentUsage: number
    percentage: number
    status: "Active" | "Paused"
    throttle: boolean
}

const channelOptions = ["Email", "Sms", "Push Notifications", "Whatsapp", "Voice"]

export default function DailySendLimitsPage() {
    const [showFormModal, setShowFormModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [limits, setLimits] = useState<SendLimit[]>([
        { id: "1", channel: "Email", dailyLimit: 10000, currentUsage: 7420, percentage: 74, status: "Active", throttle: true },
        { id: "2", channel: "Sms", dailyLimit: 5000, currentUsage: 3200, percentage: 64, status: "Active", throttle: true },
        { id: "3", channel: "Push Notifications", dailyLimit: 50000, currentUsage: 42000, percentage: 84, status: "Active", throttle: false },
    ])

    const [form, setForm] = useState({
        channel: "Email",
        dailyLimit: "",
        throttle: true,
    })
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const errors = useMemo(() => {
        const e: Record<string, string> = {}
        if (touched.dailyLimit) {
            const n = parseInt(form.dailyLimit, 10)
            if (!form.dailyLimit.trim()) e.dailyLimit = "Daily limit is required"
            else if (isNaN(n) || n <= 0) e.dailyLimit = "Enter a positive number"
            else if (n > 10_000_000) e.dailyLimit = "Limit seems too high"
        }
        return e
    }, [form, touched])

    const resetForm = () => {
        setForm({ channel: "Email", dailyLimit: "", throttle: true })
        setTouched({})
        setEditingId(null)
    }

    const openCreateModal = () => {
        resetForm()
        setShowFormModal(true)
    }

    const openEditModal = (l: SendLimit) => {
        setEditingId(l.id)
        setForm({
            channel: l.channel,
            dailyLimit: String(l.dailyLimit),
            throttle: l.throttle,
        })
        setTouched({})
        setShowFormModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ dailyLimit: true })
        const n = parseInt(form.dailyLimit, 10)
        if (isNaN(n) || n <= 0) return showWarning("Enter a valid daily limit")

        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            if (editingId) {
                setLimits((prev) =>
                    prev.map((l) =>
                        l.id === editingId
                            ? {
                                  ...l,
                                  channel: form.channel,
                                  dailyLimit: n,
                                  percentage: Math.round((l.currentUsage / n) * 100),
                                  throttle: form.throttle,
                              }
                            : l
                    )
                )
                showSuccess(`${form.channel} limit updated`)
            } else {
                setLimits((prev) => [
                    ...prev,
                    {
                        id: String(Date.now()),
                        channel: form.channel,
                        dailyLimit: n,
                        currentUsage: 0,
                        percentage: 0,
                        status: "Active",
                        throttle: form.throttle,
                    },
                ])
                showSuccess(`${form.channel} channel added`)
            }
            setShowFormModal(false)
            resetForm()
        } finally {
            setSubmitting(false)
        }
    }

    const toggleStatus = (id: string) => {
        setLimits((prev) =>
            prev.map((l) =>
                l.id === id ? { ...l, status: l.status === "Active" ? "Paused" : "Active" } : l
            )
        )
        showSuccess("Channel status updated")
    }

    const toggleThrottle = (id: string) => {
        setLimits((prev) =>
            prev.map((l) => (l.id === id ? { ...l, throttle: !l.throttle } : l))
        )
        showSuccess("Throttling updated")
    }

    const deleteLimit = (id: string) => {
        const l = limits.find((x) => x.id === id)
        if (!l) return
        const ok = window.confirm(`Delete ${l.channel} channel limit?`)
        if (!ok) return
        setLimits((prev) => prev.filter((x) => x.id !== id))
        showSuccess("Channel limit deleted")
    }

    const filtered = limits.filter((l) =>
        l.channel.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalSent = limits.reduce((sum, l) => sum + l.currentUsage, 0)
    const avgUsage = limits.length
        ? Math.round(limits.reduce((s, l) => s + l.percentage, 0) / limits.length)
        : 0
    const throttledCount = limits.filter((l) => l.throttle).length

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Daily Send Limits</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Manage sending limits to prevent spam and ensure deliverability.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4 shadow-md shadow-primary/20"
                    >
                        <Plus size={14} />
                        Add Channel
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Active Channels</p>
                        <p className="text-white text-xl font-semibold mt-1">{limits.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">With limits</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Sent Today</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">
                            {totalSent.toLocaleString()}
                        </p>
                        <p className="text-primary text-[10px] mt-1">Messages delivered</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Avg. Usage</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{avgUsage}%</p>
                        <p className="text-amber-600 text-[10px] mt-1">Of daily limits</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Throttling</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{throttledCount}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Channels protected</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <Input
                                placeholder="Search channels..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 rounded-none border-gray-200 h-9 text-xs focus:ring-primary bg-white"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Channel</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Daily Limit</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Current Usage</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Usage %</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Throttling</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((l) => (
                                    <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Send size={14} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">{l.channel}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                            {l.dailyLimit.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-gray-400" />
                                                <span className="text-sm text-gray-700">
                                                    {l.currentUsage.toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1.5 min-w-[180px]">
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className={`text-xs font-semibold ${
                                                            l.percentage >= 90
                                                                ? "text-red-600"
                                                                : l.percentage >= 75
                                                                ? "text-amber-600"
                                                                : "text-emerald-600"
                                                        }`}
                                                    >
                                                        {l.percentage}%
                                                    </span>
                                                    {l.percentage >= 90 && (
                                                        <Badge className="rounded-none bg-red-50 text-red-700 border border-red-200 text-[10px] font-medium px-1.5 py-0 flex items-center gap-1 hover:bg-red-50">
                                                            <AlertTriangle size={10} /> Near limit
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Progress value={l.percentage} className="h-1.5 bg-gray-100" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={l.throttle}
                                                    onCheckedChange={() => toggleThrottle(l.id)}
                                                />
                                                <Badge
                                                    className={`rounded-none text-[10px] font-medium px-2 py-0.5 ${
                                                        l.throttle
                                                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                                                            : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                                                    }`}
                                                >
                                                    {l.throttle ? "Enabled" : "Disabled"}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={l.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(l.id)}
                                                />
                                                <Badge
                                                    className={`rounded-none text-[10px] font-medium px-2 py-0.5 ${
                                                        l.status === "Active"
                                                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                                                            : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                                                    }`}
                                                >
                                                    {l.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-none transition-colors">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none min-w-[150px]">
                                                    <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400">
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => openEditModal(l)}
                                                        className="text-xs font-medium cursor-pointer gap-2"
                                                    >
                                                        <Edit size={13} />
                                                        Edit limit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteLimit(l.id)}
                                                        className="text-xs font-medium text-red-600 focus:text-red-600 cursor-pointer gap-2"
                                                    >
                                                        <Trash2 size={13} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-xs text-gray-400">
                                            No channel limits found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                        <p className="text-xs text-gray-500">
                            Showing {filtered.length} of {limits.length} channels
                        </p>
                    </div>
                </div>
            </div>

            {/* Create / Edit side sheet */}
            <SideFormSheet
                open={showFormModal}
                onOpenChange={(o) => {
                    setShowFormModal(o)
                    if (!o) resetForm()
                }}
                title={editingId ? "Edit Send Limit" : "Add Send Limit"}
                description={
                    editingId
                        ? "Update the daily send limit for this channel."
                        : "Configure a daily send limit for a new channel."
                }
                icon={editingId ? <Pencil className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                width="md"
                onSubmit={handleSubmit}
                submitLabel={editingId ? "Save Changes" : "Add Channel"}
                loading={submitting}
            >
                <div className="space-y-4">
                    <Field label="Channel">
                        <Select
                            value={form.channel}
                            onValueChange={(v) => setForm((f) => ({ ...f, channel: v }))}
                        >
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent>
                                {channelOptions.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field
                        label="Daily Limit"
                        required
                        error={errors.dailyLimit}
                        hint="Maximum messages per day"
                    >
                        <Input
                            type="number"
                            placeholder="10000"
                            value={form.dailyLimit}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    dailyLimit: e.target.value.replace(/[^0-9]/g, ""),
                                }))
                            }
                            onBlur={() => setTouched((t) => ({ ...t, dailyLimit: true }))}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary font-mono"
                            min={0}
                        />
                    </Field>

                    <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg bg-[#FAFBFC]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Enable Throttling</p>
                            <p className="text-[11.5px] text-[#64748B] mt-0.5">
                                Distribute sends evenly throughout the day.
                            </p>
                        </div>
                        <Switch
                            checked={form.throttle}
                            onCheckedChange={(v) => setForm((f) => ({ ...f, throttle: v }))}
                        />
                    </div>
                </div>
            </SideFormSheet>
        </div>
    )
}
