"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Save, Info, Loader2 } from "lucide-react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "sonner"
import {
  updateRole,
  getAllRolesNPermissions,
} from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"
import {
  RBACPermissionMatrix,
  PermissionEntry,
} from "@/shared/components/rbac/RBACPermissionMatrix"

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

export default function EditRolePage() {
  const router = useRouter()
  const params = useParams()
  const roleId = params.id as string
  const [orgName, setOrgName] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", description: "", permissions: [] },
    mode: "onChange",
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = form

  useEffect(() => {
    const org = (params.orgName as string) || localStorage.getItem("orgName") || ""
    setOrgName(org)
    ;(async () => {
      setIsLoading(true)
      try {
        const res = await getAllRolesNPermissions({ scope: "sc-org" })

        let rolesList: any[] = []
        if (res?.data?.permissions && res?.data?.iv) {
          rolesList = decryptData(res.data.permissions, res.data.iv) || []
        } else if (Array.isArray(res?.data?.roles)) {
          rolesList = res.data.roles
        } else if (Array.isArray(res?.data)) {
          rolesList = res.data
        }

        const target = rolesList.find((r: any) => r._id === roleId)
        if (!target) {
          toast.error("Role not found")
          router.push(`/${org}/modules/administration/roles`)
          return
        }

        reset({
          name: target.name || "",
          description: target.description || "",
          permissions: (target.permissions || []).map((p: any) => ({
            module: p.module,
            actions: Array.isArray(p.actions) ? p.actions : [],
          })),
        })
      } catch (error) {
        console.error("Error fetching role:", error)
        toast.error("Failed to load role details")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [params.orgName, params.id])

  const permissions = watch("permissions")
  const totalActions = permissions.reduce((acc, p) => acc + p.actions.length, 0)
  const currentName = watch("name")

  const onSubmit = async (values: RoleFormValues) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        permissions: values.permissions,
      }

      await updateRole(payload, roleId)
      toast.success("Role updated successfully")
      router.push(`/${orgName}/modules/administration/roles`)
    } catch (error: any) {
      console.error("Error updating role:", error)
      toast.error(error?.response?.data?.message || "Failed to update role")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
        <span className="text-xs font-medium text-zinc-500">Loading role details...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1">
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                Edit Role{currentName ? `: ${currentName}` : ""}
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Update the role definition and adjust its assigned permissions.
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Changes
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
                  Modify the core identity of this custom role.
                </p>
              </div>
              <div className="p-5 space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium text-zinc-600">
                    Role Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input id="name" className="rounded-none h-9 text-sm" {...register("name")} />
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
                <Info size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Modification Notice</h3>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  Updates to this role immediately affect all assigned users. Users might need to
                  refresh their session to see new permissions.
                </p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none p-5 space-y-2">
              <h5 className="text-xs font-medium text-zinc-600">Active Scope</h5>
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

            <div className="flex items-center justify-end gap-2 pt-2">
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
