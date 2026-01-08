"use client"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogFooter,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/custom/CustomDialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomLabel } from "@/components/custom/CustomLabel"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectTrigger,
  CustomSelectItem,
  CustomSelectValue,
} from "@/components/custom/CustomSelect"
import { useAppStore } from "@/lib/store"
import { addFirmTax } from "@/hooks/taxHooks"

type CreateTaxDialogProps = {
  firmId?: string
  context?: "global" | "firm"
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (tax: any) => void // 👈 notify parent after saving
}

export default function CreateTaxDialog({
  firmId,
  context = "global",
  open,
  onOpenChange,
  onSave,
}: CreateTaxDialogProps) {
  const firms = useAppStore((state) => state.firms)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    scope: context === "firm" ? "firm" : "global",
    type: "gst",
    firmId: firmId ?? "",
    name: "",
    rate: "",
    description: "",
  })

  // Reset form whenever dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        scope: context === "firm" ? "firm" : "global",
        type: "gst",
        firmId: firmId ?? "",
        name: "",
        rate: "",
        description: "",
      })
    }
  }, [open, firmId, context])

 const handleCreateTax = async () => {
  try {
    setLoading(true)
    console.log("📤 Creating tax:", formData)

    const payload = {
      firmId: formData.firmId,
      taxRates: [
        {
          name: formData.name,
          rate: Number(formData.rate), // ensure number
          description: formData.description,
        },
      ],
    }

    const response = await addFirmTax(payload) // 🔥 API call
    console.log("✅ Tax created:", response.data)

    if (onSave) {
      onSave(response.data)
    }

    onOpenChange(false)
  } catch (error) {
    console.error("❌ Failed to create tax:", error)
  } finally {
    setLoading(false)
  }
}


  return (
    <CustomDialog open={open} onOpenChange={onOpenChange}>
      <CustomDialogContent className="sm:max-w-[500px]">
        <CustomDialogHeader>
          <CustomDialogTitle>Create New Tax</CustomDialogTitle>
          <CustomDialogDescription>
            {context === "firm"
              ? "Create a new tax for this firm."
              : "Create a new tax configuration for global or firm-specific use."}
          </CustomDialogDescription>
        </CustomDialogHeader>

        <div className="grid gap-4 py-1">
          {/* Scope + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <CustomLabel htmlFor="scope">Scope</CustomLabel>
              <CustomSelect
                value={formData.scope}
                onValueChange={(value) =>
                  setFormData({ ...formData, scope: value, firmId: "" })
                }
                disabled={context === "firm"} // 🔒 lock scope when used inside Firm
              >
                <CustomSelectTrigger>
                  <CustomSelectValue placeholder="Select scope" />
                </CustomSelectTrigger>
                <CustomSelectContent>
                  <CustomSelectItem value="global">Global</CustomSelectItem>
                  <CustomSelectItem value="firm">Firm Specific</CustomSelectItem>
                </CustomSelectContent>
              </CustomSelect>
            </div>
            <div className="space-y-2">
              <CustomLabel htmlFor="type">Type</CustomLabel>
              <CustomSelect
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <CustomSelectTrigger>
                  <CustomSelectValue placeholder="Select type" />
                </CustomSelectTrigger>
                <CustomSelectContent>
                  <CustomSelectItem value="gst">GST</CustomSelectItem>
                  <CustomSelectItem value="custom">Custom</CustomSelectItem>
                </CustomSelectContent>
              </CustomSelect>
            </div>
          </div>

          {/* Firm select if scope = firm */}
          {formData.scope === "firm" && (
            <div className="space-y-2">
              <CustomLabel htmlFor="firm">Firm</CustomLabel>
              <CustomSelect
                value={formData.firmId}
                onValueChange={(value) =>
                  setFormData({ ...formData, firmId: value })
                }
                disabled={!!firmId} // 🔒 lock firm if opened inside FirmDetailsPage
              >
                <CustomSelectTrigger>
                  <CustomSelectValue placeholder="Select a firm" />
                </CustomSelectTrigger>
                <CustomSelectContent>
                  {firms
                    .filter((firm) => !firm.isDeleted)
                    .map((firm) => (
                      <CustomSelectItem key={firm._id} value={firm._id}>
                        {firm.FirmName}
                      </CustomSelectItem>
                    ))}
                </CustomSelectContent>
              </CustomSelect>
            </div>
          )}

          {/* Tax name + rate */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <CustomLabel htmlFor="name">Tax Name</CustomLabel>
              <CustomInput
                id="name"
                placeholder={
                  formData.type === "gst" ? "GST" : "Enter tax name"
                }
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <CustomLabel htmlFor="rate">Tax Rate (%)</CustomLabel>
              <CustomInput
                id="rate"
                type="number"
                step="0.01"
                placeholder="18.00"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <CustomLabel htmlFor="description">Description</CustomLabel>
            <CustomTextarea
              id="description"
              placeholder="Enter tax description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
        </div>

        <CustomDialogFooter>
          <CustomButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </CustomButton>
          <CustomButton onClick={handleCreateTax} disabled={loading}>
            {loading ? "Creating..." : "Create Tax"}
          </CustomButton>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  )
}
