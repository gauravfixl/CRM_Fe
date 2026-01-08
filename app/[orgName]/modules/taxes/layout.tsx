"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import AboutCard from "@/components/custom/AboutCard"
import ContactDetailsCard from "@/components/custom/ContactDetailsCard"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"

interface TaxLayoutProps {
  children: ReactNode
}

export default function TaxLayout({ children }: TaxLayoutProps) {
  const pathname = usePathname()

  // Show panels for /modules/taxes/all or /modules/taxes/:id (alphanumeric)
  const showPanels =
    pathname?.endsWith("/taxes") || /\/modules\/taxes\/[\w-]+$/.test(pathname || "")

  const leftPanel = showPanels ? (
    <div className="space-y-4">
      <AboutCard name="Tax Name" />

      <ContactDetailsCard
        phone="+91 9876543210"
        email="taxdept@example.com"
        address="123 Finance St, Mumbai"
      />

      {/* Optional: Add more summary cards */}
    </div>
  ) : undefined

  const rightPanel = showPanels ? (
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
  ) : undefined

  return (
    <AppLayout leftPanel={leftPanel} rightPanel={rightPanel}>
      {children}
    </AppLayout>
  )
}
