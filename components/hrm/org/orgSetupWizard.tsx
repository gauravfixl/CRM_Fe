"use client"
import { useState } from "react"
import { ChevronLeft } from "lucide-react"

export default function OrgSetupWizard({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(1)

  const steps = [
    { id: 1, title: "Add Legal Entity", desc: "Used in documents such as pay slips, offer letters etc." },
    { id: 2, title: "Add Organization Structure", desc: "Setup your organizational structure for collaboration." },
    { id: 3, title: "Add Locations", desc: "Define the physical office spaces of your organization." },
  ]

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="flex items-center text-blue-600 text-xs">
          <ChevronLeft className="w-3 h-3 mr-1" /> Back
        </button>
      </div>

      <div className="flex w-full max-w-6xl mx-auto">
        {/* Left stepper */}
        <div className="w-1/3 pr-6">
          <h2 className="text-sm font-semibold mb-3 text-gray-800">Core Setup</h2>
          <div className="space-y-3">
            {steps.map((s) => (
              <div
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`border rounded-md p-2.5 cursor-pointer transition text-xs ${
                  step === s.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{s.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{s.desc}</p>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      step > s.id
                        ? "bg-blue-100 text-blue-600 border border-blue-200"
                        : "text-gray-400 border border-gray-200"
                    }`}
                  >
                    {step > s.id ? "COMPLETED" : step === s.id ? "IN PROGRESS" : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right form area */}
        <div className="w-2/3 bg-white border rounded-md p-5 shadow-sm">
          {step === 1 && <LegalEntityForm />}
          {step === 2 && <OrgStructureForm />}
          {step === 3 && <LocationForm />}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={step === 1}
              onClick={prevStep}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {step === 3 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Step 1: Legal Entity Form ---------- */
function LegalEntityForm() {
  return (
    <div className="space-y-3 text-xs">
      <h3 className="text-sm font-semibold mb-3 text-gray-800">Entity Details</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-gray-600">Entity Name*</label>
          <input type="text" className="w-full border rounded p-1.5 text-xs" />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Legal Name*</label>
          <input type="text" className="w-full border rounded p-1.5 text-xs" />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Trade License Number*</label>
          <input type="text" className="w-full border rounded p-1.5 text-xs" />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Date of Incorporation*</label>
          <input type="date" className="w-full border rounded p-1.5 text-xs" />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Type of Business*</label>
          <select className="w-full border rounded p-1.5 text-xs">
            <option>Private Limited</option>
            <option>Public Limited</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Sector*</label>
          <select className="w-full border rounded p-1.5 text-xs">
            <option>Manufacturing</option>
            <option>IT</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block mb-1 text-gray-600">Nature of Business*</label>
          <select className="w-full border rounded p-1.5 text-xs">
            <option>Automobile</option>
            <option>Services</option>
          </select>
        </div>
      </div>
    </div>
  )
}

/* ---------- Step 2: Organization Structure Form ---------- */
function OrgStructureForm() {
  const [businessType, setBusinessType] = useState("single")
  return (
    <div className="space-y-3 text-xs">
      <h3 className="text-sm font-semibold mb-3 text-gray-800">Setup Organization Structure</h3>
      <div className="flex gap-3">
        <div
          onClick={() => setBusinessType("single")}
          className={`p-2 border rounded cursor-pointer w-1/2 text-center ${
            businessType === "single" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
        >
          <p className="font-medium text-gray-800">Single Business</p>
          <p className="text-[11px] text-gray-500">Single line with one or more locations.</p>
        </div>
        <div
          onClick={() => setBusinessType("multi")}
          className={`p-2 border rounded cursor-pointer w-1/2 text-center ${
            businessType === "multi" ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
        >
          <p className="font-medium text-gray-800">Multiple Business</p>
          <p className="text-[11px] text-gray-500">Multiple entities with departments.</p>
        </div>
      </div>

      <div className="mt-4">
        <label className="block mb-1 text-gray-600">Name of Business Unit</label>
        <input type="text" className="w-full border rounded p-1.5 text-xs" />
      </div>
      <div className="mt-2">
        <label className="block mb-1 text-gray-600">Select Legal Entity</label>
        <select className="w-full border rounded p-1.5 text-xs">
          <option>Core HR</option>
          <option>Core HR UAE</option>
        </select>
      </div>
    </div>
  )
}

/* ---------- Step 3: Location Form ---------- */
function LocationForm() {
  return (
    <div className="space-y-3 text-xs">
      <h3 className="text-sm font-semibold mb-3 text-gray-800">Add Locations</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block mb-1 text-gray-600">Location Name*</label>
          <input type="text" className="w-full border rounded p-1.5 text-xs" />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Timezone*</label>
          <select className="w-full border rounded p-1.5 text-xs">
            <option>Asia/Kolkata</option>
            <option>UTC</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Country*</label>
          <select className="w-full border rounded p-1.5 text-xs">
            <option>India</option>
            <option>UAE</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-600">State*</label>
          <input type="text" className="w-full border rounded p-1.5 text-xs" />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">City*</label>
          <input type="text" className="w-full border rounded p-1.5 text-xs" />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">Zip*</label>
          <input type="text" className="w-full border rounded p-1.5 text-xs" />
        </div>
      </div>
    </div>
  )
}
