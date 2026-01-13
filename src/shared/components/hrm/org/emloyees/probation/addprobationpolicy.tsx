// "use client"

// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Card } from "@/components/ui/card"

// export default function AddProbationPolicy({
//   onClose,
//   onSave,
// }: {
//   onClose: () => void
//   onSave: (data: any) => void
// }) {
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     duration: "3",
//     unit: "Months",
//     maxExtension: "2",
//   })

//   const handleChange = (key: string, value: string) =>
//     setForm((prev) => ({ ...prev, [key]: value }))

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <Card className="w-[380px] p-4 text-xs bg-white rounded-md shadow-md">
//         <h2 className="text-sm font-semibold mb-3 border-b pb-2">
//           Add Probation Policy
//         </h2>

//         <div className="space-y-3">
//           <div>
//             <p className="font-medium mb-1 text-gray-700">
//               Probation Policy Name
//             </p>
//             <Input
//               value={form.name}
//               onChange={(e) => handleChange("name", e.target.value)}
//               className="text-xs h-7"
//             />
//           </div>

//           <div>
//             <p className="font-medium mb-1 text-gray-700">Policy Description</p>
//             <Textarea
//               value={form.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//               className="text-xs"
//             />
//           </div>

//           <div>
//             <p className="font-medium mb-1 text-gray-700">
//               Probation Period Duration
//             </p>
//             <div className="flex gap-2 items-center">
//               <Input
//                 value={form.duration}
//                 onChange={(e) => handleChange("duration", e.target.value)}
//                 className="text-xs w-[60px] h-7"
//               />
//               <select
//                 value={form.unit}
//                 onChange={(e) => handleChange("unit", e.target.value)}
//                 className="border rounded px-2 py-1 text-[11px] h-7"
//               >
//                 <option>Months</option>
//                 <option>Weeks</option>
//                 <option>Days</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <p className="font-medium mb-1 text-gray-700">
//               Maximum number of times probation can be extended
//             </p>
//             <div className="flex items-center gap-2">
//               <Input
//                 value={form.maxExtension}
//                 onChange={(e) => handleChange("maxExtension", e.target.value)}
//                 className="text-xs w-[60px] h-7"
//               />
//               <span className="text-gray-600 text-[11px]">times</span>
//             </div>
//           </div>

//           <div className="bg-blue-50 text-blue-700 p-2 rounded text-[11px] border border-blue-100">
//             Additional probation settings can be configured once you create this
//             policy.
//           </div>
//         </div>

//         <div className="flex justify-end gap-2 mt-4">
//           <Button
//             variant="outline"
//             size="sm"
//             className="text-xs h-7 px-3"
//             onClick={onClose}
//           >
//             Cancel
//           </Button>
//           <Button
//             size="sm"
//             className="text-xs h-7 px-3"
//             onClick={() => onSave(form)}
//           >
//             Save
//           </Button>
//         </div>
//       </Card>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

export default function AddProbationPolicy({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (data: any) => void
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "3",
    unit: "Months",
    maxExtension: "2",
  })

  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-[380px] p-4 text-xs bg-white rounded-md shadow-md">
        <h2 className="text-sm font-semibold mb-3 border-b pb-2">
          Add Probation Policy
        </h2>

        <div className="space-y-3">
          <div>
            <p className="font-medium mb-1 text-gray-700">
              Probation Policy Name
            </p>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="text-xs h-7"
            />
          </div>

          <div>
            <p className="font-medium mb-1 text-gray-700">Policy Description</p>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <p className="font-medium mb-1 text-gray-700">
              Probation Period Duration
            </p>
            <div className="flex gap-2 items-center">
              <Input
                value={form.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="text-xs w-[60px] h-7"
              />
              <select
                value={form.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                className="border rounded px-2 py-1 text-[11px] h-7"
              >
                <option>Months</option>
                <option>Weeks</option>
                <option>Days</option>
              </select>
            </div>
          </div>

          <div>
            <p className="font-medium mb-1 text-gray-700">
              Maximum number of times probation can be extended
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={form.maxExtension}
                onChange={(e) => handleChange("maxExtension", e.target.value)}
                className="text-xs w-[60px] h-7"
              />
              <span className="text-gray-600 text-[11px]">times</span>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-700 p-2 rounded text-[11px] border border-blue-100">
            Additional probation settings can be configured once you create this
            policy.
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-3"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs h-7 px-3"
            onClick={() => onSave(form)}
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  )
}
