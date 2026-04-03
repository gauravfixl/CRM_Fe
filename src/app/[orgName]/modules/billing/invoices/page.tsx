"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  TrendingUp,
  DollarSign,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/shared/components/ui/dialog";
import { showSuccess } from "@/shared/utils/toast";

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  method: string;
  status: string;
  clientName?: string;
  clientEmail?: string;
  firmName?: string;
}

const staticInvoices: Invoice[] = [
  {
    id: "INV-2026-003",
    date: "Mar 01, 2026",
    description: "Enterprise Pro - Monthly",
    amount: "$499.00",
    method: "Visa •••• 4242",
    status: "Upcoming",
  },
  {
    id: "INV-2026-002",
    date: "Feb 01, 2026",
    description: "Enterprise Pro - Monthly",
    amount: "$499.00",
    method: "Visa •••• 4242",
    status: "Paid",
  },
  {
    id: "INV-2026-001",
    date: "Jan 01, 2026",
    description: "Enterprise Pro - Monthly",
    amount: "$499.00",
    method: "Visa •••• 4242",
    status: "Paid",
  },
  {
    id: "INV-2025-012",
    date: "Dec 01, 2025",
    description: "Enterprise Pro - Monthly + Storage Add-on",
    amount: "$512.50",
    method: "Visa •••• 4242",
    status: "Paid",
  },
  {
    id: "INV-2025-011",
    date: "Nov 01, 2025",
    description: "Enterprise Pro - Monthly",
    amount: "$499.00",
    method: "Visa •••• 4242",
    status: "Paid",
  },
];

const statusFilters = ["All", "Paid", "Upcoming", "Overdue"] as const;

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(staticInvoices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/invoice/all");
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mapped: Invoice[] = res.data.data.map((inv: any) => ({
            id: inv.invoiceNumber || inv._id,
            date: inv.date || "—",
            description: inv.firmName ? `${inv.firmName} - ${inv.clientName || ""}` : (inv.clientName || "Invoice"),
            amount: inv.amount ? `$${inv.amount}` : "—",
            method: inv.method || "—",
            status: inv.status || "Paid",
            clientName: inv.clientName,
            clientEmail: inv.clientemail,
            firmName: inv.firmName,
          }));
          setInvoices(mapped);
        }
      } catch {
        // On failure (401, network error, etc.), keep the static invoices as fallback
        setInvoices(staticInvoices);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const cycleStatusFilter = () => {
    const currentIndex = statusFilters.indexOf(
      statusFilter as (typeof statusFilters)[number]
    );
    const nextIndex = (currentIndex + 1) % statusFilters.length;
    setStatusFilter(statusFilters[nextIndex]);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      searchQuery === "" ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownload = useCallback((invoice: Invoice) => {
    const csvContent = [
      ["Invoice ID", "Date", "Description", "Amount", "Payment Method", "Status"],
      [invoice.id, invoice.date, invoice.description, invoice.amount, invoice.method, invoice.status],
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess(`${invoice.id} downloaded`);
  }, []);

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
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Invoices</h1>
            <p className="text-sm text-zinc-500 mt-1">
              View and download your billing invoices and transaction history.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
          <p className="text-white text-xs opacity-80">Total Billed (YTD)</p>
          <p className="text-white text-xl font-semibold mt-1">$5,988.00</p>
          <p className="text-white text-[10px] mt-1 opacity-70">Year to date</p>
        </div>

        <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
          <p className="text-zinc-500 text-xs">Next Invoice</p>
          <p className="text-xl font-semibold text-zinc-900 mt-1">$499.00</p>
          <p className="text-primary text-[10px] mt-1">Due Mar 01, 2026</p>
        </div>

        <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
          <p className="text-zinc-500 text-xs">Paid Invoices</p>
          <p className="text-xl font-semibold text-zinc-900 mt-1">12</p>
          <p className="text-emerald-600 text-[10px] mt-1">All payments up to date</p>
        </div>

        <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
          <p className="text-zinc-500 text-xs">Outstanding</p>
          <p className="text-xl font-semibold text-zinc-900 mt-1">$0.00</p>
          <p className="text-amber-600 text-[10px] mt-1">No overdue invoices</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={14}
            />
            <Input
              placeholder="Search by invoice ID or description..."
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  Invoice ID
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  Description
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  Amount
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  Payment method
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Receipt size={14} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {invoice.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {invoice.description}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {invoice.amount}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {invoice.method}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-500 hover:text-primary"
                        onClick={() => handleDownload(invoice)}
                      >
                        <Download size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-500 hover:text-primary"
                        onClick={() => setViewingInvoice(invoice)}
                      >
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Showing {filteredInvoices.length} of {invoices.length} invoices
          </p>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <Dialog open={!!viewingInvoice} onOpenChange={() => setViewingInvoice(null)}>
        <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
          <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white">
            <h2 className="text-base font-semibold">Invoice Details</h2>
            <p className="text-xs opacity-80 mt-1">{viewingInvoice?.id}</p>
          </div>
          {viewingInvoice && (
            <div className="p-5 space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium">Invoice ID</p>
                  <p className="text-sm font-semibold text-zinc-900 mt-0.5">{viewingInvoice.id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium">Date</p>
                  <p className="text-sm font-semibold text-zinc-900 mt-0.5">{viewingInvoice.date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium">Amount</p>
                  <p className="text-sm font-semibold text-zinc-900 mt-0.5">{viewingInvoice.amount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium">Status</p>
                  <div className="mt-0.5">{getStatusBadge(viewingInvoice.status)}</div>
                </div>
              </div>
              <div className="border-t border-zinc-100 pt-4">
                <p className="text-[10px] text-zinc-500 font-medium">Description</p>
                <p className="text-sm text-zinc-900 mt-0.5">{viewingInvoice.description}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-medium">Payment Method</p>
                <p className="text-sm text-zinc-900 mt-0.5">{viewingInvoice.method}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-9 gap-2"
                  onClick={() => { handleDownload(viewingInvoice); setViewingInvoice(null); }}
                >
                  <Download size={14} /> Download CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-none text-xs font-medium h-9"
                  onClick={() => setViewingInvoice(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
