"use client";

import React, { useState } from "react";
import { DollarSign, Plus, Search, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";

export default function CurrencyFXPage() {
    const [currencies, setCurrencies] = useState([
        { id: "1", code: "USD", name: "US Dollar", symbol: "$", rate: 1.00, baseCurrency: true, status: "Active" },
        { id: "2", code: "EUR", name: "Euro", symbol: "€", rate: 0.92, baseCurrency: false, status: "Active" },
        { id: "3", code: "GBP", name: "British Pound", symbol: "£", rate: 0.79, baseCurrency: false, status: "Active" },
        { id: "4", code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.12, baseCurrency: false, status: "Active" },
    ]);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Currency & FX Rules</h1>
                    <p className="text-sm text-gray-600">Manage multi-currency support and exchange rates.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <Plus size={16} /> Add Currency
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Supported Currencies</p>
                    <h2 className="text-white text-2xl font-bold">{currencies.length}</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Active</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Base Currency</p>
                    <h3 className="text-2xl font-bold text-gray-900">USD</h3>
                    <p className="text-green-600 text-xs mt-1">Default</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Last Updated</p>
                    <h3 className="text-2xl font-bold text-gray-900">2 hrs ago</h3>
                    <p className="text-blue-600 text-xs mt-1">Auto-sync enabled</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">FX Transactions</p>
                    <h3 className="text-2xl font-bold text-gray-900">1,204</h3>
                    <p className="text-purple-600 text-xs mt-1">This month</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input placeholder="Search currencies..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Currency</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Code</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Symbol</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Exchange Rate</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Base</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {currencies.map((currency) => (
                                <tr key={currency.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-none border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <DollarSign size={18} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{currency.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">{currency.code}</Badge></td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-gray-900">{currency.symbol}</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">{currency.rate.toFixed(4)}</span>
                                            <TrendingUp size={12} className="text-green-600" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {currency.baseCurrency ? (
                                            <Badge className="bg-purple-600 text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5">Base</Badge>
                                        ) : (
                                            <span className="text-sm text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Switch checked={currency.status === "Active"} className="data-[state=checked]:bg-green-600" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {currencies.length} currencies</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">Update Exchange Rates <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></Button>
                </div>
            </div>
        </div>
    );
}
