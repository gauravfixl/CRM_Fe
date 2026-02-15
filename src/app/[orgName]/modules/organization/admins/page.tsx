"use client"

import React, { useState } from "react"
import {
    ShieldCheck,
    Search,
    Filter,
    Download,
    MoreVertical,
    UserPlus,
    Mail,
    Shield,
    Activity,
    Ban,
    CheckCircle2,
    SearchX,
    Lock,
    X,
    User,
    Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const initialAdmins = [
    { id: "ADM-001", name: "Robert Fox", email: "robert@foxsolutions.com", role: "Super Admin", status: "Active", lastActive: "2 mins ago" },
    { id: "ADM-002", name: "Jane Fisher", email: "jane.f@techventures.io", role: "Org Admin", status: "Active", lastActive: "1 hour ago" },
    { id: "ADM-003", name: "Michael Chen", email: "m.chen@globaltrade.co", role: "Compliance Officer", status: "Pending", lastActive: "Never" },
    { id: "ADM-004", name: "Sarah Jenkins", email: "sarah@fincorp.biz", role: "Billing Admin", status: "Active", lastActive: "Yesterday" },
]

export default function FirmAdminsPage() {
    const [admins, setAdmins] = useState(initialAdmins)
    const [searchQuery, setSearchQuery] = useState("")
    const [isInviteOpen, setIsInviteOpen] = useState(false)

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleInviteAdmin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("fullName") as string
        const email = formData.get("email") as string
        const role = formData.get("role") as string

        if (!name || !email) return toast.error("All fields are required")

        const newAdmin = {
            id: `ADM-00${admins.length + 1}`,
            name,
            email,
            role,
            status: "Pending",
            lastActive: "Never"
        }

        toast.promise(new Promise(res => setTimeout(res, 1500)), {
            loading: "Sending encryption keys and invite link...",
            success: () => {
                setAdmins([newAdmin, ...admins])
                setIsInviteOpen(false)
                return `Invitation transmitted to ${email}`
            },
            error: "Failed to send invitation."
        })
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Firm Administrators</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage institutional level identities and their global access privileges.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Exporting admin ledger...")}>
                        <Download className="w-4 h-4" />
                        Export Ledger
                    </Button>
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-9 bg-slate-900 hover:bg-black text-white gap-2 font-black uppercase text-[10px] tracking-widest px-6 shadow-xl">
                                <UserPlus className="w-4 h-4" />
                                Invite Firm Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
                            <div className="bg-indigo-600 p-8 text-white relative">
                                <Shield className="absolute right-4 top-4 w-12 h-12 text-white opacity-10" />
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black text-white tracking-tight">Access Provisioning</DialogTitle>
                                    <DialogDescription className="text-indigo-100 font-medium">
                                        Grant administrative privileges to a new institutional identity.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                            <form onSubmit={handleInviteAdmin} className="p-8 space-y-5 bg-white">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Legal Name</Label>
                                        <Input id="fullName" name="fullName" placeholder="e.g. Alexander Pierce" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Corporate Email</Label>
                                        <Input id="email" name="email" type="email" placeholder="alex@firm.com" className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Administrative Role</Label>
                                        <Select name="role" defaultValue="Org Admin">
                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Super Admin">Super Admin (Full Access)</SelectItem>
                                                <SelectItem value="Org Admin">Org Admin (Management)</SelectItem>
                                                <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                                                <SelectItem value="Billing Admin">Billing Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="pt-4 flex items-center justify-between">
                                    <p className="text-[10px] text-slate-400 font-medium italic max-w-[180px]">MFA invitation will be sent to the provided email.</p>
                                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 font-black uppercase text-[10px] tracking-widest h-11 rounded-xl shadow-lg shadow-indigo-100">
                                        Send Invite
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-indigo-600">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Admins</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-slate-900">{admins.length}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Global Scope</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Seats</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-emerald-600">{admins.filter(a => a.status === 'Active').length}</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter">Verified identities</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-amber-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Keys</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-amber-600">{admins.filter(a => a.status === 'Pending').length}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Awaiting MFA sync</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-blue-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Roles</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-blue-600">4</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">Hierarchical Levels</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search admins by name or email..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" className="h-10 text-xs font-bold gap-2 text-slate-600">
                    <Filter className="w-4 h-4" />
                    Filter Roles
                </Button>
            </div>

            {/* ADMINS TABLE */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Administrative Directory</CardTitle>
                        <CardDescription className="text-xs font-medium">List of all identities with organizational override capabilities.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/30 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity Details</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Global Role</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Last Observed</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 leading-none">{admin.name}</p>
                                                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-5 font-bold text-slate-700 text-xs uppercase tracking-tight">
                                            {admin.role}
                                        </td>
                                        <td className="px-4 py-5">
                                            <Badge className={`text-[9px] font-black uppercase tracking-tight rounded-md border-none ${admin.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {admin.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-5 text-xs text-slate-500 font-medium">
                                            {admin.lastActive}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 transition-colors" onClick={() => toast.info(`Options for ${admin.name}`)}>
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredAdmins.length === 0 && (
                            <div className="p-20 flex flex-col items-center justify-center text-center">
                                <SearchX className="w-12 h-12 text-slate-200 mb-4" />
                                <p className="text-sm font-bold text-slate-900">No identities found</p>
                                <p className="text-xs text-slate-400 mt-1">Try refining your search terms.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
