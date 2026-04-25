"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { axiosInstance } from "@/lib/axios";
import {
  Receipt,
  Download,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  FileText,
  Pencil,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { showSuccess, showWarning } from "@/shared/utils/toast";

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  method: string;
  status: string;
  issueDate?: string;
  dueDateISO?: string;
  dueDate?: string;
  clientName?: string;
  clientEmail?: string;
  firmName?: string;
  notes?: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDisplayDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function nextInvoiceNumber(existing: Invoice[]) {
  const year = new Date().getFullYear();
  const count = existing.filter((i) => i.id.includes(String(year))).length + 1;
  return `INV-${year}-${String(count).padStart(3, "0")}`;
}

// Updated static invoices — aligned with the Create Invoice form schema
// (client name, client email, description, amount, dates, method, status, notes)
const staticInvoices: Invoice[] = [
  {
    id: "INV-2026-003",
    date: "Mar 01, 2026",
    issueDate: "2026-03-01",
    dueDateISO: "2026-03-15",
    dueDate: "Mar 15, 2026",
    description: "Q1 Website Redesign - Phase 2",
    amount: "$4,500.00",
    method: "Bank Transfer",
    status: "Upcoming",
    clientName: "Acme Corp",
    clientEmail: "billing@acme.com",
    notes: "Includes responsive design and CMS setup.",
  },
  {
    id: "INV-2026-002",
    date: "Feb 01, 2026",
    issueDate: "2026-02-01",
    dueDateISO: "2026-02-15",
    dueDate: "Feb 15, 2026",
    description: "Monthly Retainer - Legal Services",
    amount: "$2,800.00",
    method: "Visa",
    status: "Paid",
    clientName: "Pearson & Co.",
    clientEmail: "accounts@pearsonco.com",
    notes: "",
  },
  {
    id: "INV-2026-001",
    date: "Jan 01, 2026",
    issueDate: "2026-01-01",
    dueDateISO: "2026-01-31",
    dueDate: "Jan 31, 2026",
    description: "Annual Maintenance Contract 2026",
    amount: "$12,000.00",
    method: "Mastercard",
    status: "Paid",
    clientName: "Northwind Logistics",
    clientEmail: "finance@northwind.io",
    notes: "Full year coverage, billed upfront.",
  },
  {
    id: "INV-2025-012",
    date: "Dec 01, 2025",
    issueDate: "2025-12-01",
    dueDateISO: "2025-12-20",
    dueDate: "Dec 20, 2025",
    description: "Brand Identity Package + Guidelines",
    amount: "$6,750.00",
    method: "Bank Transfer",
    status: "Paid",
    clientName: "Studio Helix",
    clientEmail: "hello@studiohelix.design",
    notes: "",
  },
  {
    id: "INV-2025-011",
    date: "Nov 01, 2025",
    issueDate: "2025-11-01",
    dueDateISO: "2025-11-15",
    dueDate: "Nov 15, 2025",
    description: "Consulting - Cloud Migration Audit",
    amount: "$3,200.00",
    method: "Visa",
    status: "Paid",
    clientName: "Meridian Health",
    clientEmail: "vendor@meridianhealth.org",
    notes: "Delivered audit report and migration roadmap.",
  },
];

const statusFilters = ["All", "Paid", "Upcoming", "Overdue", "Draft"] as const;
const paymentMethods = ["Visa", "Mastercard", "Amex", "Bank Transfer", "Cash", "Other"];
const statusOptions = ["Upcoming", "Paid", "Overdue", "Draft"];

type FormState = {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  description: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  method: string;
  status: string;
  notes: string;
};

const blankForm: FormState = {
  invoiceNumber: "",
  clientName: "",
  clientEmail: "",
  description: "",
  amount: "",
  issueDate: todayISO(),
  dueDate: addDays(todayISO(), 14),
  method: "Visa",
  status: "Upcoming",
  notes: "",
};

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(staticInvoices);
  const [loading, setLoading] = useState(true);

  // Shared form state for Create & Edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(blankForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/invoice/all");
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mapped: Invoice[] = res.data.data.map((inv: any) => ({
            id: inv.invoiceNumber || inv._id,
            date: inv.date || formatDisplayDate(inv.issueDate || inv.createdAt || ""),
            issueDate: inv.issueDate || inv.createdAt?.slice(0, 10),
            dueDateISO: inv.dueDate?.slice(0, 10),
            dueDate: inv.dueDate ? formatDisplayDate(inv.dueDate) : undefined,
            description:
              inv.description ||
              (inv.firmName ? `${inv.firmName} - ${inv.clientName || ""}` : inv.clientName || "Invoice"),
            amount: inv.amount ? `$${Number(inv.amount).toFixed(2)}` : "—",
            method: inv.method || "—",
            status: inv.status || "Paid",
            clientName: inv.clientName,
            clientEmail: inv.clientemail || inv.clientEmail,
            firmName: inv.firmName,
            notes: inv.notes,
          }));
          setInvoices(mapped);
        }
      } catch {
        setInvoices(staticInvoices);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const cycleStatusFilter = () => {
    const currentIndex = statusFilters.indexOf(statusFilter as (typeof statusFilters)[number]);
    const nextIndex = (currentIndex + 1) % statusFilters.length;
    setStatusFilter(statusFilters[nextIndex]);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      searchQuery === "" ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.clientName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    const amount = parseFloat(form.amount);

    if (touched.clientName) {
      if (!form.clientName.trim()) e.clientName = "Client name is required";
      else if (!/^[A-Za-z0-9\s.'&,-]+$/.test(form.clientName.trim()))
        e.clientName = "Use letters, numbers, spaces, and . , ' & -";
      else if (form.clientName.trim().length < 2) e.clientName = "Name too short";
    }
    if (touched.clientEmail) {
      if (!form.clientEmail.trim()) e.clientEmail = "Client email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail.trim()))
        e.clientEmail = "Enter a valid email (e.g. user@company.com)";
    }
    if (touched.description) {
      if (!form.description.trim()) e.description = "Description is required";
      else if (form.description.length > 200) e.description = "Description too long (max 200)";
    }
    if (touched.amount) {
      if (!form.amount.trim()) e.amount = "Amount is required";
      else if (isNaN(amount) || amount <= 0) e.amount = "Amount must be greater than 0";
      else if (amount > 1_000_000) e.amount = "Amount seems too high";
    }
    if (touched.issueDate && !form.issueDate) e.issueDate = "Issue date is required";
    if (touched.dueDate) {
      if (!form.dueDate) e.dueDate = "Due date is required";
      else if (form.issueDate && new Date(form.dueDate) < new Date(form.issueDate))
        e.dueDate = "Due date must be on or after issue date";
    }
    if (touched.notes && form.notes.length > 500) e.notes = "Notes too long (max 500)";
    return e;
  }, [form, touched]);

  const resetForm = () => {
    setForm({
      ...blankForm,
      issueDate: todayISO(),
      dueDate: addDays(todayISO(), 14),
    });
    setTouched({});
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setForm((f) => ({ ...f, invoiceNumber: nextInvoiceNumber(invoices) }));
    setShowFormModal(true);
  };

  const openEditModal = (invoice: Invoice) => {
    const amountNum = parseFloat((invoice.amount || "").replace(/[^0-9.]/g, "")) || 0;
    setEditingId(invoice.id);
    setForm({
      invoiceNumber: invoice.id,
      clientName: invoice.clientName || "",
      clientEmail: invoice.clientEmail || "",
      description: invoice.description,
      amount: amountNum ? amountNum.toFixed(2) : "",
      issueDate: invoice.issueDate || todayISO(),
      dueDate: invoice.dueDateISO || addDays(invoice.issueDate || todayISO(), 14),
      method: invoice.method || "Visa",
      status: invoice.status || "Upcoming",
      notes: invoice.notes || "",
    });
    setTouched({});
    setShowFormModal(true);
  };

  const handleDownload = useCallback((invoice: Invoice) => {
    const csvContent = [
      ["Invoice ID", "Date", "Client", "Client Email", "Description", "Amount", "Payment Method", "Status", "Due Date"],
      [
        invoice.id,
        invoice.date,
        invoice.clientName || "",
        invoice.clientEmail || "",
        invoice.description,
        invoice.amount,
        invoice.method,
        invoice.status,
        invoice.dueDate || "",
      ],
    ]
      .map((row) => row.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess(`${invoice.id} downloaded`);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      clientName: true,
      clientEmail: true,
      description: true,
      amount: true,
      issueDate: true,
      dueDate: true,
      notes: true,
    });

    if (!form.clientName.trim()) return showWarning("Client name is required");
    if (!/^[A-Za-z0-9\s.'&,-]+$/.test(form.clientName.trim()))
      return showWarning("Client name contains invalid characters");
    if (!form.clientEmail.trim()) return showWarning("Client email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail.trim()))
      return showWarning("Enter a valid client email");
    if (!form.description.trim()) return showWarning("Description is required");
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) return showWarning("Amount must be greater than 0");
    if (!form.issueDate) return showWarning("Issue date is required");
    if (!form.dueDate) return showWarning("Due date is required");
    if (new Date(form.dueDate) < new Date(form.issueDate))
      return showWarning("Due date must be on or after issue date");

    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 300));

      const updated: Invoice = {
        id: form.invoiceNumber || nextInvoiceNumber(invoices),
        date: formatDisplayDate(form.issueDate),
        issueDate: form.issueDate,
        dueDateISO: form.dueDate,
        dueDate: formatDisplayDate(form.dueDate),
        description: form.description.trim(),
        amount: `$${amount.toFixed(2)}`,
        method: form.method,
        status: form.status,
        clientName: form.clientName.trim(),
        clientEmail: form.clientEmail.trim(),
        notes: form.notes.trim() || undefined,
      };

      if (editingId) {
        setInvoices((prev) => prev.map((inv) => (inv.id === editingId ? updated : inv)));
        showSuccess(`Invoice ${updated.id} updated successfully`);
      } else {
        setInvoices((prev) => [updated, ...prev]);
        showSuccess(`Invoice ${updated.id} created successfully`);
      }

      setShowFormModal(false);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-green-50 text-green-700 border border-green-200 text-xs font-medium">
            <CheckCircle2 size={12} />
            Paid
          </span>
        );
      case "Upcoming":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
            <Clock size={12} />
            Upcoming
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
            <AlertTriangle size={12} />
            Overdue
          </span>
        );
      case "Draft":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-medium">
            <FileText size={12} />
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  // Derived stats (live)
  const totalBilled = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + (parseFloat((i.amount || "").replace(/[^0-9.]/g, "")) || 0), 0);
  const nextUpcoming = invoices.find((i) => i.status === "Upcoming");
  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const outstanding = invoices
    .filter((i) => i.status === "Overdue" || i.status === "Upcoming")
    .reduce((sum, i) => sum + (parseFloat((i.amount || "").replace(/[^0-9.]/g, "")) || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Invoices</h1>
            <p className="text-sm text-zinc-500 mt-1">
              View, create, and manage your billing invoices.
            </p>
          </div>
          <Button
            onClick={openCreateModal}
            className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4 shadow-md shadow-primary/20"
          >
            <Plus size={14} />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
            <p className="text-white text-xs opacity-80">Total Billed (Paid)</p>
            <p className="text-white text-xl font-semibold mt-1">
              ${totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-white text-[10px] mt-1 opacity-70">Across all paid invoices</p>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
            <p className="text-zinc-500 text-xs">Next Invoice</p>
            <p className="text-xl font-semibold text-zinc-900 mt-1">
              {nextUpcoming?.amount || "$0.00"}
            </p>
            <p className="text-primary text-[10px] mt-1">
              {nextUpcoming?.dueDate ? `Due ${nextUpcoming.dueDate}` : "No upcoming invoices"}
            </p>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
            <p className="text-zinc-500 text-xs">Paid Invoices</p>
            <p className="text-xl font-semibold text-zinc-900 mt-1">{paidCount}</p>
            <p className="text-emerald-600 text-[10px] mt-1">All payments up to date</p>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
            <p className="text-zinc-500 text-xs">Outstanding</p>
            <p className="text-xl font-semibold text-zinc-900 mt-1">
              ${outstanding.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-amber-600 text-[10px] mt-1">
              {outstanding > 0 ? "Pending collection" : "No overdue invoices"}
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <Input
                placeholder="Search by ID, description or client..."
                className="pl-9 rounded-none border-gray-200 h-9 text-xs focus:ring-primary bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={cycleStatusFilter}
              className="rounded-none border-gray-200 text-xs h-9 gap-2 w-full sm:w-auto font-medium"
            >
              <Filter size={14} />
              {statusFilter === "All" ? "All statuses" : statusFilter}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Invoice ID</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Client</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Description</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Method</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Receipt size={14} className="text-gray-400" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{invoice.id}</span>
                          <span className="text-[10px] text-gray-400">{invoice.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{invoice.clientName || "—"}</span>
                        <span className="text-[10px] text-gray-400">{invoice.clientEmail || ""}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{invoice.description}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{invoice.amount}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{invoice.method}</td>
                    <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-500 hover:text-primary"
                          onClick={() => handleDownload(invoice)}
                          title="Download CSV"
                        >
                          <Download size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-500 hover:text-primary"
                          onClick={() => openEditModal(invoice)}
                          title="Edit invoice"
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-500 hover:text-primary"
                          onClick={() => setViewingInvoice(invoice)}
                          title="View details"
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-xs text-gray-400">
                      No invoices found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">
              Showing {filteredInvoices.length} of {invoices.length} invoices
            </p>
          </div>
        </div>
      </div>

      {/* View Invoice Details — side sheet */}
      <SideFormSheet
        open={!!viewingInvoice}
        onOpenChange={(o) => !o && setViewingInvoice(null)}
        title="Invoice Details"
        description={viewingInvoice?.id}
        icon={<Receipt className="w-5 h-5" />}
        width="md"
        footer={
          viewingInvoice ? (
            <>
              <Button
                variant="outline"
                onClick={() => setViewingInvoice(null)}
                className="h-10 px-5 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]"
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const inv = viewingInvoice;
                  setViewingInvoice(null);
                  if (inv) openEditModal(inv);
                }}
                className="h-10 px-4 rounded-lg border-[#E5E7EB] hover:bg-[#F3F4F6] gap-2"
              >
                <Pencil size={14} /> Edit
              </Button>
              <Button
                onClick={() => {
                  handleDownload(viewingInvoice);
                  setViewingInvoice(null);
                }}
                className="h-10 px-4 rounded-lg text-white bg-primary hover:bg-primary/90 gap-2"
              >
                <Download size={14} /> Download
              </Button>
            </>
          ) : null
        }
      >
        {viewingInvoice && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">Invoice ID</p>
                <p className="text-[14px] font-semibold text-zinc-900 mt-1">{viewingInvoice.id}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">Issue Date</p>
                <p className="text-[14px] font-semibold text-zinc-900 mt-1">{viewingInvoice.date}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">Amount</p>
                <p className="text-lg font-bold text-primary mt-1">{viewingInvoice.amount}</p>
              </div>
              <div>
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">Status</p>
                <div className="mt-1">{getStatusBadge(viewingInvoice.status)}</div>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-4">
              <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">Description</p>
              <p className="text-[14px] text-zinc-900 mt-1 leading-relaxed">{viewingInvoice.description}</p>
            </div>

            {(viewingInvoice.clientName || viewingInvoice.clientEmail) && (
              <div className="border-t border-zinc-100 pt-4 space-y-1">
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">Client</p>
                {viewingInvoice.clientName && (
                  <p className="text-[13.5px] font-medium text-zinc-900">{viewingInvoice.clientName}</p>
                )}
                {viewingInvoice.clientEmail && (
                  <p className="text-[12.5px] text-zinc-500">{viewingInvoice.clientEmail}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4">
              <div>
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">Payment Method</p>
                <p className="text-[13px] text-zinc-900 mt-1">{viewingInvoice.method}</p>
              </div>
              {viewingInvoice.dueDate && (
                <div>
                  <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">Due Date</p>
                  <p className="text-[13px] text-zinc-900 mt-1">{viewingInvoice.dueDate}</p>
                </div>
              )}
            </div>

            {viewingInvoice.notes && (
              <div className="border-t border-zinc-100 pt-4">
                <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wide">Notes</p>
                <p className="text-[13px] text-zinc-600 mt-1 leading-relaxed whitespace-pre-wrap">{viewingInvoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </SideFormSheet>

      {/* Create / Edit Invoice — side sheet (shared form) */}
      <SideFormSheet
        open={showFormModal}
        onOpenChange={(o) => {
          setShowFormModal(o);
          if (!o) resetForm();
        }}
        title={editingId ? "Edit Invoice" : "Create New Invoice"}
        description={
          editingId
            ? "Update the invoice details below."
            : "Generate a new invoice for your client."
        }
        icon={editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        width="lg"
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Save Changes" : "Create Invoice"}
        loading={submitting}
      >
        <div className="space-y-4">
          <Field
            label="Invoice Number"
            hint={editingId ? "Invoice ID cannot be changed" : "Auto-generated, editable"}
          >
            <Input
              value={form.invoiceNumber}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  invoiceNumber: e.target.value.replace(/[^A-Za-z0-9-]/g, "").toUpperCase(),
                }))
              }
              disabled={!!editingId}
              className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary font-mono disabled:bg-[#F8FAFC] disabled:text-[#64748B]"
              maxLength={30}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Client Name" required error={errors.clientName}>
              <Input
                placeholder="e.g. Acme Corp"
                value={form.clientName}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    clientName: e.target.value.replace(/[^A-Za-z0-9\s.'&,-]/g, ""),
                  }))
                }
                onBlur={() => setTouched((t) => ({ ...t, clientName: true }))}
                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                maxLength={80}
              />
            </Field>
            <Field label="Client Email" required error={errors.clientEmail}>
              <Input
                type="email"
                placeholder="billing@client.com"
                value={form.clientEmail}
                onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, clientEmail: true }))}
                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                autoComplete="email"
              />
            </Field>
          </div>

          <Field
            label="Description"
            required
            error={errors.description}
            hint={`${form.description.length}/200 characters`}
          >
            <Input
              placeholder="e.g. Q1 Website Redesign - Phase 2"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value.slice(0, 200) }))}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Amount (USD)" required error={errors.amount}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-[14px]">$</span>
                <Input
                  type="number"
                  placeholder="499.00"
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value.replace(/[^0-9.]/g, "") }))}
                  onBlur={() => setTouched((t) => ({ ...t, amount: true }))}
                  className="h-11 pl-7 rounded-lg bg-white border-[#E5E7EB] focus:border-primary font-mono"
                  min={0}
                  step={0.01}
                />
              </div>
            </Field>
            <Field label="Issue Date" required error={errors.issueDate}>
              <Input
                type="date"
                value={form.issueDate}
                onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, issueDate: true }))}
                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
              />
            </Field>
            <Field label="Due Date" required error={errors.dueDate}>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, dueDate: true }))}
                min={form.issueDate}
                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Payment Method">
              <Select value={form.method} onValueChange={(v) => setForm((f) => ({ ...f, method: v }))}>
                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field
            label="Notes"
            error={errors.notes}
            hint={`${form.notes.length}/500 characters (optional)`}
          >
            <Textarea
              placeholder="Add internal notes or payment instructions..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value.slice(0, 500) }))}
              onBlur={() => setTouched((t) => ({ ...t, notes: true }))}
              className="rounded-lg bg-white border-[#E5E7EB] focus:border-primary text-[13px] min-h-[90px]"
            />
          </Field>
        </div>
      </SideFormSheet>
    </div>
  );
}
