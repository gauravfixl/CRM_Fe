"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Building2,
  MapPin,
  ShieldCheck,
  FileText,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { CustomLabel } from "@/components/custom/CustomLabel";
import {
  CustomSelect,
  CustomSelectTrigger,
  CustomSelectValue,
  CustomSelectContent,
  CustomSelectItem,
} from "@/components/custom/CustomSelect";
import { useLoaderStore } from "@/lib/loaderStore";
import { getFirmList } from "@/hooks/firmHooks";
import { addClient } from "@/hooks/clientHooks";
import { toast } from "sonner";

// ---------- Validation regex ----------
const RX = {
  name: /^[a-zA-Z\s.'-]{2,80}$/,
  firmName: /^[a-zA-Z0-9\s&.,'()\-]{2,200}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^[0-9]{10,15}$/,
  pin: /^[0-9]{4,10}$/,
  url: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/,
  objectId: /^[a-f\d]{24}$/i,
  // 21 chars: L/U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits
  cin: /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
  // 11 digits
  tin: /^[0-9]{11}$/,
  taxId: /^[a-zA-Z0-9-]{2,30}$/,
  addressLine: /^[a-zA-Z0-9\s,./'()#-]{2,200}$/,
};

// ---------- Field wrapper ----------
type FieldProps = {
  label: string;
  required?: boolean;
  hint: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
};
const Field = ({ label, required, hint, error, children, full }: FieldProps) => (
  <div className={`space-y-1.5 ${full ? "md:col-span-2" : ""}`}>
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

// ---------- Initial form ----------
const initialForm = {
  firmId: "",
  clientFirmName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  website: "",
  address: {
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  },
  contactPerson: {
    name: "",
    email: "",
    phone: "",
    mobile: "",
    altPhone: "",
    altMobile: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  },
  taxId: "",
  tinNo: "",
  cinNo: "",
};

// ---------- Sanitizers ----------
const sanitize = (field: string, val: string): string => {
  if (field === "tinNo") return val.replace(/[^0-9]/g, "").slice(0, 11);
  if (field === "cinNo")
    return val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 21);
  if (
    field === "phone" ||
    field === "contactPhone" ||
    field === "contactMobile" ||
    field === "contactAltPhone" ||
    field === "contactAltMobile"
  )
    return val.replace(/[^0-9]/g, "").slice(0, 15);
  if (field === "pinCode" || field === "contactPinCode")
    return val.replace(/[^0-9]/g, "").slice(0, 10);
  return val;
};

export default function ClientWizardPage() {
  const params = useParams();
  const router = useRouter();
  const orgName = params.orgName as string;

  const { showLoader, hideLoader } = useLoaderStore();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(initialForm);
  const [firms, setFirms] = useState<any[]>([]);

  useEffect(() => {
    const fetchFirms = async () => {
      try {
        showLoader();
        const res = await getFirmList();
        setFirms(res.data?.firms || []);
      } catch (err) {
        console.error("Failed to fetch firms", err);
      } finally {
        hideLoader();
      }
    };
    fetchFirms();
  }, []);

  // ---------- Setters ----------
  const setTop = (k: string, v: any) =>
    setFormData((p) => ({ ...p, [k]: v }));
  const setAddr = (k: string, v: any) =>
    setFormData((p) => ({ ...p, address: { ...p.address, [k]: v } }));
  const setCp = (k: string, v: any) =>
    setFormData((p) => ({
      ...p,
      contactPerson: { ...p.contactPerson, [k]: v },
    }));

  // ---------- Validation ----------
  const validateStep = (s: number) => {
    const e: Record<string, string> = {};

    if (s === 1) {
      if (!formData.firmId) e.firmId = "Please select a business unit";
      else if (!RX.objectId.test(formData.firmId))
        e.firmId = "Invalid firm selection";

      if (formData.clientFirmName && !RX.firmName.test(formData.clientFirmName))
        e.clientFirmName =
          "2-200 chars: letters, digits, spaces and & . , ' ( ) -";

      if (formData.firstName && !RX.name.test(formData.firstName))
        e.firstName = "Letters only, 2-80 chars";
      if (formData.lastName && !RX.name.test(formData.lastName))
        e.lastName = "Letters only, 2-80 chars";

      if (!formData.email.trim()) e.email = "Email is required";
      else if (!RX.email.test(formData.email.trim()))
        e.email = "Enter a valid email (e.g. name@company.com)";

      if (!formData.phone.trim()) e.phone = "Phone is required";
      else if (!RX.phone.test(formData.phone.trim()))
        e.phone = "10-15 digits only, no spaces";

      if (formData.website && !RX.url.test(formData.website.trim()))
        e.website = "Enter a valid URL (e.g. https://company.com)";
    }

    if (s === 2) {
      const a = formData.address;
      if (!a.address1.trim()) e.address1 = "Address line 1 is required";
      else if (!RX.addressLine.test(a.address1.trim()))
        e.address1 = "2-200 chars: letters, digits, , . / ' ( ) # -";

      // Backend Zod requires address2 nonempty
      if (!a.address2.trim()) e.address2 = "Address line 2 is required";
      else if (!RX.addressLine.test(a.address2.trim()))
        e.address2 = "2-200 chars: letters, digits, , . / ' ( ) # -";

      if (a.city && !/^[a-zA-Z\s.'-]{2,80}$/.test(a.city))
        e.city = "Letters only, 2-80 chars";
      if (a.state && !/^[a-zA-Z\s.'-]{2,80}$/.test(a.state))
        e.state = "Letters only, 2-80 chars";

      if (!a.pinCode.trim()) e.pinCode = "Pin code is required";
      else if (!RX.pin.test(a.pinCode))
        e.pinCode = "Digits only, 4-10 digits";

      if (!a.country.trim()) e.country = "Country is required";
      else if (!/^[a-zA-Z\s.'-]{2,60}$/.test(a.country.trim()))
        e.country = "Letters only, 2-60 chars";
    }

    if (s === 3) {
      const cp = formData.contactPerson;
      // contactPerson is fully optional in backend — validate only if filled
      if (cp.name && !RX.name.test(cp.name))
        e.cpName = "Letters only, 2-80 chars";
      if (cp.email && !RX.email.test(cp.email))
        e.cpEmail = "Enter a valid email";
      if (cp.phone && !RX.phone.test(cp.phone))
        e.cpPhone = "10-15 digits";
      if (cp.mobile && !RX.phone.test(cp.mobile))
        e.cpMobile = "10-15 digits";
      if (cp.altPhone && !RX.phone.test(cp.altPhone))
        e.cpAltPhone = "10-15 digits";
      if (cp.altMobile && !RX.phone.test(cp.altMobile))
        e.cpAltMobile = "10-15 digits";
      if (cp.address1 && !RX.addressLine.test(cp.address1))
        e.cpAddress1 = "2-200 chars";
      if (cp.address2 && !RX.addressLine.test(cp.address2))
        e.cpAddress2 = "2-200 chars";
      if (cp.city && !/^[a-zA-Z\s.'-]{2,80}$/.test(cp.city))
        e.cpCity = "Letters only, 2-80 chars";
      if (cp.state && !/^[a-zA-Z\s.'-]{2,80}$/.test(cp.state))
        e.cpState = "Letters only, 2-80 chars";
      if (cp.pinCode && !RX.pin.test(cp.pinCode))
        e.cpPinCode = "Digits only, 4-10 digits";
      if (cp.country && !/^[a-zA-Z\s.'-]{2,60}$/.test(cp.country))
        e.cpCountry = "Letters only, 2-60 chars";
    }

    if (s === 4) {
      if (formData.taxId && !RX.taxId.test(formData.taxId))
        e.taxId = "2-30 chars: letters, digits, hyphen";
      if (formData.tinNo && !RX.tin.test(formData.tinNo))
        e.tinNo = "TIN must be exactly 11 digits";
      if (formData.cinNo && !RX.cin.test(formData.cinNo))
        e.cinNo =
          "CIN must be 21 chars: L/U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------- Navigation ----------
  const handleNext = () => {
    if (validateStep(step)) setStep((p) => Math.min(p + 1, 5));
    else toast.error("Please fix the errors before continuing");
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

    // Build payload exactly as backend Zod expects
    const payload: any = {
      firmId: formData.firmId,
      clientFirmName: formData.clientFirmName.trim() || undefined,
      firstName: formData.firstName.trim() || undefined,
      lastName: formData.lastName.trim() || undefined,
      website: formData.website.trim() || undefined,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: {
        address1: formData.address.address1.trim(),
        address2: formData.address.address2.trim(),
        city: formData.address.city.trim() || undefined,
        state: formData.address.state.trim() || undefined,
        pinCode: Number(formData.address.pinCode), // Zod expects number
        country: formData.address.country.trim(),
      },
      taxId: formData.taxId.trim() || undefined,
      tinNo: formData.tinNo.trim() || undefined,
      cinNo: formData.cinNo.trim() || undefined,
    };

    // Only include contactPerson if user filled at least one field
    const cp = formData.contactPerson;
    const cpHasData = Object.values(cp).some((v) => String(v).trim() !== "");
    if (cpHasData) {
      payload.contactPerson = {
        name: cp.name.trim() || undefined,
        email: cp.email.trim() || undefined,
        address1: cp.address1.trim() || undefined,
        address2: cp.address2.trim() || undefined,
        city: cp.city.trim() || undefined,
        state: cp.state.trim() || undefined,
        pinCode: cp.pinCode ? Number(cp.pinCode) : undefined,
        country: cp.country.trim() || undefined,
        phone: cp.phone.trim() || undefined,
        mobile: cp.mobile.trim() || undefined,
        altPhone: cp.altPhone.trim() || undefined,
        altMobile: cp.altMobile.trim() || undefined,
      };
    }

    try {
      showLoader();
      const res = await addClient(payload);
      const body = res?.data;
      if (body?.success) {
        toast.success(body.message || "Client created successfully!");
        router.push(`/${orgName}/modules/settings/entitlements/clients/all`);
      } else {
        toast.error(body?.message || "Failed to create client");
      }
    } catch (err: any) {
      console.error("createClient failed:", err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 400 && Array.isArray(data?.errors)) {
        toast.error(data.errors[0] || "Validation failed");
      } else if (status === 409) {
        toast.error(
          data?.message || "Client already exists for this email in the firm"
        );
      } else {
        toast.error(data?.message || "Internal server error");
      }
    } finally {
      hideLoader();
    }
  };

  const STEPS = [
    { id: 1, title: "Identity", icon: Building2, color: "bg-blue-600" },
    { id: 2, title: "Address", icon: MapPin, color: "bg-indigo-600" },
    { id: 3, title: "Contact Person", icon: Users, color: "bg-purple-600" },
    { id: 4, title: "Tax & Compliance", icon: ShieldCheck, color: "bg-amber-600" },
    { id: 5, title: "Final Review", icon: CheckCircle, color: "bg-emerald-600" },
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
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Onboard New Client
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
                    <div className="md:col-span-2 flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Client Identity
                      </h2>
                    </div>

                    <Field
                      label="Business Unit (Firm)"
                      required
                      hint="Select one of your registered firms"
                      error={errors.firmId}
                    >
                      <CustomSelect
                        value={formData.firmId}
                        onValueChange={(v) => setTop("firmId", v)}
                      >
                        <CustomSelectTrigger
                          className={
                            errors.firmId ? "border-red-400" : "bg-zinc-50/50"
                          }
                        >
                          <CustomSelectValue placeholder="Select firm" />
                        </CustomSelectTrigger>
                        <CustomSelectContent>
                          {firms.map((f) => (
                            <CustomSelectItem key={f._id} value={f._id}>
                              {f.FirmName || f.firmName}
                            </CustomSelectItem>
                          ))}
                        </CustomSelectContent>
                      </CustomSelect>
                    </Field>

                    <Field
                      label="Client Firm Name"
                      hint="Optional. 2-200 chars (e.g. 'TechNova Solutions')"
                      error={errors.clientFirmName}
                    >
                      <CustomInput
                        placeholder="TechNova Solutions"
                        value={formData.clientFirmName}
                        onChange={(e) =>
                          setTop("clientFirmName", e.target.value)
                        }
                        className={
                          errors.clientFirmName
                            ? "border-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="First Name"
                      hint="Optional. Letters only, 2-80 chars"
                      error={errors.firstName}
                    >
                      <CustomInput
                        placeholder="Ankit"
                        value={formData.firstName}
                        onChange={(e) => setTop("firstName", e.target.value)}
                        className={
                          errors.firstName ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Last Name"
                      hint="Optional. Letters only, 2-80 chars"
                      error={errors.lastName}
                    >
                      <CustomInput
                        placeholder="Mehra"
                        value={formData.lastName}
                        onChange={(e) => setTop("lastName", e.target.value)}
                        className={
                          errors.lastName ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Email"
                      required
                      hint="Valid email (e.g. client@company.com)"
                      error={errors.email}
                    >
                      <CustomInput
                        type="email"
                        placeholder="client@company.com"
                        value={formData.email}
                        onChange={(e) => setTop("email", e.target.value)}
                        className={
                          errors.email ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Phone"
                      required
                      hint="10-15 digits only, no spaces (e.g. 9876543210)"
                      error={errors.phone}
                    >
                      <CustomInput
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) =>
                          setTop("phone", sanitize("phone", e.target.value))
                        }
                        className={
                          errors.phone ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Website"
                      hint="Optional. e.g. https://www.company.com"
                      error={errors.website}
                      full
                    >
                      <CustomInput
                        placeholder="https://www.technova.io"
                        value={formData.website}
                        onChange={(e) => setTop("website", e.target.value)}
                        className={
                          errors.website ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>
                  </div>
                )}

                {/* ============ STEP 2 ============ */}
                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2 flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Business Address
                      </h2>
                    </div>

                    <Field
                      label="Address Line 1"
                      required
                      hint="Street / building (2-200 chars)"
                      error={errors.address1}
                      full
                    >
                      <CustomInput
                        placeholder="123 Sector 21B"
                        value={formData.address.address1}
                        onChange={(e) => setAddr("address1", e.target.value)}
                        className={
                          errors.address1 ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Address Line 2"
                      required
                      hint="Area / landmark (2-200 chars)"
                      error={errors.address2}
                      full
                    >
                      <CustomInput
                        placeholder="Near Central Park"
                        value={formData.address.address2}
                        onChange={(e) => setAddr("address2", e.target.value)}
                        className={
                          errors.address2 ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="City"
                      hint="Letters only, 2-80 chars"
                      error={errors.city}
                    >
                      <CustomInput
                        placeholder="New Delhi"
                        value={formData.address.city}
                        onChange={(e) => setAddr("city", e.target.value)}
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
                        placeholder="Delhi"
                        value={formData.address.state}
                        onChange={(e) => setAddr("state", e.target.value)}
                        className={
                          errors.state ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Pin Code"
                      required
                      hint="Digits only, 4-10 digits (e.g. 110022)"
                      error={errors.pinCode}
                    >
                      <CustomInput
                        placeholder="110022"
                        value={formData.address.pinCode}
                        onChange={(e) =>
                          setAddr("pinCode", sanitize("pinCode", e.target.value))
                        }
                        className={
                          errors.pinCode ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Country"
                      required
                      hint="Letters only, 2-60 chars"
                      error={errors.country}
                    >
                      <CustomInput
                        placeholder="India"
                        value={formData.address.country}
                        onChange={(e) => setAddr("country", e.target.value)}
                        className={
                          errors.country ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>
                  </div>
                )}

                {/* ============ STEP 3 ============ */}
                {step === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2 flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                          Contact Person (Optional)
                        </h2>
                        <p className="text-[11px] text-zinc-400">
                          All fields are optional, but values must follow their format.
                        </p>
                      </div>
                    </div>

                    <Field
                      label="Name"
                      hint="Letters only, 2-80 chars"
                      error={errors.cpName}
                    >
                      <CustomInput
                        placeholder="Riya Sharma"
                        value={formData.contactPerson.name}
                        onChange={(e) => setCp("name", e.target.value)}
                        className={
                          errors.cpName ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Email"
                      hint="Valid email"
                      error={errors.cpEmail}
                    >
                      <CustomInput
                        placeholder="riya.sharma@technova.io"
                        value={formData.contactPerson.email}
                        onChange={(e) => setCp("email", e.target.value)}
                        className={
                          errors.cpEmail ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Phone"
                      hint="10-15 digits only"
                      error={errors.cpPhone}
                    >
                      <CustomInput
                        placeholder="9999999999"
                        value={formData.contactPerson.phone}
                        onChange={(e) =>
                          setCp("phone", sanitize("contactPhone", e.target.value))
                        }
                        className={
                          errors.cpPhone ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Mobile"
                      hint="10-15 digits only"
                      error={errors.cpMobile}
                    >
                      <CustomInput
                        placeholder="8888888888"
                        value={formData.contactPerson.mobile}
                        onChange={(e) =>
                          setCp("mobile", sanitize("contactMobile", e.target.value))
                        }
                        className={
                          errors.cpMobile ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Alt Phone"
                      hint="10-15 digits only"
                      error={errors.cpAltPhone}
                    >
                      <CustomInput
                        placeholder="7777777777"
                        value={formData.contactPerson.altPhone}
                        onChange={(e) =>
                          setCp(
                            "altPhone",
                            sanitize("contactAltPhone", e.target.value)
                          )
                        }
                        className={
                          errors.cpAltPhone ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Alt Mobile"
                      hint="10-15 digits only"
                      error={errors.cpAltMobile}
                    >
                      <CustomInput
                        placeholder="6666666666"
                        value={formData.contactPerson.altMobile}
                        onChange={(e) =>
                          setCp(
                            "altMobile",
                            sanitize("contactAltMobile", e.target.value)
                          )
                        }
                        className={
                          errors.cpAltMobile
                            ? "border-red-400"
                            : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Address Line 1"
                      hint="2-200 chars"
                      error={errors.cpAddress1}
                      full
                    >
                      <CustomInput
                        placeholder="456 Phase 3"
                        value={formData.contactPerson.address1}
                        onChange={(e) => setCp("address1", e.target.value)}
                        className={
                          errors.cpAddress1 ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Address Line 2"
                      hint="2-200 chars"
                      error={errors.cpAddress2}
                      full
                    >
                      <CustomInput
                        placeholder="Opposite City Mall"
                        value={formData.contactPerson.address2}
                        onChange={(e) => setCp("address2", e.target.value)}
                        className={
                          errors.cpAddress2 ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="City"
                      hint="Letters only, 2-80 chars"
                      error={errors.cpCity}
                    >
                      <CustomInput
                        placeholder="Gurgaon"
                        value={formData.contactPerson.city}
                        onChange={(e) => setCp("city", e.target.value)}
                        className={
                          errors.cpCity ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="State"
                      hint="Letters only, 2-80 chars"
                      error={errors.cpState}
                    >
                      <CustomInput
                        placeholder="Haryana"
                        value={formData.contactPerson.state}
                        onChange={(e) => setCp("state", e.target.value)}
                        className={
                          errors.cpState ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Pin Code"
                      hint="Digits only, 4-10 digits"
                      error={errors.cpPinCode}
                    >
                      <CustomInput
                        placeholder="302020"
                        value={formData.contactPerson.pinCode}
                        onChange={(e) =>
                          setCp(
                            "pinCode",
                            sanitize("contactPinCode", e.target.value)
                          )
                        }
                        className={
                          errors.cpPinCode ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="Country"
                      hint="Letters only, 2-60 chars"
                      error={errors.cpCountry}
                    >
                      <CustomInput
                        placeholder="India"
                        value={formData.contactPerson.country}
                        onChange={(e) => setCp("country", e.target.value)}
                        className={
                          errors.cpCountry ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>
                  </div>
                )}

                {/* ============ STEP 4 ============ */}
                {step === 4 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2 flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Tax & Compliance
                      </h2>
                    </div>

                    <Field
                      label="Tax ID"
                      hint="Optional. 2-30 chars: letters, digits, hyphen"
                      error={errors.taxId}
                    >
                      <CustomInput
                        placeholder="TAX-12345"
                        value={formData.taxId}
                        onChange={(e) => setTop("taxId", e.target.value)}
                        className={
                          errors.taxId ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="TIN Number"
                      hint="Optional. Exactly 11 digits (e.g. 27123456789)"
                      error={errors.tinNo}
                    >
                      <CustomInput
                        placeholder="27123456789"
                        value={formData.tinNo}
                        onChange={(e) =>
                          setTop("tinNo", sanitize("tinNo", e.target.value))
                        }
                        maxLength={11}
                        className={
                          errors.tinNo ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>

                    <Field
                      label="CIN Number"
                      hint="Optional. 21 chars: L/U + 5 digits + 2 letters + 4 digits + 3 letters + 6 digits (e.g. L17110MH1973PLC019786)"
                      error={errors.cinNo}
                      full
                    >
                      <CustomInput
                        placeholder="L17110MH1973PLC019786"
                        value={formData.cinNo}
                        onChange={(e) =>
                          setTop("cinNo", sanitize("cinNo", e.target.value))
                        }
                        maxLength={21}
                        className={
                          errors.cinNo ? "border-red-400" : "bg-zinc-50/50"
                        }
                      />
                    </Field>
                  </div>
                )}

                {/* ============ STEP 5 ============ */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <FileText className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Review Submission
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-50/50 dark:bg-zinc-800/20 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          Identity
                        </h3>
                        <div className="space-y-3">
                          <Row
                            label="Firm"
                            value={
                              firms.find((f) => f._id === formData.firmId)
                                ?.FirmName ||
                              firms.find((f) => f._id === formData.firmId)
                                ?.firmName ||
                              "—"
                            }
                          />
                          <Row
                            label="Client Firm"
                            value={formData.clientFirmName}
                          />
                          <Row
                            label="Name"
                            value={`${formData.firstName} ${formData.lastName}`.trim()}
                          />
                          <Row label="Email" value={formData.email} />
                          <Row label="Phone" value={formData.phone} />
                          <Row label="Website" value={formData.website} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                          Address & Tax
                        </h3>
                        <div className="space-y-3">
                          <Row
                            label="Address"
                            value={`${formData.address.address1}, ${formData.address.address2}`}
                          />
                          <Row
                            label="City / State"
                            value={`${formData.address.city || "—"}, ${
                              formData.address.state || "—"
                            }`}
                          />
                          <Row
                            label="Pin / Country"
                            value={`${formData.address.pinCode} • ${formData.address.country}`}
                          />
                          <Row label="TIN" value={formData.tinNo} />
                          <Row label="CIN" value={formData.cinNo} />
                          <Row label="Tax ID" value={formData.taxId} />
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
                        <CheckCircle className="mr-2 h-4 w-4" /> Create Client
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
