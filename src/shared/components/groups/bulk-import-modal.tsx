"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { CloudUpload, FileSpreadsheet, Loader2, Download, X, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface BulkImportModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onImportComplete?: () => void
}

export function BulkImportModal({ open, onOpenChange, onImportComplete }: BulkImportModalProps) {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
        else if (e.type === "dragleave") setDragActive(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files?.[0]) {
            const f = e.dataTransfer.files[0]
            if (f.name.endsWith(".csv") || f.name.endsWith(".xlsx") || f.name.endsWith(".xls")) {
                setFile(f)
            } else {
                toast.error("Please upload a CSV or Excel file")
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0])
    }

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Please select a file to import")
            return
        }

        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            onImportComplete?.()
            toast.success("Groups imported successfully")
            setFile(null)
            onOpenChange(false)
        } catch {
            toast.error("Failed to import groups")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = (value: boolean) => {
        if (!value) setFile(null)
        onOpenChange(value)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] rounded-none p-0 gap-0">
                <div className="p-6 pb-4 bg-violet-50 dark:bg-violet-950/30">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <CloudUpload className="w-5 h-5 text-violet-600" />
                            <DialogTitle className="text-lg font-bold">Bulk Import Groups</DialogTitle>
                        </div>
                        <DialogDescription>
                            Upload a CSV or Excel file to create multiple groups at once.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                    <div
                        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${dragActive ? "border-violet-400 bg-violet-50 dark:bg-violet-950/20" : "border-zinc-200 dark:border-zinc-800 hover:border-violet-300"}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {file ? (
                            <div className="space-y-2">
                                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500" />
                                <div className="flex items-center justify-center gap-2">
                                    <FileSpreadsheet className="w-4 h-4 text-zinc-500" />
                                    <span className="text-sm font-medium">{file.name}</span>
                                    <X className="w-4 h-4 text-zinc-400 hover:text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); setFile(null) }} />
                                </div>
                                <p className="text-xs text-zinc-400">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <CloudUpload className="w-10 h-10 mx-auto text-zinc-300" />
                                <div>
                                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drag & drop your file here</p>
                                    <p className="text-xs text-zinc-400 mt-1">or click to browse (CSV, XLSX)</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <Download className="w-4 h-4 text-violet-500" />
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">Need a template?</span>
                        <button className="text-xs text-violet-600 font-semibold hover:underline" onClick={() => toast.info("Template download started")}>
                            Download CSV Template
                        </button>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <CustomButton variant="outline" className="rounded-none" onClick={() => handleClose(false)} disabled={loading}>
                        Cancel
                    </CustomButton>
                    <CustomButton className="rounded-none bg-primary text-white" onClick={handleSubmit} disabled={loading || !file}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {loading ? "Importing..." : "Import Groups"}
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
