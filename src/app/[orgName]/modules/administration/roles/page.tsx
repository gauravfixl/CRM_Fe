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
    <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
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
              className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none h-10 px-4"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync Access
            </CustomButton>
            <Link href={`/${orgName}/modules/administration/roles/create`}>
              <CustomButton size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 text-white font-bold rounded-none h-10 px-6">
                <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Add Global Role
              </CustomButton>
            </Link>
          </div>
        }
      />

      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Security Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all border-b-4 border-b-indigo-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Identity Roles</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{stats.total}</div>
              <Shield className="w-8 h-8 text-indigo-100 dark:text-indigo-900/30" />
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all border-b-4 border-b-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Custom Extensions</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{stats.custom}</div>
              <Zap className="w-8 h-8 text-emerald-100 dark:text-emerald-900/30" />
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all border-b-4 border-b-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Scoped Users</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">{stats.users}</div>
              <UsersIcon className="w-8 h-8 text-blue-100 dark:text-blue-900/30" />
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 rounded-none p-6 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xl font-black tracking-tight mb-1">Global Audit</h4>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Compliance Active</p>
              <div className="mt-4 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-zinc-300">Clean directory logs</span>
              </div>
            </div>
            <Activity className="absolute -bottom-4 -right-4 h-24 w-24 text-white opacity-5 group-hover:scale-110 transition-transform" />
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList className="bg-white dark:bg-zinc-900 p-1 rounded-none border border-zinc-200 dark:border-zinc-800 h-14 shadow-sm">
              <TabsTrigger value="roles" className="rounded-none px-8 font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all h-full">Identity Roles</TabsTrigger>
              <TabsTrigger value="permissions" className="rounded-none px-8 font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all h-full">Permission Matrix</TabsTrigger>
              <TabsTrigger value="assignments" className="rounded-none px-8 font-black text-[11px] uppercase tracking-widest data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all h-full">Assignments</TabsTrigger>
            </TabsList>

            <div className="relative md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search security assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 h-14 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm focus:ring-blue-500/10"
              />
            </div>
          </div>

          <TabsContent value="roles" className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                      <TableHead className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Role Definition</TableHead>
                      <TableHead className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Classification</TableHead>
                      <TableHead className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Active Bindings</TableHead>
                      <TableHead className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Access Scope</TableHead>
                      <TableHead className="p-6 text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                    {filteredRoles.map((role: any) => (
                      <TableRow key={role._id} className="hover:bg-indigo-50/10 transition-all group">
                        <TableCell className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-none bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 group-hover:scale-110 transition-transform">
                              <Shield className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-black text-zinc-900 dark:text-white tracking-tight">{role.name}</span>
                              <span className="text-[11px] font-medium text-zinc-400 max-w-xs truncate">{role.description || "Managed security container"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-6">
                          <Badge className={`border-0 text-[10px] font-black tracking-widest px-3 py-1 rounded-none ${role.isCustom ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                            }`}>
                            {role.isCustom ? "CUSTOM EXTENSION" : "GLOBAL BASELINE"}
                          </Badge>
                        </TableCell>
                        <TableCell className="p-6">
                          <div className="flex items-center gap-2">
                            <UsersIcon className="w-3.5 h-3.5 text-zinc-300" />
                            <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{role.userCount || 0} Identitites</span>
                          </div>
                        </TableCell>
                        <TableCell className="p-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="flex items-center gap-2 group/btn">
                                <Badge variant="outline" className="border-zinc-200 dark:border-zinc-800 text-[10px] font-black px-4 py-1 rounded-none cursor-pointer hover:bg-indigo-50 transition-all">
                                  VIEW {role.permissions.length} PERMISSIONS
                                </Badge>
                                <ChevronRight className="w-3 h-3 text-zinc-300 group-hover/btn:translate-x-1 transition-all" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden p-0 rounded-none border-0 shadow-2xl">
                              <div className="p-8 bg-zinc-950 text-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                  <Shield className="h-40 w-40" />
                                </div>
                                <DialogHeader className="relative z-10">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Badge className="bg-indigo-600 text-white border-0 rounded-none">ACCESS POLICY</Badge>
                                    <span className="text-xs text-zinc-500 font-bold tracking-widest">{role.isCustom ? "CUSTOM" : "SYSTEM"}</span>
                                  </div>
                                  <DialogTitle className="text-4xl font-black tracking-tighter">{role.name}</DialogTitle>
                                  <DialogDescription className="text-zinc-400 font-medium text-lg leading-relaxed">{role.description}</DialogDescription>
                                </DialogHeader>
                              </div>
                              <div className="p-8 overflow-y-auto max-h-[50vh] bg-white dark:bg-zinc-900">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {role.permissions.map((perm: any) => (
                                    <div key={perm._id} className="p-6 rounded-none border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                                      <h6 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">{perm.module}</h6>
                                      <div className="flex flex-wrap gap-2">
                                        {perm.actions.map((action: string) => (
                                          <Badge key={action} variant="outline" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-[10px] font-bold px-3 py-1 rounded-none">
                                            {action}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end">
                                <CustomButton variant="outline" className="rounded-none font-bold">Audit Policy History</CustomButton>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="p-6 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <Link href={`/${orgName}/modules/administration/roles/${role._id}/edit`}>
                              <CustomButton variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-none">
                                <Edit className="w-4 h-4" />
                              </CustomButton>
                            </Link>
                            {role.isCustom && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <CustomButton variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-none">
                                    <Trash2 className="w-4 h-4" />
                                  </CustomButton>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-none">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-black">Purge Access Identity?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-zinc-500 font-medium font-sans">
                                      Deleting <span className="text-zinc-900 font-bold">"{role.name}"</span> will immediately revoke all associated permissions from {role.userCount || 0} users. This action is recorded in the directory audit logs.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-2 pt-4">
                                    <AlertDialogCancel className="rounded-none border-zinc-200 font-bold">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteRole(role._id)} className="bg-red-600 hover:bg-red-700 text-white rounded-none font-bold shadow-lg shadow-red-500/20 px-8 border-0">Purge Access</AlertDialogAction>
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

          <TabsContent value="permissions" className="min-h-[400px]">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-12 text-center space-y-6">
              <div className="h-24 w-24 rounded-none bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <ListTree className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-zinc-900">Permission Sets & Matrix</h3>
                <p className="text-zinc-500 max-w-md mx-auto mt-2 leading-relaxed font-medium">
                  Configure granular access mappings between system modules and identity categories. Use the Matrix view to identify permission overlaps.
                </p>
              </div>
              <CustomButton className="rounded-none bg-zinc-900 text-white px-8 font-black text-xs uppercase tracking-widest h-12">
                Open Matrix Editor <ChevronRight className="ml-2 w-4 h-4" />
              </CustomButton>
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="min-h-[400px]">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-12 text-center space-y-6">
              <div className="h-24 w-24 rounded-none bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <UserCheck className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-zinc-900">Direct Role Assignments</h3>
                <p className="text-zinc-500 max-w-md mx-auto mt-2 leading-relaxed font-medium">
                  Review and bulk assign roles to users or security groups. Manage temporary access elevations and JIT (Just-In-Time) provisioning.
                </p>
              </div>
              <CustomButton className="rounded-none bg-blue-600 text-white px-8 font-black text-xs uppercase tracking-widest h-12">
                New Assignment Workflow <Plus className="ml-2 w-4 h-4" />
              </CustomButton>
            </div>
          </TabsContent>
        </Tabs>

        {/* Governance Alert */}
        <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-none flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h6 className="text-sm font-black text-indigo-900">Access Governance Policy active</h6>
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
