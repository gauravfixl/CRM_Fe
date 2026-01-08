import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function InvoiceForm({ initialData, mode }: { initialData?: any, mode?: "copy" | "create" }) {
  const addInvoice = useAppStore((state) => state.addInvoice)
  const navigate = useRouter()
  const [formData, setFormData] = useState(initialData || {})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addInvoice(formData) // ✅ this creates a NEW invoice in the store
    navigate.push("/dashboard/invoices") // ✅ go back to invoices list
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Example inputs */}
      <input
        type="text"
        value={formData.clientName || ""}
        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
        placeholder="Client Name"
      />
      <input
        type="number"
        value={formData.amount || ""}
        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
        placeholder="Amount"
      />
      <button type="submit">
        {mode === "copy" ? "Create Copy" : "Create Invoice"}
      </button>
    </form>
  )
}
