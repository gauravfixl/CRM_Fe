"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Save, Info, Loader2, Lock, Copy } from "lucide-react"
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

// ────────────────────────────────────────────────────────────────────
// OUTER COMPONENT — fetches data, then mounts the form ONCE the role
// is loaded. Mounting only after fetch is the cleanest way to ensure
// react-hook-form picks up correct defaults from the very first render
// (avoids reset() timing pitfalls that left fields blank previously).
// ────────────────────────────────────────────────────────────────────
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

  useEffect(() => {
    const org = (params.orgName as string) || localStorage.getItem("orgName") || ""
    setOrgName(org)
    ;(async () => {
      setIsLoading(true)
      try {
        // Pass orgId so the backend includes this org's custom roles too;
        // without it, only system roles are returned and custom roles 404.
        const orgId =
          (typeof window !== "undefined" &&
            (localStorage.getItem("orgID") || localStorage.getItem("orgId"))) ||
          ""
        const queryParams: any = { scope: "sc-org" }
        if (orgId) queryParams.orgId = orgId

        const res = await getAllRolesNPermissions(queryParams)

        let rolesList: FetchedRole[] = []
        if (res?.data?.permissions && res?.data?.iv) {
          rolesList = decryptData(res.data.permissions, res.data.iv) || []
        } else if (Array.isArray(res?.data?.roles)) {
          rolesList = res.data.roles
        } else if (Array.isArray(res?.data)) {
          rolesList = res.data
        }

        console.log(
          "[EditRole] roles fetched:",
          rolesList.length,
          "looking for",
          roleId
        )

        const target = rolesList.find((r) => r._id === roleId)
        if (!target) {
          console.warn("[EditRole] role not found:", roleId)
          toast.error("Role not found in the directory")
          router.push(`/${org}/modules/administration/roles`)
          return
        }

        console.log("[EditRole] target loaded:", {
          name: target.name,
          isCustom: target.isCustom,
          permissionsCount: target.permissions?.length,
        })
        setLoadedRole(target)
      } catch (error: any) {
        console.error("[EditRole] failed to load role:", error)
        toast.error(
          error?.response?.data?.message || "Failed to load role details"
        )
      } finally {
        setIsLoading(false)
      }
    })()
  }, [params.orgName, params.id])

  const cloneToCustom = async () => {
    if (!loadedRole) return
    setCloning(true)
    try {
      const orgId =
        (typeof window !== "undefined" &&
          (localStorage.getItem("orgID") || localStorage.getItem("orgId"))) ||
        undefined
      const cloneName = `${loadedRole.name} (Copy)`
      const payload: any = {
        role: ROLES.ORG_CUSTOM,
        name: cloneName,
        scope: ROLE_SCOPE.ORGANIZATION,
        description:
          loadedRole.description ||
          `Editable copy of system role "${loadedRole.name}"`,
        permissions: (loadedRole.permissions || []).map((p) => ({
          module: p.module,
          actions: [...(p.actions || [])],
        })),
        isCustom: true,
      }
      if (orgId) payload.orgId = orgId
      const res = await addRole(payload)
      const newId = res?.data?.data?._id || res?.data?._id
      toast.success(`Cloned to "${cloneName}". Opening the editable copy...`)
      if (newId) {
        router.push(`/${orgName}/modules/administration/roles/${newId}/edit`)
      } else {
        router.push(`/${orgName}/modules/administration/roles`)
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to clone role")
    } finally {
      setCloning(false)
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

  if (!loadedRole) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center space-y-4 font-outfit">
        <span className="text-sm font-medium text-gray-500">
          Role not found.
        </span>
        <Link href={`/${orgName}/modules/administration/roles`}>
          <Button
            variant="outline"
            className="rounded-xl h-10 px-6 font-semibold text-xs bg-white border-zinc-200"
          >
            Back to Roles
          </Button>
        </Link>
      </div>
    )
  }

  // Mount the form ONLY after data arrives. The key prop forces a fresh
  // form instance whenever the role id changes (defensive — prevents stale
  // state if user navigates between role edit pages).
  return (
    <EditRoleForm
      key={loadedRole._id}
      role={loadedRole}
      orgName={orgName}
      readOnly={readOnly}
      isSystemRole={isSystemRole}
      cloning={cloning}
      onClone={cloneToCustom}
      onSaved={() => router.push(`/${orgName}/modules/administration/roles`)}
    />
  )
}

// ────────────────────────────────────────────────────────────────────
// INNER FORM COMPONENT — useForm runs here with role data as defaults,
// so register/watch/Controller all work correctly from the first render.
// ────────────────────────────────────────────────────────────────────
interface EditRoleFormProps {
  role: FetchedRole
  orgName: string
  readOnly: boolean
  isSystemRole: boolean
  cloning: boolean
  onClone: () => void
  onSaved: () => void
}

function EditRoleForm({
  role,
  orgName,
  readOnly,
  isSystemRole,
  cloning,
  onClone,
  onSaved,
}: EditRoleFormProps) {
  const initialValues = useMemo<RoleFormValues>(
    () => ({
      name: role.name || "",
      description: role.description || "",
      permissions: (role.permissions || []).map((p) => ({
        module: p.module,
        actions: Array.isArray(p.actions) ? p.actions : [],
      })),
    }),
    [role]
  )

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialValues,
    mode: "onChange",
  })

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = form

  const permissions = watch("permissions")
  const totalActions = permissions.reduce(
    (acc, p) => acc + p.actions.length,
    0
  )
  const currentName = watch("name")

  const onSubmit = async (values: RoleFormValues) => {
    if (readOnly) {
      toast.info("System roles can't be edited. Use Clone & Customize.")
      return
    }
    try {
      const payload = {
        name: values.name,
        description: values.description || "",
        permissions: values.permissions,
      }
      await updateRole(payload, role._id)
      toast.success("Role updated successfully")
      onSaved()
    } catch (error: any) {
      console.error("[EditRole] update failed:", error)
      toast.error(
        error?.response?.data?.message || "Failed to update role"
      )
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] font-outfit pb-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <SubHeader
          title={`${readOnly ? "View" : "Edit"} Role: ${currentName || ""}`}
          breadcrumbItems={[
            { label: "Identity & Access", href: "#" },
            {
              label: "Roles",
              href: `/${orgName}/modules/administration/roles`,
            },
            { label: readOnly ? "View" : "Modify", href: "#" },
          ]}
          rightControls={
            <div className="flex gap-2 items-center">
              <span
                className={`text-[10px] font-semibold px-2 py-1 rounded-md border ${
                  isSystemRole
                    ? "bg-zinc-100 text-zinc-600 border-zinc-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                }`}
              >
                {isSystemRole ? "System" : "Custom"}
              </span>
              <Link href={`/${orgName}/modules/administration/roles`}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-none border-zinc-200 font-medium text-xs h-8 px-4"
                >
                  {readOnly ? "Back" : "Cancel"}
                </Button>
              </Link>
              {readOnly ? (
                <Button
                  type="button"
                  disabled={cloning}
                  onClick={onClone}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 font-semibold text-xs"
                >
                  {cloning ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cloning...
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 w-4 h-4" />
                      Clone &amp; Customize
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid || !isDirty}
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
              )}
            </div>
          </div>
        </div>

        {readOnly && (
          <div className="mx-4 md:mx-8 mt-4 px-5 py-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900">
                This is a system role — read only
              </p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                System roles ship with the platform and can&apos;t be modified directly.
                Click <strong>Clone &amp; Customize</strong> above to create an editable
                copy pre-filled with these permissions, then tailor it to your organization.
              </p>
            </div>
          </div>
        )}

        <fieldset
          disabled={readOnly}
          className={`p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 ${
            readOnly ? "opacity-95" : ""
          }`}
        >
          {/* Left Column: Form Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white border-zinc-200 rounded-xl shadow-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Role Metadata
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  {readOnly
                    ? "These values are locked for system roles."
                    : "Modify the core identity of this custom role."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium text-zinc-600">
                    Role Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    readOnly={readOnly}
                    className={`rounded-lg h-9 border-zinc-200 focus:ring-indigo-500/10 ${
                      readOnly ? "bg-zinc-50 cursor-not-allowed" : ""
                    }`}
                    {...register("name")}
                  />
                  {errors.name?.message && (
                    <p className="text-[11px] text-rose-600 font-medium">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="desc"
                    className="text-xs font-semibold text-gray-700"
                  >
                    Description{" "}
                    {!readOnly && (
                      <span className="text-zinc-400 font-normal">(optional)</span>
                    )}
                  </Label>
                  <Textarea
                    id="desc"
                    readOnly={readOnly}
                    placeholder={
                      readOnly
                        ? role.description ||
                          "(no description on this system role)"
                        : "Describe what users with this role can access..."
                    }
                    className={`rounded-lg min-h-[120px] border-zinc-200 focus:ring-indigo-500/10 ${
                      readOnly ? "bg-zinc-50 cursor-not-allowed" : ""
                    }`}
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
                <div className={readOnly ? "pointer-events-none" : ""}>
                  <RBACPermissionMatrix
                    value={field.value as PermissionEntry[]}
                    onChange={(next) => field.onChange(next)}
                  />
                </div>
              )}
            />

            {!readOnly && (
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
                  disabled={isSubmitting || !isValid || !isDirty}
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
            )}
          </div>
        </fieldset>
      </form>
    </div>
  )
}
