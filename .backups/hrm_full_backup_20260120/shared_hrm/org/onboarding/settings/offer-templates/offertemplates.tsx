import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import OfferTemplateWizard from "./offertemplatewizard"
import { mockOffers as initial } from "./data/mockoffers"

export default function OfferTemplatesPage() {
  const [offers, setOffers] = useState(initial)
  const [open, setOpen] = useState(false)

  const handleCreate = (newOffer) => {
    setOffers((prev) => [
      { ...newOffer, id: String(prev.length + 1), createdAt: new Date().toISOString() },
      ...prev,
    ])
  }

  const handleAction = (action, offer) => {
    switch (action) {
      case "edit":
        console.log("Editing:", offer)
        break
      case "clone":
        setOffers((prev) => [
          { ...offer, id: String(prev.length + 1), name: `${offer.name} (Clone)` },
          ...prev,
        ])
        break
      case "permissions":
        console.log("Manage permissions for:", offer)
        break
      case "archive":
        setOffers((prev) => prev.filter((o) => o.id !== offer.id))
        break
      default:
        break
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-semibold">Offer templates</h1>
          <p className="text-xs text-gray-600">
            List of all templates that are used to create offers for candidates in offer process
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="text-xs">
          + Create offer template
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="p-3 w-[25%] font-medium">NAME OF THE TEMPLATE</th>
              <th className="p-3 font-medium">CREATED BY</th>
              <th className="p-3 font-medium">LAST USED</th>
              <th className="p-3 font-medium">LAST UPDATED BY</th>
              <th className="p-3 font-medium text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o, i) => (
              <tr
                key={o.id}
                className={`border-t hover:bg-gray-50 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
                      {o.name}
                    </span>
                    <span className="text-xs text-gray-500">{o.description || "—"}</span>
                  </div>
                </td>
                <td className="p-3 text-xs text-gray-600">{o.createdBy || "NA"}</td>
                <td className="p-3 text-xs text-gray-600">
                  {o.lastUsed ? new Date(o.lastUsed).toLocaleDateString() : "NA"}
                </td>
                <td className="p-3 text-xs text-gray-600 flex items-center space-x-2">
                  {o.updatedBy ? (
                    <>
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-semibold">
                        {o.updatedBy?.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{o.updatedBy}</span>
                    </>
                  ) : (
                    "NA"
                  )}
                </td>
                <td className="p-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction("edit", o)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("clone", o)}>
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction("permissions", o)}>
                        Manage Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAction("archive", o)}
                        className="text-red-600 focus:text-red-700"
                      >
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Wizard */}
      <OfferTemplateWizard
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(template) => {
          handleCreate(template)
          setOpen(false)
        }}
      />
    </div>
  )
}
