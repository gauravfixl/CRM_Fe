"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface Candidate {
    id: string
  name: string
  role: string
  pendingSince: string
  department: string
  location: string
  email: string
  mobile: string
}

interface PreboardingDrawerProps {
  open: boolean
  onClose: () => void
  candidate: Candidate | null
 onInvite: (id: string) => void // 👈 NEW
}

export default function PreboardingDrawer({ open, onClose, candidate,onInvite }: PreboardingDrawerProps) {
    console.log("Candidate in Drawer:", candidate) // Debugging line
  const initialTasks = [
    { name: "Submit PhotoID - IN", due: "Due today", stage: "Before offer release", owner: "Candidate", checked: true },
    { name: "Submit HSC Certificates", due: "Due today", stage: "Before offer release", owner: "Candidate", checked: true },
    { name: "Submit previous experience", due: "Due today", stage: "Before offer release", owner: "Candidate", checked: true },
  ]

  const [tasks, setTasks] = useState(initialTasks)
  const [email, setEmail] = useState(candidate?.email || "")
  const [mobile, setMobile] = useState(candidate?.mobile || "")

  useEffect(() => {
    if (candidate) {
      setEmail(candidate.email)
      setMobile(candidate.mobile)
      setTasks(initialTasks)
    }
  }, [candidate])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto"
  }, [open])

  const toggleTask = (index: number) => {
    setTasks(prev => prev.map((t, i) => (i === index ? { ...t, checked: !t.checked } : t)))
  }

  const handleInvite = () => {
    if (candidate) {
      onInvite(candidate.id) // 👈 call parent handler
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && candidate && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            className="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-2xl border-l flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="p-4 border-b">
              <h2 className="text-sm font-semibold mb-3">Start preboarding</h2>

              <div className="flex items-start gap-3 bg-gray-50 border p-3 rounded-md">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 font-semibold text-green-700 text-xs">
                  {candidate.name.charAt(0)}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-xs">{candidate.name}</p>
                  <p className="text-gray-500 text-xs">{candidate.role}</p>
                </div>
                <div className="text-gray-600 text-right space-y-1">
                  <p className="text-xs">
                    <span className="font-medium text-xs">Pending since:</span> {candidate.pendingSince}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium text-xs">Department:</span> {candidate.department}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium text-xs">Location:</span> {candidate.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 p-5 space-y-6 overflow-y-auto text-xs">
              {/* Contact Details */}
              <section>
                <h4 className="font-medium mb-2 text-xs">Confirm contact details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-500 mb-1 text-xs">Personal email</p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-8 px-2 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1 text-xs">Mobile number</p>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full h-8 px-2 border rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <p className="text-gray-500 mt-2 text-xs">
                  Candidates will receive email/SMS invite to portal on above details to complete tasks.
                </p>
                <button className="text-blue-600 text-xs mt-1 hover:underline">
                  Go to candidate portal setup
                </button>
              </section>

              {/* Assign Tasks */}
              <section>
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium text-xs">Assign tasks</h4>
                  <p className="text-gray-500 text-xs">
                    {tasks.filter((t) => t.checked).length} tasks selected
                  </p>
                </div>
                <div className="border rounded-md divide-y">
                  {tasks.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={t.checked}
                          onChange={() => toggleTask(i)}
                          className="mt-1 accent-blue-600"
                        />
                        <div>
                          <p className="font-medium text-xs">{t.name}</p>
                          <p className="text-gray-500 text-xs">
                            {t.due} • {t.stage}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 text-[11px]">
                          👤
                        </div>
                        <span className="text-xs">{t.owner}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* What Happens Next */}
              <section className="border rounded-md bg-gray-50 p-3">
                <h4 className="font-medium mb-2 text-xs">What happens next?</h4>
                <ul className="space-y-1 text-gray-600">
                  <li className="text-xs">✅ Tasks submitted by candidate can be verified/updated</li>
                  <li className="text-xs">📩 Candidate will be invited to portal to complete the tasks</li>
                  <li className="text-xs">📝 Offer can be created while candidate completes the tasks</li>
                </ul>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t p-3 flex justify-end gap-2">
              <button
                className="h-8 px-3 border rounded-md text-xs text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button  onClick={handleInvite} className="h-8 px-3 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
                Invite Candidate
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
