"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, ArrowRight, Users, Lock, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRolePermissionStore } from "@/shared/data/role-permission-store"

export default function RolesSettingsPage() {
    const router = useRouter()
    const { roles } = useRolePermissionStore()

    useEffect(() => {
        useRolePermissionStore.persist.rehydrate()
    }, [])

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Roles & Permissions</h3>
                    <p className="text-slate-500 font-medium text-[13px]">Manage roles and access levels — full editor lives in the Permissions page.</p>
                </div>
                <Link href="/projectmanagement/permissions">
                    <Button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 rounded-none">
                        Open Full Editor <ArrowRight size={14} />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map(role => {
                    const grantedCount = Object.values(role.permissions).filter(Boolean).length
                    return (
                        <Card key={role.id} className="border border-slate-200 shadow-sm bg-white rounded-none hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/projectmanagement/permissions")}>
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="h-11 w-11 bg-indigo-50 text-indigo-700 flex items-center justify-center rounded-none">
                                        <Shield size={20} />
                                    </div>
                                    <div className="text-right">
                                        <Badge className="bg-slate-900 text-white text-[9px] font-bold rounded-none">{role.isSystem ? "SYSTEM" : "CUSTOM"}</Badge>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1 justify-end"><Users size={10} /> {role.members} users</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-bold text-slate-800">{role.name}</h4>
                                    <p className="text-[12px] font-medium text-slate-500">{role.description}</p>
                                </div>
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <Badge className="bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-none">{grantedCount}/5 permissions</Badge>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                        {role.permissions.admin && <Lock size={12} className="text-rose-500" />}
                                        {role.permissions.view && <Eye size={12} className="text-indigo-500" />}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
