"use client";

import React, { useState, useMemo } from "react";
import { DollarSign, Plus, Search, TrendingUp, ChevronRight, MoreVertical, Edit, Trash2, Star, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { showSuccess, showWarning } from "@/shared/utils/toast";

interface Currency {
    id: string;
    code: string;
    name: string;
    symbol: string;
    rate: number;
    baseCurrency: boolean;
    status: "Active" | "Paused";
}

const initialCurrencies: Currency[] = [
    { id: "1", code: "USD", name: "US Dollar", symbol: "$", rate: 1.0, baseCurrency: true, status: "Active" },
    { id: "2", code: "EUR", name: "Euro", symbol: "€", rate: 0.92, baseCurrency: false, status: "Active" },
    { id: "3", code: "GBP", name: "British Pound", symbol: "£", rate: 0.79, baseCurrency: false, status: "Active" },
    { id: "4", code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.12, baseCurrency: false, status: "Active" },
];

export default function CurrencyFXPage() {
    const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Currency | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    const [formCode, setFormCode] = useState("");
    const [formName, setFormName] = useState("");
    const [formSymbol, setFormSymbol] = useState("");
    const [formRate, setFormRate] = useState("");
    const [formBase, setFormBase] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const resetForm = () => {
        setFormCode("");
        setFormName("");
        setFormSymbol("");
        setFormRate("");
        setFormBase(false);
        setTouched({});
        setEditing(null);
    };

    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (c: Currency) => {
        setEditing(c);
        setFormCode(c.code);
        setFormName(c.name);
        setFormSymbol(c.symbol);
        setFormRate(String(c.rate));
        setFormBase(c.baseCurrency);
        setTouched({});
        setShowModal(true);
    };

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const code = formCode.trim().toUpperCase();
        const name = formName.trim();
        const symbol = formSymbol.trim();
        const rate = formRate.trim();

        if (touched.code) {
            if (!code) e.code = "Currency code is required";
            else if (!/^[A-Z]{3}$/.test(code)) e.code = "Must be 3 uppercase letters (e.g. USD)";
            else if (
                !editing &&
                currencies.some((c) => c.code.toUpperCase() === code)
            ) {
                e.code = "This currency code already exists";
            }
        }
        if (touched.name) {
            if (!name) e.name = "Currency name is required";
            else if (name.length < 2) e.name = "Name is too short";
        }
        if (touched.symbol && !symbol) e.symbol = "Currency symbol is required";
        if (touched.rate) {
            if (!rate) e.rate = "Exchange rate is required";
            else {
                const n = parseFloat(rate);
                if (isNaN(n) || n <= 0) e.rate = "Rate must be a positive number";
            }
        }
        return e;
    }, [formCode, formName, formSymbol, formRate, touched, currencies, editing]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return currencies;
        return currencies.filter(
            (c) =>
                c.code.toLowerCase().includes(q) ||
                c.name.toLowerCase().includes(q)
        );
    }, [currencies, search]);

    const toggleStatus = (id: string) => {
        setCurrencies((prev) =>
            prev.map((c) =>
                c.id === id
                    ? { ...c, status: c.status === "Active" ? "Paused" : "Active" }
                    : c
            )
        );
    };

    const setBase = (id: string) => {
        setCurrencies((prev) => prev.map((c) => ({ ...c, baseCurrency: c.id === id })));
        showSuccess("Base currency updated");
    };

    const removeCurrency = (id: string) => {
        const c = currencies.find((x) => x.id === id);
        if (!c) return;
        if (c.baseCurrency) {
            showWarning("Cannot delete the base currency");
            return;
        }
        if (!window.confirm(`Remove currency ${c.code} (${c.name})?`)) return;
        setCurrencies((prev) => prev.filter((x) => x.id !== id));
        showSuccess("Currency removed");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ code: true, name: true, symbol: true, rate: true });

        const code = formCode.trim().toUpperCase();
        const name = formName.trim();
        const symbol = formSymbol.trim();
        const rate = parseFloat(formRate);

        const fresh: Record<string, string> = {};
        if (!/^[A-Z]{3}$/.test(code)) fresh.code = "Invalid code";
        if (
            !editing &&
            currencies.some((c) => c.code.toUpperCase() === code)
        ) {
            fresh.code = "Already exists";
        }
        if (!name) fresh.name = "Required";
        if (!symbol) fresh.symbol = "Required";
        if (isNaN(rate) || rate <= 0) fresh.rate = "Invalid";

        if (Object.keys(fresh).length > 0) {
            showWarning("Please fix the errors before submitting");
            return;
        }

        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 400));
            if (editing) {
                setCurrencies((prev) =>
                    prev.map((c) =>
                        c.id === editing.id
                            ? { ...c, code, name, symbol, rate, baseCurrency: formBase }
                            : formBase
                                ? { ...c, baseCurrency: false }
                                : c
                    )
                );
                showSuccess("Currency updated successfully");
            } else {
                const newCurrency: Currency = {
                    id: Date.now().toString(),
                    code,
                    name,
                    symbol,
                    rate,
                    baseCurrency: formBase,
                    status: "Active",
                };
                setCurrencies((prev) =>
                    formBase
                        ? [...prev.map((c) => ({ ...c, baseCurrency: false })), newCurrency]
                        : [...prev, newCurrency]
                );
                showSuccess("Currency added successfully");
            }
            setShowModal(false);
            resetForm();
        } finally {
            setSubmitting(false);
        }
    };

    const baseCurrency = currencies.find((c) => c.baseCurrency);

    return (
        <div className="space-y-4 text-[12.5px]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold tracking-tight">Currency & FX Rules</h1>
                    <p className="text-xs text-slate-500">Manage multi-currency support and exchange rates.</p>
                </div>
                <Button
                    onClick={openCreate}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4"
                >
                    <Plus size={16} /> Add Currency
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-white opacity-80">Supported Currencies</p>
                    <h2 className="text-xl font-semibold text-white">{currencies.length}</h2>
                    <p className="text-[10px] text-white mt-1 opacity-80">Active</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Base Currency</p>
                    <h3 className="text-xl font-semibold text-gray-900">{baseCurrency?.code || "-"}</h3>
                    <p className="text-[10px] text-green-600 mt-1">Default</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Last Updated</p>
                    <h3 className="text-xl font-semibold text-gray-900">2 hrs ago</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Auto-sync enabled</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">FX Transactions</p>
                    <h3 className="text-xl font-semibold text-gray-900">1,204</h3>
                    <p className="text-[10px] text-purple-600 mt-1">This month</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search currencies..."
                            className="pl-11 rounded-lg border-zinc-200 h-9 text-xs bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Currency</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Code</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Symbol</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Exchange Rate</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Base</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Status</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <span className="text-xs text-slate-500">No currencies found.</span>
                                    </td>
                                </tr>
                            ) : filtered.map((currency) => (
                                <tr key={currency.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <DollarSign size={16} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{currency.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-md text-[10px] font-medium px-2 py-0.5">
                                            {currency.code}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{currency.symbol}</span></td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-gray-900">{currency.rate.toFixed(4)}</span>
                                            <TrendingUp size={12} className="text-green-600" />
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        {currency.baseCurrency ? (
                                            <Badge className="bg-purple-600 text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5">Base</Badge>
                                        ) : (
                                            <span className="text-xs text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <Switch
                                            checked={currency.status === "Active"}
                                            onCheckedChange={() => toggleStatus(currency.id)}
                                            className="data-[state=checked]:bg-green-600"
                                        />
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100">
                                                    <MoreVertical size={14} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 shadow-lg p-2 min-w-[170px]">
                                                <DropdownMenuItem
                                                    onClick={() => openEdit(currency)}
                                                    className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"
                                                >
                                                    <Edit size={14} /> Edit
                                                </DropdownMenuItem>
                                                {!currency.baseCurrency && (
                                                    <DropdownMenuItem
                                                        onClick={() => setBase(currency.id)}
                                                        className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer"
                                                    >
                                                        <Star size={14} /> Set as Base
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={() => removeCurrency(currency.id)}
                                                    className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Showing {filtered.length} currencies</p>
                    <Button variant="link" className="text-blue-600 text-xs flex items-center gap-1 group">
                        Update Exchange Rates <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            <SideFormSheet
                open={showModal}
                onOpenChange={(o) => {
                    setShowModal(o);
                    if (!o) resetForm();
                }}
                title={editing ? "Edit Currency" : "Add Currency"}
                description={editing ? "Update exchange rate or currency details." : "Add a new currency to your accounting engine."}
                icon={<DollarSign className="w-5 h-5" />}
                onSubmit={handleSubmit}
                submitLabel={editing ? "Save Changes" : "Add Currency"}
                loading={submitting}
                width="md"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Currency Code"
                            required
                            error={errors.code}
                            hint="ISO 4217 (e.g. USD)"
                        >
                            <Input
                                placeholder="USD"
                                value={formCode}
                                onChange={(e) => setFormCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3))}
                                onBlur={() => setTouched((t) => ({ ...t, code: true }))}
                                maxLength={3}
                                disabled={!!editing}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary font-mono uppercase"
                            />
                        </Field>
                        <Field
                            label="Symbol"
                            required
                            error={errors.symbol}
                            hint="e.g. $, €, £, ₹"
                        >
                            <Input
                                placeholder="$"
                                value={formSymbol}
                                onChange={(e) => setFormSymbol(e.target.value.slice(0, 5))}
                                onBlur={() => setTouched((t) => ({ ...t, symbol: true }))}
                                maxLength={5}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    </div>

                    <Field
                        label="Currency Name"
                        required
                        error={errors.name}
                    >
                        <Input
                            placeholder="US Dollar"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field
                        label="Exchange Rate (vs Base)"
                        required
                        error={errors.rate}
                        hint="How much of this currency = 1 base unit"
                    >
                        <Input
                            type="number"
                            placeholder="1.0000"
                            value={formRate}
                            onChange={(e) => setFormRate(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, rate: true }))}
                            min={0}
                            step="0.0001"
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary font-mono"
                        />
                    </Field>

                    <div className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg bg-[#FAFBFC]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Set as Base Currency</p>
                            <p className="text-[11.5px] text-[#64748B] mt-0.5">
                                Other exchange rates will be calculated against this
                            </p>
                        </div>
                        <Switch
                            checked={formBase}
                            onCheckedChange={setFormBase}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-[#475569] leading-relaxed">
                            Only one base currency can exist at a time. Changing the base will recalculate all rate displays.
                        </p>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
