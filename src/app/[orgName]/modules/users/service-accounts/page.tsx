"use client"

import { useState, useMemo } from "react"
import {
    Shield,
    Search,
    Filter,
    Key,
    Database,
    RefreshCw,
    MoreVertical,
    Plus,
    Trash2,
    Edit3,
    ShieldCheck,
    Zap,
    ChevronRight,
    ArrowRight,
    Clock,
    Lock,
    Globe,
    PlusCircle,
    Copy,
    CheckCircle2,
    XCircle
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { showSuccess, showWarning } from "@/utils/toast"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default function ServiceAccountsPage() {
    const params = useParams()
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [newAccountName, setNewAccountName] = useState("")

    const [filterMode, setFilterMode] = useState<"all" | "active" | "expired">("all")
    const filterOptions: Array<"all" | "active" | "expired"> = ["all", "active", "expired"]

    const cycleFilter = () => {
        setFilterMode(prev => {
            const idx = filterOptions.indexOf(prev)
            return filterOptions[(idx + 1) % filterOptions.length]
        })
    }

    const [accounts, setAccounts] = useState([
        { id: "sa-1", name: "Backup Controller", clientId: "bak_721839405621", status: "Active", lastRotation: "2 days ago", permissions: "Full Access" },
        { id: "sa-2", name: "Billing Integration", clientId: "bil_910283746522", status: "Active", lastRotation: "15 days ago", permissions: "Read-only" },
        { id: "sa-3", name: "Monitoring Service", clientId: "mon_112233445566", status: "Expired", lastRotation: "92 days ago", permissions: "Analytics Viewer" },
        { id: "sa-4", name: "API Gateway", clientId: "api_556677889900", status: "Active", lastRotation: "5 days ago", permissions: "Gateway Proxy" },
        { id: "sa-5", name: "Database Migrator", clientId: "dbm_001122334455", status: "Active", lastRotation: "Yesterday", permissions: "DB Admin" },
    ])

    const filteredAccounts = useMemo(() => {
        return accounts.filter(acc => {
            const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                acc.clientId.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesFilter = filterMode === "all" ||
                (filterMode === "active" && acc.status === "Active") ||
                (filterMode === "expired" && acc.status === "Expired")
            return matchesSearch && matchesFilter
        })
    }, [accounts, searchQuery, filterMode])

    const toggleSelect = (id: string) => {
        setSelectedAccounts(prev =>
            prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
        )
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Client ID copied to clipboard")
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Service Accounts"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Service accounts", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info("Syncing account data...")}
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-2" />
                            Sync data
                        </CustomButton>
                        <CustomButton
                            size="sm"
                            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-white"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            <PlusCircle className="w-3.5 h-3.5 mr-2" /> Create service account
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Bulk Action Bar (Floating) */}
                {selectedAccounts.length > 0 && (
                    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-white/10 animate-in zoom-in-95 duration-200">
                        <span className="text-sm font-medium border-r border-white/20 pr-6">{selectedAccounts.length} Accounts Selected</span>
                        <div className="flex items-center gap-4">
                            <button onClick={() => toast.success(`Key rotation scheduled for ${selectedAccounts.length} accounts`)} className="flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors">
                                <RefreshCw className="w-4 h-4" /> Rotate keys
                            </button>
                            <button onClick={() => toast.success(`Permissions updated for ${selectedAccounts.length} accounts`)} className="flex items-center gap-2 text-xs font-semibold hover:text-primary transition-colors">
                                <ShieldCheck className="w-4 h-4" /> Edit permissions
                            </button>
                            <button
                                onClick={() => { toast.success(`${selectedAccounts.length} accounts deactivated`); setSelectedAccounts([]) }}
                                className="flex items-center gap-2 text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                        <button onClick={() => setSelectedAccounts([])} className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors">
                            <XCircle className="w-5 h-5 flex items-center justify-center">
                                <Plus className="w-4 h-4 rotate-45" />
                            </XCircle>
                        </button>
                    </div>
                )}

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-none p-5 shadow-sm flex items-center justify-between group transition-all cursor-pointer text-white" onClick={() => toast.info("Viewing all service accounts")}>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold text-white/80 tracking-wide leading-none">Total accounts</p>
                            <p className="text-lg font-bold text-white">{accounts.length}</p>
                        </div>
                        <div className="h-10 w-10 rounded-none bg-white/15 flex items-center justify-center text-white/60">
                            <Database className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5 shadow-sm flex items-center justify-between group hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => toast.info("14 keys rotated in the last 7 days")}>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold text-zinc-400 tracking-wide leading-none">Active keys</p>
                            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">14</p>
                        </div>
                        <div className="h-10 w-10 rounded-none bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                            <Key className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer" onClick={() => toast.info("Global policy is set to Enforce")}>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold text-zinc-400 tracking-wide leading-none">Access policy</p>
                            <p className="text-sm font-bold text-primary">Enforced</p>
                        </div>
                        <div className="h-10 w-10 rounded-none bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                            <Shield className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5 shadow-sm flex items-center justify-between group hover:border-red-500/30 transition-all cursor-pointer" onClick={() => toast.warning("1 account has an expired key")}>
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-semibold text-zinc-400 tracking-wide leading-none">Expired keys</p>
                            <p className="text-lg font-bold text-red-600">01</p>
                        </div>
                        <div className="h-10 w-10 rounded-none bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Filters & Command Bar */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-2 shadow-sm flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-400"
                            placeholder="Search by account name or client id..."
                        />
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <CustomButton variant="ghost" className="h-10 text-xs px-4 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800" onClick={cycleFilter}>
                        <Filter className="w-3.5 h-3.5 mr-2" /> {filterMode === "all" ? "All filters" : filterMode === "active" ? "Active only" : "Expired only"}
                    </CustomButton>
                </div>

                {/* Main Accounts Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden relative">

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-20">
                                <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="p-5 w-14 text-center">
                                        <Checkbox
                                            checked={selectedAccounts.length > 0 && selectedAccounts.length === filteredAccounts.length}
                                            onCheckedChange={() => {
                                                if (selectedAccounts.length === filteredAccounts.length) setSelectedAccounts([])
                                                else setSelectedAccounts(filteredAccounts.map(u => u.id))
                                            }}
                                        />
                                    </th>
                                    <th className="p-5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Account identity</th>
                                    <th className="p-5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Client id</th>
                                    <th className="p-5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Permissions</th>
                                    <th className="p-5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">Security lifecycle</th>
                                    <th className="p-5 text-right w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                {filteredAccounts.map((account) => (
                                    <tr key={account.id} className="hover:bg-primary/5 dark:hover:bg-primary/5 transition-all group">
                                        <td className="p-5 text-center">
                                            <Checkbox
                                                checked={selectedAccounts.includes(account.id)}
                                                onCheckedChange={() => toggleSelect(account.id)}
                                            />
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-none bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary group-hover:scale-105 transition-transform">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{account.name}</span>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <div className={`h-1.5 w-1.5 rounded-full ${account.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                        <span className="text-[10px] font-medium text-zinc-500">{account.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 group/id cursor-pointer" onClick={() => copyToClipboard(account.clientId)}>
                                                <code className="text-[11px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded transition-colors group-hover/id:text-primary">{account.clientId}</code>
                                                <Copy className="w-3 h-3 text-zinc-300 group-hover/id:text-primary/70" />
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <Badge variant="outline" className="text-[9px] font-bold border-zinc-200 dark:border-zinc-800 text-zinc-600 px-2">
                                                {account.permissions}
                                            </Badge>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3 text-zinc-400" />
                                                    <span className="text-[10px] font-semibold text-zinc-600">Last rotation: {account.lastRotation}</span>
                                                </div>
                                                <div className="h-1 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${account.id === 'sa-3' ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                        style={{ width: account.id === 'sa-3' ? '100%' : '35%' }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <CustomButton variant="ghost" size="icon" className="h-9 w-9 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </CustomButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-60 p-2 rounded-none border shadow-xl">
                                                    <DropdownMenuLabel className="text-xs px-2 py-1 text-zinc-400 font-semibold">Account actions</DropdownMenuLabel>

                                                    <DropdownMenuItem onClick={() => toast.success(`Key rotation initiated for ${account.name}`)} className="rounded-none px-3 py-2 cursor-pointer focus:bg-primary/10 dark:focus:bg-primary/10 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <RefreshCw className="w-4 h-4 text-zinc-500" />
                                                            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Rotate key</span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-zinc-300" />
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem onClick={() => toast.info(`Viewing policy for ${account.name}`)} className="rounded-none px-3 py-2 cursor-pointer focus:bg-primary/10 dark:focus:bg-primary/10 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <ShieldCheck className="w-4 h-4 text-zinc-500" />
                                                            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Policy & access</span>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-zinc-300" />
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator className="my-2" />

                                                    <DropdownMenuItem
                                                        onClick={() => { setAccounts(prev => prev.filter(a => a.id !== account.id)); showSuccess(`Service account ${account.name} deleted`) }}
                                                        className="rounded-none px-3 py-2 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20 text-red-600"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Trash2 className="w-4 h-4" />
                                                            <span className="text-sm font-semibold">Delete account</span>
                                                        </div>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-5 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-zinc-500">
                            Showing <span className="text-zinc-900 dark:text-zinc-100">{filteredAccounts.length}</span> service identities
                        </p>
                        <div className="flex items-center gap-2">
                            <CustomButton variant="outline" size="sm" className="h-8 rounded-none text-[10px] font-semibold" onClick={() => showWarning("All records displayed")}>Previous</CustomButton>
                            <CustomButton variant="outline" size="sm" className="h-8 rounded-none text-[10px] font-semibold" onClick={() => showWarning("All records displayed")}>Next</CustomButton>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-none p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <Zap className="absolute -bottom-10 -right-10 h-40 w-40 opacity-10 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xl font-bold mb-2">Automated Rotation</h4>
                        <p className="text-white/80 text-sm mb-6 max-w-sm leading-relaxed">Ensure high security standards by enabling automated key rotation for all high-privilege service accounts.</p>
                        <CustomButton
                            variant="outline"
                            className="bg-white/10 hover:bg-white/20 border-white/20 text-white font-semibold rounded-none text-xs h-10 px-6"
                            onClick={() => toast.info("Opening security automation settings")}
                        >
                            Configure rotation
                        </CustomButton>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-8 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Globe className="w-5 h-5 text-primary" />
                                <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">External integrations</h5>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed">Monitor service accounts used by third-party applications and webhooks connecting to your organization.</p>
                        </div>
                        <CustomButton
                            variant="outline"
                            size="sm"
                            className="mt-6 rounded-none font-semibold text-xs border-zinc-200"
                            onClick={() => toast.info("Viewing external integration logs")}
                        >
                            View integration logs
                        </CustomButton>
                    </div>
                </div>
            </div>

            {/* CREATE ACCOUNT DIALOG */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-[440px] rounded-none">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">New service account</DialogTitle>
                        <DialogDescription>Create a non-human identity for systems and automated workloads.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="text-[10px] font-semibold text-zinc-500 mb-1 block">Display name</label>
                            <input
                                type="text"
                                value={newAccountName}
                                onChange={e => setNewAccountName(e.target.value)}
                                placeholder="e.g. Jenkins Integration"
                                className="w-full border border-zinc-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-semibold text-zinc-500 mb-1 block">Default permissions</label>
                            <select
                                className="w-full border border-zinc-200 rounded-none px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                            >
                                <option>Read-only access</option>
                                <option>Contributor</option>
                                <option>Full administrator</option>
                                <option>Custom scope...</option>
                            </select>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-none border border-zinc-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-amber-600 mb-1">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-semibold">Security tip</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-relaxed">Always use the principle of least privilege. Only assign scopes strictly necessary for the automated task.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <CustomButton variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</CustomButton>
                        <CustomButton
                            className="bg-primary hover:bg-primary/90 text-white"
                            onClick={() => {
                                if (!newAccountName) { toast.error("Please enter a name"); return }
                                toast.success(`Service account '${newAccountName}' created successfully`)
                                setNewAccountName("")
                                setShowCreateDialog(false)
                            }}
                        >
                            Generate account
                        </CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
