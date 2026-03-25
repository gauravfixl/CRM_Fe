
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react"

interface ImportLeadsModalProps {
    isOpen: boolean
    onClose: () => void
    onImport: (data: any[]) => void
}

export function ImportLeadsModal({ isOpen, onClose, onImport }: ImportLeadsModalProps) {
    const [step, setStep] = React.useState<'upload' | 'processing' | 'complete'>('upload')
    const [file, setFile] = React.useState<File | null>(null)

    const handleUpload = () => {
        if (!file) return
        setStep('processing')
        setTimeout(() => {
            setStep('complete')
        }, 2000)
    }

    const reset = () => {
        setStep('upload')
        setFile(null)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={reset}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl overflow-hidden p-0">
                <div className="p-8">
                    {step === 'upload' && (
                        <div className="space-y-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="space-y-1">
                                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Bulk Import Engine</DialogTitle>
                                <p className="text-slate-500 text-sm font-medium">Upload .csv or .xlsx files to sync with master database</p>
                            </div>

                            <label className="block">
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 hover:border-indigo-400 hover:bg-slate-50/50 transition-all cursor-pointer group">
                                    <div className="space-y-2">
                                        <FileText className="h-10 w-10 text-slate-300 mx-auto group-hover:text-indigo-500 transition-colors" />
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            {file ? file.name : "Click to select or drag & drop"}
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                </div>
                            </label>

                            <div className="bg-slate-50 p-4 rounded-xl flex items-start gap-3 text-left">
                                <AlertCircle className="h-5 w-5 text-slate-400 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-900 uppercase">Pro Tip</p>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Ensure headers match: Name, Email, Company, Source, and Value for automatic column mapping.</p>
                                </div>
                            </div>

                            <Button
                                disabled={!file}
                                onClick={handleUpload}
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                            >
                                Start Ingestion
                            </Button>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="py-12 space-y-6 text-center">
                            <div className="relative mx-auto w-20 h-20">
                                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xl font-black text-slate-900 tracking-tight">Syncing Records...</p>
                                <p className="text-slate-500 text-sm font-medium italic">Building schemas and validating entries</p>
                            </div>
                        </div>
                    )}

                    {step === 'complete' && (
                        <div className="space-y-6 text-center">
                            <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-black text-slate-900 tracking-tight">Success!</p>
                                <p className="text-slate-500 text-sm font-medium">142 records have been parsed and safely injected.</p>
                            </div>
                            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex justify-center gap-8">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase font-black text-emerald-600">New</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tighter">128</p>
                                </div>
                                <div className="text-center border-l border-emerald-100 pl-8">
                                    <p className="text-[10px] uppercase font-black text-slate-400">Merged</p>
                                    <p className="text-xl font-black text-slate-900 tracking-tighter">14</p>
                                </div>
                            </div>
                            <Button onClick={reset} className="w-full h-12 bg-slate-900 hover:bg-black font-bold text-white rounded-xl">Close & Refresh Database</Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
