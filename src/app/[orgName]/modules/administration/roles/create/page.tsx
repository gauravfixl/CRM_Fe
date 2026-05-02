"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Save, ShieldCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
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
  permissions: z
    .array(
      z.object({
        module: z.string(),
        actions: z.array(z.string()),
      })
    )
    .min(1, "At least one permission is required"),
})

type RoleFormValues = z.infer<typeof roleSchema>

export default function CreateRolePage() {
  const router = useRouter()
  const params = useParams()
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    setOrgName((params.orgName as string) || localStorage.getItem("orgName") || "")
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
  const totalActions = permissions.reduce(
    (acc: number, p: PermissionEntry) => acc + p.actions.length,
    0
  )

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
        isCustom: true,
      }
      await addRole(payload)
      toast.success("Custom role created successfully")
      router.push(`/${orgName}/modules/administration/roles`)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create custom role")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Create Custom Role</h1>
              <p className="text-sm text-zinc-500 mt-1">
                Define a new role and select the precise permissions it should grant.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/${orgName}/modules/administration/roles`}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-none border-zinc-200 font-medium text-xs h-8 px-4"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                size="sm"
                className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Role
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Metadata */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-none">
              <div className="px-5 py-4 border-b border-zinc-100">
                <h3 className="text-sm font-semibold text-gray-900">Role Metadata</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Define the core identity of this custom role.
                </p>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium text-zinc-600">
                    Role Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. HR Admin"
                    className="rounded-none h-9 text-sm"
                    {...register("name")}
                  />
                  {errors.name?.message && (
                    <p className="text-[11px] text-rose-600 font-medium">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="desc" className="text-xs font-medium text-zinc-600">
                    Description <span className="text-rose-500">*</span>
                  </Label>
                  <Textarea
                    id="desc"
                    placeholder="Describe what users with this role can access..."
                    className="rounded-none text-sm min-h-[120px]"
                    {...register("description")}
                  />
                  {errors.description?.message && (
                    <p className="text-[11px] text-rose-600 font-medium">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-none">
                <ShieldCheck size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Security Recommendation</h3>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Follow the principle of least privilege. Only assign the exact permissions required
                  for the business function.
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none p-5 space-y-2">
              <h5 className="text-xs font-medium text-zinc-600">Selected Scope</h5>
              <div className="text-2xl font-bold tracking-tight text-zinc-900">
                {permissions.length} Modules
              </div>
              <div className="text-xs font-medium text-zinc-500">
                Total Actions: <span className="text-primary font-semibold">{totalActions}</span>
              </div>
              {errors.permissions?.message && (
                <p className="text-[11px] text-rose-600 font-medium pt-2">
                  {errors.permissions.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Right: Permission Matrix */}
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
