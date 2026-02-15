"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { CustomButton } from "@/components/custom/CustomButton"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomLabel } from "@/components/custom/CustomLabel"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import InvoiceOptions from "@/components/custom/CustomInvoiceOptions"
import { RecordPaymentModal } from "@/components/invoice/RecordPaymentModal"
import RecurringInvoiceModal from "@/components/custom/invoice/RecurringInvoiceModal"
import ReminderModal from "@/components/custom/invoice/ReminderModal"
import { CustomSelect, CustomSelectContent, CustomSelectItem, CustomSelectTrigger, CustomSelectValue } from "@/components/custom/CustomSelect"
import { useToast } from "@/hooks/use-toast"
import { useAppStore, type InvoiceItem } from "@/lib/store"
import { Plus, Trash2 } from 'lucide-react'
import { createInvoice } from "@/hooks/invoiceHooks"
import { getAllFirms } from "@/hooks/firmHooks"
import { getAllClients } from "@/hooks/clientHooks"
import { showError } from "@/utils/toast"
import { type Invoice } from "@/lib/store"
import { Breadcrumb } from "@/components/custom/CustomBreadCrumb"
import { getAllOrgTaxes } from "@/hooks/taxHooks"

export default function CreateInvoicePage() {
  const router = useRouter()
  const params = useParams()
  const firmIdFromUrl = params.id as string
  const { clients, setClients } = useAppStore()
  const { toast } = useToast()

  const [orgName, setOrgName] = useState("")
  const [taxes, setTaxes] = useState<any[]>([])
  const [firms, setFirms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [customFields, setCustomFields] = useState({
    hsn: false,
    sac: false,
    tax: false,
    discount: false,
  })

  const [formData, setFormData] = useState<Invoice>({
    id: "",
    orgId: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    subTotal: 0,
    total: 0,
    status: "Draft",
    amountPaid: 0,
    dueAmount: 0,
    roundOff: 0,
    delete: false,
    cancel: false,
    draft: true,
    incluTax: false,
    partialPay: false,
    allowTip: false,
    recurringInvoice: false,
    items: [{ itemName: "", unitPrice: 0, quantity: 1, amount: 0, taxRate: 0, desc: "", discount: 0 }],
    tax: [],
    taxAmt: [],
    notes: "",
    remark: "",
    gstn: "",
    termsNcondition: [],
    currency: "USD",
    curConvert: "",
    client: { firstName: "", lastName: "", email: "", phone: "", taxId: "", clientFirmName: "", address: { address1: "", address2: "", city: "", state: "", country: "", pinCode: 0 }, client_id: "" },
    firm: { name: "", phone: "", taxId: "", email: "", firmId: "", address: { address1: "", address2: "", city: "", state: "", country: "", pinCode: 0 } },
    payment: [],
    recurringInvoiceObj: { start_date: null, end_date: null },
    __v: 0
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", itemName: "", description: "", quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, amount: 0 }
  ])

  const [totals, setTotals] = useState({ subtotal: 0, totalDiscount: 0, totalTax: 0, total: 0 })
  const [showRecordPayment, setShowRecordPayment] = useState(false)
  const [showRecurring, setShowRecurring] = useState(false)
  const [showReminder, setShowReminder] = useState(false)

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || ""
    setOrgName(storedOrg)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [firmsRes, clientsRes, taxesRes] = await Promise.all([
          getAllFirms(),
          getAllClients(),
          getAllOrgTaxes()
        ])
        const firmsData = firmsRes?.data?.firms || []
        setFirms(firmsData)
        setClients(clientsRes.data.clients)
        const allTaxes = taxesRes?.data?.data?.flatMap((item: any) => item.taxRates) || []
        setTaxes(allTaxes)

        if (firmIdFromUrl) {
          const firm = firmsData.find((f: any) => f._id === firmIdFromUrl)
          if (firm) {
            setFormData(prev => ({
              ...prev,
              firm: {
                name: firm.FirmName,
                phone: firm.phone,
                email: firm.email,
                taxId: firm.gst_no,
                firmId: firm._id,
                address: { address1: firm.add?.address1 || "", address2: firm.address?.address2 || "", city: firm.address?.city || "", state: firm.address?.state || "", country: firm.add?.country || "", pinCode: Number(firm.address?.pinCode) || 0 }
              }
            }))
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [firmIdFromUrl, setClients])

  const toNum = (val: any) => Number(val) || 0

  const calculateTotals = (currentItems: InvoiceItem[]) => {
    const newTotals = currentItems.reduce((acc, item) => {
      const subtotal = toNum(item.unitPrice) * toNum(item.quantity)
      const discount = subtotal * (toNum(item.discount) / 100)
      const taxable = subtotal - discount
      const tax = taxable * (toNum(item.taxRate) / 100)
      acc.subtotal += subtotal
      acc.totalDiscount += discount
      acc.totalTax += tax
      acc.total += taxable + tax
      return acc
    }, { subtotal: 0, totalDiscount: 0, totalTax: 0, total: 0 })
    setTotals(newTotals)
  }

  const updateItem = (id: string, field: string, value: any) => {
    setItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, [field]: value } : item)
      calculateTotals(updated)
      return updated
    })
  }

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), itemName: "", description: "", quantity: 1, unitPrice: 0, taxRate: 0, discount: 0, amount: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      const updated = items.filter(item => item.id !== id)
      setItems(updated)
      calculateTotals(updated)
    }
  }

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c._id === clientId)
    if (client) {
      setFormData(prev => ({
        ...prev,
        client: {
          firstName: client.firstName || "",
          lastName: client.lastName || "",
          email: client.email || "",
          phone: String(client.phone || ""),
          taxId: client.taxId || "",
          clientFirmName: client.clientFirmName || "",
          address: { address1: client.address?.address1 || "", address2: client.address?.address2 || "", city: client.address?.city || "", state: client.address?.state || "", country: client.address?.country || "", pinCode: Number(client.address?.pinCode) || 0 },
          client_id: client._id || ""
        }
      }))
    }
  }

  const handleFirmChange = (firmId: string) => {
    const firm = firms.find(f => f._id === firmId)
    if (firm) {
      setFormData(prev => ({
        ...prev,
        firm: {
          name: firm.FirmName,
          phone: firm.phone,
          email: firm.email,
          taxId: firm.gst_no,
          firmId: firm._id,
          address: { address1: firm.add?.address1 || "", address2: firm.address?.address2 || "", city: firm.address?.city || "", state: firm.address?.state || "", country: firm.add?.country || "", pinCode: firm.address?.pinCode || 0 }
        }
      }))
    }
  }

  const handleSubmit = async (status: "Draft" | "Pending") => {
    if (status !== "Draft" && items.some(i => !i.itemName || i.quantity <= 0 || i.unitPrice <= 0)) {
      showError("Please fill all item fields")
      return
    }

    try {
      const payload = {
        ...formData,
        status,
        subTotal: totals.subtotal,
        total: totals.total,
        dueAmount: totals.total - formData.amountPaid,
        items: items.map(i => ({ ...i, amount: toNum(i.unitPrice) * toNum(i.quantity) })),
        tax: customFields.tax ? items.map(i => i.taxRate) : [],
        taxAmt: customFields.tax ? items.map(i => (toNum(i.unitPrice) * toNum(i.quantity) * toNum(i.taxRate)) / 100) : []
      }

      await createInvoice(payload)
      toast({ title: "Success", description: `Invoice ${status === "Draft" ? "saved as draft" : "created"} successfully` })
      router.push(`/${orgName}/modules/invoice/all`)
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to create invoice", variant: "destructive" })
    }
  }

  return (
    <div className="overflow-y-auto h-[90vh] hide-scrollbar p-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <Breadcrumb items={[
            { label: "All Firms", href: `/${orgName}/modules/firm-management/firms` },
            { label: "Detail", href: `/${orgName}/modules/firm-management/firms/${firmIdFromUrl}` },
            { label: "Create Invoice", href: "" }
          ]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <FlatCard>
              <FlatCardHeader>
                <FlatCardTitle>Invoice Details</FlatCardTitle>
                <FlatCardDescription>Fill in invoice information and items</FlatCardDescription>
              </FlatCardHeader>
              <FlatCardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <CustomLabel>Invoice Date</CustomLabel>
                    <CustomInput type="date" value={formData.invoiceDate} onChange={e => setFormData({ ...formData, invoiceDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <CustomLabel>Due Date</CustomLabel>
                    <CustomInput type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <CustomLabel className="font-semibold block mb-2">From (Firm)</CustomLabel>
                      <CustomSelect value={formData.firm.firmId} onValueChange={handleFirmChange}>
                        <CustomSelectTrigger><CustomSelectValue placeholder="Select Firm" /></CustomSelectTrigger>
                        <CustomSelectContent>{firms.map(f => <CustomSelectItem key={f._id} value={f._id}>{f.FirmName}</CustomSelectItem>)}</CustomSelectContent>
                      </CustomSelect>
                      <div className="mt-4 text-sm space-y-1">
                        <p><span className="text-muted-foreground">Name:</span> {formData.firm.name || "-"}</p>
                        <p><span className="text-muted-foreground">GST:</span> {formData.firm.taxId || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <CustomLabel className="font-semibold block mb-2">To (Client)</CustomLabel>
                      <CustomSelect value={formData.client.client_id} onValueChange={handleClientChange}>
                        <CustomSelectTrigger><CustomSelectValue placeholder="Select Client" /></CustomSelectTrigger>
                        <CustomSelectContent>{clients.map(c => <CustomSelectItem key={c._id} value={c._id || ""}>{c.firstName} {c.lastName}</CustomSelectItem>)}</CustomSelectContent>
                      </CustomSelect>
                      <div className="mt-4 text-sm space-y-1">
                        <p><span className="text-muted-foreground">Name:</span> {formData.client.firstName} {formData.client.lastName || "-"}</p>
                        <p><span className="text-muted-foreground">Email:</span> {formData.client.email || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Items</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="p-2 text-left">Item Name</th>
                          <th className="p-2 text-center w-20">Qty</th>
                          <th className="p-2 text-center w-32">Price</th>
                          {customFields.tax && <th className="p-2 text-center w-32">Tax (%)</th>}
                          <th className="p-2 text-right w-32">Amount</th>
                          <th className="p-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr key={item.id} className="border-b last:border-0">
                            <td className="p-2">
                              <CustomInput value={item.itemName} onChange={e => updateItem(item.id || "", "itemName", e.target.value)} placeholder="Item name" />
                            </td>
                            <td className="p-2">
                              <CustomInput type="number" value={item.quantity} onChange={e => updateItem(item.id || "", "quantity", e.target.value)} className="text-center" />
                            </td>
                            <td className="p-2">
                              <CustomInput type="number" value={item.unitPrice} onChange={e => updateItem(item.id || "", "unitPrice", Number(e.target.value) || 0)} className="text-center" />
                            </td>
                            {customFields.tax && (
                              <td className="p-2">
                                <CustomSelect value={item.taxId || ""} onValueChange={val => updateItem(item.id || "", "taxRate", taxes.find(t => t._id === val)?.rate)}>
                                  <CustomSelectTrigger><CustomSelectValue placeholder="Tax" /></CustomSelectTrigger>
                                  <CustomSelectContent>{taxes.map(t => <CustomSelectItem key={t._id} value={t._id || ""}>{t.name} ({t.rate}%)</CustomSelectItem>)}</CustomSelectContent>
                                </CustomSelect>
                              </td>
                            )}
                            <td className="p-2 text-right font-medium">
                              {(toNum(item.unitPrice) * toNum(item.quantity)).toFixed(2)}
                            </td>
                            <td className="p-2">
                              <CustomButton variant="ghost" size="sm" onClick={() => removeItem(item.id || "")} className="text-destructive"><Trash2 size={16} /></CustomButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <CustomButton variant="outline" size="sm" onClick={addItem} className="gap-2"><Plus size={16} /> Add Item</CustomButton>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between"><span>Subtotal:</span><span className="font-medium">{totals.subtotal.toFixed(2)}</span></div>
                    {customFields.tax && <div className="flex justify-between text-muted-foreground"><span>Tax:</span><span>{totals.totalTax.toFixed(2)}</span></div>}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Total:</span><span>{totals.total.toFixed(2)}</span></div>
                  </div>
                </div>
              </FlatCardContent>
            </FlatCard>
          </div>

          <div className="space-y-6">
            <InvoiceOptions
              orgName={orgName}
              formData={formData}
              onConvertDraft={() => handleSubmit("Pending")}
              onCancelInvoice={() => { }}
              onRestoreInvoice={() => { }}
              onCopyInvoice={() => { }}
              onRecordPayment={() => setShowRecordPayment(true)}
              isCreating={true}
              onSaveDraft={() => handleSubmit("Draft")}
              currency="USD"
              setCurrency={() => { }}
              allCurrencies={[{ id: 0, name: "USD", value: "$" }, { id: 1, name: "INR", value: "₹" }]}
              onRecurring={() => setShowRecurring(true)}
              onAddReminder={() => setShowReminder(true)}
              invoiceRef={{ current: null } as any}
              hideStatus={false}
              onToggleHideStatus={() => { }}
            />
          </div>
        </div>
      </div>

      <RecordPaymentModal open={showRecordPayment} onClose={() => setShowRecordPayment(false)} invoice={formData} onSave={() => setShowRecordPayment(false)} />
      <RecurringInvoiceModal open={showRecurring} onClose={() => setShowRecurring(false)} onSave={() => setShowRecurring(false)} />
      <ReminderModal open={showReminder} invoice={formData} onClose={() => setShowReminder(false)} onSave={() => setShowReminder(false)} />
    </div>
  )
}
