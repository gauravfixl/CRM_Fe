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
import { ROLES, ROLE_SCOPE } from "@/shared/utils/module-permission-map"

const roleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  permissions: z.array(z.object({
    module: z.string(),
    actions: z.array(z.string())
  })).min(1, "At least one permission is required")
})

type RoleFormValues = z.infer<typeof roleSchema>

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
  const totalActions = permissions.reduce((acc: number, p: PermissionEntry) => acc + p.actions.length, 0)

  const onSubmit = async (data: RoleFormValues) => {
    try {
      const orgId =
        (typeof window !== "undefined" &&
          (localStorage.getItem("orgID") || localStorage.getItem("orgId"))) ||
        undefined
      const payload = {
        role: ROLES.ORG_CUSTOM,        // backend enum slug for custom org-scope roles
        name: data.name,
        scope: ROLE_SCOPE.ORGANIZATION, // "sc-org" — required by Mongoose schema
        description: data.description,
        permissions: data.permissions,
        isCustom: true
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
          </div>
        </div>
      </form>
    </div>
  )
}
