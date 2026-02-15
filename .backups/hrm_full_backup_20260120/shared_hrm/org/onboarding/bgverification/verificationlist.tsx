"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"
import VerificationWizard from "./verificationstepwizard"

export default function ActiveVerifications() {
  const [activeTab, setActiveTab] = useState("Active")
  const [openDisclaimer, setOpenDisclaimer] = useState(false)
  const [showWizard, setShowWizard] = useState(false)

  const tabs = ["Active", "Past", "Settings"]

  const candidates = [
    {
      name: "Jaya Bagala",
      role: "Implementation",
      joiningDate: "01 Dec 2023",
      dept: "Not Available",
      location: "null",
      checks: "Aadhaar Verification, +5",
      vendor: "OnGrid",
      initiatedBy: "Mark Scotfield",
      initiatedOn: "01 Oct 2025",
      status: "IN PROGRESS",
    },
    {
      name: "Kevin De Bruyne",
      role: "Graphics Designer",
      joiningDate: "Not Available",
      dept: "Not Available",
      location: "null",
      checks: "Aadhaar Verification, +5",
      vendor: "OnGrid",
      initiatedBy: "Mark Scotfield",
      initiatedOn: "01 Oct 2025",
      status: "IN PROGRESS",
    },
    {
      name: "Dwight Schrute",
      role: "Talent Acquisition",
      joiningDate: "01 Jun 2023",
      dept: "Not Available",
      location: "null",
      checks: "Aadhaar Verification, +5",
      vendor: "OnGrid",
      initiatedBy: "Mark Scotfield",
      initiatedOn: "01 Oct 2025",
      status: "IN PROGRESS",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 text-[13px]">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6 pt-3 flex items-center space-x-4 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 transition-all duration-150 border-b-2 ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 font-medium"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
        <div>
          <h2 className="text-sm font-semibold">Active Verifications</h2>
          <p className="text-[12px] text-gray-500">
            Initiate and track all the active background verifications for your workforce.
          </p>
        </div>
        <Button   onClick={() => setOpenDisclaimer(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
          Start New Verification
        </Button>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 bg-white border-b flex flex-wrap items-center gap-3 text-xs text-gray-600">
        <button className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-1 hover:bg-gray-50">
          Employee <ChevronDown className="w-3 h-3" />
        </button>
        <button className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-1 hover:bg-gray-50">
          Preboarding Candidates <span className="text-blue-600 font-medium">3</span>
        </button>
        <button className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-1 hover:bg-gray-50">
          Department <ChevronDown className="w-3 h-3" />
        </button>
        <button className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-1 hover:bg-gray-50">
          Location <ChevronDown className="w-3 h-3" />
        </button>
        <button className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-1 hover:bg-gray-50">
          Vendors <ChevronDown className="w-3 h-3" />
        </button>
        <button className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-1 hover:bg-gray-50">
          Initiated On Date <ChevronDown className="w-3 h-3" />
        </button>
        <button className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-1 hover:bg-gray-50">
          Closed On Date <ChevronDown className="w-3 h-3" />
        </button>
        <button className="border border-gray-300 rounded-md px-3 py-1.5 flex items-center gap-1 hover:bg-gray-50">
          Stage & Status <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Search & Bulk Buttons */}
      <div className="px-6 py-3 flex justify-between items-center bg-white border-b">
        <input
          type="text"
          placeholder="Search"
          className="text-xs border border-gray-300 rounded-md px-3 py-1.5 w-48 focus:ring-1 focus:ring-blue-500 outline-none"
        />
        <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs h-8">
          Bulk Set Decision
        </Button>
      </div>

      {/* Table */}
      <div className="px-6 py-4 bg-white">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="text-gray-500 font-medium border-b">
              <th className="text-left py-2">NAME</th>
              <th className="text-left py-2">JOINING DATE</th>
              <th className="text-left py-2">DEPT & LOCATION</th>
              <th className="text-left py-2">CHECKS & VENDOR</th>
              <th className="text-left py-2">INITIATED BY</th>
              <th className="text-left py-2">STATUS</th>
              <th className="text-left py-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-2 flex items-center gap-2">
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full text-white text-[10px]"
                    style={{
                      backgroundColor: ["#3B82F6", "#60A5FA", "#2563EB"][i % 3],
                    }}
                  >
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-gray-500 text-[11px]">{c.role}</div>
                  </div>
                </td>
                <td>{c.joiningDate}</td>
                <td>
                  {c.dept} <span className="text-gray-400">{c.location}</span>
                </td>
                <td>
                  {c.checks}, <span className="text-gray-400">{c.vendor}</span>
                </td>
                <td>
                  {c.initiatedBy} <br />
                  <span className="text-gray-400">{c.initiatedOn}</span>
                </td>
                <td>
                  <span className="text-[11px] font-medium text-blue-600">
                    ({c.status})
                  </span>
                  <br />
                  <span className="text-gray-400 text-[11px]">
                    Initiation in progress...
                  </span>
                </td>
                <td>
                  <button className="text-blue-600 hover:underline text-[11px]">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between items-center text-[11px] text-gray-500 mt-3">
          <p>1 to 3 of 3</p>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 border rounded hover:bg-gray-50">&lt;</button>
            <span>Page 1 of 1</span>
            <button className="px-2 py-1 border rounded hover:bg-gray-50">&gt;</button>
          </div>
        </div>
      </div>\
            {/* ---- Dialog ---- */}
      <Dialog open={openDisclaimer} onOpenChange={setOpenDisclaimer}>
        <DialogContent className="max-w-md p-0 rounded-lg overflow-hidden">
          <DialogHeader className="border-b bg-gray-50 px-5 py-3">
            <DialogTitle className="text-sm font-semibold">Disclaimer</DialogTitle>
          </DialogHeader>

          <div className="px-5 py-4 space-y-4">
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 p-2 rounded-md">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-xs leading-snug">
                Please note that you can only run background verification for an employee one time.
                Once initiated, you will not be able to run another background check for the same
                individual.
              </p>
            </div>

            <div>
              <p className="text-xs font-medium mb-1">
                Requirements to run a background verification:
              </p>
              <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                <li>
                  Display name should not contain numbers or special characters other than space,
                  hyphen or dot.
                </li>
                <li>Work Email ID should be active and verified.</li>
                <li>Mobile number should be valid.</li>
              </ul>
            </div>
          </div>

          <DialogFooter className="border-t bg-gray-50 px-5 py-3 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDisclaimer(false)}
              className="text-xs h-8 px-3"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
               setOpenDisclaimer(false)
               setShowWizard(true)
                // handle confirm logic here
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3"
            >
              Confirm and Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Wizard Overlay */}
      <VerificationWizard open={showWizard} onClose={() => setShowWizard(false)} />
    </div>

    
  )
}
