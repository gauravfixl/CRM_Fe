"use client"

import * as React from "react"
import { useState } from "react"
import { GitBranch, Save } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"

interface WorkflowRow {
    key: string
    label: string
    enabled: boolean
    threshold: string
    approver: string
}

const ROLES = ["Manager", "SCM Manager", "Senior Manager", "Director", "CFO"]

const initial: WorkflowRow[] = [
    { key: "purchaseRequest", label: "Purchase Request Approval", enabled: true, threshold: "0", approver: "Manager" },
    { key: "purchaseOrder", label: "Purchase Order Approval", enabled: true, threshold: "50000", approver: "SCM Manager" },
    { key: "stockAdjustment", label: "Stock Adjustment Approval", enabled: true, threshold: "0", approver: "Manager" },
    { key: "returnApproval", label: "Return Approval", enabled: true, threshold: "0", approver: "SCM Manager" },
    { key: "vendorApproval", label: "Vendor Approval", enabled: false, threshold: "0", approver: "SCM Manager" },
]

export default function ApprovalWorkflowPage() {
    const { toast } = useToast()
    const [rows, setRows] = useState<WorkflowRow[]>(initial)

    const update = (key: string, patch: Partial<WorkflowRow>) =>
        setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)))

    const onSave = () => {
        toast({ title: "Workflow saved", description: "Approval rules updated." })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Approval Workflow</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Configure approval requirements for procurement, stock and vendor actions.</p>
                </div>
                <Button onClick={onSave} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                    <Save className="w-4 h-4 mr-1.5" /> Save Workflow
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm overflow-hidden">
                <table className="w-full text-[13px]">
                    <thead className="bg-[#F8FAFC] border-b border-[#EEF1F6]">
                        <tr className="text-[11.5px] uppercase tracking-wide text-[#64748B]">
                            <th className="text-left px-4 py-2.5 font-semibold">Action</th>
                            <th className="text-center px-4 py-2.5 font-semibold w-[100px]">Required</th>
                            <th className="text-left px-4 py-2.5 font-semibold w-[200px]">Threshold (₹)</th>
                            <th className="text-left px-4 py-2.5 font-semibold w-[200px]">Approver Role</th>
                            <th className="w-[80px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.key} className="border-b border-[#F1F5F9] last:border-0">
                                <td className="px-4 py-3">
                                    <p className="font-medium text-[#0F172A]">{r.label}</p>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Switch checked={r.enabled} onCheckedChange={(v) => update(r.key, { enabled: v })} />
                                </td>
                                <td className="px-4 py-3">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={r.threshold}
                                        onChange={(e) => update(r.key, { threshold: e.target.value })}
                                        disabled={!r.enabled}
                                        className="h-9 border-[#E5E7EB] text-[13px] tabular-nums"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <Select value={r.approver} onValueChange={(v) => update(r.key, { approver: v })} disabled={!r.enabled}>
                                        <SelectTrigger className="h-9 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                                        <SelectContent>{ROLES.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent>
                                    </Select>
                                </td>
                                <td className="px-4 py-3 text-right text-[#94A3B8]">
                                    <GitBranch className="w-4 h-4 ml-auto" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
