"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ShoppingBag,
    Plus,
    Search,
    Filter,
    Box,
    Tag,
    Archive,
    History,
    MoreVertical,
    Activity,
    Edit3,
    Trash2,
    Copy,
    Share2,
    LayoutDashboard,
    Zap,
    TrendingUp,
    Shield,
    Flag,
    Settings,
    DollarSign,
    Layers,
    Warehouse,
    ArrowRight,
    SearchCheck,
    BarChart3
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function ProductsPage() {
    const [products, setProducts] = useState([
        {
            id: "PRD-201",
            name: "Enterprise ERP License",
            sku: "ERP-ENT-01",
            price: "$12,500.00",
            category: "Software",
            stock: "Unlimited",
            status: "Active",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            id: "PRD-202",
            name: "Cloud Storage 1TB (Annual)",
            sku: "CS-1TB-ANN",
            price: "$1,200.00",
            category: "Cloud Services",
            stock: "Unlimited",
            status: "Active",
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            id: "PRD-203",
            name: "Neural Vision Pro Hardware",
            sku: "NV-PRO-HW",
            price: "$4,500.00",
            category: "Hardware",
            stock: "42 Units",
            status: "Low Stock",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            id: "PRD-204",
            name: "Legacy Support Module",
            sku: "LSM-V2-LEG",
            price: "$900.00",
            category: "Add-ons",
            stock: "EOL",
            status: "Discontinued",
            color: "text-rose-600",
            bg: "bg-rose-50"
        }
    ])

    const handleDelete = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id))
        toast.error("Product node purged from catalog")
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FC] dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            <SubHeader
                title="Global Product Catalog"
                breadcrumbItems={[
                    { label: "Sales & Commerce", href: "#" },
                    { label: "Inventory", href: "#" },
                    { label: "Products & Services", href: "/modules/sales/products" }
                ]}
                rightControls={
                    <div className="flex items-center gap-3">
                        <CustomButton variant="outline" className="h-11 rounded-[24px] px-6 font-bold border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md italic flex items-center gap-2">
                            Batch Import
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-[24px] px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.03] transition-transform">
                            <Plus size={18} className="mr-2" /> Inject SKU
                        </CustomButton>
                    </div>
                }
            />

            <div className="flex-1 p-8 space-y-12 max-w-[1750px] mx-auto w-full">
                {/* Visual Inventory HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Active SKUs", value: "1,240", icon: Box, color: "text-blue-600", trend: "+4% Growth" },
                        { label: "Inventory Value", value: "$4.2M", icon: Warehouse, color: "text-emerald-600", trend: "Q1 Stable" },
                        { label: "Margin Average", value: "64%", icon: TrendingUp, color: "text-amber-600", trend: "High Yield" },
                        { label: "Stock Velocity", value: "92%", icon: Zap, color: "text-purple-600", trend: "Elite Flow" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-2xl border-zinc-200 dark:border-zinc-800 rounded-[48px] p-10 shadow-xl relative group overflow-hidden transition-all hover:translate-y-[-8px]">
                            <stat.icon className={`absolute -right-4 -bottom-4 h-24 w-24 opacity-5 ${stat.color} group-hover:scale-110 transition-transform duration-[1500ms]`} />
                            <div className="relative z-10 flex flex-col justify-end min-h-[100px]">
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.25em] mb-4 italic leading-tight">{stat.label}</p>
                                <div className="flex items-baseline gap-3">
                                    <h2 className="text-5xl font-black tracking-tighter italic">{stat.value}</h2>
                                    <Badge className="bg-zinc-50 dark:bg-zinc-800 text-[8px] font-black italic border-none p-1">{stat.trend}</Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Main Product Table Control */}
                <div className="bg-white dark:bg-zinc-900 rounded-[64px] border border-zinc-200 dark:border-zinc-800 shadow-3xl flex flex-col transition-all overflow-hidden lg:min-h-[600px]">
                    <div className="p-14 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-50/20 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-10">
                            <div className="h-20 w-20 bg-blue-600 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-600/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <ShoppingBag size={40} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white uppercase italic">Product Asset Ledger</h3>
                                <p className="text-sm font-black text-zinc-400 mt-3 uppercase tracking-widest italic opacity-70">Unified management of physical and digital products across global warehouses.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-96">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <CustomInput placeholder="Search SKU, name, or category..." className="pl-14 h-14 rounded-[28px] bg-white border-zinc-200 shadow-inner font-bold italic" />
                            </div>
                            <CustomButton variant="outline" className="h-14 w-14 rounded-[24px] p-0 border-zinc-200 bg-white hover:bg-zinc-50">
                                <Filter size={24} className="text-zinc-400" />
                            </CustomButton>
                        </div>
                    </div>

                    <div className="px-8 pb-14 mt-10">
                        <div className="grid grid-cols-12 px-14 mb-8 text-[11px] font-black uppercase text-zinc-400 tracking-[0.2em] italic">
                            <div className="col-span-4">Asset Identification</div>
                            <div className="col-span-2 text-center">SKU / Class</div>
                            <div className="col-span-2 text-center">Fiscal Unit</div>
                            <div className="col-span-2 text-center">Liquidity / Stock</div>
                            <div className="col-span-2 text-right">Goverance</div>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {products.map((prd, idx) => (
                                <motion.div
                                    key={prd.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group grid grid-cols-12 items-center p-10 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-[56px] border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl transition-all duration-500 mb-6"
                                >
                                    <div className="col-span-4 flex items-center gap-8">
                                        <div className={`h-16 w-16 rounded-[24px] ${prd.bg} ${prd.color} flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-700`}>
                                            <span className="text-2xl font-black italic">{prd.name.charAt(0)}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black uppercase tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors uppercase italic">{prd.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <Badge className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${prd.bg} ${prd.color} border-none`}>{prd.category}</Badge>
                                                <span className="h-1 w-1 rounded-full bg-zinc-200" />
                                                <span className="text-[10px] font-black text-zinc-300 uppercase italic tracking-tighter">{prd.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex flex-col items-center">
                                        <span className="text-xl font-black italic text-zinc-900 dark:text-white uppercase">{prd.sku}</span>
                                        <span className="text-[9px] font-black text-zinc-400 italic mt-1 uppercase tracking-widest uppercase">Class-A Asset</span>
                                    </div>

                                    <div className="col-span-2 flex flex-col items-center">
                                        <span className="text-2xl font-black italic tracking-tighter text-zinc-900 dark:text-white">{prd.price}</span>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">+12% MARGIN</span>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex flex-col items-center">
                                        <span className="text-xl font-black italic text-zinc-900 dark:text-white uppercase">{prd.stock}</span>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className={`h-1.5 w-1.5 rounded-full ${prd.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : prd.status === 'Low Stock' ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'}`} />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{prd.status}</span>
                                        </div>
                                    </div>

                                    <div className="col-span-2 flex items-center justify-end gap-3">
                                        <CustomButton variant="outline" className="h-12 w-12 rounded-2xl border-zinc-100 font-bold p-0">
                                            <Archive size={20} className="text-zinc-300 group-hover:text-blue-500" />
                                        </CustomButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-white/50 border border-zinc-100 group-hover:shadow-lg transition-all">
                                                    <MoreVertical size={20} className="text-zinc-400" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-[40px] w-64 p-3 shadow-4xl bg-white dark:bg-zinc-900 border-zinc-100">
                                                <DropdownMenuItem className="rounded-3xl gap-4 font-bold px-10 py-6 text-sm italic uppercase tracking-tighter"><Edit3 size={20} /> Modify Asset</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-3xl gap-4 font-bold px-10 py-6 text-sm italic uppercase tracking-tighter"><BarChart3 size={20} /> View Analytics</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-3xl gap-4 font-bold px-10 py-6 text-sm italic uppercase tracking-tighter"><Copy size={20} /> Clone SKU</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(prd.id)} className="rounded-3xl gap-4 font-bold px-10 py-6 text-sm text-red-600 focus:bg-red-600 focus:text-white font-black italic uppercase"><Trash2 size={20} /> expunge asset</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <div className="py-12 flex flex-col items-center justify-center space-y-6">
                            <CustomButton variant="ghost" className="h-20 px-24 rounded-full border-2 border-dashed border-zinc-100 text-zinc-300 font-black uppercase italic tracking-[0.4em] hover:bg-zinc-50 hover:text-blue-600 hover:border-blue-400 transition-all flex items-center gap-6 text-sm">
                                <Plus size={28} /> Synchronize Global Catalog
                            </CustomButton>
                        </div>
                    </div>
                </div>

                {/* Intelligent Insights Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Card className="rounded-[72px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-600 shadow-inner">
                                <Zap size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none text-zinc-900 dark:text-white uppercase italic">Neural Supply Optimizer</h3>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Autonomous inventory calibration and predictive restock.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: "Deterministic Demand Shield", desc: "Flag SKUs with high return rates in specific regional clusters.", status: "MONITORING" },
                                { label: "Auto-Restock Calibration", desc: "Instantly trigger purchase orders when stock hits risk levels.", status: "ENFORCED" },
                            ].map((rule, i) => (
                                <div key={i} className="flex items-center justify-between p-10 bg-zinc-50 dark:bg-zinc-800/40 rounded-[48px] border border-zinc-100/50 hover:border-blue-300 transition-all">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black uppercase tracking-tight italic leading-none">{rule.label}</h4>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 italic tracking-widest">{rule.desc}</p>
                                    </div>
                                    <Badge className="bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-200 px-4 py-2 font-black italic text-[9px] uppercase">{rule.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[72px] p-16 bg-zinc-900 border-0 shadow-3xl text-white relative overflow-hidden group">
                        <Layers className="absolute -bottom-20 -right-20 h-96 w-96 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-[2000ms]" />
                        <div className="relative z-10 space-y-12">
                            <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Catalog Segmentation Mesh</h3>
                            <p className="text-xl font-bold text-zinc-400 italic uppercase tracking-[0.1em] leading-relaxed">Map your entire product taxonomy into corporate hierarchies and regional availability matrixes instantly.</p>
                            <div className="pt-10 flex flex-col gap-8">
                                <CustomButton className="bg-white text-zinc-900 rounded-[36px] h-20 w-full font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform text-base italic flex items-center justify-center gap-4">
                                    Initialize Segmentation <ArrowRight size={24} />
                                </CustomButton>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
