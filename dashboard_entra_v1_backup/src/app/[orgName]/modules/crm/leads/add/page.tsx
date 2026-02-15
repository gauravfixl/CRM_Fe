"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Users,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Plus,
  Briefcase,
  Target,
  FileText,
  ChevronRight,
  ChevronLeft,
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
import { getFirmList } from "@/hooks/firmHooks";
import { createLead } from "@/hooks/leadHooks";
import { getAllClients } from "@/hooks/clientHooks";
import { toast } from "sonner";

export default function AddLeadPage() {
  const params = useParams();
  const router = useRouter();
  const orgName = params.orgName as string;

  const { showLoader, hideLoader } = useLoaderStore();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    title: "",
    firm: "",
    contact: {
      name: "",
      email: "",
      source: "",
      client: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: {
          line1: "",
          line2: "",
          country: "",
          postalCode: "",
        },
      },
      firmId: "",
    },
  });

  const [firms, setFirms] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const [firmsRes, clientsRes] = await Promise.all([
          getFirmList(),
          getAllClients()
        ]);
        setFirms(firmsRes.data?.firms || []);
        setClients(clientsRes.data?.clients || []);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      } finally {
        hideLoader();
      }
    };
    fetchData();
  }, []);

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "Lead title is required";
      if (!formData.firm) newErrors.firm = "Please select a firm";
      if (!formData.contact.name.trim()) newErrors.contactName = "Contact name is required";
      if (!formData.contact.email.trim()) newErrors.contactEmail = "Valid email is required";
      if (!formData.contact.source) newErrors.source = "Lead source is required";
    }

    if (currentStep === 2) {
      const { client } = formData.contact;
      if (!client.firstName.trim()) newErrors.firstName = "First name is required";
      if (!client.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!client.email.trim()) newErrors.clientEmail = "Client email is required";
      if (!client.phone.trim()) newErrors.phone = "Phone number is required";
      if (!client.address.country.trim()) newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    } else {
      toast.error("Please fill all required fields");
    }
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    try {
      showLoader();
      const res = await createLead(formData);
      if (res.success) {
        toast.success("Lead created successfully!");
        router.push(`/${orgName}/modules/crm/leads`);
      } else {
        toast.error(res.error || "Failed to create lead");
      }
    } catch (err) {
      toast.error("Internal server error");
    } finally {
      hideLoader();
    }
  };

  const STEPS = [
    { id: 1, title: "Lead Discovery", icon: Target, color: "bg-blue-600" },
    { id: 2, title: "Client Identity", icon: Users, color: "bg-purple-600" },
    { id: 3, title: "Final Review", icon: CheckCircle, color: "bg-emerald-600" },
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
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Onboard New Lead</h1>
              <p className="text-sm text-zinc-500 font-normal">Step {step} of 3: {STEPS[step - 1].title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${step === s.id ? `${s.color} text-white scale-110 shadow-lg` :
                  step > s.id ? "bg-zinc-200 text-zinc-500" : "bg-white border-2 border-zinc-100 text-zinc-300"
                  }`}>
                  {step > s.id ? <CheckCircle className="h-4 w-4" /> : s.id}
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 shadow-xl overflow-hidden"
            >
              <div className="p-10 space-y-8">

                {/* STEP 1: LEAD INFO */}
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-2 flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Target className="h-5 w-5" /></div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Basic Lead Particulars</h2>
                    </div>

                    <div className="space-y-2">
                      <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Lead Purpose / Title</CustomLabel>
                      <CustomInput
                        placeholder="e.g. Website Overhaul for ABC Corp"
                        value={formData.title}
                        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                        className={errors.title ? "border-red-400 focus-visible:ring-red-400" : "bg-zinc-50/50"}
                      />
                    </div>

                    <div className="space-y-2">
                      <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Associated Business Unit</CustomLabel>
                      <CustomSelect value={formData.firm} onValueChange={(val) => setFormData(p => ({ ...p, firm: val }))}>
                        <CustomSelectTrigger className="bg-zinc-50/50">
                          <CustomSelectValue placeholder="Select Organization Unit" />
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {firms.map(f => <CustomSelectItem key={f._id} value={f._id}>{f.FirmName}</CustomSelectItem>)}
                        </CustomSelectContent>
                      </CustomSelect>
                    </div>

                    <div className="space-y-2">
                      <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Primary Reach Name</CustomLabel>
                      <CustomInput
                        placeholder="Full name of contact person"
                        value={formData.contact.name}
                        onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, name: e.target.value } }))}
                        className="bg-zinc-50/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Communication Email</CustomLabel>
                      <CustomInput
                        placeholder="contact@company.com"
                        value={formData.contact.email}
                        onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, email: e.target.value } }))}
                        className="bg-zinc-50/50"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Inbound Channel (Source)</CustomLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {["Website", "Referral", "Social Media", "Advertisement", "Event", "Cold Call", "Other"].map(s => (
                          <button
                            key={s}
                            onClick={() => setFormData(p => ({ ...p, contact: { ...p.contact, source: s } }))}
                            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${formData.contact.source === s
                              ? "bg-zinc-900 text-white border-zinc-900 shadow-lg"
                              : "bg-white text-zinc-600 border-zinc-100 hover:border-zinc-300"
                              }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: CLIENT INFO */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><Users className="h-5 w-5" /></div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Detailed Client Identity</h2>
                      </div>

                      <CustomSelect onValueChange={(clientId) => {
                        const c = clients.find(x => x._id === clientId);
                        if (c) {
                          setFormData(p => ({
                            ...p,
                            contact: {
                              ...p.contact,
                              firmId: c._id,
                              client: {
                                firstName: c.firstName || "",
                                lastName: c.lastName || "",
                                email: c.email || "",
                                phone: c.phone || "",
                                address: {
                                  line1: c.address?.address1 || "",
                                  line2: c.address?.address2 || "",
                                  country: c.address?.country || "",
                                  postalCode: c.address?.pinCode || ""
                                }
                              }
                            }
                          }));
                          toast.success(`Populated details for ${c.firstName}`);
                        }
                      }}>
                        <CustomSelectTrigger className="w-64 bg-zinc-50/50 border-dashed">
                          <Search className="mr-2 h-4 w-4 opacity-50" />
                          <CustomSelectValue placeholder="Autofill from records" />
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {clients.map(c => <CustomSelectItem key={c._id} value={c._id}>{c.firstName} {c.lastName}</CustomSelectItem>)}
                        </CustomSelectContent>
                      </CustomSelect>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">First Name</CustomLabel>
                        <CustomInput
                          value={formData.contact.client.firstName}
                          onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, client: { ...p.contact.client, firstName: e.target.value } } }))}
                          className="bg-zinc-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Last Name</CustomLabel>
                        <CustomInput
                          value={formData.contact.client.lastName}
                          onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, client: { ...p.contact.client, lastName: e.target.value } } }))}
                          className="bg-zinc-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Official Email</CustomLabel>
                        <CustomInput
                          value={formData.contact.client.email}
                          onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, client: { ...p.contact.client, email: e.target.value } } }))}
                          className="bg-zinc-50/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Contact Number</CustomLabel>
                        <CustomInput
                          value={formData.contact.client.phone}
                          onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, client: { ...p.contact.client, phone: e.target.value } } }))}
                          className="bg-zinc-50/50"
                        />
                      </div>
                      <div className="col-span-2 grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Country / Region</CustomLabel>
                          <CustomInput
                            value={formData.contact.client.address.country}
                            onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, client: { ...p.contact.client, address: { ...p.contact.client.address, country: e.target.value } } } }))}
                            className="bg-zinc-50/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <CustomLabel className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Postal / Zip Code</CustomLabel>
                          <CustomInput
                            value={formData.contact.client.address.postalCode}
                            onChange={(e) => setFormData(p => ({ ...p, contact: { ...p.contact, client: { ...p.contact.client, address: { ...p.contact.client.address, postalCode: e.target.value } } } }))}
                            className="bg-zinc-50/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: REVIEW */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><FileText className="h-5 w-5" /></div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Review Submission</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50/50 dark:bg-zinc-800/20 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Lead Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-zinc-100 pb-2"><span className="text-xs text-zinc-500">Title</span><span className="text-xs font-bold text-zinc-800">{formData.title}</span></div>
                          <div className="flex justify-between border-b border-zinc-100 pb-2"><span className="text-xs text-zinc-500">Source</span><span className="text-xs font-bold text-zinc-800">{formData.contact.source}</span></div>
                          <div className="flex justify-between"><span className="text-xs text-zinc-500">BU Unit</span><span className="text-xs font-bold text-zinc-800">{firms.find(f => f._id === formData.firm)?.FirmName || "N/A"}</span></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Client Identity</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-zinc-100 pb-2"><span className="text-xs text-zinc-500">Name</span><span className="text-xs font-bold text-zinc-800">{formData.contact.client.firstName} {formData.contact.client.lastName}</span></div>
                          <div className="flex justify-between border-b border-zinc-100 pb-2"><span className="text-xs text-zinc-500">Email</span><span className="text-xs font-bold text-blue-600 underline">{formData.contact.client.email}</span></div>
                          <div className="flex justify-between"><span className="text-xs text-zinc-500">Region</span><span className="text-xs font-bold text-zinc-800">{formData.contact.client.address.country}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <CustomButton
                    variant="ghost"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="h-11 px-6 font-bold text-zinc-500 hover:text-zinc-900"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </CustomButton>

                  <div className="flex items-center gap-2">
                    {step < 3 ? (
                      <CustomButton
                        onClick={handleNext}
                        className="h-11 px-8 bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800 shadow-xl"
                      >
                        Proceed to Next <ChevronRight className="ml-2 h-4 w-4" />
                      </CustomButton>
                    ) : (
                      <CustomButton
                        onClick={handleSubmit}
                        className="h-11 px-10 bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 shadow-xl"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Ship New Lead
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