// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"

// const items = [
//   { href: "/hrmcubicle", label: "Home", icon: "🏠" },
//   { href: "/hrmcubicle/me", label: "Me", icon: "👤" },
//   { href: "/hrmcubicle/inbox", label: "Inbox", icon: "📥" },
//   { href: "/hrmcubicle/my-team", label: "My Team", icon: "👥" },
//   { href: "/hrmcubicle/my-finances", label: "My Finances", icon: "💲" },
//   { href: "/hrmcubicle/org", label: "Org", icon: "🏢" },
//   { href: "/hrmcubicle/engage", label: "Engage", icon: "💬" },
//   { href: "/hrmcubicle/hire", label: "Hire", icon: "🧩" },
//     { href: "/hrmcubicle/timeattend", label: "Time Attend", icon: "🧩" },
// ]

// export function Sidebar() {
//   const pathname = usePathname()
//   return (
//     <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-56 shrink-0 border-r bg-sidebar text-sidebar-foreground md:block">
//       <div className="flex flex-col gap-2 p-3">
//         {items.map((it) => {
//           const active = pathname === it.href
//           return (
//             <Link
//               key={it.href}
//               href={it.href}
//               className={cn(
//                 "flex items-center gap-3 rounded-md px-3 py-2 text-sm  transition-colors",
//                 active
//                   ? "bg-primary text-white"
//                   : "text-primary hover:bg-primary hover:text-white",
//               )}
//             >
//               <span aria-hidden className="grid h-5 w-5 place-items-center">
//                 {it.icon}
//               </span>
//               <span className="truncate">{it.label}</span>
//             </Link>
//           )
//         })}
//       </div>
//     </aside>
//   )
// }


"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"

// Sidebar menu structure
const items = [
  {
    label: "Home",
    icon: "🏠",
    href: "/hrmcubicle",
  },
  {
    label: "Me",
    icon: "👤",
    href: "/hrmcubicle/me",
  },
  {
    label: "Inbox",
    icon: "📥",
    href: "/hrmcubicle/inbox",
  },
  {
    label: "My Team",
    icon: "👥",
    href: "/hrmcubicle/my-team",
    subitems: [
      { label: "Team Overview", href: "/hrmcubicle/my-team" },
      { label: "Attendance", href: "/hrmcubicle/attendance" },
      { label: "Performance", href: "/hrmcubicle/performance" },
    ],
  },
  {
    label: "My Finances",
    icon: "💲",
    href: "/hrmcubicle/my-finances",
    subitems: [
      { label: "Payslips", href: "/hrmcubicle/my-finances/payslips" },
      { label: "Reimbursements", href: "/hrmcubicle/my-finances/reimbursements" },
    ],
  },
  {
    label: "Org",
    icon: "🏢",
    href: "/hrmcubicle/org",
    subitems: [
      { label: "Dashboard", href: "/hrmcubicle/org" },
      { label: "Employees", href: "/hrmcubicle/org/employees" },
      { label: "Onboarding", href: "/hrmcubicle/org/onboarding" },
    ],
  },
  {
    label: "Engage",
    icon: "💬",
    href: "/hrmcubicle/engage",
  },
  {
    label: "Hire",
    icon: "🧩",
    href: "/hrmcubicle/hire",
    subitems: [
      { label: "Job Openings", href: "/hrmcubicle/hire/openings" },
      { label: "Candidates", href: "/hrmcubicle/hire/candidates" },
      { label: "Interviews", href: "/hrmcubicle/hire/interviews" },
    ],
  },
  {
    label: "Time & Attend",
    icon: "⏱️",
    href: "/hrmcubicle/timeattend",
    subitems: [
      { label: "Dashboard", href: "/hrmcubicle/timeattend" },
      { label: "Approvals", href: "/hrmcubicle/timeattend/approvals" },
      { label: "Shifts/Weekly Off and Holidays", href: "/hrmcubicle/timeattend/shifts" },
      { label: "Shift Allowance", href: "/hrmcubicle/timeattend/shiftallowance" },
      { label: "Attendance Tracking", href: "/hrmcubicle/timeattend/attendance" },
      { label: "Overtime", href: "/hrmcubicle/timeattend/overtime" },
      { label: "Leave", href: "/hrmcubicle/leave" },
      { label: "Reports", href: "/hrmcubicle/timeattend/reports" },
      { label: "Settings", href: "/hrmcubicle/timeattend/settings" },

    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <aside className="hidden h-full w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground md:block overflow-x-hidden overflow-y-auto hide-scrollbar">
      <div className="flex flex-col gap-2 p-3">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            item.subitems?.some((sub) => pathname === sub.href)

          return (
            <div key={item.label}>
              <button
                onClick={() => item.subitems && toggleSection(item.label)}
                className={cn(
                  "flex w-full items-center hover:text-white justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary text-white "
                    : "text-primary hover:bg-primary hover:text-white"
                )}
              >
                {item.subitems ? (<div className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>) : (
                  <Link href={item.href} className="flex items-center gap-3 hover:text-white">
                    <span className="grid h-5 w-5 place-items-center">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>)}
                {item.subitems && (
                  <span>
                    {openSections[item.label] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                )}
              </button>

              {/* Subitems */}
              {item.subitems && openSections[item.label] && (
                <div className="ml-8 mt-1 flex flex-col gap-1 border-l border-primary/20 pl-3">
                  {item.subitems.map((sub) => {
                    const subActive = pathname === sub.href
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "block rounded-md px-2 py-1 text-sm transition-colors",
                          subActive
                            ? "bg-primary text-white"
                            : "text-primary hover:bg-primary hover:text-white"
                        )}
                      >
                        {sub.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
