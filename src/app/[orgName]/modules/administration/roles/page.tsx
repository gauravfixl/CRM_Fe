"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users as UsersIcon,
  Shield,
  Settings,
  Eye,
  AlertCircle,
  Lock,
  ListTree,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Clock,
  Zap,
  Filter,
  MoreVertical,
  Activity,
  History
} from "lucide-react"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useParams, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { decryptData } from "@/utils/crypto"
import { getAllRolesNPermissions, deleteRole } from "@/hooks/roleNPermissionHooks"
import useRolesStore from "@/lib/roleStore"
import { getRoles } from "@/hooks/userHooks"

export default function RolesAndPermissionsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "roles"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [orgName, setOrgName] = useState("")

  const orgRoles = useRolesStore(state => state.roles?.organization) || []

  useEffect(() => {
    setOrgName(params.orgName as string || localStorage.getItem("orgName") || "")
    fetchData()
  }, [])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const fetchData = async () => {
    setLoading(true)
    try {
      const scopeParams = { scope: "sc-org" as const }
      const rolesResp = await getAllRolesNPermissions(scopeParams)

      if (rolesResp?.data?.permissions && rolesResp?.data?.iv) {
        const decrypted = decryptData(rolesResp.data.permissions, rolesResp.data.iv)
        useRolesStore.getState().setRoles(prev => ({ ...prev, organization: decrypted }))
      }

      const simpleRolesResp = await getRoles(scopeParams)
      if (simpleRolesResp?.data?.roles && simpleRolesResp?.data?.iv) {
        const decryptedRoles = decryptData(simpleRolesResp.data.roles, simpleRolesResp.data.iv)
        useRolesStore.getState().setSimpleRoles(decryptedRoles)
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast.error("Failed to load security directory")
    } finally {
      setLoading(false)
    }
  }

  const filteredRoles = useMemo(() => {
    return orgRoles.filter(
      (role: any) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [orgRoles, searchQuery])

  const stats = {
    total: orgRoles.length,
    custom: orgRoles.filter((r: any) => r.isCustom).length,
    users: orgRoles.reduce((sum: number, r: any) => sum + (r.userCount || 0), 0)
  }

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRole(roleId)
      useRolesStore.getState().setRoles(prev => ({
        ...prev,
        organization: prev.organization.filter((r: any) => r._id !== roleId)
      }))
      toast.success("Identity role purged from directory")
    } catch (error) {
      toast.error("Failed to release role")
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] font-outfit">
      <SubHeader
        title="Roles & Permissions"
        breadcrumbItems={[
          { label: "Identity & Access", href: "#" },
          { label: "Access Management", href: "#" },
          { label: "Roles & Permissions", href: "#" }
        ]}
        rightControls={
          <div className="flex gap-2">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="bg-white border-zinc-200 rounded-lg h-10 px-4"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync Access
            </CustomButton>
            <Link href={`/${orgName}/modules/administration/roles/create`}>
              <CustomButton size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 text-white font-semibold rounded-lg h-10 px-6">
                <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Add Global Role
              </CustomButton>
            </Link>
          </div>
        }
      />

      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-primary/70 to-primary text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs opacity-80">Total Identity Roles</p>
                <p className="text-white text-xl font-semibold mt-1">{stats.total}</p>
                <p className="text-white text-[10px] mt-1 opacity-70">Active in directory</p>
              </div>
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="border bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Custom Extensions</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.custom}</p>
                <p className="text-[10px] text-gray-400 mt-1">Organization specific</p>
              </div>
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="border bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Scoped Users</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.users}</p>
                <p className="text-[10px] text-gray-400 mt-1">Assigned identities</p>
              </div>
              <UsersIcon className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="border bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Global Audit</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">Active</p>
                <p className="text-green-600 text-[10px] mt-1">Clean directory logs</p>
              </div>
              <History className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList className="bg-white p-1 rounded-lg border border-zinc-200 h-14 shadow-sm">
              <TabsTrigger value="roles" className="rounded-lg px-8 font-semibold text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all h-full">Identity Roles</TabsTrigger>
              <TabsTrigger value="permissions" className="rounded-lg px-8 font-semibold text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all h-full">Permission Matrix</TabsTrigger>
              <TabsTrigger value="assignments" className="rounded-lg px-8 font-semibold text-xs data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all h-full">Assignments</TabsTrigger>
            </TabsList>

            <div className="relative md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search security assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-14 bg-white border-zinc-200 rounded-lg shadow-sm focus:ring-blue-500/10"
              />
            </div>
          </div>

          <TabsContent value="roles" className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/50 border-b border-zinc-100 hover:bg-transparent">
                      <TableHead className="p-6 text-xs font-semibold text-gray-500">Role Definition</TableHead>
                      <TableHead className="p-6 text-xs font-semibold text-gray-500">Classification</TableHead>
                      <TableHead className="p-6 text-xs font-semibold text-gray-500">Active Bindings</TableHead>
                      <TableHead className="p-6 text-xs font-semibold text-gray-500">Access Scope</TableHead>
                      <TableHead className="p-6 text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-zinc-50">
                    {filteredRoles.map((role: any) => (
                      <TableRow key={role._id} className="hover:bg-indigo-50/10 transition-all group">
                        <TableCell className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                              <Shield className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                              <span className="text-[10px] font-medium text-zinc-400 max-w-xs truncate">{role.description || "Managed security container"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-6">
                          <Badge className={`border-0 text-xs font-medium px-3 py-1 rounded-full ${role.isCustom ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                            {role.isCustom ? "Custom Extension" : "Global Baseline"}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-6">
                          <div className="flex items-center gap-2">
                            <UsersIcon className="w-3.5 h-3.5 text-zinc-300" />
                            <span className="text-sm font-semibold text-zinc-600">{role.userCount || 0} Identities</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="flex items-center gap-2 group/btn">
                                <Badge variant="outline" className="border-zinc-200 text-xs font-medium px-4 py-1 rounded-full cursor-pointer hover:bg-indigo-50 transition-all">
                                  View {role.permissions.length} Permissions
                                </Badge>
                                <ChevronRight className="w-3 h-3 text-zinc-300 group-hover/btn:translate-x-1 transition-all" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0 rounded-xl border-0 shadow-2xl">
                              <div className="p-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                  <Shield className="h-40 w-40" />
                                </div>
                                <DialogHeader className="relative z-10">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge className="bg-white/20 text-white border-0 rounded-full">Access Policy</Badge>
                                    <span className="text-xs text-white/60 font-medium">{role.isCustom ? "Custom" : "System"}</span>
                                  </div>
                                  <DialogTitle className="text-2xl font-semibold">{role.name}</DialogTitle>
                                  <DialogDescription className="text-white/80 font-medium text-lg leading-relaxed">{role.description}</DialogDescription>
                                </DialogHeader>
                              </div>
                              <div className="p-8 overflow-y-auto max-h-[50vh] bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {role.permissions.map((perm: any) => (
                                    <div key={perm._id} className="p-6 rounded-xl border border-zinc-100 bg-zinc-50/50">
                                      <h6 className="text-xs font-semibold text-indigo-600 mb-3">{perm.module}</h6>
                                      <div className="flex flex-wrap gap-2">
                                        {perm.actions.map((action: string) => (
                                          <Badge key={action} variant="outline" className="bg-white border-zinc-200 text-xs font-medium px-3 py-1 rounded-full">
                                            {action}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
                                <CustomButton variant="outline" className="rounded-lg font-semibold">Audit Policy History</CustomButton>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="p-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <Link href={`/${orgName}/modules/administration/roles/${role._id}/edit`}>
                              <CustomButton variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </CustomButton>
                            </Link>
                            {role.isCustom && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <CustomButton variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                  </CustomButton>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-semibold">Purge Access Identity?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-zinc-500 font-medium">
                                      Deleting <span className="text-zinc-900 font-semibold">"{role.name}"</span> will immediately revoke all associated permissions from {role.userCount || 0} users. This action is recorded in the directory audit logs.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-2 pt-4">
                                    <AlertDialogCancel className="rounded-lg border-zinc-200 font-semibold">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteRole(role._id)} className="bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-lg shadow-red-500/20 px-8 border-0">Purge Access</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="min-h-[400px] space-y-6">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <ListTree className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Permission Matrix Overview</h3>
                    <p className="text-[10px] text-zinc-400 font-medium">Read-only view of role-to-module access mappings</p>
                  </div>
                </div>
                <CustomButton
                  className="rounded-lg bg-primary text-white px-6 font-semibold text-xs h-10"
                  onClick={() => toast.info("Matrix editor coming soon")}
                >
                  Open Matrix Editor <ChevronRight className="ml-2 w-4 h-4" />
                </CustomButton>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/50 border-b border-zinc-100 hover:bg-transparent">
                      <TableHead className="p-4 text-xs font-semibold text-gray-500">Role</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500">Type</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500 text-center">Modules</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500 text-center">Total Actions</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500">Module Breakdown</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-zinc-50">
                    {orgRoles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="p-12 text-center text-sm text-zinc-400 font-medium">
                          No roles found in the directory
                        </TableCell>
                      </TableRow>
                    ) : (
                      orgRoles.map((role: any) => {
                        const moduleCount = role.permissions?.length || 0
                        const totalActions = role.permissions?.reduce((sum: number, p: any) => sum + (p.actions?.length || 0), 0) || 0
                        return (
                          <TableRow key={role._id} className="hover:bg-indigo-50/10 transition-all">
                            <TableCell className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                  <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                                  <p className="text-[10px] text-zinc-400 font-medium truncate max-w-[200px]">{role.description || "No description"}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="p-4">
                              <Badge className={`border-0 text-xs font-medium px-3 py-1 rounded-full ${role.isCustom ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                                {role.isCustom ? "Custom" : "System"}
                              </Badge>
                            </TableCell>
                            <TableCell className="p-4 text-center">
                              <span className="text-sm font-semibold text-zinc-700">{moduleCount}</span>
                            </TableCell>
                            <TableCell className="p-4 text-center">
                              <span className="text-sm font-semibold text-zinc-700">{totalActions}</span>
                            </TableCell>
                            <TableCell className="p-4">
                              <div className="flex flex-wrap gap-1.5">
                                {role.permissions?.slice(0, 4).map((perm: any) => (
                                  <Badge key={perm._id} variant="outline" className="border-zinc-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
                                    {perm.module} ({perm.actions?.length || 0})
                                  </Badge>
                                ))}
                                {role.permissions?.length > 4 && (
                                  <Badge variant="outline" className="border-zinc-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
                                    +{role.permissions.length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="min-h-[400px] space-y-6">
            <div className="bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Role Assignments</h3>
                    <p className="text-[10px] text-zinc-400 font-medium">Manage user-to-role bindings across the organization</p>
                  </div>
                </div>
                <CustomButton
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 font-semibold text-xs h-10"
                  onClick={() => toast.info("Assignment workflow coming soon")}
                >
                  New Assignment <Plus className="ml-2 w-4 h-4" />
                </CustomButton>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/50 border-b border-zinc-100 hover:bg-transparent">
                      <TableHead className="p-4 text-xs font-semibold text-gray-500">Role Name</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500">Type</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500 text-center">Assigned Users</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500 text-center">Permissions</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-zinc-50">
                    {orgRoles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="p-12 text-center text-sm text-zinc-400 font-medium">
                          No roles found in the directory
                        </TableCell>
                      </TableRow>
                    ) : (
                      orgRoles.map((role: any) => (
                        <TableRow key={role._id} className="hover:bg-blue-50/10 transition-all group">
                          <TableCell className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <Shield className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="p-4">
                            <Badge className={`border-0 text-xs font-medium px-3 py-1 rounded-full ${role.isCustom ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                              {role.isCustom ? "Custom" : "System"}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <UsersIcon className="w-3.5 h-3.5 text-zinc-300" />
                              <span className="text-sm font-semibold text-zinc-700">{role.userCount || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell className="p-4 text-center">
                            <span className="text-sm font-semibold text-zinc-700">{role.permissions?.length || 0}</span>
                          </TableCell>
                          <TableCell className="p-4 text-right">
                            <CustomButton
                              variant="outline"
                              size="sm"
                              className="rounded-lg border-zinc-200 text-xs font-semibold h-8 px-4 opacity-0 group-hover:opacity-100 transition-all"
                              onClick={() => toast.info(`Manage assignments for "${role.name}" coming soon`)}
                            >
                              Manage
                            </CustomButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Governance Alert */}
        <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h6 className="text-sm font-semibold text-indigo-900">Access Governance Policy Active</h6>
            <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
              Any modifications to "Global Baseline" roles will trigger a directory-wide access re-validation request for all assigned users.
              We recommend creating "Custom Extensions" for organization-specific permission overrides.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
