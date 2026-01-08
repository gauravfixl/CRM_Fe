"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X, Check } from "lucide-react"

const triggerOptions = [
  "Before offer release",
  "After offer release",
  "After offer acceptance",
  "Before joining",
  "Joining day",
  "After joining",
]

const idCollectionItems = [
  "Photo ID - [AE]",
  "Address Proof - [AE]",
  "Work Authorization - [AE]",
  "Payroll - [AE]",
  "Other - [AE]",
  "Photo ID - [AU]",
  "Address Proof - [AU]",
]

const documentCollectionItems = [
  "10th Marksheet",
  "12th Marksheet",
  "Experience Letter",
  "Payslip",
]

const defaultOwners = ["HR Manager", "Team Lead", "Recruiter"]
const defaultApprovers = ["HR Manager", "Department Head"]

export default function CreateTaskModal({ open, onClose, onCreate }: any) {
  const [taskName, setTaskName] = useState("")
  const [taskType, setTaskType] = useState("Default")
  const [trigger, setTrigger] = useState("Before offer release")
  const [days, setDays] = useState(0)
  const [selectedOption, setSelectedOption] = useState("")
  const [taskOwner, setTaskOwner] = useState(defaultOwners[0])
  const [approver, setApprover] = useState(defaultApprovers[0])
  const [appliesTo, setAppliesTo] = useState("All Employees")
  const [checklistEnabled, setChecklistEnabled] = useState(false)
  const [checklistItems, setChecklistItems] = useState<{ text: string; finalized?: boolean }[]>([])
  const [sendReminder, setSendReminder] = useState(false)

  const handleCreate = () => {
    if (!taskName.trim()) return alert("Task name is required")

    let appliesToArray = appliesTo === "All Employees" ? ["All Employees"] : [appliesTo]

    onCreate({
      id: Date.now(),
      name: taskName,
      owner: taskOwner,
      when: trigger,
      appliesTo: appliesToArray,
      taskType,
      selectedOption,
      approver,
      days,
      checklist: {
        enabled: checklistEnabled,
        items: checklistItems,
      },
      sendReminder,
    })

    // Reset modal
    setTaskName("")
    setTaskType("Default")
    setTrigger("Before offer release")
    setDays(0)
    setSelectedOption("")
    setTaskOwner(defaultOwners[0])
    setApprover(defaultApprovers[0])
    setAppliesTo("All Employees")
    setChecklistEnabled(false)
    setChecklistItems([])
    setSendReminder(false)
    onClose()
  }

  const addChecklistItem = () => setChecklistItems((prev) => [...prev, { text: "" }])
  const removeChecklistItem = (index: number) => setChecklistItems((prev) => prev.filter((_, i) => i !== index))
  const updateChecklistText = (index: number, text: string) =>
    setChecklistItems((prev) => prev.map((item, i) => (i === index ? { ...item, text } : item)))
  const finalizeChecklistItem = (index: number) =>
    setChecklistItems((prev) => prev.map((item, i) => (i === index ? { ...item, finalized: true } : item)))

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed right-0 top-0 h-full w-[50%] bg-white shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="p-5 border-b">
              <h2 className="font-semibold text-sm mb-2">Create task</h2>
              <input
                className="w-full border rounded-md h-8 px-2 text-xs"
                placeholder="Task name (e.g., Submit Address Proof)"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div className="p-5 text-xs space-y-5">
              {/* Task Type */}
              <div>
                <p className="text-xs mb-1">Task type</p>
                <select
                  className="w-full border rounded-md h-8 px-2 text-xs"
                  value={taskType}
                  onChange={(e) => {
                    setTaskType(e.target.value)
                    setSelectedOption("")
                  }}
                >
                  <option>Default</option>
                  <option>ID Collection</option>
                  <option>Document Collection</option>
                </select>

                {taskType === "Default" && (
                  <input
                    className="mt-2 w-full border rounded-md h-8 px-2 text-xs"
                    placeholder="Enter details for default task"
                  />
                )}
                {taskType === "ID Collection" && (
                  <select
                    className="mt-2 w-full border rounded-md h-8 px-2 text-xs"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option value="">Select Item</option>
                    {idCollectionItems.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                )}
                {taskType === "Document Collection" && (
                  <select
                    className="mt-2 w-full border rounded-md h-8 px-2 text-xs"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option value="">Select Document</option>
                    {documentCollectionItems.map((doc) => (
                      <option key={doc}>{doc}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Trigger */}
              <div>
                <p className="text-xs mb-1">Triggered</p>
                <select
                  className="w-full border rounded-md h-8 px-2 text-xs"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                >
                  {triggerOptions.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
                <p className="text-gray-500 mt-1 text-xs">
                  Task will be triggered {trigger.toLowerCase()}
                </p>
              </div>

              {/* Owner */}
              <div>
                <p className="text-xs mb-1">Task owner</p>
                <select
                  className="w-full border rounded-md h-8 px-2 text-xs"
                  value={taskOwner}
                  onChange={(e) => setTaskOwner(e.target.value)}
                >
                  {defaultOwners.map((owner) => (
                    <option key={owner}>{owner}</option>
                  ))}
                </select>
              </div>

              {/* Approvers */}
              <div>
                <p className="text-xs mb-1">Approvers</p>
                <select
                  className="w-full border rounded-md h-8 px-2 text-xs"
                  value={approver}
                  onChange={(e) => setApprover(e.target.value)}
                >
                  {defaultApprovers.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>

              {/* Applies To */}
              <div>
                <p className="text-xs mb-1">Task applies to</p>
                <select
                  className="w-full border rounded-md h-8 px-2 text-xs"
                  value={appliesTo}
                  onChange={(e) => setAppliesTo(e.target.value)}
                >
                  <option>All Employees</option>
                  <option>Department</option>
                  <option>Location</option>
                  <option>Worker Type</option>
                  <option>Business Unit</option>
                  <option>Job Title</option>
                </select>
              </div>

              {/* Extra Options */}
              <div className="border-t pt-3 space-y-2">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={checklistEnabled}
                    onChange={() => setChecklistEnabled(!checklistEnabled)}
                  />
                  Add Checklist
                </label>

               {checklistEnabled && (
  <div className="space-y-2 mt-2">
    {checklistItems.map((item, index) => (
      <div key={index} className="flex items-center gap-2">
        <input
          type="text"
          value={item.text}
          onChange={(e) => updateChecklistText(index, e.target.value)}
          placeholder={`Checklist item ${index + 1}`}
          className={`border rounded-md h-8 px-2 text-xs flex-1 ${
            item.finalized ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
          }`}
          disabled={item.finalized} // Disable input when finalized
        />
        {!item.finalized && (
          <button
            type="button"
            className="text-green-600 hover:text-green-800"
            onClick={() => finalizeChecklistItem(index)}
          >
            ✔
          </button>
        )}
        {item.finalized && (
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setChecklistItems(prev =>
              prev.map((itm, i) => i === index ? { ...itm, finalized: false } : itm)
            )}
          >
            ✎
          </button>
        )}
        <button
          type="button"
          className="text-red-600 hover:text-red-800"
          onClick={() => removeChecklistItem(index)}
        >
          ❌
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={addChecklistItem}
      className="flex items-center gap-1 text-blue-600 text-xs"
    >
      <Plus size={12} /> Add Item
    </button>
  </div>
)}


                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={sendReminder}
                    onChange={() => setSendReminder(!sendReminder)}
                  />
                  Send reminder emails to assignees
                </label>
              </div>
            </div>

            <div className="border-t p-3 flex justify-end gap-2">
              <button
                className="border rounded-md h-8 px-3 text-xs text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white h-8 px-3 text-xs rounded-md hover:bg-blue-700"
                onClick={handleCreate}
              >
                Create Task
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
