"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Trash2, Search, Filter, RotateCcw, FileX, ChevronRight, Loader2, AlertTriangle, Info } from "lucide-react";
import { getDeletedInvoices, restoreDeletedInvoice, hardDeleteInvoice } from "@/modules/crm/invoices/hooks/invoiceHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { showSuccess, showError, showWarning } from "@/shared/utils/toast";

export default function TrashCancelledInvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const [showEmptyModal, setShowEmptyModal] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [emptySubmitting, setEmptySubmitting] = useState(false);
    const [touched, setTouched] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getDeletedInvoices();
            const data = res?.data?.data || res?.data || [];
            const mapped = data.map((inv: any) => ({
                id: inv._id || inv.id,
                number: inv.invoiceNumber || inv.number || "-",
                client: inv.clientName || inv.client?.name || inv.client || "-",
                amount: inv.totalAmount != null ? `$${Number(inv.totalAmount).toLocaleString()}` : (inv.total != null ? `$${Number(inv.total).toLocaleString()}` : "$0"),
                reason: inv.deleteReason || inv.reason || "-",
                deletedBy: inv.deletedBy?.name || inv.deletedBy || "-",
                deletedDate: inv.deletedAt ? new Date(inv.deletedAt).toLocaleDateString() : (inv.updatedAt ? new Date(inv.updatedAt).toLocaleDateString() : "-"),
                status: inv.cancel ? "Cancelled" : "Trashed",
                _raw: inv,
            }));
            setInvoices(mapped);
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to load deleted invoices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return invoices;
        return invoices.filter(
            (i) =>
                (i.number || "").toLowerCase().includes(q) ||
                (i.client || "").toLowerCase().includes(q) ||
                (i.reason || "").toLowerCase().includes(q)
        );
    }, [invoices, search]);

    const handleRestore = async (id: string) => {
        try {
            setActionLoading(id);
            await restoreDeletedInvoice(id);
            showSuccess("Invoice restored successfully");
            fetchData();
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to restore invoice");
        } finally {
            setActionLoading(null);
        }
    };

    const handlePermanentDelete = async (id: string) => {
        const inv = invoices.find((x) => x.id === id);
        if (!inv) return;
        if (!window.confirm(`Permanently delete invoice ${inv.number}? This cannot be undone.`)) return;
        try {
            setActionLoading(id);
            await hardDeleteInvoice(id);
            showSuccess("Invoice permanently deleted");
            fetchData();
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to delete invoice");
        } finally {
            setActionLoading(null);
        }
    };

    const trashedInTrash = invoices.filter((i) => i.status === "Trashed");

    const confirmError = useMemo(() => {
        if (!touched) return "";
        if (confirmText.trim() !== "EMPTY") return 'Type "EMPTY" exactly to confirm';
        return "";
    }, [confirmText, touched]);

    const handleEmptyTrash = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched(true);

        if (trashedInTrash.length === 0) {
            showWarning("Trash is already empty");
            return;
        }
        if (confirmText.trim() !== "EMPTY") {
            showWarning('Type "EMPTY" exactly to confirm');
            return;
        }

        setEmptySubmitting(true);
        try {
            for (const inv of trashedInTrash) {
                try {
                    await hardDeleteInvoice(inv.id);
                } catch (err: any) {
                    // continue; individual failure already shown via per-row error
                }
            }
            showSuccess(`Permanently deleted ${trashedInTrash.length} invoice(s)`);
            setShowEmptyModal(false);
            setConfirmText("");
            setTouched(false);
            fetchData();
        } finally {
            setEmptySubmitting(false);
        }
    };

    const totalValue = invoices.reduce(
        (sum, inv) => sum + (parseFloat(inv.amount?.replace(/[$,]/g, "")) || 0),
        0
    );

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold">Trash & Cancelled Invoices</h1>
                    <p className="text-xs text-slate-500">Manage deleted and cancelled invoices with recovery options.</p>
                </div>
                <Button
                    onClick={() => setShowEmptyModal(true)}
                    disabled={trashedInTrash.length === 0}
                    className="rounded-lg bg-red-600 hover:bg-red-700 font-medium text-xs h-8 gap-2 shadow-sm px-4 disabled:opacity-50"
                >
                    <Trash2 size={14} /> Empty Trash
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-xs opacity-80">Total Deleted</p>
                    <h2 className="text-xl font-semibold">{invoices.length}</h2>
                    <p className="text-[10px] mt-1 opacity-80">Last 30 days</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Cancelled</p>
                    <h3 className="text-xl font-semibold text-gray-900">{invoices.filter((i) => i.status === "Cancelled").length}</h3>
                    <p className="text-amber-600 text-[10px] mt-1">Can be recovered</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">In Trash</p>
                    <h3 className="text-xl font-semibold text-gray-900">{trashedInTrash.length}</h3>
                    <p className="text-red-600 text-[10px] mt-1">Pending deletion</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <p className="text-gray-600 text-xs">Total Value</p>
                    <h3 className="text-xl font-semibold text-gray-900">${totalValue.toLocaleString()}</h3>
                    <p className="text-gray-600 text-[10px] mt-1">Deleted invoices</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search deleted invoices..."
                            className="pl-11 rounded-lg border-zinc-200 h-8 text-xs bg-white"
                        />
                    </div>
                    <Button variant="outline" className="rounded-lg border-zinc-200 h-8 text-xs gap-2 bg-white">
                        <Filter size={14} /> Filter
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Invoice #</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Client</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Amount</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Reason</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Deleted By</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Date</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500">Status</th>
                                <th className="px-4 py-3 text-[10px] font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-slate-500">
                                            <Loader2 size={18} className="animate-spin" />
                                            <span className="text-xs">Loading deleted invoices...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center">
                                        <span className="text-xs text-slate-500">No deleted invoices found.</span>
                                    </td>
                                </tr>
                            ) : filtered.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                                                <FileX size={14} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{invoice.number}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs text-gray-700">{invoice.client}</span></td>
                                    <td className="px-4 py-3"><span className="text-xs font-medium text-gray-900">{invoice.amount}</span></td>
                                    <td className="px-4 py-3">
                                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 rounded-md text-[10px] font-medium px-2 py-0.5">
                                            {invoice.reason}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3"><span className="text-xs text-gray-700">{invoice.deletedBy}</span></td>
                                    <td className="px-4 py-3"><span className="text-xs text-gray-600">{invoice.deletedDate}</span></td>
                                    <td className="px-4 py-3">
                                        <Badge className={`${invoice.status === "Cancelled" ? "bg-amber-600" : "bg-red-600"} text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5`}>
                                            {invoice.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center gap-2 justify-end">
                                            <Button
                                                onClick={() => handleRestore(invoice.id)}
                                                disabled={actionLoading === invoice.id}
                                                variant="outline"
                                                className="rounded-lg border-zinc-200 h-8 text-xs px-3 gap-1"
                                            >
                                                {actionLoading === invoice.id ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />} Restore
                                            </Button>
                                            <Button
                                                onClick={() => handlePermanentDelete(invoice.id)}
                                                disabled={actionLoading === invoice.id}
                                                variant="outline"
                                                className="rounded-lg border-red-200 h-8 text-xs px-3 gap-1 text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Showing {filtered.length} deleted invoices</p>
                    <Button variant="link" className="text-blue-600 text-xs flex items-center gap-1 group">
                        View Deletion History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            <SideFormSheet
                open={showEmptyModal}
                onOpenChange={(o) => {
                    setShowEmptyModal(o);
                    if (!o) {
                        setConfirmText("");
                        setTouched(false);
                    }
                }}
                title="Empty Trash"
                description="Permanently delete all trashed invoices."
                icon={<Trash2 className="w-5 h-5" />}
                onSubmit={handleEmptyTrash}
                submitLabel={`Permanently Delete ${trashedInTrash.length}`}
                loading={emptySubmitting}
                submitDisabled={confirmText.trim() !== "EMPTY" || trashedInTrash.length === 0}
                accentColor="#dc2626"
                width="md"
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[12.5px] font-semibold text-red-700">
                                This action cannot be undone
                            </p>
                            <p className="text-[11.5px] text-red-600 leading-relaxed mt-0.5">
                                {trashedInTrash.length} trashed invoice{trashedInTrash.length === 1 ? "" : "s"} will be permanently removed from the system, including their line items and audit history.
                            </p>
                        </div>
                    </div>

                    {trashedInTrash.length > 0 && (
                        <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                            <div className="px-4 py-2 bg-[#FAFBFC] border-b border-[#E5E7EB]">
                                <p className="text-[11.5px] font-semibold text-[#374151]">
                                    Invoices to be permanently deleted
                                </p>
                            </div>
                            <div className="max-h-40 overflow-y-auto divide-y divide-[#EEF1F6]">
                                {trashedInTrash.slice(0, 20).map((inv) => (
                                    <div key={inv.id} className="flex justify-between items-center px-4 py-2">
                                        <span className="text-[12px] text-[#374151] font-medium">{inv.number}</span>
                                        <span className="text-[11.5px] text-[#64748B]">{inv.amount}</span>
                                    </div>
                                ))}
                                {trashedInTrash.length > 20 && (
                                    <div className="px-4 py-2 text-center text-[11.5px] text-[#64748B]">
                                        + {trashedInTrash.length - 20} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <Field
                        label='Type "EMPTY" to confirm'
                        required
                        error={confirmError}
                        hint="Case-sensitive, without quotes"
                    >
                        <Input
                            placeholder="EMPTY"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            onBlur={() => setTouched(true)}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-red-500 font-mono"
                        />
                    </Field>

                    <div className="flex items-start gap-2 p-3 bg-[#FFF7ED] border border-[#FDBA74] rounded-lg">
                        <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-orange-700 leading-relaxed">
                            Cancelled invoices will remain available for restore. Only items with status <span className="font-semibold">Trashed</span> are affected.
                        </p>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
