"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Shield,
    Save,
    Lock,
    Users,
    Key
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function HRPermissionsPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)

    // Mock Permissions Matrix
    const [permissions, setPermissions] = useState([
        { id: "1", action: "View All Salaries", admin: true, manager: false, employee: false },
        { id: "2", action: "Approve Leaves", admin: true, manager: true, employee: false },
        { id: "3", action: "Edit Employee Details", admin: true, manager: false, employee: false },
        { id: "4", action: "Run Payroll", admin: true, manager: false, employee: false },
        { id: "5", action: "View Org Chart", admin: true, manager: true, employee: true },
        { id: "6", action: "Post Jobs", admin: true, manager: true, employee: false },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const togglePermission = (id: string, role: 'admin' | 'manager' | 'employee') => {
        setPermissions(permissions.map(p => {
            if (p.id === id) {
                return { ...p, [role]: !p[role] }
            }
            return p
        }))
        toast.success("HR Access updated")
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HR GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">PERMISSIONS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Access Control</h1>
                        <p className="text-xs text-zinc-500 font-medium">Manage sensitive HR data visibility.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                            onClick={() => handleAction("Security matrix saved")}
                            disabled={isLoading}
                        >
                            <Save className="w-3.5 h-3.5 mr-2" />
                            Save Access
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Restricted</p>
                        <Lock className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">High</p>
                        <p className="text-[10px] text-white">Security Level</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MATRIX TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Privilege</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center w-32">HR Admin</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center w-32">Manager</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center w-32">Employee</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissions.map((p) => (
                            <TableRow key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="py-3 px-4 text-xs font-bold text-zinc-900">
                                    {p.action}
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex justify-center">
                                        <Switch
                                            checked={p.admin}
                                            onCheckedChange={() => togglePermission(p.id, 'admin')}
                                            disabled // Admins usually have all
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex justify-center">
                                        <Switch checked={p.manager} onCheckedChange={() => togglePermission(p.id, 'manager')} />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex justify-center">
                                        <Switch checked={p.employee} onCheckedChange={() => togglePermission(p.id, 'employee')} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
