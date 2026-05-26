"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Globe,
    Search,
    UserPlus,
    ShieldCheck,
    AlertTriangle,
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { getAllUsers } from "@/modules/crm/users/hooks/userHooks"
import { useParams } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning, showError } from "@/utils/toast"
import { createOrgInvite, updateOrgUser } from "@/modules/crm/organizations/hooks/orgHooks"

interface GuestUser {
    id: string
    _id?: string
    name: string
    email: string
    domain: string
    accessLevel: string
    status: string
    expires: string
    role?: string
}

export default function GuestUsersPage() {
    const params = useParams()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterAccess, setFilterAccess] = useState("all")

    // Invite modal state
    const [inviteOpen, setInviteOpen] = useState(false)
    const [inviteName, setInviteName] = useState("")
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteDomain, setInviteDomain] = useState("")
    const [inviteAccess, setInviteAccess] = useState("Viewer")
    const [inviteTouched, setInviteTouched] = useState<Record<string, boolean>>({})
    const [inviting, setInviting] = useState(false)

    // Revoke state
    const [revokeTarget, setRevokeTarget] = useState<GuestUser | null>(null)
    const [revoking, setRevoking] = useState(false)

    const inviteErrors = useMemo(() => {
        const e: Record<string, string> = {}
        if (inviteTouched.name) {
            const v = inviteName.trim()
            if (!v) e.name = "Name is required"
            else if (v.length < 2) e.name = "Name too short"
            else if (!/^[a-zA-Z][a-zA-Z\s.'-]*$/.test(v))
                e.name = "Letters, spaces, and . ' - only"
        }
        if (inviteTouched.email) {
            const v = inviteEmail.trim()
            if (!v) e.email = "Email is required"
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
                e.email = "Enter a valid email"
        }
        if (inviteTouched.domain && inviteDomain) {
            if (!/^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/.test(inviteDomain.trim()))
                e.domain = "Enter a valid domain (e.g. company.com)"
        }
        return e
    }, [inviteName, inviteEmail, inviteDomain, inviteTouched])

    const resetInvite = () => {
        setInviteName("")
        setInviteEmail("")
        setInviteDomain("")
        setInviteAccess("Viewer")
        setInviteTouched({})
    }

    // No static data — guests are now derived purely from the API
    const [staticGuests, setStaticGuests] = useState<GuestUser[]>([])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await getAllUsers()
            if (res?.data?.users) {
                setUsers(res.data.users)
            } else if (res?.data?.data) {
                setUsers(res.data.data)
            }
        } catch (err) {
            console.error("Error fetching users:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const apiGuests = useMemo(() => {
        return users
            .filter((user) => {
                const isGuest =
                    user.role?.toLowerCase().includes("guest") ||
                    (user.email && !user.email.includes(params.orgName as string))
                return isGuest
            })
            .map((user) => ({
                id: user._id || user.id,
                _id: user._id,
                name: user.name || "Guest user",
                email: user.email || "",
                domain: user.email?.split("@")[1] || "External",
                accessLevel: "Viewer",
                status: "Active",
                expires: "2026-12-31",
            }))
    }, [users, params.orgName])

    const allGuests = useMemo(() => {
        return [...staticGuests, ...apiGuests]
    }, [staticGuests, apiGuests])

    const filtered = useMemo(() => {
        return allGuests.filter((g) => {
            const matchesSearch =
                g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.email.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesAccess =
                filterAccess === "all" || g.accessLevel.toLowerCase() === filterAccess.toLowerCase()
            return matchesSearch && matchesAccess
        })
    }, [allGuests, searchQuery, filterAccess])

    const activeCount = allGuests.filter((g) => g.status === "Active").length
    const expiredCount = allGuests.filter((g) => g.status === "Expired").length
    const domains = new Set(allGuests.map((g) => g.domain)).size

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setInviteTouched({ name: true, email: true, domain: true })

        const name = inviteName.trim()
        const email = inviteEmail.trim()
        if (!name) return showWarning("Name is required")
        if (!/^[a-zA-Z][a-zA-Z\s.'-]*$/.test(name))
            return showWarning("Name contains invalid characters")
        if (!email) return showWarning("Email is required")
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return showWarning("Enter a valid email address")
        if (
            inviteDomain &&
            !/^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/.test(inviteDomain.trim())
        ) {
            return showWarning("Enter a valid domain (e.g. company.com)")
        }

        try {
            setInviting(true)
            await createOrgInvite({
                email,
                role: inviteAccess,
            })

            const newGuest: GuestUser = {
                id: `g-${Date.now()}`,
                name,
                email,
                domain: inviteDomain.trim() || email.split("@")[1] || "External",
                accessLevel: inviteAccess,
                status: "Active",
                expires: "2027-03-27",
            }
            setStaticGuests((prev) => [...prev, newGuest])
            showSuccess(`${name} has been invited as a guest`)
            setInviteOpen(false)
            resetInvite()
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to invite guest user")
        } finally {
            setInviting(false)
        }
    }

    const handleRevoke = async () => {
        if (!revokeTarget) return
        setRevoking(true)
        try {
            const isApiUser = !!revokeTarget._id
            if (isApiUser) {
                await updateOrgUser(revokeTarget._id as string, { orgActive: false })
                await fetchUsers()
            } else {
                setStaticGuests((prev) => prev.filter((g) => g.id !== revokeTarget.id))
            }
            showWarning(`Access revoked for ${revokeTarget.name}`)
            setRevokeTarget(null)
        } catch (err: any) {
            console.error("Failed to revoke access:", err)
            showError(err?.response?.data?.message || "Failed to revoke access")
        } finally {
            setRevoking(false)
        }
    }

    const accessBadge = (level: string) => {
        switch (level) {
            case "Editor":
                return <Badge className="bg-blue-50 text-blue-600 border border-blue-200 rounded-none text-[10px] font-medium">{level}</Badge>
            case "Admin":
                return <Badge className="bg-purple-50 text-purple-600 border border-purple-200 rounded-none text-[10px] font-medium">{level}</Badge>
            default:
                return <Badge className="bg-gray-50 text-gray-600 border border-gray-200 rounded-none text-[10px] font-medium">{level}</Badge>
        }
    }

    const statusBadge = (status: string) => {
        if (status === "Active") {
            return <Badge className="bg-green-50 text-green-600 border border-green-200 rounded-none text-[10px] font-medium">{status}</Badge>
        }
        return <Badge className="bg-red-50 text-red-600 border border-red-200 rounded-none text-[10px] font-medium">{status}</Badge>
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Guest Users"
                breadcrumbItems={[
                    { label: "Users", href: "#" },
                    { label: "Guests", href: "#" },
                ]}
            />

            <div className="p-4 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Guest users</h1>
                        <p className="text-xs text-gray-600 mt-1">Manage external collaborators and their access to your organization</p>
                    </div>
                    <CustomButton
                        size="sm"
                        className="rounded-none bg-primary text-white text-xs"
                        onClick={() => setInviteOpen(true)}
                    >
                        <UserPlus className="w-3.5 h-3.5 mr-1" />
                        Invite external user
                    </CustomButton>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Active guests</p>
                        <p className="text-xl font-semibold text-primary mt-1">{activeCount}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Currently active</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Collaboration domains</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">{domains}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">External organizations</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Security posture</p>
                        <p className="text-xl font-semibold text-green-600 mt-1">Optimal</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">All policies enforced</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-500">Expired guests</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">{expiredCount}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Access expired</p>
                    </div>
                </div>

                {/* Search + Filter */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-none text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search by name or email..."
                        />
                    </div>
                    <Select value={filterAccess} onValueChange={setFilterAccess}>
                        <SelectTrigger className="w-[160px] rounded-none">
                            <SelectValue placeholder="Filter access" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="all">All levels</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Home domain</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Access level</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Expires</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <p className="text-sm text-gray-400">Loading guests...</p>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">No guest users found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((guest) => (
                                        <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{guest.name}</p>
                                                    <p className="text-xs text-gray-500">{guest.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-gray-600">{guest.domain}</p>
                                            </td>
                                            <td className="px-4 py-3">{accessBadge(guest.accessLevel)}</td>
                                            <td className="px-4 py-3">{statusBadge(guest.status)}</td>
                                            <td className="px-4 py-3">
                                                <p className="text-xs text-gray-600">{guest.expires}</p>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <CustomButton
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-none text-xs text-red-600 border-red-200 hover:bg-red-50"
                                                    onClick={() => setRevokeTarget(guest)}
                                                >
                                                    Revoke access
                                                </CustomButton>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Invite external user — side sheet */}
            <SideFormSheet
                open={inviteOpen}
                onOpenChange={(o) => {
                    setInviteOpen(o)
                    if (!o) resetInvite()
                }}
                title="Invite external user"
                description="Send an invitation to a guest user outside your organization."
                icon={<UserPlus className="w-5 h-5" />}
                width="md"
                onSubmit={handleInvite}
                submitLabel="Send invite"
                loading={inviting}
            >
                <div className="space-y-4">
                    <Field
                        label="Full name"
                        required
                        error={inviteErrors.name}
                        hint="Letters, spaces, and . ' - only"
                    >
                        <Input
                            placeholder="Jane Doe"
                            value={inviteName}
                            onChange={(e) =>
                                setInviteName(e.target.value.replace(/[^a-zA-Z\s.'-]/g, ""))
                            }
                            onBlur={() => setInviteTouched((t) => ({ ...t, name: true }))}
                            maxLength={60}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                        />
                    </Field>

                    <Field label="Email" required error={inviteErrors.email}>
                        <Input
                            type="email"
                            placeholder="user@partner.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            onBlur={() => setInviteTouched((t) => ({ ...t, email: true }))}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                            autoComplete="email"
                        />
                    </Field>

                    <Field
                        label="Domain"
                        error={inviteErrors.domain}
                        hint="Optional — auto-detected from email if blank"
                    >
                        <Input
                            placeholder="company.com"
                            value={inviteDomain}
                            onChange={(e) => setInviteDomain(e.target.value)}
                            onBlur={() => setInviteTouched((t) => ({ ...t, domain: true }))}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                        />
                    </Field>

                    <Field label="Access level" required hint="Viewer is recommended for external collaborators">
                        <Select value={inviteAccess} onValueChange={setInviteAccess}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Viewer">Viewer</SelectItem>
                                <SelectItem value="Editor">Editor</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Revoke access — confirmation dialog */}
            <Dialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
                <DialogContent className="sm:max-w-[440px] rounded-xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-5 pb-4 border-b border-slate-100">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">Revoke access?</h2>
                                <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">
                                    They will no longer be able to access any resources in your organization.
                                </p>
                            </div>
                        </div>
                    </div>
                    {revokeTarget && (
                        <div className="px-5 py-4">
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <p className="text-[13px] font-semibold text-gray-900">{revokeTarget.name}</p>
                                <p className="text-[11.5px] text-gray-500 mt-0.5">{revokeTarget.email}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 gap-2 sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setRevokeTarget(null)}
                            disabled={revoking}
                            className="h-9 text-[13px] font-medium rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRevoke}
                            disabled={revoking}
                            variant="destructive"
                            className="h-9 text-[13px] font-medium rounded-lg gap-2"
                        >
                            {revoking && (
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            Revoke access
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
