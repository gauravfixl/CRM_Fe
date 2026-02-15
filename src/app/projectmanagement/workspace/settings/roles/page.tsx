"use client"

import React from "react"
import { Shield, Plus, MoreHorizontal, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ROLES = [
    { title: 'Workspace Admin', users: 2, level: 'Superuser', desc: 'Full architectural control over the entire workspace and settings.' },
    { title: 'Project Manager', users: 5, level: 'Elevated', desc: 'Can create projects, manage teams, and adjust workflows.' },
    { title: 'Team Member', users: 24, level: 'Standard', desc: 'Can update tasks, upload documents, and collaborate.' },
    { title: 'Guest Viewer', users: 12, level: 'Restricted', desc: 'Read-only access to specific project boards and docs.' },
]

export default function RolesSettingsPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Security Matrix</h3>
                    <p className="text-slate-500 font-medium text-[13px]">Define granular access levels and operational permissions for workspace entities.</p>
                </div>
                <Button className="h-10 px-6 bg-slate-900 text-white rounded-xl font-bold text-[12px] gap-2 shadow-lg shadow-slate-100">
                    <Plus size={16} />
                    Create Custom Role
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ROLES.map((role, i) => (
                    <Card key={i} className="group border-none shadow-sm bg-white rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                                    <Shield size={24} />
                                </div>
                                <div className="text-right">
                                    <Badge className="bg-slate-900 text-white border-none font-bold text-[9px] px-2 h-5">{role.level}</Badge>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">{role.users} Active Users</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-none">{role.title}</h4>
                                <p className="text-[12px] font-medium text-slate-500 leading-relaxed">{role.desc}</p>
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <button className="text-[11px] font-bold text-indigo-600 hover:underline">Edit Privileges</button>
                                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Permission Table Preview */}
            <div className="bg-white border-2 border-slate-50 rounded-[48px] overflow-hidden shadow-sm">
                <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <Info size={18} className="text-indigo-600" />
                        <h4 className="text-[14px] font-bold text-slate-800">Global Permission Sets</h4>
                    </div>
                </div>
                <div className="p-10 space-y-6">
                    <div className="space-y-4">
                        {[
                            { action: 'Create Projects', admin: true, manager: true, member: false, guest: false },
                            { action: 'Delete Workspace', admin: true, manager: false, member: false, guest: false },
                            { action: 'Invite Members', admin: true, manager: true, member: false, guest: false },
                            { action: 'Export Data', admin: true, manager: true, member: true, guest: false },
                        ].map((perm, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-indigo-100 transition-all">
                                <span className="text-[13px] font-bold text-slate-700 tracking-tight">{perm.action}</span>
                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={perm.admin ? "text-indigo-600" : "text-slate-200"}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400">Admin</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={perm.manager ? "text-indigo-600" : "text-slate-200"}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400">Manager</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={perm.member ? "text-indigo-600" : "text-slate-200"}>
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-400">Member</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 text-center">
                        <p className="text-[11px] font-bold text-amber-600 bg-amber-50 inline-flex px-4 py-2 rounded-full items-center gap-2">
                            <AlertCircle size={14} />
                            Careful: Changing global permissions affects all active users instantly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
