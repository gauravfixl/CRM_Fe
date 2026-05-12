"use client"

import React, { useState, useMemo } from 'react'
import { useRouter } from "next/navigation"
import {
    Search,
    Plus,
    Trash2,
    Eye,
    BookOpen,
    Calculator,
    CheckCircle2,
    Clock,
    Database,
    Printer,
    PencilLine,
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "@/shared/utils/toast"

interface Account {
    code: string
    name: string
    type: 'Asset' | 'Liability' | 'Revenue' | 'Expense'
    balance: number
    status: 'Active' | 'Inactive'
}

interface JournalEntry {
    account: string
    type: 'Debit' | 'Credit'
    amount: number
}

interface Journal {
    id: string
    date: string
    ref: string
    desc: string
    status: 'Draft' | 'Posted'
    entries: JournalEntry[]
}

const INITIAL_ACCOUNTS: Account[] = [
    { code: "1000", name: "Cash and Equivalents", type: "Asset", balance: 2400000, status: "Active" },
    { code: "1100", name: "Accounts Receivable", type: "Asset", balance: 386000, status: "Active" },
    { code: "2000", name: "Accounts Payable", type: "Liability", balance: 73900, status: "Active" },
    { code: "4000", name: "Subscription Revenue", type: "Revenue", balance: 847000, status: "Active" },
    { code: "5100", name: "Salaries and Wages", type: "Expense", balance: 245000, status: "Active" }
]

const INITIAL_JOURNALS: Journal[] = [
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

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
}

export default function Accounting() {
    const router = useRouter()
    const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS)
    const [journals, setJournals] = useState<Journal[]>(INITIAL_JOURNALS)
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState("chart")

    // Account form
    const [isAccountFormOpen, setIsAccountFormOpen] = useState(false)
    const [editingAccountCode, setEditingAccountCode] = useState<string | null>(null)
    const [accountForm, setAccountForm] = useState<{ code: string; name: string; type: Account['type']; balance: string }>({ code: '', name: '', type: 'Asset', balance: '' })
    const [accountErrors, setAccountErrors] = useState<Record<string, string>>({})
    const [isAccountDetailOpen, setIsAccountDetailOpen] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

    // Journal form
    const [isJournalFormOpen, setIsJournalFormOpen] = useState(false)
    const [editingJournalId, setEditingJournalId] = useState<string | null>(null)
    const [journalForm, setJournalForm] = useState<{ ref: string; desc: string; entries: { account: string; type: 'Debit' | 'Credit'; amount: string }[] }>({
        ref: '',
        desc: '',
        entries: [
            { account: '', type: 'Debit', amount: '' },
            { account: '', type: 'Credit', amount: '' }
        ]
    })
    const [journalErrors, setJournalErrors] = useState<Record<string, string>>({})
    const [isJournalDetailOpen, setIsJournalDetailOpen] = useState(false)
    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null)

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const filteredAccounts = useMemo(() => {
        return accounts.filter(acc =>
            acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            acc.code.includes(searchQuery)
        )
    }, [accounts, searchQuery])

    // Account helpers
    const setAccountField = (f: string, v: any) => {
        setAccountForm(p => ({ ...p, [f]: v }))
        if (accountErrors[f]) setAccountErrors(p => { const c = { ...p }; delete c[f]; return c })
    }
    const validateAccount = () => {
        const errs: Record<string, string> = {}
        errs.code = validators.required(accountForm.code)
        errs.name = validators.required(accountForm.name) || validators.minLen(2)(accountForm.name)
        errs.balance = accountForm.balance ? validators.number(accountForm.balance) : ""
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setAccountErrors(errs)
        return Object.keys(errs).length === 0
    }
    const openCreateAccount = () => {
        setEditingAccountCode(null)
        setAccountForm({ code: '', name: '', type: 'Asset', balance: '' })
        setAccountErrors({})
        setIsAccountFormOpen(true)
    }
    const openEditAccount = (acc: Account) => {
        setEditingAccountCode(acc.code)
        setAccountForm({ code: acc.code, name: acc.name, type: acc.type, balance: String(acc.balance) })
        setAccountErrors({})
        setIsAccountFormOpen(true)
    }
    const handleSaveAccount = () => {
        if (!validateAccount()) { toast.error("Please correct the highlighted fields"); return }
        const data: Account = {
            code: accountForm.code.trim(),
            name: accountForm.name.trim(),
            type: accountForm.type,
            balance: Number(accountForm.balance || 0),
            status: 'Active',
        }
        if (editingAccountCode) {
            setAccounts(accounts.map(a => a.code === editingAccountCode ? data : a))
            toast.success("Account updated")
        } else {
            if (accounts.some(a => a.code === data.code)) { toast.error("Account code already exists"); return }
            setAccounts([data, ...accounts])
            toast.success(`Account ${data.code} created`)
        }
        setIsAccountFormOpen(false)
    }
    const handleDeleteAccount = (code: string) => {
        setAccounts(accounts.filter(a => a.code !== code))
        toast.success("Account removed from chart")
    }
    const openAccountDetail = (acc: Account) => {
        setSelectedAccount(acc)
        setIsAccountDetailOpen(true)
    }

    // Journal helpers
    const setJournalField = (f: string, v: any) => {
        setJournalForm(p => ({ ...p, [f]: v }))
        if (journalErrors[f]) setJournalErrors(p => { const c = { ...p }; delete c[f]; return c })
    }
    const validateJournal = () => {
        const errs: Record<string, string> = {}
        errs.ref = validators.required(journalForm.ref)
        errs.desc = validators.required(journalForm.desc) || validators.minLen(3)(journalForm.desc)
        journalForm.entries.forEach((e, idx) => {
            if (!e.account.trim()) errs[`account-${idx}`] = "Required"
            if (!e.amount || isNaN(Number(e.amount)) || Number(e.amount) <= 0) errs[`amount-${idx}`] = "Enter valid amount"
        })
        const debitSum = journalForm.entries.filter(e => e.type === 'Debit').reduce((s, e) => s + (Number(e.amount) || 0), 0)
        const creditSum = journalForm.entries.filter(e => e.type === 'Credit').reduce((s, e) => s + (Number(e.amount) || 0), 0)
        if (debitSum !== creditSum) errs.balance = "Debits must equal Credits"
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setJournalErrors(errs)
        return Object.keys(errs).length === 0
    }
    const openCreateJournal = () => {
        setEditingJournalId(null)
        setJournalForm({ ref: '', desc: '', entries: [{ account: '', type: 'Debit', amount: '' }, { account: '', type: 'Credit', amount: '' }] })
        setJournalErrors({})
        setIsJournalFormOpen(true)
    }
    const openEditJournal = (j: Journal) => {
        setEditingJournalId(j.id)
        setJournalForm({
            ref: j.ref,
            desc: j.desc,
            entries: j.entries.map(e => ({ account: e.account, type: e.type, amount: String(e.amount) }))
        })
        setJournalErrors({})
        setIsJournalFormOpen(true)
    }
    const handleSaveJournal = () => {
        if (!validateJournal()) { toast.error("Please correct the highlighted fields"); return }
        const entries: JournalEntry[] = journalForm.entries.map(e => ({ account: e.account.trim(), type: e.type, amount: Number(e.amount) }))
        if (editingJournalId) {
            setJournals(journals.map(j => j.id === editingJournalId ? { ...j, ref: journalForm.ref.trim(), desc: journalForm.desc.trim(), entries } : j))
            toast.success(`Journal ${editingJournalId} updated`)
        } else {
            const id = `JE-${String(journals.length + 1).padStart(3, '0')}`
            const journal: Journal = {
                id, date: new Date().toISOString().split('T')[0],
                ref: journalForm.ref.trim(), desc: journalForm.desc.trim(),
                status: 'Draft', entries,
            }
            setJournals([journal, ...journals])
            toast.success(`Journal ${id} created`)
        }
        setIsJournalFormOpen(false)
    }
    const handlePostJournal = (id: string) => {
        setJournals(journals.map(j => j.id === id ? { ...j, status: 'Posted' } : j))
        toast.success(`Journal ${id} posted to ledger`)
    }
    const handleDeleteJournal = (id: string) => {
        setJournals(journals.filter(j => j.id !== id))
        toast.success(`Journal ${id} deleted`)
    }
    const openJournalDetail = (j: Journal) => {
        setSelectedJournal(j)
        setIsJournalDetailOpen(true)
    }

    const ledgerTotal = useMemo(() => accounts.reduce((s, a) => s + a.balance, 0), [accounts])

    const kpis = [
        { label: "Active Chart Nodes", value: accounts.length.toString(), icon: Database, color: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100/50 text-indigo-600", path: "/client-management/finance/accounting" },
        { label: "Draft Journal Entries", value: journals.filter(j => j.status === 'Draft').length.toString(), icon: Clock, color: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100/50 text-amber-600", path: "/client-management/finance/accounting" },
        { label: "Posted Settlements", value: journals.filter(j => j.status === 'Posted').length.toString(), icon: CheckCircle2, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600", path: "/client-management/finance/reports" },
        { label: "Total Ledger Value", value: fmt(ledgerTotal), icon: BookOpen, color: "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100/50 text-blue-600", path: "/client-management/finance/overview" }
    ]

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Ledger <span className="text-indigo-600">Accounting</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Double-entry management and structural accounting controls</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => toast.success("Trial balance generated")}>
                        <Calculator className="w-4 h-4 text-slate-400" /> Trial Balance
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-none border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => toast.success("Full accounting audit exported")}>
                        <Printer className="w-4 h-4 text-slate-400" /> Export
                    </Button>
                    <Button className="h-11 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={openCreateJournal}>
                        <Plus className="w-4 h-4" /> Journal Entry
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((stat, i) => (
                    <Card key={i} className={`${stat.color} p-6 rounded-none border shadow-sm group hover:shadow-md transition-all cursor-pointer`} onClick={() => router.push(stat.path)}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-none flex items-center justify-center bg-white shadow-sm border border-current opacity-90">
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-none h-14 w-fit shadow-sm">
                    <TabsTrigger value="chart" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Chart of Accounts</TabsTrigger>
                    <TabsTrigger value="journal" className="px-8 rounded-none data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500">Journal Entries</TabsTrigger>
                </TabsList>

                <TabsContent value="chart">
                    <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Organizational Chart of Accounts</CardTitle>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <Input
                                        placeholder="Find account by code or name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-none text-sm font-medium"
                                    />
                                </div>
                                <Button className="h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 px-4" onClick={openCreateAccount}>
                                    <Plus className="w-4 h-4" /> New
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredAccounts.length > 0 ? filteredAccounts.map((acc, idx) => (
                                    <div
                                        key={idx}
                                        className="p-6 bg-slate-50/50 border border-slate-100 rounded-none flex items-center justify-between hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group cursor-pointer"
                                        onClick={() => openAccountDetail(acc)}
                                    >
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-semibold text-[10px] h-6 px-2 rounded-none">{acc.code}</Badge>
                                                <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{acc.name}</h4>
                                            </div>
                                            <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
                                                <span className={`px-2 py-0.5 rounded-none border-0 ${acc.type === 'Asset' ? 'bg-indigo-100 text-indigo-700' :
                                                    acc.type === 'Liability' ? 'bg-rose-100 text-rose-700' :
                                                        acc.type === 'Revenue' ? 'bg-emerald-100 text-emerald-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}>{acc.type}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Status: {acc.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <p className="text-lg font-semibold text-slate-900 tracking-tight">{fmt(acc.balance)}</p>
                                            <div className="flex items-center justify-end gap-1 pt-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-400 hover:text-indigo-600" onClick={() => openEditAccount(acc)}><PencilLine className="w-3.5 h-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none text-slate-400 hover:text-rose-600" onClick={() => handleDeleteAccount(acc.code)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 text-center py-12 text-sm text-slate-500">No accounts match your search.</div>
                                )}
                            </div>

                            <Button variant="outline" className="w-full h-14 border-dashed border-2 border-slate-200 rounded-none text-slate-500 font-semibold hover:bg-slate-100 gap-2 mt-4" onClick={openCreateAccount}>
                                <Plus className="w-4 h-4" /> Add New Account
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="journal">
                    <Card className="rounded-none shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-semibold text-slate-900">Journal Settlement History</CardTitle>
                            <Button className="h-11 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2 px-4" onClick={openCreateJournal}>
                                <Plus className="w-4 h-4" /> New Journal
                            </Button>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {journals.length > 0 ? journals.map((jn, idx) => (
                                <div
                                    key={idx}
                                    className="bg-slate-50/50 border border-slate-100 rounded-none overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                                    onClick={() => openJournalDetail(jn)}
                                >
                                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">#{idx + 1}</div>
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="font-semibold text-slate-900 text-sm">{jn.id}</h5>
                                                    <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-none border-0 ${jn.status === 'Posted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{jn.status}</Badge>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-400">{jn.date} • {jn.ref}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            {jn.status === 'Draft' && (
                                                <Button size="sm" className="h-8 rounded-none bg-emerald-600 hover:bg-emerald-700 font-semibold px-4 text-white" onClick={() => handlePostJournal(jn.id)}>
                                                    Post
                                                </Button>
                                            )}
                                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-slate-200" onClick={() => openJournalDetail(jn)}><Eye className="w-3.5 h-3.5 text-slate-400" /></Button>
                                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-slate-200" onClick={() => openEditJournal(jn)}><PencilLine className="w-3.5 h-3.5 text-slate-400" /></Button>
                                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-rose-100 hover:bg-rose-50" onClick={() => handleDeleteJournal(jn.id)}><Trash2 className="w-3.5 h-3.5 text-rose-400" /></Button>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <p className="text-sm font-medium text-slate-600 italic">"{jn.desc}"</p>
                                        <div className="space-y-2">
                                            {jn.entries.map((ent, eIdx) => (
                                                <div key={eIdx} className="flex items-center justify-between text-xs py-2 px-3 bg-white rounded-none border border-slate-100">
                                                    <div className="flex items-center gap-4">
                                                        <Badge variant="outline" className={`h-6 px-2 font-semibold border-0 rounded-none ${ent.type === 'Debit' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>{ent.type}</Badge>
                                                        <span className="font-medium text-slate-700">{ent.account}</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-900">{fmt(ent.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-sm text-slate-500">No journals yet.</div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Account Form Sheet */}
            <Sheet open={isAccountFormOpen} onOpenChange={setIsAccountFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingAccountCode ? "Edit Account" : "New Account"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Define a structural ledger node.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Account Code <span className="text-rose-500">*</span></Label>
                                <Input value={accountForm.code} disabled={!!editingAccountCode} onChange={e => setAccountField("code", e.target.value)} placeholder="1200" className={`h-10 rounded-none ${accountErrors.code ? "border-rose-500" : ""}`} />
                                {accountErrors.code && <p className="text-[11px] text-rose-500">{accountErrors.code}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={accountForm.type} onValueChange={(v: any) => setAccountField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Asset">Asset</SelectItem>
                                        <SelectItem value="Liability">Liability</SelectItem>
                                        <SelectItem value="Revenue">Revenue</SelectItem>
                                        <SelectItem value="Expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account Name <span className="text-rose-500">*</span></Label>
                            <Input value={accountForm.name} onChange={e => setAccountField("name", e.target.value)} placeholder="e.g., Petty Cash" className={`h-10 rounded-none ${accountErrors.name ? "border-rose-500" : ""}`} />
                            {accountErrors.name && <p className="text-[11px] text-rose-500">{accountErrors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Opening Balance ($)</Label>
                            <Input type="number" value={accountForm.balance} onChange={e => setAccountField("balance", e.target.value)} placeholder="0" className={`h-10 rounded-none ${accountErrors.balance ? "border-rose-500" : ""}`} />
                            {accountErrors.balance && <p className="text-[11px] text-rose-500">{accountErrors.balance}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsAccountFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveAccount}>{editingAccountCode ? "Save Changes" : "Create Account"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Account Detail Sheet */}
            <Sheet open={isAccountDetailOpen} onOpenChange={setIsAccountDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Account Details</SheetTitle>
                    </SheetHeader>
                    {selectedAccount && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Code</p>
                                    <p className="text-lg font-semibold text-indigo-600">{selectedAccount.code}</p>
                                    <p className="text-md text-slate-900 font-semibold">{selectedAccount.name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><Badge className="rounded-none bg-indigo-50 text-indigo-700 border-0">{selectedAccount.type}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p><Badge className="rounded-none bg-emerald-50 text-emerald-700 border-0">{selectedAccount.status}</Badge></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Balance</p><p className="font-semibold text-2xl text-slate-900">{fmt(selectedAccount.balance)}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsAccountDetailOpen(false); openEditAccount(selectedAccount) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeleteAccount(selectedAccount.code); setIsAccountDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Journal Form Sheet */}
            <Sheet open={isJournalFormOpen} onOpenChange={setIsJournalFormOpen}>
                <SheetContent side="right" className="sm:max-w-lg w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingJournalId ? "Edit Journal Entry" : "New Journal Entry"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Atomic double-entry settlement. Debits must equal credits.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Reference <span className="text-rose-500">*</span></Label>
                            <Input value={journalForm.ref} onChange={e => setJournalField("ref", e.target.value)} placeholder="INV-2024" className={`h-10 rounded-none ${journalErrors.ref ? "border-rose-500" : ""}`} />
                            {journalErrors.ref && <p className="text-[11px] text-rose-500">{journalErrors.ref}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Narrative Description <span className="text-rose-500">*</span></Label>
                            <Textarea value={journalForm.desc} onChange={e => setJournalField("desc", e.target.value)} placeholder="Describe the transaction..." className={`min-h-[80px] rounded-none ${journalErrors.desc ? "border-rose-500" : ""}`} />
                            {journalErrors.desc && <p className="text-[11px] text-rose-500">{journalErrors.desc}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Atomic Entries</Label>
                            {journalForm.entries.map((entry, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-start">
                                    <div className="col-span-5 space-y-1">
                                        <Input
                                            value={entry.account}
                                            onChange={e => {
                                                const ents = [...journalForm.entries]
                                                ents[idx].account = e.target.value
                                                setJournalForm({ ...journalForm, entries: ents })
                                                if (journalErrors[`account-${idx}`]) setJournalErrors(p => { const c = { ...p }; delete c[`account-${idx}`]; return c })
                                            }}
                                            placeholder="Account"
                                            className={`h-10 rounded-none text-xs ${journalErrors[`account-${idx}`] ? "border-rose-500" : ""}`}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Select value={entry.type} onValueChange={(v: 'Debit' | 'Credit') => {
                                            const ents = [...journalForm.entries]
                                            ents[idx].type = v
                                            setJournalForm({ ...journalForm, entries: ents })
                                        }}>
                                            <SelectTrigger className="h-10 rounded-none text-xs"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-none">
                                                <SelectItem value="Debit">Debit</SelectItem>
                                                <SelectItem value="Credit">Credit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        <Input
                                            type="number"
                                            value={entry.amount}
                                            onChange={e => {
                                                const ents = [...journalForm.entries]
                                                ents[idx].amount = e.target.value
                                                setJournalForm({ ...journalForm, entries: ents })
                                                if (journalErrors[`amount-${idx}`]) setJournalErrors(p => { const c = { ...p }; delete c[`amount-${idx}`]; return c })
                                            }}
                                            placeholder="Amount"
                                            className={`h-10 rounded-none text-xs ${journalErrors[`amount-${idx}`] ? "border-rose-500" : ""}`}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        {journalForm.entries.length > 2 && (
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none text-rose-500" onClick={() => {
                                                const ents = journalForm.entries.filter((_, i) => i !== idx)
                                                setJournalForm({ ...journalForm, entries: ents })
                                            }}><Trash2 className="h-3.5 w-3.5" /></Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {journalErrors.balance && <p className="text-[11px] text-rose-500 font-semibold">{journalErrors.balance}</p>}
                            <Button variant="ghost" className="w-full text-indigo-600 font-semibold text-xs h-9 hover:bg-indigo-50 rounded-none" onClick={() => setJournalForm({ ...journalForm, entries: [...journalForm.entries, { account: '', type: 'Debit', amount: '' }] })}>
                                <Plus className="w-3 h-3 mr-2" /> Add Entry
                            </Button>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsJournalFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSaveJournal}>{editingJournalId ? "Save Changes" : "Create Journal"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Journal Detail Sheet */}
            <Sheet open={isJournalDetailOpen} onOpenChange={setIsJournalDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Journal Audit</SheetTitle>
                    </SheetHeader>
                    {selectedJournal && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-none border border-slate-100">
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Transaction ID</p>
                                        <p className="text-lg font-bold text-slate-900">{selectedJournal.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Reference</p>
                                        <p className="text-lg font-bold text-slate-900">{selectedJournal.ref}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase">Status</p>
                                    <Badge className={`rounded-none border-0 ${selectedJournal.status === 'Posted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{selectedJournal.status}</Badge>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase">Narrative</p>
                                    <p className="text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-none border border-slate-100">"{selectedJournal.desc}"</p>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase mb-2">Entries</p>
                                    <div className="space-y-2">
                                        {selectedJournal.entries.map((ent, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-none">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className={`border-0 rounded-none ${ent.type === 'Debit' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'}`}>{ent.type}</Badge>
                                                    <span className="text-sm font-semibold text-slate-700">{ent.account}</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-900">{fmt(ent.amount)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                {selectedJournal.status === 'Draft' && (
                                    <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none" onClick={() => { handlePostJournal(selectedJournal.id); setIsJournalDetailOpen(false) }}>
                                        Post Entry
                                    </Button>
                                )}
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsJournalDetailOpen(false); openEditJournal(selectedJournal) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDeleteJournal(selectedJournal.id); setIsJournalDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
