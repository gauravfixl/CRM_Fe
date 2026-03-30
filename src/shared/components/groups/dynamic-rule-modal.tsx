"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Zap, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface DynamicRuleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onRuleCreated?: (rule: RuleData) => void
}

export interface RuleData {
    id: string
    name: string
    targetGroup: string
    conditions: RuleCondition[]
    action: string
    status: string
}

interface RuleCondition {
    id: string
    attribute: string
    operator: string
    value: string
}

export function DynamicRuleModal({ open, onOpenChange, onRuleCreated }: DynamicRuleModalProps) {
    const [loading, setLoading] = useState(false)
    const [ruleName, setRuleName] = useState("")
    const [targetGroup, setTargetGroup] = useState("")
    const [action, setAction] = useState("add")
    const [conditions, setConditions] = useState<RuleCondition[]>([
        { id: "1", attribute: "department", operator: "equals", value: "" }
    ])

    const addCondition = () => {
        setConditions(prev => [...prev, {
            id: Date.now().toString(),
            attribute: "department",
            operator: "equals",
            value: ""
        }])
    }

    const removeCondition = (id: string) => {
        if (conditions.length <= 1) return
        setConditions(prev => prev.filter(c => c.id !== id))
    }

    const updateCondition = (id: string, field: keyof RuleCondition, value: string) => {
        setConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
    }

    const handleSubmit = async () => {
        if (!ruleName.trim()) {
            toast.error("Rule name is required")
            return
        }
        if (!targetGroup.trim()) {
            toast.error("Target group is required")
            return
        }
        if (conditions.some(c => !c.value.trim())) {
            toast.error("All condition values must be filled")
            return
        }

        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            const rule: RuleData = {
                id: Date.now().toString(),
                name: ruleName,
                targetGroup,
                conditions,
                action,
                status: "Active",
            }
            onRuleCreated?.(rule)
            toast.success(`Rule "${ruleName}" created successfully`)
            resetForm()
            onOpenChange(false)
        } catch {
            toast.error("Failed to create rule")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setRuleName("")
        setTargetGroup("")
        setAction("add")
        setConditions([{ id: "1", attribute: "department", operator: "equals", value: "" }])
    }

    const handleClose = (value: boolean) => {
        if (!value) resetForm()
        onOpenChange(value)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[580px] rounded-none p-0 gap-0 max-h-[90vh] overflow-y-auto">
                <div className="p-6 pb-4 bg-amber-50 dark:bg-amber-950/30">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-600" />
                            <DialogTitle className="text-lg font-bold">Create Dynamic Rule</DialogTitle>
                        </div>
                        <DialogDescription>
                            Automatically add or remove users from groups based on their attributes.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Rule Name *</Label>
                            <Input
                                placeholder="e.g. Auto-add Engineering dept"
                                className="rounded-none h-10"
                                value={ruleName}
                                onChange={(e) => setRuleName(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Target Group *</Label>
                            <Input
                                placeholder="e.g. Engineering Team"
                                className="rounded-none h-10"
                                value={targetGroup}
                                onChange={(e) => setTargetGroup(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Action</Label>
                            <Select value={action} onValueChange={setAction}>
                                <SelectTrigger className="rounded-none h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="add">Add to Group</SelectItem>
                                    <SelectItem value="remove">Remove from Group</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs text-zinc-500 mb-0">Conditions (match ALL)</Label>
                            <CustomButton variant="ghost" size="sm" className="rounded-none h-7 text-xs" onClick={addCondition}>
                                <Plus className="w-3 h-3 mr-1" /> Add Condition
                            </CustomButton>
                        </div>

                        {conditions.map((condition) => (
                            <div key={condition.id} className="flex items-center gap-2 p-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                                <Select value={condition.attribute} onValueChange={(v) => updateCondition(condition.id, "attribute", v)}>
                                    <SelectTrigger className="rounded-none h-9 w-36 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="department">Department</SelectItem>
                                        <SelectItem value="title">Job Title</SelectItem>
                                        <SelectItem value="location">Location</SelectItem>
                                        <SelectItem value="role">Role</SelectItem>
                                        <SelectItem value="email_domain">Email Domain</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={condition.operator} onValueChange={(v) => updateCondition(condition.id, "operator", v)}>
                                    <SelectTrigger className="rounded-none h-9 w-28 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="equals">Equals</SelectItem>
                                        <SelectItem value="contains">Contains</SelectItem>
                                        <SelectItem value="starts_with">Starts With</SelectItem>
                                        <SelectItem value="not_equals">Not Equals</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder="Value..."
                                    className="rounded-none h-9 flex-1 text-xs"
                                    value={condition.value}
                                    onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                                />

                                <CustomButton
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-none text-zinc-400 hover:text-red-500"
                                    onClick={() => removeCondition(condition.id)}
                                    disabled={conditions.length <= 1}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </CustomButton>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <CustomButton variant="outline" className="rounded-none" onClick={() => handleClose(false)} disabled={loading}>
                        Cancel
                    </CustomButton>
                    <CustomButton className="rounded-none bg-primary text-white" onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create Rule
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
