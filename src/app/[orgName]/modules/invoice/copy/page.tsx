"use client"

import { useAppStore } from "@/lib/store"
import InvoiceForm from "@/components/custom/invoice/InvoiceForm"

export default function CopyInvoicePage() {
  const copiedInvoice = useAppStore((state) => state.copiedInvoice)

  if (!copiedInvoice) return <p>No invoice to copy</p>

  // Strip ID and invoiceNumber so it's treated as "new"
  const prefilledData = {
    ...copiedInvoice,
    id: undefined,
    invoiceNumber: undefined,
    status: "Draft",
    createdAt: undefined,
    updatedAt: undefined,
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Copy Invoice</h2>
      <InvoiceForm initialData={prefilledData} mode="copy" />
    </div>
  )
}
