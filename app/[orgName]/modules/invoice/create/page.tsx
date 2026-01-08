"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomButton } from "@/components/custom/CustomButton"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { SmallCard } from "@/components/custom/SmallCard"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomLabel } from "@/components/custom/CustomLabel"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import InvoiceOptions from "@/components/custom/CustomInvoiceOptions"
import InvoiceModal from "@/components/custom/invoice/ViewInvoiceModal"
import ConfirmModal from "@/components/custom/ConfirmationModal"
import { RecordPaymentModal } from "@/components/invoice/RecordPaymentModal"
import RecurringInvoiceModal from "@/components/custom/invoice/RecurringInvoiceModal"
import ReminderModal from "@/components/custom/invoice/ReminderModal"
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectItem,
  CustomSelectTrigger,
  CustomSelectValue,
} from "@/components/custom/CustomSelect"
import { CustomCheckbox } from "@/components/custom/CustomCheckbox"
import { useToast } from "@/hooks/use-toast"
import { useAppStore, type InvoiceItem, type Invoice } from "@/lib/store"
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from "next/link"
import { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle, CustomDialogFooter } from "@/components/custom/CustomDialog"
import { createInvoice } from "@/hooks/invoiceHooks"
import { getAllFirms } from "@/hooks/firmHooks"
import { getAllClients } from "@/hooks/clientHooks"
import { showError } from "@/utils/toast"
import { getAllOrgTaxes } from "@/hooks/taxHooks"

export default function CreateInvoicePage() {
  const router = useRouter()
  const { clients, setClients } = useAppStore()
  const { toast } = useToast()
  const [customModalOpen, setCustomModalOpen] = useState(false)
  const [orgName, setOrgName] = useState("")
  const [taxes, setTaxes] = useState<any[]>([])
  const [openModal, setOpenModal] = useState(false);
  const [firms, setFirms] = useState<any[]>([]);
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
    items: [{
      itemName: "",
      unitPrice: 0,
      quantity: 1,
      amount: 0,
      taxRate: 0,
      desc: "",
      discount: 0
    }],
    tax: [],
    taxAmt: [],
    notes: "",
    remark: "",
    gstn: "",
    termsNcondition: [],
    currency: "USD",
    curConvert: "",
    client: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      taxId: "",
      clientFirmName: "",
      address: {
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pinCode: 0
      },
      client_id: ""
    },
    firm: {
      name: "",
      phone: "",
      taxId: "",
      email: "",
      firmId: "",
      address: {
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pinCode: 0
      }
    },
    payment: [],
    recurringInvoiceObj: {
      start_date: null,
      end_date: null
    },
    __v: 0
  });

  const [openConfirm, setOpenConfirm] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [currency, setCurrency] = useState("")
  const [showRecurring, setShowRecurring] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, taxRate: 0, amount: 0 }
  ])
  const [showReminder, setShowReminder] = useState(false);
  const [totals, setTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    total: 0,
  });

  useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);

    const fetchFirms = async () => {
      try {
        const res = await getAllFirms();
        setFirms(res?.data?.firms || []);
      } catch (err) {
        console.error("Failed to fetch firms:", err);
      }
    };

    const fetchTaxes = async () => {
      try {
        const response = await getAllOrgTaxes();
        const allTaxes = response?.data?.data?.flatMap((item: any) => item.taxRates) || [];
        setTaxes(allTaxes);
      } catch (err) {
        console.error("Failed to fetch taxes:", err);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await getAllClients();
        setClients(response.data.clients);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    }

    fetchFirms();
    fetchTaxes();
    fetchClients();
  }, [setClients]);

  const activeClients = clients.filter(c => !c.isDeleted)
  const activeFirms = firms.filter(f => !f.isDeleted)
  const allCurrencies = [
    { id: 0, name: "INR", value: "₹" },
    { id: 1, name: "USD", value: "$" },
    { id: 2, name: "EUR", value: "€" },
    { id: 3, name: "AUD", value: "$" },
    { id: 4, name: "CAD", value: "$" },
  ];

  const toNum = (val: any) => Number(val) || 0;
  const qtyOf = (item: any) => toNum(item.quantity);

  const calcTotals = (items: any[]) => {
    return items.reduce(
      (acc, item) => {
        const unitPrice = toNum(item.unitPrice);
        const lineSubtotal = unitPrice * qtyOf(item);
        const discountRate = toNum(item.discount) / 100;
        const lineDiscount = lineSubtotal * discountRate;
        const taxableAmount = lineSubtotal - lineDiscount;
        const lineTax = taxableAmount * (toNum(item.taxRate) / 100);
        const lineTotal = taxableAmount + lineTax;

        acc.subtotal += lineSubtotal;
        acc.totalDiscount += lineDiscount;
        acc.totalTax += lineTax;
        acc.total += lineTotal;
        return acc;
      },
      { subtotal: 0, totalDiscount: 0, totalTax: 0, total: 0 }
    );
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );
      const newTotals = calcTotals(updatedItems);
      setTotals(newTotals);
      return updatedItems;
    });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      taxRate: 0,
      amount: 0,
      ...(customFields.hsn && { hsn: "" }),
      ...(customFields.sac && { sac: "" }),
      ...(customFields.tax && { tax: 0 }),
      ...(customFields.discount && { discount: 0 })
    }
    setItems([...items, newItem])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleClientChange = (clientId: string) => {
    const client = activeClients.find(c => c._id === clientId)
    if (client) {
      setFormData({
        ...formData,
        client: {
          firstName: client.firstName || "",
          lastName: client.lastName || "",
          email: client.email || "",
          phone: client.phone != null ? String(client.phone) : "",
          taxId: client.taxId || "",
          clientFirmName: client.clientFirmName || "",
          address: {
            address1: client.address?.address1 || "",
            address2: client.address?.address2 || "",
            city: client.address?.city || "",
            state: client.address?.state || "",
            country: client.address?.country || "",
            pinCode: client.address?.pinCode || 0
          },
          client_id: client._id
        }
      })
    }
  }

  const handleFirmChange = (firmId: string) => {
    const firm = activeFirms.find(f => f._id === firmId)
    if (firm) {
      setFormData({
        ...formData,
        firm: {
          name: firm.FirmName || "",
          phone: firm.phone || "",
          email: firm.email || "",
          taxId: firm.gst_no || "",
          firmId: firm._id,
          address: {
            address1: firm.add?.address1 || "",
            address2: firm.address?.address2 || "",
            city: firm.address?.city || "",
            state: firm.address?.state || "",
            country: firm.add?.country || "",
            pinCode: firm.address?.pinCode || 0
          }
        }
      })
    }
  }

  const subtotal = Number(totals.subtotal.toFixed(2));
  const totalDiscount = Number(totals.totalDiscount.toFixed(2));
  const totalTax = Number(totals.totalTax.toFixed(2));
  const total = Number(totals.total.toFixed(2));
  const dueAmount = Number((total - Number(formData.amountPaid ?? 0)).toFixed(2));

  const handleSubmit = async (status: "Draft" | "Pending") => {
    if (status !== "Draft" && items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      showError("Fill all fields")
      return
    }

    try {
      const payload: any = {
        ...formData,
        status,
        subTotal: subtotal,
        total: total,
        dueAmount: dueAmount,
        items: status === "Draft" ? items : items.filter(item => item.description?.trim() !== ""),
      };

      if (customFields.tax) {
        const taxRates = items.map(item => item.taxRate || 0);
        const taxAmounts = items.map(item => ((item.amount || 0) * (item.taxRate || 0)) / 100);
        payload.tax = taxRates;
        payload.taxAmt = taxAmounts;
      } else {
        payload.tax = [];
        payload.taxAmt = [];
      }

      await createInvoice(payload)
      toast({
        title: "Success",
        description: `Invoice ${status === "Draft" ? "saved as draft" : "created"} successfully`,
      })
      router.push(`/${orgName}/modules/invoice/all`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create invoice",
        variant: "destructive",
      })
    }
  }

  const toggleCustomField = (field: keyof typeof customFields, value: boolean) => {
    if (field === "tax" && formData.incluTax) return;
    setCustomFields(prev => ({ ...prev, [field]: value }));
  };

  const getCurrencySymbol = (currency: string) => {
    const cur = allCurrencies.find((c) => c.name === currency);
    return cur ? cur.value : "₹";
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLSelectElement>, item: any) => {
    const selectedTax = taxes.find((t) => t._id === e.target.value);
    if (!selectedTax) return;

    const updatedItems = items.map((i) =>
      i.id === item.id ? { ...i, taxRate: toNum(selectedTax.rate), taxId: selectedTax._id } : i
    );
    setItems(updatedItems);
    const newTotals = calcTotals(updatedItems);
    setTotals(newTotals);
  };

  const today = new Date().toISOString().split("T")[0];
  const displayTax = items.reduce((sum, item) => {
    const lineSubtotal = (item.unitPrice || 0) * (item.quantity || 0);
    const discountAmt = lineSubtotal * ((item.discount || 0) / 100);
    const taxable = lineSubtotal - discountAmt;
    return sum + taxable * ((item.taxRate || 0) / 100);
  }, 0);

  return (
    <div className="bg-primary/90 overflow-y-auto h-[90vh] create-invoice-form">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <CustomButton variant="outline" size="sm" asChild>
              <Link href={`/${orgName}/modules/invoice/all`}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Link>
            </CustomButton>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <FlatCard>
              <FlatCardHeader>
                <FlatCardTitle>Invoice Details</FlatCardTitle>
                <FlatCardDescription>Fill in the invoice information and add line items</FlatCardDescription>
              </FlatCardHeader>
              <FlatCardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <CustomLabel>Invoice Date:</CustomLabel>
                    <CustomInput type="date" value={formData.invoiceDate} min={today} onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <CustomLabel>Due Date:</CustomLabel>
                    <CustomInput type="date" value={formData.dueDate} min={today} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <CustomLabel className="font-semibold">Invoice From*</CustomLabel>
                    <CustomSelect value={formData.firmId} onValueChange={handleFirmChange}>
                      <CustomSelectTrigger><CustomSelectValue placeholder="Select Firm" /></CustomSelectTrigger>
                      <CustomSelectContent>
                        {activeFirms.map((firm) => (<CustomSelectItem key={firm._id} value={firm._id}>{firm.FirmName}</CustomSelectItem>))}
                      </CustomSelectContent>
                    </CustomSelect>
                    <SmallCard className="p-4 bg-gray-50 border-none shadow-none">
                      <h6 className="font-semibold mb-2">From Details</h6>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Name: {formData.firm.name || "-"}</p>
                        <p>Email: {formData.firm.email || "-"}</p>
                        <p>Phone: {formData.firm.phone || "-"}</p>
                      </div>
                    </SmallCard>
                  </div>

                  <div className="space-y-4">
                    <CustomLabel className="font-semibold">Invoice To*</CustomLabel>
                    <CustomSelect value={formData.clientId} onValueChange={handleClientChange}>
                      <CustomSelectTrigger><CustomSelectValue placeholder="Select Client" /></CustomSelectTrigger>
                      <CustomSelectContent>
                        {activeClients.map((client) => (<CustomSelectItem key={client._id} value={client._id}>{client.firstName} {client.lastName}</CustomSelectItem>))}
                      </CustomSelectContent>
                    </CustomSelect>
                    <SmallCard className="p-4 bg-gray-50 border-none shadow-none">
                      <h6 className="font-semibold mb-2">To Details</h6>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Name: {formData.client.firstName} {formData.client.lastName || "-"}</p>
                        <p>Email: {formData.client.email || "-"}</p>
                        <p>Phone: {formData.client.phone || "-"}</p>
                      </div>
                    </SmallCard>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <CustomLabel className="font-semibold">Item Details</CustomLabel>
                    <div className="space-x-2">
                      <CustomButton type="button" onClick={addItem} size="sm"><Plus className="mr-2 h-4 w-4" /> Add Item</CustomButton>
                      <CustomButton type="button" variant="outline" size="sm" onClick={() => setCustomModalOpen(true)}>Custom Fields</CustomButton>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-x-auto">
                    <div className="min-w-[800px]">
                      <div className="grid grid-cols-12 gap-2 p-3 bg-gray-100 font-medium text-sm">
                        <div className="col-span-3">Item Name & Desc</div>
                        <div className="col-span-1">Qty</div>
                        <div className="col-span-2">Unit Price</div>
                        {customFields.hsn && <div className="col-span-1">HSN</div>}
                        {customFields.tax && <div className="col-span-2">Tax</div>}
                        {customFields.discount && <div className="col-span-1">Disc%</div>}
                        <div className="col-span-2">Amount</div>
                      </div>
                      {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border-t items-center">
                          <div className="col-span-3 space-y-1">
                            <CustomInput placeholder="Item Name" value={item.itemName || ""} onChange={(e) => updateItem(item.id, 'itemName', e.target.value)} />
                            <CustomInput placeholder="Description" value={item.description || ""} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                          </div>
                          <div className="col-span-1">
                            <CustomInput type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                          </div>
                          <div className="col-span-2">
                            <CustomInput type="number" value={item.unitPrice} onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} />
                          </div>
                          {customFields.hsn && (
                            <div className="col-span-1"><CustomInput placeholder="HSN" value={item.hsn || ""} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} /></div>
                          )}
                          {customFields.tax && (
                            <div className="col-span-2">
                              <select value={item.taxId || ""} onChange={(e) => handleTaxChange(e, item)} className="w-full border rounded p-2 text-sm">
                                <option value="">Select Tax</option>
                                {taxes.map((tax) => (<option key={tax._id} value={tax._id}>{tax.name} ({tax.rate}%)</option>))}
                              </select>
                            </div>
                          )}
                          {customFields.discount && (
                            <div className="col-span-1"><CustomInput type="number" value={item.discount || 0} onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)} /></div>
                          )}
                          <div className="col-span-2 flex items-center justify-between">
                            <span className="font-medium text-sm">{getCurrencySymbol(currency)}{((item.unitPrice || 0) * (item.quantity || 0)).toFixed(2)}</span>
                            {items.length > 1 && (
                              <CustomButton variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></CustomButton>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <CustomLabel>Notes</CustomLabel>
                      <CustomTextarea placeholder="Client notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                    </div>
                    <div>
                      <CustomLabel>Terms & Conditions</CustomLabel>
                      <CustomTextarea placeholder="Terms & Conditions" value={formData.termsNcondition?.[0] || ""} onChange={(e) => setFormData({ ...formData, termsNcondition: [e.target.value] })} />
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm"><span>Subtotal:</span><span>{getCurrencySymbol(currency)}{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-blue-600"><span>Tax:</span><span>{getCurrencySymbol(currency)}{displayTax.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm text-red-600"><span>Discount:</span><span>-{getCurrencySymbol(currency)}{totalDiscount.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total:</span><span>{getCurrencySymbol(currency)}{total.toFixed(2)}</span></div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <CustomButton onClick={() => handleSubmit("Pending")} size="lg">Save Invoice</CustomButton>
                </div>
              </FlatCardContent>
            </FlatCard>
          </div>

          <div className="space-y-4">
            <InvoiceOptions
              formData={{ ...formData, items }}
              orgName={orgName}
              onConvertDraft={() => handleSubmit("Pending")}
              onCancelInvoice={() => { }}
              onRestoreInvoice={() => { }}
              onCopyInvoice={() => { }}
              onRecordPayment={() => setShowRecordPayment(true)}
              isCreating={true}
              onSaveDraft={() => handleSubmit("Draft")}
              currency={currency}
              setCurrency={setCurrency}
              allCurrencies={allCurrencies}
              onRecurring={() => { if (!formData.dueDate) return showError("Select due date first"); setShowRecurring(true); }}
              onAddReminder={() => setShowReminder(true)}
              invoiceRef={{ current: null } as any}
              hideStatus={false}
              onToggleHideStatus={() => { }}
            />
          </div>
        </div>
      </div>

      <CustomDialog open={customModalOpen} onOpenChange={setCustomModalOpen}>
        <CustomDialogContent>
          <CustomDialogHeader><CustomDialogTitle>Custom Fields</CustomDialogTitle></CustomDialogHeader>
          <div className="space-y-4 py-4">
            {Object.entries(customFields).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <CustomCheckbox id={key} checked={value} onCheckedChange={(checked) => toggleCustomField(key as any, checked as boolean)} />
                <Label htmlFor={key} className="capitalize">{key}</Label>
              </div>
            ))}
          </div>
          <CustomDialogFooter><CustomButton onClick={() => setCustomModalOpen(false)}>Close</CustomButton></CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>

      <RecurringInvoiceModal open={showRecurring} onClose={() => setShowRecurring(false)} onSave={(data) => setFormData({ ...formData, recurringInvoiceObj: data })} dueDate={formData.dueDate} />
      <ReminderModal open={showReminder} onClose={() => setShowReminder(false)} onSave={(reminder) => setShowReminder(false)} />
      <InvoiceModal open={openModal} onClose={() => setOpenModal(false)} formData={formData} />
      <ConfirmModal open={openConfirm} onClose={() => setOpenConfirm(false)} onConfirm={() => handleSubmit("Draft")} title="Save Draft" message="Are you sure you want to save this invoice as a draft?" confirmText="Save Draft" />
      <RecordPaymentModal open={showRecordPayment} onClose={() => setShowRecordPayment(false)} invoice={formData} onSave={() => { }} />
    </div>
  )
}
