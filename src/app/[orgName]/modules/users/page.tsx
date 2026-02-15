"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Shield,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Download,
  Trash2,
  Edit3,
  ShieldCheck,
  Zap,
  Loader2,
  RefreshCw,
  MoreVertical,
  UserX,
  UserCheck,
  Building2,
  ArrowRight
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
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
import { getAllUsers, deleteUser } from "@/modules/crm/users/hooks/userHooks"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function AllUsersPage() {
  const params = useParams()
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchUsers = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true)
    else setLoading(true)

    try {
      const res = await getAllUsers()
      if (res?.data?.users) {
        setUsers(res.data.users)
      } else if (res?.data?.data) {
        setUsers(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [users, searchQuery])

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    )
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return

    try {
      await deleteUser(userId)
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (err) {
      toast.error("Failed to delete user")
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.split(' ')
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name[0].toUpperCase()
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
      <SubHeader
        title="All Users"
        breadcrumbItems={[
          { label: "Identity & Access", href: "#" },
          { label: "Users", href: "#" },
          { label: "List", href: "#" }
        ]}
        rightControls={
          <div className="flex gap-2">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={() => fetchUsers(true)}
              disabled={isRefreshing}
              className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing...' : 'Sync Data'}
            </CustomButton>
            <CustomButton size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-white">
              <UserPlus className="w-3.5 h-3.5 mr-2" /> Invite User
            </CustomButton>
          </div>
        }
      />

      <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Bulk Action Bar (Floating) */}
        {selectedUsers.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-white/10 animate-in zoom-in-95 duration-200">
            <span className="text-sm font-medium border-r border-white/20 pr-6">{selectedUsers.length} Users Selected</span>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-xs font-bold hover:text-blue-400 transition-colors uppercase tracking-wider">
                <Edit3 className="w-4 h-4" /> Change Role
              </button>
              <button className="flex items-center gap-2 text-xs font-bold hover:text-blue-400 transition-colors uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Assign Permissions
              </button>
              <button
                onClick={() => toast.info("Bulk delete logic coming soon")}
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
            <button onClick={() => setSelectedUsers([])} className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Filters & Command Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 shadow-sm flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-transparent border-none focus:ring-0 text-sm placeholder:text-zinc-400"
                placeholder="Search by name, email, or role..."
              />
            </div>
            <Separator orientation="vertical" className="h-8" />
            <CustomButton variant="ghost" className="h-10 text-xs px-4 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <Filter className="w-3.5 h-3.5 mr-2" /> All filters
            </CustomButton>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Total Users</p>
                <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500/20" />
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Organization</p>
                <p className="text-sm font-bold text-blue-600 truncate max-w-[100px]">{params.orgName || 'N/A'}</p>
              </div>
              <Building2 className="w-8 h-8 text-zinc-500/20" />
            </div>
          </div>
        </div>

        {/* Main Users Table Table Container */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden relative">

          {loading && (
            <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-widest uppercase">Fetching Identity Data...</p>
            </div>
          )}

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-20">
                <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
                  <th className="p-5 w-14 text-center">
                    <Checkbox
                      checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                      onCheckedChange={() => {
                        if (selectedUsers.length === filteredUsers.length) setSelectedUsers([])
                        else setSelectedUsers(filteredUsers.map(u => u._id || u.id))
                      }}
                    />
                  </th>
                  <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">identity profile</th>
                  <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">role & permissions</th>
                  <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">status</th>
                  <th className="p-5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em]">auth compliance</th>
                  <th className="p-5 text-right w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {filteredUsers.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No users found</h3>
                        <p className="text-sm text-zinc-500 max-w-xs">We couldn't find any users matching your criteria. Try adjusting your search query.</p>
                        <CustomButton variant="outline" size="sm" onClick={() => setSearchQuery("")}>Clear Search</CustomButton>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id || user.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-all group">
                      <td className="p-5 text-center">
                        <Checkbox
                          checked={selectedUsers.includes(user._id || user.id)}
                          onCheckedChange={() => toggleSelect(user._id || user.id)}
                        />
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs border border-blue-500/20 shadow-sm transition-all group-hover:scale-105 group-hover:bg-blue-500/20">
                            {getInitials(user.name || user.email)}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors tracking-tight">{user.name || 'Unnamed User'}</span>
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-zinc-400" />
                              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-md ${user.role?.toLowerCase().includes('admin') ? 'bg-orange-50 text-orange-600' : 'bg-zinc-100 text-zinc-500'} dark:bg-zinc-800`}>
                              <Shield className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs text-zinc-700 dark:text-zinc-300 font-bold">{user.role || 'Member'}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-medium ml-7 underline underline-offset-4 cursor-pointer hover:text-blue-500 transition-colors">View Permissions</p>
                        </div>
                      </td>
                      <td className="p-5">
                        <Badge className={`
                          ${(user.status || 'Active') === 'Active'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                          } border-0 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex w-fit items-center gap-1.5
                        `}>
                          {(user.status || 'Active') === 'Active' ? <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> : <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />}
                          {user.status || 'Active'}
                        </Badge>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 flex-1 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-800`}>
                              <div className={`h-full bg-blue-500 rounded-full transition-all duration-1000`} style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-[10px] font-black text-zinc-400">85%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[9px] font-extrabold border-zinc-200 dark:border-zinc-800 text-zinc-500 px-1.5">MFA COMPLIANT</Badge>
                            <Badge variant="outline" className="text-[9px] font-extrabold border-zinc-200 dark:border-zinc-800 text-zinc-500 px-1.5">DEVICE TRUSTED</Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <CustomButton variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400">
                              <MoreVertical className="w-5 h-5" />
                            </CustomButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl border shadow-xl">
                            <DropdownMenuLabel className="text-xs px-2 py-1 text-zinc-400 font-bold uppercase tracking-widest">Security Actions</DropdownMenuLabel>

                            <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Edit3 className="w-4 h-4 text-zinc-500" />
                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Edit Identity</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-300" />
                            </DropdownMenuItem>

                            <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4 text-zinc-500" />
                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Roles & Access</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-300" />
                            </DropdownMenuItem>

                            <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Zap className="w-4 h-4 text-zinc-500" />
                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Reset MFA</span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-zinc-300" />
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-2" />

                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user._id || user.id)}
                              className="rounded-xl px-3 py-2 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/20 text-red-600"
                            >
                              <div className="flex items-center gap-3">
                                <UserX className="w-4 h-4" />
                                <span className="text-sm font-black uppercase tracking-tight">Revoke Access</span>
                              </div>
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

          {/* New Enterprise-Grade Pagination */}
          <div className="px-6 py-5 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                Displaying <span className="text-zinc-900 dark:text-zinc-100">{filteredUsers.length}</span> entities
              </p>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase">Items per page:</p>
                <select className="bg-transparent text-xs font-bold focus:ring-0 border-none p-0 cursor-pointer">
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CustomButton variant="outline" size="sm" className="h-9 px-4 rounded-xl border-zinc-200 bg-white dark:bg-zinc-900 shadow-sm text-xs font-bold" disabled>
                Previous
              </CustomButton>
              <div className="flex items-center">
                <button className="h-9 w-9 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/30">1</button>
                <button className="h-9 w-9 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 font-bold text-xs transition-colors">2</button>
                <button className="h-9 w-9 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 font-bold text-xs transition-colors">3</button>
              </div>
              <CustomButton variant="outline" size="sm" className="h-9 px-4 rounded-xl border-zinc-200 bg-white dark:bg-zinc-900 shadow-sm text-xs font-bold">
                Next
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Global Directory Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <UserPlus className="w-6 h-6 text-blue-500" />
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 mb-1">Onboarding Hub</h4>
            <p className="text-xs text-zinc-500">Monitor new identity setups and invitation lifecycles.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-blue-500/50 transition-all group text-left">
            <div className="flex items-center justify-between mb-4">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 mb-1">Identity Governance</h4>
            <p className="text-xs text-zinc-500">Review all administrative role assignments and session trust scores.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <UserX className="w-6 h-6 text-zinc-400" />
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 mb-1">Recycle Bin</h4>
            <p className="text-xs text-zinc-500">Recently deleted users are held for 30 days before permanent purging.</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:border-blue-500/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <Download className="w-6 h-6 text-green-500" />
              <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 mb-1">Data Portability</h4>
            <p className="text-xs text-zinc-500">Export your user directory for backup or external identity auditing.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
