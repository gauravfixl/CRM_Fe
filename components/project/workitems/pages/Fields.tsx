"use client"

import React from "react"

interface Field {
  name: string
  description?: string
  renderer?: string
  required?: boolean
  screens: string
}

const fieldData: Field[] = [
  { name: "Actual end", description: "Enter when the change actually ended.", screens: "No screens" },
  { name: "Actual start", description: "Enter when the change actually started.", screens: "No screens" },
  { name: "Affects versions", screens: "3 screens" },
  { name: "Approvers", description: "Contains users needed for approval. This custom field was created by Cubicle Service Desk.", screens: "No screens" },
  { name: "Assignee", screens: "7 screens" },
  { name: "Attachment", screens: "5 screens" },
  { name: "Change type", screens: "No screens" },
  { name: "Comment", renderer: "Wiki Style Renderer", screens: "No screens" },
  { name: "Components", screens: "5 screens" },
  { name: "Description", renderer: "Wiki Style Renderer", screens: "5 screens" },
  { name: "Due date", screens: "5 screens" },
  { name: "Environment", description: "For example operating system, software platform and/or hardware specifications.", renderer: "Wiki Style Renderer", screens: "3 screens" },
  { name: "Fix versions", screens: "6 screens" },
  { name: "Impact", screens: "No screens" },
  { name: "Issue Type", required: true, screens: "5 screens" },
  { name: "Labels", screens: "5 screens" },
  { name: "Linked Issues", screens: "4 screens" },
  { name: "Log Work", description: "Allows work to be logged whilst creating, editing or transitioning issues.", renderer: "Wiki Style Renderer", screens: "1 screen" },
  { name: "Parent", screens: "4 screens" },
  { name: "Priority", screens: "5 screens" },
  { name: "Reporter", required: true, screens: "5 screens" },
  { name: "Resolution", screens: "1 screen" },
  { name: "Security Level", screens: "5 screens" },
  { name: "Story Points", description: "Measurement of complexity and/or size of a requirement.", screens: "No screens" },
  { name: "Summary", required: true, screens: "5 screens" },
  { name: "Time tracking", description: "Estimate of how much work remains until resolution. Format: *w *d *h *m.", screens: "1 screen" },
  { name: "[CHART] Date of First Response", screens: "No screens" },
  { name: "[CHART] Time in Status", screens: "No screens" },
]

const FieldsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="p-6 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-4">Default Field Configuration Scheme</h1>
        <p className="text-sm text-gray-700 mb-2">
          Different issues can have different information fields. A field configuration defines how fields behave for the project, e.g. required/optional; hidden/visible.
        </p>
        <p className="text-sm text-gray-700">
          The field configuration scheme defines which fields apply to this project. To change the fields used, you can select a different field configuration scheme, or modify the currently selected scheme.
        </p>
      </div>

      {/* Scrollable Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow p-4 min-w-full">
          <h2 className="text-xl font-semibold mb-2">Default Field Configuration</h2>
          <p className="text-sm text-gray-600 mb-4">
            Used by 5 issue types (Story, Bug, Epic, Task, Sub-task)
          </p>

          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 font-medium">Name</th>
                <th className="p-2 font-medium">Description</th>
                <th className="p-2 font-medium">Renderer</th>
                <th className="p-2 font-medium">Required</th>
                <th className="p-2 font-medium">Screens</th>
              </tr>
            </thead>
            <tbody>
              {fieldData.map((field, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-2 font-medium text-sm">{field.name}</td>
                  <td className="p-2 text-sm text-gray-600">
                    {field.description || "-"}
                  </td>
                  <td className="p-2 text-sm">{field.renderer || "-"}</td>
                  <td className="p-2 text-sm">{field.required ? "Yes" : "-"}</td>
                  <td className="p-2 text-sm text-blue-600">{field.screens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FieldsPage
