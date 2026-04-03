"use client"

import { useState } from "react"
import { Receipt, Plus, Search, MoreHorizontal, Pencil, Trash2, IndianRupee, Plane, Car, Coffee, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

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
    Travel: "bg-blue-50 text-blue-600 border-blue-100",
    Meals: "bg-amber-50 text-amber-600 border-amber-100",
    Office: "bg-gray-50 text-gray-600 border-gray-200",
    Communication: "bg-violet-50 text-violet-600 border-violet-100",
    Medical: "bg-rose-50 text-rose-600 border-rose-100",
    Other: "bg-gray-50 text-gray-600 border-gray-200",
}

export default function ExpensePoliciesPage() {
    const [policies, setPolicies] = useState<ExpensePolicy[]>(INITIAL_POLICIES)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<ExpensePolicy | null>(null)
    const [newItem, setNewItem] = useState({
        name: "", category: "Travel" as ExpensePolicy["category"],
        maxAmount: 0, frequency: "Per Trip" as ExpensePolicy["frequency"],
        requiresReceipt: true, requiresApproval: true,
    })

    const filtered = policies.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalBudget = policies.filter((p) => p.isActive).reduce((s, p) => s + p.maxAmount, 0)
    const approvalRequired = policies.filter((p) => p.requiresApproval && p.isActive).length

    const handleCreate = () => {
        if (!newItem.name) return toast.error("Policy name is required")
        if (newItem.maxAmount <= 0) return toast.error("Max amount must be greater than 0")
        setPolicies([...policies, { ...newItem, id: Date.now().toString(), isActive: true }])
        setIsCreateOpen(false)
        setNewItem({ name: "", category: "Travel", maxAmount: 0, frequency: "Per Trip", requiresReceipt: true, requiresApproval: true })
        toast.success("Expense policy created")
    }

    const handleUpdate = () => {
        if (!editItem) return
        setPolicies(policies.map((p) => (p.id === editItem.id ? editItem : p)))
        setIsEditOpen(false)
        setEditItem(null)
        toast.success("Policy updated")
    }

    const handleDelete = (id: string) => {
        setPolicies(policies.filter((p) => p.id !== id))
        toast.success("Policy removed")
    }

    const toggleActive = (id: string) => {
        setPolicies(policies.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400"><span>HR Governance</span><span>/</span><span className="text-gray-900 font-semibold">Expense Policies</span></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Expense Policies</h1>
                        <p className="text-xs text-gray-500 font-medium">Define reimbursement limits, categories, and approval rules for employee expenses.</p>
                    </div>
                    <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5" onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4" />New Policy
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-white/80">Total Policies</p><p className="text-xl font-semibold">{policies.length}</p><p className="text-[10px] text-white/70">Expense categories</p></div><Receipt className="w-5 h-5 text-white/80" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Active</p><p className="text-xl font-semibold text-gray-900">{policies.filter((p) => p.isActive).length}</p><p className="text-[10px] text-gray-500">Currently enabled</p></div><Wallet className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Max Combined</p><p className="text-xl font-semibold text-gray-900">₹{totalBudget.toLocaleString()}</p><p className="text-[10px] text-gray-500">Sum of all limits</p></div><IndianRupee className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"><SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Approval Required</p><p className="text-xl font-semibold text-gray-900">{approvalRequired}</p><p className="text-[10px] text-gray-500">Need manager sign-off</p></div><Car className="w-5 h-5 text-gray-400" /></div></SmallCardContent></SmallCard>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b"><div className="relative w-full md:w-80"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><Input placeholder="Search policies..." className="pl-9 h-9 rounded-lg text-xs font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div></div>
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Policy</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Category</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Limit</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Frequency</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Receipt</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Active</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((p) => (
                            <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${CATEGORY_COLORS[p.category]}`}>{CATEGORY_ICONS[p.category]}</div><span className="text-xs font-semibold text-gray-900">{p.name}</span></div></TableCell>
                                <TableCell className="py-3 text-center"><Badge className={`text-[10px] rounded-full px-2 py-0.5 font-semibold border-none ${CATEGORY_COLORS[p.category]?.replace("border-", "").split(" ").slice(0, 2).join(" ")}`}>{p.category}</Badge></TableCell>
                                <TableCell className="py-3 text-center"><span className="text-xs font-semibold text-gray-900">₹{p.maxAmount.toLocaleString()}</span></TableCell>
                                <TableCell className="py-3 text-center"><span className="text-xs text-gray-600">{p.frequency}</span></TableCell>
                                <TableCell className="py-3 text-center"><span className="text-xs text-gray-600">{p.requiresReceipt ? "Required" : "Optional"}</span></TableCell>
                                <TableCell className="py-3 text-center"><Switch checked={p.isActive} onCheckedChange={() => toggleActive(p.id)} className="scale-90" /></TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg"><MoreHorizontal className="h-4 w-4 text-gray-400" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-lg">
                                            <DropdownMenuItem onClick={() => { setEditItem({ ...p }); setIsEditOpen(true) }}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleDelete(p.id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4"><DialogTitle className="text-white font-semibold text-sm">New Expense Policy</DialogTitle><DialogDescription className="text-blue-100 text-xs">Define reimbursement rules</DialogDescription></DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Policy Name</Label><Input className="h-9 rounded-lg text-xs" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. International Travel" /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Category</Label>
                            <Select value={newItem.category} onValueChange={(v: ExpensePolicy["category"]) => setNewItem({ ...newItem, category: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>{["Travel", "Meals", "Office", "Communication", "Medical", "Other"].map((c) => (<SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Max Amount (₹)</Label><Input type="number" className="h-9 rounded-lg text-xs" value={newItem.maxAmount} onChange={(e) => setNewItem({ ...newItem, maxAmount: parseInt(e.target.value) || 0 })} /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Frequency</Label>
                            <Select value={newItem.frequency} onValueChange={(v: ExpensePolicy["frequency"]) => setNewItem({ ...newItem, frequency: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>{["Per Day", "Per Month", "Per Trip", "Per Year"].map((f) => (<SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"><Label className="text-xs font-semibold text-gray-700">Receipt Required</Label><Switch checked={newItem.requiresReceipt} onCheckedChange={(v) => setNewItem({ ...newItem, requiresReceipt: v })} /></div>
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"><Label className="text-xs font-semibold text-gray-700">Requires Approval</Label><Switch checked={newItem.requiresApproval} onCheckedChange={(v) => setNewItem({ ...newItem, requiresApproval: v })} /></div>
                    </div>
                    <DialogFooter className="px-5 pb-4"><Button onClick={handleCreate} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Create Policy</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4"><DialogTitle className="text-white font-semibold text-sm">Edit Policy</DialogTitle></DialogHeader>
                    {editItem && (
                        <>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Name</Label><Input className="h-9 rounded-lg text-xs" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} /></div>
                                <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Max Amount (₹)</Label><Input type="number" className="h-9 rounded-lg text-xs" value={editItem.maxAmount} onChange={(e) => setEditItem({ ...editItem, maxAmount: parseInt(e.target.value) || 0 })} /></div>
                                <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"><Label className="text-xs font-semibold text-gray-700">Receipt Required</Label><Switch checked={editItem.requiresReceipt} onCheckedChange={(v) => setEditItem({ ...editItem, requiresReceipt: v })} /></div>
                                <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"><Label className="text-xs font-semibold text-gray-700">Requires Approval</Label><Switch checked={editItem.requiresApproval} onCheckedChange={(v) => setEditItem({ ...editItem, requiresApproval: v })} /></div>
                            </div>
                            <DialogFooter className="px-5 pb-4"><Button onClick={handleUpdate} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Save Changes</Button></DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
