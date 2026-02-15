"use client"

import { ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useModule } from "@/app/context/ModuleContext"
import AboutCard from "@/components/custom/AboutCard"
import ContactDetailsCard from "@/components/custom/ContactDetailsCard"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"

interface TaxLayoutProps {
  children: ReactNode
}

export default function TaxLayout({ children }: TaxLayoutProps) {
  const pathname = usePathname()
  const { setLeftPanel, setRightPanel } = useModule()

  useEffect(() => {
    // Show panels for /modules/taxes/all or /modules/taxes/:id (alphanumeric)
    const showPanels = pathname?.endsWith("/taxes") || /\/modules\/taxes\/[\w-]+$/.test(pathname || "")

    if (showPanels) {
      setLeftPanel(
        <div className="space-y-4">
          <AboutCard name="Tax Name" />
          <ContactDetailsCard
            phone="+91 9876543210"
            email="taxdept@example.com"
            address="123 Finance St, Mumbai"
          />
        </div>
      )
      setRightPanel(
        <div className="space-y-4">
          <CustomOptionsDropdown
            title="Tax Actions"
            options={[
              { label: "Add Tax", value: "add" },
              { label: "Export Taxes", value: "export" },
              { label: "Update Tax Rules", value: "update" },
            ]}
            onSelect={() => { }}
          />
          <RecentActivityPanel title="Recent Tax Activity">
            <ul className="list-disc pl-5 space-y-1">
              <li>Tax "GST 18%" created</li>
              <li>Tax "Service Tax" updated</li>
              <li>New tax rule applied for "ABC Corp"</li>
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
