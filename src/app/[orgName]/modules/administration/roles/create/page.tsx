"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Save, ShieldCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import SubHeader from "@/components/custom/SubHeader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { toast } from "sonner"
import { addRole } from "@/hooks/roleNPermissionHooks"
import {
  RBACPermissionMatrix,
  PermissionEntry,
} from "@/shared/components/rbac/RBACPermissionMatrix"

<<<<<<< Updated upstream
const AVAILABLE_MODULES = [
  { id: "crm", name: "CRM & Sales", actions: ["read", "write", "create", "delete", "export", "import"] },
  { id: "projects", name: "Project Management", actions: ["read", "write", "create", "delete", "manage_tasks", "view_financials"] },
  { id: "invoice", name: "Billing & Invoices", actions: ["read", "write", "create", "delete", "approve", "send"] },
  { id: "hrm", name: "Human Resources", actions: ["read", "write", "manage_leave", "view_salary", "recruit"] },
  { id: "users", name: "Identity & Access", actions: ["read", "write", "manage_roles", "reset_passwords", "invite"] },
  { id: "org", name: "Organization Settings", actions: ["read", "write", "configure_branding", "manage_firms"] },
]
=======
const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Role name must be at least 3 characters")
    .max(40, "Role name is too long")
    .regex(
      /^[A-Za-z][A-Za-z0-9 _-]*$/,
      "Use letters, numbers, spaces, _ or - (must start with a letter)"
    ),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description is too long"),
  permissions: z
    .array(
      z.object({
        module: z.string().min(1),
        actions: z.array(z.string().min(1)).min(1),
      })
    )
    .min(1, "Select at least one permission"),
})

type RoleFormValues = z.infer<typeof roleSchema>
>>>>>>> Stashed changes

export default function CreateRolePage() {
  const router = useRouter()
  const params = useParams()
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    setOrgName(
      (params.orgName as string) || localStorage.getItem("orgName") || ""
    )
  }, [params.orgName])

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", description: "", permissions: [] },
    mode: "onChange",
  })

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = form

  const permissions = watch("permissions")
  const totalActions = permissions.reduce((acc, p) => acc + p.actions.length, 0)

<<<<<<< Updated upstream
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
=======
  const onSubmit = async (values: RoleFormValues) => {
    try {
      const payload = {
        role: "OrgCustom",
        name: values.name.trim(),
        description: values.description.trim(),
        scope: "sc-org",
        permissions: values.permissions,
        isCustom: true,
>>>>>>> Stashed changes
      }
      await addRole(payload)
      toast.success("Custom role created successfully")
      router.push(`/${orgName}/modules/administration/roles`)
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create custom role"
      )
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] font-outfit pb-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SubHeader
          title="Create Custom Role"
          breadcrumbItems={[
            { label: "Identity & Access", href: "#" },
            {
              label: "Roles",
              href: `/${orgName}/modules/administration/roles`,
            },
            { label: "Define New", href: "#" },
          ]}
          rightControls={
            <div className="flex gap-2">
              <Link href={`/${orgName}/modules/administration/roles`}>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-10 px-6 font-semibold text-xs bg-white border-zinc-200"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 font-semibold text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Role <Save className="ml-2 w-4 h-4" />
                  </>
                )}
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
                <CardDescription className="text-xs font-medium">
                  Define the core identity of this custom role.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold text-gray-700"
                  >
                    Role Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. HR Admin"
                    className="rounded-lg h-9 border-zinc-200 focus:ring-indigo-500/10"
                    {...register("name")}
                  />
                  {errors.name?.message && (
                    <p className="text-[11px] text-red-600 font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="desc"
                    className="text-xs font-semibold text-gray-700"
                  >
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="desc"
                    placeholder="Describe what users with this role can access..."
                    className="rounded-lg min-h-[120px] border-zinc-200 focus:ring-indigo-500/10"
                    {...register("description")}
                  />
                  {errors.description?.message && (
                    <p className="text-[11px] text-red-600 font-medium">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-xl space-y-4">
              <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h6 className="text-sm font-semibold text-indigo-900">
                  Security Recommendation
                </h6>
                <p className="text-xs text-indigo-700/80 leading-relaxed font-medium mt-1">
                  Follow the principle of least privilege. Only assign the exact
                  permissions required for the business function.
                </p>
              </div>
            </div>

            <Card className="bg-white border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-gray-700">
                  Selected Scope
                </h5>
                <div className="text-2xl font-semibold text-gray-900">
                  {permissions.length} Modules
                </div>
                <div className="text-xs font-medium text-gray-500">
                  Total Actions: {totalActions}
                </div>
                {errors.permissions?.message && (
                  <p className="text-[11px] text-red-600 font-medium pt-2">
                    {errors.permissions.message as string}
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Permission Matrix */}
          <div className="lg:col-span-8 space-y-6">
            <Controller
              control={control}
              name="permissions"
              render={({ field }) => (
                <RBACPermissionMatrix
                  value={field.value as PermissionEntry[]}
                  onChange={(next) => field.onChange(next)}
                />
              )}
            />

<<<<<<< Updated upstream
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
                            {action.replace('_', ' ')}
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
=======
            <div className="flex items-center justify-end gap-3 pt-6">
              <Link href={`/${orgName}/modules/administration/roles`}>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-10 px-6 font-semibold text-xs border-zinc-200"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-10 px-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Role"
                )}
>>>>>>> Stashed changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
