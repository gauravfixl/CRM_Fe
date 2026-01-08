import { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle, CustomDialogFooter } from "@/components/custom/CustomDialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { useState, useEffect } from "react"

export function RecordPaymentModal({ open, onClose, invoice, onSave }: any) {
  console.log("[RecordPaymentModal] invoice received:", invoice)

  const [amount, setAmount] = useState(0)
  const [datePaid, setDatePaid] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [note, setNote] = useState("")
  const [chequeNo, setChequeNo] = useState("")

  // ✅ Update amount whenever invoice changes
  useEffect(() => {
    if (invoice) {
      console.log("[useEffect] Updating amount from invoice.amountPaid:", invoice.amountPaid)
      setAmount(invoice.amountPaid)
    }
  }, [invoice])

  if (!invoice) {
    console.log("[RecordPaymentModal] No invoice, returning null")
    return null
  }

  const totalDue = invoice?.dueAmount
  const remainingAfterPay = totalDue - Number(amount || 0)

  console.log("[Render] totalDue:", totalDue)
  console.log("[Render] current amount state:", amount)
  console.log("[Render] remaining after pay:", remainingAfterPay)

  return (
    <CustomDialog open={open} onOpenChange={onClose}>
      <CustomDialogContent className="h-[90vh] overflow-y-auto hide-scrollbar">
        <CustomDialogHeader>
          <CustomDialogTitle className="text-xs font-semibold">Record Payment</CustomDialogTitle>
        </CustomDialogHeader>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-y-1 text-sm">
          <span className="font-small">Invoice No:</span>
          <span>{invoice.invoiceNumber || "-"}</span>

          <span className="font-small">Total Amount:</span>
          <span>₹ {invoice.total?.toFixed(2) || "0.00"}</span>

          <span className="font-small">Amount Paid:</span>
          <span>₹ {invoice.paidAmount?.toFixed(2) || "0.00"}</span>

          <span className="font-small text-red-600">Due Amount:</span>
          <span className="text-red-600">₹ {totalDue.toFixed(2)}</span>
        </div>

        <div className="mt-2 text-blue-600 font-small">
          Grand Total: ₹ {invoice.grandTotal?.toFixed(2) || invoice.amount?.toFixed(2)}
        </div>

        {/* Form Fields */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="block mb-1 text-sm font-small">Amount Paid</label>
            <CustomInput
              type="number"
              value={amount}
              min={0}
              max={totalDue}
              onChange={(e) => {
                console.log("[Input] amount changed to:", e.target.value)
                setAmount(e.target.value)
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-small">Date Paid</label>
            <CustomInput
              type="date"
              value={datePaid}
              onChange={(e) => {
                console.log("[Input] datePaid changed to:", e.target.value)
                setDatePaid(e.target.value)
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-small">Payment Method</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={paymentMethod}
              onChange={(e) => {
                console.log("[Input] paymentMethod changed to:", e.target.value)
                setPaymentMethod(e.target.value)
              }}
            >
              <option value="">Select Payment Method</option>
              <option value="Cheque">Cheque</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="card">Credit/Debit Card</option>
            </select>
          </div>

          {paymentMethod === "Cheque" && (
            <div>
              <label className="block mb-1 text-sm font-medium">Cheque No.</label>
              <CustomInput
                type="text"
                value={chequeNo}
                onChange={(e) => {
                  console.log("[Input] chequeNo changed to:", e.target.value)
                  setChequeNo(e.target.value)
                }}
                placeholder="Enter cheque number"
              />
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-small">Transaction ID</label>
            <CustomInput
              type="text"
              value={transactionId}
              onChange={(e) => {
                console.log("[Input] transactionId changed to:", e.target.value)
                setTransactionId(e.target.value)
              }}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-small">Note</label>
            <textarea
              className="w-full border rounded-md px-3 py-2"
              rows={3}
              value={note}
              onChange={(e) => {
                console.log("[Input] note changed to:", e.target.value)
                setNote(e.target.value)
              }}
              placeholder="Enter note"
            />
          </div>
        </div>

        {/* Footer */}
        <CustomDialogFooter className="mt-4">
          <CustomButton variant="outline" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton
            onClick={() => {
              const totalAmount = invoice?.total || 0
              const alreadyPaid = invoice?.amountPaid || 0
              const newPaid = alreadyPaid + Number(amount)

              console.log("[Save] totalAmount:", totalAmount)
              console.log("[Save] alreadyPaid:", alreadyPaid)
              console.log("[Save] entered amount:", amount)
              console.log("[Save] new total paid:", newPaid)

              let status = "Pending"
              if (newPaid === totalAmount) {
                status = "Paid"
              } else if (newPaid > totalAmount) {
                status = "Overpaid"
              }

              console.log("[Save] computed status:", status)

              const payload = {
                amountPaid: Number(amount),
                datePaid,
                paymentMethod,
                transactionId,
                chequeNo: paymentMethod === "Cheque" ? chequeNo : null,
                note,
                status,
              }

              console.log("[Save] Final payload being sent to parent:", payload)

              onSave(payload)
              onClose()
            }}
          >
            Save Payment
          </CustomButton>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  )
}
