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
import { fetchUsersApi, createOrgInvite, updateOrgUser, deleteOrgUser, getAllOrgInvites } from "@/modules/crm/organizations/hooks/orgHooks"
import { getAllFirmsList } from "@/hooks/firmHooks"

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

export default function FirmAdminsPage() {
    const [admins, setAdmins] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null)

    // Invite form state
    const [inviteForm, setInviteForm] = useState({ name: "", email: "", firmId: "", role: "FIRM_ADMIN" })
    const [inviteErrors, setInviteErrors] = useState<Record<string, string>>({})
    const [inviteTouched, setInviteTouched] = useState<Record<string, boolean>>({})
    const [firms, setFirms] = useState<any[]>([])
    const [firmsLoading, setFirmsLoading] = useState(false)

    // Firm-level roles
    const firmRoles = [
        { value: "FIRM_ADMIN", label: "Firm Admin", desc: "Full access to manage the firm" },
        { value: "FIRM_MANAGER", label: "Firm Manager", desc: "Manage operations, no settings access" },
        { value: "FIRM_ACCOUNTANT", label: "Firm Accountant", desc: "Manage invoices & financial data" },
        { value: "FIRM_VIEWER", label: "Firm Viewer", desc: "Read-only access to firm data" },
    ]

    // Validation helpers
    const validateName = (value: string) => {
        if (!value.trim()) return "Name is required"
        if (value.trim().length < 2) return "Name must be at least 2 characters"
        if (value.trim().length > 50) return "Name must be under 50 characters"
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return "Name can only contain letters and spaces"
        return ""
    }

    const validateEmail = (value: string) => {
        if (!value.trim()) return "Email is required"
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())) return "Please enter a valid email address"
        return ""
    }

    const validateFirm = (value: string) => {
        if (!value) return "Please select a firm"
        return ""
    }

    const handleInviteFieldChange = (field: string, value: string) => {
        setInviteForm(prev => ({ ...prev, [field]: value }))
        setInviteTouched(prev => ({ ...prev, [field]: true }))

        // Real-time validation
        let error = ""
        if (field === "name") error = validateName(value)
        else if (field === "email") error = validateEmail(value)
        else if (field === "firmId") error = validateFirm(value)

        setInviteErrors(prev => ({ ...prev, [field]: error }))
    }

    const handleInviteBlur = (field: string) => {
        setInviteTouched(prev => ({ ...prev, [field]: true }))
        let error = ""
        if (field === "name") error = validateName(inviteForm.name)
        else if (field === "email") error = validateEmail(inviteForm.email)
        else if (field === "firmId") error = validateFirm(inviteForm.firmId)
        setInviteErrors(prev => ({ ...prev, [field]: error }))
    }

    // Fetch firms for dropdown
    const fetchFirms = async () => {
        try {
            setFirmsLoading(true)
            const res = await getAllFirmsList()
            const firmData = res?.data?.data || res?.data || []
            setFirms(Array.isArray(firmData) ? firmData : [])
        } catch (err) {
            console.error("Failed to fetch firms:", err)
        } finally {
            setFirmsLoading(false)
        }
    }

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
            updateOrgUser(selectedAdmin.id, { Role: apiRole, custom: false }),
            {
                loading: "Updating role...",
                success: () => {
                    setIsEditOpen(false)
                    fetchAdmins()
                    return "Role updated successfully"
                },
                error: (err: any) => err.response?.data?.message || "Failed to update role"
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
                deleteOrgUser(admin.id),
                {
                    loading: "Revoking access...",
                    success: () => {
                        fetchAdmins()
                        return "Access revoked successfully"
                    },
                    error: (err: any) => err.response?.data?.message || "Failed to revoke access"
                }
            )
        }
    }

    const fetchAdmins = async () => {
        try {
            setLoading(true)
            const [usersData, invitesRes] = await Promise.all([
                fetchUsersApi(),
                getAllOrgInvites().catch(() => ({ data: [] })),
            ])

            const users = usersData?.users || usersData || []
            const activeAdmins = (Array.isArray(users) ? users : []).map((user: any) => ({
                id: user.memberId || user._id,
                name: user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "—",
                email: user.email,
                role: roleMap[user.role] || user.role,
                status: user.orgActive === false ? "Inactive" : "Active",
                lastActive: user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "—",
                avatar: user.avatar,
            }))

            const invitesData = invitesRes?.data
            const invites = Array.isArray(invitesData) ? invitesData : invitesData?.invites || []
            const pendingInvites = invites.map((invite: any) => ({
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
            toast.error("Failed to load admins.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAdmins()
        fetchFirms()
    }, [])

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleInviteAdmin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validate all fields
        const nameError = validateName(inviteForm.name)
        const emailError = validateEmail(inviteForm.email)
        const firmError = validateFirm(inviteForm.firmId)

        const allErrors = { name: nameError, email: emailError, firmId: firmError }
        setInviteErrors(allErrors)
        setInviteTouched({ name: true, email: true, firmId: true, role: true })

        // Check if any errors
        if (nameError || emailError || firmError) {
            toast.error("Please fix the errors in the form")
            return
        }

        const selectedFirm = firms.find((f: any) => (f._id || f.id) === inviteForm.firmId)

        toast.promise(
            createOrgInvite({
                email: inviteForm.email.trim(),
                role: inviteForm.role,
                name: inviteForm.name.trim(),
                firmId: inviteForm.firmId,
            }),
            {
                loading: "Sending invite...",
                success: () => {
                    setIsInviteOpen(false)
                    setInviteForm({ name: "", email: "", firmId: "", role: "FIRM_ADMIN" })
                    setInviteErrors({})
                    setInviteTouched({})
                    fetchAdmins()
                    return `Invitation sent to ${inviteForm.email} for ${selectedFirm?.FirmName || "firm"}`
                },
                error: (err: any) => err?.response?.data?.message || "Failed to send invitation."
            }
        )
    }

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 space-y-6 overflow-y-auto font-outfit">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">Firm Administrators</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage institutional level identities and their global access privileges.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-border font-medium bg-card text-foreground" onClick={handleExport}>
                        <Download className="w-4 h-4" />
                        Export Ledger
                    </Button>
                    <Dialog open={isInviteOpen} onOpenChange={(open) => {
                        setIsInviteOpen(open)
                        if (!open) {
                            setInviteForm({ name: "", email: "", firmId: "", role: "FIRM_ADMIN" })
                            setInviteErrors({})
                            setInviteTouched({})
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="h-9 bg-primary hover:bg-primary/90 text-white gap-2 font-medium px-6 shadow-sm rounded-md">
                                <UserPlus className="w-4 h-4" />
                                Invite Firm Admin
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border border-border bg-card rounded-xl shadow-xl">
                            <div className="bg-primary p-6 text-primary-foreground relative">
                                <Shield className="absolute right-6 top-6 w-12 h-12 text-white/10" />
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold text-white">Invite Firm Admin</DialogTitle>
                                    <DialogDescription className="text-white/80 text-sm mt-1">
                                        Grant administrative privileges to manage a specific firm.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                            <form onSubmit={handleInviteAdmin} className="p-6 space-y-5 bg-card">
                                <div className="space-y-4">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="fullName" className="text-sm font-medium text-muted-foreground">
                                            Full Name <span className="text-destructive font-bold">*</span>
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="e.g. Vikram Singh"
                                            value={inviteForm.name}
                                            onChange={(e) => handleInviteFieldChange("name", e.target.value)}
                                            onBlur={() => handleInviteBlur("name")}
                                            className={`h-10 rounded-md bg-background border-border text-foreground outline-none focus-visible:ring-primary ${inviteTouched.name && inviteErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        />
                                        {inviteTouched.name && inviteErrors.name && (
                                            <p className="text-xs text-destructive mt-1 font-medium">{inviteErrors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="inviteEmail" className="text-sm font-medium text-muted-foreground">
                                            Email Address <span className="text-destructive font-bold">*</span>
                                        </Label>
                                        <Input
                                            id="inviteEmail"
                                            type="email"
                                            placeholder="e.g. vikram@company.com"
                                            value={inviteForm.email}
                                            onChange={(e) => handleInviteFieldChange("email", e.target.value)}
                                            onBlur={() => handleInviteBlur("email")}
                                            className={`h-10 rounded-md bg-background border-border text-foreground outline-none focus-visible:ring-primary ${inviteTouched.email && inviteErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        />
                                        {inviteTouched.email && inviteErrors.email && (
                                            <p className="text-xs text-destructive mt-1 font-medium">{inviteErrors.email}</p>
                                        )}
                                    </div>

                                    {/* Select Firm */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="firmSelect" className="text-sm font-medium text-gray-700">
                                            Assign to Firm <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={inviteForm.firmId}
                                            onValueChange={(val) => handleInviteFieldChange("firmId", val)}
                                        >
                                            <SelectTrigger
                                                id="firmSelect"
                                                className={`h-10 rounded-md bg-white ${inviteTouched.firmId && inviteErrors.firmId ? "border-red-400" : "border-gray-200"}`}
                                            >
                                                <SelectValue placeholder={firmsLoading ? "Loading firms..." : "Select a firm"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {firms.length === 0 ? (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        {firmsLoading ? "Loading..." : "No firms found. Create a firm first."}
                                                    </div>
                                                ) : (
                                                    firms.map((firm: any) => (
                                                        <SelectItem key={firm._id || firm.id} value={firm._id || firm.id}>
                                                            {firm.FirmName || firm.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {inviteTouched.firmId && inviteErrors.firmId && (
                                            <p className="text-xs text-red-500 mt-1">{inviteErrors.firmId}</p>
                                        )}
                                    </div>

                                    {/* Firm Role */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="firmRole" className="text-sm font-medium text-gray-700">
                                            Firm Role <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={inviteForm.role}
                                            onValueChange={(val) => handleInviteFieldChange("role", val)}
                                        >
                                            <SelectTrigger id="firmRole" className="h-10 rounded-md bg-white border-gray-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {firmRoles.map((r) => (
                                                    <SelectItem key={r.value} value={r.value}>
                                                        <div className="flex flex-col">
                                                            <span>{r.label}</span>
                                                            <span className="text-xs text-gray-400">{r.desc}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                                    <p className="text-xs text-gray-500 max-w-[200px]">An invitation email will be sent to the provided address.</p>
                                    <Button
                                        type="submit"
                                        disabled={!!(inviteErrors.name || inviteErrors.email || inviteErrors.firmId)}
                                        className="bg-primary hover:bg-primary/90 text-white px-6 font-medium h-10 rounded-md shadow-sm disabled:opacity-50"
                                    >
                                        Send Invite
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                        {/* QUICK STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border-none bg-primary/10 text-primary shadow-sm rounded-xl overflow-hidden">
                    <SmallCardContent className="p-4 bg-transparent">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70">Total Admins</p>
                                <p className="text-2xl font-black mt-1 text-primary">{admins.length}</p>
                                <p className="text-[10px] font-medium opacity-60">Global Scope</p>
                            </div>
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border border-border bg-card shadow-sm rounded-xl overflow-hidden">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Active Seats</p>
                                <p className="text-2xl font-black text-foreground mt-1">{admins.filter(a => a.status === 'Active').length}</p>
                                <p className="text-emerald-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">Verified identities</p>
                            </div>
                            <div className="h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border border-border bg-card shadow-sm rounded-xl overflow-hidden">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Pending Keys</p>
                                <p className="text-2xl font-black text-foreground mt-1">{admins.filter(a => a.status === 'Pending').length}</p>
                                <p className="text-amber-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">Awaiting MFA sync</p>
                            </div>
                            <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500">
                                <Lock className="w-5 h-5" />
                            </div>
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border border-border bg-card shadow-sm rounded-xl overflow-hidden">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Global Roles</p>
                                <p className="text-2xl font-black text-foreground mt-1">4</p>
                                <p className="text-blue-500 text-[10px] font-bold mt-1 uppercase tracking-tighter">Hierarchical Levels</p>
                            </div>
                            <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                                <Shield className="w-5 h-5" />
                            </div>
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>    </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-xl border border-border shadow-sm mt-2 focus-within:border-primary/50 transition-colors group">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search admins by name or email..."
                        className="pl-10 h-9 border-none bg-transparent focus-visible:ring-0 text-sm font-medium text-foreground placeholder:text-muted-foreground/60"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Separator orientation="vertical" className="h-6 bg-border" />
                <Button variant="ghost" className="h-9 text-xs font-bold gap-2 text-muted-foreground hover:text-foreground">
                    <Filter className="w-4 h-4" />
                    Filter Roles
                </Button>
            </div>

            {/* ADMINS TABLE */}
            <Card className="border-border shadow-md overflow-hidden bg-card rounded-xl">
                <CardHeader className="border-b border-border bg-card flex flex-row items-center justify-between p-4">
                    <div>
                        <CardTitle className="text-base font-bold text-foreground">Administrative Directory</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground mt-1">List of all identities with organizational override capabilities.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Identity Details</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Global Role</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Observed</th>
                                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading && (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={`skeleton-${i}`} className="animate-pulse">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                                                    <div className="space-y-2">
                                                        <div className="h-3 w-28 bg-gray-200 rounded" />
                                                        <div className="h-2.5 w-36 bg-gray-100 rounded" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
                                            <td className="px-4 py-4"><div className="h-5 w-14 bg-gray-200 rounded-full" /></td>
                                            <td className="px-4 py-4"><div className="h-3 w-16 bg-gray-200 rounded" /></td>
                                            <td className="px-6 py-4 text-right"><div className="h-6 w-6 bg-gray-200 rounded ml-auto" /></td>
                                        </tr>
                                    ))
                                )}
                                {!loading && filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">{admin.name}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-semibold text-foreground/80">
                                            {admin.role}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Badge className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border-none ${admin.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                                                }`}>
                                                {admin.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-muted-foreground font-medium">
                                            {admin.lastActive}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-card text-foreground border-border z-50">
                                                    <DropdownMenuLabel className="text-xs font-black uppercase tracking-widest opacity-50">Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-border" />
                                                    <DropdownMenuItem onClick={() => handleEditRole(admin)} className="cursor-pointer font-bold text-xs uppercase tracking-wider focus:bg-primary focus:text-primary-foreground">
                                                        Edit Role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleRevokeAccess(admin)} className="cursor-pointer font-bold text-xs uppercase tracking-wider text-destructive focus:bg-destructive focus:text-destructive-foreground">
                                                        Revoke Access
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!loading && filteredAdmins.length === 0 && (
                            <div className="p-16 flex flex-col items-center justify-center text-center bg-card">
                                <SearchX className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                <p className="text-sm font-black text-foreground uppercase tracking-widest">No identities found</p>
                                <p className="text-xs text-muted-foreground mt-1">Try refining your search terms.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Role Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[450px] p-0 border border-border rounded-xl shadow-xl overflow-hidden bg-card text-foreground">
                    <div className="bg-primary p-6 text-primary-foreground relative">
                        <Shield className="absolute right-6 top-6 w-12 h-12 text-white/10" />
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-white">Edit Access Privileges</DialogTitle>
                            <DialogDescription className="text-white/80 text-sm mt-1">
                                Update the administrative role for this identity.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <form onSubmit={submitEditRole} className="p-6 space-y-5 flex flex-col items-stretch bg-card">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Identity Details</Label>
                                <div className="p-3 bg-muted/30 rounded-md border border-border flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{selectedAdmin?.name}</p>
                                        <p className="text-xs text-muted-foreground">{selectedAdmin?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-role" className="text-sm font-medium text-muted-foreground uppercase tracking-widest text-[10px]">Administrative Role</Label>
                                <Select name="role" defaultValue={selectedAdmin?.role || "Org Admin"}>
                                    <SelectTrigger id="edit-role" className="h-10 rounded-md bg-background text-foreground border-border">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card text-foreground border-border">
                                        <SelectItem value="Org Admin" className="font-bold text-xs uppercase tracking-wider">Org Admin (Management)</SelectItem>
                                        <SelectItem value="Compliance Officer" className="font-bold text-xs uppercase tracking-wider">Compliance Officer</SelectItem>
                                        <SelectItem value="Billing Admin" className="font-bold text-xs uppercase tracking-wider">Billing Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="col-span-full pt-4 flex justify-end gap-3 mt-auto border-t border-border">
                            <Button type="button" variant="outline" className="h-10 rounded-md whitespace-nowrap px-6 shrink-0 border-border hover:bg-muted text-foreground" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[11px] h-10 rounded-md px-6 shadow-lg whitespace-nowrap shrink-0">Save Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    )
}
