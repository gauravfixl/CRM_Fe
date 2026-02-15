"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  Shield,
  ArrowLeft,
  Save,
  Plus,
  Check,
  Info,
  Zap,
  LayoutGrid,
  ShieldCheck,
  Search,
  ChevronRight,
  ShieldAlert
} from "lucide-react"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { addRole } from "@/hooks/roleNPermissionHooks"

const AVAILABLE_MODULES = [
  { id: "crm", name: "CRM & Sales", actions: ["read", "write", "create", "delete", "export", "import"] },
  { id: "projects", name: "Project Management", actions: ["read", "write", "create", "delete", "manage_tasks", "view_financials"] },
  { id: "invoice", name: "Billing & Invoices", actions: ["read", "write", "create", "delete", "approve", "send"] },
  { id: "hrm", name: "Human Resources", actions: ["read", "write", "manage_leave", "view_salary", "recruit"] },
  { id: "users", name: "Identity & Access", actions: ["read", "write", "manage_roles", "reset_passwords", "invite"] },
  { id: "org", name: "Organization Settings", actions: ["read", "write", "configure_branding", "manage_firms"] },
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
        name: formData.name,
        description: formData.description,
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
    <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 pb-20">
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
              <CustomButton variant="outline" className="rounded-none h-10 px-6 font-bold bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                Cancel
              </CustomButton>
            </Link>
            <CustomButton
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-none h-10 px-8 font-black uppercase text-xs tracking-widest shadow-2xl border-0"
            >
              {isSubmitting ? "Writing Directory..." : "Save Identity Role"}
              {!isSubmitting && <Save className="ml-2 w-4 h-4" />}
            </CustomButton>
          </div>
        }
      />

      <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Left Column: Form Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm overflow-hidden border-t-4 border-t-indigo-600">
            <CardHeader>
              <CardTitle className="text-xl font-black tracking-tighter">Role Metadata</CardTitle>
              <CardDescription className="text-xs font-medium">Define the core identity of this custom extension.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Identity Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Finance Auditor"
                  className="rounded-none h-12 border-zinc-200 focus:ring-indigo-500/10 font-bold text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Description</Label>
                <Textarea
                  id="desc"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what users with this role can access..."
                  className="rounded-none min-h-[120px] border-zinc-200 focus:ring-indigo-500/10 font-medium"
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-none space-y-4">
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h6 className="text-sm font-black text-indigo-900">Security Recommendation</h6>
              <p className="text-xs text-indigo-700/80 leading-relaxed font-medium mt-1">
                Ensure you follow the principle of least privilege. Only assign the exact permissions required for the business function.
              </p>
            </div>
          </div>

          <Card className="bg-zinc-900 text-white rounded-none p-6 shadow-2xl relative overflow-hidden group">
            <ShieldAlert className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-2">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Selected Scope</h5>
              <div className="text-3xl font-black tracking-tighter">{formData.permissions.length} Modules</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Total Actions: {formData.permissions.reduce((acc, p) => acc + p.actions.length, 0)}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Permission Selection */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-none shadow-sm sticky top-[64px] z-20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search system modules to configure permissions..."
                className="pl-11 border-none focus-visible:ring-0 rounded-none h-12 bg-transparent font-bold"
              />
            </div>
            <Badge className="bg-zinc-100 text-zinc-500 rounded-none border-0 text-[10px] font-black px-3 h-8">
              {filteredModules.length} MODULES DETECTED
            </Badge>
          </div>

          <div className="space-y-6">
            {filteredModules.map((module) => (
              <Card key={module.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm group hover:border-indigo-500/50 transition-all overflow-hidden border-l-4 border-l-zinc-100 dark:border-l-zinc-800 data-[active=true]:border-l-indigo-600" data-active={formData.permissions.some(p => p.module === module.id)}>
                <CardHeader className="flex flex-row items-center justify-between pb-4 bg-zinc-50/30">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 flex items-center justify-center border transition-colors ${formData.permissions.some(p => p.module === module.id)
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700"
                      }`}>
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black tracking-tight">{module.name}</CardTitle>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">MODULE: {module.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2 mr-4">
                      <Checkbox
                        id={`all-${module.id}`}
                        checked={formData.permissions.find(p => p.module === module.id)?.actions.length === module.actions.length}
                        onCheckedChange={() => toggleAllModuleActions(module.id, module.actions)}
                        className="rounded-none border-zinc-300"
                      />
                      <Label htmlFor={`all-${module.id}`} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 cursor-pointer">Select All Actions</Label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {module.actions.map((action) => (
                    <div
                      key={action}
                      onClick={() => toggleAction(module.id, action)}
                      className={`p-4 border cursor-pointer flex items-center justify-between group/item transition-all ${isActionSelected(module.id, action)
                          ? "bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-800"
                          : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-5 w-5 border flex items-center justify-center transition-all ${isActionSelected(module.id, action)
                            ? "bg-indigo-600 border-indigo-600 scale-110"
                            : "bg-white dark:bg-zinc-950 border-zinc-300"
                          }`}>
                          {isActionSelected(module.id, action) && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-wider ${isActionSelected(module.id, action) ? "text-indigo-900 dark:text-indigo-400" : "text-zinc-600"
                          }`}>{action.replace('_', ' ')}</span>
                      </div>
                      <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <Info className="w-3.5 h-3.5 text-zinc-300" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Actions Recap */}
          <div className="bg-zinc-900 p-8 rounded-none text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative overflow-hidden">
            <Zap className="absolute -bottom-10 -left-10 h-64 w-64 opacity-5" />
            <div className="relative z-10 space-y-2 text-center md:text-left">
              <h4 className="text-2xl font-black tracking-tighter">Commit Role to Directory?</h4>
              <p className="text-zinc-400 text-sm font-medium opacity-80 max-w-md">
                This role will be immediately available for assignment in the Identity module. Custom roles are tagged as organization-specific.
              </p>
            </div>
            <div className="relative z-10 flex gap-4 w-full md:w-auto">
              <CustomButton
                onClick={handleSave}
                disabled={isSubmitting}
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-none h-14 px-12 uppercase text-xs tracking-[0.2em] shadow-xl border-0"
              >
                {isSubmitting ? "Processing..." : "Commit Expansion"}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
