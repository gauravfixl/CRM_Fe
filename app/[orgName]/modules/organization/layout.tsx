"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"
import { SmallCard } from "@/components/custom/SmallCard" // Example small summary card
import { FlatCard } from "@/components/custom/FlatCard"

export default function OrganizationLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // show side panels only for "all" page
  const showPanels = pathname?.endsWith("/all-org")

  const leftPanel = showPanels ? (
    <div className="space-y-4">
      <FlatCard className="w-full">
        <p >Organization Summary</p>
        <p className="text-sm text-gray-500">Active: 12</p>
        <p className="text-sm text-gray-500">Inactive: 3</p>
      </FlatCard>

      <FlatCard className="w-full">
        <p >Usage</p>
        <p className="text-sm text-gray-500">Seats: 25 / 30</p>
        <p className="text-sm text-gray-500">Storage: 80%</p>
      </FlatCard>
    </div>
  ) : undefined

  const rightPanel = showPanels ? (
    <div className="space-y-4">
      <CustomOptionsDropdown
        title="Organization Options"
        options={[
          { label: "Create Organization", value: "create" },
          { label: "Export Data", value: "export" },
          { label: "Manage Roles", value: "roles" },
        ]}
        onSelect={() => { }}
      />
      <RecentActivityPanel title="Recent Activity">
        <ul className="list-disc pl-5 space-y-1">
          <li>New org "Acme Corp" created</li>
          <li>Role updated for John Doe</li>
          <li>Storage usage increased by 5%</li>
        </ul>
      </RecentActivityPanel>
    </div>
  ) : undefined

  return (
    <AppLayout leftPanel={leftPanel} rightPanel={rightPanel}>
      {children}
    </AppLayout>
  )
}
