"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  User,
  Building,
  MapPin,
  Target,
  Mail,
  Phone,
  Globe,
  Plus,
  Briefcase,
  FileText,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  TrendingUp,
  Search
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
import { getLeadById, updateLead } from "@/hooks/leadHooks";
import { toast } from "sonner";
import CountryStateCityDropdown from "@/components/custom/CountryStateCityDropDown";

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  const orgName = params.orgName as string;

  const { showLoader, hideLoader } = useLoaderStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  useEffect(() => {
    const fetchLead = async () => {
      try {
        showLoader();
        const response = await getLeadById(leadId);
        if (response.data?.lead) {
          const l = response.data.lead;
          setFormData({
            firstName: l.contact?.client?.firstName || l.contact?.name?.split(" ")[0] || "",
            lastName: l.contact?.client?.lastName || l.contact?.name?.split(" ")[1] || "",
            email: l.contact?.email || "",
            phone: l.contact?.phone || "",
            company: l.firm?.FirmName || "",
            status: l.stage || "New",
            value: l.estimatedValue || l.value || 0,
            source: l.source || "",
            position: l.contact?.position || "",
            line1: l.contact?.client?.address?.line1 || "",
            line2: l.contact?.client?.address?.line2 || "",
            city: l.contact?.client?.address?.city || "",
            state: l.contact?.client?.address?.state || "",
            country: l.contact?.client?.address?.country || "",
            postalCode: l.contact?.client?.address?.postalCode || "",
            priority: l.priority || "High",
            notes: (l.notes || []).join(", "),
            tags: (l.tags || []).join(", "),
            firmId: l.firm?._id
          });
        }
      } catch (err) {
        toast.error("Failed to load lead data");
      } finally {
        hideLoader();
      }
    };
    if (leadId) fetchLead();
  }, [leadId]);

  const handleSubmit = async () => {
    setIsLoading(true);
    showLoader();

    const payload = {
      title: formData.company,
      firm: formData.firmId,
      contact: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        position: formData.position,
        client: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: {
            line1: formData.line1,
            line2: formData.line2,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.postalCode,
          }
        },
        source: formData.source,
        firmId: formData.firmId,
      },
      stage: formData.status,
      estimatedValue: formData.value,
      priority: formData.priority,
      notes: formData.notes.split(",").map((n: string) => n.trim()),
      tags: formData.tags.split(",").map((t: string) => t.trim()),
    };

    try {
      await updateLead(leadId, payload);
      toast.success("Lead updated successfully!");
      router.push(`/${orgName}/modules/crm/leads/${leadId}`);
    } catch (err) {
      toast.error("Failed to update lead.");
    } finally {
      setIsLoading(false);
      hideLoader();
    }
  };

  if (!formData) return null;

  const STEPS = [
    { id: 1, title: "Identity", icon: User, color: "bg-blue-600" },
    { id: 2, title: "Location", icon: MapPin, color: "bg-purple-600" },
    { id: 3, title: "Commercials", icon: TrendingUp, color: "bg-emerald-600" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b px-8 py-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ x: -3 }}
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-zinc-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Modify Lead Record</h1>
              <p className="text-sm text-zinc-500 font-normal">Updating details for {formData.firstName} {formData.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${step === s.id ? `${s.color} text-white scale-110 shadow-lg` :
                  step > s.id ? "bg-zinc-200 text-zinc-500" : "bg-white border-2 border-zinc-100 text-zinc-300"
                  }`}>
                  {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-8 h-[2px] mx-1 rounded-full ${step > s.id ? "bg-zinc-200" : "bg-zinc-100"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200/50 shadow-2xl overflow-hidden"
            >
              <div className="p-12 space-y-10">

                {step === 1 && (
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2 flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shadow-sm"><User className="h-5 w-5" /></div>
                      <h2 className="text-xl font-black text-zinc-900">Personal & Professional Info</h2>
                    </div>
                    <div className="space-y-2">
                      <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">First Name</CustomLabel>
                      <CustomInput value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="bg-zinc-50/50 h-11" />
                    </div>
                    <div className="space-y-2">
                      <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Last Name</CustomLabel>
                      <CustomInput value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="bg-zinc-50/50 h-11" />
                    </div>
                    <div className="space-y-2">
                      <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Official Email</CustomLabel>
                      <CustomInput value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-zinc-50/50 h-11" />
                    </div>
                    <div className="space-y-2">
                      <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Company / Firm</CustomLabel>
                      <CustomInput value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="bg-zinc-50/50 h-11" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shadow-sm"><MapPin className="h-5 w-5" /></div>
                      <h2 className="text-xl font-black text-zinc-900">Geographic Data</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Address Line 1</CustomLabel>
                          <CustomInput value={formData.line1} onChange={(e) => setFormData({ ...formData, line1: e.target.value })} className="bg-zinc-50/50 h-11" />
                        </div>
                        <div className="space-y-2">
                          <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Postal Code</CustomLabel>
                          <CustomInput value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} className="bg-zinc-50/50 h-11" />
                        </div>
                      </div>
                      <CountryStateCityDropdown
                        initialCountry={formData.country}
                        initialState={formData.state}
                        initialCity={formData.city}
                        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                        countryName="country" stateName="state" cityName="city"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shadow-sm"><TrendingUp className="h-5 w-5" /></div>
                      <h2 className="text-xl font-black text-zinc-900">Deal Commercials</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Estimated Value ($)</CustomLabel>
                        <CustomInput type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} className="bg-zinc-50/50 h-11 font-bold text-lg" />
                      </div>
                      <div className="space-y-2">
                        <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Priority Status</CustomLabel>
                        <CustomSelect value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                          <CustomSelectTrigger className="bg-zinc-50/50 h-11"><CustomSelectValue /></CustomSelectTrigger>
                          <CustomSelectContent>
                            <CustomSelectItem value="High">High Priority</CustomSelectItem>
                            <CustomSelectItem value="Medium">Standard</CustomSelectItem>
                            <CustomSelectItem value="Low">Low Priority</CustomSelectItem>
                          </CustomSelectContent>
                        </CustomSelect>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <CustomLabel className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Internal Strategy Notes</CustomLabel>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          className="w-full min-h-[120px] bg-zinc-50/50 border border-zinc-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          placeholder="Describe any specific requirements or strategy for this lead..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-10 border-t border-zinc-100">
                  <CustomButton variant="ghost" onClick={handleBack} disabled={step === 1} className="h-12 px-6 font-bold text-zinc-500">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
                  </CustomButton>

                  <div className="flex items-center gap-3">
                    {step < 3 ? (
                      <CustomButton onClick={() => setStep(step + 1)} className="h-12 px-8 bg-zinc-900 text-white rounded-2xl shadow-xl hover:bg-zinc-800">
                        Continue to Next <ChevronRight className="ml-2 h-4 w-4" />
                      </CustomButton>
                    ) : (
                      <CustomButton onClick={handleSubmit} disabled={isLoading} className="h-12 px-10 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-blue-700">
                        <Save className="mr-2 h-4 w-4" /> {isLoading ? "Synchronizing..." : "Update Record"}
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
