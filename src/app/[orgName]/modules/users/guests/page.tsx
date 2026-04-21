"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Globe,
    Search,
    UserPlus,
    ShieldCheck,
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { getAllUsers } from "@/modules/crm/users/hooks/userHooks"
import { useParams } from "next/navigation"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogHeader,
    CustomDialogTitle,
    CustomDialogDescription,
    CustomDialogFooter,
} from "@/shared/components/custom/CustomDialog"
import {
    CustomSelect,
    CustomSelectTrigger,
    CustomSelectValue,
    CustomSelectContent,
    CustomSelectItem,
} from "@/shared/components/custom/CustomSelect"
import { CustomLabel } from "@/shared/components/custom/CustomLabel"
import { CustomInput } from "@/shared/components/custom/CustomInput"
import { showSuccess, showWarning, showError } from "@/utils/toast"
import { createOrgInvite } from "@/modules/crm/organizations/hooks/orgHooks"

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

    // Revoke state
    const [revokeTarget, setRevokeTarget] = useState<GuestUser | null>(null)

    // Static guest data
    const [staticGuests, setStaticGuests] = useState<GuestUser[]>([
        { id: "g1", name: "Emily Chen", email: "e.chen@partner.co", domain: "partner.co", accessLevel: "Viewer", status: "Active", expires: "2026-06-15" },
        { id: "g2", name: "Marco Rossi", email: "m.rossi@vendor.io", domain: "vendor.io", accessLevel: "Editor", status: "Active", expires: "2026-05-01" },
        { id: "g3", name: "Priya Sharma", email: "p.sharma@client.org", domain: "client.org", accessLevel: "Viewer", status: "Expired", expires: "2026-02-28" },
    ])

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

    const handleInvite = async () => {
        if (!inviteName.trim() || !inviteEmail.trim()) {
            showWarning("Please fill in all fields")
            return
        }

        // Name validation (no numbers)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(inviteName.trim())) {
            showWarning("Name should not contain numbers or special characters")
            return
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inviteEmail.trim())) {
            showWarning("Please enter a valid email address")
            return
        }

        try {
            setLoading(true)
            await createOrgInvite({
                email: inviteEmail.trim(),
                role: inviteAccess
            })

            const newGuest: GuestUser = {
                id: `g-${Date.now()}`,
                name: inviteName.trim(),
                email: inviteEmail.trim(),
                domain: inviteDomain || inviteEmail.trim().split("@")[1] || "External",
                accessLevel: inviteAccess,
                status: "Active",
                expires: "2027-03-27",
            }
            setStaticGuests((prev) => [...prev, newGuest])
            showSuccess(`${inviteName.trim()} has been invited as a guest`)
            setInviteOpen(false)
            setInviteName("")
            setInviteEmail("")
            setInviteDomain("")
            setInviteAccess("Viewer")
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to invite guest user")
        } finally {
            setLoading(false)
        }
    }

    const handleRevoke = () => {
        if (!revokeTarget) return
        setStaticGuests((prev) => prev.filter((g) => g.id !== revokeTarget.id))
        showWarning(`Access revoked for ${revokeTarget.name}`)
        setRevokeTarget(null)
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
                    <CustomSelect value={filterAccess} onValueChange={setFilterAccess}>
                        <CustomSelectTrigger className="w-[160px] rounded-none">
                            <CustomSelectValue placeholder="Filter access" />
                        </CustomSelectTrigger>
                        <CustomSelectContent className="rounded-none">
                            <CustomSelectItem value="all">All levels</CustomSelectItem>
                            <CustomSelectItem value="viewer">Viewer</CustomSelectItem>
                            <CustomSelectItem value="editor">Editor</CustomSelectItem>
                            <CustomSelectItem value="admin">Admin</CustomSelectItem>
                        </CustomSelectContent>
                    </CustomSelect>
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

            {/* Invite guest modal */}
            <CustomDialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <CustomDialogContent className="max-w-md rounded-none p-0 overflow-hidden">
                    <div className="bg-primary px-5 py-4">
                        <CustomDialogTitle className="text-white text-sm font-semibold">Invite external user</CustomDialogTitle>
                    </div>
                    <div className="px-5 py-4 space-y-4">
                        <div>
                            <CustomLabel>Name</CustomLabel>
                            <CustomInput
                                placeholder="Full name"
                                value={inviteName}
                                onChange={(e) => setInviteName(e.target.value)}
                                className="rounded-none"
                            />
                        </div>
                        <div>
                            <CustomLabel>Email</CustomLabel>
                            <CustomInput
                                placeholder="user@example.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="rounded-none"
                            />
                        </div>
                        <div>
                            <CustomLabel>Domain</CustomLabel>
                            <CustomInput
                                placeholder="company.com"
                                value={inviteDomain}
                                onChange={(e) => setInviteDomain(e.target.value)}
                                className="rounded-none"
                            />
                        </div>
                        <div>
                            <CustomLabel>Access level</CustomLabel>
                            <CustomSelect value={inviteAccess} onValueChange={setInviteAccess}>
                                <CustomSelectTrigger className="w-full rounded-none">
                                    <CustomSelectValue />
                                </CustomSelectTrigger>
                                <CustomSelectContent className="rounded-none">
                                    <CustomSelectItem value="Viewer">Viewer</CustomSelectItem>
                                    <CustomSelectItem value="Editor">Editor</CustomSelectItem>
                                    <CustomSelectItem value="Admin">Admin</CustomSelectItem>
                                </CustomSelectContent>
                            </CustomSelect>
                        </div>
                    </div>
                    <CustomDialogFooter className="px-5 pb-4">
                        <CustomButton variant="outline" size="sm" className="rounded-none" onClick={() => setInviteOpen(false)}>
                            Cancel
                        </CustomButton>
                        <CustomButton size="sm" className="rounded-none bg-primary text-white" onClick={handleInvite}>
                            Send invite
                        </CustomButton>
                    </CustomDialogFooter>
                </CustomDialogContent>
            </CustomDialog>

            {/* Revoke access confirmation dialog */}
            <CustomDialog open={!!revokeTarget} onOpenChange={(open) => !open && setRevokeTarget(null)}>
                <CustomDialogContent className="max-w-md rounded-none p-0 overflow-hidden">
                    <div className="bg-primary px-5 py-4">
                        <CustomDialogTitle className="text-white text-sm font-semibold">Revoke access</CustomDialogTitle>
                    </div>
                    <div className="px-5 py-4">
                        <CustomDialogDescription className="text-sm text-gray-600">
                            Are you sure you want to revoke access for <span className="font-semibold text-gray-900">{revokeTarget?.name}</span>? They will no longer be able to access any resources in your organization.
                        </CustomDialogDescription>
                    </div>
                    <CustomDialogFooter className="px-5 pb-4">
                        <CustomButton variant="outline" size="sm" className="rounded-none" onClick={() => setRevokeTarget(null)}>
                            Cancel
                        </CustomButton>
                        <CustomButton variant="destructive" size="sm" className="rounded-none" onClick={handleRevoke}>
                            Revoke access
                        </CustomButton>
                    </CustomDialogFooter>
                </CustomDialogContent>
            </CustomDialog>
        </div>
    )
}
