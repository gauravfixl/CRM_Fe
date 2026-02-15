"use client"

import { useState } from "react"
import { Network, Plus, Search, MoreVertical, Users, User, ChevronRight, Filter, Building2, LayoutGrid, List } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function BusinessUnits() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [units, setUnits] = useState([
        { id: 1, name: "Sales & Marketing", head: "John Doe", members: 45, status: "Active", parent: "Corporate" },
        { id: 2, name: "Engineering", head: "Sarah Chen", members: 128, status: "Active", parent: "Corporate" },
        { id: 3, name: "Product Management", head: "Mike Ross", members: 22, status: "Active", parent: "Corporate" },
        { id: 4, name: "Human Resources", head: "Emma Watson", members: 12, status: "Active", parent: "Operations" },
        { id: 5, name: "Finance", head: "Robert Green", members: 15, status: "Active", parent: "Operations" },
        { id: 6, name: "Customer Support", head: "Lisa Ray", members: 60, status: "Active", parent: "Operations" },
    ])

    return (
        <div className="relative min-h-screen">
            <SubHeader
                title="Business Units"
                breadcrumbItems={[
                    { label: "Home", href: "/" },
                    { label: "Organization", href: "/modules/organization/overview" },
                    { label: "Business Units", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                            {viewMode === 'grid' ? <List className="w-4 h-4 mr-2" /> : <LayoutGrid className="w-4 h-4 mr-2" />}
                            {viewMode === 'grid' ? 'List View' : 'Grid View'}
                        </CustomButton>
                        <CustomButton size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                            <Plus className="w-4 h-4 mr-1.5" />
                            Add Business Unit
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-6 space-y-4">
                {/* Filters Bar */}
                <div className="bg-white p-3 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <CustomInput
                            placeholder="Search business units..."
                            className="pl-10 h-9 bg-zinc-50 border-zinc-100"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 cursor-pointer">All Units</Badge>
                        <Badge variant="secondary" className="bg-white text-zinc-500 border-zinc-100 hover:bg-zinc-50 cursor-pointer">Corporate</Badge>
                        <Badge variant="secondary" className="bg-white text-zinc-500 border-zinc-100 hover:bg-zinc-50 cursor-pointer">Operations</Badge>
                    </div>
                </div>

                <ScrollArea className="h-[calc(100vh-220px)]">
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {units.map((unit) => (
                                <SmallCard key={unit.id} className="group hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
                                    <SmallCardContent className="p-5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                                                <Network className="w-5 h-5" />
                                            </div>
                                            <button className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-zinc-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">{unit.name}</h3>
                                            <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                                                <Building2 className="w-3 h-3" />
                                                Parent: {unit.parent}
                                            </p>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="h-7 w-7 border">
                                                    <AvatarFallback className="text-[10px] font-bold bg-zinc-100">{unit.head.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-zinc-800 truncate">{unit.head}</p>
                                                    <p className="text-[10px] text-zinc-400">Unit Manager</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-zinc-900">{unit.members}</p>
                                                <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">Members</p>
                                            </div>
                                        </div>
                                    </SmallCardContent>
                                </SmallCard>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50/50 border-b">
                                    <tr className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                        <th className="px-6 py-4">Unit Name</th>
                                        <th className="px-6 py-4">Parent</th>
                                        <th className="px-6 py-4">Manager</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-center">Members</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100">
                                    {units.map((unit) => (
                                        <tr key={unit.id} className="hover:bg-zinc-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer">{unit.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="text-[10px] font-medium text-zinc-500 bg-zinc-50/50">{unit.parent}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold border">
                                                        {unit.head.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-xs font-medium text-zinc-700">{unit.head}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                    <span className="text-xs font-medium text-zinc-600">{unit.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-xs font-bold text-zinc-900">{unit.members}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1 px-2 hover:bg-zinc-100 rounded-lg text-zinc-300 hover:text-zinc-600 transition-all">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}
