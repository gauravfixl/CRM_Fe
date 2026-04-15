"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Target,
  FileText,
  ChevronRight,
  ChevronLeft,
  Search,
  Briefcase,
  TrendingUp,
  X,
  Plus,
} from "lucide-react";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { CustomLabel } from "@/components/custom/CustomLabel";
import {
  PhoneCountryInput,
  DEFAULT_COUNTRY_ISO,
  findCountry,
  validatePhoneForCountry,
  expectedLengthHint,
} from "@/components/custom/PhoneCountryInput";
import {
  CustomSelect,
  CustomSelectTrigger,
  CustomSelectValue,
  CustomSelectContent,
  CustomSelectItem,
} from "@/components/custom/CustomSelect";
import { useLoaderStore } from "@/lib/loaderStore";
import { getFirmList } from "@/hooks/firmHooks";
import { createLead } from "@/hooks/leadHooks";
import { getAllClients } from "@/hooks/clientHooks";
import { toast } from "sonner";

// ---------- Backend-aligned enums ----------
const SOURCE_OPTIONS = [
  "Website",
  "Referral",
  "Social Media",
  "Advertisement",
  "Event",
  "Cold Call",
  "Other",
];
const STAGE_OPTIONS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Closed-Won",
  "Closed-Lost",
];
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];
const NEXT_ACTION_OPTIONS = [
  "Call",
  "Email",
  "Meeting",
  "Send Proposal",
  "Follow Up",
  "Close",
];
const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP", "AED", "SGD"];

// ---------- Validation regex ----------
const RX = {
  name: /^[a-zA-Z\s.'-]{2,100}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^[0-9]{10,15}$/,
  postal: /^[a-zA-Z0-9\s-]{3,10}$/,
  alphaNum: /^[a-zA-Z0-9\s&.,'-]{2,200}$/,
  objectId: /^[a-f\d]{24}$/i,
};

// ---------- Reusable Field wrapper ----------
type FieldProps = {
  label: string;
  required?: boolean;
  hint: string;
  error?: string;
  children: React.ReactNode;
};
const Field = ({ label, required, hint, error, children }: FieldProps) => (
  <div className="space-y-1.5">
    <CustomLabel className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </CustomLabel>
    {children}
    {error ? (
      <p className="text-[11px] text-red-500 font-medium">{error}</p>
    ) : (
      <p className="text-[10px] text-zinc-400 italic">Format: {hint}</p>
    )}
  </div>
);

// ---------- Backend Zod path → frontend error key + step ----------
const BACKEND_PATH_MAP: Record<string, { key: string; step: number }> = {
  title: { key: "title", step: 1 },
  description: { key: "description", step: 1 },
  firm: { key: "firm", step: 1 },
  source: { key: "source", step: 1 },
  "contact.source": { key: "source", step: 1 },
  sourceDetails: { key: "sourceDetails", step: 1 },
  "contact.name": { key: "contactName", step: 2 },
  "contact.email": { key: "contactEmail", step: 2 },
  "contact.phone": { key: "contactPhone", step: 2 },
  "contact.company": { key: "contactCompany", step: 2 },
  "contact.position": { key: "contactPosition", step: 2 },
  "contact.client.firstName": { key: "firstName", step: 3 },
  "contact.client.lastName": { key: "lastName", step: 3 },
  "contact.client.email": { key: "clientEmail", step: 3 },
  "contact.client.phone": { key: "clientPhone", step: 3 },
  "contact.client.address.line1": { key: "line1", step: 3 },
  "contact.client.address.line2": { key: "line2", step: 3 },
  "contact.client.address.city": { key: "city", step: 3 },
  "contact.client.address.state": { key: "state", step: 3 },
  "contact.client.address.country": { key: "country", step: 3 },
  "contact.client.address.postalCode": { key: "postalCode", step: 3 },
  stage: { key: "stage", step: 4 },
  estimatedValue: { key: "estimatedValue", step: 4 },
  currency: { key: "currency", step: 4 },
  nextAction: { key: "nextAction", step: 4 },
  nextActionDate: { key: "nextActionDate", step: 4 },
  priority: { key: "priority", step: 4 },
};

const mapBackendPaths = (raw: Record<string, string>): Record<string, string> => {
  const out: Record<string, string> = {};
  Object.entries(raw).forEach(([path, msg]) => {
    const hit = BACKEND_PATH_MAP[path];
    out[hit ? hit.key : path] = msg;
  });
  return out;
};

const stepForBackendPath = (path?: string): number | null => {
  if (!path) return null;
  return BACKEND_PATH_MAP[path]?.step ?? null;
};

// ---------- Initial form state ----------
const initialForm = {
  title: "",
  description: "",
  firm: "",
  source: "",
  sourceDetails: "",
  contact: {
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    client: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
    },
  },
  stage: "New",
  estimatedValue: "",
  currency: "INR",
  priority: "Medium",
  nextAction: "",
  nextActionDate: "",
  notes: [] as string[],
  tags: [] as string[],
};

export default function EntitlementAddLeadPage() {
  const params = useParams();
  const router = useRouter();
  const orgName = params.orgName as string;

  const { showLoader, hideLoader } = useLoaderStore();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(initialForm);
  const [firms, setFirms] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [noteDraft, setNoteDraft] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [contactPhoneIso, setContactPhoneIso] = useState(DEFAULT_COUNTRY_ISO);
  const [clientPhoneIso, setClientPhoneIso] = useState(DEFAULT_COUNTRY_ISO);

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const [firmsRes, clientsRes] = await Promise.all([
          getFirmList(),
          getAllClients(),
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

  // ---------- Setters ----------
  const setTop = (k: string, v: any) =>
    setFormData((p) => ({ ...p, [k]: v }));
  const setContact = (k: string, v: any) =>
    setFormData((p) => ({ ...p, contact: { ...p.contact, [k]: v } }));
  const setClient = (k: string, v: any) =>
    setFormData((p) => ({
      ...p,
      contact: {
        ...p.contact,
        client: { ...p.contact.client, [k]: v },
      },
    }));
  const setAddress = (k: string, v: any) =>
    setFormData((p) => ({
      ...p,
      contact: {
        ...p.contact,
        client: {
          ...p.contact.client,
          address: { ...p.contact.client.address, [k]: v },
        },
      },
    }));

  // ---------- Validation per step ----------
  const validateStep = (s: number) => {
    const e: Record<string, string> = {};

    if (s === 1) {
      if (!formData.title.trim())
        e.title = "Lead title is required";
      else if (formData.title.trim().length < 3 || formData.title.length > 200)
        e.title = "Title must be 3 to 200 characters";

      if (formData.description && formData.description.length > 1000)
        e.description = "Description cannot exceed 1000 characters";

      if (!formData.firm) e.firm = "Please select a business unit";
      else if (!RX.objectId.test(formData.firm))
        e.firm = "Invalid business unit selection";

      if (!formData.source) e.source = "Lead source is required";
      else if (!SOURCE_OPTIONS.includes(formData.source))
        e.source = "Invalid source value";

      if (formData.sourceDetails && formData.sourceDetails.length > 300)
        e.sourceDetails = "Source details cannot exceed 300 characters";
    }

    if (s === 2) {
      const c = formData.contact;
      if (!c.name.trim()) e.contactName = "Contact name is required";
      else if (!RX.name.test(c.name.trim()))
        e.contactName =
          "Only letters, spaces, dot, hyphen and apostrophe (2-100 chars)";

      if (c.email.trim() && !RX.email.test(c.email.trim()))
        e.contactEmail = "Enter a valid email (e.g. name@company.com)";

      if (c.phone.trim()) {
        const phoneErr = validatePhoneForCountry(contactPhoneIso, c.phone);
        if (phoneErr) e.contactPhone = phoneErr;
      }

      if (c.company && c.company.length > 200)
        e.contactCompany = "Company name too long (max 200 chars)";

      if (c.position && c.position.length > 100)
        e.contactPosition = "Position too long (max 100 chars)";
    }

    if (s === 3) {
      const cl = formData.contact.client;

      if (!cl.firstName.trim()) e.firstName = "First name is required";
      else if (!RX.name.test(cl.firstName.trim()))
        e.firstName = "Only letters, 2-100 chars";

      if (!cl.lastName.trim()) e.lastName = "Last name is required";
      else if (!RX.name.test(cl.lastName.trim()))
        e.lastName = "Only letters, 2-100 chars";

      if (!cl.email.trim()) e.clientEmail = "Client email is required";
      else if (!RX.email.test(cl.email.trim()))
        e.clientEmail = "Enter a valid email";

      {
        const phoneErr = validatePhoneForCountry(clientPhoneIso, cl.phone);
        if (phoneErr) e.clientPhone = phoneErr;
      }

      if (!cl.address.country.trim()) e.country = "Country is required";
      else if (!/^[a-zA-Z\s.'-]{2,60}$/.test(cl.address.country.trim()))
        e.country = "Letters only, 2-60 chars (no digits)";

      if (cl.address.postalCode && !RX.postal.test(cl.address.postalCode))
        e.postalCode = "Postal code must be 3-10 alphanumeric chars";

      if (cl.address.line1 && cl.address.line1.length > 200)
        e.line1 = "Address line 1 too long (max 200)";
      if (cl.address.line2 && cl.address.line2.length > 200)
        e.line2 = "Address line 2 too long (max 200)";
      if (cl.address.city && !/^[a-zA-Z\s.-]{2,80}$/.test(cl.address.city))
        e.city = "City must be letters only (2-80 chars)";
      if (cl.address.state && !/^[a-zA-Z\s.-]{2,80}$/.test(cl.address.state))
        e.state = "State must be letters only (2-80 chars)";
    }

    if (s === 4) {
      if (!STAGE_OPTIONS.includes(formData.stage))
        e.stage = "Invalid stage";
      if (!PRIORITY_OPTIONS.includes(formData.priority))
        e.priority = "Invalid priority";

      if (formData.estimatedValue !== "") {
        const v = Number(formData.estimatedValue);
        if (Number.isNaN(v) || v < 0)
          e.estimatedValue = "Must be a positive number";
        else if (v > 1e12) e.estimatedValue = "Value too large";
      }

      if (!CURRENCY_OPTIONS.includes(formData.currency))
        e.currency = "Invalid currency";

      if (formData.nextAction && !NEXT_ACTION_OPTIONS.includes(formData.nextAction))
        e.nextAction = "Invalid next action";

      if (formData.nextActionDate) {
        const d = new Date(formData.nextActionDate);
        if (Number.isNaN(d.getTime())) {
          e.nextActionDate = "Invalid date";
        } else {
          const now = new Date();
          now.setSeconds(0, 0);
          if (d.getTime() < now.getTime())
            e.nextActionDate = "Next action date must be in the future";
        }
      }
      if (formData.nextAction && !formData.nextActionDate)
        e.nextActionDate = "Date is required when next action is selected";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------- Step navigation ----------
  const handleNext = () => {
    if (validateStep(step)) {
      setStep((p) => Math.min(p + 1, 5));
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };
  const handleBack = () => setStep((p) => Math.max(p - 1, 1));

  // ---------- Submit ----------
  const handleSubmit = async () => {
    const ok =
      validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4);
    if (!ok) {
      toast.error("Some fields are still invalid");
      return;
    }

    const addressBlock: Record<string, string> = {
      country: formData.contact.client.address.country.trim(),
    };
    const addr = formData.contact.client.address;
    if (addr.line1.trim()) addressBlock.line1 = addr.line1.trim();
    if (addr.line2.trim()) addressBlock.line2 = addr.line2.trim();
    if (addr.city.trim()) addressBlock.city = addr.city.trim();
    if (addr.state.trim()) addressBlock.state = addr.state.trim();
    if (addr.postalCode.trim()) addressBlock.postalCode = addr.postalCode.trim();

    // Backend Zod has source/firmId nested INSIDE contact (current state).
    // Backend controller destructures source/stage/etc from ROOT (post-fix state).
    // We send in BOTH places so both states work without further frontend edits.
    const payload: any = {
      // Root-level (controller reads from here)
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      firm: formData.firm,
      source: formData.source,
      sourceDetails: formData.sourceDetails.trim() || undefined,
      stage: formData.stage,
      currency: formData.currency,
      priority: formData.priority,
      notes: formData.notes,
      tags: formData.tags,

      contact: {
        name: formData.contact.name.trim(),
        email: formData.contact.email.trim() || undefined,
        phone: formData.contact.phone.trim()
          ? findCountry(contactPhoneIso).dial.replace("+", "") +
            formData.contact.phone.trim()
          : undefined,
        company: formData.contact.company.trim() || undefined,
        position: formData.contact.position.trim() || undefined,

        // Mirrored for current Zod schema (which nests these inside contact)
        source: formData.source,
        sourceDetails: formData.sourceDetails.trim() || undefined,
        firmId: formData.firm,
        stage: formData.stage,
        currency: formData.currency,
        priority: formData.priority,

        client: {
          firstName: formData.contact.client.firstName.trim(),
          lastName: formData.contact.client.lastName.trim(),
          email: formData.contact.client.email.trim(),
          phone:
            findCountry(clientPhoneIso).dial.replace("+", "") +
            formData.contact.client.phone.trim(),
          address: addressBlock,
        },
      },
    };

    if (formData.estimatedValue !== "") {
      const v = Number(formData.estimatedValue);
      payload.estimatedValue = v;
      payload.contact.estimatedValue = v;
    }
    if (formData.nextAction) {
      payload.nextAction = formData.nextAction;
      payload.contact.nextAction = formData.nextAction;
    }
    if (formData.nextActionDate) {
      const iso = new Date(formData.nextActionDate).toISOString();
      payload.nextActionDate = iso;
      payload.contact.nextActionDate = iso;
    }

    try {
      showLoader();
      const res = await createLead(payload);

      if (res?.success) {
        toast.success(res.message || "Lead created successfully!");
        router.push(`/${orgName}/modules/settings/entitlements/leads/all`);
        return;
      }

      // createLead hook returns { success: false, error } on axios failure.
      // It also passes through the backend body for 2xx, so handle both.
      const backendErrors = (res as any)?.errors;
      if (Array.isArray(backendErrors) && backendErrors.length) {
        const fieldMap: Record<string, string> = {};
        backendErrors.forEach((er: any) => {
          if (er?.path) fieldMap[er.path] = er.message;
        });
        setErrors((prev) => ({ ...prev, ...mapBackendPaths(fieldMap) }));
        toast.error(backendErrors[0].message || "Validation failed");
        // Jump back to the earliest step that has an error
        const firstStep = stepForBackendPath(backendErrors[0]?.path);
        if (firstStep) setStep(firstStep);
      } else {
        toast.error(res?.error || res?.message || "Failed to create lead");
      }
    } catch (err: any) {
      console.error("createLead unexpected:", err);
      toast.error("Internal server error");
    } finally {
      hideLoader();
    }
  };

  const STEPS = [
    { id: 1, title: "Lead Discovery", icon: Target, color: "bg-blue-600" },
    { id: 2, title: "Primary Contact", icon: Users, color: "bg-indigo-600" },
    { id: 3, title: "Client Identity", icon: Briefcase, color: "bg-purple-600" },
    { id: 4, title: "Sales Process", icon: TrendingUp, color: "bg-amber-600" },
    { id: 5, title: "Final Review", icon: CheckCircle, color: "bg-emerald-600" },
  ];

  // ---------- Tag / Note add helpers ----------
  const addNote = () => {
    const v = noteDraft.trim();
    if (!v) return;
    if (v.length > 500) {
      toast.error("Note too long (max 500 chars)");
      return;
    }
    setFormData((p) => ({ ...p, notes: [...p.notes, v] }));
    setNoteDraft("");
  };
  const removeNote = (i: number) =>
    setFormData((p) => ({ ...p, notes: p.notes.filter((_, idx) => idx !== i) }));

  const addTag = () => {
    const v = tagDraft.trim().toLowerCase();
    if (!v) return;
    if (!/^[a-z0-9-]{2,30}$/.test(v)) {
      toast.error("Tag must be 2-30 chars: lowercase letters, digits, hyphen");
      return;
    }
    if (formData.tags.includes(v)) return;
    setFormData((p) => ({ ...p, tags: [...p.tags, v] }));
    setTagDraft("");
  };
  const removeTag = (t: string) =>
    setFormData((p) => ({ ...p, tags: p.tags.filter((x) => x !== t) }));

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
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Onboard New Lead
              </h1>
              <p className="text-sm text-zinc-500 font-normal">
                Step {step} of 5: {STEPS[step - 1].title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    step === s.id
                      ? `${s.color} text-white scale-110 shadow-lg`
                      : step > s.id
                      ? "bg-zinc-200 text-zinc-500"
                      : "bg-white border-2 border-zinc-100 text-zinc-300"
                  }`}
                >
                  {step > s.id ? <CheckCircle className="h-4 w-4" /> : s.id}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-[2px] mx-1 rounded-full ${
                      step > s.id ? "bg-zinc-200" : "bg-zinc-100"
                    }`}
                  />
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
                {/* ============ STEP 1 ============ */}
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-2 flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Target className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Basic Lead Particulars
                      </h2>
                    </div>

                    <Field
                      label="Lead Purpose / Title"
                      required
                      hint="3-200 characters, e.g. 'Website Overhaul for ABC Corp'"
                      error={errors.title}
                    >
                      <CustomInput
                        placeholder="e.g. Website Overhaul for ABC Corp"
                        value={formData.title}
                        onChange={(e) => setTop("title", e.target.value)}
                        className={
                          errors.title
                            ? "border-red-400 focus-visible:ring-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Associated Business Unit"
                      required
                      hint="Select one of your registered firms"
                      error={errors.firm}
                    >
                      <CustomSelect
                        value={formData.firm}
                        onValueChange={(val) => setTop("firm", val)}
                      >
                        <CustomSelectTrigger
                          className={
                            errors.firm ? "border-red-400" : "bg-zinc-50/50"
                          }
                        >
                          <CustomSelectValue placeholder="Select Organization Unit" />
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {firms.map((f) => (
                            <CustomSelectItem key={f._id} value={f._id}>
                              {f.FirmName}
                            </CustomSelectItem>
                          ))}
                        </CustomSelectContent>
                      </CustomSelect>
                    </Field>

                    <Field
                      label="Description"
                      hint="Optional, max 1000 characters"
                      error={errors.description}
                    >
                      <textarea
                        rows={3}
                        placeholder="Brief description of this lead opportunity"
                        value={formData.description}
                        onChange={(e) => setTop("description", e.target.value)}
                        className={`w-full rounded-md border px-3 py-2 text-sm bg-zinc-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                          errors.description ? "border-red-400" : "border-zinc-200"
                        }`}
                      />
                    </Field>

                    <Field
                      label="Source Details"
                      hint="Optional context, e.g. 'UTM campaign Q3-2024-SEM'"
                      error={errors.sourceDetails}
                    >
                      <CustomInput
                        placeholder="Pricing-page form fill (UTM campaign...)"
                        value={formData.sourceDetails}
                        onChange={(e) =>
                          setTop("sourceDetails", e.target.value)
                        }
                        className={
                          errors.sourceDetails
                            ? "border-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <div className="col-span-2 space-y-2">
                      <CustomLabel className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        Inbound Channel (Source){" "}
                        <span className="text-red-500">*</span>
                      </CustomLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {SOURCE_OPTIONS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setTop("source", s)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                              formData.source === s
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-lg"
                                : "bg-white text-zinc-600 border-zinc-100 hover:border-zinc-300"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      {errors.source ? (
                        <p className="text-[11px] text-red-500 font-medium">
                          {errors.source}
                        </p>
                      ) : (
                        <p className="text-[10px] text-zinc-400 italic">
                          Format: choose one of the predefined channels
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ============ STEP 2 ============ */}
                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-2 flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Primary Contact (Point of Contact)
                      </h2>
                    </div>

                    <Field
                      label="Contact Name"
                      required
                      hint="Letters/spaces only, 2-100 chars (e.g. John Doe)"
                      error={errors.contactName}
                    >
                      <CustomInput
                        placeholder="Full name of contact person"
                        value={formData.contact.name}
                        onChange={(e) => setContact("name", e.target.value)}
                        className={
                          errors.contactName
                            ? "border-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Communication Email"
                      hint="Optional — valid email (e.g. name@company.com)"
                      error={errors.contactEmail}
                    >
                      <CustomInput
                        placeholder="contact@company.com"
                        value={formData.contact.email}
                        onChange={(e) => setContact("email", e.target.value)}
                        className={
                          errors.contactEmail
                            ? "border-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Phone Number"
                      hint={expectedLengthHint(contactPhoneIso)}
                      error={errors.contactPhone}
                    >
                      <PhoneCountryInput
                        value={formData.contact.phone}
                        countryIso={contactPhoneIso}
                        hasError={!!errors.contactPhone}
                        onChange={(national, iso) => {
                          setContactPhoneIso(iso);
                          setContact("phone", national);
                        }}
                      />
                    </Field>

                    <Field
                      label="Company"
                      hint="Optional, max 200 chars"
                      error={errors.contactCompany}
                    >
                      <CustomInput
                        placeholder="Acme Corporation"
                        value={formData.contact.company}
                        onChange={(e) => setContact("company", e.target.value)}
                        className={
                          errors.contactCompany
                            ? "border-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Position / Designation"
                      hint="Optional, max 100 chars (e.g. VP of Engineering)"
                      error={errors.contactPosition}
                    >
                      <CustomInput
                        placeholder="VP of Engineering"
                        value={formData.contact.position}
                        onChange={(e) => setContact("position", e.target.value)}
                        className={
                          errors.contactPosition
                            ? "border-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>
                  </div>
                )}

                {/* ============ STEP 3 ============ */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                          Detailed Client Identity
                        </h2>
                      </div>

                      <CustomSelect
                        onValueChange={(clientId) => {
                          const c = clients.find((x) => x._id === clientId);
                          if (c) {
                            setFormData((p) => ({
                              ...p,
                              contact: {
                                ...p.contact,
                                firmId: p.firm,
                                client: {
                                  firstName: c.firstName || "",
                                  lastName: c.lastName || "",
                                  email: c.email || "",
                                  phone: c.phone || "",
                                  address: {
                                    line1: c.address?.address1 || "",
                                    line2: c.address?.address2 || "",
                                    city: c.address?.city || "",
                                    state: c.address?.state || "",
                                    country: c.address?.country || "",
                                    postalCode: c.address?.pinCode || "",
                                  },
                                },
                              },
                            }));
                            toast.success(`Populated details for ${c.firstName}`);
                          }
                        }}
                      >
                        <CustomSelectTrigger className="w-64 bg-zinc-50/50 border-dashed">
                          <Search className="mr-2 h-4 w-4 opacity-50" />
                          <CustomSelectValue placeholder="Autofill from records" />
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {clients.map((c) => (
                            <CustomSelectItem key={c._id} value={c._id}>
                              {c.firstName} {c.lastName}
                            </CustomSelectItem>
                          ))}
                        </CustomSelectContent>
                      </CustomSelect>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <Field
                        label="First Name"
                        required
                        hint="Letters only, 2-100 chars"
                        error={errors.firstName}
                      >
                        <CustomInput
                          placeholder="Vikas"
                          value={formData.contact.client.firstName}
                          onChange={(e) =>
                            setClient("firstName", e.target.value)
                          }
                          className={
                            errors.firstName
                              ? "border-red-400"
                              : "bg-zinc-50/50"
                          }
                        />
                      </Field>
                      <Field
                        label="Last Name"
                        required
                        hint="Letters only, 2-100 chars"
                        error={errors.lastName}
                      >
                        <CustomInput
                          placeholder="Sharma"
                          value={formData.contact.client.lastName}
                          onChange={(e) =>
                            setClient("lastName", e.target.value)
                          }
                          className={
                            errors.lastName ? "border-red-400" : "bg-zinc-50/50"
                          }
                        />
                      </Field>
                      <Field
                        label="Official Email"
                        required
                        hint="Valid email (e.g. vikas@gmail.com)"
                        error={errors.clientEmail}
                      >
                        <CustomInput
                          placeholder="vikas@gmail.com"
                          value={formData.contact.client.email}
                          onChange={(e) => setClient("email", e.target.value)}
                          className={
                            errors.clientEmail
                              ? "border-red-400"
                              : "bg-zinc-50/50"
                          }
                        />
                      </Field>
                      <Field
                        label="Contact Number"
                        required
                        hint={expectedLengthHint(clientPhoneIso)}
                        error={errors.clientPhone}
                      >
                        <PhoneCountryInput
                          value={formData.contact.client.phone}
                          countryIso={clientPhoneIso}
                          hasError={!!errors.clientPhone}
                          onChange={(national, iso) => {
                            setClientPhoneIso(iso);
                            setClient("phone", national);
                          }}
                        />
                      </Field>

                      <Field
                        label="Address Line 1"
                        hint="Optional, street/building (max 200 chars)"
                        error={errors.line1}
                      >
                        <CustomInput
                          placeholder="Street 1"
                          value={formData.contact.client.address.line1}
                          onChange={(e) => setAddress("line1", e.target.value)}
                          className={
                            errors.line1 ? "border-red-400" : "bg-zinc-50/50"
                          }
                        />
                      </Field>
                      <Field
                        label="Address Line 2"
                        hint="Optional, area/landmark (max 200 chars)"
                        error={errors.line2}
                      >
                        <CustomInput
                          placeholder="Area"
                          value={formData.contact.client.address.line2}
                          onChange={(e) => setAddress("line2", e.target.value)}
                          className={
                            errors.line2 ? "border-red-400" : "bg-zinc-50/50"
                          }
                        />
                      </Field>
                      <Field
                        label="City"
                        hint="Letters only, 2-80 chars"
                        error={errors.city}
                      >
                        <CustomInput
                          placeholder="Jaipur"
                          value={formData.contact.client.address.city}
                          onChange={(e) => setAddress("city", e.target.value)}
                          className={
                            errors.city ? "border-red-400" : "bg-zinc-50/50"
                          }
                        />
                      </Field>
                      <Field
                        label="State"
                        hint="Letters only, 2-80 chars"
                        error={errors.state}
                      >
                        <CustomInput
                          placeholder="Rajasthan"
                          value={formData.contact.client.address.state}
                          onChange={(e) => setAddress("state", e.target.value)}
                          className={
                            errors.state ? "border-red-400" : "bg-zinc-50/50"
                          }
                        />
                      </Field>
                      <Field
                        label="Country / Region"
                        required
                        hint="Letters only, 2-60 chars (e.g. India)"
                        error={errors.country}
                      >
                        <CustomInput
                          placeholder="India"
                          value={formData.contact.client.address.country}
                          onChange={(e) => setAddress("country", e.target.value)}
                          className={
                            errors.country ? "border-red-400" : "bg-zinc-50/50"
                          }
                        />
                      </Field>
                      <Field
                        label="Postal / Zip Code"
                        hint="3-10 alphanumeric chars (e.g. 302001)"
                        error={errors.postalCode}
                      >
                        <CustomInput
                          placeholder="302001"
                          value={formData.contact.client.address.postalCode}
                          onChange={(e) =>
                            setAddress("postalCode", e.target.value)
                          }
                          className={
                            errors.postalCode
                              ? "border-red-400"
                              : "bg-zinc-50/50"
                          }
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {/* ============ STEP 4 ============ */}
                {step === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="col-span-2 flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Sales Process & Pipeline
                      </h2>
                    </div>

                    <Field
                      label="Stage"
                      required
                      hint="Pipeline stage (default: New)"
                      error={errors.stage}
                    >
                      <CustomSelect
                        value={formData.stage}
                        onValueChange={(v) => setTop("stage", v)}
                      >
                        <CustomSelectTrigger className="bg-zinc-50/50">
                          <CustomSelectValue />
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {STAGE_OPTIONS.map((s) => (
                            <CustomSelectItem key={s} value={s}>
                              {s}
                            </CustomSelectItem>
                          ))}
                        </CustomSelectContent>
                      </CustomSelect>
                    </Field>

                    <Field
                      label="Priority"
                      required
                      hint="Low / Medium / High / Critical"
                      error={errors.priority}
                    >
                      <CustomSelect
                        value={formData.priority}
                        onValueChange={(v) => setTop("priority", v)}
                      >
                        <CustomSelectTrigger className="bg-zinc-50/50">
                          <CustomSelectValue />
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {PRIORITY_OPTIONS.map((s) => (
                            <CustomSelectItem key={s} value={s}>
                              {s}
                            </CustomSelectItem>
                          ))}
                        </CustomSelectContent>
                      </CustomSelect>
                    </Field>

                    <Field
                      label="Estimated Value"
                      hint="Positive number, no commas (e.g. 2400000)"
                      error={errors.estimatedValue}
                    >
                      <CustomInput
                        type="number"
                        placeholder="2400000"
                        value={formData.estimatedValue}
                        onChange={(e) =>
                          setTop("estimatedValue", e.target.value)
                        }
                        className={
                          errors.estimatedValue
                            ? "border-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Currency"
                      required
                      hint="3-letter ISO code (default: INR)"
                      error={errors.currency}
                    >
                      <CustomSelect
                        value={formData.currency}
                        onValueChange={(v) => setTop("currency", v)}
                      >
                        <CustomSelectTrigger className="bg-zinc-50/50">
                          <CustomSelectValue />
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {CURRENCY_OPTIONS.map((s) => (
                            <CustomSelectItem key={s} value={s}>
                              {s}
                            </CustomSelectItem>
                          ))}
                        </CustomSelectContent>
                      </CustomSelect>
                    </Field>

                    <Field
                      label="Next Action"
                      hint="What's the next step? (optional)"
                      error={errors.nextAction}
                    >
                      <CustomSelect
                        value={formData.nextAction}
                        onValueChange={(v) => setTop("nextAction", v)}
                      >
                        <CustomSelectTrigger className="bg-zinc-50/50">
                          <CustomSelectValue placeholder="Select next action" />
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {NEXT_ACTION_OPTIONS.map((s) => (
                            <CustomSelectItem key={s} value={s}>
                              {s}
                            </CustomSelectItem>
                          ))}
                        </CustomSelectContent>
                      </CustomSelect>
                    </Field>

                    <Field
                      label="Next Action Date"
                      hint="Must be a future date & time"
                      error={errors.nextActionDate}
                    >
                      <CustomInput
                        type="datetime-local"
                        value={formData.nextActionDate}
                        onChange={(e) =>
                          setTop("nextActionDate", e.target.value)
                        }
                        className={
                          errors.nextActionDate
                            ? "border-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>
                  </div>
                )}

                {/* ============ STEP 5 ============ */}
                {step === 5 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Notes, Tags & Final Review
                      </h2>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <CustomLabel className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        Notes
                      </CustomLabel>
                      <div className="flex gap-2">
                        <CustomInput
                          placeholder="Add a note (max 500 chars) and press +"
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addNote();
                            }
                          }}
                          className="bg-zinc-50/50 flex-1"
                        />
                        <CustomButton
                          type="button"
                          onClick={addNote}
                          className="h-10 px-4"
                        >
                          <Plus className="h-4 w-4" />
                        </CustomButton>
                      </div>
                      <p className="text-[10px] text-zinc-400 italic">
                        Format: free text, max 500 chars per note
                      </p>
                      {formData.notes.length > 0 && (
                        <ul className="space-y-1 mt-2">
                          {formData.notes.map((n, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between bg-zinc-50 rounded-md px-3 py-2 text-xs"
                            >
                              <span className="text-zinc-700">{n}</span>
                              <button
                                type="button"
                                onClick={() => removeNote(i)}
                                className="text-zinc-400 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <CustomLabel className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        Tags
                      </CustomLabel>
                      <div className="flex gap-2">
                        <CustomInput
                          placeholder="e.g. enterprise, hot-lead"
                          value={tagDraft}
                          onChange={(e) => setTagDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                          className="bg-zinc-50/50 flex-1"
                        />
                        <CustomButton
                          type="button"
                          onClick={addTag}
                          className="h-10 px-4"
                        >
                          <Plus className="h-4 w-4" />
                        </CustomButton>
                      </div>
                      <p className="text-[10px] text-zinc-400 italic">
                        Format: lowercase letters, digits, hyphen — 2 to 30 chars
                      </p>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.tags.map((t) => (
                            <span
                              key={t}
                              className="flex items-center gap-1 bg-zinc-900 text-white text-[11px] font-medium rounded-full px-3 py-1"
                            >
                              {t}
                              <button
                                type="button"
                                onClick={() => removeTag(t)}
                                className="hover:text-red-300"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Review */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50/50 dark:bg-zinc-800/20 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          Lead Details
                        </h3>
                        <div className="space-y-3">
                          <Row label="Title" value={formData.title} />
                          <Row label="Source" value={formData.source} />
                          <Row
                            label="Business Unit"
                            value={
                              firms.find((f) => f._id === formData.firm)
                                ?.FirmName || "N/A"
                            }
                          />
                          <Row label="Stage" value={formData.stage} />
                          <Row label="Priority" value={formData.priority} />
                          <Row
                            label="Est. Value"
                            value={
                              formData.estimatedValue
                                ? `${formData.currency} ${formData.estimatedValue}`
                                : "—"
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          Client Identity
                        </h3>
                        <div className="space-y-3">
                          <Row
                            label="Name"
                            value={`${formData.contact.client.firstName} ${formData.contact.client.lastName}`}
                          />
                          <Row
                            label="Email"
                            value={formData.contact.client.email}
                          />
                          <Row
                            label="Phone"
                            value={
                              formData.contact.client.phone
                                ? `${findCountry(clientPhoneIso).dial} ${formData.contact.client.phone}`
                                : "—"
                            }
                          />
                          <Row
                            label="Country"
                            value={formData.contact.client.address.country}
                          />
                          <Row
                            label="Next Action"
                            value={
                              formData.nextAction
                                ? `${formData.nextAction} • ${
                                    formData.nextActionDate || ""
                                  }`
                                : "—"
                            }
                          />
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
                    {step < 5 ? (
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

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between border-b border-zinc-100 pb-2 gap-3">
    <span className="text-xs text-zinc-500">{label}</span>
    <span className="text-xs font-bold text-zinc-800 text-right truncate max-w-[60%]">
      {value || "—"}
    </span>
  </div>
);
