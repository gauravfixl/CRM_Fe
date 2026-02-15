"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Globe,
    Building2,
    CheckCircle2,
    XCircle,
    Download,
    Upload,
    History,
    Edit3,
    Trash2,
    Copy,
    Share2,
    Star,
    ShieldCheck,
    ArrowRight,
    SearchCheck,
    Activity,
    Target
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function CRMContactsPage() {
    const [contacts, setContacts] = useState([
        {
            id: "1",
            name: "Alexander Pierce",
            role: "Chief Technology Officer",
            company: "Globex Corp",
            email: "alex.p@globex.com",
            phone: "+1 (555) 0123",
            socials: ["L", "T"],
            status: "VIP",
            type: "Key Stakeholder",
            score: 92,
            active: true,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            id: "2",
            name: "Sarah Montgomery",
            role: "Product Director",
            company: "Acme Inc",
            email: "sarah.m@acme.inc",
            phone: "+1 (555) 8821",
            socials: ["L"],
            status: "New",
            type: "Qualified Lead",
            score: 78,
            active: true,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            id: "3",
            name: "John Wick",
            role: "Operations Lead",
            company: "Continental",
            email: "j.wick@high-table.com",
            phone: "+1 (555) 9999",
            socials: ["L", "X"],
            status: "Critical",
            type: "Churn Risk",
            score: 45,
            active: true,
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
        {
            id: "4",
            name: "Elliot Alderson",
            role: "Security Engineer",
            company: "E-Corp",
            email: "e.alderson@ecorp.com",
            phone: "+1 (555) 5050",
            socials: ["T"],
            status: "Standard",
            type: "Prospect",
            score: 64,
            active: false,
            color: "text-amber-600",
            bg: "bg-amber-50"
        }
    ])

    const handleDelete = (id: string) => {
        setContacts(prev => prev.filter(c => c.id !== id))
        toast.error("Contact expunged from directory")
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FC] dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            <SubHeader
                title="Identity Directory"
                breadcrumbItems={[
                    { label: "CRM System", href: "#" },
                    { label: "Accounts", href: "#" },
                    { label: "Contacts", href: "/modules/crm/contacts" }
                ]}
                rightControls={
                    <div className="flex items-center gap-3">
                        <CustomButton variant="outline" className="h-11 rounded-[24px] px-6 font-bold border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md italic flex items-center gap-2">
                            <Upload size={16} /> Import .CSV
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-[24px] px-8 font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-[1.03] transition-transform">
                            <Plus size={18} className="mr-2" /> Initialize Identity
                        </CustomButton>
                    </div>
                }
            />

            <div className="flex-1 p-8 space-y-12 max-w-[1750px] mx-auto w-full">
                {/* Visual Intelligence HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: "Managed Identities", value: "4,212", icon: Users, color: "text-blue-600" },
                        { label: "Reachability Rate", value: "94.2%", icon: Activity, color: "text-emerald-600" },
                        { label: "Engagement Meta", value: "High", icon: Target, color: "text-purple-600" },
                        { label: "Security Cleared", value: "100%", icon: ShieldCheck, color: "text-amber-600" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-2xl border-zinc-200 dark:border-zinc-800 rounded-[48px] p-10 shadow-xl relative group overflow-hidden transition-all hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] hover:translate-y-[-8px]">
                            <stat.icon className={`absolute -right-4 -bottom-4 h-24 w-24 opacity-5 ${stat.color} group-hover:scale-110 transition-transform duration-[1500ms]`} />
                            <div className="relative z-10 flex flex-col justify-end min-h-[100px]">
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.25em] mb-4 italic leading-tight">{stat.label}</p>
                                <h2 className="text-5xl font-black tracking-tighter italic">{stat.value}</h2>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Main Directory Table Control */}
                <div className="bg-white dark:bg-zinc-900 rounded-[64px] border border-zinc-200 dark:border-zinc-800 shadow-3xl flex flex-col transition-all overflow-hidden">
                    <div className="p-14 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-10 bg-zinc-50/20 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-10">
                            <div className="h-20 w-20 bg-indigo-600 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-600/30 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Users size={40} />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Global Identity Ledger</h3>
                                <p className="text-sm font-black text-zinc-400 mt-3 uppercase tracking-widest italic opacity-70">Unified directory of all business relationships and personas.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative w-96">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                <CustomInput placeholder="Search identities, roles, or companies..." className="pl-14 h-14 rounded-[28px] bg-white border-zinc-200 shadow-inner font-bold italic" />
                            </div>
                            <CustomButton variant="outline" className="h-14 w-14 rounded-[24px] p-0 border-zinc-200 bg-white hover:bg-zinc-50">
                                <Filter size={24} className="text-zinc-400" />
                            </CustomButton>
                        </div>
                    </div>

                    <div className="p-10 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {contacts.map((contact, idx) => (
                                <motion.div
                                    key={contact.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group flex flex-col lg:flex-row items-center justify-between p-10 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-[56px] border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-500 gap-10"
                                >
                                    <div className="flex items-center gap-10 w-full lg:w-auto">
                                        <div className={`h-24 w-24 rounded-[36px] ${contact.bg} flex items-center justify-center shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-700`}>
                                            <span className={`text-4xl font-black italic ${contact.color}`}>{contact.name.charAt(0)}</span>
                                            <div className="absolute bottom-0 right-0 h-8 w-8 bg-white dark:bg-zinc-900 rounded-tl-2xl flex items-center justify-center">
                                                <Star size={14} className={contact.status === 'VIP' ? 'text-amber-500' : 'text-zinc-200'} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-4">
                                                <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none group-hover:text-indigo-600 transition-colors uppercase">{contact.name}</h4>
                                                <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest border-none ${contact.bg} ${contact.color} shadow-sm uppercase italic`}>{contact.status}</Badge>
                                            </div>
                                            <p className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-3 italic">
                                                {contact.role} <span className="h-1.5 w-1.5 rounded-full bg-zinc-200" /> <span className="text-zinc-600">{contact.company}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-1 w-full lg:w-auto px-10 border-x border-zinc-100 dark:border-zinc-800 border-dashed">
                                        <div className="flex flex-col items-center justify-center text-center space-y-2 group/item cursor-pointer">
                                            <Mail size={24} className="text-zinc-300 group-hover/item:text-indigo-500 transition-colors" />
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 group-hover/item:text-zinc-900 transition-colors truncate max-w-[120px]">{contact.email}</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center space-y-2 group/item cursor-pointer">
                                            <Phone size={24} className="text-zinc-300 group-hover/item:text-indigo-500 transition-colors" />
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400 group-hover/item:text-zinc-900 transition-colors truncate max-w-[120px]">{contact.phone}</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <div className="h-10 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center gap-2 overflow-hidden shadow-inner">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="h-6 w-6 rounded-full bg-white dark:bg-zinc-700 border border-zinc-100 flex items-center justify-center text-[8px] font-black italic text-zinc-400 hover:text-indigo-600 transition-colors grayscale hover:grayscale-0">L</div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400">Footprint</span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            <span className={`text-2xl font-black italic ${contact.score > 80 ? 'text-emerald-500' : contact.score < 50 ? 'text-rose-500' : 'text-blue-500'}`}>{contact.score}</span>
                                            <span className="text-[10px] font-black uppercase italic text-zinc-400">Score</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">{contact.active ? 'ACTIVE TRUNCATION OFF' : 'INACTIVE NODE'}</span>
                                            <Switch checked={contact.active} className="data-[state=checked]:bg-indigo-600 scale-125" />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" className="h-16 w-16 p-0 rounded-[28px] bg-zinc-50 border border-zinc-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                                    <MoreVertical size={24} className="text-zinc-400" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-[32px] w-64 p-2 shadow-3xl bg-white/95 backdrop-blur-xl border-zinc-100">
                                                <DropdownMenuItem className="rounded-3xl gap-4 font-bold px-8 py-5 text-sm italic uppercase tracking-tighter"><Edit3 size={18} /> Modify Identity</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-3xl gap-4 font-bold px-8 py-5 text-sm italic uppercase tracking-tighter"><SearchCheck size={18} /> Deep Insight Audit</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-3xl gap-4 font-bold px-8 py-5 text-sm italic uppercase tracking-tighter"><History size={18} /> Lifecycle Log</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(contact.id)} className="rounded-3xl gap-4 font-bold px-8 py-5 text-sm text-red-600 focus:bg-red-600 focus:text-white font-black italic uppercase tracking-tighter"><Trash2 size={18} /> Expunge Identity</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Pagination / Load More */}
                        <div className="py-10 flex flex-col items-center justify-center space-y-6">
                            <CustomButton variant="ghost" className="h-16 px-16 rounded-full border-2 border-dashed border-zinc-100 text-zinc-300 font-black uppercase italic tracking-[0.3em] hover:bg-zinc-50 hover:text-indigo-600 hover:border-indigo-400 transition-all flex items-center gap-4">
                                <Plus size={24} /> Sync Remaining Blocks
                            </CustomButton>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic opacity-40">Showing 4 of 4,212 identified personas in global database.</p>
                        </div>
                    </div>
                </div>

                {/* Intelligence Insights row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Card className="rounded-[64px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-600 shadow-inner">
                                <Activity size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Behavioral Analytics</h3>
                                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">Reputation and trust vector monitoring.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {[
                                { label: "Deterministic Fraud Shield", desc: "Cross-reference identity signals with global blacklists.", status: "ENFORCED" },
                                { label: "Persona Integrity Check", desc: "Validate contact emails and phone numbers via Neural API.", status: "IDLE" },
                            ].map((rule, i) => (
                                <div key={i} className="flex items-center justify-between p-10 bg-zinc-50 dark:bg-zinc-800/40 rounded-[40px] border border-zinc-100/50 hover:border-blue-300 transition-all">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black uppercase tracking-tight italic leading-none">{rule.label}</h4>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2 italic tracking-widest">{rule.desc}</p>
                                    </div>
                                    <Badge className="bg-white dark:bg-zinc-900 text-zinc-400 border border-zinc-200 px-4 py-2 font-black italic text-[9px] uppercase">{rule.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[64px] p-16 bg-zinc-900 border-0 shadow-3xl text-white relative overflow-hidden group">
                        <Building2 className="absolute -bottom-20 -right-20 h-96 w-96 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-[2000ms]" />
                        <div className="relative z-10 space-y-12">
                            <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Organization Meta-Engine</h3>
                            <p className="text-lg font-bold text-zinc-400 italic uppercase tracking-[0.1em] leading-relaxed">Automatically map and cluster contacts into tiered corporate account hierarchies.</p>
                            <div className="pt-10">
                                <CustomButton className="bg-white text-zinc-900 rounded-[32px] h-20 w-full font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-transform text-base italic flex items-center justify-center gap-4">
                                    Run Global Account Audit <ArrowRight size={20} />
                                </CustomButton>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
