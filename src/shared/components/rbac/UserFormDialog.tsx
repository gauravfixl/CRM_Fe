"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, UserPlus, Pencil, Mail, KeySquare } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/components/ui/button"
import { MultiSelect } from "@/shared/components/custom/multi-select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showError, showSuccess } from "@/utils/toast"
import { getFirmList } from "@/modules/crm/firms/hooks/firmHooks"
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"
import {
  createOrgInvite,
  updateOrgUser,
} from "@/modules/crm/organizations/hooks/orgHooks"
import { adduser } from "@/modules/crm/users/hooks/userHooks"

export type UserFormMode = "invite" | "direct" | "edit"

const nameRegex = /^[a-zA-Z][a-zA-Z\s]*$/
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

const baseShape = {
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(40, "First name is too long")
    .regex(nameRegex, "Only letters and spaces allowed"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(40, "Last name is too long")
    .regex(nameRegex, "Only letters and spaces allowed"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  roleId: z.string().min(1, "Select a role"),
  // Firms are required by default. The dialog uses a refine-style form-level
  // check (in handleInviteSubmit / handleDirectSubmit) to bypass this for
  // admin-tier roles whose access is org-wide. Empty here is allowed at the
  // schema level; submit-time logic enforces the rule based on selected role.
  firmIds: z.array(z.string()).default([]),
}

const inviteSchema = z.object(baseShape)

const directSchema = z.object({
  ...baseShape,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      strongPasswordRegex,
      "Password must contain uppercase, lowercase and a digit"
    ),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, "Enter a valid phone number (7–15 digits)"),
})

const editSchema = z.object({
  firstName: baseShape.firstName,
  lastName: baseShape.lastName,
  email: baseShape.email,
  roleId: baseShape.roleId,
  firmIds: baseShape.firmIds,
})

type InviteValues = z.infer<typeof inviteSchema>
type DirectValues = z.infer<typeof directSchema>
type EditValues = z.infer<typeof editSchema>

type FirmOption = { _id: string; FirmName: string }
type RoleOption = { _id: string; name: string; isCustom?: boolean }

interface EditUserTarget {
  id: string
  firstName: string
  lastName: string
  email: string
  roleId?: string
  roleName?: string
  firmIds?: string[]
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  mode: UserFormMode
  editTarget?: EditUserTarget | null
  onSuccess?: () => void
}

const splitName = (name: string): { firstName: string; lastName: string } => {
  const t = (name || "").trim()
  if (!t) return { firstName: "", lastName: "" }
  const [first, ...rest] = t.split(/\s+/)
  return { firstName: first || "", lastName: rest.join(" ") || "" }
}

const INVITE_FORM_ID = "user-form-invite"
const DIRECT_FORM_ID = "user-form-direct"
const EDIT_FORM_ID = "user-form-edit"

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  editTarget,
  onSuccess,
}: UserFormDialogProps) {
  const [firms, setFirms] = useState<FirmOption[]>([])
  const [roles, setRoles] = useState<RoleOption[]>([])
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [activeTab, setActiveTab] = useState<"invite" | "direct">(
    mode === "direct" ? "direct" : "invite"
  )

  const inviteForm = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
      firmIds: [],
    },
  })

  const directForm = useForm<DirectValues>({
    resolver: zodResolver(directSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      roleId: "",
      firmIds: [],
    },
  })

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      roleId: "",
      firmIds: [],
    },
  })

  useEffect(() => {
    if (!open) return
    setActiveTab(mode === "direct" ? "direct" : "invite")

    const loadMeta = async () => {
      setLoadingMeta(true)
      try {
        // Pass orgId so backend includes this org's CUSTOM roles (HR Admin, etc.)
        // alongside system roles. Without orgId only system roles come back —
        // and any custom role the admin just created stays invisible here.
        const orgId =
          (typeof window !== "undefined" &&
            (localStorage.getItem("orgID") || localStorage.getItem("orgId"))) ||
          ""
        const roleParams: any = { scope: "sc-org" }
        if (orgId) roleParams.orgId = orgId

        // Use allSettled so a transient firm error doesn't drop role data (and
        // vice versa). We log every rejection explicitly — silent .catch(()=>null)
        // swallowed real errors and made debugging impossible.
        const results = await Promise.allSettled([
          getFirmList(),
          getAllRolesNPermissions(roleParams),
        ])

        const firmRes = results[0].status === "fulfilled" ? results[0].value : null
        const roleRes = results[1].status === "fulfilled" ? results[1].value : null

        if (results[0].status === "rejected") {
          console.error("[UserFormDialog] firms fetch failed:", results[0].reason)
        }
        if (results[1].status === "rejected") {
          console.error("[UserFormDialog] roles fetch failed:", results[1].reason)
        }

        const firmData =
          firmRes?.data?.firms ||
          firmRes?.data?.data ||
          firmRes?.data ||
          []
        const firmArr: FirmOption[] = Array.isArray(firmData)
          ? firmData
              .filter((f: any) => f?._id && f?.FirmName)
              .map((f: any) => ({ _id: f._id, FirmName: f.FirmName }))
          : []
        setFirms(firmArr)
        console.log("[UserFormDialog] firms loaded:", firmArr.length)

        let rolesList: any[] = []
        if (roleRes?.data?.permissions && roleRes?.data?.iv) {
          try {
            rolesList = decryptData(roleRes.data.permissions, roleRes.data.iv) || []
          } catch (decErr) {
            console.error("[UserFormDialog] role decrypt failed:", decErr)
            rolesList = []
          }
        } else if (Array.isArray(roleRes?.data?.roles)) {
          rolesList = roleRes.data.roles
        } else if (Array.isArray(roleRes?.data)) {
          rolesList = roleRes.data
        }

        const roleArr: RoleOption[] = rolesList
          .filter((r: any) => r?._id && r?.name)
          .map((r: any) => ({
            _id: r._id,
            name: r.name,
            isCustom: Boolean(r.isCustom),
          }))
        setRoles(roleArr)
        console.log("[UserFormDialog] roles loaded:", roleArr.length, roleArr.map(r => r.name))
      } catch (err) {
        console.error("[UserFormDialog] loadMeta unexpected error:", err)
      } finally {
        setLoadingMeta(false)
      }
    }
    loadMeta()
  }, [open, mode])

  useEffect(() => {
    if (!open) return
    if (mode === "edit" && editTarget) {
      editForm.reset({
        firstName: editTarget.firstName || "",
        lastName: editTarget.lastName || "",
        email: editTarget.email || "",
        roleId: editTarget.roleId || "",
        firmIds: editTarget.firmIds || [],
      })
    } else {
      inviteForm.reset({
        firstName: "",
        lastName: "",
        email: "",
        roleId: "",
        firmIds: [],
      })
      directForm.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        roleId: "",
        firmIds: [],
      })
    }
  }, [open, mode, editTarget])

  const firmOptions = firms.map((f) => ({ label: f.FirmName, value: f._id }))

  // Admin-tier roles get implicit org-wide access — they don't need firm
  // assignment. Every other role MUST be bound to at least one firm so
  // firm-scoped data (clients, leads, invoices) is filterable for them.
  const ADMIN_TIER_ROLE_NAMES = new Set(["SuperAdmin", "OrgOwner", "OrgAdmin"])
  const isAdminRole = (roleId: string) => {
    const role = roles.find((r) => r._id === roleId)
    return role ? ADMIN_TIER_ROLE_NAMES.has(role.name) : false
  }

  // Reusable form-level firm check. Returns an error string if invalid, else "".
  const validateFirmRequirement = (roleId: string, firmIds: string[]): string => {
    if (isAdminRole(roleId)) return "" // exempt
    if (!firmIds || firmIds.length === 0) {
      if (firms.length === 0) {
        return "Create a firm first — non-admin users must be bound to at least one firm."
      }
      return "Select at least one firm for this user."
    }
    return ""
  }

  const handleInviteSubmit = async (values: InviteValues) => {
    const firmErr = validateFirmRequirement(values.roleId, values.firmIds)
    if (firmErr) {
      showError(firmErr)
      return
    }
    try {
      const role = roles.find((r) => r._id === values.roleId)
      await createOrgInvite({
        email: values.email.trim(),
        role: role?.name || "Member",
        roleId: values.roleId,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        firmIds: values.firmIds,
      })
      showSuccess(`Invitation sent to ${values.email}`)
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to send invitation")
    }
  }

  const handleDirectSubmit = async (values: DirectValues) => {
    const firmErr = validateFirmRequirement(values.roleId, values.firmIds)
    if (firmErr) {
      showError(firmErr)
      return
    }
    try {
      const role = roles.find((r) => r._id === values.roleId)
      const res = await adduser({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        password: values.password,
        role: role?.name || "Member",
        roleId: values.roleId,
        firmIds: values.firmIds,
      })
      if (typeof res === "string") {
        throw new Error(res)
      }
      showSuccess(`User ${values.firstName} created`)
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      showError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create user directly"
      )
    }
  }

  const handleEditSubmit = async (values: EditValues) => {
    if (!editTarget) return
    try {
      const role = roles.find((r) => r._id === values.roleId)
      // Backend UpdateOrganizationUser controller reads `Role` (capital R) +
      // optional `custom`/`overridePermissions`. Sending only lowercase `role`
      // was silently ignored — role changes never persisted. Send both casings
      // for robustness; backend ignores unknown fields.
      await updateOrgUser(editTarget.id, {
        Role: role?.name || undefined,
        custom: Boolean(role?.isCustom),
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        role: role?.name || undefined,
        roleId: values.roleId,
        firmIds: values.firmIds,
      })
      showSuccess("User updated successfully")
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to update user")
    }
  }

  const renderField = (
    label: string,
    name: string,
    form: any,
    required?: boolean,
    type: string = "text",
    placeholder?: string,
    hint?: string
  ) => (
    <Field
      label={label}
      required={required}
      error={
        form.formState.errors?.[name]?.message
          ? String(form.formState.errors[name].message)
          : undefined
      }
      hint={hint}
    >
      <Input
        type={type}
        placeholder={placeholder}
        className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
        {...form.register(name)}
      />
    </Field>
  )

  const renderRoleField = (form: any) => (
    <Field
      label="Role"
      required
      error={
        form.formState.errors?.roleId?.message
          ? String(form.formState.errors.roleId.message)
          : undefined
      }
    >
      <Select
        value={form.watch("roleId") || ""}
        onValueChange={(v) => form.setValue("roleId", v, { shouldValidate: true })}
      >
        <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
          <SelectValue placeholder={loadingMeta ? "Loading roles..." : "Select a role"} />
        </SelectTrigger>
        <SelectContent>
          {roles.length === 0 && !loadingMeta ? (
            <div className="px-2 py-1.5 text-xs text-gray-500">
              No roles found. Create one from Administration → Roles.
            </div>
          ) : (
            roles.map((role) => (
              <SelectItem key={role._id} value={role._id}>
                {role.name} {role.isCustom ? " (Custom)" : ""}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </Field>
  )

  const renderFirmsField = (form: any) => {
    const selectedRoleId: string = form.watch("roleId") || ""
    const adminExempt = selectedRoleId && isAdminRole(selectedRoleId)
    return (
    <Field
      label={adminExempt ? "Assign to firms (optional)" : "Assign to firms"}
      required={!adminExempt}
      hint={
        adminExempt
          ? "Admin-tier roles have org-wide access. Firm assignment is optional for them."
          : firms.length === 0 && !loadingMeta
            ? undefined
            : "Pick one or more firms. The user will only see data from these firms."
      }
      error={
        form.formState.errors?.firmIds?.message
          ? String(form.formState.errors.firmIds.message)
          : undefined
      }
    >
      {firms.length === 0 && !loadingMeta ? (
        adminExempt ? (
          <div className="text-[12px] text-zinc-600 bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg">
            No firms in this organization yet — and that&apos;s fine for admin
            roles since they have org-wide access.
          </div>
        ) : (
          <div className="text-[12px] text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-lg space-y-2">
            <div className="font-semibold flex items-center gap-1.5">
              <span>⚠</span>
              <span>No firms exist in this organization</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Non-admin users must be bound to at least one firm so they can
              access data scoped to that firm. Create a firm first, then come back
              here to invite this user.
            </p>
            <a
              href="../organization/firms"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 underline hover:no-underline"
            >
              → Go to Business Units to create a firm
            </a>
          </div>
        )
      ) : (
        <MultiSelect
          selected={form.watch("firmIds") || []}
          setSelected={(v) => form.setValue("firmIds", v, { shouldValidate: true })}
          options={firmOptions}
          placeholder={loadingMeta ? "Loading firms..." : "Select one or more firms"}
        />
      )}
    </Field>
    )
  }

  const title =
    mode === "edit" ? "Edit user" : mode === "direct" ? "Create user" : "Invite user"
  const description =
    mode === "edit"
      ? "Update user details, role, and firm assignments"
      : mode === "direct"
      ? "Create a user directly with immediate access"
      : "Send an invitation — or create directly"

  const icon =
    mode === "edit" ? <Pencil className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />

  const submittingEdit = editForm.formState.isSubmitting
  const submittingInvite = inviteForm.formState.isSubmitting
  const submittingDirect = directForm.formState.isSubmitting

  // Determine active form id + submit button state for the footer
  const activeFormId =
    mode === "edit"
      ? EDIT_FORM_ID
      : activeTab === "direct"
      ? DIRECT_FORM_ID
      : INVITE_FORM_ID

  const activeSubmitting =
    mode === "edit"
      ? submittingEdit
      : activeTab === "direct"
      ? submittingDirect
      : submittingInvite

  const activeSubmitLabel =
    mode === "edit"
      ? "Save changes"
      : activeTab === "direct"
      ? "Create user"
      : "Send invitation"

  return (
    <SideFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      icon={icon}
      width="lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={activeSubmitting}
            className="h-10 px-5 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={activeFormId}
            disabled={activeSubmitting || loadingMeta}
            className="h-10 px-5 rounded-lg bg-primary hover:bg-primary/90 text-white gap-2"
          >
            {activeSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {activeSubmitLabel}
          </Button>
        </>
      }
    >
      {mode === "edit" && editTarget ? (
        <form
          id={EDIT_FORM_ID}
          onSubmit={editForm.handleSubmit(handleEditSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {renderField("First name", "firstName", editForm, true, "text", "e.g. Priya")}
            {renderField("Last name", "lastName", editForm, true, "text", "e.g. Sharma")}
          </div>
          {renderField("Email", "email", editForm, true, "email", "user@company.com")}
          {renderRoleField(editForm)}
          {renderFirmsField(editForm)}
        </form>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full mb-4 grid grid-cols-2">
            <TabsTrigger value="invite" className="text-[12.5px] gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Send invite
            </TabsTrigger>
            <TabsTrigger value="direct" className="text-[12.5px] gap-1.5">
              <KeySquare className="w-3.5 h-3.5" /> Create directly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invite" className="m-0">
            <form
              id={INVITE_FORM_ID}
              onSubmit={inviteForm.handleSubmit(handleInviteSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                {renderField("First name", "firstName", inviteForm, true, "text", "e.g. Priya")}
                {renderField("Last name", "lastName", inviteForm, true, "text", "e.g. Sharma")}
              </div>
              {renderField("Email", "email", inviteForm, true, "email", "user@company.com")}
              {renderRoleField(inviteForm)}
              {renderFirmsField(inviteForm)}
            </form>
          </TabsContent>

          <TabsContent value="direct" className="m-0">
            <form
              id={DIRECT_FORM_ID}
              onSubmit={directForm.handleSubmit(handleDirectSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                {renderField("First name", "firstName", directForm, true, "text", "e.g. Priya")}
                {renderField("Last name", "lastName", directForm, true, "text", "e.g. Sharma")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {renderField("Email", "email", directForm, true, "email", "user@company.com")}
                {renderField("Phone", "phone", directForm, true, "tel", "+9198xxxxxxx")}
              </div>
              {renderField(
                "Temporary password",
                "password",
                directForm,
                true,
                "password",
                "Strong password",
                "Min 8 chars, 1 upper, 1 lower, 1 digit"
              )}
              {renderRoleField(directForm)}
              {renderFirmsField(directForm)}
            </form>
          </TabsContent>
        </Tabs>
      )}
    </SideFormSheet>
  )
}

export { splitName }
