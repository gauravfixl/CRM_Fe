"use client"

import { useState } from "react"
import { DollarSign, Search, Plus, MoreHorizontal, Percent, Calculator, Wallet, Loader2 } from "lucide-react"
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

interface SalaryComponent {
    id: string
    name: string
    code: string
    type: "Earning" | "Deduction" | "Employer Contribution"
    calculationType: "Fixed" | "Percentage"
    percentageOf: string
    value: number
    isTaxable: boolean
    isActive: boolean
}

const INITIAL_COMPONENTS: SalaryComponent[] = [
    { id: "1", name: "Basic Salary", code: "BASIC", type: "Earning", calculationType: "Percentage", percentageOf: "CTC", value: 40, isTaxable: true, isActive: true },
    { id: "2", name: "House Rent Allowance", code: "HRA", type: "Earning", calculationType: "Percentage", percentageOf: "Basic", value: 50, isTaxable: true, isActive: true },
    { id: "3", name: "Dearness Allowance", code: "DA", type: "Earning", calculationType: "Percentage", percentageOf: "Basic", value: 10, isTaxable: true, isActive: true },
    { id: "4", name: "Provident Fund", code: "PF", type: "Deduction", calculationType: "Percentage", percentageOf: "Basic", value: 12, isTaxable: false, isActive: true },
    { id: "5", name: "Employer PF", code: "EPF", type: "Employer Contribution", calculationType: "Percentage", percentageOf: "Basic", value: 12, isTaxable: false, isActive: true },
    { id: "6", name: "Professional Tax", code: "PT", type: "Deduction", calculationType: "Fixed", percentageOf: "", value: 200, isTaxable: false, isActive: true },
    { id: "7", name: "Special Allowance", code: "SA", type: "Earning", calculationType: "Fixed", percentageOf: "", value: 0, isTaxable: true, isActive: true },
]

export default function SalaryComponentsPage() {
    const [components, setComponents] = useState<SalaryComponent[]>(INITIAL_COMPONENTS)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<SalaryComponent | null>(null)
    const [newItem, setNewItem] = useState({
        name: "", code: "", type: "Earning" as SalaryComponent["type"],
        calculationType: "Fixed" as "Fixed" | "Percentage", percentageOf: "", value: 0, isTaxable: true,
    })

    const filtered = components.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const earnings = components.filter((c) => c.type === "Earning" && c.isActive).length
    const deductions = components.filter((c) => c.type === "Deduction" && c.isActive).length
    const contributions = components.filter((c) => c.type === "Employer Contribution" && c.isActive).length

    const handleCreate = () => {
        if (!newItem.name || !newItem.code) return toast.error("Name and code are required")
        setComponents([...components, { ...newItem, id: Date.now().toString(), isActive: true }])
        setIsCreateOpen(false)
        setNewItem({ name: "", code: "", type: "Earning", calculationType: "Fixed", percentageOf: "", value: 0, isTaxable: true })
        toast.success("Salary component created")
    }

    const handleUpdate = () => {
        if (!editItem) return
        setComponents(components.map((c) => (c.id === editItem.id ? editItem : c)))
        setIsEditOpen(false)
        setEditItem(null)
        toast.success("Component updated")
    }

    const handleDelete = (id: string) => {
        setComponents(components.filter((c) => c.id !== id))
        toast.success("Component removed")
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>HR Governance</span><span>/</span>
                    <span className="text-gray-900 font-semibold">Salary Components</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Salary Components</h1>
                        <p className="text-xs text-gray-500 font-medium">Define earnings, deductions, and employer contributions for payroll.</p>
                    </div>
                    <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5" onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4" /> New Component
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-white/80">Total Components</p><p className="text-xl font-semibold">{components.length}</p><p className="text-[10px] text-white/70">Active in payroll</p></div><DollarSign className="w-5 h-5 text-white/80" /></div></SmallCardContent>
                </SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Earnings</p><p className="text-xl font-semibold text-gray-900">{earnings}</p><p className="text-[10px] text-gray-500">Pay components</p></div><Wallet className="w-5 h-5 text-gray-400" /></div></SmallCardContent>
                </SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Deductions</p><p className="text-xl font-semibold text-gray-900">{deductions}</p><p className="text-[10px] text-gray-500">Employee deductions</p></div><Percent className="w-5 h-5 text-gray-400" /></div></SmallCardContent>
                </SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-gray-600">Employer Contributions</p><p className="text-xl font-semibold text-gray-900">{contributions}</p><p className="text-[10px] text-gray-500">Company obligations</p></div><Calculator className="w-5 h-5 text-gray-400" /></div></SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input placeholder="Search components..." className="pl-9 h-9 rounded-lg text-xs font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Component</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Code</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Type</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Calculation</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Taxable</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((c) => (
                            <TableRow key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${c.type === "Earning" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : c.type === "Deduction" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                                            <DollarSign className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-900">{c.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center"><Badge variant="outline" className="text-[10px] font-mono bg-gray-50">{c.code}</Badge></TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[10px] rounded-full px-2 py-0.5 font-semibold border-none ${c.type === "Earning" ? "bg-emerald-50 text-emerald-600" : c.type === "Deduction" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}>{c.type}</Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs font-semibold text-gray-900">
                                        {c.calculationType === "Percentage" ? `${c.value}% of ${c.percentageOf}` : `Fixed ₹${c.value}`}
                                    </span>
                                </TableCell>
                                <TableCell className="py-3 text-center"><span className="text-xs text-gray-600">{c.isTaxable ? "Yes" : "No"}</span></TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg"><MoreHorizontal className="h-4 w-4 text-gray-400" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-lg">
                                            <DropdownMenuItem onClick={() => { setEditItem({ ...c }); setIsEditOpen(true) }}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleDelete(c.id)}>Delete</DropdownMenuItem>
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
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold text-sm">New Salary Component</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">Define a payroll component</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Name</Label><Input className="h-9 rounded-lg text-xs" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Conveyance Allowance" /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Code</Label><Input className="h-9 rounded-lg text-xs font-mono uppercase" value={newItem.code} onChange={(e) => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })} placeholder="e.g. CA" /></div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Type</Label>
                            <Select value={newItem.type} onValueChange={(v: SalaryComponent["type"]) => setNewItem({ ...newItem, type: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Earning" className="text-xs">Earning</SelectItem><SelectItem value="Deduction" className="text-xs">Deduction</SelectItem><SelectItem value="Employer Contribution" className="text-xs">Employer Contribution</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Calculation</Label>
                            <Select value={newItem.calculationType} onValueChange={(v: "Fixed" | "Percentage") => setNewItem({ ...newItem, calculationType: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent><SelectItem value="Fixed" className="text-xs">Fixed Amount</SelectItem><SelectItem value="Percentage" className="text-xs">Percentage</SelectItem></SelectContent>
                            </Select>
                        </div>
                        {newItem.calculationType === "Percentage" && (
                            <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Percentage Of</Label><Input className="h-9 rounded-lg text-xs" value={newItem.percentageOf} onChange={(e) => setNewItem({ ...newItem, percentageOf: e.target.value })} placeholder="e.g. Basic, CTC" /></div>
                        )}
                        <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">{newItem.calculationType === "Percentage" ? "Percentage (%)" : "Amount (₹)"}</Label><Input type="number" className="h-9 rounded-lg text-xs" value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: parseFloat(e.target.value) || 0 })} /></div>
                        <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50">
                            <Label className="text-xs font-semibold text-gray-700">Taxable</Label>
                            <Switch checked={newItem.isTaxable} onCheckedChange={(v) => setNewItem({ ...newItem, isTaxable: v })} />
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4"><Button onClick={handleCreate} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Create Component</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold text-sm">Edit Component</DialogTitle>
                    </DialogHeader>
                    {editItem && (
                        <>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Name</Label><Input className="h-9 rounded-lg text-xs" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} /></div>
                                <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Type</Label>
                                    <Select value={editItem.type} onValueChange={(v: SalaryComponent["type"]) => setEditItem({ ...editItem, type: v })}>
                                        <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="Earning" className="text-xs">Earning</SelectItem><SelectItem value="Deduction" className="text-xs">Deduction</SelectItem><SelectItem value="Employer Contribution" className="text-xs">Employer Contribution</SelectItem></SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2"><Label className="text-xs font-semibold text-gray-700">Value</Label><Input type="number" className="h-9 rounded-lg text-xs" value={editItem.value} onChange={(e) => setEditItem({ ...editItem, value: parseFloat(e.target.value) || 0 })} /></div>
                                <div className="flex items-center justify-between border p-3 rounded-lg bg-gray-50">
                                    <Label className="text-xs font-semibold text-gray-700">Taxable</Label>
                                    <Switch checked={editItem.isTaxable} onCheckedChange={(v) => setEditItem({ ...editItem, isTaxable: v })} />
                                </div>
                            </div>
                            <DialogFooter className="px-5 pb-4"><Button onClick={handleUpdate} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Save Changes</Button></DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
