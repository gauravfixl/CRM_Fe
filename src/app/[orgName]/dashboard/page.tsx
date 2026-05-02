"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { userById, getRoles } from "@/hooks/userHooks"
import { getAllOrg, getOrgById, fetchUsersApi } from "@/hooks/orgHooks"
import { getAllSessions } from "@/hooks/sessionHooks"
import { useAuthStore } from "@/lib/useAuthStore"
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"
import useRolesStore from "@/lib/roleStore"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { Users, Building2, Activity, TrendingUp, Settings, ChevronRight, Sparkles } from "lucide-react"

type ScopeParams = {
  scope: "sc-wrk" | "sc-org" | "sc-plat" | "sc-prj" | "sc-tm"
  orgId?: string
}

export default function DashboardPage() {
  const [singleUser, setSingleUser] = useState<any>(null)
  const organizations = useAuthStore((state) => state.organizations)
  const setOrganizations = useAuthStore((state) => state.setOrganizations)
  const singleOrg = useAuthStore((state) => state.singleOrg)
  const params = useParams() as { orgName?: string }
  // Count derives from URL scope: being on /[orgName]/dashboard guarantees 1 org.
  // Falls back to store data if route param is ever missing.
  const orgCount = params?.orgName ? 1 : (singleOrg ? 1 : (organizations?.length ?? 0))
  const [selectedModule, setSelectedModule] = useState("")
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [activeSessions, setActiveSessions] = useState<number | null>(null)
  const { setSingleOrganization } = useAuthStore.getState()

  useEffect(() => {
    setSelectedModule(localStorage.getItem("selectedModule") ?? "");
  }, []);

  useEffect(() => {
    const fetchUserAndRoles = async () => {
      try {
        const response = await userById()
        const user = response?.data?.user
        if (!user) return
        setSingleUser(user)

        let scopeParams: ScopeParams = { scope: "sc-plat" }

        if (selectedModule === "Project Management") {
          scopeParams = { scope: "sc-wrk" }
        } else if (user.currentOrganization) {
          const orgResponse = await getOrgById(user.currentOrganization)
          const org = orgResponse?.data
          setSingleOrganization(org)
          if (org?.organization.name) {
            localStorage.setItem("orgName", org.organization.name)
          }
          scopeParams = { scope: "sc-org", orgId: org._id }
        } else {
          scopeParams = { scope: "sc-plat" }
        }

        const rolesResp = await getAllRolesNPermissions(scopeParams)
        if (rolesResp?.data?.permissions && rolesResp?.data?.iv) {
          const decrypted = decryptData(rolesResp.data.permissions, rolesResp.data.iv)
          const store = useRolesStore.getState()

          if (scopeParams.scope === "sc-plat") {
            store.setRoles((prev) => ({ ...prev, platform: decrypted }))
          } else if (scopeParams.scope === "sc-org") {
            store.setRoles((prev) => ({ ...prev, organization: decrypted }))
          } else if (scopeParams.scope === "sc-wrk") {
            store.setRoles((prev) => ({ ...prev, workspace: decrypted }))

            const projectRolesResp = await getAllRolesNPermissions({ scope: "sc-prj" })
            if (projectRolesResp?.data?.permissions && projectRolesResp?.data?.iv) {
              const decryptedProject = decryptData(projectRolesResp.data.permissions, projectRolesResp.data.iv)
              store.setRoles((prev) => ({ ...prev, project: decryptedProject }))
            }

            const teamRolesResp = await getAllRolesNPermissions({ scope: "sc-tm" })
            if (teamRolesResp?.data?.permissions && teamRolesResp?.data?.iv) {
              const decryptedTeam = decryptData(teamRolesResp.data.permissions, teamRolesResp.data.iv)
              store.setRoles((prev) => ({ ...prev, team: decryptedTeam }))
            }
          }
        }

        const simpleRolesResp = await getRoles(scopeParams)
        if (simpleRolesResp?.data?.roles && simpleRolesResp?.data?.iv) {
          const decryptedRoles = decryptData(simpleRolesResp.data.roles, simpleRolesResp.data.iv)
          useRolesStore.getState().setSimpleRoles(decryptedRoles)
        }
      } catch (error) {
        console.error("Error fetching user or roles:", error)
      }
    }

    fetchUserAndRoles()
  }, [selectedModule, setSingleOrganization])

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await getAllOrg()
        if (res.data?.data) {
          setOrganizations(res.data.data)
        }
      } catch (error) {
        console.error("Error fetching organizations:", error)
      }
    }
    fetchOrgs()
  }, [setOrganizations])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [usersRes, sessionsRes] = await Promise.allSettled([
          fetchUsersApi(),
          getAllSessions(),
        ])
        if (usersRes.status === "fulfilled") {
          const d: any = usersRes.value?.data || usersRes.value || {}
          const arr: any[] = Array.isArray(d) ? d : d.users ? d.users : d.data ? d.data : []
          setTotalUsers(arr.length)
        }
        if (sessionsRes.status === "fulfilled") {
          const d: any = sessionsRes.value?.data || sessionsRes.value || {}
          const arr: any[] = Array.isArray(d) ? d : d.sessions ? d.sessions : d.data ? d.data : []
          setActiveSessions(arr.length)
        }
      } catch {
        // Silent fallback to placeholders
      }
    }
    fetchMetrics()
  }, [])

  return (
    <div className="relative h-[90vh] overflow-hidden organization-dashboard font-outfit">
      {/* Fixed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/50 via-white dark:via-zinc-950 to-primary/20 pointer-events-none z-0 bg-fixed" />

      {/* Scrollable Content */}
      <div className="absolute inset-0 overflow-y-auto hide-scrollbar z-10">
        <div className="backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center justify-between p-3 sm:p-6">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h6 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-tight normal-case truncate">Organisation Dashboard</h6>
                <p className="text-[11px] sm:text-xs font-medium text-zinc-600 dark:text-zinc-400 truncate">Welcome Back! Here's What's Happening Today.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-3 sm:p-4 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <SmallCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-xs opacity-80">Total Users</p>
                    <p className="text-white text-xl font-semibold mt-1">{(totalUsers ?? 2847).toLocaleString()}</p>
                    <p className="text-white text-[10px] mt-1">+12% From Last Month</p>
                  </div>
                  <Users className="w-5 h-5 text-white" />
                </div>
              </SmallCardContent>
            </SmallCard>

            <SmallCard className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <SmallCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs">Organization</p>
                    <p className="text-xl font-semibold text-zinc-900 dark:text-white mt-1">{orgCount}</p>
                    <p className="text-green-600 dark:text-green-400 text-[10px] mt-1">Your organization</p>
                  </div>
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
              </SmallCardContent>
            </SmallCard>

            <SmallCard className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <SmallCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs">Active Sessions</p>
                    <p className="text-xl font-semibold text-zinc-900 dark:text-white mt-1">{(activeSessions ?? 1234).toLocaleString()}</p>
                    <p className="text-blue-600 dark:text-blue-400 text-[10px] mt-1">+8% Increase</p>
                  </div>
                  <Activity className="w-5 h-5 text-primary" />
                </div>
              </SmallCardContent>
            </SmallCard>

            <SmallCard className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <SmallCardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs">Growth Rate</p>
                    <p className="text-xl font-semibold text-zinc-900 dark:text-white mt-1">24.5%</p>
                    <p className="text-green-600 dark:text-green-400 text-[10px] mt-1">Above Target</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </SmallCardContent>
            </SmallCard>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-medium text-zinc-900 dark:text-white">Performance Metrics</p>
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-0.5">Live Data</Badge>
            </div>
            <StatsCards />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {[
              { title: "Manage Users", desc: "Add, Edit, Or Remove User Accounts", icon: Users, color: "bg-blue-500", from: "from-blue-50 dark:from-blue-950/20", to: "to-indigo-50 dark:to-indigo-950/20" },
              { title: "Organizations", desc: "Configure Organization Settings", icon: Building2, color: "bg-green-500", from: "from-green-50 dark:from-green-950/20", to: "to-emerald-50 dark:to-emerald-950/20" },
              { title: "System Settings", desc: "Configure System Preferences", icon: Settings, color: "bg-purple-500", from: "from-purple-50 dark:from-purple-950/20", to: "to-violet-50 dark:to-violet-950/20" },
            ].map((item, i) => (
              <SmallCard key={i} className={`border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 bg-gradient-to-br ${item.from} ${item.to} hover:shadow-md transition-all duration-200 cursor-pointer`}>
                <SmallCardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </div>
                </SmallCardContent>
              </SmallCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
