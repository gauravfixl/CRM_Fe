"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { showSuccess } from "@/utils/toast"
import { useState } from "react"

export default function OfferReleaseModal({ open, onClose, candidate, onEmailSent }: any) {
  const [emailSubject, setEmailSubject] = useState(`Offer letter - ${candidate?.name || ""}`)
  const [emailBody, setEmailBody] = useState(
    `Dear ${candidate?.name || "Candidate"},\n\nPlease find attached your offer letter.\n\nRegards,\nHR Team`
  )

  const handleSend = () => {
    showSuccess(`Offer email sent to ${candidate?.name}`)
    onEmailSent(candidate) // ✅ notify parent
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Release Offer for {candidate?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div>
            <label className="text-gray-600 text-xs font-medium">To</label>
            <Input value={candidate?.email || `${candidate?.name?.split(" ")[0].toLowerCase()}@example.com`} readOnly />
          </div>

          <div>
            <label className="text-gray-600 text-xs font-medium">Subject</label>
            <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
          </div>

          <div>
            <label className="text-gray-600 text-xs font-medium">Message</label>
            <Textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={6}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend} className="bg-blue-600 text-white hover:bg-blue-700">
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
