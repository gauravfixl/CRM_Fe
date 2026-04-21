"use client"

import { useState, useMemo } from "react"
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
import { showSuccess, showWarning } from "@/utils/toast"
import { UserFormDialog, splitName } from "@/shared/components/rbac/UserFormDialog"

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
  status: Status
  mfa: MFA
  joined: string
}

const STATUSES: Status[] = ["Active", "Pending", "Suspended"]

const initialUsers: User[] = [
  { id: "1", name: "Sarah Miller", email: "sarah.m@fixlsolutions.com", role: "Admin", status: "Active", mfa: "Enabled", joined: "Oct 12, 2024" },
  { id: "2", name: "Robert Wilson", email: "robert.w@fixlsolutions.com", role: "Manager", status: "Active", mfa: "Enabled", joined: "Oct 15, 2024" },
  { id: "3", name: "Elena Kostic", email: "elena.k@fixlsolutions.com", role: "Developer", status: "Active", mfa: "Disabled", joined: "Nov 01, 2024" },
  { id: "4", name: "James Chen", email: "james.c@fixlsolutions.com", role: "Manager", status: "Pending", mfa: "Disabled", joined: "Jan 10, 2025" },
  { id: "5", name: "Maria Garcia", email: "maria.g@fixlsolutions.com", role: "Member", status: "Active", mfa: "Enabled", joined: "Feb 22, 2025" },
]

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All")

  // Modal states
  const [inviteOpen, setInviteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

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

  const handleInvite = () => {
    if (!formName.trim() || !formEmail.trim()) {
      showWarning("Please fill in all fields")
      return
    }
    const newUser: User = {
      id: String(Date.now()),
      name: formName.trim(),
      email: formEmail.trim(),
      role: formRole,
      status: "Pending",
      mfa: "Disabled",
      joined: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    }
    setUsers((prev) => [...prev, newUser])
    setInviteOpen(false)
    resetForm()
    showSuccess(`Invitation sent to ${newUser.email}`)
  }

  const handleEdit = () => {
    if (!selectedUser) return
    if (!formName.trim() || !formEmail.trim()) {
      showWarning("Please fill in all fields")
      return
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, name: formName.trim(), email: formEmail.trim(), role: formRole }
          : u
      )
    )
    setEditOpen(false)
    setSelectedUser(null)
    resetForm()
    showSuccess("User updated successfully")
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditOpen(true)
  }

  const handleChangeRole = (user: User) => {
    const idx = ROLES.indexOf(user.role)
    const nextRole = ROLES[(idx + 1) % ROLES.length]
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)))
    showSuccess(`${user.name} role changed to ${nextRole}`)
  }

  const handleToggleStatus = (user: User) => {
    const newStatus: Status = user.status === "Active" ? "Suspended" : "Active"
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)))
    showSuccess(`${user.name} is now ${newStatus}`)
  }

  const handleDelete = () => {
    if (!selectedUser) return
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id))
    setDeleteOpen(false)
    showSuccess(`${selectedUser.name} has been deleted`)
    setSelectedUser(null)
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
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-none p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/80">Total users</p>
                <p className="text-xl font-semibold mt-1 text-white">{stats.total}</p>
                <p className="text-[10px] text-white/60 mt-1">All registered users</p>
              </div>
              <Users className="w-8 h-8 text-white/30" />
            </div>
          </div>

          {/* Active */}
          <div className="bg-white border border-gray-200 rounded-none p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Active</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.active}</p>
                <p className="text-[10px] text-green-600 mt-1">Currently active</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-200" />
            </div>
          </div>

          {/* Pending */}
          <div className="bg-white border border-gray-200 rounded-none p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.pending}</p>
                <p className="text-[10px] text-amber-600 mt-1">Awaiting confirmation</p>
              </div>
              <Clock className="w-8 h-8 text-amber-200" />
            </div>
          </div>

          {/* Suspended */}
          <div className="bg-white border border-gray-200 rounded-none p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Suspended</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.suspended}</p>
                <p className="text-[10px] text-red-600 mt-1">Access revoked</p>
              </div>
              <Ban className="w-8 h-8 text-red-200" />
            </div>
          </div>
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
                {filteredUsers.length === 0 ? (
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
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-none ${statusBadgeClass(user.status)}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Active" ? "bg-green-500" : user.status === "Pending" ? "bg-amber-500" : "bg-red-500"
                            }`} />
                          {user.status}
                        </span>
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
                          <DropdownMenuContent align="end" className="w-48 rounded-none">
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
          // Reload users or refresh the list
          window.location.reload()
        }}
      />

      {/* Edit User Dialog */}
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
          // Reload users or refresh the list
          window.location.reload()
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-none p-0 gap-0">
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-4">
            <DialogHeader>
              <DialogTitle className="text-white text-sm font-semibold">Delete user</DialogTitle>
              <DialogDescription className="text-white/70 text-xs">This action cannot be undone</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-5">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>? This will permanently remove their account and all associated data.
            </p>
          </div>
          <DialogFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-none transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-none transition-colors"
            >
              Delete user
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
