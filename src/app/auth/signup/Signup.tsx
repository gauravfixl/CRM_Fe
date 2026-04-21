
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Eye, EyeOff, Building2 } from "lucide-react";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useAuthStore } from "@/lib/useAuthStore";
// import { createUser } from "@/hooks/userHooks";
// import { ErrorMessage } from "@/components/custom/ErrorMessage";
// import { showSuccess } from "@/utils/toast";
// import { useLoaderStore } from "@/lib/loaderStore";

// export default function SignUpPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
// const {showLoader, hideLoader} =useLoaderStore();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     agreeToTerms: false,
//     avatarFile: null as File | null
//   });

//   const router = useRouter();
//   const login = useAuthStore((state) => state.login);

//   const handleInputChange = (
//     field: string,
//     value: string | boolean | File | null
//   ) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setFormErrors((prev) => ({ ...prev, [field]: "" })); // clear error on change
//   };

//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       handleInputChange("avatarFile", file);
//       const reader = new FileReader();
//       reader.onloadend = () => setAvatarPreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   // --- VALIDATION FUNCTION ---
//   const validateForm = () => {
//     const errors: Record<string, string> = {};

//     if (!formData.firstName.trim()) {
//       errors.firstName = "First name is required";
//     } else if (!/^[A-Za-z]+$/.test(formData.firstName.trim())) {
//       errors.firstName = "First name can only contain alphabetic letters (A-Z)";
//     }

//     if (!formData.lastName.trim()) {
//       errors.lastName = "Last name is required";
//     }

//     if (!formData.email.trim()) {
//       errors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
//       errors.email = "Email is invalid";
//     }

//     if (!formData.password) {
//       errors.password = "Password is required";
//     } else {
//       if (formData.password.length < 8) {
//         errors.password = "Password must be at least 8 characters long";
//       }
//       if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/.test(formData.password)) {
//         errors.password = "Password must include uppercase, lowercase, number, and special character";
//       }
//     }

//     if (!formData.confirmPassword) {
//       errors.confirmPassword = "Confirm password is required";
//     } else if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//     }

//     if (formData.phone && !/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
//       errors.phone = "Phone number must be in E.164 format (e.g., +1234567890)";
//     }

//     if (!formData.agreeToTerms) {
//       errors.agreeToTerms = "You must agree to Terms of Service and Privacy Policy";
//     }

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     showLoader();
//     try {
//       let payload: any = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         confirmPassword: formData.confirmPassword
//       };
//       if (avatarPreview) payload.avatar = avatarPreview;

//       const data = await createUser(payload);
//       login(data.user);
//       showSuccess("Account created successfully!");

//       router.push("/auth/create-org");
//     } catch (error: any) {
//       console.error("Sign up error:", error.response?.data || error.message);
//     } finally {
//       hideLoader();
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4">
//       <div className="w-full max-w-2xl">
//         <Card className="shadow-2xl border-0">
//           <CardHeader className="space-y-4 text-center">
//             <div className="flex justify-center">
//               <div className="relative w-24 h-24">
//                 <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-md">
//                   {avatarPreview ? (
//                     <AvatarImage src={avatarPreview} alt="avatar" />
//                   ) : (
//                     <AvatarFallback className="bg-blue-600 text-white text-lg">
//                       <Building2 className="w-6 h-6" />
//                     </AvatarFallback>
//                   )}
//                 </Avatar>
//                 <div className="absolute bottom-0 right-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-md border-2 border-white">
//                   +
//                 </div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="absolute inset-0 opacity-0 cursor-pointer"
//                   onChange={handleAvatarChange}
//                 />
//               </div>
//             </div>
//             <div>
//               <CardTitle className="text-2xl font-bold text-blue-600">Create Your Account</CardTitle>
//               <CardDescription className="text-gray-600">Join thousands of businesses using Cubicle CRM</CardDescription>
//             </div>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             <form onSubmit={handleSignUp} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 {/* First Name */}
//                 <div>
//                   <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
//                   <Input
//                     id="firstName"
//                     value={formData.firstName}
//                     onChange={(e) => handleInputChange("firstName", e.target.value)}
//                     placeholder="Enter first name"
//                     className={`h-11 ${formErrors.firstName ? "border-red-500" : ""}`}
//                   />
//                   <ErrorMessage message={formErrors.firstName} />
//                 </div>

//                 {/* Last Name */}
//                 <div>
//                   <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
//                   <Input
//                     id="lastName"
//                     value={formData.lastName}
//                     onChange={(e) => handleInputChange("lastName", e.target.value)}
//                     placeholder="Enter last name"
//                     className={`h-11 ${formErrors.lastName ? "border-red-500" : ""}`}
//                   />
//                   <ErrorMessage message={formErrors.lastName} />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 {/* Email */}
//                 <div>
//                   <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     placeholder="Enter email"
//                     className={`h-11 ${formErrors.email ? "border-red-500" : ""}`}
//                   />
//                   <ErrorMessage message={formErrors.email} />
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <Label htmlFor="phone">Phone Number</Label>
//                   <Input
//                     id="phone"
//                     value={formData.phone}
//                     onChange={(e) => handleInputChange("phone", e.target.value)}
//                     placeholder="Enter phone number"
//                     className={`h-11 ${formErrors.phone ? "border-red-500" : ""}`}
//                   />
//                   <ErrorMessage message={formErrors.phone} />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 {/* Password */}
//                 <div>
//                   <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       value={formData.password}
//                       onChange={(e) => handleInputChange("password", e.target.value)}
//                       placeholder="Create password"
//                       className={`h-11 pr-10 ${formErrors.password ? "border-red-500" : ""}`}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
//                     </Button>
//                   </div>
//                   <ErrorMessage message={formErrors.password} />
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
//                   <div className="relative">
//                     <Input
//                       id="confirmPassword"
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={formData.confirmPassword}
//                       onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
//                       placeholder="Confirm password"
//                       className={`h-11 pr-10 ${formErrors.confirmPassword ? "border-red-500" : ""}`}
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     >
//                       {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
//                     </Button>
//                   </div>
//                   <ErrorMessage message={formErrors.confirmPassword} />
//                 </div>
//               </div>

//               {/* Terms */}
//               <div className="flex items-start space-x-2">
//                 <Checkbox
//                   id="terms"
//                   checked={formData.agreeToTerms}
//                   onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
//                   className="mt-1"
//                 />
//                 <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
//                   I agree to the{" "}
//                   <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
//                   and{" "}
//                   <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
//                 </Label>
//               </div>
//               <ErrorMessage message={formErrors.agreeToTerms} />

//               <Button
//                 type="submit"
//                 className="w-full h-11 bg-blue-600 hover:bg-blue-700"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Creating Account..." : "Create Account"}
//               </Button>
//             </form>

//             <div className="text-center">
//               <p className="text-sm text-gray-600">
//                 Already have an account?{" "}
//                 <Link href="/auth/signin" className="text-blue-600 hover:underline">Sign in here</Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Building2, ChevronDown, Search, Check, X } from "lucide-react";
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
  DialogFooter
} from "@/components/ui/dialog";

// Country codes with phone number length info
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

// Helper to get border class based on field validity
function getInputBorderClass(value: string, error: string | undefined, touched: boolean): string {
  if (error) return "border-red-500 focus-visible:ring-red-500";
  if (touched && value.trim()) return "border-green-500 focus-visible:ring-green-500";
  return "";
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
    avatarFile: null as File | null
  });

  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // Default India +91
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  // Close country dropdown on outside click
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

  // Real-time field validation
  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        } else if (!/^[A-Za-z\s]+$/.test(value.trim())) {
          error = "Only alphabets are allowed";
        }
        break;
      case "lastName":
        if (value.trim() && !/^[A-Za-z\s]+$/.test(value.trim())) {
          error = "Only alphabets are allowed";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email (e.g. user@example.com)";
        }
        break;
      case "phone":
        if (!value) {
          error = "Phone number is required";
        } else {
          const digitsOnly = value.replace(/\D/g, "");
          if (digitsOnly.length !== selectedCountry.digits) {
            error = `Please enter ${selectedCountry.digits} digit phone number for ${selectedCountry.country}`;
          }
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Confirm password is required";
        } else if (formData.password !== value) {
          error = "Passwords do not match";
        }
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

    // Real-time validation for text fields
    if (typeof value === "string") {
      validateField(field, value);
    } else {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Only allow alphabets in name fields
  const handleNameInput = (field: "firstName" | "lastName", value: string) => {
    // Filter out non-alphabet characters (allow spaces for compound names)
    const filtered = value.replace(/[^A-Za-z\s]/g, "");
    handleInputChange(field, filtered);
  };

  // Only allow digits in phone field
  const handlePhoneInput = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    // Limit to max digits for selected country
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

  // Password strength checks
  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[^A-Za-z\d]/.test(formData.password),
  };
  const allPasswordChecksPassed = Object.values(passwordChecks).every(Boolean);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.firstName.trim())) {
      errors.firstName = "Only alphabets are allowed";
    }

    if (formData.lastName.trim() && !/^[A-Za-z\s]+$/.test(formData.lastName.trim())) {
      errors.lastName = "Only alphabets are allowed";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email (e.g. user@example.com)";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!allPasswordChecksPassed) {
      errors.password = "Password does not meet all requirements";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, "");
      if (digitsOnly.length !== selectedCountry.digits) {
        errors.phone = `Please enter ${selectedCountry.digits} digit phone number for ${selectedCountry.country}`;
      }
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to Terms of Service and Privacy Policy";
    }

    // Mark all fields as touched
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
    try {
      const fullPhone = formData.phone ? `${selectedCountry.code}${formData.phone}` : "";
      let payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };
      if (avatarPreview) payload.avatar = avatarPreview;

      const data = await createUser(payload);
      login(data.user);
      showSuccess("Account created successfully!");

      // Show modal instead of immediate redirect
      setShowChoiceModal(true);
    } catch (error: any) {
      console.error("Sign up error:", error.response?.data || error.message);
    } finally {
      hideLoader();
    }
  };

  const handleChoice = (createOrg: boolean) => {
    setShowChoiceModal(false);
    if (createOrg) {
      router.push("/auth/create-org");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#1e293b] p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="relative w-24 h-24">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-md">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="avatar" />
                    ) : (
                      <AvatarFallback className="bg-blue-600 text-white text-lg">
                        <Building2 className="w-6 h-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-md border-2 border-white">
                    +
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-blue-600">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Join thousands of businesses using Cubicle CRM
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleNameInput("firstName", e.target.value)}
                      onBlur={() => handleBlur("firstName")}
                      placeholder="Enter first name"
                      className={`h-11 ${getInputBorderClass(formData.firstName, formErrors.firstName, touchedFields.firstName)}`}
                    />
                    {touchedFields.firstName && !formErrors.firstName && formData.firstName.trim() ? (
                      <p className="text-xs text-green-600 mt-1">Looks good!</p>
                    ) : (
                      <ErrorMessage message={formErrors.firstName} />
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">Only alphabets allowed</p>
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleNameInput("lastName", e.target.value)}
                      onBlur={() => handleBlur("lastName")}
                      placeholder="Enter last name"
                      className={`h-11 ${getInputBorderClass(formData.lastName, formErrors.lastName, touchedFields.lastName)}`}
                    />
                    {touchedFields.lastName && !formErrors.lastName && formData.lastName.trim() ? (
                      <p className="text-xs text-green-600 mt-1">Looks good!</p>
                    ) : (
                      <ErrorMessage message={formErrors.lastName} />
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">Only alphabets allowed</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      placeholder="Enter email"
                      className={`h-11 ${getInputBorderClass(formData.email, formErrors.email, touchedFields.email)}`}
                    />
                    {touchedFields.email && !formErrors.email && formData.email.trim() ? (
                      <p className="text-xs text-green-600 mt-1">Valid email</p>
                    ) : (
                      <ErrorMessage message={formErrors.email} />
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">Format: user@example.com</p>
                  </div>

                  {/* Phone with Country Code Dropdown */}
                  <div>
                    <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                    <div className="flex gap-1">
                      {/* Country Code Dropdown */}
                      <div className="relative" ref={dropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setCountryDropdownOpen(!countryDropdownOpen);
                            setCountrySearch("");
                          }}
                          className="flex items-center gap-1 h-11 px-2 border rounded-md bg-white hover:bg-gray-50 text-sm whitespace-nowrap min-w-[85px]"
                        >
                          <span>{selectedCountry.flag}</span>
                          <span className="text-xs">{selectedCountry.code}</span>
                          <ChevronDown className="h-3 w-3 text-gray-400" />
                        </button>

                        {countryDropdownOpen && (
                          <div className="absolute z-50 top-12 left-0 w-64 bg-white border rounded-lg shadow-xl max-h-60 overflow-hidden">
                            <div className="p-2 border-b sticky top-0 bg-white">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search country..."
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  className="w-full pl-7 pr-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="overflow-y-auto max-h-48">
                              {filteredCountries.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setCountryDropdownOpen(false);
                                    setCountrySearch("");
                                    // Re-validate phone if already entered
                                    if (formData.phone) {
                                      const digitsOnly = formData.phone.replace(/\D/g, "");
                                      const limited = digitsOnly.slice(0, c.digits);
                                      setFormData((prev) => ({ ...prev, phone: limited }));
                                      if (limited.length > 0 && limited.length !== c.digits) {
                                        setFormErrors((prev) => ({
                                          ...prev,
                                          phone: `Please enter ${c.digits} digit phone number for ${c.country}`
                                        }));
                                      } else {
                                        setFormErrors((prev) => ({ ...prev, phone: "" }));
                                      }
                                    }
                                  }}
                                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 text-left ${selectedCountry.code === c.code ? "bg-blue-50 font-medium" : ""
                                    }`}
                                >
                                  <span>{c.flag}</span>
                                  <span className="flex-1">{c.country}</span>
                                  <span className="text-gray-500 text-xs">{c.code}</span>
                                  {selectedCountry.code === c.code && (
                                    <Check className="h-3.5 w-3.5 text-blue-600" />
                                  )}
                                </button>
                              ))}
                              {filteredCountries.length === 0 && (
                                <p className="px-3 py-2 text-sm text-gray-400">No country found</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handlePhoneInput(e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        placeholder={`${selectedCountry.digits} digits`}
                        className={`h-11 flex-1 ${getInputBorderClass(formData.phone, formErrors.phone, touchedFields.phone)}`}
                        maxLength={selectedCountry.digits}
                      />
                    </div>
                    {touchedFields.phone && !formErrors.phone && formData.phone.length === selectedCountry.digits ? (
                      <p className="text-xs text-green-600 mt-1">Valid phone number</p>
                    ) : (
                      <ErrorMessage message={formErrors.phone} />
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {selectedCountry.code} requires {selectedCountry.digits} digits
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Password */}
                  <div>
                    <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        onBlur={() => handleBlur("password")}
                        placeholder="Create password"
                        className={`h-11 pr-10 ${formErrors.password
                            ? "border-red-500 focus-visible:ring-red-500"
                            : touchedFields.password && allPasswordChecksPassed
                              ? "border-green-500 focus-visible:ring-green-500"
                              : ""
                          }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                    <ErrorMessage message={formErrors.password} />
                    {/* Password requirements checklist */}
                    {(touchedFields.password || formData.password.length > 0) && (
                      <div className="mt-1.5 space-y-0.5">
                        {[
                          { key: "minLength", label: "At least 8 characters" },
                          { key: "hasUppercase", label: "One uppercase letter (A-Z)" },
                          { key: "hasLowercase", label: "One lowercase letter (a-z)" },
                          { key: "hasNumber", label: "One number (0-9)" },
                          { key: "hasSpecial", label: "One special character (!@#$...)" },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center gap-1">
                            {passwordChecks[key as keyof typeof passwordChecks] ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <X className="h-3 w-3 text-red-400" />
                            )}
                            <span
                              className={`text-[10px] ${passwordChecks[key as keyof typeof passwordChecks]
                                  ? "text-green-600"
                                  : "text-red-400"
                                }`}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        onBlur={() => handleBlur("confirmPassword")}
                        placeholder="Confirm password"
                        className={`h-11 pr-10 ${getInputBorderClass(
                          formData.confirmPassword,
                          formErrors.confirmPassword,
                          touchedFields.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
                            ? true
                            : touchedFields.confirmPassword
                        )}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      </Button>
                    </div>
                    {touchedFields.confirmPassword && !formErrors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword ? (
                      <p className="text-xs text-green-600 mt-1">Passwords match</p>
                    ) : (
                      <ErrorMessage message={formErrors.confirmPassword} />
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
                <ErrorMessage message={formErrors.agreeToTerms} />

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-blue-600 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal */}
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
            <Button onClick={() => handleChoice(true)}>Create Organization</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
