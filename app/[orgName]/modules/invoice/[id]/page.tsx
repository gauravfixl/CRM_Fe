"use client"

import { useParams, useRouter } from "next/navigation"
import { CustomButton } from "@/components/custom/CustomButton"
import { FlatCard, FlatCardContent } from "@/components/custom/FlatCard"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { RecordPaymentModal } from "@/components/invoice/RecordPaymentModal"
import { useState, useEffect, useRef } from "react"
import { getInvoiceById, draftToInvoice, cancelInvoice, restoreCancelledInvoice, recordPayment } from "@/hooks/invoiceHooks"
import InvoiceOptions from "@/components/custom/CustomInvoiceOptions"
import ReminderModal from "@/components/custom/invoice/ReminderModal"
import { showSuccess, showError } from "@/utils/toast"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Overdue": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "Draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export default function InvoiceDetailsPage() {
  const setCopiedInvoice = useAppStore((state) => state.setCopiedInvoice)
  const router = useRouter()
  const params = useParams()
  const componentRef = useRef<HTMLDivElement>(null)

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false)
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showReminder, setShowReminder] = useState(false)
  const [orgName, setOrgName] = useState("")
  const [hideStatus, setHideStatus] = useState(false)

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName")
    if (storedOrg) setOrgName(storedOrg)
  }, [])

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const response = await getInvoiceById(id);
        setInvoice(response.data.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchInvoice();
  }, [params.id]);

  const handleConvertDraft = async () => {
    try {
      if (!invoice?._id) return
      await draftToInvoice(invoice._id)
      setInvoice((prev: any) => ({ ...prev, draft: false, status: "Pending" }))
      showSuccess("Draft converted to Invoice!")
    } catch (error) {
      console.error("Error converting draft:", error)
      showError("Failed to convert draft")
    }
  }

  const savePayment = async (form: any, id: string) => {
    setLoading(true)
    try {
      const res = await recordPayment(form, id)
      setInvoice(res.data.data)
      if (res.data.msg) showSuccess(res.data.msg)
    } catch (err: any) {
      showError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyInvoice = () => {
    if (!invoice) return
    setCopiedInvoice(invoice)
    router.push(`/${orgName}/modules/invoice/copy`)
  }

  const handleCancelInvoice = async () => {
    try {
      await cancelInvoice(invoice._id)
      setInvoice((prev: any) => ({ ...prev, cancel: true, status: "Cancelled" }))
      showSuccess("Invoice has been cancelled ✅")
    } catch (err) {
      console.error("Cancel invoice failed", err)
      showError("❌ Failed to cancel invoice")
    }
  }

  const handleRestoreInvoice = async () => {
    try {
      await restoreCancelledInvoice(invoice._id)
      setInvoice((prev: any) => ({ ...prev, cancel: false, status: "Pending" }))
      showSuccess("Invoice has been restored ✅")
    } catch (err) {
      console.error("Restore invoice failed", err)
      showError("❌ Failed to restore invoice")
    }
  }

  if (!invoice && !loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-xl font-bold">Invoice Not Found</h1>
          <p className="text-muted-foreground">The invoice you're looking for doesn't exist.</p>
          <CustomButton asChild className="mt-4">
            <Link href={`/${orgName}/modules/invoice/all`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
            </Link>
          </CustomButton>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[90vh] bg-gray-50 overflow-y-auto hide-scrollbar">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CustomButton variant="outline" size="sm" asChild>
              <Link href={`/${orgName}/modules/invoice/all`} className="flex items-center">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Link>
            </CustomButton>
            <div>
              <h2 className="text-lg font-semibold">Invoice Details</h2>
              <p className="text-sm text-gray-600">{invoice?.invoiceNumber}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-3">
            <FlatCard className="shadow-lg">
              <FlatCardContent className="p-6">
                <div ref={componentRef}>
                  <div className="flex justify-between items-start">
                    <div className="w-28 h-20 flex items-center">
                      <img src={invoice?.firm?.logo || "/placeholder-logo.png"} alt="logo" className="h-full object-contain" />
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded text-xs">QR Code</div>
                      <div className="flex flex-col items-start justify-between">
                        <h3 className="text-lg font-semibold">Invoice</h3>
                        <p className="text-sm">{invoice?.invoiceNumber}</p>
                        {!hideStatus && (
                          <Badge className={getStatusColor(invoice?.status)}>{invoice?.status}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr className="my-2 border-gray-300" />

                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-800">From</h4>
                      <p className="font-medium">{invoice?.firm?.name}</p>
                      <p className="text-gray-600">{invoice?.firm?.email}</p>
                      <p className="text-gray-600">GST: {invoice?.firm?.taxId}</p>
                      <p className="text-gray-600">{invoice?.firm?.address?.address1}</p>
                      <p className="text-gray-600">{invoice?.firm?.address?.city}, {invoice?.firm?.address?.state}</p>
                    </div>
                    <div className="text-right">
                      <h4 className="font-semibold mb-1 text-gray-800">To</h4>
                      <p className="font-medium">{invoice?.client?.firstName}</p>
                      <p className="text-gray-600">{invoice?.client?.email}</p>
                      <p className="text-gray-600">GST: {invoice?.client?.taxId}</p>
                      <p className="text-gray-600">{invoice?.client?.address?.address1}</p>
                      <p className="text-gray-600">{invoice?.client?.address?.city}, {invoice?.client?.address?.country}</p>
                    </div>
                  </div>

                  <div className="flex justify-between border rounded-md p-2 my-4 text-xs text-gray-700">
                    <p><span className="font-semibold">Invoice Date:</span> {invoice?.invoiceDate}</p>
                    <p><span className="font-semibold">Due Date:</span> {invoice?.dueDate}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-xs">Item Details</h4>
                    <div className="border rounded-lg overflow-hidden text-sm">
                      <div className="bg-primary text-white grid grid-cols-4 gap-2 p-2 font-medium">
                        <div>Item</div>
                        <div className="text-center">Qty</div>
                        <div className="text-center">Price</div>
                        <div className="text-center">Amount</div>
                      </div>
                      {invoice?.items?.map((item: any) => (
                        <div key={item.id} className="grid grid-cols-4 gap-2 p-2 border-b last:border-b-0">
                          <div>{item.itemName}</div>
                          <div className="text-center">{item.quantity}</div>
                          <div className="text-center">{item.unitPrice}</div>
                          <div className="text-center">{item.amount.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mb-6 text-sm">
                    <div className="w-56 space-y-1">
                      <div className="flex justify-between"><span>Total</span><span>INR {invoice?.total?.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Amount Paid</span><span>INR {invoice?.amountPaid?.toFixed(2)}</span></div>
                      <div className="flex justify-between font-semibold border-t pt-1"><span>Total Due</span><span>INR {invoice?.dueAmount?.toFixed(2)}</span></div>
                    </div>
                  </div>

                  {(invoice?.notes || invoice?.terms) && (
                    <div className="space-y-2 text-sm">
                      {invoice.notes && (<div><h4 className="font-medium">Remark:</h4><p className="text-gray-600">{invoice.notes}</p></div>)}
                      {invoice.terms && (<div><h4 className="font-medium">Note:</h4><p className="text-gray-600">{invoice.terms}</p></div>)}
                    </div>
                  )}
                </div>
              </FlatCardContent>
            </FlatCard>
          </div>

          <div className="space-y-4">
            <InvoiceOptions
              orgName={orgName}
              onRestoreInvoice={handleRestoreInvoice}
              onCopyInvoice={handleCopyInvoice}
              invoiceRef={componentRef}
              onCancelInvoice={handleCancelInvoice}

              formData={invoice}
              onRecordPayment={() => setPaymentModalOpen(true)}
              isCreating={false}
              onAddReminder={() => setShowReminder(true)}
              onConvertDraft={handleConvertDraft}
              hideStatus={hideStatus}
              onToggleHideStatus={setHideStatus}
              currency="INR"
              allCurrencies={[{ id: 0, name: "INR", value: "₹" }, { id: 1, name: "USD", value: "$" }]}


              onSaveDraft={() => { }}
              setCurrency={() => { }}
              onRecurring={() => { }}
            />
            <ReminderModal open={showReminder} invoice={invoice} onClose={() => setShowReminder(false)} onSave={() => setShowReminder(false)} />
            <RecordPaymentModal
              open={isPaymentModalOpen}
              onClose={() => setPaymentModalOpen(false)}
              invoice={invoice}
              onSave={(formData: any) => savePayment(formData, invoice._id)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
