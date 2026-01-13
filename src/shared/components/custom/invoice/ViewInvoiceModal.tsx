"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InvoiceProps {
  open: boolean;
  onClose: () => void;
  data?: {
    fromGST?: string;
    toGST?: string;
    invoiceDate?: string;
    dueDate?: string;
    items?: { name: string; qty: number; price: number }[];
    status?: "Pending" | "Paid";
  };
}

export default function InvoiceModal({ open, onClose, data }: InvoiceProps) {
  const subtotal = data?.items?.reduce((acc, item) => acc + item.qty * item.price, 0) ?? 0;
  const amountPaid = data ? subtotal : 0;
  const totalDue = data ? subtotal - amountPaid : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-4 rounded-xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex  items-center text-base font-medium text-gray-800">
            <span>Invoice</span>
        
          </DialogTitle>
        </DialogHeader>

        {/* QR + Invoice Number */}
        <div className="flex justify-between items-center  text-sm text-gray-600">

            <div className="flex flex-col">
                <div>- {data ? "INV-001" : "NaN"}</div>
              <span
              className={`text-sm px-2 py-0.5 rounded ${
                data?.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {data?.status ?? "Pending"}
            </span>
            </div>
          
          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-[10px]">
            QR
          </div>
        </div>

        {/* From / To */}
        <div className="flex justify-between my-2 text-sm text-gray-700">
          <div>
            <p className="font-medium">From</p>
            <p className="text-gray-500">GST: {data?.fromGST ?? ""}</p>
          </div>
          <div>
            <p className="font-medium">To</p>
            <p className="text-gray-500">GST: {data?.toGST ?? ""}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex justify-between border rounded-md px-1 text-xs text-gray-600 bg-gray-50">
          <p>
            <span className="font-small text-xs">Invoice Date:  {data?.invoiceDate ?? "Invalid Date"}</span>{" "}
           
          </p>
          <p>
            <span className="font-small text-xs">Due Date:  {data?.dueDate ?? "Invalid Date"}</span>{" "}
           
          </p>
        </div>

        {/* Item Table */}
        <div className="">
          <p className="font-small text-sm mb-2">Item Details</p>
          <table className="w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-2 text-left">Item</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.length ? (
                data.items.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 text-center">{item.qty}</td>
                    <td className="p-2 text-right">₹{item.price}</td>
                    <td className="p-2 text-right">₹{item.qty * item.price}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2">-</td>
                  <td className="p-2 text-center">00</td>
                  <td className="p-2 text-right">NaN</td>
                  <td className="p-2 text-right">0</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-3 text-sm text-gray-700">
          <div className="space-y-1 text-right">
            <p className="text-xs">Subtotal: ₹{subtotal}</p>
            <p className="text-xs">Amount Paid: ₹{amountPaid}</p>
            <p className="font-medium text-blue-600 text-xs">Total Due: ₹{totalDue}</p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-[11px] mt-4">
          This is a computer generated invoice and does not require any physical
          signature.
        </p>
      </DialogContent>
    </Dialog>
  );
}
