"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Shield,
    Save,
    Lock,
    Users,
    Check,
    ListChecks
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function IssuePermissionsPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)

    // Mock Permissions Matrix
    const [permissions, setPermissions] = useState([
        { id: "1", action: "Create Tasks", admin: true, member: true, viewer: false },
        { id: "2", action: "Edit Any Task", admin: true, member: false, viewer: false },
        { id: "3", action: "Edit Own Task", admin: true, member: true, viewer: false },
        { id: "4", action: "Delete Tasks", admin: true, member: false, viewer: false },
        { id: "5", action: "Move Status", admin: true, member: true, viewer: false },
        { id: "6", action: "Comment", admin: true, member: true, viewer: true },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const togglePermission = (id: string, role: 'admin' | 'member' | 'viewer') => {
        setPermissions(permissions.map(p => {
            if (p.id === id) {
                return { ...p, [role]: !p[role] }
            }
            return p
        }))
        toast.success("Permission updated")
    }

    const totalActions = permissions.length
    const memberEnabled = permissions.filter(p => p.member).length
    const viewerEnabled = permissions.filter(p => p.viewer).length

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Project governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Permissions</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Issue Permissions</h1>
                        <p className="text-xs text-gray-500 font-medium">Control strict access levels for project actions.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                            onClick={() => handleAction("Permissions saved globally")}
                            disabled={isLoading}
                        >
                            <Save className="w-3.5 h-3.5" />
                            Save Matrix
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-white/80">Roles configured</p>
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xl font-semibold text-white">3</p>
                        <p className="text-[10px] text-white/80">Admin, Member, Viewer</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Total actions</p>
                            <ListChecks className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{totalActions}</p>
                        <p className="text-[10px] text-gray-500">Permission rules</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Member access</p>
                            <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{memberEnabled}/{totalActions}</p>
                        <p className="text-[10px] text-gray-500">Actions enabled</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Viewer access</p>
                            <Lock className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{viewerEnabled}/{totalActions}</p>
                        <p className="text-[10px] text-gray-500">Actions enabled</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MATRIX TABLE */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Action</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center w-32">Admin</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center w-32">Member</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center w-32">Viewer</TableHead>
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
                                            onCheckedChange={() => togglePermission(p.id, 'admin')}
                                            disabled // Admins usually have all
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex justify-center">
                                        <Switch checked={p.member} onCheckedChange={() => togglePermission(p.id, 'member')} />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex justify-center">
                                        <Switch checked={p.viewer} onCheckedChange={() => togglePermission(p.id, 'viewer')} />
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
