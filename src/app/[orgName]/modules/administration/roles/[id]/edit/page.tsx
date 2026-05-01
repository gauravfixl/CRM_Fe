"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Save, Info, Loader2, Lock, Copy, Plus } from "lucide-react"
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
import {
  updateRole,
  getAllRolesNPermissions,
  addRole,
} from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"
import {
  RBACPermissionMatrix,
  PermissionEntry,
} from "@/shared/components/rbac/RBACPermissionMatrix"
import { ROLES, ROLE_SCOPE } from "@/shared/utils/module-permission-map"

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
    .max(300, "Description is too long")
    .optional()
    .or(z.literal("")),
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

type FetchedRole = {
  _id: string
  name?: string
  role?: string
  description?: string
  isCustom?: boolean
  scope?: string
  permissions?: { module: string; actions: string[] }[]
}

export default function EditRolePage() {
  const router = useRouter()
  const params = useParams()
  const roleId = params.id as string
  const [orgName, setOrgName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [loadedRole, setLoadedRole] = useState<FetchedRole | null>(null)
  const [cloning, setCloning] = useState(false)

  const isSystemRole = !loadedRole?.isCustom
  const readOnly = isSystemRole

  // We initialize the form with defaultValues built from the loaded role.
  // To make this reliable we MOUNT the form only after data is ready (key prop
  // on the form container), so react-hook-form uses correct defaults from the
  // first render — bypasses any reset() timing pitfalls.
  const initialValues = useMemo<RoleFormValues>(
    () => ({
      name: loadedRole?.name || "",
      description: loadedRole?.description || "",
      permissions: (loadedRole?.permissions || []).map((p) => ({
        module: p.module,
        actions: Array.isArray(p.actions) ? p.actions : [],
      })),
    }),
    [loadedRole]
  )

  useEffect(() => {
    const org =
      (params.orgName as string) || localStorage.getItem("orgName") || ""
    setOrgName(org)
      ; (async () => {
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
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4 font-outfit">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-sm font-medium text-gray-500">
          Loading role details...
        </span>
      </div>
    )
  }

  const currentName = watch("name")

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] font-outfit pb-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SubHeader
          title={`Edit Role: ${currentName || ""}`}
          breadcrumbItems={[
            { label: "Identity & Access", href: "#" },
            {
              label: "Roles",
              href: `/${orgName}/modules/administration/roles`,
            },
            { label: "Modify", href: "#" },
          ]}
          rightControls={
            <div className="flex gap-2">
              <Link href={`/${orgName}/modules/administration/roles`}>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl h-10 px-6 font-semibold text-xs bg-white border-zinc-200"
                >
                  {readOnly ? "Back" : "Cancel"}
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
                    Updating...
                  </>
                ) : (
                  <>
                    Save Changes <Save className="ml-2 w-4 h-4" />
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
                <CardTitle className="text-sm font-semibold">
                  Role Metadata
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  Modify the core identity of this custom role.
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

            <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-xl space-y-4">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h6 className="text-sm font-semibold text-blue-900">
                  Modification Notice
                </h6>
                <p className="text-xs text-blue-700/80 leading-relaxed font-medium mt-1">
                  Updates to this role immediately affect all assigned users.
                  Users might need to refresh their session to see new
                  permissions.
                </p>
              </div>
            </div>

            <Card className="bg-white border-zinc-200 rounded-xl p-6 shadow-sm">
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-gray-700">
                  Active Scope
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
                <div className={readOnly ? "pointer-events-none" : ""}>
                  <RBACPermissionMatrix
                    value={field.value as PermissionEntry[]}
                    onChange={(next) => field.onChange(next)}
                  />
                </div>
              )}
            />

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
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
