"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Printer,
  Mail,
  History,
  FileText,
  DollarSign,
  Building,
  User,
  MoreVertical,
  Zap,
  Calendar,
  AlertCircle,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import { CustomButton } from "@/components/custom/CustomButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLoaderStore } from "@/lib/loaderStore";
import {
  getInvoiceById,
  draftToInvoice,
  cancelInvoice,
  restoreCancelledInvoice,
  recordPayment
} from "@/hooks/invoiceHooks";

const STATUS_CONFIG: Record<string, { color: string, bg: string, icon: any, border: string }> = {
  Paid: { color: "text-emerald-700", bg: "bg-emerald-50/50", icon: CheckCircle2, border: "border-emerald-100" },
  Pending: { color: "text-amber-700", bg: "bg-amber-50/50", icon: Clock, border: "border-amber-100" },
  Overdue: { color: "text-red-700", bg: "bg-red-50/50", icon: AlertCircle, border: "border-red-100" },
  Draft: { color: "text-zinc-500", bg: "bg-zinc-50/50", icon: FileText, border: "border-zinc-200" },
  Cancelled: { color: "text-zinc-400", bg: "bg-zinc-100/50", icon: XCircle, border: "border-zinc-200" },
};

export default function InvoiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = Array.isArray(params.id) ? params.id[0] : params.id;
  const orgName = params.orgName as string;
  const { showLoader, hideLoader } = useLoaderStore();
  const componentRef = useRef<HTMLDivElement>(null);

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoice = async () => {
    try {
      showLoader();
      const response = await getInvoiceById(invoiceId);
      setInvoice(response.data.data);
    } catch (err) {
      toast.error("Failed to load invoice");
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invoiceId) fetchInvoice();
  }, [invoiceId]);

  const handleAction = async (action: () => Promise<any>, successMsg: string) => {
    showLoader();
    try {
      await action();
      toast.success(successMsg);
      fetchInvoice();
    } catch (err) {
      toast.error("Action failed");
    } finally {
      hideLoader();
    }
  };

  if (!invoice && !loading) return null;
  const Config = invoice ? (STATUS_CONFIG[invoice.status] || STATUS_CONFIG.Draft) : STATUS_CONFIG.Draft;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b px-8 py-5 flex items-center justify-between shadow-sm relative z-50">
        <div className="flex items-center gap-6">
          <CustomButton variant="outline" size="sm" onClick={() => router.back()} className="h-9">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </CustomButton>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${Config.bg} ${Config.color}`}>
              <Config.icon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-zinc-900 tracking-tight uppercase">{invoice?.invoiceNumber}</h1>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Invoice Profile</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CustomButton variant="outline" className="h-10 px-4 rounded-xl border-zinc-200 hover:bg-zinc-50">
            <Printer className="h-4 w-4 mr-2" /> Print
          </CustomButton>
          <CustomButton variant="outline" className="h-10 px-4 rounded-xl border-zinc-200 hover:bg-zinc-50">
            <Download className="h-4 w-4 mr-2" /> Download
          </CustomButton>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <CustomButton className="h-10 bg-zinc-900 text-white px-6 rounded-xl font-bold shadow-lg shadow-zinc-200">
            <Send className="h-4 w-4 mr-2" /> Send to Client
          </CustomButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-10">

          {/* Main Invoice Card (Digital Document) */}
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl border border-zinc-200/50 overflow-hidden relative"
              ref={componentRef}
            >
              {/* Branding Stripe */}
              <div className="h-3 bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 w-full" />

              <div className="p-16">
                {/* Top: Firm & Info */}
                <div className="flex justify-between items-start mb-20">
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-100 shadow-inner">
                      <Building className="h-8 w-8 text-zinc-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">{invoice?.firm?.name || "Premium Business"}</h2>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed max-w-[200px]">
                        {invoice?.firm?.email}<br />
                        {invoice?.firm?.address?.address1}<br />
                        {invoice?.firm?.address?.city}, {invoice?.firm?.address?.state}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-4">
                    <Badge className={`rounded-xl px-4 py-1.5 text-[11px] font-black uppercase tracking-widest ${Config.bg} ${Config.color} ${Config.border}`}>
                      {invoice?.status}
                    </Badge>
                    <h3 className="text-5xl font-black text-zinc-900 tracking-tighter">INVOICE</h3>
                  </div>
                </div>

                {/* Middle: Details Grid */}
                <div className="grid grid-cols-2 gap-12 bg-zinc-50/50 rounded-[32px] p-10 border border-zinc-100 mb-16">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Billed To</p>
                    <div>
                      <p className="text-lg font-black text-zinc-900 tracking-tight">{invoice?.client?.firstName} {invoice?.client?.lastName}</p>
                      <p className="text-sm text-zinc-500 font-medium mt-1">{invoice?.client?.email}</p>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mt-2 uppercase font-bold tracking-tighter">
                        {invoice?.client?.address?.address1}<br />
                        {invoice?.client?.address?.city}, {invoice?.client?.address?.country}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Invoice No.</p>
                      <p className="text-sm font-black text-zinc-900">{invoice?.invoiceNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Issued On</p>
                      <p className="text-sm font-black text-zinc-900">{invoice?.invoiceDate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Due Date</p>
                      <p className="text-sm font-black text-red-600">{invoice?.dueDate || "Upon Receipt"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Currency</p>
                      <p className="text-sm font-black text-zinc-900">USD ($)</p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-20">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-100 pb-4">
                        <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Description</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 text-center">Qty</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 text-right">Price</th>
                        <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {invoice?.items?.map((item: any) => (
                        <tr key={item.id} className="group">
                          <td className="py-6 pr-6">
                            <p className="text-sm font-black text-zinc-900 tracking-tight uppercase">{item.itemName}</p>
                            <p className="text-xs text-zinc-400 font-medium mt-1">{item.description}</p>
                          </td>
                          <td className="py-6 text-center text-sm font-bold text-zinc-600">{item.quantity}</td>
                          <td className="py-6 text-right text-sm font-bold text-zinc-600">${(item.unitPrice || 0).toLocaleString()}</td>
                          <td className="py-6 text-right text-sm font-black text-zinc-900">${(item.amount || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom: Totals */}
                <div className="flex justify-end pt-12 border-t-2 border-dashed border-zinc-100">
                  <div className="w-80 space-y-4">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-zinc-400 uppercase tracking-widest text-[10px] font-black">Subtotal</span>
                      <span className="text-zinc-600 font-black">${(invoice?.total || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium pt-2">
                      <span className="text-zinc-400 uppercase tracking-widest text-[10px] font-black">Tax (0%)</span>
                      <span className="text-zinc-600 font-black">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-6">
                      <span className="text-lg font-black uppercase tracking-tighter text-zinc-900">Total Payable</span>
                      <span className="text-3xl font-black text-blue-600 tracking-tighter">${(invoice?.total || 0).toLocaleString()}</span>
                    </div>

                    {invoice?.amountPaid > 0 && (
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center mt-6">
                        <p className="text-[10px] font-black text-emerald-700 uppercase">Amount Paid</p>
                        <p className="text-sm font-black text-emerald-700">${(invoice?.amountPaid || 0).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Notes */}
              <div className="bg-zinc-50/50 p-16 flex justify-between gap-10">
                <div className="max-w-md space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Terms & Instructions</h4>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed italic">
                    {invoice?.notes || "Please make the payment through the digital link shared. Include invoice number in references. late fees of 1.5% applies for overdue bills."}
                  </p>
                </div>
                <div className="text-right opacity-30">
                  <Zap size={40} className="text-zinc-300" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar: Quick Actions & Log */}
          <div className="col-span-12 lg:col-span-4 space-y-8">

            {/* Payment Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200/50 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><CreditCard size={100} /></div>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Revenue Operations</h3>

              <div className="space-y-4">
                <CustomButton
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-tighter shadow-xl shadow-emerald-500/10"
                  disabled={invoice?.status === "Paid"}
                  onClick={() => toast.info("Record Payment launched...")}
                >
                  <Plus className="mr-2 h-5 w-5" /> Record Payment
                </CustomButton>

                {invoice?.status === "Draft" && (
                  <CustomButton
                    className="w-full h-12 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-tighter shadow-lg"
                    onClick={() => handleAction(() => draftToInvoice(invoice._id), "Draft finalized!")}
                  >
                    Finalize Draft
                  </CustomButton>
                )}
              </div>

              <Separator className="my-8 opacity-50" />

              <div className="flex flex-col gap-3">
                <CustomButton variant="outline" className="justify-start h-12 rounded-xl border-zinc-100 hover:bg-zinc-50 font-bold" onClick={() => router.push(`/${orgName}/modules/invoice/${invoice._id}/edit`)}>
                  <Edit className="mr-3 h-4 w-4 text-blue-500" /> Modify Invoice
                </CustomButton>
                <CustomButton variant="outline" className="justify-start h-12 rounded-xl border-zinc-100 hover:bg-zinc-50 font-bold">
                  <Mail className="mr-3 h-4 w-4 text-purple-500" /> Resend Notification
                </CustomButton>
                <Separator className="my-2 opacity-30" />
                {invoice?.status !== "Cancelled" ? (
                  <CustomButton variant="ghost" className="justify-start h-12 rounded-xl text-red-500 hover:bg-red-50 font-bold" onClick={() => handleAction(() => cancelInvoice(invoice._id), "Invoice Voided")}>
                    <XCircle className="mr-3 h-4 w-4" /> Void Invoice
                  </CustomButton>
                ) : (
                  <CustomButton variant="ghost" className="justify-start h-12 rounded-xl text-emerald-600 hover:bg-emerald-50 font-bold" onClick={() => handleAction(() => restoreCancelledInvoice(invoice._id), "Invoice Restored")}>
                    <History className="mr-3 h-4 w-4" /> Restore Invoice
                  </CustomButton>
                )}
              </div>
            </div>

            {/* Activity Brief */}
            <div className="bg-zinc-900 rounded-[32px] p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-white/10 text-white"><History size={16} /></div>
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Audit Timeline</h3>
              </div>

              <div className="space-y-6">
                <TimelineItem title="Invoice Issued" time="Today, 10:45 AM" done />
                <TimelineItem title="Client Viewed" time="Waiting..." />
                <TimelineItem title="Payment Expected" time={invoice?.dueDate || "Flexible"} />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function TimelineItem({ title, time, done = false }: { title: string, time: string, done?: boolean }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full border-2 ${done ? "bg-blue-500 border-blue-400" : "bg-transparent border-zinc-700"}`} />
        <div className="w-[1px] h-full bg-zinc-800 group-last:hidden mt-2" />
      </div>
      <div className="pb-6">
        <p className={`text-xs font-black tracking-tight ${done ? "text-zinc-200" : "text-zinc-600 uppercase"}`}>{title}</p>
        <p className="text-[10px] font-bold text-zinc-500 mt-0.5 italic">{time}</p>
      </div>
    </div>
  );
}

import { Edit } from "lucide-react";
