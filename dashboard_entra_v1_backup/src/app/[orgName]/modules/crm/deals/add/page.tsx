"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Building2,
    Users,
    CheckCircle,
    Briefcase,
    TrendingUp,
    Target,
    Plus,
    ChevronRight,
    ChevronLeft,
    DollarSign,
    Calendar,
    FileText,
    Search,
    Star
} from "lucide-react";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { CustomLabel } from "@/components/custom/CustomLabel";
import {
    CustomSelect,
    CustomSelectTrigger,
    CustomSelectValue,
    CustomSelectContent,
    CustomSelectItem
} from "@/components/custom/CustomSelect";
import { useLoaderStore } from "@/lib/loaderStore";
import { createDeal } from "@/modules/crm/deals/hooks/dealHooks";
import { getFirmList } from "@/hooks/firmHooks";
import { toast } from "sonner";

export default function AddDealPage() {
    const params = useParams();
    const router = useRouter();
    const orgName = params.orgName as string;

    const { showLoader, hideLoader } = useLoaderStore();
    const [step, setStep] = useState(1);
    const [firms, setFirms] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        firmId: "",
        value: 0,
        stage: "New",
        priority: "Medium",
        expectedCloseDate: "",
        description: "",
        source: "Manual",
    });

    useEffect(() => {
        const fetchFirms = async () => {
            try {
                const res = await getFirmList();
                setFirms(res?.data?.data || []);
            } catch (err) {
                toast.error("Failed to load accounts");
            }
        };
        fetchFirms();
    }, []);

    const handleSubmit = async () => {
        setIsLoading(true);
        showLoader();
        try {
            const response = await createDeal(formData);
            if (response.success !== false) {
                toast.success("Deal created successfully!");
                router.push(`/${orgName}/modules/crm/deals`);
            } else {
                toast.error(response.error || "Failed to create deal");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
            hideLoader();
        }
    };

    const STEPS = [
        { id: 1, title: "Opportunity Details", icon: Briefcase, color: "bg-blue-600" },
        { id: 2, title: "Account & Timeline", icon: Building2, color: "bg-purple-600" },
        { id: 3, title: "Final Review", icon: Star, color: "bg-emerald-600" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">
            {/* Premium Header */}
            <div className="bg-white dark:bg-zinc-900 border-b px-10 py-8 shadow-sm relative z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <motion.button
                            whileHover={{ x: -5 }}
                            onClick={() => router.back()}
                            className="p-3 rounded-2xl hover:bg-zinc-100 transition-colors"
                        >
                            <ArrowLeft className="h-6 w-6 text-zinc-600" />
                        </motion.button>
                        <div>
                            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Create New Opportunity</h1>
                            <p className="text-sm text-zinc-500 font-normal">Add a high-value deal to your sales pipeline</p>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        {STEPS.map((s, idx) => (
                            <div key={s.id} className="flex items-center">
                                <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all duration-500 ${step === s.id ? `${s.color} border-transparent text-white shadow-xl scale-105` :
                                        step > s.id ? "bg-zinc-100 border-zinc-200 text-zinc-500" : "bg-white border-zinc-100 text-zinc-300"
                                    }`}>
                                    <s.icon className={`h-4 w-4 ${step === s.id ? "text-white" : ""}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{s.title}</span>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className={`w-8 h-[2px] mx-2 transition-colors duration-500 ${step > s.id ? "bg-zinc-200" : "bg-zinc-100"}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white dark:bg-zinc-900 rounded-[48px] border border-zinc-200/50 shadow-2xl shadow-zinc-200/50 overflow-hidden"
                        >
                            <div className="p-16 space-y-12">

                                {step === 1 && (
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                                                <Briefcase className="h-6 w-6" />
                                            </div>
                                            <h2 className="text-2xl font-black text-zinc-900">Basic Opportunity Info</h2>
                                        </div>
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="col-span-2 space-y-2">
                                                <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Opportunity Title</CustomLabel>
                                                <CustomInput
                                                    placeholder="e.g. Enterprise Software Licensing"
                                                    className="bg-zinc-50/50 h-14 text-lg border-zinc-200"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expected Contract Value ($)</CustomLabel>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300" />
                                                    <CustomInput
                                                        type="number"
                                                        className="pl-11 h-14 bg-zinc-50/50 font-bold text-lg"
                                                        value={formData.value}
                                                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Opportunity Priority</CustomLabel>
                                                <CustomSelect value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                                                    <CustomSelectTrigger className="h-14 bg-zinc-50/50"><CustomSelectValue placeholder="Priority" /></CustomSelectTrigger>
                                                    <CustomSelectContent>
                                                        <CustomSelectItem value="High">🔥 High Priority</CustomSelectItem>
                                                        <CustomSelectItem value="Medium">⚡ Medium</CustomSelectItem>
                                                        <CustomSelectItem value="Low">🧊 Low</CustomSelectItem>
                                                    </CustomSelectContent>
                                                </CustomSelect>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                                                <Building2 className="h-6 w-6" />
                                            </div>
                                            <h2 className="text-2xl font-black text-zinc-900">Account Mapping & Deadline</h2>
                                        </div>
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="col-span-2 space-y-3">
                                                <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Selection of Client / Firm</CustomLabel>
                                                <CustomSelect value={formData.firmId} onValueChange={(v) => setFormData({ ...formData, firmId: v })}>
                                                    <CustomSelectTrigger className="h-14 bg-zinc-50/50">
                                                        <Search className="h-4 w-4 mr-2 text-zinc-400" />
                                                        <CustomSelectValue placeholder="Find an account..." />
                                                    </CustomSelectTrigger>
                                                    <CustomSelectContent>
                                                        {firms.map(f => (
                                                            <CustomSelectItem key={f._id} value={f._id}>{f.FirmName}</CustomSelectItem>
                                                        ))}
                                                    </CustomSelectContent>
                                                </CustomSelect>
                                            </div>
                                            <div className="space-y-3">
                                                <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expected Closing Date</CustomLabel>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300" />
                                                    <CustomInput
                                                        type="date"
                                                        className="pl-11 h-14 bg-zinc-50/50"
                                                        value={formData.expectedCloseDate}
                                                        onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Current Sales Stage</CustomLabel>
                                                <CustomSelect value={formData.stage} onValueChange={(v) => setFormData({ ...formData, stage: v })}>
                                                    <CustomSelectTrigger className="h-14 bg-zinc-50/50"><CustomSelectValue /></CustomSelectTrigger>
                                                    <CustomSelectContent>
                                                        <CustomSelectItem value="New">New</CustomSelectItem>
                                                        <CustomSelectItem value="Discovery">Discovery</CustomSelectItem>
                                                        <CustomSelectItem value="Proposal">Proposal</CustomSelectItem>
                                                        <CustomSelectItem value="Negotiation">Negotiation</CustomSelectItem>
                                                    </CustomSelectContent>
                                                </CustomSelect>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-10">
                                        <div className="bg-emerald-50/50 p-8 rounded-[32px] border-2 border-dashed border-emerald-100 text-center">
                                            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Review & Initialize Deal</h2>
                                            <p className="text-sm text-zinc-500">Please verify the details below before pushing to the pipeline</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Title</p>
                                                <p className="text-sm font-bold">{formData.title || "---"}</p>
                                            </div>
                                            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Contract Value</p>
                                                <p className="text-sm font-black text-blue-600">${formData.value.toLocaleString()}</p>
                                            </div>
                                            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Account</p>
                                                <p className="text-sm font-bold">{firms.find(f => f._id === formData.firmId)?.FirmName || "No account linked"}</p>
                                            </div>
                                            <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Target Closing</p>
                                                <p className="text-sm font-bold">{formData.expectedCloseDate || "TBD"}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-10 border-t border-zinc-50">
                                    <CustomButton variant="ghost" className="h-14 px-8 font-bold text-zinc-400" onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}>
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
                                    </CustomButton>

                                    <div className="flex items-center gap-4">
                                        {step < 3 ? (
                                            <CustomButton onClick={() => setStep(step + 1)} className="h-14 px-10 bg-zinc-900 text-white rounded-[24px] shadow-2xl hover:bg-zinc-800 transition-all font-bold">
                                                Continue to Next <ChevronRight className="ml-3 h-4 w-4 text-blue-400" />
                                            </CustomButton>
                                        ) : (
                                            <CustomButton onClick={handleSubmit} disabled={isLoading} className="h-14 px-12 bg-blue-600 text-white rounded-[24px] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all font-black text-base uppercase tracking-tighter">
                                                {isLoading ? "Synchronizing..." : "Initiate Opportunity"}
                                            </CustomButton>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
