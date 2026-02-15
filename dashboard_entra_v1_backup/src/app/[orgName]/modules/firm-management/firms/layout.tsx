"use client"

import { ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useModule } from "@/app/context/ModuleContext"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"
import { FlatCard } from "@/components/custom/FlatCard"

export default function FirmLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { setLeftPanel, setRightPanel } = useModule()

  useEffect(() => {
    const isFirmsPage = pathname?.endsWith("/firms")
    const isDetailPage = pathname?.includes("/firms/")

    if (isFirmsPage || isDetailPage) {
      if (isFirmsPage) {
        setLeftPanel(
          <div className="space-y-4">
            <FlatCard className="w-full">
              <p className="text-sm">Firm Summary</p>
              <p className="text-sm text-gray-500">Active: 18</p>
              <p className="text-sm text-gray-500">Inactive: 5</p>
            </FlatCard>

            <FlatCard className="w-full">
              <p className="text-sm">Financial Overview</p>
              <p className="text-sm text-gray-500">Invoices: 230</p>
              <p className="text-sm text-gray-500">Pending: 45</p>
            </FlatCard>
          </div>
        )
      } else {
        setLeftPanel(undefined)
      }

      setRightPanel(
        <div className="space-y-4">
          <CustomOptionsDropdown
            title="Firm Options"
            options={[
              { label: "Create Firm", value: "create" },
              { label: "Export Firm Data", value: "export" },
              { label: "Manage Firm Roles", value: "roles" },
            ]}
            onSelect={() => { }}
          />
          <RecentActivityPanel title="Recent Firm Activity">
            <ul className="list-disc pl-5 space-y-1">
              <li>New firm "Alpha Traders" created</li>
              <li>Invoice #123 marked as paid</li>
              <li>Firm "XYZ Pvt Ltd" deactivated</li>
            </ul>
          </RecentActivityPanel>
        </div>
      )
    } else {
      setLeftPanel(undefined)
      setRightPanel(undefined)
    }

    return () => {
      setLeftPanel(undefined)
      setRightPanel(undefined)
    }
  }, [pathname, setLeftPanel, setRightPanel])

  return <>{children}</>
}
