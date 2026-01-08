// components/custom/InvoicePreviewCard.tsx
"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type InvoicePreviewCardProps = {
  invoiceNumber: string
  status: "Paid" | "Pending" | "Overdue" | "Draft" | "Cancelled"
  invoiceDate: string
  dueDate: string
  client: {
    name: string
    email: string
    address: string
  }
  totalAmount: number
  currency?: string
  className?: string
}

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-800",
  Overdue: "bg-red-100 text-red-700",
  Draft: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-200 text-red-800",
}

export const InvoicePreviewCard: React.FC<InvoicePreviewCardProps> = ({
  invoiceNumber,
  status,
  invoiceDate,
  dueDate,
  client,
  totalAmount,
  currency = "₹",
  className,
}) => {
  return (
    <div
      className={cn(
        "border rounded-lg p-4 bg-white shadow-sm w-full max-w-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h6 className="font-medium text-lg text-blue-700">Invoice</h6>
        <span className="text-sm text-gray-500">{invoiceNumber}</span>
      </div>

      {/* Status */}
      <div className="mb-4">
        <Badge className={cn(statusColors[status] || "bg-gray-100 text-gray-700")}>
          {status}
        </Badge>
      </div>

      {/* Dates */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <div>
          <div className="font-small">Invoice Date:</div>
          <div>{invoiceDate}</div>
        </div>
        <div>
          <div className="font-small">Due Date:</div>
          <div>{dueDate}</div>
        </div>
      </div>

      {/* Client Info */}
      <div className="text-sm text-gray-700 mb-4">
        <div className="font-small mb-1">Bill To:</div>
        <div>Name: {client.name}</div>
        <div>Email: {client.email}</div>
        <div>Address: {client.address}</div>
      </div>

      {/* Total */}
      <div className="text-right text-sm">
        Total: {currency} {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>
  )
}
