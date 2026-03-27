"use client"

import { useState } from "react"
import { Cloud, RefreshCw, Settings, Link2, Users, Clock, Activity } from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { showSuccess, showWarning } from "@/utils/toast"

export default function EntraUsersPage() {
    const [syncing, setSyncing] = useState(false)

    const handleSync = () => {
        setSyncing(true)
        showWarning("Sync cannot start - Entra ID is not configured")
        setTimeout(() => setSyncing(false), 1500)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Entra ID Sync"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Entra ID sync", href: "#" }
                ]}
                rightControls={
                    <CustomButton
                        size="sm"
                        className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-white"
                        onClick={handleSync}
                        disabled={syncing}
                    >
                        <RefreshCw className={`w-3.5 h-3.5 mr-2 ${syncing ? "animate-spin" : ""}`} />
                        Sync now
                    </CustomButton>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Description */}
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Directory synchronization</h2>
                    <p className="text-sm text-zinc-500 mt-1">Manage and monitor user synchronization from Microsoft Entra ID (formerly Azure AD).</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-zinc-400 leading-none">Synced users</p>
                            <p className="text-2xl font-semibold text-primary">0</p>
                        </div>
                        <div className="h-10 w-10 rounded-none bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-zinc-400 leading-none">Last sync</p>
                            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Never</p>
                        </div>
                        <div className="h-10 w-10 rounded-none bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-5 shadow-sm flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-semibold text-zinc-400 leading-none">Sync status</p>
                            <p className="text-2xl font-semibold text-amber-600">Not configured</p>
                        </div>
                        <div className="h-10 w-10 rounded-none bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                            <Activity className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Configuration Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-8 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-none bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <Cloud className="w-6 h-6" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Connect your Azure Entra ID to automatically sync users</h3>
                                <p className="text-xs text-zinc-500 mt-1 max-w-lg">Link your Microsoft Entra ID tenant to enable automatic user provisioning, de-provisioning, and profile synchronization.</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <CustomButton
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-white"
                                    onClick={() => showWarning("Configuration page coming soon")}
                                >
                                    <Settings className="w-3.5 h-3.5 mr-2" />
                                    Configure
                                </CustomButton>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                                <span className="text-xs font-medium text-zinc-500">Status: Not connected</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
