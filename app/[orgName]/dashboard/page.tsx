"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { userById, getRoles } from "@/hooks/userHooks"
import { getAllOrg, getOrgById } from "@/hooks/orgHooks"
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
  const [selectedModule, setSelectedModule] = useState("")
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

  return (
    <div className="h-[90vh] hide-scrollbar overflow-hidden overflow-y-auto bg-gradient-to-br from-primary/50 via-white to-primary/20 organization-dashboard">
      <div className="backdrop-blur-sm sticky top-0">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h6 className="font-bold text-white">Organization Dashboard</h6>
              <p className="text-sm text-white">Welcome back! Here's what's happening today.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white">
            <SmallCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-xs opacity-80">Total Users</p>
                  <p className="text-white text-xl font-bold">2,847</p>
                  <p className="text-white text-[10px] mt-1">+12% from last month</p>
                </div>
                <Users className="w-5 h-5 text-white" />
              </div>
            </SmallCardContent>
          </SmallCard>

          <SmallCard className="border bg-white">
            <SmallCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs">Organizations</p>
                  <p className="text-xl font-bold text-gray-900">{organizations?.length || 0}</p>
                  <p className="text-green-600 text-[10px] mt-1">+3 new this week</p>
                </div>
                <Building2 className="w-5 h-5 text-primary" />
              </div>
            </SmallCardContent>
          </SmallCard>

          <SmallCard className="border bg-white">
            <SmallCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs">Active Sessions</p>
                  <p className="text-xl font-bold text-gray-900">1,234</p>
                  <p className="text-blue-600 text-[10px] mt-1">+8% increase</p>
                </div>
                <Activity className="w-5 h-5 text-primary" />
              </div>
            </SmallCardContent>
          </SmallCard>

          <SmallCard className="border bg-white">
            <SmallCardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs">Growth Rate</p>
                  <p className="text-xl font-bold text-gray-900">24.5%</p>
                  <p className="text-green-600 text-[10px] mt-1">Above target</p>
                </div>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </SmallCardContent>
          </SmallCard>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-semibold text-gray-900">Performance Metrics</p>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-0.5">Live Data</Badge>
          </div>
          <StatsCards />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {[
            { title: "Manage Users", desc: "Add, edit, or remove user accounts", icon: Users, color: "bg-blue-500", from: "from-blue-50", to: "to-indigo-50" },
            { title: "Organizations", desc: "Configure organization settings", icon: Building2, color: "bg-green-500", from: "from-green-50", to: "to-emerald-50" },
            { title: "System Settings", desc: "Configure system preferences", icon: Settings, color: "bg-purple-500", from: "from-purple-50", to: "to-violet-50" },
          ].map((item, i) => (
            <SmallCard key={i} className={`border bg-gradient-to-br ${item.from} ${item.to} hover:shadow-md transition-all duration-200 cursor-pointer`}>
              <SmallCardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </SmallCardContent>
            </SmallCard>
          ))}
        </div>
      </div>
    </div>
  )
}
