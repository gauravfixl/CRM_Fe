"use client"

import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/custom/CustomDialog"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomLabel } from "@/components/custom/CustomLabel"
import { CustomButton } from "@/components/custom/CustomButton"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CustomSelect, CustomSelectTrigger, CustomSelectValue, CustomSelectContent, CustomSelectItem } from "@/components/custom/CustomSelect"
import { useState } from "react"
import { showSuccess, showError } from "@/utils/toast"
import { inviteUser } from "@/hooks/userHooks"
import useRolesStore from "@/lib/roleStore"

interface SendInviteModalProps {
  open: boolean
  onClose: () => void
}

const apps = [
  { name: "Cubicle", id: "cubicle" },
]

export default function SendInviteModal({ open, onClose }: SendInviteModalProps) {
  const [email, setEmail] = useState("")
  const orgRoles = useRolesStore(state => state.simpleRoles);
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string>("User")
  const [sendEmail, setSendEmail] = useState(true)
  const [message, setMessage] = useState("Hi,\n\nWelcome to...")

  const handleSendInvite = async () => {
    setLoading(true);
    const payload = { email, role: selectedRoles };

    try {
      const res = await inviteUser(payload);
      if (res.data?.success) {
        showSuccess("Invite sent successfully");
        onClose();
      } else {
        showError(res.data?.message || "Failed to send invite");
      }
    } catch (err: any) {
      console.error("Error sending invite:", err);
      showError(err.response?.data?.message || "Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog open={open} onOpenChange={onClose}>
      <CustomDialogContent className="max-w-2xl">
        <CustomDialogHeader>
          <CustomDialogTitle>Invite people to your organization</CustomDialogTitle>
        </CustomDialogHeader>

        <div className="space-y-4">
          <div>
            <CustomLabel className="mb-3">Email address</CustomLabel>
            <CustomInput
              placeholder="Invite by email address..."
              value={email}
              onChange={(e) => {
                const value = e.target.value.trim();
                if (!value.includes(",") && !value.includes(";") && !value.includes(" ")) {
                  setEmail(value);
                }
              }}
              className="mt-3"
            />
            <p className="text-xs text-muted-foreground mt-2">
              You can invite only one person at a time.
            </p>
          </div>

          <div className="border rounded-md p-4 space-y-4 bg-white">
            <CustomLabel className="font-semibold text-primary">Access Control</CustomLabel>
            {apps.map((app) => (
              <div key={app.id} className="flex items-center justify-between">
                <div className="text-sm text-primary">{app.name}</div>
                <CustomSelect
                  value={selectedRoles}
                  onValueChange={setSelectedRoles}
                >
                  <CustomSelectTrigger className="w-40">
                    <CustomSelectValue placeholder="Select role" />
                  </CustomSelectTrigger>
                  <CustomSelectContent>
                    {orgRoles && orgRoles.length > 0 ? (
                      orgRoles.map(role => (
                        <CustomSelectItem key={role._id} value={role.name}>
                          {role.name}
                        </CustomSelectItem>
                      ))
                    ) : (
                      <CustomSelectItem value="no-roles" disabled>No roles available</CustomSelectItem>
                    )}
                  </CustomSelectContent>
                </CustomSelect>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="send-email"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(!!checked)}
              />
              <CustomLabel htmlFor="send-email">Send invitation</CustomLabel>
            </div>
            {sendEmail && (
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Customize invitation..."
                maxLength={500}
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <CustomButton variant="ghost" onClick={onClose}>
              Cancel
            </CustomButton>
            <CustomButton onClick={handleSendInvite} disabled={!email || loading}>
              {loading ? "Sending..." : "Send invite"}
            </CustomButton>
          </div>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  )
}
