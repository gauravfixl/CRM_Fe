import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface UpdateStatusModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (status: "accepted" | "rejected") => void
}

export default function UpdateStatusModal({ open, onClose, onConfirm }: UpdateStatusModalProps) {
  const [selected, setSelected] = useState<"accepted" | "rejected" | null>(null)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Candidate Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-3">
          <label className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={selected === "accepted"}
              onCheckedChange={() => setSelected("accepted")}
            />
            <span>Accepted by candidate</span>
          </label>

          <label className="flex items-center space-x-2 text-sm">
            <Checkbox
              checked={selected === "rejected"}
              onCheckedChange={() => setSelected("rejected")}
            />
            <span>Rejected by candidate</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!selected}
            onClick={() => {
              if (selected) onConfirm(selected)
              onClose()
            }}
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
