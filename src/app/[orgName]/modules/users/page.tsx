"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Clock,
  Ban,
  Edit3,
  Trash2,
  UserCheck,
  UserX,
  Send,
  Link2,
  Eye,
  AlertTriangle,
  Mail,
  CalendarClock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { showSuccess, showWarning, showError } from "@/utils/toast"
import { UserFormDialog, splitName } from "@/shared/components/rbac/UserFormDialog"
import { getAllUsers } from "@/modules/crm/users/hooks/userHooks"
import { createOrgInvite, updateOrgUser, deleteOrgUser, getAllOrgInvites, declineOrgInvite, resendOrgInvite } from "@/modules/crm/organizations/hooks/orgHooks"

type Role = string
type Status = "Active" | "Pending" | "Suspended"
type MFA = "Enabled" | "Disabled"

const ROLES: Role[] = ["Admin", "Manager", "Developer", "Member", "HR"]

interface User {
  id: string
  firstName?: string
  lastName?: string
  name: string
  email: string
  role: Role
  roleId?: string
  firmIds?: string[]
  firmNames?: string[]
  status: Status
  mfa: MFA
  joined: string
  // Distinguish accepted org members from pending invitations so action handlers
  // can route to the right backend endpoint (member vs invite collections).
  isPending?: boolean
  inviteToken?: string
  // Invite-only metadata used by Resend / View details / expiry badge.
  inviteCreatedAt?: string
  inviteExpiresAt?: string
  inviteIsExpired?: boolean
  inviteExpiryLabel?: string
  invitedById?: string
}

// Returns a friendly "expires in 45m" / "expired" label for a pending invite.
const computeExpiryLabel = (expiresAt: string | undefined): { label: string; expired: boolean } => {
  if (!expiresAt) return { label: "no expiry set", expired: false }
  const diff = new Date(expiresAt).getTime() - Date.now()
  if (Number.isNaN(diff)) return { label: "invalid expiry", expired: false }
  if (diff <= 0) return { label: "expired", expired: true }
  if (diff < 60 * 1000) return { label: `${Math.max(1, Math.round(diff / 1000))}s left`, expired: false }
  if (diff < 60 * 60 * 1000) return { label: `${Math.round(diff / 60000)}m left`, expired: false }
  if (diff < 24 * 60 * 60 * 1000) return { label: `${Math.round(diff / 3600000)}h left`, expired: false }
  return { label: `${Math.round(diff / 86400000)}d left`, expired: false }
}

const STATUSES: Status[] = ["Active", "Pending", "Suspended"]

const cleanCombined = (s: any): string => {
  if (!s || typeof s !== "string") return ""
  // Backend builds `name` as `firstName + " " + lastName`. When either is
  // undefined this produces "undefined Foo" / "Foo undefined" / "undefined undefined".
  const cleaned = s
    .split(" ")
    .filter((p) => p && p !== "undefined" && p !== "null")
    .join(" ")
    .trim()
  return cleaned
}

// Maps an OrgMember record (accepted user) returned from /organization/users/all
const mapApiUserToUser = (apiUser: any, inviteFallback?: any): User => {
  // Backend returns combined `name` field (line 406 of orgController.js), not
  // separate firstName/lastName. The combined string can include literal
  // "undefined" tokens when the User record has no name — strip those.
  const cleanedName = cleanCombined(apiUser.name)
  const inviteFirst = inviteFallback?.firstName?.trim() || ""
  const inviteLast = inviteFallback?.lastName?.trim() || ""

  const split = cleanedName ? splitName(cleanedName) : { firstName: "", lastName: "" }
  const firstName = split.firstName || inviteFirst
  const lastName = split.lastName || inviteLast
  const finalName = [firstName, lastName].filter(Boolean).join(" ") || (apiUser.email?.split("@")[0] ?? "Unknown")

  const role: Role = apiUser.role || inviteFallback?.role || "Member"
  // Backend default-filters status="active", so any returned record is Active
  // unless the explicit per-member status says otherwise. orgActive in the
  // payload is the ORGANIZATION's isActive (not the member's), so we don't
  // use it for member status — that was the source of every user showing
  // as "Pending" before.
  const memberStatus = apiUser.status || apiUser.memberStatus
  const status: Status = memberStatus === "inactive" || memberStatus === "suspended" ? "Suspended" : "Active"
  const mfa: MFA = apiUser.twoFAEnabled ? "Enabled" : "Disabled"
  const joined = apiUser.joinedAt
    ? new Date(apiUser.joinedAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    : "N/A"

  // firmIds: backend returns either a `firms` array of {_id, FirmName} or a flat `firmIds`
  let firmIds: string[] = []
  if (Array.isArray(apiUser.firmIds)) firmIds = apiUser.firmIds.map(String)
  else if (Array.isArray(apiUser.firms)) firmIds = apiUser.firms.map((f: any) => String(f?._id || f))
  else if (Array.isArray(inviteFallback?.firmIds)) firmIds = inviteFallback.firmIds.map((f: any) => String(f?._id || f))

  return {
    id: apiUser.memberId || apiUser._id,
    firstName,
    lastName,
    name: finalName,
    email: apiUser.email || "",
    role,
    roleId: apiUser.roleId || inviteFallback?.roleId,
    firmIds,
    status,
    mfa,
    joined,
    isPending: false,
  }
}

// Maps a pending OrganizationInvite record to a User-shaped row so the All
// Users table can show invitees alongside accepted members.
const mapInviteToUser = (invite: any): User => {
  const firstName = (invite.firstName || "").trim()
  const lastName = (invite.lastName || "").trim()
  const finalName = [firstName, lastName].filter(Boolean).join(" ") || (invite.email?.split("@")[0] ?? "Pending invite")
  const role: Role = invite.role || "Member"
  const joined = invite.createdAt
    ? new Date(invite.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    : "N/A"

  const firmRaw: any[] = Array.isArray(invite.firmIds) ? invite.firmIds : []
  const firmIds: string[] = firmRaw.map((f: any) => String(f?._id || f))
  const firmNames: string[] = firmRaw
    .map((f: any) => (typeof f === "object" ? f?.FirmName : ""))
    .filter(Boolean)

  const expiresAtIso = invite.expiresAt ? new Date(invite.expiresAt).toISOString() : undefined
  const { label: expiryLabel, expired } = computeExpiryLabel(expiresAtIso)

  return {
    id: invite._id || "",
    firstName,
    lastName,
    name: finalName,
    email: invite.email || "",
    role,
    firmIds,
    firmNames,
    status: "Pending",
    mfa: "Disabled",
    joined,
    isPending: true,
    inviteToken: invite.token || "",
    inviteCreatedAt: invite.createdAt,
    inviteExpiresAt: expiresAtIso,
    inviteIsExpired: expired,
    inviteExpiryLabel: expiryLabel,
    invitedById: invite.invitedBy ? String(invite.invitedBy) : undefined,
  }
}

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All")

  // Modal states
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editInviteOpen, setEditInviteOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resendingId, setResendingId] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const [usersRes, invitesRes] = await Promise.allSettled([
        getAllUsers(),
        getAllOrgInvites(),
      ])

      // Org members (accepted users)
      let usersArray: any[] = []
      if (usersRes.status === "fulfilled") {
        const d: any = usersRes.value?.data || usersRes.value || {}
        usersArray = Array.isArray(d) ? d : d.users || d.data || []
      }

      // All invites (pending, accepted, expired, rejected)
      let invitesArray: any[] = []
      if (invitesRes.status === "fulfilled") {
        const d: any = invitesRes.value?.data || invitesRes.value || {}
        invitesArray = Array.isArray(d) ? d : d.invitations || d.invites || d.data || []
      }

      // Build email -> invite lookup so accepted-user rows can fall back to
      // the invite's firstName/lastName when the linked User record has none.
      const inviteByEmail = new Map<string, any>()
      for (const inv of invitesArray) {
        if (inv?.email) inviteByEmail.set(String(inv.email).toLowerCase(), inv)
      }

      const memberRows: User[] = usersArray.map((u: any) =>
        mapApiUserToUser(u, inviteByEmail.get(String(u.email || "").toLowerCase()))
      )

      // Pending invites that don't have a corresponding accepted member yet
      const memberEmails = new Set(memberRows.map((m) => m.email.toLowerCase()))
      const pendingRows: User[] = invitesArray
        .filter((inv: any) => {
          const status = String(inv.status || "").toLowerCase()
          if (status !== "pending") return false
          const email = String(inv.email || "").toLowerCase()
          return email && !memberEmails.has(email)
        })
        .map(mapInviteToUser)

      setUsers([...pendingRows, ...memberRows])
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Form states
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formRole, setFormRole] = useState<Role>("Member")

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return users.filter((user) => {
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q)
      const matchesStatus = statusFilter === "All" || user.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [users, searchQuery, statusFilter])

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    pending: users.filter((u) => u.status === "Pending").length,
    suspended: users.filter((u) => u.status === "Suspended").length,
  }), [users])

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name[0].toUpperCase()
  }

  const cycleStatusFilter = () => {
    const options: ("All" | Status)[] = ["All", ...STATUSES]
    const idx = options.indexOf(statusFilter)
    setStatusFilter(options[(idx + 1) % options.length])
  }

  const resetForm = () => {
    setFormName("")
    setFormEmail("")
    setFormRole("Member")
  }

  const handleInvite = async () => {
    // 1. Basic empty check
    if (!formName.trim() || !formEmail.trim()) {
      showWarning("Please fill in all fields")
      return
    }

    // 2. Name validation (no numbers)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formName.trim())) {
      showWarning("Name should not contain numbers or special characters")
      return
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail.trim())) {
      showWarning("Please enter a valid email address")
      return
    }

    try {
      setLoading(true)
      await createOrgInvite({
        email: formEmail.trim(),
        role: formRole
      })

      setInviteOpen(false)
      resetForm()
      showSuccess(`Invitation sent to ${formEmail.trim()}`)

      // Optionally reload users or just depend on the status being 'Pending' when re-fetched
      loadUsers()
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to send invitation")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedUser) return

    // 1. Basic empty check
    if (!formName.trim() || !formEmail.trim()) {
      showWarning("Please fill in all fields")
      return
    }

    // 2. Name validation (no numbers)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(formName.trim())) {
      showWarning("Name should not contain numbers or special characters")
      return
    }

    // 3. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail.trim())) {
      showWarning("Please enter a valid email address")
      return
    }

    try {
      const nameParts = formName.trim().split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(" ")
      await updateOrgUser(selectedUser.id, { firstName, lastName, email: formEmail.trim(), role: formRole })

      setEditOpen(false)
      setSelectedUser(null)
      resetForm()
      showSuccess("User updated successfully")
      loadUsers()
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to update user")
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditOpen(true)
  }

  const openEditInviteModal = (user: User) => {
    setSelectedUser(user)
    setEditInviteOpen(true)
  }

  const openViewDetails = (user: User) => {
    setSelectedUser(user)
    setViewOpen(true)
  }

  // Builds the absolute accept-invite URL the admin can paste into Slack/WhatsApp
  // when the email didn't reach. Token comes from the backend invite document.
  const buildInviteLink = (token?: string) => {
    if (!token) return ""
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    return `${origin}/accept-invite?token=${token}`
  }

  const handleCopyInviteLink = async (user: User) => {
    const link = buildInviteLink(user.inviteToken)
    if (!link) {
      showError("Invite link unavailable — token missing on this invite.")
      return
    }
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link)
      } else {
        // Fallback for older browsers / non-secure contexts (HTTP).
        const ta = document.createElement("textarea")
        ta.value = link
        ta.style.position = "fixed"
        ta.style.opacity = "0"
        document.body.appendChild(ta)
        ta.select()
        document.execCommand("copy")
        document.body.removeChild(ta)
      }
      showSuccess("Invite link copied to clipboard")
    } catch {
      showError("Couldn't copy automatically — copy from View details instead.")
    }
  }

  const handleResendInvite = async (user: User) => {
    if (!user.id) {
      showError("Invite id missing — try refreshing the page.")
      return
    }
    try {
      setResendingId(user.id)
      await resendOrgInvite(user.id)
      showSuccess(`Invitation resent to ${user.email}`)
      // Reload so the new expiresAt + rotated token reflect in the row.
      loadUsers()
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to resend invitation")
    } finally {
      setResendingId(null)
    }
  }

  const handleChangeRole = async (user: User) => {
    if (user.isPending) {
      showWarning("Cannot change role on a pending invite. Cancel it and re-invite with a new role.")
      return
    }
    const idx = ROLES.indexOf(user.role)
    const nextRole = ROLES[(idx + 1) % ROLES.length]
    try {
      // Backend's UpdateOrganizationUser controller reads `Role` (capital R).
      // Sending lowercase `role` was being silently ignored — so role changes
      // never actually persisted. Send capital-R primary; keep lowercase for
      // forward-compat in case the backend is normalised later.
      await updateOrgUser(user.id, { Role: nextRole, role: nextRole })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)))
      showSuccess(`${user.name} role changed to ${nextRole}`)
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to change role")
    }
  }

  const handleToggleStatus = async (user: User) => {
    if (user.isPending) {
      showWarning("Suspend/Activate isn't available for pending invites.")
      return
    }
    const newStatus: Status = user.status === "Active" ? "Suspended" : "Active"
    try {
      await updateOrgUser(user.id, { orgActive: newStatus === "Active" })
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)))
      showSuccess(`${user.name} is now ${newStatus}`)
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to update status")
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    try {
      if (selectedUser.isPending) {
        // Pending invitations are removed via declineInvite (token-based).
        // OrgMember-based deleteOrgUser would 404 since no member exists yet.
        const token = selectedUser.inviteToken
        if (!token) {
          showError("This invite has no token — refresh and try again.")
          return
        }
        await declineOrgInvite(token)
      } else {
        await deleteOrgUser(selectedUser.id)
      }
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id))
      setDeleteOpen(false)
      showSuccess(`${selectedUser.name} has been ${selectedUser.isPending ? "removed" : "deleted"}`)
      setSelectedUser(null)
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to delete user")
    }
  }

  const openDeleteConfirm = (user: User) => {
    setSelectedUser(user)
    setDeleteOpen(true)
  }

  const roleBadgeClass = (role: Role) => {
    const r = (role || "").toLowerCase()
    if (r.includes("admin")) return "bg-purple-50 text-purple-700 border border-purple-200"
    if (r.includes("manager")) return "bg-blue-50 text-blue-700 border border-blue-200"
    if (r.includes("developer") || r.includes("engineer"))
      return "bg-amber-50 text-amber-700 border border-amber-200"
    if (r.includes("hr")) return "bg-rose-50 text-rose-700 border border-rose-200"
    return "bg-gray-50 text-gray-600 border border-gray-200"
  }

  const statusBadgeClass = (status: Status) => {
    switch (status) {
      case "Active": return "bg-green-50 text-green-700 border border-green-200"
      case "Pending": return "bg-amber-50 text-amber-700 border border-amber-200"
      case "Suspended": return "bg-red-50 text-red-700 border border-red-200"
    }
  }

  const mfaBadgeClass = (mfa: MFA) => {
    return mfa === "Enabled"
      ? "bg-green-50 text-green-700 border border-green-200"
      : "bg-gray-50 text-gray-500 border border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">All Users</h1>
            <p className="text-xs text-gray-600 mt-1">Manage and monitor all users in your organization</p>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-4 py-2 rounded-none transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite / Create
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Users - gradient primary */}
          <button
            type="button"
            onClick={() => setStatusFilter("All")}
            className={`bg-gradient-to-br from-primary to-primary/80 rounded-none p-4 text-white text-left transition-all hover:shadow-lg ${statusFilter === "All" ? "ring-2 ring-primary/60 ring-offset-2" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/80">Total users</p>
                <p className="text-xl font-semibold mt-1 text-white">{stats.total}</p>
                <p className="text-[10px] text-white/60 mt-1">All registered users</p>
              </div>
              <Users className="w-8 h-8 text-white/30" />
            </div>
          </button>

          {/* Active */}
          <button
            type="button"
            onClick={() => setStatusFilter("Active")}
            className={`bg-white border border-gray-200 rounded-none p-4 text-left transition-all hover:shadow-md ${statusFilter === "Active" ? "ring-2 ring-green-500" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.active}</p>
                <p className="text-[10px] text-green-600 mt-1">Currently active</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-200" />
            </div>
          </button>

          {/* Pending */}
          <button
            type="button"
            onClick={() => setStatusFilter("Pending")}
            className={`bg-white border border-gray-200 rounded-none p-4 text-left transition-all hover:shadow-md ${statusFilter === "Pending" ? "ring-2 ring-amber-500" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.pending}</p>
                <p className="text-[10px] text-amber-600 mt-1">Awaiting confirmation</p>
              </div>
              <Clock className="w-8 h-8 text-amber-200" />
            </div>
          </button>

          {/* Suspended */}
          <button
            type="button"
            onClick={() => setStatusFilter("Suspended")}
            className={`bg-white border border-gray-200 rounded-none p-4 text-left transition-all hover:shadow-md ${statusFilter === "Suspended" ? "ring-2 ring-red-500" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Suspended</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.suspended}</p>
                <p className="text-[10px] text-red-600 mt-1">Access revoked</p>
              </div>
              <Ban className="w-8 h-8 text-red-200" />
            </div>
          </button>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full pl-10 pr-4 py-2 h-9 bg-white border border-gray-200 rounded-none text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            onClick={cycleStatusFilter}
            className={`inline-flex items-center gap-2 px-4 h-9 text-sm font-medium rounded-none border transition-colors ${statusFilter !== "All"
              ? "bg-primary/10 border-primary text-primary"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
          >
            Status: {statusFilter}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">User</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">MFA</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Joined date</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <p className="text-sm text-gray-500">Loading users...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-6 h-6 text-gray-300" />
                        <p className="text-sm font-medium text-gray-500">No users found</p>
                        <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-none bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-500 truncate">{user.email}</span>
                              <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-none ${roleBadgeClass(user.role)}`}>
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-none w-fit ${user.isPending && user.inviteIsExpired
                              ? "bg-gray-100 text-gray-600 border border-gray-200"
                              : statusBadgeClass(user.status)
                            }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${user.isPending && user.inviteIsExpired
                                ? "bg-gray-400"
                                : user.status === "Active" ? "bg-green-500"
                                  : user.status === "Pending" ? "bg-amber-500" : "bg-red-500"
                              }`} />
                            {user.isPending && user.inviteIsExpired ? "Expired" : user.status}
                          </span>
                          {user.isPending && user.inviteExpiryLabel && !user.inviteIsExpired && (
                            <span className="text-[10px] text-amber-600 font-medium pl-2">
                              {user.inviteExpiryLabel}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-none ${mfaBadgeClass(user.mfa)}`}>
                          {user.mfa}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{user.joined}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center justify-center h-8 w-8 rounded-none hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-none">
                            {user.isPending ? (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleResendInvite(user)}
                                  disabled={resendingId === user.id}
                                  className="rounded-none cursor-pointer text-sm"
                                >
                                  <Send className={`w-4 h-4 mr-2 ${user.inviteIsExpired ? "text-red-500" : ""}`} />
                                  <span className="flex-1">
                                    {user.inviteIsExpired ? (
                                      <span className="text-red-600 font-medium">Resend (expired)</span>
                                    ) : (
                                      "Resend invitation"
                                    )}
                                  </span>
                                  {!user.inviteIsExpired && user.inviteExpiryLabel && (
                                    <span className="text-[10px] text-gray-400 ml-2">{user.inviteExpiryLabel}</span>
                                  )}
                                </DropdownMenuItem>

                                {!user.inviteIsExpired && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => handleCopyInviteLink(user)}
                                      className="rounded-none cursor-pointer text-sm"
                                    >
                                      <Link2 className="w-4 h-4 mr-2" />
                                      Copy invite link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => openEditInviteModal(user)}
                                      className="rounded-none cursor-pointer text-sm"
                                    >
                                      <Edit3 className="w-4 h-4 mr-2" />
                                      Edit invite details
                                    </DropdownMenuItem>
                                  </>
                                )}

                                <DropdownMenuItem
                                  onClick={() => openViewDetails(user)}
                                  className="rounded-none cursor-pointer text-sm"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View details
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openDeleteConfirm(user)}
                                  className="rounded-none cursor-pointer text-sm text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Cancel invite
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem
                                  onClick={() => openEditModal(user)}
                                  className="rounded-none cursor-pointer text-sm"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit user
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(user)}
                                  className="rounded-none cursor-pointer text-sm"
                                >
                                  {user.status === "Active" ? (
                                    <>
                                      <UserX className="w-4 h-4 mr-2" />
                                      Suspend
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => openDeleteConfirm(user)}
                                  className="rounded-none cursor-pointer text-sm text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>
      </div>

      {/* Invite/Create User Dialog */}
      <UserFormDialog
        open={inviteOpen}
        onOpenChange={(v) => {
          setInviteOpen(v)
          if (!v) setSelectedUser(null)
        }}
        mode="invite"
        onSuccess={() => {
          loadUsers()
        }}
      />

      {/* Edit User Dialog (accepted org members) */}
      <UserFormDialog
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v)
          if (!v) setSelectedUser(null)
        }}
        mode="edit"
        editTarget={
          selectedUser
            ? {
              id: selectedUser.id,
              firstName:
                selectedUser.firstName ||
                splitName(selectedUser.name).firstName,
              lastName:
                selectedUser.lastName ||
                splitName(selectedUser.name).lastName,
              email: selectedUser.email,
              roleId: selectedUser.roleId,
              roleName: selectedUser.role,
              firmIds: selectedUser.firmIds,
            }
            : null
        }
        onSuccess={() => {
          loadUsers()
        }}
      />

      {/* Edit Pending Invite Dialog */}
      <UserFormDialog
        open={editInviteOpen}
        onOpenChange={(v) => {
          setEditInviteOpen(v)
          if (!v) setSelectedUser(null)
        }}
        mode="edit-invite"
        editTarget={
          selectedUser && selectedUser.isPending
            ? {
              id: selectedUser.id,
              firstName: selectedUser.firstName || splitName(selectedUser.name).firstName,
              lastName: selectedUser.lastName || splitName(selectedUser.name).lastName,
              email: selectedUser.email,
              roleId: selectedUser.roleId,
              roleName: selectedUser.role,
              firmIds: selectedUser.firmIds,
            }
            : null
        }
        onSuccess={() => {
          loadUsers()
        }}
      />

      {/* View Invite Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={(v) => { setViewOpen(v); if (!v) setSelectedUser(null) }}>
        <DialogContent className="max-w-lg rounded-none p-0 gap-0">
          <div className={`px-5 py-4 ${selectedUser?.inviteIsExpired ? "bg-gradient-to-r from-gray-700 to-gray-600" : "bg-gradient-to-r from-primary to-primary/80"}`}>
            <DialogHeader>
              <DialogTitle className="text-white text-sm font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Invite details
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs">
                {selectedUser?.inviteIsExpired
                  ? "This invite has expired — resend to extend or cancel it."
                  : "Pending invitation — user has not accepted yet."}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-5 space-y-4 text-sm">
            <div className="grid grid-cols-3 gap-3">
              <span className="text-gray-500 col-span-1">Name</span>
              <span className="col-span-2 text-gray-900 font-medium">{selectedUser?.name || "—"}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <span className="text-gray-500 col-span-1">Email</span>
              <span className="col-span-2 text-gray-900">{selectedUser?.email || "—"}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <span className="text-gray-500 col-span-1">Role</span>
              <span className="col-span-2">
                <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-none ${roleBadgeClass(selectedUser?.role || "")}`}>
                  {selectedUser?.role || "—"}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <span className="text-gray-500 col-span-1">Firms</span>
              <span className="col-span-2 text-gray-900">
                {selectedUser?.firmNames && selectedUser.firmNames.length > 0
                  ? selectedUser.firmNames.join(", ")
                  : <span className="text-gray-400 italic">No firms (org-wide / admin)</span>}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <span className="text-gray-500 col-span-1">Sent on</span>
              <span className="col-span-2 text-gray-900">
                {selectedUser?.inviteCreatedAt
                  ? new Date(selectedUser.inviteCreatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                  : "—"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <span className="text-gray-500 col-span-1">Expiry</span>
              <span className="col-span-2 flex items-center gap-2">
                <CalendarClock className="w-3.5 h-3.5 text-gray-400" />
                <span className={selectedUser?.inviteIsExpired ? "text-red-600 font-medium" : "text-gray-900"}>
                  {selectedUser?.inviteExpiresAt
                    ? `${new Date(selectedUser.inviteExpiresAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} · ${selectedUser?.inviteExpiryLabel}`
                    : "—"}
                </span>
              </span>
            </div>
            {selectedUser?.inviteToken && !selectedUser.inviteIsExpired && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[11px] text-gray-500 mb-1.5">Invite link</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 text-[11px] text-gray-700 rounded-none truncate">
                    {buildInviteLink(selectedUser.inviteToken)}
                  </code>
                  <button
                    onClick={() => selectedUser && handleCopyInviteLink(selectedUser)}
                    className="px-3 py-1.5 text-[11px] font-medium bg-primary text-white hover:bg-primary/90 rounded-none transition-colors flex items-center gap-1.5"
                  >
                    <Link2 className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>
            )}
            {selectedUser?.inviteIsExpired && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-none text-[12px] text-amber-800">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  This invite link is no longer valid. Click <strong>Resend invitation</strong> from the dropdown to issue a new token and email.
                </span>
              </div>
            )}
          </div>
          <DialogFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setViewOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-none transition-colors"
            >
              Close
            </button>
            {selectedUser?.isPending && (
              <button
                onClick={() => {
                  setViewOpen(false)
                  if (selectedUser) handleResendInvite(selectedUser)
                }}
                disabled={resendingId !== null}
                className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 rounded-none transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Resend
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog (handles both accepted member delete and pending invite cancel) */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-none p-0 gap-0">
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-4">
            <DialogHeader>
              <DialogTitle className="text-white text-sm font-semibold">
                {selectedUser?.isPending ? "Cancel invitation" : "Delete user"}
              </DialogTitle>
              <DialogDescription className="text-white/70 text-xs">
                {selectedUser?.isPending
                  ? "The invitation link will be invalidated immediately"
                  : "This action cannot be undone"}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-700">
              {selectedUser?.isPending ? (
                <>Are you sure you want to cancel the invitation for <span className="font-semibold">{selectedUser?.email}</span>? They won't be able to use the existing email link, but you can re-invite them anytime.</>
              ) : (
                <>Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>? This will permanently remove their account and all associated data.</>
              )}
            </p>
          </div>
          <DialogFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-none transition-colors"
            >
              Keep
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-none transition-colors"
            >
              {selectedUser?.isPending ? "Cancel invite" : "Delete user"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
