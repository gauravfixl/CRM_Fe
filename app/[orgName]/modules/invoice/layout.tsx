"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { InvoicePreviewCard } from "@/components/custom/InvoicePreviewCard"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"

export default function InvoiceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // check if current path ends with "all"
  const showPanels = pathname?.endsWith("/all")

  const leftPanel = showPanels ? (
    <InvoicePreviewCard
      invoiceNumber="INV-001"
      status="Pending"
      invoiceDate="2025-09-01"
      dueDate="2025-09-15"
      client={{
        name: "TechNova Solutions",
        email: "billing@technova.com",
        address: "123 Business St, Mumbai",
      }}
      totalAmount={15000}
    />
  ) : undefined

  const rightPanel = showPanels ? (
    <div className="space-y-4">
      <CustomOptionsDropdown
        title="Invoice Options"
        options={[
          { label: "Create Invoice", value: "create" },
          { label: "Export", value: "export" },
          { label: "Mark Paid", value: "paid" },
        ]}
        onSelect={() => { }}
      />
      <RecentActivityPanel title="Recent Activity">
        <ul className="list-disc pl-5 space-y-1">
          <li>Invoice #123 marked as Paid</li>
          <li>Invoice Draft created</li>
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
