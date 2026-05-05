"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Building2,
  ChevronDown,
  Search,
  Check,
  X,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  ArrowRight,
  Shield,
  Sparkles,
  Camera,
  Quote,
  Star,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/useAuthStore";
import { createUser } from "@/hooks/userHooks";
import { ErrorMessage } from "@/components/custom/ErrorMessage";
import { showSuccess } from "@/utils/toast";
import { useLoaderStore } from "@/lib/loaderStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useBrandingStore } from "@/lib/useBrandingStore";

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳", digits: 10 },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸", digits: 10 },
  { code: "+44", country: "UK", flag: "🇬🇧", digits: 10 },
  { code: "+61", country: "Australia", flag: "🇦🇺", digits: 9 },
  { code: "+81", country: "Japan", flag: "🇯🇵", digits: 10 },
  { code: "+49", country: "Germany", flag: "🇩🇪", digits: 11 },
  { code: "+33", country: "France", flag: "🇫🇷", digits: 9 },
  { code: "+86", country: "China", flag: "🇨🇳", digits: 11 },
  { code: "+7", country: "Russia", flag: "🇷🇺", digits: 10 },
  { code: "+55", country: "Brazil", flag: "🇧🇷", digits: 11 },
  { code: "+27", country: "South Africa", flag: "🇿🇦", digits: 9 },
  { code: "+971", country: "UAE", flag: "🇦🇪", digits: 9 },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", digits: 9 },
  { code: "+65", country: "Singapore", flag: "🇸🇬", digits: 8 },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", digits: 10 },
  { code: "+62", country: "Indonesia", flag: "🇮🇩", digits: 11 },
  { code: "+63", country: "Philippines", flag: "🇵🇭", digits: 10 },
  { code: "+82", country: "South Korea", flag: "🇰🇷", digits: 10 },
  { code: "+39", country: "Italy", flag: "🇮🇹", digits: 10 },
  { code: "+34", country: "Spain", flag: "🇪🇸", digits: 9 },
  { code: "+31", country: "Netherlands", flag: "🇳🇱", digits: 9 },
  { code: "+46", country: "Sweden", flag: "🇸🇪", digits: 9 },
  { code: "+47", country: "Norway", flag: "🇳🇴", digits: 8 },
  { code: "+45", country: "Denmark", flag: "🇩🇰", digits: 8 },
  { code: "+41", country: "Switzerland", flag: "🇨🇭", digits: 9 },
  { code: "+48", country: "Poland", flag: "🇵🇱", digits: 9 },
  { code: "+90", country: "Turkey", flag: "🇹🇷", digits: 10 },
  { code: "+52", country: "Mexico", flag: "🇲🇽", digits: 10 },
  { code: "+54", country: "Argentina", flag: "🇦🇷", digits: 10 },
  { code: "+56", country: "Chile", flag: "🇨🇱", digits: 9 },
  { code: "+57", country: "Colombia", flag: "🇨🇴", digits: 10 },
  { code: "+20", country: "Egypt", flag: "🇪🇬", digits: 10 },
  { code: "+234", country: "Nigeria", flag: "🇳🇬", digits: 10 },
  { code: "+254", country: "Kenya", flag: "🇰🇪", digits: 9 },
  { code: "+92", country: "Pakistan", flag: "🇵🇰", digits: 10 },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩", digits: 10 },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰", digits: 9 },
  { code: "+977", country: "Nepal", flag: "🇳🇵", digits: 10 },
  { code: "+64", country: "New Zealand", flag: "🇳🇿", digits: 9 },
  { code: "+353", country: "Ireland", flag: "🇮🇪", digits: 9 },
  { code: "+351", country: "Portugal", flag: "🇵🇹", digits: 9 },
  { code: "+30", country: "Greece", flag: "🇬🇷", digits: 10 },
  { code: "+36", country: "Hungary", flag: "🇭🇺", digits: 9 },
  { code: "+43", country: "Austria", flag: "🇦🇹", digits: 10 },
  { code: "+32", country: "Belgium", flag: "🇧🇪", digits: 9 },
  { code: "+358", country: "Finland", flag: "🇫🇮", digits: 10 },
  { code: "+66", country: "Thailand", flag: "🇹🇭", digits: 9 },
  { code: "+84", country: "Vietnam", flag: "🇻🇳", digits: 9 },
];

const includedFeatures = [
  "14-day free trial, no credit card needed",
  "Unlimited projects & team members",
  "CRM, HRM, Invoicing — all in one place",
  "Priority onboarding & 24/7 support",
  "Cancel anytime, no questions asked",
];

const testimonial = {
  quote:
    "We replaced 6 different tools with Cubicle in a single weekend. Our team finally has one place for everything — and onboarding took less than an hour.",
  author: "Priya Sharma",
  role: "Head of Operations, Nexora Tech",
  avatar: "https://i.pravatar.cc/80?img=47",
};

function getInputBorderClass(value: string, error: string | undefined, touched: boolean): string {
  if (error) return "border-red-400 focus:border-red-500 focus:ring-red-500/10";
  if (touched && value.trim()) return "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10";
  return "border-[#E5E7EB] focus:border-[#0067B8] focus:ring-[#0067B8]/10";
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const { showLoader, hideLoader } = useLoaderStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    avatarFile: null as File | null,
  });

  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { loginLogoUrl, primaryColor, orgName } = useBrandingStore();
  const brandColor = primaryColor || "#0067B8";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCountryDropdownOpen(false);
        setCountrySearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRY_CODES;
    const q = countrySearch.toLowerCase();
    return COUNTRY_CODES.filter(
      (c) => c.country.toLowerCase().includes(q) || c.code.includes(q)
    );
  }, [countrySearch]);

  const validateField = (field: string, value: string) => {
    let error = "";
    switch (field) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (!/^[A-Za-z\s]+$/.test(value.trim())) error = "Only alphabets are allowed";
        break;
      case "lastName":
        if (value.trim() && !/^[A-Za-z\s]+$/.test(value.trim())) error = "Only alphabets are allowed";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          error = "Please enter a valid email (e.g. user@example.com)";
        break;
      case "phone":
        if (!value) error = "Phone number is required";
        else {
          const digitsOnly = value.replace(/\D/g, "");
          if (digitsOnly.length !== selectedCountry.digits)
            error = `Please enter ${selectedCountry.digits} digit phone number for ${selectedCountry.country}`;
        }
        break;
      case "confirmPassword":
        if (!value) error = "Confirm password is required";
        else if (formData.password !== value) error = "Passwords do not match";
        break;
    }
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    if (typeof value === "string") {
      validateField(field, value);
    } else {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNameInput = (field: "firstName" | "lastName", value: string) => {
    const filtered = value.replace(/[^A-Za-z\s]/g, "");
    handleInputChange(field, filtered);
  };

  const handlePhoneInput = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    const limited = digitsOnly.slice(0, selectedCountry.digits);
    handleInputChange("phone", limited);
  };

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    if (typeof formData[field as keyof typeof formData] === "string") {
      validateField(field, formData[field as keyof typeof formData] as string);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange("avatarFile", file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[^A-Za-z\d]/.test(formData.password),
  };
  const allPasswordChecksPassed = Object.values(passwordChecks).every(Boolean);
  const passedCount = Object.values(passwordChecks).filter(Boolean).length;
  const strengthPercent = (passedCount / 5) * 100;
  const strengthColor =
    passedCount <= 2 ? "#ef4444" : passedCount <= 3 ? "#f59e0b" : passedCount <= 4 ? "#3b82f6" : "#10b981";
  const strengthLabel =
    passedCount === 0 ? "" : passedCount <= 2 ? "Weak" : passedCount <= 3 ? "Fair" : passedCount <= 4 ? "Good" : "Strong";

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    else if (!/^[A-Za-z\s]+$/.test(formData.firstName.trim()))
      errors.firstName = "Only alphabets are allowed";

    if (formData.lastName.trim() && !/^[A-Za-z\s]+$/.test(formData.lastName.trim()))
      errors.lastName = "Only alphabets are allowed";

    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errors.email = "Please enter a valid email (e.g. user@example.com)";

    if (!formData.password) errors.password = "Password is required";
    else if (!allPasswordChecksPassed) errors.password = "Password does not meet all requirements";

    if (!formData.confirmPassword) errors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (!formData.phone) errors.phone = "Phone number is required";
    else {
      const digitsOnly = formData.phone.replace(/\D/g, "");
      if (digitsOnly.length !== selectedCountry.digits)
        errors.phone = `Please enter ${selectedCountry.digits} digit phone number for ${selectedCountry.country}`;
    }

    if (!formData.agreeToTerms)
      errors.agreeToTerms = "You must agree to Terms of Service and Privacy Policy";

    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => (allTouched[key] = true));
    setTouchedFields(allTouched);

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    showLoader();
    setIsLoading(true);
    try {
      const fullPhone = formData.phone ? `${selectedCountry.code}${formData.phone}` : "";
      let payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      if (avatarPreview) payload.avatar = avatarPreview;

      const data = await createUser(payload);
      login(data.user);
      showSuccess("Account created successfully!");
      setShowChoiceModal(true);
    } catch (error: any) {
      console.error("Sign up error:", error.response?.data || error.message);
    } finally {
      hideLoader();
      setIsLoading(false);
    }
  };

  const handleChoice = (createOrg: boolean) => {
    setShowChoiceModal(false);
    if (createOrg) router.push("/auth/create-org");
    else router.push("/auth/signin");
  };

  return (
    <>
      <div
        className="signup-page h-screen flex overflow-hidden"
        style={{
          fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* Left Form Panel (swapped — form on left to differ from signin) */}
        <div className="flex-1 flex items-start justify-center bg-[#EDF1F7] relative overflow-y-auto order-1">
          {/* Back button */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-6 left-6 z-20 w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F3F4F6] hover:border-[#D1D5DB] transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#9CA3AF]" />
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            <img
              src={loginLogoUrl || "/images/cubicleweb.png"}
              alt="Logo"
              className="h-7 w-auto object-contain"
            />
            <span className="font-bold text-[15px] text-[#1A1A1A]">{orgName || "CubicleERP"}</span>
          </div>

          <div className="signup-container w-full max-w-[640px] px-6 py-10 lg:py-8">
            {/* Header with Avatar */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20 group">
                  <Avatar className="w-20 h-20 border-4 border-white shadow-lg ring-2 ring-[#DEE7F5]">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="avatar" />
                    ) : (
                      <AvatarFallback
                        className="text-white text-lg"
                        style={{ backgroundColor: brandColor }}
                      >
                        <Building2 className="w-7 h-7" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white cursor-pointer transition-transform group-hover:scale-110"
                    style={{ backgroundColor: brandColor }}
                  >
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
              <h2 className="text-[26px] font-bold text-[#1A1A1A]">Create your account</h2>
              <p className="text-[#9CA3AF] text-[14px] mt-1.5">
                Join thousands of businesses using {orgName || "CubicleERP"}
              </p>
            </div>

            {/* Form Card */}
            <div
              className="signup-card rounded-3xl border border-white p-7 sm:p-9"
              style={{
                background:
                  "linear-gradient(145deg, #FFFFFF 0%, #F4F8FF 55%, #EAF2FE 100%)",
                boxShadow:
                  "0 20px 60px -20px rgba(15, 23, 42, 0.12), 0 8px 24px -12px rgba(37, 99, 235, 0.12)",
              }}
            >
              <form onSubmit={handleSignUp} className="signup-form space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-[13px] font-semibold text-[#374151]">
                      First Name <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5C9D0] group-focus-within:text-[#0067B8] transition-colors" />
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleNameInput("firstName", e.target.value)}
                        onBlur={() => handleBlur("firstName")}
                        placeholder="John"
                        className={`h-11 pl-10 bg-white focus:bg-white rounded-xl text-[14px] transition-all ${getInputBorderClass(formData.firstName, formErrors.firstName, touchedFields.firstName)}`}
                      />
                      {touchedFields.firstName && !formErrors.firstName && formData.firstName.trim() && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <ErrorMessage message={formErrors.firstName} />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-[13px] font-semibold text-[#374151]">
                      Last Name
                    </Label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5C9D0] group-focus-within:text-[#0067B8] transition-colors" />
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleNameInput("lastName", e.target.value)}
                        onBlur={() => handleBlur("lastName")}
                        placeholder="Doe"
                        className={`h-11 pl-10 bg-white focus:bg-white rounded-xl text-[14px] transition-all ${getInputBorderClass(formData.lastName, formErrors.lastName, touchedFields.lastName)}`}
                      />
                      {touchedFields.lastName && !formErrors.lastName && formData.lastName.trim() && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <ErrorMessage message={formErrors.lastName} />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[13px] font-semibold text-[#374151]">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5C9D0] group-focus-within:text-[#0067B8] transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="name@company.com"
                      className={`h-11 pl-10 bg-white focus:bg-white rounded-xl text-[14px] transition-all ${getInputBorderClass(formData.email, formErrors.email, touchedFields.email)}`}
                    />
                    {touchedFields.email && !formErrors.email && formData.email.trim() && (
                      <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <ErrorMessage message={formErrors.email} />
                </div>

                {/* Phone with country code */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-[13px] font-semibold text-[#374151]">
                    Phone Number <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setCountryDropdownOpen(!countryDropdownOpen);
                          setCountrySearch("");
                        }}
                        className="flex items-center gap-1.5 h-11 px-3 border border-[#E5E7EB] rounded-xl bg-white hover:bg-[#F9FAFB] hover:border-[#D1D5DB] text-sm whitespace-nowrap min-w-[95px] transition-colors"
                      >
                        <span className="text-base leading-none">{selectedCountry.flag}</span>
                        <span className="text-[13px] font-medium text-[#374151]">{selectedCountry.code}</span>
                        <ChevronDown className={`h-3.5 w-3.5 text-[#9CA3AF] transition-transform ${countryDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {countryDropdownOpen && (
                        <div className="absolute z-50 top-12 left-0 w-72 bg-white border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden">
                          <div className="p-2.5 border-b border-[#F0F0F0] sticky top-0 bg-white">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#9CA3AF]" />
                              <input
                                type="text"
                                placeholder="Search country..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-[13px] border border-[#E5E7EB] rounded-lg bg-[#FAFBFC] focus:outline-none focus:border-[#0067B8] focus:ring-2 focus:ring-[#0067B8]/10"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="overflow-y-auto max-h-56">
                            {filteredCountries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setSelectedCountry(c);
                                  setCountryDropdownOpen(false);
                                  setCountrySearch("");
                                  if (formData.phone) {
                                    const digitsOnly = formData.phone.replace(/\D/g, "");
                                    const limited = digitsOnly.slice(0, c.digits);
                                    setFormData((prev) => ({ ...prev, phone: limited }));
                                    if (limited.length > 0 && limited.length !== c.digits) {
                                      setFormErrors((prev) => ({
                                        ...prev,
                                        phone: `Please enter ${c.digits} digit phone number for ${c.country}`,
                                      }));
                                    } else {
                                      setFormErrors((prev) => ({ ...prev, phone: "" }));
                                    }
                                  }
                                }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] hover:bg-[#F9FAFB] text-left transition-colors ${selectedCountry.code === c.code ? "bg-[#F0F7FF] font-medium" : ""}`}
                              >
                                <span className="text-base">{c.flag}</span>
                                <span className="flex-1 text-[#374151]">{c.country}</span>
                                <span className="text-[#9CA3AF] text-[12px]">{c.code}</span>
                                {selectedCountry.code === c.code && (
                                  <Check className="h-3.5 w-3.5" style={{ color: brandColor }} />
                                )}
                              </button>
                            ))}
                            {filteredCountries.length === 0 && (
                              <p className="px-3 py-3 text-[13px] text-[#9CA3AF] text-center">No country found</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative group flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5C9D0] group-focus-within:text-[#0067B8] transition-colors" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handlePhoneInput(e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        placeholder={`${selectedCountry.digits} digits`}
                        className={`h-11 pl-10 bg-white focus:bg-white rounded-xl text-[14px] transition-all ${getInputBorderClass(formData.phone, formErrors.phone, touchedFields.phone)}`}
                        maxLength={selectedCountry.digits}
                      />
                      {touchedFields.phone && !formErrors.phone && formData.phone.length === selectedCountry.digits && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                  <ErrorMessage message={formErrors.phone} />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[13px] font-semibold text-[#374151]">
                    Password <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5C9D0] group-focus-within:text-[#0067B8] transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      placeholder="Create a strong password"
                      className={`h-11 pl-10 pr-11 bg-white focus:bg-white rounded-xl text-[14px] transition-all ${formErrors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                        : touchedFields.password && allPasswordChecksPassed
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10"
                          : "border-[#E5E7EB] focus:border-[#0067B8] focus:ring-[#0067B8]/10"
                        }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#F3F4F6] rounded-lg"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-[#9CA3AF]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#9CA3AF]" />
                      )}
                    </Button>
                  </div>

                  {/* Password strength bar & checklist */}
                  {formData.password.length > 0 && (
                    <div className="mt-2 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-[#E5EEFE] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#6B7280]">
                          Password strength
                        </span>
                        <span
                          className="text-[11px] font-semibold"
                          style={{ color: strengthColor }}
                        >
                          {strengthLabel}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${strengthPercent}%`,
                            backgroundColor: strengthColor,
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
                        {[
                          { key: "minLength", label: "8+ characters" },
                          { key: "hasUppercase", label: "Uppercase (A-Z)" },
                          { key: "hasLowercase", label: "Lowercase (a-z)" },
                          { key: "hasNumber", label: "Number (0-9)" },
                          { key: "hasSpecial", label: "Special (!@#$)" },
                        ].map(({ key, label }) => {
                          const passed = passwordChecks[key as keyof typeof passwordChecks];
                          return (
                            <div key={key} className="flex items-center gap-1.5">
                              {passed ? (
                                <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                              ) : (
                                <X className="h-3 w-3 text-[#C5C9D0] shrink-0" />
                              )}
                              <span
                                className={`text-[11px] ${passed ? "text-emerald-600" : "text-[#9CA3AF]"}`}
                              >
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {formErrors.password && formData.password.length === 0 && (
                    <ErrorMessage message={formErrors.password} />
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-[13px] font-semibold text-[#374151]">
                    Confirm Password <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5C9D0] group-focus-within:text-[#0067B8] transition-colors" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      placeholder="Re-enter your password"
                      className={`h-11 pl-10 pr-11 bg-white focus:bg-white rounded-xl text-[14px] transition-all ${getInputBorderClass(
                        formData.confirmPassword,
                        formErrors.confirmPassword,
                        touchedFields.confirmPassword &&
                          formData.password === formData.confirmPassword &&
                          formData.confirmPassword.length > 0
                      )}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#F3F4F6] rounded-lg"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-[#9CA3AF]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#9CA3AF]" />
                      )}
                    </Button>
                  </div>
                  {touchedFields.confirmPassword &&
                  !formErrors.confirmPassword &&
                  formData.confirmPassword &&
                  formData.password === formData.confirmPassword ? (
                    <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1">
                      <Check className="h-3 w-3" /> Passwords match
                    </p>
                  ) : (
                    <ErrorMessage message={formErrors.confirmPassword} />
                  )}
                </div>

                {/* Terms */}
                <div className="pt-1">
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-[12.5px] text-[#6B7280] leading-relaxed cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms-of-service"
                        className="font-medium hover:underline"
                        style={{ color: brandColor }}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-medium hover:underline"
                        style={{ color: brandColor }}
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  <ErrorMessage message={formErrors.agreeToTerms} />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl font-semibold text-[14px] text-white transition-all duration-200 hover:brightness-110"
                  style={{
                    backgroundColor: brandColor,
                    boxShadow: `0 4px 16px ${brandColor}35`,
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            {/* Sign in link */}
            <p className="text-center mt-6 text-[13px] text-[#9CA3AF]">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-semibold hover:underline transition-colors"
                style={{ color: brandColor }}
              >
                Sign in here
              </Link>
            </p>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-4 pb-4">
              {["SOC2 Certified", "256-bit SSL", "GDPR Ready"].map((badge) => (
                <span key={badge} className="flex items-center gap-1 text-[10px] text-[#C5C9D0]">
                  <Shield className="w-3 h-3" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Brand Panel — testimonial + checklist style (different from signin) */}
        <div
          className="hidden lg:flex lg:w-[45%] relative overflow-hidden order-2"
          style={{
            background: `linear-gradient(215deg, #0f172a 0%, ${brandColor} 60%, ${brandColor}dd 100%)`,
          }}
        >
          {/* Decorative shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
              style={{ background: `radial-gradient(circle, ${brandColor}, transparent 70%)` }}
            />
            <div
              className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
              style={{ background: `radial-gradient(circle, #a855f7, transparent 70%)` }}
            />
            <div
              className="absolute top-[30%] right-[10%] w-[180px] h-[180px] rounded-full blur-2xl opacity-25"
              style={{ background: `radial-gradient(circle, #38bdf8, transparent 70%)` }}
            />
            {/* Dotted pattern */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)`,
                backgroundSize: "22px 22px",
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 w-full">
            {/* Top row: Logo + free-trial badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={loginLogoUrl || "/images/cubicleweb.png"}
                  alt="Logo"
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
                <span className="text-white font-bold text-lg tracking-tight">
                  {orgName || "CubicleERP"}
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <span className="text-emerald-200 text-[10.5px] font-semibold tracking-wide uppercase">
                  Free forever plan
                </span>
              </div>
            </div>

            {/* Center: Headline + What's inside checklist */}
            <div className="max-w-md py-6">
              <h1 className="text-[2.6rem] xl:text-[3rem] font-bold text-white leading-[1.1] mb-4">
                Start building
                <br />
                in <span
                  className="italic"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #fde68a, #fca5a5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  under 2 minutes.
                </span>
              </h1>
              <p className="text-white/55 text-[14.5px] leading-relaxed mb-7">
                Sign up once, unlock every module. No forced plans, no credit card, no hidden tricks.
              </p>

              {/* What's inside — simple checklist (different from signin's grid cards) */}
              <div className="space-y-2.5">
                <p className="text-white/40 text-[10.5px] font-semibold tracking-[0.15em] uppercase mb-3">
                  What&apos;s included
                </p>
                {includedFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-300" strokeWidth={3} />
                    </div>
                    <span className="text-white/80 text-[13.5px] leading-snug">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Testimonial card */}
            <div className="relative">
              <div className="relative rounded-2xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-sm p-5 overflow-hidden">
                <Quote
                  className="absolute top-3 right-3 w-8 h-8 text-white/10"
                  strokeWidth={1.5}
                />
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-amber-300"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="text-white/90 text-[13.5px] leading-relaxed mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                  />
                  <div>
                    <p className="text-white text-[12.5px] font-semibold leading-tight">
                      {testimonial.author}
                    </p>
                    <p className="text-white/45 text-[11px] mt-0.5 leading-tight">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Choice Modal */}
      <Dialog open={showChoiceModal} onOpenChange={setShowChoiceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create an Organization?</DialogTitle>
            <DialogDescription>
              Would you like to create your organization now or sign in directly?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => handleChoice(false)}>
              Sign In Instead
            </Button>
            <Button
              onClick={() => handleChoice(true)}
              style={{ backgroundColor: brandColor }}
              className="text-white hover:brightness-110"
            >
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
