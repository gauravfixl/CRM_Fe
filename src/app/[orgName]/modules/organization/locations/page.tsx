"use client"

import { useState } from "react"
import { MapPin, Plus, Search, Globe, Clock, Calendar, MoreVertical, ExternalLink, Building2, Phone, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Locations() {
    const [locations, setLocations] = useState([
        { id: 1, name: "Headquarters (HQ)", city: "New York", country: "USA", address: "One World Trade Center", timezone: "EST (UTC-5)", staff: 1200, status: "Primary" },
        { id: 2, name: "Innovation Hub", city: "London", country: "UK", address: "20 Fenchurch St", timezone: "GMT (UTC+0)", staff: 450, status: "Active" },
        { id: 3, name: "Global Delivery Center", city: "Bangalore", country: "India", address: "Outer Ring Rd, Embassy Tech Village", timezone: "IST (UTC+5:30)", staff: 2100, status: "Active" },
        { id: 4, name: "EMEA Operations", city: "Dubai", country: "UAE", address: "Dubai Silicon Oasis", timezone: "GST (UTC+4)", staff: 150, status: "Active" },
    ])

    return (
        <div className="relative min-h-screen">
            <SubHeader
                title="Physical Locations"
                breadcrumbItems={[
                    { label: "Home", href: "/" },
                    { label: "Organization", href: "/modules/organization/overview" },
                    { label: "Locations", href: "#" }
                ]}
                rightControls={
                    <CustomButton size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Register Location
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-6 space-y-6">
                {/* Statistics Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "Total Locations", value: "4", icon: MapPin, color: "text-blue-600" },
                        { label: "Primary HQ", value: "New York", icon: Building2, color: "text-amber-600" },
                        { label: "Active Presence", value: "4 Countries", icon: Globe, color: "text-emerald-600" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border flex items-center gap-4 shadow-sm">
                            <div className={`p-2.5 rounded-lg bg-zinc-50 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">{stat.label}</p>
                                <p className="text-sm font-bold text-zinc-900 leading-tight">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50/30">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <CustomInput placeholder="Filter by city or country..." className="pl-10 h-9 bg-white shadow-none" />
                        </div>
                        <CustomButton variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-900">
                            Download Site Report
                        </CustomButton>
                    </div>

                    <ScrollArea className="h-[calc(100vh-320px)]">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50/50 sticky top-0 z-10">
                                <tr className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider border-b">
                                    <th className="px-6 py-4">Site Name & Region</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Staff Strength</th>
                                    <th className="px-6 py-4">Local Timezone</th>
                                    <th className="px-6 py-4">Operating Hours</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {locations.map((loc) => (
                                    <tr key={loc.id} className="hover:bg-zinc-50/50 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex gap-4">
                                                <div className="p-2.5 rounded-xl bg-zinc-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors h-fit">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-zinc-900">{loc.name}</p>
                                                        <Badge variant="outline" className="text-[9px] py-0 h-4">{loc.country}</Badge>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 max-w-[200px] truncate">{loc.address}, {loc.city}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <Badge className={`${loc.status === 'Primary' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'} border-0 font-medium text-[10px]`}>
                                                {loc.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-zinc-900">{loc.staff.toLocaleString()}</span>
                                                <span className="text-[10px] text-zinc-400">Users</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-zinc-600">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span className="text-xs font-medium">{loc.timezone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-medium text-zinc-700">09:00 - 18:00</span>
                                                <span className="text-[10px] text-zinc-400">Monday - Friday</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <CustomButton variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-blue-600"><Phone className="w-3.5 h-3.5" /></CustomButton>
                                                <CustomButton variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-blue-600"><Calendar className="w-3.5 h-3.5" /></CustomButton>
                                                <CustomButton variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-blue-600"><MoreVertical className="w-3.5 h-3.5" /></CustomButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </ScrollArea>
                </div>

                {/* Info Board */}
                <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Globe className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="p-4 bg-white/20 rounded-2xl">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold">Holiday Calendars</h4>
                            <p className="text-blue-100 text-sm max-w-md">Assign country-specific holiday lists to locations for accurate attendance and resource planning.</p>
                        </div>
                    </div>
                    <CustomButton className="bg-white text-blue-600 hover:bg-zinc-100 h-10 px-8 font-bold text-xs relative z-10">
                        Manage Calendars
                    </CustomButton>
                </div>
            </div>
        </div>
    )
}
