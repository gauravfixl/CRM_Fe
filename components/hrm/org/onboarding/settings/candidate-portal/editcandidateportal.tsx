"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"

export default function EditCandidatePortal({
  initialData,
  onCancel,
  onSave,
}: {
  initialData: any
  onCancel: () => void
  onSave: (data: any) => void
}) {
  const [form, setForm] = useState(initialData)
  const [preview, setPreview] = useState(initialData.logo)

  // handle input changes
  const handleChange = (key: string, value: string) => {
    setForm((prev: any) => ({ ...prev, [key]: value }))
  }

  // handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        handleChange("logo", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full bg-white rounded-lg border">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-2">
        <h1 className="text-xs font-semibold text-gray-700">Candidate Portal</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-3"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs h-7 px-3"
            onClick={() => onSave(form)}
          >
            Save & Apply
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        <Card className="border rounded-md">
          <CardHeader className="pb-2">
            <h2 className="text-xs font-semibold text-gray-700">Homepage</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {/* Logo */}
            <div>
              <p className="font-medium text-gray-700 mb-1">Company Logo</p>
              <div className="flex items-center gap-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-[100px] h-[50px] object-cover border rounded"
                />
                <label
                  htmlFor="uploadLogo"
                  className="cursor-pointer flex items-center gap-1 px-2 py-1 border rounded text-[10px] text-gray-600 hover:bg-gray-50"
                >
                  <Upload className="w-3 h-3" />
                  Upload
                  <input
                    type="file"
                    id="uploadLogo"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            </div>

            {/* Welcome Message */}
            <div>
              <p className="font-medium text-gray-700 mb-1">Welcome Message</p>
              <Textarea
                value={form.welcomeMessage}
                onChange={(e) => handleChange("welcomeMessage", e.target.value)}
                className="text-xs"
              />
            </div>

            {/* About Company */}
            <div>
              <p className="font-medium text-gray-700 mb-1">About Company Link</p>
              <Input
                value={form.aboutLink}
                onChange={(e) => handleChange("aboutLink", e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Reachout */}
            <div>
              <p className="font-medium text-gray-700 mb-1">Reachout Contact</p>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Name"
                  value={form.contactName}
                  onChange={(e) => handleChange("contactName", e.target.value)}
                  className="text-xs"
                />
                <Input
                  placeholder="Mobile"
                  value={form.contactMobile}
                  onChange={(e) => handleChange("contactMobile", e.target.value)}
                  className="text-xs"
                />
                <Input
                  placeholder="Email"
                  value={form.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
