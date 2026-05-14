"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Shield, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRolePermissionStore, type PermissionKey } from "@/shared/data/role-permission-store"

interface RouteGuardProps {
    /**
     * Permission required to view this page.
     * If user's effective role lacks this permission, an "Access Denied" screen is rendered.
     */
    required: PermissionKey
    /**
     * Optional friendly page name shown in the denial message.
     */
    pageName?: string
    children: React.ReactNode
}

/**
 * Frontend-only RBAC route guard.
 *
 * Resolves the "current user's role" from a localStorage key 'cubicle-current-role'
 * (set by the user via the Permissions page) and checks whether that role
 * has the `required` permission key. Defaults to "Admin" if unset — keeps
 * the app usable while the user explores.
 */
export default function RouteGuard({ required, pageName, children }: RouteGuardProps) {
    const [mounted, setMounted] = React.useState(false)
    const { roles } = useRolePermissionStore()
    const router = useRouter()

    React.useEffect(() => {
        setMounted(true)
        useRolePermissionStore.persist.rehydrate()
    }, [])

    if (!mounted) return null

    const currentRoleName = typeof window !== "undefined"
        ? (localStorage.getItem("cubicle-current-role") || "Admin")
        : "Admin"

    const role = roles.find(r => r.name === currentRoleName) || roles.find(r => r.name === "Admin")
    const allowed = role ? role.permissions[required] : true

    if (allowed) return <>{children}</>

    return (
        <div className="w-full h-full min-h-[60vh] flex items-center justify-center p-6">
            <div className="max-w-md text-center space-y-4 bg-white border border-slate-200 p-8 shadow-sm rounded-none">
                <div className="h-14 w-14 mx-auto bg-rose-100 text-rose-600 flex items-center justify-center rounded-none">
                    <Shield size={26} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
                    <p className="text-xs text-slate-500 mt-1">
                        You need the <span className="font-bold text-rose-600 uppercase">{required}</span> permission to view{pageName ? ` ${pageName}` : " this page"}.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2">Current role: <span className="font-bold text-slate-700">{currentRoleName}</span></p>
                </div>
                <div className="flex items-center gap-2 justify-center pt-2">
                    <Button variant="outline" onClick={() => router.back()} className="h-9 text-xs font-bold rounded-none gap-2">
                        <ArrowLeft size={12} /> Go Back
                    </Button>
                    <Button onClick={() => router.push("/projectmanagement/permissions")} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-none">
                        Open Permissions
                    </Button>
                </div>
            </div>
        </div>
    )
}
