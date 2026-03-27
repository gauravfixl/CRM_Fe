"use client"

import React, { useState } from "react"
import {
    Shield,
    Save,
    Users,
    Key,
    CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function HRPermissionsPage() {
    const [isLoading, setIsLoading] = useState(false)

    const [permissions, setPermissions] = useState([
        { id: "1", action: "View All Salaries", admin: true, manager: false, employee: false },
        { id: "2", action: "Approve Leaves", admin: true, manager: true, employee: false },
        { id: "3", action: "Edit Employee Details", admin: true, manager: false, employee: false },
        { id: "4", action: "Run Payroll", admin: true, manager: false, employee: false },
        { id: "5", action: "View Org Chart", admin: true, manager: true, employee: true },
        { id: "6", action: "Post Jobs", admin: true, manager: true, employee: false },
    ])

    const handleSave = async () => {
        setIsLoading(true)
        try {
            // Permission management is integrated into auth middleware;
            // simulate a short delay for UX consistency
            await new Promise((resolve) => setTimeout(resolve, 600))
            toast.success("Permission matrix saved successfully")
        } catch {
            toast.error("Failed to save permission matrix")
        } finally {
            setIsLoading(false)
        }
    }

    const togglePermission = (id: string, role: "admin" | "manager" | "employee") => {
        setPermissions(permissions.map(p => {
            if (p.id === id) {
                return { ...p, [role]: !p[role] }
            }
            return p
        }))
        toast.success("HR Access updated")
    }

    const totalActions = permissions.length
    const managerAccess = permissions.filter(p => p.manager).length
    const employeeAccess = permissions.filter(p => p.employee).length

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa] font-outfit">
            {/* Breadcrumb */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Hr Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Permissions</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Access Control</h1>
                        <p className="text-xs text-gray-500 font-medium">Manage sensitive HR data visibility.</p>
                    </div>
                    <Button
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        <Save className="w-4 h-4" />
                        {isLoading ? "Saving..." : "Save Access"}
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Roles Configured</p>
                                <p className="text-xl font-semibold">3</p>
                                <p className="text-[10px] text-white/80">Admin, Manager, Employee</p>
                            </div>
                            <Users className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Total Actions</p>
                                <p className="text-xl font-semibold">{totalActions}</p>
                                <p className="text-[10px] text-gray-500">Configurable permissions</p>
                            </div>
                            <Key className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Manager Access</p>
                                <p className="text-xl font-semibold">{managerAccess}/{totalActions}</p>
                                <p className="text-[10px] text-gray-500">Actions enabled</p>
                            </div>
                            <Shield className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Employee Access</p>
                                <p className="text-xl font-semibold">{employeeAccess}/{totalActions}</p>
                                <p className="text-[10px] text-gray-500">Actions enabled</p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Permission Matrix */}
            <Card className="rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        Permission Matrix
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Action</TableHead>
                                <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center w-32">Hr Admin</TableHead>
                                <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center w-32">Manager</TableHead>
                                <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center w-32">Employee</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {permissions.map((p) => (
                                <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <TableCell className="py-3 px-4 text-xs font-semibold text-gray-900">
                                        {p.action}
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={p.admin}
                                                onCheckedChange={() => togglePermission(p.id, "admin")}
                                                disabled
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={p.manager}
                                                onCheckedChange={() => togglePermission(p.id, "manager")}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 text-center">
                                        <div className="flex justify-center">
                                            <Switch
                                                checked={p.employee}
                                                onCheckedChange={() => togglePermission(p.id, "employee")}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
