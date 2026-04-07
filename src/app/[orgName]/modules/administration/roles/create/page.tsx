"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Save,
  Check,
  LayoutGrid,
  ShieldCheck,
  Search,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { addRole } from "@/hooks/roleNPermissionHooks"

const AVAILABLE_MODULES = [
  {
    id: "lead",
    name: "Leads",
    actions: ["CREATE_LEAD", "EDIT_LEAD", "DELETE_LEAD", "VIEW_LEAD", "ASSIGN_LEAD", "VIEW_DELETED_LEAD", "RESTORE_LEAD"]
  },
  {
    id: "client",
    name: "Clients",
    actions: ["CREATE_CLIENT", "EDIT_CLIENT", "DELETE_CLIENT", "VIEW_CLIENT_LIST", "RESTORE_CLIENT", "VIEW_DELETED_CLIENT"]
  },
  {
    id: "firm",
    name: "Firms",
    actions: ["CREATE_FIRM", "EDIT_FIRM", "DELETE_FIRM", "VIEW_FIRM", "RESTORE_FIRM", "VIEW_DELETED_FIRM"]
  },
  {
    id: "invoice",
    name: "Billing & Invoices",
    actions: ["GENERATE_REPORT", "EXPORT_DATA", "VIEW_ORG_ANALYTICS"]
  },
  {
    id: "project_management",
    name: "Project Management",
    actions: ["CREATE_PROJECT", "EDIT_PROJECT", "DELETE_PROJECT", "VIEW_PROJECT", "VIEW_ALL_PROJECT", "VIEW_PROJECT_ANALYTICS", "ASSIGN_PROJECT_LEAD", "ADD_PROJECT_MEMBER", "REMOVE_PROJECT_MEMBER"]
  },
  {
    id: "hrm_management",
    name: "Human Resources",
    actions: ["CREATE_EMPLOYEE", "EDIT_EMPLOYEE", "DELETE_EMPLOYEE", "VIEW_ALL_EMPLOYEES", "VIEW_EMPLOYEE_PROFILE", "MANAGE_EMPLOYE_LEAVE", "MANAGE_PAYROLL", "VIEW_PAYSLIPS", "MANAGE_ATTENDANCE"]
  },
  {
    id: "user",
    name: "Users",
    actions: ["CREATE_USER", "VIEW_ALL_USERS", "VIEW_USER", "UPDATE_ORG_USER", "DELETE_ORG_USER", "SUSPEND_USER", "SEND_INVITATION"]
  },
  {
    id: "role_permission",
    name: "Roles & Permissions",
    actions: ["CREATE_ROLE", "EDIT_ROLE", "DELETE_ROLE", "VIEW_ROLE", "MANAGE_PERMISSIONS", "AUDIT_PERMISSIONS", "CHANGE_MEMBER_ROLE"]
  },
  {
    id: "organization",
    name: "Organization Settings",
    actions: ["EDIT_ORGANIZATION", "VIEW_ORG", "VIEW_ORG_ANALYTICS", "EXPORT_ORG_DATA"]
  },
  {
    id: "document",
    name: "Documents",
    actions: ["UPLOAD_DOCUMENT", "DOWNLOAD_DOCUMENT", "SHARE_DOCUMENT", "MANAGE_DOCUMENT_VERSIONS", "DELETE_DOCUMENT"]
  },
  {
    id: "reports",
    name: "Reports",
    actions: ["GENERATE_REPORT", "EXPORT_DATA", "SCHEDULE_REPORTS", "SHARE_REPORTS"]
  },
]

export default function CreateRolePage() {
  const router = useRouter()
  const params = useParams()
  const [orgName, setOrgName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as { module: string; actions: string[] }[]
  })

  useEffect(() => {
    setOrgName(params.orgName as string || localStorage.getItem("orgName") || "")
  }, [params.orgName])

  const toggleAction = (module: string, action: string) => {
    setFormData(prev => {
      const existingModule = prev.permissions.find(p => p.module === module)

      if (!existingModule) {
        return {
          ...prev,
          permissions: [...prev.permissions, { module, actions: [action] }]
        }
      }

      const isActionSelected = existingModule.actions.includes(action)
      const updatedPermissions = prev.permissions.map(p => {
        if (p.module === module) {
          return {
            ...p,
            actions: isActionSelected
              ? p.actions.filter(a => a !== action)
              : [...p.actions, action]
          }
        }
        return p
      }).filter(p => p.actions.length > 0)

      return { ...prev, permissions: updatedPermissions }
    })
  }

  const isActionSelected = (module: string, action: string) => {
    return formData.permissions.find(p => p.module === module)?.actions.includes(action) || false
  }

  const toggleAllModuleActions = (module: string, actions: string[]) => {
    const existingModule = formData.permissions.find(p => p.module === module)
    const isAllSelected = existingModule && existingModule.actions.length === actions.length

    setFormData(prev => {
      if (isAllSelected) {
        return { ...prev, permissions: prev.permissions.filter(p => p.module !== module) }
      }
      const otherPermissions = prev.permissions.filter(p => p.module !== module)
      return { ...prev, permissions: [...otherPermissions, { module, actions: [...actions] }] }
    })
  }

  const handleSave = async () => {
    if (!formData.name || !formData.description || formData.permissions.length === 0) {
      toast.error("Please fill all required fields and select at least one permission")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        role: "OrgCustom",
        name: formData.name,
        description: formData.description,
        scope: "sc-org",
        permissions: formData.permissions,
        isCustom: true
      }

      await addRole(payload)
      toast.success("Identity Extension Created Successfully")
      router.push(`/${orgName}/modules/administration/roles`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create identity role")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredModules = AVAILABLE_MODULES.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] font-outfit pb-20">
      <SubHeader
        title="Create Identity Role"
        breadcrumbItems={[
          { label: "Identity & Access", href: "#" },
          { label: "Roles", href: `/${orgName}/modules/administration/roles` },
          { label: "Define New", href: "#" }
        ]}
        rightControls={
          <div className="flex gap-2">
            <Link href={`/${orgName}/modules/administration/roles`}>
              <Button variant="outline" className="rounded-xl h-10 px-6 font-semibold text-xs bg-white border-zinc-200">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 font-semibold text-xs"
            >
              {isSubmitting ? "Saving..." : "Save Role"}
              {!isSubmitting && <Save className="ml-2 w-4 h-4" />}
            </Button>
          </div>
        }
      />

      <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Form Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Role Metadata</CardTitle>
              <CardDescription className="text-xs font-medium">Define the core identity of this custom extension.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold text-gray-700">Identity Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Finance Auditor"
                  className="rounded-lg h-9 border-zinc-200 focus:ring-indigo-500/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-xs font-semibold text-gray-700">Description</Label>
                <Textarea
                  id="desc"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what users with this role can access..."
                  className="rounded-lg min-h-[120px] border-zinc-200 focus:ring-indigo-500/10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-xl space-y-4">
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h6 className="text-sm font-semibold text-indigo-900">Security Recommendation</h6>
              <p className="text-xs text-indigo-700/80 leading-relaxed font-medium mt-1">
                Ensure you follow the principle of least privilege. Only assign the exact permissions required for the business function.
              </p>
            </div>
          </div>

          <Card className="bg-white border-zinc-200 rounded-xl p-6 shadow-sm">
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-gray-700">Selected Scope</h5>
              <div className="text-2xl font-semibold text-gray-900">{formData.permissions.length} Modules</div>
              <div className="text-xs font-medium text-gray-500">
                Total Actions: {formData.permissions.reduce((acc, p) => acc + p.actions.length, 0)}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Permission Selection */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-4 bg-white border border-zinc-200 p-2 rounded-xl shadow-sm sticky top-[64px] z-20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search modules to configure permissions..."
                className="pl-11 border-none focus-visible:ring-0 rounded-lg h-9 bg-transparent font-medium"
              />
            </div>
            <Badge className="bg-zinc-100 text-zinc-600 rounded-full border-0 text-xs font-medium px-3 h-7">
              {filteredModules.length} modules
            </Badge>
          </div>

          <div className="space-y-6">
            {filteredModules.map((module) => {
              const isModuleActive = formData.permissions.some(p => p.module === module.id)
              const isAllSelected = formData.permissions.find(p => p.module === module.id)?.actions.length === module.actions.length

              return (
                <Card key={module.id} className={`bg-white border-zinc-200 rounded-xl shadow-sm transition-all overflow-hidden ${isModuleActive ? "border-l-4 border-l-indigo-600" : ""}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center border transition-colors ${isModuleActive
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-zinc-400 border-zinc-200"
                        }`}>
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">{module.name}</CardTitle>
                        <p className="text-xs font-medium text-gray-500">{module.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`all-${module.id}`}
                        checked={isAllSelected}
                        onCheckedChange={() => toggleAllModuleActions(module.id, module.actions)}
                        className="rounded-sm border-zinc-300"
                      />
                      <Label htmlFor={`all-${module.id}`} className="text-xs font-medium text-gray-500 cursor-pointer">Select All</Label>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {module.actions.map((action) => {
                      const selected = isActionSelected(module.id, action)
                      return (
                        <div
                          key={action}
                          onClick={() => toggleAction(module.id, action)}
                          className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-all ${selected
                              ? "bg-indigo-50 border-indigo-200"
                              : "bg-white border-zinc-100 hover:border-zinc-300"
                            }`}
                        >
                          <div className={`h-4 w-4 rounded-sm border flex items-center justify-center transition-all ${selected
                              ? "bg-indigo-600 border-indigo-600"
                              : "bg-white border-zinc-300"
                            }`}>
                            {selected && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                          </div>
                          <span className={`text-xs font-medium capitalize ${selected ? "text-indigo-900" : "text-zinc-600"}`}>
                            {action.replaceAll('_', ' ').toLowerCase()}
                          </span>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Bottom Save Row */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <Link href={`/${orgName}/modules/administration/roles`}>
              <Button variant="outline" className="rounded-xl h-10 px-6 font-semibold text-xs border-zinc-200">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-10 px-6"
            >
              {isSubmitting ? "Saving..." : "Save Role"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
