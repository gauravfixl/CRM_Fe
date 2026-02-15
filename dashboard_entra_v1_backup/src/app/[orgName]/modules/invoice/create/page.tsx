"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Building,
  User,
  DollarSign,
  Calendar,
  Save
} from "lucide-react";
import { toast } from "sonner";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { CustomTextarea } from "@/components/custom/CustomTextArea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLoaderStore } from "@/lib/loaderStore";
import { createInvoice } from "@/hooks/invoiceHooks";
import { getAllFirms } from "@/hooks/firmHooks";
import { getAllClients } from "@/hooks/clientHooks";

interface InvoiceItem {
  id: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  taxRate: number;
  description: string;
}

export default function CreateInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const orgName = params.orgName as string;
  const { showLoader, hideLoader } = useLoaderStore();

  const [firms, setFirms] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    firmId: "",
    clientId: "",
    notes: "",
    currency: "USD",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", itemName: "", unitPrice: 0, quantity: 1, taxRate: 0, description: "" }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [firmsRes, clientsRes] = await Promise.all([
          getAllFirms(),
          getAllClients()
        ]);
        setFirms(firmsRes?.data?.firms || []);
        setClients(clientsRes?.data?.clients || []);
      } catch (err) {
        console.error("Failed to preload data", err);
      }
    };
    fetchData();
  }, []);

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now().toString(), itemName: "", unitPrice: 0, quantity: 1, taxRate: 0, description: "" }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
    return { subtotal, total: subtotal };
  }, [items]);

  const handleSubmit = async (status: "Draft" | "Pending") => {
    if (!formData.firmId || !formData.clientId) {
      toast.error("Please select a Firm and a Client");
      return;
    }

    showLoader();
    try {
      const selectedFirm = firms.find(f => f._id === formData.firmId);
      const selectedClient = clients.find(c => c._id === formData.clientId);

      const payload = {
        ...formData,
        status,
        subTotal: totals.subtotal,
        total: totals.total,
        items,
        firm: {
          firmId: selectedFirm?._id,
          name: selectedFirm?.FirmName,
          email: selectedFirm?.email,
          phone: selectedFirm?.phone,
        },
        client: {
          client_id: selectedClient?._id,
          firstName: selectedClient?.firstName,
          lastName: selectedClient?.lastName,
          email: selectedClient?.email,
        }
      };

      await createInvoice(payload);
      toast.success(status === "Draft" ? "Draft saved successfully" : "Invoice created successfully");
      router.push(`/${orgName}/modules/invoice`);
    } catch (err) {
      toast.error("An error occurred while creating the invoice");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <CustomButton variant="outline" size="sm" onClick={() => router.back()} className="rounded-lg h-9">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </CustomButton>
          <div className="h-4 w-[1px] bg-zinc-200" />
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">New Invoice</h1>
        </div>
        <div className="flex items-center gap-3">
          <CustomButton variant="ghost" onClick={() => handleSubmit("Draft")} className="text-zinc-500 font-bold hover:bg-zinc-100">
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </CustomButton>
          <CustomButton onClick={() => handleSubmit("Pending")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow-md transition-all active:scale-95">
            Create & Send
          </CustomButton>
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">

          <div className="p-10 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-white/[0.02] flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Billing Details</p>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Invoice Configuration</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Document ID</span>
              <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">{formData.invoiceNumber}</p>
            </div>
          </div>

          <div className="p-10 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-zinc-400 uppercase">Issue Date</Label>
                <CustomInput type="date" value={formData.invoiceDate} onChange={(e) => setFormData(prev => ({ ...prev, invoiceDate: e.target.value }))} className="bg-white dark:bg-zinc-900" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-zinc-400 uppercase">Due Date</Label>
                <CustomInput type="date" value={formData.dueDate} onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))} className="bg-white dark:bg-zinc-900" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-zinc-400 uppercase">Currency</Label>
                <Select value={formData.currency} onValueChange={(v) => setFormData(prev => ({ ...prev, currency: v }))}>
                  <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800 rounded-lg">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="opacity-50" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                  <Building className="h-4 w-4 text-blue-500" />
                  <span>Sender Information</span>
                </div>
                <Select value={formData.firmId} onValueChange={(v) => setFormData(prev => ({ ...prev, firmId: v }))}>
                  <SelectTrigger className="h-12 border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 font-medium">
                    <SelectValue placeholder="Select My Firm" />
                  </SelectTrigger>
                  <SelectContent>
                    {firms.map(f => <SelectItem key={f._id} value={f._id}>{f.FirmName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-sm">
                  <User className="h-4 w-4 text-emerald-500" />
                  <span>Receiver Information</span>
                </div>
                <Select value={formData.clientId} onValueChange={(v) => setFormData(prev => ({ ...prev, clientId: v }))}>
                  <SelectTrigger className="h-12 border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 font-medium">
                    <SelectValue placeholder="Select Destination Client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => <SelectItem key={c._id} value={c._id}>{c.firstName} {c.lastName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Line Items</h3>
                <CustomButton variant="outline" size="sm" onClick={addItem} className="h-8 text-xs font-bold px-4 border-dashed">
                  <Plus className="h-3 w-3 mr-2" /> Add Item
                </CustomButton>
              </div>

              <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-white/[0.02] border-b border-zinc-100 dark:border-zinc-800">
                      <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest w-[50%]">Description</th>
                      <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Price</th>
                      <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Qty</th>
                      <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Total</th>
                      <th className="p-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                    {items.map((item) => (
                      <tr key={item.id} className="group hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors">
                        <td className="p-4">
                          <CustomInput
                            placeholder="Service or Product Name"
                            value={item.itemName}
                            onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                            className="font-bold border-none shadow-none h-8 p-0 px-0 focus-visible:ring-0 bg-transparent mb-1 rounded-none border-b border-transparent focus:border-zinc-200"
                          />
                          <CustomInput
                            placeholder="Provide brief details..."
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            className="text-xs text-zinc-500 border-none shadow-none h-6 p-0 px-0 focus-visible:ring-0 bg-transparent rounded-none"
                          />
                        </td>
                        <td className="p-4 align-top">
                          <CustomInput
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                            className="h-8 w-24 mx-auto text-center font-bold text-sm bg-zinc-50/50 border-zinc-200"
                          />
                        </td>
                        <td className="p-4 align-top">
                          <CustomInput
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                            className="h-8 w-16 mx-auto text-center font-bold text-sm bg-zinc-50/50 border-zinc-200"
                          />
                        </td>
                        <td className="p-4 text-right align-top">
                          <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 pt-1">
                            ${(item.unitPrice * item.quantity).toLocaleString()}
                          </p>
                        </td>
                        <td className="p-4 text-right align-top">
                          <button onClick={() => removeItem(item.id)} className="pt-2 text-zinc-300 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
              <div className="space-y-4">
                <Label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Additional Notes</Label>
                <CustomTextarea
                  placeholder="Terms, payment instructions, or specialized notes..."
                  className="bg-zinc-50/50 dark:bg-zinc-900 rounded-xl border-zinc-200 dark:border-zinc-800 min-h-[140px] text-sm"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <div className="bg-zinc-900 rounded-[32px] p-8 text-white flex flex-col justify-between shadow-2xl relative">
                <div className="absolute top-0 right-0 p-8 opacity-5"><DollarSign size={100} /></div>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center opacity-50 text-[10px] font-black uppercase tracking-widest">
                    <span>Gross Amount</span>
                    <span className="text-sm">${totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center opacity-50 text-[10px] font-black uppercase tracking-widest">
                    <span>Total Tax (0%)</span>
                    <span className="text-sm">$0.00</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Total Due</p>
                      <p className="text-sm font-bold text-zinc-500">Document Total in {formData.currency}</p>
                    </div>
                    <p className="text-4xl font-black tracking-tighter tabular-nums">${totals.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-8 relative z-10">
                  <CustomButton onClick={() => handleSubmit("Pending")} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10">
                    Create Document
                  </CustomButton>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
