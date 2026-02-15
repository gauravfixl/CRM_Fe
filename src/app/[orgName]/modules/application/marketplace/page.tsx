"use client";

import React, { useState } from "react";
import { ShoppingBag, Search, Filter, Star, Download, Globe, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";

export default function AppMarketplacePage() {
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [activeCategory, setActiveCategory] = useState("All");

    const apps = [
        { id: "1", name: "Advanced Analytics", category: "Reporting", rating: 4.8, reviews: 124, price: "$15/user", description: "Deep dive into your sales and customer data with AI-powered insights.", installed: false, icon: "📊" },
        { id: "2", name: "Slack Integration", category: "Communication", rating: 4.9, reviews: 856, price: "Free", description: "Get real-time notifications and manage deals directly from Slack.", installed: true, icon: "💬" },
        { id: "3", name: "email Hunter", category: "Lead Gen", rating: 4.5, reviews: 230, price: "$29/mo", description: "Find verify email addresses associated with any domain instantly.", installed: false, icon: "📧" },
        { id: "4", name: "DocuSign Connect", category: "Legal", rating: 4.7, reviews: 542, price: "$10/user", description: "Send, track, and sign documents without leaving your CRM.", installed: false, icon: "✍️" },
        { id: "5", name: "VoIP Caller", category: "Communication", rating: 4.2, reviews: 89, price: "$20/user", description: "Make calls directly from the browser with automatic call recording.", installed: false, icon: "📞" },
        { id: "6", name: "QuickBooks Sync", category: "Finance", rating: 4.6, reviews: 312, price: "$49/mo", description: "Two-way sync for invoices, expenses, and payments.", installed: true, icon: "💰" },
    ];

    const categories = ["All", "Communication", "Reporting", "Lead Gen", "Legal", "Finance"];

    const filteredApps = activeCategory === "All" ? apps : apps.filter(app => app.category === activeCategory);

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">App Marketplace</h1>
                    <p className="text-sm text-gray-600">Discover and install modules to extend your CRM capabilities.</p>
                </div>
                <Button className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6">
                    <ShoppingBag size={16} /> My Purchases
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Available Apps</p>
                    <h2 className="text-white text-2xl font-bold">142</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Across 12 categories</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Installed</p>
                    <h3 className="text-2xl font-bold text-gray-900">15</h3>
                    <p className="text-green-600 text-xs mt-1">Active extensions</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Updates Available</p>
                    <h3 className="text-2xl font-bold text-gray-900">3</h3>
                    <p className="text-blue-600 text-xs mt-1">New features</p>
                </div>
                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Total Spend</p>
                    <h3 className="text-2xl font-bold text-gray-900">$240.00</h3>
                    <p className="text-gray-600 text-xs mt-1">Monthly subscriptions</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Filters */}
                <div className="w-full md:w-64 bg-white border border-zinc-200 p-4 rounded-none shadow-lg h-fit">
                    <h3 className="font-bold text-gray-900 mb-4 px-2">Categories</h3>
                    <div className="space-y-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors rounded-none ${activeCategory === cat ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600" : "text-gray-600 hover:bg-zinc-50"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white border border-zinc-200 p-4 rounded-none shadow-lg flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input placeholder="Search for apps..." className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-zinc-50 focus:bg-white" />
                        </div>
                        <Button variant="outline" className="rounded-none border-zinc-200 gap-2"><Filter size={14} /> Sort</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredApps.map((app) => (
                            <div key={app.id} className="bg-white border border-zinc-200 rounded-none shadow-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between h-full group">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-zinc-100 rounded-none flex items-center justify-center text-2xl shadow-sm group-hover:bg-blue-50 transition-colors">
                                            {app.icon}
                                        </div>
                                        {app.installed ? (
                                            <Badge className="bg-green-50 text-green-700 border-green-200 rounded-none text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Installed
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                                {app.price}
                                            </Badge>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{app.name}</h3>
                                    <p className="text-xs text-blue-600 font-medium mb-2">{app.category}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{app.description}</p>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-center gap-1 mb-4">
                                        <Star size={14} className="text-orange-400 fill-orange-400" />
                                        <span className="text-sm font-bold text-gray-900">{app.rating}</span>
                                        <span className="text-xs text-gray-500">({app.reviews})</span>
                                    </div>
                                    <Button
                                        onClick={() => setSelectedApp(app)}
                                        className={`w-full rounded-none font-bold text-sm h-10 shadow-md ${app.installed ? "bg-white border border-zinc-200 text-gray-700 hover:bg-zinc-50" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"}`}
                                    >
                                        {app.installed ? "Configure" : "View Details"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
                <DialogContent className="max-w-3xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    {selectedApp && (
                        <>
                            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-20 h-20 bg-white/10 rounded-none flex items-center justify-center text-4xl backdrop-blur-sm border border-white/20">
                                            {selectedApp.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold">{selectedApp.name}</h2>
                                            <div className="flex items-center gap-4 mt-2">
                                                <Badge className="bg-white/20 text-white border-none rounded-none">{selectedApp.category}</Badge>
                                                <div className="flex items-center gap-1">
                                                    <Star size={14} className="text-orange-400 fill-orange-400" />
                                                    <span className="font-bold">{selectedApp.rating}</span>
                                                    <span className="text-sm opacity-80">({selectedApp.reviews} reviews)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-6 bg-white">
                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-6">
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Overview</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{selectedApp.description}. This integration allows seamless synchronization between your data and external workflows, ensuring maximum productivity for your team.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-3">Key Features</h3>
                                            <ul className="space-y-2">
                                                {["Real-time data sync", "Automated workflows", "Custom reporting dashboards", "Mobile app support"].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <CheckCircle2 size={14} className="text-green-600" /> {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-span-1 bg-zinc-50 p-6 border border-zinc-100 space-y-4 h-fit">
                                        <div className="flex justify-between items-center py-2 border-b border-zinc-200">
                                            <span className="text-xs text-gray-500 font-bold">VERSION</span>
                                            <span className="text-sm text-gray-900 font-bold">2.4.0</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-zinc-200">
                                            <span className="text-xs text-gray-500 font-bold">DEVELOPER</span>
                                            <span className="text-sm text-gray-900 font-bold">Fixl Inc.</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-zinc-200">
                                            <span className="text-xs text-gray-500 font-bold">WEBSITE</span>
                                            <a href="#" className="text-sm text-blue-600 font-bold flex items-center gap-1"><Globe size={12} /> Visit</a>
                                        </div>
                                        <Button className="w-full rounded-none bg-green-600 hover:bg-green-700 text-white font-bold h-12 shadow-lg shadow-green-100 mt-4">
                                            {selectedApp.installed ? "Open App" : `Install - ${selectedApp.price}`}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
