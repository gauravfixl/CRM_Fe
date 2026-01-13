"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import EditCandidatePortal from "./EditCandidatePortal"

export default function CandidatePortalHome() {
  const [isEditing, setIsEditing] = useState(false)
  const [portalData, setPortalData] = useState({
    logo: "https://via.placeholder.com/100x50.png",
    welcomeMessage:
      "It was great interacting with you as part of our interview process. We are excited about the possibilities of working together.",
    aboutLink: "https://www.hr.keka.com",
    contactName: "Prashant Yadav",
    contactMobile: "7588881777",
    contactEmail: "prashant@yopmail.com",
  })

  // ✅ When Save & Apply is clicked
  const handleSave = (updatedData: any) => {
    setPortalData(updatedData)
    setIsEditing(false) // closes edit view and shows home again
  }

  // ✅ When Cancel is clicked
  const handleCancel = () => {
    console.log("cancel calld")
    setIsEditing(false) // simply closes edit view
  }

  // ✅ When editing, show edit page
  if (isEditing) {
    return (
      <EditCandidatePortal
        initialData={portalData}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  // ✅ Otherwise show home page
  return (
    <div className="p-4 border rounded-md w-full bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-sm font-semibold">Candidate Portal</h1>
        <Button
          size="sm"
          className="text-xs h-7 px-3"
          onClick={() => setIsEditing(true)}
        >
          Edit Portal
        </Button>
      </div>

      <Card className="p-4 text-xs space-y-2">
        <img
          src={portalData.logo}
          alt="Company Logo"
          className="w-[100px] h-[50px] object-cover border rounded"
        />
        <p className="text-gray-600">{portalData.welcomeMessage}</p>
        <a
          href={portalData.aboutLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline text-[10px]"
        >
          {portalData.aboutLink}
        </a>
        <div className="text-gray-500 text-[11px]">
          <p>{portalData.contactName}</p>
          <p>{portalData.contactMobile}</p>
          <p>{portalData.contactEmail}</p>
        </div>
      </Card>
    </div>
  )
}
