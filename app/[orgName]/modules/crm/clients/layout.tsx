"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import AboutCard from "@/components/custom/AboutCard"
import ContactDetailsCard from "@/components/custom/ContactDetailsCard"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()

  // Show panels only for main clients page or client detail page
  const showPanels =
    pathname?.endsWith("/clients") || /\/clients\/[\w-]+$/.test(pathname || "")

  const leftPanel = showPanels ? (
    <div className="space-y-4">
      <AboutCard name="Acme Corporation" />
      <ContactDetailsCard
        phone="+91 9876543210"
        email="contact@acme.com"
        address="456 Business St, Mumbai"
      />
    </div>
  ) : undefined

  const rightPanel = showPanels ? (
    <div className="space-y-4">
      <CustomOptionsDropdown
        title="Client Actions"
        options={[
          { label: "Add Client", value: "add" },
          { label: "Export Clients", value: "export" },
          { label: "Assign Account Manager", value: "assign" },
        ]}
        onSelect={() => { }}
      />
      <RecentActivityPanel title="Recent Client Activity">
        <ul className="list-disc pl-5 space-y-1">
          <li>Client "XYZ Corp" added</li>
          <li>Follow-up scheduled with Jane</li>
          <li>Client status updated to "Active"</li>
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
