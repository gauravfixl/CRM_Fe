
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

import { useState } from "react";
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
import { Eye, EyeOff, Building2 } from "lucide-react";
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

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
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

  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleInputChange = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" })); // clear error on change
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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(formData.firstName.trim())) {
      errors.firstName = "First name can only contain alphabetic letters (A-Z)";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else {
      if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/.test(formData.password)) {
        errors.password =
          "Password must include uppercase, lowercase, number, and special character";
      }
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (formData.phone && !/^\+[1-9]\d{1,14}$/.test(formData.phone)) {
      errors.phone = "Phone number must be in E.164 format (e.g., +1234567890)";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to Terms of Service and Privacy Policy";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    showLoader();
    try {
      let payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
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
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      className={`h-11 ${formErrors.firstName ? "border-red-500" : ""}`}
                    />
                    <ErrorMessage message={formErrors.firstName} />
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      className={`h-11 ${formErrors.lastName ? "border-red-500" : ""}`}
                    />
                    <ErrorMessage message={formErrors.lastName} />
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
                      placeholder="Enter email"
                      className={`h-11 ${formErrors.email ? "border-red-500" : ""}`}
                    />
                    <ErrorMessage message={formErrors.email} />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      className={`h-11 ${formErrors.phone ? "border-red-500" : ""}`}
                    />
                    <ErrorMessage message={formErrors.phone} />
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
                        placeholder="Create password"
                        className={`h-11 pr-10 ${formErrors.password ? "border-red-500" : ""}`}
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
                        placeholder="Confirm password"
                        className={`h-11 pr-10 ${formErrors.confirmPassword ? "border-red-500" : ""}`}
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
                    <ErrorMessage message={formErrors.confirmPassword} />
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
                    <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
                <ErrorMessage message={formErrors.agreeToTerms} />
                {/* Your existing inputs stay unchanged */}
                {/* ... all input fields and validation code as before ... */}

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
