"use client"

import { useState } from "react"
import { Receipt, Plus, Search, MoreVertical, Pencil, Trash2, IndianRupee, Plane, Car, Coffee, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/utils/toast"

interface ExpensePolicy {
    id: string
    name: string
    category: "Travel" | "Meals" | "Office" | "Communication" | "Medical" | "Other"
    maxAmount: number
    frequency: "Per Day" | "Per Month" | "Per Trip" | "Per Year"
    requiresReceipt: boolean
    requiresApproval: boolean
    isActive: boolean
}

const INITIAL_POLICIES: ExpensePolicy[] = [
    { id: "1", name: "Domestic Air Travel", category: "Travel", maxAmount: 15000, frequency: "Per Trip", requiresReceipt: true, requiresApproval: true, isActive: true },
    { id: "2", name: "Local Conveyance", category: "Travel", maxAmount: 1500, frequency: "Per Day", requiresReceipt: true, requiresApproval: false, isActive: true },
    { id: "3", name: "Daily Meals Allowance", category: "Meals", maxAmount: 500, frequency: "Per Day", requiresReceipt: false, requiresApproval: false, isActive: true },
    { id: "4", name: "Hotel Stay", category: "Travel", maxAmount: 5000, frequency: "Per Day", requiresReceipt: true, requiresApproval: true, isActive: true },
    { id: "5", name: "Mobile Reimbursement", category: "Communication", maxAmount: 1000, frequency: "Per Month", requiresReceipt: true, requiresApproval: false, isActive: true },
    { id: "6", name: "Medical Emergency", category: "Medical", maxAmount: 50000, frequency: "Per Year", requiresReceipt: true, requiresApproval: true, isActive: true },
]

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    Travel: <Plane className="w-4 h-4" />,
    Meals: <Coffee className="w-4 h-4" />,
    Office: <Wallet className="w-4 h-4" />,
    Communication: <Receipt className="w-4 h-4" />,
    Medical: <Receipt className="w-4 h-4" />,
    Other: <Receipt className="w-4 h-4" />,
}

const CATEGORY_COLORS: Record<string, string> = {
    Travel: "bg-primary/10 text-primary border-primary/10",
    Meals: "bg-amber-50 text-amber-600 border-amber-100",
    Office: "bg-zinc-50 text-zinc-600 border-zinc-200",
    Communication: "bg-violet-50 text-violet-600 border-violet-100",
    Medical: "bg-rose-50 text-rose-600 border-rose-100",
    Other: "bg-zinc-50 text-zinc-600 border-zinc-200",
}

const DEFAULT_NEW = {
    name: "",
    category: "Travel" as ExpensePolicy["category"],
    maxAmount: 0,
    frequency: "Per Trip" as ExpensePolicy["frequency"],
    requiresReceipt: true,
    requiresApproval: true,
}

export default function ExpensePoliciesPage() {
    const [policies, setPolicies] = useState<ExpensePolicy[]>(INITIAL_POLICIES)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<ExpensePolicy | null>(null)
    const [newItem, setNewItem] = useState(DEFAULT_NEW)

    const filtered = policies.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalBudget = policies.filter((p) => p.isActive).reduce((s, p) => s + p.maxAmount, 0)
    const approvalRequired = policies.filter((p) => p.requiresApproval && p.isActive).length
    const activeCount = policies.filter((p) => p.isActive).length

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItem.name.trim()) return showWarning("Policy name is required")
        if (newItem.maxAmount <= 0) return showWarning("Max amount must be greater than 0")
        setPolicies([...policies, { ...newItem, id: Date.now().toString(), isActive: true }])
        setIsCreateOpen(false)
        setNewItem(DEFAULT_NEW)
        showSuccess("Expense policy created")
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editItem) return
        setPolicies(policies.map((p) => (p.id === editItem.id ? editItem : p)))
        setIsEditOpen(false)
        setEditItem(null)
        showSuccess("Policy updated")
    }

    const handleDelete = (id: string) => {
        const confirmed = window.confirm("Remove this policy?")
        if (!confirmed) return
        setPolicies(policies.filter((p) => p.id !== id))
        showSuccess("Policy removed")
    }

    const toggleActive = (id: string) => {
        setPolicies(policies.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Expense Policies</h1>
                        <p className="text-sm text-zinc-500 mt-1">Define reimbursement limits, categories, and approval rules for employee expenses.</p>
                    </div>
                    <Button
                        onClick={() => { setNewItem(DEFAULT_NEW); setIsCreateOpen(true) }}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Plus size={14} /> New Policy
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Policies</p>
                        <p className="text-white text-xl font-semibold mt-1">{policies.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Reimbursement rules</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Active</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{activeCount}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Currently enabled</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Max Combined</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">₹{totalBudget.toLocaleString()}</p>
                        <p className="text-primary text-[10px] mt-1">Sum of all limits</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Approval Required</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{approvalRequired}</p>
                        <p className="text-amber-600 text-[10px] mt-1">Need manager sign-off</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search policies or categories..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Policy</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Category</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Limit</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Frequency</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Receipt</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Active</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <Receipt className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">No policies found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((p) => (
                                        <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2.5 rounded-none border ${CATEGORY_COLORS[p.category]}`}>
                                                        {CATEGORY_ICONS[p.category]}
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`text-[10px] rounded-none px-2 py-0.5 font-medium ${CATEGORY_COLORS[p.category]}`}>{p.category}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center text-xs font-semibold text-gray-900">₹{p.maxAmount.toLocaleString()}</td>
                                            <td className="px-6 py-3 text-center text-xs text-gray-600">{p.frequency}</td>
                                            <td className="px-6 py-3 text-center text-xs text-gray-600">{p.requiresReceipt ? "Required" : "Optional"}</td>
                                            <td className="px-6 py-3 text-center">
                                                <Switch checked={p.isActive} onCheckedChange={() => toggleActive(p.id)} className="scale-90" />
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-none">
                                                            <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-none">
                                                        <DropdownMenuItem onClick={() => { setEditItem({ ...p }); setIsEditOpen(true) }} className="text-xs gap-2">
                                                            <Pencil size={12} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-600 text-xs gap-2" onClick={() => handleDelete(p.id)}>
                                                            <Trash2 size={12} /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create */}
            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={(o) => { setIsCreateOpen(o); if (!o) setNewItem(DEFAULT_NEW) }}
                title="New Expense Policy"
                description="Define reimbursement rules for a new category of expenses."
                icon={<Receipt className="w-5 h-5" />}
                width="md"
                onSubmit={handleCreate}
                submitLabel="Create Policy"
                submitDisabled={!newItem.name.trim() || newItem.maxAmount <= 0}
            >
                <div className="space-y-4">
                    <Field label="Policy Name" required>
                        <Input
                            placeholder="e.g. International Travel"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                    <Field label="Category" required>
                        <Select value={newItem.category} onValueChange={(v: ExpensePolicy["category"]) => setNewItem({ ...newItem, category: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {["Travel", "Meals", "Office", "Communication", "Medical", "Other"].map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Max Amount (₹)" required>
                        <Input
                            type="number"
                            value={newItem.maxAmount}
                            onChange={(e) => setNewItem({ ...newItem, maxAmount: parseInt(e.target.value) || 0 })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                    <Field label="Frequency" required>
                        <Select value={newItem.frequency} onValueChange={(v: ExpensePolicy["frequency"]) => setNewItem({ ...newItem, frequency: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {["Per Day", "Per Month", "Per Trip", "Per Year"].map((f) => (
                                    <SelectItem key={f} value={f}>{f}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Receipt Required</p>
                            <p className="text-[11.5px] text-[#9CA3AF]">Employee must attach a receipt</p>
                        </div>
                        <Switch checked={newItem.requiresReceipt} onCheckedChange={(v) => setNewItem({ ...newItem, requiresReceipt: v })} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Requires Approval</p>
                            <p className="text-[11.5px] text-[#9CA3AF]">Manager sign-off needed before reimbursement</p>
                        </div>
                        <Switch checked={newItem.requiresApproval} onCheckedChange={(v) => setNewItem({ ...newItem, requiresApproval: v })} />
                    </div>
                </div>
            </SideFormSheet>

            {/* Edit */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditItem(null) }}
                title="Edit Policy"
                description="Update this expense policy."
                icon={<Pencil className="w-5 h-5" />}
                width="md"
                onSubmit={handleUpdate}
                submitLabel="Save Changes"
                submitDisabled={!editItem || !editItem.name.trim()}
            >
                {editItem && (
                    <div className="space-y-4">
                        <Field label="Name" required>
                            <Input
                                value={editItem.name}
                                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <Field label="Max Amount (₹)">
                            <Input
                                type="number"
                                value={editItem.maxAmount}
                                onChange={(e) => setEditItem({ ...editItem, maxAmount: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                            <p className="text-[13px] font-semibold text-[#374151]">Receipt Required</p>
                            <Switch checked={editItem.requiresReceipt} onCheckedChange={(v) => setEditItem({ ...editItem, requiresReceipt: v })} />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                            <p className="text-[13px] font-semibold text-[#374151]">Requires Approval</p>
                            <Switch checked={editItem.requiresApproval} onCheckedChange={(v) => setEditItem({ ...editItem, requiresApproval: v })} />
                        </div>
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
