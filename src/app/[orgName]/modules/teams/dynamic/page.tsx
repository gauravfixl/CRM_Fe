"use client"

import React, { useState } from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Zap, Plus, Search, MoreHorizontal, Trash2, Edit3, Play, Pause, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CustomButton } from "@/components/custom/CustomButton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DynamicRuleModal, RuleData } from "@/components/groups/dynamic-rule-modal"
import { toast } from "sonner"

export default function DynamicMembershipPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [rules, setRules] = useState<RuleData[]>([])
    const [createRuleOpen, setCreateRuleOpen] = useState(false)

    const handleRuleCreated = (rule: RuleData) => {
        setRules(prev => [...prev, rule])
    }

    const toggleRuleStatus = (ruleId: string) => {
        setRules(prev => prev.map(r => {
            if (r.id === ruleId) {
                const newStatus = r.status === "Active" ? "Paused" : "Active"
                toast.success(`Rule "${r.name}" ${newStatus === "Active" ? "activated" : "paused"}`)
                return { ...r, status: newStatus }
            }
            return r
        }))
    }

    const deleteRule = (ruleId: string) => {
        const rule = rules.find(r => r.id === ruleId)
        setRules(prev => prev.filter(r => r.id !== ruleId))
        toast.success(`Rule "${rule?.name}" deleted`)
    }

    const filteredRules = rules.filter(r =>
        !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.targetGroup.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const operatorLabel = (op: string) => {
        switch (op) {
            case "equals": return "="
            case "contains": return "contains"
            case "starts_with": return "starts with"
            case "not_equals": return "!="
            default: return op
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Dynamic Membership Rules"
                breadcrumbItems={[
                    { label: "Identity", href: "/modules/teams" },
                    { label: "Automation", href: "/modules/teams/dynamic" }
                ]}
                rightControls={
                    <Button
                        className="h-8 gap-2 rounded-none bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-[10px]"
                        onClick={() => setCreateRuleOpen(true)}
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New Rule
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                {rules.length > 0 && (
                    <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 border-none focus-visible:ring-0 rounded-none h-10 bg-transparent font-medium text-sm"
                                placeholder="Search rules..."
                            />
                        </div>
                    </div>
                )}

                {filteredRules.length === 0 && rules.length === 0 ? (
                    <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Automation Rules</CardTitle>
                            <CardDescription>Automatically add or remove users from groups based on their attributes.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 m-6 rounded-none">
                            <div className="text-center text-zinc-500">
                                <Zap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No active rules</p>
                                <Button variant="link" className="text-amber-600" onClick={() => setCreateRuleOpen(true)}>
                                    Create dynamic rule
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredRules.map((rule) => (
                            <Card key={rule.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-amber-500">
                                <div className="flex items-center justify-between p-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 rounded-none">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{rule.name}</h3>
                                                <Badge className={`rounded-none text-[10px] px-2 py-0.5 border ${rule.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-zinc-50 text-zinc-500 border-zinc-200"}`}>
                                                    {rule.status === "Active" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                                                    {rule.status}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-zinc-400 mt-1">
                                                Target: <span className="font-medium text-zinc-600 dark:text-zinc-300">{rule.targetGroup}</span>
                                                {" | "}Action: <span className="font-medium">{rule.action === "add" ? "Add to Group" : "Remove from Group"}</span>
                                            </p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {rule.conditions.map((cond) => (
                                                    <Badge key={cond.id} className="rounded-none bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5">
                                                        {cond.attribute} {operatorLabel(cond.operator)} &quot;{cond.value}&quot;
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CustomButton
                                            variant="outline"
                                            size="sm"
                                            className="rounded-none h-8 text-xs"
                                            onClick={() => toggleRuleStatus(rule.id)}
                                        >
                                            {rule.status === "Active" ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                                            {rule.status === "Active" ? "Pause" : "Activate"}
                                        </CustomButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none">
                                                <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => toast.info("Edit rule coming soon")}>
                                                    <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-xs text-red-600 cursor-pointer" onClick={() => deleteRule(rule.id)}>
                                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Rule
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <div
                            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-center gap-3 hover:border-amber-300 transition-all cursor-pointer rounded-none"
                            onClick={() => setCreateRuleOpen(true)}
                        >
                            <Plus className="w-4 h-4 text-amber-400" />
                            <p className="text-xs font-semibold text-zinc-400">Add Another Rule</p>
                        </div>
                    </div>
                )}
            </div>

            <DynamicRuleModal open={createRuleOpen} onOpenChange={setCreateRuleOpen} onRuleCreated={handleRuleCreated} />
        </div>
    )
}
