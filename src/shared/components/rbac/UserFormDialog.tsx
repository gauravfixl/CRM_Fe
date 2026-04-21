"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/components/ui/button"
import { MultiSelect } from "@/shared/components/custom/multi-select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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
  firmIds: z.array(z.string()).min(1, "Assign at least one firm"),
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
        const [firmRes, roleRes] = await Promise.all([
          getFirmList().catch(() => null),
          getAllRolesNPermissions({ scope: "sc-org" }).catch(() => null),
        ])

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

        let rolesList: any[] = []
        if (roleRes?.data?.permissions && roleRes?.data?.iv) {
          try {
            rolesList = decryptData(roleRes.data.permissions, roleRes.data.iv) || []
          } catch {
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
      } catch (err) {
        console.error("Failed to load firms/roles", err)
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

  const handleInviteSubmit = async (values: InviteValues) => {
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
      await updateOrgUser(editTarget.id, {
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
    type: string = "text",
    placeholder?: string
  ) => (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-700 font-medium">{label}</Label>
      <Input
        type={type}
        placeholder={placeholder}
        className="h-9 rounded-none text-sm"
        {...form.register(name)}
      />
      {form.formState.errors?.[name]?.message && (
        <p className="text-[11px] text-red-600 font-medium">
          {String(form.formState.errors[name].message)}
        </p>
      )}
    </div>
  )

  const renderRoleField = (form: any) => (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-700 font-medium">Role</Label>
      <Select
        value={form.watch("roleId") || ""}
        onValueChange={(v) => form.setValue("roleId", v, { shouldValidate: true })}
      >
        <SelectTrigger className="h-9 rounded-none text-sm">
          <SelectValue placeholder={loadingMeta ? "Loading roles..." : "Select a role"} />
        </SelectTrigger>
        <SelectContent className="rounded-none">
          {roles.length === 0 && !loadingMeta ? (
            <div className="px-2 py-1.5 text-xs text-gray-500">
              No roles found. Create one from Administration → Roles.
            </div>
          ) : (
            roles.map((role) => (
              <SelectItem key={role._id} value={role._id} className="rounded-none text-sm">
                {role.name} {role.isCustom ? " (Custom)" : ""}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {form.formState.errors?.roleId?.message && (
        <p className="text-[11px] text-red-600 font-medium">
          {String(form.formState.errors.roleId.message)}
        </p>
      )}
    </div>
  )

  const renderFirmsField = (form: any) => (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-700 font-medium">Assign to firms</Label>
      {firms.length === 0 && !loadingMeta ? (
        <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded-none">
          No firms available. Create a firm from Business Units first.
        </div>
      ) : (
        <MultiSelect
          selected={form.watch("firmIds") || []}
          setSelected={(v) => form.setValue("firmIds", v, { shouldValidate: true })}
          options={firmOptions}
          placeholder={loadingMeta ? "Loading firms..." : "Select one or more firms"}
        />
      )}
      {form.formState.errors?.firmIds?.message && (
        <p className="text-[11px] text-red-600 font-medium">
          {String(form.formState.errors.firmIds.message)}
        </p>
      )}
    </div>
  )

  const title =
    mode === "edit" ? "Edit user" : mode === "direct" ? "Create user" : "Invite user"
  const description =
    mode === "edit"
      ? "Update user details, role, and firm assignments"
      : mode === "direct"
      ? "Create a user directly with immediate access"
      : "Send an invitation — or create directly"

  const submittingEdit = editForm.formState.isSubmitting
  const submittingInvite = inviteForm.formState.isSubmitting
  const submittingDirect = directForm.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-none p-0 gap-0">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-4">
          <DialogHeader>
            <DialogTitle className="text-white text-sm font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription className="text-white/70 text-xs">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {mode === "edit" && editTarget ? (
          <form onSubmit={editForm.handleSubmit(handleEditSubmit)}>
            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {renderField("First name", "firstName", editForm, "text", "e.g. Priya")}
                {renderField("Last name", "lastName", editForm, "text", "e.g. Sharma")}
              </div>
              {renderField("Email", "email", editForm, "email", "user@company.com")}
              {renderRoleField(editForm)}
              {renderFirmsField(editForm)}
            </div>
            <DialogFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingEdit || loadingMeta}
                className="rounded-none bg-primary hover:bg-primary/90 text-white"
              >
                {submittingEdit && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <div className="px-5 pt-3">
              <TabsList className="rounded-none w-full">
                <TabsTrigger value="invite" className="flex-1 rounded-none text-xs">
                  Send invite
                </TabsTrigger>
                <TabsTrigger value="direct" className="flex-1 rounded-none text-xs">
                  Create directly
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="invite" className="m-0">
              <form onSubmit={inviteForm.handleSubmit(handleInviteSubmit)}>
                <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {renderField("First name", "firstName", inviteForm, "text", "e.g. Priya")}
                    {renderField("Last name", "lastName", inviteForm, "text", "e.g. Sharma")}
                  </div>
                  {renderField("Email", "email", inviteForm, "email", "user@company.com")}
                  {renderRoleField(inviteForm)}
                  {renderFirmsField(inviteForm)}
                </div>
                <DialogFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="rounded-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingInvite || loadingMeta}
                    className="rounded-none bg-primary hover:bg-primary/90 text-white"
                  >
                    {submittingInvite && (
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    )}
                    Send invitation
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="direct" className="m-0">
              <form onSubmit={directForm.handleSubmit(handleDirectSubmit)}>
                <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {renderField("First name", "firstName", directForm, "text", "e.g. Priya")}
                    {renderField("Last name", "lastName", directForm, "text", "e.g. Sharma")}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {renderField("Email", "email", directForm, "email", "user@company.com")}
                    {renderField("Phone", "phone", directForm, "tel", "+9198xxxxxxx")}
                  </div>
                  {renderField(
                    "Temporary password",
                    "password",
                    directForm,
                    "password",
                    "Min 8 chars, 1 upper, 1 lower, 1 digit"
                  )}
                  {renderRoleField(directForm)}
                  {renderFirmsField(directForm)}
                </div>
                <DialogFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="rounded-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingDirect || loadingMeta}
                    className="rounded-none bg-primary hover:bg-primary/90 text-white"
                  >
                    {submittingDirect && (
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    )}
                    Create user
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { splitName }
