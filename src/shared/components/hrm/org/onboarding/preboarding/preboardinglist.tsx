"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Search, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

import { showSuccess } from "@/utils/toast"
import PreboardingDrawer from "./preboardingdrawer"
import CreateOfferWizard from "./createofferwizard"
import OfferReleaseModal from "./releaseoffermodal"
import UpdateStatusModal from "./updatestatus"

interface Candidate {
  id: string
  name: string
  role: string
  stage: string
  dept: string
  location: string
  joining: string
  tasks: string
  action: string
}

interface PreboardingPageProps {
  candidates: Candidate[]
  onCandidateMoved?: (candidate: Candidate) => void
}

export default function PreboardingPage({ candidates: parentCandidates, onCandidateMoved }: PreboardingPageProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(parentCandidates || [])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadLink, setUploadLink] = useState<string | null>(null)
  const [openOfferWizard, setOpenOfferWizard] = useState(false)
  const [openEmailModal, setOpenEmailModal] = useState(false)
  const [offerCandidate, setOfferCandidate] = useState<Candidate | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  // Sync local state when parent updates
  useEffect(() => {
    setCandidates(parentCandidates)
  }, [parentCandidates])

  const handleOfferSent = (candidate: Candidate) => {
    setCandidates(prev =>
      prev.map(c =>
        c.id === candidate.id
          ? { ...c, stage: "Offer Released", action: "Release" }
          : c
      )
    )
    showSuccess(`Offer released for ${candidate.name}`)
  }

  const handleRelease = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setOpenEmailModal(true)
  }

  const handleStartPreboarding = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setDrawerOpen(true)
  }

  const handleUpdateStatus = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShowUpdateModal(true)
  }

  const handleStatusConfirm = (status: "accepted" | "rejected") => {
    const updatedCandidates = candidates.map(c =>
      c.id === selectedCandidate?.id
        ? {
            ...c,
            stage: status === "accepted" ? "Preboarding Completed" : "Offer Rejected",
            action: "Revise",
          }
        : c
    )
    setCandidates(updatedCandidates)
    showSuccess(
      `Candidate ${selectedCandidate?.name} ${status === "accepted" ? "accepted" : "rejected"} the offer`
    )

    // Notify parent if needed
    if (status === "accepted" && selectedCandidate && onCandidateMoved) {
      onCandidateMoved({ ...selectedCandidate, stage: "Preboarding Completed" })
    }
  }

  const handleInviteCandidate = (id: string) => {
    const updatedCandidates = candidates.map(c =>
      c.id === id ? { ...c, stage: "Preboarding Started", action: "Invited" } : c
    )
    setCandidates(updatedCandidates)
  }

  const handleUploadOnBehalf = (candidate: Candidate) => {
    const generatedLink = `/hrmcubicle/preboarding/upload/${candidate.id}`
    setUploadLink(generatedLink)
    setSelectedCandidate(candidate)
    setUploadModalOpen(true)
    showSuccess("Upload link generated!")
  }

  const handleCreateOffer = (candidate: Candidate) => {
    setOfferCandidate(candidate)
    setOpenOfferWizard(true)
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-[12px] text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[15px] font-semibold">Preboarding</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 text-[12px] border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            My candidates
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-[12px] flex items-center gap-1 px-3">
            <UserPlus className="h-3.5 w-3.5" />
            Add a candidate
          </Button>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white border rounded-md overflow-hidden shadow-sm">
        <table className="w-full text-[12px]">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr className="text-left">
              <th className="py-2 px-4 font-medium w-[22%]">NAME OF THE CANDIDATE</th>
              <th className="py-2 px-4 font-medium w-[14%]">OFFER STAGE</th>
              <th className="py-2 px-4 font-medium w-[22%]">DEPT. & LOCATION</th>
              <th className="py-2 px-4 font-medium w-[12%]">JOINING DATE</th>
              <th className="py-2 px-4 font-medium w-[12%]">TASKS PENDING</th>
              <th className="py-2 px-4 font-medium text-right w-[18%]">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center font-semibold text-[11px] text-green-700">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 leading-tight text-xs">
                        <Link
                          href={`/hrmcubicle/candidate-summary/${c.id}`}
                          className="text-blue-600 hover:underline hover:text-blue-700"
                        >
                          {c.name}
                        </Link>
                      </p>
                      <p className="text-gray-500 text-[11px]">{c.role}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-4 text-gray-700">{c.stage}</td>
                <td className="py-2.5 px-4 text-gray-600">
                  <p className="leading-tight text-xs">{c.dept}</p>
                  <p className="text-[11px] text-gray-500">{c.location}</p>
                </td>
                <td className="py-2.5 px-4 text-gray-600">{c.joining}</td>
                <td className="py-2.5 px-4 text-gray-600">{c.tasks}</td>
                <td className="py-2.5 px-4 text-right">
                  {c.action === "Release" ? (
                    <Button
                      onClick={() => handleRelease(c)}
                      className="h-7 text-[11px] px-3 border-blue-600 text-blue-600 hover:bg-blue-50"
                      variant="outline"
                    >
                      Release
                    </Button>
                  ) : c.action === "Invited" ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUploadOnBehalf(c)}
                        className="h-7 text-[11px] px-3 border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        Upload on behalf
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCreateOffer(c)}
                        className="h-7 text-[11px] px-3 border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        Create offer
                      </Button>
                    </div>
                  ) : c.action === "Update Status" ? (
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateStatus(c)}
                      className="h-7 text-[11px] px-3 border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Update Status
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleStartPreboarding(c)}
                      className={`h-7 text-[11px] px-3 ${
                        c.action === "Start preboarding"
                          ? "border-blue-600 text-blue-600 hover:bg-blue-50"
                          : c.action === "Revise"
                          ? "border-gray-300 text-gray-700 hover:bg-gray-100"
                          : "border-gray-300 text-gray-700 hover:bg-blue-50"
                      }`}
                    >
                      {c.action}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <PreboardingDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        candidate={selectedCandidate}
        onInvite={handleInviteCandidate}
      />

      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload documents for {selectedCandidate?.name}</DialogTitle>
          </DialogHeader>
          <div className="text-sm space-y-3">
            <p>Upload the candidate’s preboarding documents manually, or share this link:</p>
            {uploadLink && (
              <div className="bg-gray-100 text-xs p-2 rounded font-mono text-gray-700">{uploadLink}</div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
                Close
              </Button>
              <a href={uploadLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                Open upload page
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CreateOfferWizard
        open={openOfferWizard}
        onClose={() => setOpenOfferWizard(false)}
        candidate={offerCandidate}
        onOfferSent={handleOfferSent}
      />

      <OfferReleaseModal
        open={openEmailModal}
        onClose={() => setOpenEmailModal(false)}
        candidate={selectedCandidate}
        onEmailSent={(candidate: Candidate) => {
          const updatedCandidates = candidates.map(c =>
            c.id === candidate.id
              ? { ...c, action: "Update Status" }
              : c
          )
          setCandidates(updatedCandidates)
          showSuccess(`Offer released email sent to ${candidate.name}`)
        }}
      />

      <UpdateStatusModal
        open={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={handleStatusConfirm}
      />
    </div>
  )
}
