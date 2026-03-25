"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Filter,
    Download,
    Edit,
    Trash2,
    Eye,
    BookOpen,
    Calculator,
    FileText,
    RefreshCw,
    Play,
    CheckCircle2,
    Clock,
    UserCircle2,
    Database,
    ChevronDown,
    Printer,
    ArrowUpRight,
    SearchCheck
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
const INITIAL_ACCOUNTS = [
    { code: "1000", name: "Cash and Equivalents", type: "Asset", balance: 2400000, status: "Active" },
    { code: "1100", name: "Accounts Receivable", type: "Asset", balance: 386000, status: "Active" },
    { code: "2000", name: "Accounts Payable", type: "Liability", balance: 73900, status: "Active" },
    { code: "4000", name: "Subscription Revenue", type: "Revenue", balance: 847000, status: "Active" },
    { code: "5100", name: "Salaries and Wages", type: "Expense", balance: 245000, status: "Active" }
]

const INITIAL_JOURNALS = [
    {
        id: "JE-001",
        date: "2024-07-01",
        ref: "INV-2024-001",
        desc: "Acme Corp subscription primary settlement",
        status: "Posted",
        entries: [
            { account: "1000 - Cash", type: "Debit", amount: 125000 },
            { account: "4000 - Revenue", type: "Credit", amount: 125000 }
        ]
    },
    {
        id: "JE-002",
        date: "2024-07-02",
        ref: "BILL-2024-015",
        desc: "Monthly AWS Infrastructure burn",
        status: "Draft",
        entries: [
            { account: "5000 - COGS", type: "Debit", amount: 15000 },
            { account: "2000 - AP", type: "Credit", amount: 15000 }
        ]
    }
]

export default function Accounting() {
    const [searchQuery, setSearchQuery] = useState("")
    const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS)
    const [journals, setJournals] = useState(INITIAL_JOURNALS)
    const [activeTab, setActiveTab] = useState("chart")
    const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false)
    const [isCreateJournalOpen, setIsCreateJournalOpen] = useState(false)
    const [newAccount, setNewAccount] = useState({ code: '', name: '', type: 'Asset' })
    const [newJournal, setNewJournal] = useState({
        ref: '',
        desc: '',
        entries: [
            { account: '', type: 'Debit', amount: '' },
            { account: '', type: 'Credit', amount: '' }
        ]
    })

    const [selectedJournal, setSelectedJournal] = useState<any>(null)
    const [selectedAccount, setSelectedAccount] = useState<any>(null)

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1000)), {
            loading: 'Processing structural ledger update...',
            success: msg,
            error: 'Ledger update failed'
        })
    }

    const handleCreateAccount = () => {
        if (!newAccount.code || !newAccount.name) {
            toast.error("Please fill in all required fields")
            return
        }
        const account = { ...newAccount, balance: 0, status: 'Active' }
        setAccounts([...accounts, account])
        setNewAccount({ code: '', name: '', type: 'Asset' })
        setIsCreateAccountOpen(false)
        toast.success(`Account ${account.code} created successfully`)
    }

    const handleUpdateAccount = () => {
        if (!selectedAccount) return
        setAccounts(accounts.map(acc => acc.code === selectedAccount.code ? selectedAccount : acc))
        setSelectedAccount(null)
        toast.success(`Account ${selectedAccount.code} updated`)
    }

    const handleDeleteAccount = (code: string) => {
        setAccounts(accounts.filter(acc => acc.code !== code))
        toast.success("Account removed from chart")
    }

    const handleCreateJournal = () => {
        if (!newJournal.ref || !newJournal.desc || newJournal.entries.some(e => !e.account || !e.amount)) {
            toast.error("Please fill in all required fields")
            return
        }

        const debitSum = newJournal.entries.filter(e => e.type === 'Debit').reduce((sum, e) => sum + parseFloat(e.amount), 0)
        const creditSum = newJournal.entries.filter(e => e.type === 'Credit').reduce((sum, e) => sum + parseFloat(e.amount), 0)

        if (debitSum !== creditSum) {
            toast.error("Journal entry is not balanced (Debits != Credits)")
            return
        }

        const journal = {
            id: `JE-00${journals.length + 1}`,
            date: new Date().toISOString().split('T')[0],
            ref: newJournal.ref,
            desc: newJournal.desc,
            status: 'Draft',
            entries: newJournal.entries.map(e => ({
                account: e.account,
                type: e.type,
                amount: parseFloat(e.amount)
            }))
        }
        setJournals([journal, ...journals])
        setIsCreateJournalOpen(false)
        setNewJournal({
            ref: '',
            desc: '',
            entries: [
                { account: '', type: 'Debit', amount: '' },
                { account: '', type: 'Credit', amount: '' }
            ]
        })
        toast.success(`Journal ${journal.id} created as draft`)
    }

    const handlePostJournal = (id: string) => {
        setJournals(journals.map(jn => jn.id === id ? { ...jn, status: 'Posted' } : jn))
        toast.success(`Journal ${id} posted to ledger`)
    }

    const handleDeleteJournal = (id: string) => {
        setJournals(journals.filter(jn => jn.id !== id))
        toast.success(`Journal ${id} deleted`)
    }

    const filteredAccounts = useMemo(() => {
        return accounts.filter(acc =>
            acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.code.includes(searchQuery)
        )
    }, [accounts, searchQuery])

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Ledger <span className="text-indigo-600">Accounting</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Double-entry management and structural accounting controls</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => handleAction("Trial balance generated")}>
                        <Calculator className="w-4 h-4 text-slate-400" /> Trial Balance
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => handleAction("Full accounting audit exported")}>
                        <Printer className="w-4 h-4 text-slate-400" /> Export
                    </Button>
                    <Dialog open={isCreateJournalOpen} onOpenChange={setIsCreateJournalOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> Journal Entry
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Prime <span className="text-indigo-600">Journal Settlement</span></DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Reference</Label>
                                        <Input value={newJournal.ref} onChange={(e) => setNewJournal({ ...newJournal, ref: e.target.value })} placeholder="e.g. INV-2024" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Settlement ID</Label>
                                        <Input placeholder={`JE-00${journals.length + 1}`} disabled className="h-11 rounded-xl bg-slate-100 border-slate-100 font-medium opacity-60" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Narrative Description</Label>
                                    <Textarea value={newJournal.desc} onChange={(e) => setNewJournal({ ...newJournal, desc: e.target.value })} placeholder="Describe the structural transaction..." className="min-h-[80px] rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-sm font-semibold text-slate-700">Atomic Entries</Label>
                                    {newJournal.entries.map((entry, idx) => (
                                        <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                                            <div className="col-span-5">
                                                <Input value={entry.account} onChange={(e) => {
                                                    const ents = [...newJournal.entries]
                                                    ents[idx].account = e.target.value
                                                    setNewJournal({ ...newJournal, entries: ents })
                                                }} placeholder="Account" className="h-10 rounded-xl bg-slate-50 border-slate-100 text-xs font-semibold" />
                                            </div>
                                            <div className="col-span-3">
                                                <Select value={entry.type} onValueChange={(v) => {
                                                    const ents = [...newJournal.entries]
                                                    ents[idx].type = v
                                                    setNewJournal({ ...newJournal, entries: ents })
                                                }}>
                                                    <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-100 text-xs font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="Debit">Debit</SelectItem>
                                                        <SelectItem value="Credit">Credit</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-4">
                                                <Input type="number" value={entry.amount} onChange={(e) => {
                                                    const ents = [...newJournal.entries]
                                                    ents[idx].amount = e.target.value
                                                    setNewJournal({ ...newJournal, entries: ents })
                                                }} placeholder="Amount" className="h-10 rounded-xl bg-slate-50 border-slate-100 text-xs font-bold" />
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="ghost" className="w-full text-indigo-600 font-semibold text-xs h-8 hover:bg-indigo-50 rounded-xl" onClick={() => setNewJournal({ ...newJournal, entries: [...newJournal.entries, { account: '', type: 'Debit', amount: '' }] })}>
                                        <Plus className="w-3 h-3 mr-2" /> Append Entry Node
                                    </Button>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20" onClick={handleCreateJournal}>Provision Journal Entry</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Quick Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Active Chart Nodes", value: accounts.length.toString(), icon: Database, color: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100/50 text-indigo-600" },
                    { label: "Draft Journal Entries", value: journals.filter(j => j.status === 'Draft').length.toString(), icon: Clock, color: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100/50 text-amber-600" },
                    { label: "Monthly Settlements", value: "142", icon: CheckCircle2, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600" },
                    { label: "Total Ledger Value", value: "$4.12m", icon: BookOpen, color: "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100/50 text-blue-600" }
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.color} p-6 rounded-3xl border shadow-sm group hover:shadow-md transition-all`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-current opacity-20">
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            {/* Accounting Controls */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl h-14 w-fit shadow-sm">
                    <TabsTrigger value="chart" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Chart of Accounts</TabsTrigger>
                    <TabsTrigger value="journal" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Journal Entries</TabsTrigger>
                </TabsList>

                <TabsContent value="chart">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Organizational Chart of Accounts</CardTitle>
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                                <Input
                                    placeholder="Find account by code or name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredAccounts.map((acc, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group">
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-white border-slate-200 text-slate-400 font-semibold text-[10px] h-6 px-2">{acc.code}</Badge>
                                                <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{acc.name}</h4>
                                            </div>
                                            <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
                                                <span className={`px-2 py-0.5 rounded-lg border-0 ${acc.type === 'Asset' ? 'bg-indigo-100 text-indigo-700' :
                                                    acc.type === 'Liability' ? 'bg-rose-100 text-rose-700' :
                                                        'bg-emerald-100 text-emerald-700'
                                                    }`}>{acc.type}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Status: {acc.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-lg font-semibold text-slate-900 tracking-tight">{fmt(acc.balance)}</p>
                                            <div className="flex items-center justify-end gap-1 pt-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => setSelectedAccount(acc)}><Edit className="w-3.5 h-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => handleDeleteAccount(acc.code)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Dialog open={isCreateAccountOpen} onOpenChange={setIsCreateAccountOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full h-14 border-dashed border-2 border-slate-200 rounded-2xl text-slate-400 font-semibold hover:bg-slate-100 gap-2 mt-4">
                                        <Plus className="w-4 h-4" /> Architect New Account Category
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Create <span className="text-indigo-600">Account</span></DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-6 py-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="code" className="text-sm font-semibold text-slate-700">Account Code</Label>
                                            <Input id="code" value={newAccount.code} onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })} placeholder="e.g. 1200" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Account Name</Label>
                                            <Input id="name" value={newAccount.name} onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })} placeholder="e.g. Petty Cash" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type" className="text-sm font-semibold text-slate-700">Type</Label>
                                            <Select value={newAccount.type} onValueChange={(v) => setNewAccount({ ...newAccount, type: v })}>
                                                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="Asset">Asset</SelectItem>
                                                    <SelectItem value="Liability">Liability</SelectItem>
                                                    <SelectItem value="Revenue">Revenue</SelectItem>
                                                    <SelectItem value="Expense">Expense</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20" onClick={handleCreateAccount}>Provision Account</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="journal">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-semibold text-slate-900">Journal Settlement History</CardTitle>
                            <Button variant="ghost" className="text-indigo-600 font-semibold hover:bg-indigo-50 px-4">Audit Settings</Button>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {journals.map((jn, idx) => (
                                <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-3xl overflow-hidden hover:shadow-lg transition-all">
                                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">#{idx + 1}</div>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="font-semibold text-slate-900 text-sm">{jn.id}</h5>
                                                    <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border-0 ${jn.status === 'Posted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>{jn.status}</Badge>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-400">{jn.date} • {jn.ref}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {jn.status === 'Draft' && (
                                                <Button size="sm" className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-semibold px-4" onClick={() => handlePostJournal(jn.id)}>
                                                    Post Entry
                                                </Button>
                                            )}
                                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200" onClick={() => setSelectedJournal(jn)}><Eye className="w-3.5 h-3.5 text-slate-400" /></Button>
                                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-rose-100 hover:bg-rose-50" onClick={() => handleDeleteJournal(jn.id)}><Trash2 className="w-3.5 h-3.5 text-rose-400" /></Button>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <p className="text-sm font-medium text-slate-600 italic">"{jn.desc}"</p>
                                        <div className="space-y-2">
                                            {jn.entries.map((ent, eIdx) => (
                                                <div key={eIdx} className="flex items-center justify-between text-xs py-2 px-3 bg-white rounded-xl border border-slate-100 text-slate-900">
                                                    <div className="flex items-center gap-4">
                                                        <Badge variant="outline" className={`h-6 px-2 font-semibold border-0 ${ent.type === 'Debit' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>{ent.type}</Badge>
                                                        <span className="font-medium text-slate-700">{ent.account}</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-900">{fmt(ent.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            {/* View Journal Modal */}
            <Dialog open={!!selectedJournal} onOpenChange={() => setSelectedJournal(null)}>
                <DialogContent className="sm:max-w-[600px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Journal <span className="text-indigo-600">Audit</span></DialogTitle>
                    </DialogHeader>
                    {selectedJournal && (
                        <div className="space-y-6 py-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transaction ID</p>
                                    <p className="text-lg font-bold text-slate-900">{selectedJournal.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reference</p>
                                    <p className="text-lg font-bold text-slate-900">{selectedJournal.ref}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-500">Narrative</Label>
                                <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">"{selectedJournal.desc}"</p>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-slate-500">Atomic Entries</Label>
                                <div className="space-y-2">
                                    {selectedJournal.entries.map((ent: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className={`border-0 ${ent.type === 'Debit' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>{ent.type}</Badge>
                                                <span className="text-sm font-semibold text-slate-700">{ent.account}</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{fmt(ent.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Account Modal */}
            <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Edit <span className="text-indigo-600">Account</span></DialogTitle>
                    </DialogHeader>
                    {selectedAccount && (
                        <div className="grid gap-6 py-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Account Name</Label>
                                <Input value={selectedAccount.name} onChange={(e) => setSelectedAccount({ ...selectedAccount, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Account Type</Label>
                                <Select value={selectedAccount.type} onValueChange={(v) => setSelectedAccount({ ...selectedAccount, type: v })}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Asset">Asset</SelectItem>
                                        <SelectItem value="Liability">Liability</SelectItem>
                                        <SelectItem value="Revenue">Revenue</SelectItem>
                                        <SelectItem value="Expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20" onClick={handleUpdateAccount}>Update Structural Node</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
