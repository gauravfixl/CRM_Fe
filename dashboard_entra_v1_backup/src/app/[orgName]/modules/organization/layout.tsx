"use client"

import { ReactNode, useEffect } from "react"
import { usePathname, useRouter, useParams } from "next/navigation"
import { useModule } from "@/app/context/ModuleContext"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"
import { FlatCard } from "@/components/custom/FlatCard"

export default function OrganizationLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams() as { orgName: string }
  const { setLeftPanel, setRightPanel } = useModule()

  const handleOptionSelect = (value: string) => {
    if (value === "create") {
      router.push(`/${params.orgName}/modules/firm-management/firms/add`)
    } else if (value === "roles") {
      router.push(`/${params.orgName}/modules/administration/roles`)
    }
  }

  useEffect(() => {
    // show side panels only for "all" page
    const showPanels = pathname?.endsWith("/all-org")

    if (showPanels) {
      setLeftPanel(
        <div className="space-y-4">
          <FlatCard className="w-full">
            <p className="font-semibold text-sm">Organization Summary</p>
            <p className="text-sm text-gray-500">Active: 12</p>
            <p className="text-sm text-gray-500">Inactive: 3</p>
          </FlatCard>

          <FlatCard className="w-full">
            <p className="font-semibold text-sm">Usage</p>
            <p className="text-sm text-gray-500">Seats: 25 / 30</p>
            <p className="text-sm text-gray-500">Storage: 80%</p>
          </FlatCard>
        </div>
      )
      setRightPanel(
        <div className="space-y-4">
          <CustomOptionsDropdown
            title="Organization Options"
            options={[
              { label: "Add New Subsidiary (Firm)", value: "create" },
              { label: "Export Data", value: "export" },
              { label: "Manage Roles", value: "roles" },
            ]}
            onSelect={handleOptionSelect}
          />
          <RecentActivityPanel title="Recent Activity">
            <ul className="list-disc pl-5 space-y-1">
              <li>New org "Acme Corp" created</li>
              <li>Role updated for John Doe</li>
              <li>Storage usage increased by 5%</li>
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
  }, [pathname, setLeftPanel, setRightPanel, params.orgName])

  return <>{children}</>
}
