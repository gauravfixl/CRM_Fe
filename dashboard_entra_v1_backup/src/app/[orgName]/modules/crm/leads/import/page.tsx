"use client";

import { useState, useRef } from "react";
import {
    FileUp,
    Search,
    Download,
    CheckCircle2,
    AlertCircle,
    FileText,
    Table as TableIcon,
    ChevronRight,
    X,
    ArrowRight,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { CustomButton } from "@/components/custom/CustomButton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function LeadImportPage() {
    const [step, setStep] = useState(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setStep(2);
            toast.success(`${file.name} ready for mapping!`);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleStartImport = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            setStep(1);
            setSelectedFile(null);
            toast.success("Bulk ingestion completed! 1,240 leads added successfully.");
        }, 2500);
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-zinc-950">
            {/* Header - Sticky with negative margins to offset AppLayout's p-4 */}
            <div className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white dark:bg-zinc-900 border-b px-8 py-6 shadow-sm z-30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                        <FileUp className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight italic uppercase">Bulk Lead Ingestion</h1>
                        <p className="text-sm text-zinc-500 font-normal">Import thousands of leads instantly via Excel or CSV</p>
                    </div>
                </div>
                {step === 2 && (
                    <div className="flex items-center gap-3">
                        <CustomButton variant="ghost" onClick={() => { setStep(1); setSelectedFile(null); }}>Discard</CustomButton>
                        <CustomButton onClick={handleStartImport} disabled={isUploading} className="bg-blue-600 text-white px-8 h-11 rounded-xl shadow-lg shadow-blue-100 uppercase font-black tracking-tighter italic">
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                            {isUploading ? 'Ingesting...' : 'Start Import'}
                        </CustomButton>
                    </div>
                )}
            </div>

            <div className="py-12 px-8 max-w-4xl mx-auto w-full">
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".csv, .xlsx, .xls" />

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="upload-step"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-12 gap-8"
                        >
                            {/* Left: Upload Area */}
                            <div className="col-span-12 lg:col-span-8 space-y-8">
                                <motion.div
                                    onClick={triggerFileSelect}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="bg-white dark:bg-zinc-900 rounded-[48px] border-2 border-dashed border-zinc-200 p-20 text-center space-y-8 hover:border-blue-400 hover:bg-blue-50/10 transition-all cursor-pointer group shadow-sm"
                                >
                                    <div className="w-24 h-24 bg-zinc-50 rounded-[32px] flex items-center justify-center mx-auto transition-all group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6">
                                        <FileUp className="h-12 w-12 text-zinc-300 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter">Secure File Drop</h3>
                                        <p className="text-sm text-zinc-400 max-w-xs mx-auto mt-2">Support for .xlsx, .xls, and .csv files. Max file size 10MB.</p>
                                    </div>
                                    <CustomButton className="h-14 px-12 bg-zinc-950 text-white rounded-3xl font-black uppercase tracking-tight shadow-xl shadow-zinc-200">
                                        Select Local File
                                    </CustomButton>
                                </motion.div>

                                <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200/50 shadow-sm">
                                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-8 border-b pb-4 border-zinc-50">Ingestion History</h3>
                                    <div className="space-y-4">
                                        {[
                                            { name: "Website_Leads_Jan.xlsx", count: 450, status: "Success", date: "2 hours ago" },
                                            { name: "Conference_List_2023.csv", count: 1200, status: "Success", date: "Jan 10, 2024" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center justify-between p-5 bg-zinc-50 rounded-3xl border border-zinc-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white rounded-2xl shadow-sm text-zinc-400 group-hover:text-blue-600 transition-colors"><FileText className="h-5 w-5" /></div>
                                                    <div>
                                                        <p className="text-sm font-black text-zinc-900 uppercase tracking-tighter">{item.name}</p>
                                                        <p className="text-[10px] text-zinc-400 font-bold">{item.count} records mapped • {item.date}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-emerald-50 text-emerald-600 font-black border-none px-3 uppercase text-[9px]">
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Sidebar Info */}
                            <div className="col-span-12 lg:col-span-4 space-y-6">
                                <div className="bg-zinc-950 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-5"><TableIcon size={150} /></div>
                                    <TableIcon className="h-10 w-10 mb-6 text-blue-400 relative z-10" />
                                    <h4 className="text-xl font-black mb-4 uppercase tracking-tighter italic relative z-10">Standard Template</h4>
                                    <p className="text-sm text-zinc-400 leading-relaxed font-normal mb-10 relative z-10">
                                        Download our pre-configured mapping schema to ensure 100% ingestion accuracy.
                                    </p>
                                    <CustomButton onClick={() => toast.success("Template download started!")} variant="outline" className="w-full h-14 border-zinc-800 text-white hover:bg-zinc-800 rounded-3xl font-black uppercase tracking-widest text-xs relative z-10">
                                        <Download className="h-4 w-4 mr-2" /> Lead_Schema.xlsx
                                    </CustomButton>
                                </div>

                                <div className="bg-amber-50 rounded-[40px] p-8 border border-amber-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><AlertCircle className="h-5 w-5 text-amber-600" /></div>
                                        <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em]">Validation Engine</h4>
                                    </div>
                                    <p className="text-xs text-amber-800/80 leading-relaxed font-semibold">
                                        The system uses the "Email" column as a primary key. Duplicate records will be merged based on the most recent timestamp.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="mapping-step"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="bg-white p-12 rounded-[48px] border border-zinc-100 shadow-sm space-y-12">
                                <div className="flex items-center justify-between border-b border-zinc-50 pb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="p-5 bg-blue-50 text-blue-600 rounded-[32px]"><FileText size={40} /></div>
                                        <div>
                                            <h3 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">{selectedFile?.name}</h3>
                                            <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest mt-1">Ready for schema mapping • {(selectedFile?.size || 0 / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                    <button onClick={() => { setStep(1); setSelectedFile(null); }} className="p-4 hover:bg-zinc-50 rounded-full transition-colors"><X className="text-zinc-300 hover:text-red-500" /></button>
                                </div>

                                <div className="space-y-8">
                                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] text-center">Auto-detected Columns</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {['Full Name', 'Email Address', 'Company Name', 'Phone Number'].map((col, i) => (
                                            <div key={i} className="flex items-center justify-between p-6 bg-zinc-50/50 rounded-3xl border border-zinc-50 group hover:bg-white hover:border-blue-200 transition-all">
                                                <span className="text-sm font-bold text-zinc-500">{col}</span>
                                                <div className="flex items-center gap-3">
                                                    <ArrowRight size={14} className="text-zinc-300" />
                                                    <Badge className="bg-blue-600 text-white border-none px-4 py-1.5 rounded-xl font-black uppercase text-[10px] italic">{col.split(' ')[0]}</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
