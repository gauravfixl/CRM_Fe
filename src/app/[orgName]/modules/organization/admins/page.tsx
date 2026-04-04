"use client"

import React, { useState, useEffect } from "react"
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
    Users,
    Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu"
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
import { axiosInstance } from "@/lib/axios"

const roleMap: Record<string, string> = {
    ADMIN: "Super Admin",
    SUB_ADMIN: "Org Admin",
    MANAGER: "Compliance Officer",
    BILLING: "Billing Admin",
}

const roleReverseMap: Record<string, string> = {
    "Super Admin": "ADMIN",
    "Org Admin": "SUB_ADMIN",
    "Compliance Officer": "MANAGER",
    "Billing Admin": "BILLING",
}

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
    const [loading, setLoading] = useState(true)

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null)

    const handleExport = () => {
        const csvContent = [
            ["ID", "Name", "Email", "Role", "Status", "Last Active"].join(","),
            ...admins.map(a => [a.id, a.name || '—', a.email, a.role, a.status, a.lastActive || '—'].join(","))
        ].join("\n")
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "firm_admins_ledger.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success("Ledger exported successfully")
    }

    const handleEditRole = (admin: any) => {
        if (admin.role === "Super Admin" || admin.role === "SuperAdmin") {
            toast.error("Cannot edit a Super Admin role from here.")
            return
        }
        if (admin.status === "Pending") {
            toast.info("Cannot edit role of a pending invite currently.")
            return
        }
        setSelectedAdmin(admin)
        setIsEditOpen(true)
    }

    const submitEditRole = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!selectedAdmin) return
        const formData = new FormData(e.currentTarget)
        const role = formData.get("role") as string
        const apiRole = roleReverseMap[role] || role

        toast.promise(
            axiosInstance.put(`/organization/updateuser/${selectedAdmin.id}`, { Role: apiRole, custom: false }),
            {
                loading: "Updating role...",
                success: () => {
                    setIsEditOpen(false)
                    fetchAdmins()
                    return "Role updated successfully"
                },
                error: (err) => err.response?.data?.message || "Failed to update role"
            }
        )
    }

    const handleRevokeAccess = async (admin: any) => {
        if (admin.role === "Super Admin" || admin.role === "SuperAdmin") {
            toast.error("Cannot revoke Super Admin access.")
            return
        }
        if (admin.status === "Pending") {
            toast.info("Cannot revoke pending invite via this endpoint yet.")
            return
        }

        if (window.confirm(`Are you sure you want to revoke access for ${admin.name}?`)) {
            toast.promise(
                axiosInstance.delete(`/organization/deleteuser/${admin.id}`),
                {
                    loading: "Revoking access...",
                    success: () => {
                        fetchAdmins()
                        return "Access revoked successfully"
                    },
                    error: (err) => err.response?.data?.message || "Failed to revoke access"
                }
            )
        }
    }

    const fetchAdmins = async () => {
        try {
            setLoading(true)
            const [usersRes, invitesRes] = await Promise.all([
                axiosInstance.get("/organization/users/all?page=1&limit=100"),
                axiosInstance.get("/organization/all/Invite").catch(() => ({ data: [] })),
            ])

            const activeAdmins = (usersRes.data?.users || []).map((user: any) => ({
                id: user.memberId,
                name: user.name || "—",
                email: user.email,
                role: roleMap[user.role] || user.role,
                status: "Active",
                lastActive: "—",
            }))

            const pendingInvites = (Array.isArray(invitesRes.data) ? invitesRes.data : invitesRes.data?.invites || []).map((invite: any) => ({
                id: invite._id || invite.id || `INV-${invite.email}`,
                name: invite.name || invite.email?.split("@")[0] || "—",
                email: invite.email,
                role: roleMap[invite.role] || invite.role || "Org Admin",
                status: "Pending",
                lastActive: "Never",
            }))

            setAdmins([...activeAdmins, ...pendingInvites])
        } catch (error) {
            console.error("Failed to fetch admins:", error)
            toast.error("Failed to load admins. Showing cached data.")
            setAdmins(initialAdmins)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdmins()
    }, [])

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

        const apiRole = roleReverseMap[role] || "SUB_ADMIN"

        toast.promise(
            axiosInstance.post("/organization/createInvite", { email, role: apiRole }),
            {
                loading: "Sending encryption keys and invite link...",
                success: () => {
                    setIsInviteOpen(false)
                    fetchAdmins()
                    return `Invitation transmitted to ${email}`
                },
                error: "Failed to send invitation."
            }
        )
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto font-outfit">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900">Firm Administrators</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage institutional level identities and their global access privileges.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-gray-200 font-medium" onClick={handleExport}>
                        <Download className="w-4 h-4" />
                        Export Ledger
                    </Button>
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-9 bg-primary hover:bg-primary/90 text-white gap-2 font-medium px-6 shadow-sm rounded-md">
                                <UserPlus className="w-4 h-4" />
                                Invite Firm Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-xl shadow-xl">
                            <div className="bg-primary p-6 text-white relative">
                                <Shield className="absolute right-6 top-6 w-12 h-12 text-white/10" />
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold text-white">Access Provisioning</DialogTitle>
                                    <DialogDescription className="text-white/80 text-sm mt-1">
                                        Grant administrative privileges to a new institutional identity.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                            <form onSubmit={handleInviteAdmin} className="p-6 space-y-5 bg-white">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Legal Name</Label>
                                        <Input id="fullName" name="fullName" placeholder="e.g. Alexander Pierce" className="h-10 rounded-md bg-white border-gray-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Corporate Email</Label>
                                        <Input id="email" name="email" type="email" placeholder="alex@firm.com" className="h-10 rounded-md bg-white border-gray-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-sm font-medium text-gray-700">Administrative Role</Label>
                                        <Select name="role" defaultValue="Org Admin">
                                            <SelectTrigger className="h-10 rounded-md bg-white border-gray-200">
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
                                    <p className="text-xs text-gray-500 max-w-[200px]">MFA invitation will be sent to the provided email.</p>
                                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 font-medium h-10 rounded-md shadow-sm">
                                        Send Invite
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Admins</p>
                                <p className="text-white text-xl font-semibold mt-1">{admins.length}</p>
                                <p className="text-white text-[10px] mt-1">Global Scope</p>
                            </div>
                            <Users className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Seats</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{admins.filter(a => a.status === 'Active').length}</p>
                                <p className="text-green-600 text-[10px] mt-1">Verified identities</p>
                            </div>
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Pending Keys</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{admins.filter(a => a.status === 'Pending').length}</p>
                                <p className="text-amber-600 text-[10px] mt-1">Awaiting MFA sync</p>
                            </div>
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Global Roles</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">4</p>
                                <p className="text-blue-600 text-[10px] mt-1">Hierarchical Levels</p>
                            </div>
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm mt-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search admins by name or email..."
                        className="pl-10 h-9 border-none bg-transparent focus-visible:ring-0 text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Separator orientation="vertical" className="h-6 bg-gray-200" />
                <Button variant="ghost" className="h-9 text-xs font-semibold gap-2 text-gray-600">
                    <Filter className="w-4 h-4" />
                    Filter Roles
                </Button>
            </div>

            {/* ADMINS TABLE */}
            <Card className="border-gray-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="border-b border-gray-100 bg-white flex flex-row items-center justify-between p-4">
                    <div>
                        <CardTitle className="text-base font-semibold text-gray-900">Administrative Directory</CardTitle>
                        <CardDescription className="text-sm text-gray-500 mt-1">List of all identities with organizational override capabilities.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500">Identity Details</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Global Role</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Last Observed</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm transition-colors">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{admin.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-700">
                                            {admin.role}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Badge className={`text-xs font-medium px-2 py-0.5 rounded-full border-none ${admin.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                                                }`}>
                                                {admin.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500">
                                            {admin.lastActive}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-white z-50">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleEditRole(admin)} className="cursor-pointer font-medium">
                                                        Edit Role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRevokeAccess(admin)} className="cursor-pointer font-medium text-red-600 focus:text-red-700">
                                                        Revoke Access
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredAdmins.length === 0 && (
                            <div className="p-16 flex flex-col items-center justify-center text-center">
                                <SearchX className="w-10 h-10 text-gray-300 mb-3" />
                                <p className="text-sm font-semibold text-gray-900">No identities found</p>
                                <p className="text-sm text-gray-500 mt-1">Try refining your search terms.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Role Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[450px] p-0 border-none rounded-xl shadow-xl overflow-hidden bg-white">
                    <div className="bg-primary p-6 text-white relative">
                        <Shield className="absolute right-6 top-6 w-12 h-12 text-white/10" />
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-white">Edit Access Privileges</DialogTitle>
                            <DialogDescription className="text-white/80 text-sm mt-1">
                                Update the administrative role for this identity.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <form onSubmit={submitEditRole} className="p-6 space-y-5 flex flex-col items-stretch">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Identity Details</Label>
                                <div className="p-3 bg-gray-50 rounded-md border border-gray-100 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{selectedAdmin?.name}</p>
                                        <p className="text-xs text-gray-500">{selectedAdmin?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-role" className="text-sm font-medium text-gray-700">Administrative Role</Label>
                                <Select name="role" defaultValue={selectedAdmin?.role || "Org Admin"}>
                                    <SelectTrigger id="edit-role" className="h-10 rounded-md bg-white border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Org Admin">Org Admin (Management)</SelectItem>
                                        <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                                        <SelectItem value="Billing Admin">Billing Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-full pt-4 flex justify-end gap-3 mt-auto">
                            <Button type="button" variant="outline" className="h-10 rounded-md whitespace-nowrap px-6 shrink-0" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-medium h-10 rounded-md px-6 shadow-sm whitespace-nowrap shrink-0">Save Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}
