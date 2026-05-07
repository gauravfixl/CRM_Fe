"use client"

import * as React from "react"
import { useState } from "react"
import { Lock, Save } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

const ROLES = [
    "Admin",
    "SCM Manager",
    "Inventory Manager",
    "Procurement Officer",
    "Warehouse Staff",
    "Logistics Manager",
    "Sales Team",
    "Vendor User",
] as const

const PERMISSIONS = ["View", "Create", "Edit", "Delete", "Approve", "Export", "Import"] as const

type Role = typeof ROLES[number]
type Permission = typeof PERMISSIONS[number]

const initialMatrix: Record<Role, Record<Permission, boolean>> = ROLES.reduce(
    (acc, role) => {
        acc[role] = PERMISSIONS.reduce((p, perm) => {
            // Sensible defaults
            const val =
                role === "Admin" ? true :
                role === "SCM Manager" ? perm !== "Delete" :
                role === "Vendor User" ? perm === "View" :
                perm === "View" || perm === "Create"
            p[perm] = val
            return p
        }, {} as Record<Permission, boolean>)
        return acc
    },
    {} as Record<Role, Record<Permission, boolean>>
)

export default function UserPermissionsPage() {
    const { toast } = useToast()
    const [matrix, setMatrix] = useState(initialMatrix)

    const toggle = (role: Role, perm: Permission) => {
        if (role === "Admin") return // Admin always has all
        setMatrix((m) => ({
            ...m,
            [role]: { ...m[role], [perm]: !m[role][perm] },
        }))
    }

    const onSave = () => {
        toast({ title: "Permissions saved", description: "Role permissions updated." })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">User Permissions</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Configure what each role can do across the SCM module.</p>
                </div>
                <Button onClick={onSave} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                    <Save className="w-4 h-4 mr-1.5" /> Save Permissions
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm overflow-x-auto">
                <table className="w-full text-[13px]">
                    <thead className="bg-[#F8FAFC] border-b border-[#EEF1F6]">
                        <tr className="text-[11.5px] uppercase tracking-wide text-[#64748B]">
                            <th className="text-left px-4 py-2.5 font-semibold sticky left-0 bg-[#F8FAFC] z-10">Role</th>
                            {PERMISSIONS.map((p) => (
                                <th key={p} className="text-center px-3 py-2.5 font-semibold">{p}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ROLES.map((role) => (
                            <tr key={role} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#FAFBFC]">
                                <td className="px-4 py-3 sticky left-0 bg-white">
                                    <div className="inline-flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5 text-[#94A3B8]" />
                                        <span className="font-semibold text-[#0F172A]">{role}</span>
                                    </div>
                                </td>
                                {PERMISSIONS.map((perm) => (
                                    <td key={perm} className="px-3 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={matrix[role][perm]}
                                            onChange={() => toggle(role, perm)}
                                            disabled={role === "Admin"}
                                            className="w-4 h-4 cursor-pointer accent-[#2563eb]"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-[12px] text-[#94A3B8]">
                <strong>Note:</strong> Admin role permissions are locked and cannot be modified.
            </p>
        </div>
    )
}
