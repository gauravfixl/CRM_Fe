"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

const statuses = ["Unreleased", "Released", "Archived"]

export default function Versions() {
  const [status, setStatus] = useState("Unreleased")
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground">
        Projects / <span className="text-foreground">my proj</span> / Project settings
      </div>

      {/* Title and Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Releases</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Create version
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 py-2 px-4 pr-10 rounded focus:outline-none"
          >
            {statuses.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-7 text-sm font-medium text-gray-500 border-b pb-2">
        <div>Version</div>
        <div>Status</div>
        <div>Progress</div>
        <div>Start date</div>
        <div>Release date</div>
        <div>Description</div>
        <div>More actions</div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600">
        <img
          src="/empty-release.svg" // Replace this with actual image path
          alt="Empty"
          className="w-48 mb-6"
        />
        <h2 className="text-lg font-semibold">No matching versions</h2>
        <p className="text-sm max-w-sm">
          There aren't any versions in this project with that status. Check your filters and try again.
        </p>
      </div>
    </div>
  )
}
