// "use client"

// import { useState, useMemo, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectValue,
//   SelectItem,
// } from "@/components/ui/select"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Search } from "lucide-react"

// interface Candidate {
//   id: string
//   name: string
//   role: string
//   dept: string
//   location: string
//   joiningDate: string
//   contact: string
//   email: string
//   lastTouch: string
//   tasks: string
// }

// interface NewJoinersPageProps {
//   candidates: Candidate[]
// }

// export default function NewJoinersPage({ candidates: initialCandidates }: NewJoinersPageProps) {
//   const today = new Date()
//   const [filter, setFilter] = useState("Pending")
//   const [selectedIds, setSelectedIds] = useState<string[]>([])
//   const [search, setSearch] = useState("")
//   const [candidates, setCandidates] = useState(initialCandidates)

//   // 🧩 Log incoming props and internal state
//   useEffect(() => {
//     console.log("🔹 Initial candidates received:", initialCandidates)
//   }, [initialCandidates])

//   useEffect(() => {
//     console.log("🟢 Filter changed:", filter)
//   }, [filter])

//   useEffect(() => {
//     console.log("🟡 Search changed:", search)
//   }, [search])

//   useEffect(() => {
//     console.log("🔵 Selected IDs updated:", selectedIds)
//   }, [selectedIds])

//   useEffect(() => {
//     console.log("🟣 Candidates state updated:", candidates)
//   }, [candidates])

//   // Helper to get days difference
//   const daysFromToday = (dateStr: string) => {
//     const d = new Date(dateStr)
//     const diffTime = d.getTime() - today.getTime()
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
//     console.log(`📅 Days from today for ${dateStr}:`, diffDays)
//     return diffDays
//   }

//   // Filter + Search logic
//   const filtered = useMemo(() => {
//     console.log("🔍 Running filter + search logic...")

//     let list = candidates.filter((c) =>
//       c.name.toLowerCase().includes(search.toLowerCase())
//     )

//     if (filter === "Today") list = list.filter((c) => daysFromToday(c.joiningDate) === 0)
//     else if (filter === "Tomorrow") list = list.filter((c) => daysFromToday(c.joiningDate) === 1)
//     else if (filter === "DayAfter") list = list.filter((c) => daysFromToday(c.joiningDate) === 2)
//     else if (filter === "Later") list = list.filter((c) => daysFromToday(c.joiningDate) > 2)

//     console.log("✅ Filtered candidates list:", list)
//     return list
//   }, [filter, candidates, search])

//   // Selection handlers
//   const handleSelectAll = () => {
//     console.log("🧾 handleSelectAll triggered")
//     if (selectedIds.length === filtered.length) {
//       console.log("❌ Unselecting all")
//       setSelectedIds([])
//     } else {
//       console.log("✅ Selecting all visible candidates")
//       setSelectedIds(filtered.map((c) => c.id))
//     }
//   }

//   const handleSelectOne = (id: string) => {
//     console.log("🔘 handleSelectOne triggered for ID:", id)
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     )
//   }

//   // Actions
//   const handleMarkNoShow = () => {
//     console.log("🚫 handleMarkNoShow triggered for IDs:", selectedIds)
//     setCandidates((prev) => prev.filter((c) => !selectedIds.includes(c.id)))
//     setSelectedIds([])
//   }

//   const handleAddAsEmployee = (id: string) => {
//     console.log("👤 handleAddAsEmployee triggered for ID:", id)
//     setCandidates((prev) => prev.filter((c) => c.id !== id))
//   }

//   return (
//     <div className="p-5 bg-gray-50 min-h-screen text-xs text-gray-800">
//       {/* Header */}
//       <div className="mb-4">
//         <h2 className="text-sm font-semibold">New Joiners</h2>
//         <p className="text-gray-500">
//           Candidates who have accepted the offer and not yet added as employees
//         </p>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-wrap items-center gap-2 mb-3">
//         <Select>
//           <SelectTrigger className="w-36 h-8 border-gray-300 text-xs">
//             <SelectValue placeholder="Department" />
//           </SelectTrigger>
//           <SelectContent className="text-xs">
//             <SelectItem value="customer">Customer Success</SelectItem>
//             <SelectItem value="engineering">Engineering</SelectItem>
//           </SelectContent>
//         </Select>

//         <Select>
//           <SelectTrigger className="w-36 h-8 border-gray-300 text-xs">
//             <SelectValue placeholder="Location" />
//           </SelectTrigger>
//           <SelectContent className="text-xs">
//             <SelectItem value="gujarat">Gujarat</SelectItem>
//             <SelectItem value="hyderabad">Hyderabad</SelectItem>
//           </SelectContent>
//         </Select>

//         <Select>
//           <SelectTrigger className="w-36 h-8 border-gray-300 text-xs">
//             <SelectValue placeholder="Job Title" />
//           </SelectTrigger>
//           <SelectContent className="text-xs">
//             <SelectItem value="product-specialist">Product Specialist</SelectItem>
//             <SelectItem value="software-engineer">Software Engineer</SelectItem>
//           </SelectContent>
//         </Select>

//         <div className="relative ml-auto">
//           <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-gray-400" />
//           <Input
//             placeholder="Search by name"
//             className="pl-7 w-48 h-8 border-gray-300 text-xs"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs value={filter} onValueChange={setFilter} className="mb-3">
//         <TabsList className="bg-transparent space-x-2 border-b border-gray-200">
//           {["Pending", "Today", "Tomorrow", "DayAfter", "Later"].map((t) => (
//             <TabsTrigger
//               key={t}
//               value={t}
//               className={`px-3 py-1 text-xs rounded-none border-b-2 ${
//                 filter === t
//                   ? "border-blue-600 text-blue-600 font-medium"
//                   : "border-transparent text-gray-500"
//               }`}
//             >
//               {t === "DayAfter" ? "Day after" : t}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//       </Tabs>

//       {/* Actions */}
//       <div className="flex items-center justify-between mb-2 text-xs">
//         <div className="flex items-center gap-2">
//           <Checkbox
//             checked={selectedIds.length === filtered.length && filtered.length > 0}
//             onCheckedChange={handleSelectAll}
//           />
//           <span>Select to enable</span>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             className="border-gray-300 text-gray-700 h-7 text-xs"
//             onClick={handleSelectAll}
//           >
//             {selectedIds.length === filtered.length && filtered.length > 0
//               ? "Unselect All"
//               : "Select All"}
//           </Button>
//           <Button
//             variant="outline"
//             className="border-gray-300 text-gray-700 h-7 text-xs"
//             disabled={selectedIds.length === 0}
//             onClick={handleMarkNoShow}
//           >
//             Mark as no show
//           </Button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white border rounded-md overflow-hidden shadow-sm">
//         <table className="w-full text-xs">
//           <thead className="bg-gray-50 text-gray-600 border-b">
//             <tr>
//               <th className="py-2 px-3"></th>
//               <th className="py-2 px-3 text-left">NAME & JOB TITLE</th>
//               <th className="py-2 px-3 text-left">DEPT. & LOCATION</th>
//               <th className="py-2 px-3 text-left">JOINING DATE</th>
//               <th className="py-2 px-3 text-left">TASKS</th>
//               <th className="py-2 px-3 text-left">CONTACT INFO</th>
//               <th className="py-2 px-3 text-right">ACTIONS</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((c) => (
//               <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
//                 <td className="py-2 px-3">
//                   <Checkbox
//                     checked={selectedIds.includes(c.id)}
//                     onCheckedChange={() => handleSelectOne(c.id)}
//                   />
//                 </td>
//                 <td className="py-2 px-3">
//                   <p className="text-blue-600 font-medium cursor-pointer hover:underline text-xs">
//                     {c.name}
//                   </p>
//                   <p className="text-gray-500 text-[11px]">{c.role}</p>
//                 </td>
//                 <td className="py-2 px-3 text-xs">
//                   <p>{c.dept}</p>
//                   <p className="text-[11px] text-gray-500">{c.location}</p>
//                 </td>
//                 <td className="py-2 px-3 text-xs">
//                   <p>{new Date(c.joiningDate).toLocaleDateString("en-GB")}</p>
//                   <p className="text-[11px] text-gray-500">
//                     Last touch {c.lastTouch}
//                   </p>
//                 </td>
//                 <td className="py-2 px-3 text-xs">{c.tasks}</td>
//                 <td className="py-2 px-3 text-xs">
//                   <p>{c.contact}</p>
//                   <p className="text-[11px] text-gray-500">{c.email}</p>
//                 </td>
//                 <td className="py-2 px-3 text-right">
//                   <Button
//                     variant="outline"
//                     className="h-7 text-[11px] px-3 border-blue-600 text-blue-600 hover:bg-blue-50"
//                     onClick={() => handleAddAsEmployee(c.id)}
//                   >
//                     Add as employee
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Footer */}
//       {/* <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
//         <p>
//           Showing {filtered.length} of {candidates.length}
//         </p>
//         <p>Page 1 of 1</p>
//       </div> */}
//     </div>
//   )
// }

"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Candidate {
  id: string
  name: string
  role: string
  dept: string
  location: string
  joiningDate: string
  contact: string
  email: string
  lastTouch: string
  tasks: string
}

interface Employee {
  id: string
  name: string
  joiningDate: string
  location: string
  department: string
}

interface OnboardingGroup {
  id: number
  name: string
  taskCount: number
  stages: string[]
  primaryRule?: string
  primaryRuleValue?: string
  secondaryRule?: string
  secondaryRuleValue?: string
  autoGroup?: "yes" | "no"
  matchingEmployees?: Employee[]
}

interface NewJoinersPageProps {
  candidates: Candidate[]
  onboardingGroups?: OnboardingGroup[]
  onAssignToGroup?: (candidateIds: string[], groupId: number) => void
}

export default function NewJoinersPage({
  candidates: initialCandidates,
  onboardingGroups = [],
  onAssignToGroup,
}: NewJoinersPageProps) {
  const today = new Date()
  const [filter, setFilter] = useState("Pending")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [candidates, setCandidates] = useState(initialCandidates)

  // Modal state
  const [openGroupModal, setOpenGroupModal] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

  // Compute employees matching each group rule automatically
  const getMatchingEmployees = (group: OnboardingGroup): Employee[] => {
    let matched: Employee[] = candidates.map(c => ({
      id: c.id,
      name: c.name,
      joiningDate: c.joiningDate,
      location: c.location,
      department: c.dept
    }))

    if (group.primaryRule && group.primaryRuleValue) {
      matched = matched.filter(emp => {
        if (group.primaryRule === "joiningDate") return emp.joiningDate === group.primaryRuleValue
        if (group.primaryRule === "location") return emp.location.toLowerCase() === group.primaryRuleValue.toLowerCase()
        if (group.primaryRule === "department") return emp.department.toLowerCase() === group.primaryRuleValue.toLowerCase()
        return false
      })
    }

    if (group.secondaryRule && group.secondaryRuleValue) {
      matched = matched.filter(emp => {
        if (group.secondaryRule === "joiningDate") return emp.joiningDate === group.secondaryRuleValue
        if (group.secondaryRule === "location") return emp.location.toLowerCase() === group.secondaryRuleValue.toLowerCase()
        if (group.secondaryRule === "department") return emp.department.toLowerCase() === group.secondaryRuleValue.toLowerCase()
        return true
      })
    }

    return matched
  }

  useEffect(() => {
    // Auto-sync all groups matching employees
    onboardingGroups.forEach(group => {
      if (group.autoGroup === "yes") {
        const updatedMatches = getMatchingEmployees(group)
        group.matchingEmployees = updatedMatches
      }
    })
  }, [candidates, onboardingGroups])

  const daysFromToday = (dateStr: string) => {
    const d = new Date(dateStr)
    const diffTime = d.getTime() - today.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  const filtered = useMemo(() => {
    let list = candidates.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )

    if (filter === "Today") list = list.filter((c) => daysFromToday(c.joiningDate) === 0)
    else if (filter === "Tomorrow") list = list.filter((c) => daysFromToday(c.joiningDate) === 1)
    else if (filter === "DayAfter") list = list.filter((c) => daysFromToday(c.joiningDate) === 2)
    else if (filter === "Later") list = list.filter((c) => daysFromToday(c.joiningDate) > 2)

    return list
  }, [filter, candidates, search])

  const handleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map((c) => c.id))
    }
  }

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleMarkNoShow = () => {
    setCandidates((prev) => prev.filter((c) => !selectedIds.includes(c.id)))
    setSelectedIds([])
  }

  const handleAddAsEmployee = (id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id))
  }

  const handleAssignToGroup = () => {
    if (selectedGroupId === null) return
    if (onAssignToGroup) onAssignToGroup(selectedIds, selectedGroupId)

    // Update group matchingEmployees locally
    const group = onboardingGroups.find(g => g.id === selectedGroupId)
    if (group) {
      const selectedEmployees: Employee[] = candidates
        .filter(c => selectedIds.includes(c.id))
        .map(c => ({
          id: c.id,
          name: c.name,
          joiningDate: c.joiningDate,
          location: c.location,
          department: c.dept
        }))

      group.matchingEmployees = [...(group.matchingEmployees || []), ...selectedEmployees]
    }

    setSelectedIds([])
    setOpenGroupModal(false)
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen text-xs text-gray-800">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold">New Joiners</h2>
        <p className="text-gray-500">
          Candidates who have accepted the offer and not yet added as employees
        </p>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Input
          placeholder="Search by name"
          className="pl-7 w-48 h-8 border-gray-300 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="mb-3">
        <TabsList className="bg-transparent space-x-2 border-b border-gray-200">
          {["Pending", "Today", "Tomorrow", "DayAfter", "Later"].map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className={`px-3 py-1 text-xs rounded-none border-b-2 ${
                filter === t
                  ? "border-blue-600 text-blue-600 font-medium"
                  : "border-transparent text-gray-500"
              }`}
            >
              {t === "DayAfter" ? "Day after" : t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedIds.length === filtered.length && filtered.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span>Select to enable</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 h-7 text-xs"
            onClick={handleSelectAll}
          >
            {selectedIds.length === filtered.length && filtered.length > 0
              ? "Unselect All"
              : "Select All"}
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 h-7 text-xs"
            disabled={selectedIds.length === 0}
            onClick={handleMarkNoShow}
          >
            Mark as no show
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 h-7 text-xs"
            disabled={selectedIds.length === 0}
            onClick={() => setOpenGroupModal(true)}
          >
            Assign to Onboarding Group
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-md overflow-hidden shadow-sm">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
              <th className="py-2 px-3"></th>
              <th className="py-2 px-3 text-left">NAME & JOB TITLE</th>
              <th className="py-2 px-3 text-left">DEPT. & LOCATION</th>
              <th className="py-2 px-3 text-left">JOINING DATE</th>
              <th className="py-2 px-3 text-left">TASKS</th>
              <th className="py-2 px-3 text-left">CONTACT INFO</th>
              <th className="py-2 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 px-3">
                  <Checkbox
                    checked={selectedIds.includes(c.id)}
                    onCheckedChange={() => handleSelectOne(c.id)}
                  />
                </td>
                <td className="py-2 px-3">
                  <p className="text-blue-600 font-medium cursor-pointer hover:underline text-xs">
                    {c.name}
                  </p>
                  <p className="text-gray-500 text-xs">{c.role}</p>
                </td>
                <td className="py-2 px-3 text-xs">
                  <p className="text-xs">{c.dept}</p>
                  <p className="text-xs text-gray-500">{c.location}</p>
                </td>
                <td className="py-2 px-3 text-xs">
                  <p className="text-xs">{new Date(c.joiningDate).toLocaleDateString("en-GB")}</p>
                  <p className="text-xs text-gray-500">
                    Last touch {c.lastTouch}
                  </p>
                </td>
                <td className="py-2 px-3 text-xs">{c.tasks}</td>
                <td className="py-2 px-3 text-xs">
                  <p>{c.contact}</p>
                  <p className="text-xs text-gray-500">{c.email}</p>
                </td>
                <td className="py-2 px-3 text-right">
                  <Button
                    variant="outline"
                    className="h-7 text-[11px] px-3 border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleAddAsEmployee(c.id)}
                  >
                    Add as employee
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign to Group Modal */}
      <Dialog open={openGroupModal} onOpenChange={setOpenGroupModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Selected Candidates to Onboarding Group</DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-xs space-y-2">
            <Select onValueChange={(val) => setSelectedGroupId(Number(val))}>
              <SelectTrigger className="w-full h-8 text-xs border-gray-300">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                {onboardingGroups.map((g) => (
                  <SelectItem key={g.id} value={g.id.toString()}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenGroupModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignToGroup} disabled={selectedGroupId === null}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
