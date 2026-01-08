"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import AboutCard from "@/components/custom/AboutCard"
import ContactDetailsCard from "@/components/custom/ContactDetailsCard"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"

interface LeadLayoutProps {
  children: ReactNode
}

export default function LeadLayout({ children }: LeadLayoutProps) {
  const pathname = usePathname()

  // Show panels only for main leads page or lead detail page
  const showPanels =
    pathname?.endsWith("/leads") || pathname?.match(/\/leads\/\d+$/)

  const leftPanel = showPanels ? (
    <div className="space-y-4">
      <AboutCard name="John Doe" />
      <ContactDetailsCard
        phone="+91 9876543210"
        email="john.doe@example.com"
        address="123 Business St, Mumbai"
      />
    </div>
  ) : undefined

  const rightPanel = showPanels ? (
    <div className="space-y-4">
      <CustomOptionsDropdown
        title="Lead Actions"
        options={[
          { label: "Add Lead", value: "add" },
          { label: "Export Leads", value: "export" },
          { label: "Assign Owner", value: "assign" },
        ]}
        onSelect={() => { }}
      />
      <RecentActivityPanel title="Recent Lead Activity">
        <ul className="list-disc pl-5 space-y-1">
          <li>Lead "ABC Corp" added</li>
          <li>Follow-up scheduled with John</li>
          <li>Lead status updated to "Qualified"</li>
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
