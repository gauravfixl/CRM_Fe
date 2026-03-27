"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { showSuccess } from "@/utils/toast";

const invoices = [
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

  const handleDownload = (invoiceId: string) => {
    showSuccess("Invoice downloaded");
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
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Invoices</h1>
        <p className="text-xs text-gray-600 mt-1">
          View and download your billing invoices and transaction history.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Billed (YTD) */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-5 rounded-none">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-white/70" />
            <p className="text-xs text-white/70">Total billed (YTD)</p>
          </div>
          <p className="text-xl font-semibold mt-1">$5,988.00</p>
        </div>

        {/* Next Invoice */}
        <div className="bg-white border border-gray-200 p-5 rounded-none">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-gray-400" />
            <p className="text-xs text-gray-500">Next invoice</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 mt-1">$499.00</p>
          <p className="text-[10px] text-gray-500 mt-1">Due Mar 01, 2026</p>
        </div>

        {/* Paid Invoices */}
        <div className="bg-white border border-gray-200 p-5 rounded-none">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-gray-400" />
            <p className="text-xs text-gray-500">Paid invoices</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 mt-1">12</p>
          <p className="text-[10px] text-green-600 mt-1">All payments up to date</p>
        </div>

        {/* Outstanding */}
        <div className="bg-white border border-gray-200 p-5 rounded-none">
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-gray-400" />
            <p className="text-xs text-gray-500">Outstanding</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 mt-1">$0.00</p>
          <p className="text-[10px] text-amber-600 mt-1">No overdue invoices</p>
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
                        className="h-8 w-8 p-0 rounded-none hover:bg-gray-100 text-gray-500 hover:text-primary"
                        onClick={() => handleDownload(invoice.id)}
                      >
                        <Download size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-none hover:bg-gray-100 text-gray-500 hover:text-primary"
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
    </div>
  );
}
