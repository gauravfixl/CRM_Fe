"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Trash2,
    RefreshCcw,
    Search,
    RotateCcw,
    AlertTriangle,
    Archive,
    Trash,
    Clock,
    HardDrive,
    AlertOctagon,
    MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ClientTrashPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedClient, setSelectedClient] = useState<any>(null)
    const [showRestoreDialog, setShowRestoreDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const [deletedClients, setDeletedClients] = useState([
        { id: "1", name: "Old Dominion Corp", deletedBy: "John Doe", deletedAt: "2023-10-25", daysRemaining: 12, reason: "Contract Expired" },
        { id: "2", name: "Beta Solutions", deletedBy: "Sarah Smith", deletedAt: "2023-11-01", daysRemaining: 19, reason: "Duplicate Account" },
        { id: "3", name: "Gamma Ventures", deletedBy: "System Admin", deletedAt: "2023-11-05", daysRemaining: 23, reason: "Testing Purpose" },
        { id: "4", name: "Delta Group", deletedBy: "Mike Brown", deletedAt: "2023-10-20", daysRemaining: 7, reason: "Client Request" },
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1000)
    }

    const handleRestoreClick = (client: any) => {
        setSelectedClient(client)
        setShowRestoreDialog(true)
    }

    const handleDeleteClick = (client: any) => {
        setSelectedClient(client)
        setShowDeleteDialog(true)
    }

    const confirmRestore = () => {
        if (selectedClient) {
            setDeletedClients(prev => prev.filter(c => c.id !== selectedClient.id))
            toast.success(`Client "${selectedClient.name}" has been restored successfully`)
            setShowRestoreDialog(false)
            setSelectedClient(null)
        }
    }

    const confirmDelete = () => {
        if (selectedClient) {
            setDeletedClients(prev => prev.filter(c => c.id !== selectedClient.id))
            toast.success(`Client "${selectedClient.name}" permanently deleted`)
            setShowDeleteDialog(false)
            setSelectedClient(null)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-rose-500/70 to-rose-600 flex items-center justify-center text-white shadow-sm">
                        <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-sm font-semibold text-zinc-900">Trash & Recovery</h1>
                            <Badge className="bg-rose-50 text-rose-600 border-none text-[10px] font-medium px-2 rounded-md">30-Day Retention</Badge>
                        </div>
                        <p className="text-xs text-slate-500">Manage deleted client records. Items are permanently removed after 30 days.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Trash refreshed")}
                        className="h-8 border text-xs font-medium px-4 rounded-lg shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-3.5 h-3.5 mr-2" />
                        Refresh
                    </Button>
                    <Button
                        variant="destructive"
                        className="h-8 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-4 rounded-lg shadow-sm active:scale-95 transition-all"
                        onClick={() => handleAction("Empty trash process started")}
                    >
                        <Trash className="w-3.5 h-3.5 mr-2" />
                        Empty Trash
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-r from-rose-500/70 to-rose-600 border-none text-white shadow-lg rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs opacity-80">In Trash</p>
                        <Trash2 className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-white">{deletedClients.length} Records</p>
                        <p className="text-[10px] text-white">Pending deletion</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500">Recovered</p>
                        <RotateCcw className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">12 Clients</p>
                        <p className="text-[10px] text-slate-500">Last 30 days</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500">Auto-Purge</p>
                        <Clock className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">3 Days</p>
                        <p className="text-[10px] text-slate-500">Next scheduled run</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500">Storage Used</p>
                        <HardDrive className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">45 MB</p>
                        <p className="text-[10px] text-slate-500">Reclaimable space</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* DELETED CLIENTS TABLE */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search deleted clients..."
                            className="pl-10 h-9 bg-white border-zinc-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* AUTO DELETION WARNING */}
                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg text-amber-700 border border-amber-100/50">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">Warning: Items older than 30 days are automatically removed</span>
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="px-4 py-3 text-[10px] font-medium text-slate-500">Client Name</TableHead>
                            <TableHead className="py-3 text-[10px] font-medium text-slate-500">Deleted By</TableHead>
                            <TableHead className="py-3 text-[10px] font-medium text-slate-500">Deletion Date</TableHead>
                            <TableHead className="py-3 text-[10px] font-medium text-slate-500 text-center">Auto-Delete In</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-[10px] font-medium text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deletedClients.map((client) => (
                            <TableRow key={client.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-zinc-900">{client.name}</span>
                                        <span className="text-[10px] text-slate-500 font-medium">Reason: {client.reason}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center text-[10px] font-medium text-zinc-500">
                                            {client.deletedBy.charAt(0)}
                                        </div>
                                        <span className="text-xs font-medium text-zinc-700">{client.deletedBy}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs font-medium text-zinc-600">{client.deletedAt}</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge variant="outline" className={`text-[10px] font-medium border-none px-2 h-5 rounded-md ${client.daysRemaining < 10
                                        ? 'text-rose-600 bg-rose-50'
                                        : 'text-amber-600 bg-amber-50'
                                        }`}>
                                        {client.daysRemaining} days
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                                <MoreVertical className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleRestoreClick(client)} className="text-xs font-medium cursor-pointer gap-2">
                                                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                                                Restore Client
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteClick(client)} className="text-rose-600 text-xs font-medium cursor-pointer gap-2">
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete Forever
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* RESTORE DIALOG */}
            <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                <AlertDialogContent className="rounded-xl p-5">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-sm font-semibold text-blue-600 flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" />
                            Restore Client?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-slate-500 font-medium">
                            This will restore <strong>{selectedClient?.name}</strong> to the active client list. All associated data and records will be recovered.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs font-medium rounded-lg border-none bg-zinc-100 hover:bg-zinc-200 h-8">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmRestore}
                            className="text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8"
                        >
                            Confirm Restore
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* DELETE FOREVER DIALOG */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-xl p-5">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-sm font-semibold text-rose-600 flex items-center gap-2">
                            <AlertOctagon className="w-4 h-4" />
                            Permanently Delete?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-slate-500 font-medium">
                            Are you sure you want to permanently delete <strong>{selectedClient?.name}</strong>? This action is <strong>irreversible</strong> and all data will be lost forever.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs font-medium rounded-lg border-none bg-zinc-100 hover:bg-zinc-200 h-8">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm h-8"
                        >
                            Delete Forever
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
