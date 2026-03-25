"use client"

import { useState } from "react"
import {
    RefreshCw,
    Upload,
    Download,
    FileText,
    CheckCircle2,
    AlertCircle,
    Clock,
    ArrowRight,
    ShieldCheck,
    Search,
    Zap,
    ChevronRight,
    FileUp,
    Settings
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

export default function BulkSyncPage() {
    const [isUploading, setIsUploading] = useState(false)
    const [activeSync, setActiveSync] = useState(false)

    const handleUpload = () => {
        setIsUploading(true)
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 3000)),
            {
                loading: 'Processing CSV file...',
                success: 'Import successful! 128 users synchronized.',
                error: 'Failed to process file',
            }
        ).finally(() => setIsUploading(false))
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Bulk Synchronization"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Users", href: "#" },
                    { label: "Bulk sync", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            variant="outline"
                            size="sm"
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                            onClick={() => toast.info("Downloading CSV template...")}
                        >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Download template
                        </CustomButton>
                        <CustomButton
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-white"
                            onClick={() => setActiveSync(true)}
                        >
                            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Run SCIM sync
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Sync Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold text-zinc-400 tracking-wide leading-none mb-1">Last manual sync</p>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 italic">2 hours ago</h3>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold text-zinc-400 tracking-wide leading-none mb-1">SCIM 2.0 status</p>
                            <h3 className="text-xl font-bold text-emerald-600">Healthy</h3>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold text-zinc-400 tracking-wide leading-none mb-1">Sync conflicts</p>
                            <h3 className="text-xl font-bold text-red-600">00</h3>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Upload Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group">
                            <FileUp className="absolute -bottom-10 -right-10 h-64 w-64 text-zinc-100 dark:text-zinc-800/20 group-hover:scale-110 transition-transform pointer-events-none" />

                            <div className="relative z-10 space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Synchronize from CSV</h2>
                                    <p className="text-zinc-500 text-sm mt-1">Upload a user directory file to perform bulk creation and updates.</p>
                                </div>

                                <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer" onClick={handleUpload}>
                                    <div className="h-16 w-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-md flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform">
                                        <Upload className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Drop your CSV here</p>
                                    <p className="text-xs text-zinc-400 mt-1">Maximum file size 25MB (up to 10,000 users)</p>
                                </div>

                                {isUploading && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-blue-600">Syncing directory...</span>
                                            <span>82%</span>
                                        </div>
                                        <Progress value={82} className="h-2 bg-zinc-100" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Integration Info */}
                        <div className="bg-zinc-900 dark:bg-white rounded-[2rem] p-8 text-white dark:text-zinc-900 shadow-xl relative overflow-hidden">
                            <Zap className="absolute top-1/2 -translate-y-1/2 -right-10 h-40 w-40 opacity-10" />
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <h4 className="text-lg font-bold">Automated provisioning (SCIM)</h4>
                                    <p className="text-zinc-400 dark:text-zinc-500 text-xs max-w-md">Connect your HRIS or Identity Provider (Okta, Azure AD) for continuous user synchronization.</p>
                                </div>
                                <CustomButton className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold rounded-xl text-xs h-10 px-6 border-0 shadow-lg" onClick={() => toast.info("Configuring SCIM endpoint...")}>
                                    Setup automation <ArrowRight className="ml-2 w-4 h-4" />
                                </CustomButton>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                            <h5 className="text-sm font-bold mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-zinc-400" />
                                Sync history
                            </h5>
                            <div className="space-y-4">
                                {[
                                    { label: "Quarterly Audit Sync", date: "Today, 11:42 AM", status: "Success", users: 12 },
                                    { label: "Bulk Invite Imports", date: "Yesterday, 04:20 PM", status: "Success", users: 89 },
                                    { label: "Okta SCIM Sync", date: "Yesterday, 08:15 AM", status: "Warning", users: 1042 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{item.label}</span>
                                            <Badge variant="outline" className={`text-[8px] font-black px-1.5 py-0 ${item.status === 'Success' ? 'text-emerald-500' : 'text-amber-500'}`}>{item.status}</Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-zinc-400 font-medium">
                                            <span>{item.date}</span>
                                            <span>{item.users} affected</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <CustomButton variant="ghost" className="w-full mt-4 text-[11px] font-bold text-blue-600" onClick={() => toast.info("Viewing full sync audit trail")}>
                                View full logs <ChevronRight className="ml-1 w-3.5 h-3.5" />
                            </CustomButton>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-6">
                            <div className="flex items-center gap-2 text-blue-600 mb-2">
                                <Settings className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Configuration</span>
                            </div>
                            <h6 className="text-[11px] font-bold text-blue-900 dark:text-blue-100 mb-2">Sync behavior</h6>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="update" checked readOnly />
                                    <label htmlFor="update" className="text-[10px] font-medium text-zinc-500">Update existing identities</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="delete" />
                                    <label htmlFor="delete" className="text-[10px] font-medium text-zinc-500">Remove identities not in file</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
