"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Building2 } from "lucide-react"
import { useAuthStore } from "@/lib/useAuthStore"
import { showError, showSuccess } from "@/utils/toast"
import { signInUser, pwlessLogin, otpLogin } from "@/hooks/authHooks"
import { ErrorMessage } from "@/components/custom/ErrorMessage"
import { jwtDecode } from "jwt-decode"
import { supportAgentLogin } from "@/hooks/supportHooks"

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOtpMode, setIsOtpMode] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; otp?: string }>({})
  const router = useRouter()
  const login = useAuthStore((state) => state.login)

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email"

    if (!isOtpMode) {
      if (!password.trim()) newErrors.password = "Password is required"
    } else {
      if (otpSent && (!otp.trim() || otp.length !== 6)) newErrors.otp = "Enter a valid 6-digit OTP"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
      if (isOtpMode) {
        if (!otpSent) {
          await pwlessLogin(email);
          setOtpSent(true);
          showSuccess("OTP sent to your email!");
        } else {
          const response = await otpLogin(email, otp);
          const userData = response.data?.user;
          login(userData);
          showSuccess("Logged in successfully!");
          const decodedToken: any = jwtDecode(response.data?.orgToken);
          router.push(`/${decodedToken?.orgName || "null"}/dashboard`);
        }
      } else {
        const response = await signInUser({ email, password });
        if (response.status === 200) {
          const userData = response.data?.data;
          login(userData);
          showSuccess("Logged in successfully!");

          if (response?.data?.orgToken) {
            const decodedToken: any = jwtDecode(response.data?.orgToken);
            console.log("Decoded Org Token:", decodedToken);
            const orgIdFromToken = decodedToken?.orgId || decodedToken?.organizationId || decodedToken?.id;
            const userRole = decodedToken?.role;
            const newPermissionsArray = decodedToken?.permissions;
            localStorage.setItem("orgToken", response.data?.orgToken);
            localStorage.setItem("orgID", orgIdFromToken);
            localStorage.setItem("orgName", decodedToken?.orgName || "");
            useAuthStore.getState().setUserRole(userRole);
            useAuthStore.getState().setPermissions(newPermissionsArray);

            if (userRole === "SupportAgent") {
              try {
                await supportAgentLogin({ email, password });
              } catch (err) {
                console.error("SupportAgent login failed:", err);
              }
            }
            router.push(`/${orgIdFromToken || "null"}/dashboard`);
          } else {
            router.push(`/${userData?.orgName || "null"}/dashboard`);
          }
        }
      }
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page min-h-screen flex items-center justify-center bg-[#1e293b] p-4">
      <div className="signin-container w-full max-w-md">
        <Card className="signin-card shadow-2xl border-0">
          <CardHeader className="signin-header space-y-4 text-center">
            <div className="signin-logo flex justify-center">
              <div className="signin-logo-icon flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="signin-title text-2xl font-bold text-blue-600">Cubicle</CardTitle>
              <CardDescription className="signin-subtitle text-gray-600">Sign in to your account to continue</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="signin-content space-y-6">
            <form onSubmit={handleSignIn} className="signin-form space-y-4">
              <div className="signin-email space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="signin-input h-11" />
                <ErrorMessage message={errors.email} />
              </div>

              {!isOtpMode && (
                <div className="signin-password space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="signin-input h-11 pr-10" />
                    <Button type="button" variant="ghost" size="sm" className="signin-password-toggle absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                  </div>
                  <ErrorMessage message={errors.password} />
                </div>
              )}

              {isOtpMode && otpSent && (
                <div className="signin-otp space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">OTP <span className="text-red-500">*</span></Label>
                  <Input id="otp" type="text" inputMode="numeric" placeholder="Enter 6-digit OTP" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="signin-input h-11" />
                  <ErrorMessage message={errors.otp} />
                </div>
              )}

              <div className="signin-options flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
                  <Label htmlFor="remember" className="text-sm text-gray-600">Remember Me</Label>
                </div>
                {!isOtpMode && <Link href="/auth/forgot-pwd" className="signin-forgot text-sm text-blue-600 hover:underline">Forgot Password?</Link>}
              </div>

              <Button type="submit" className="signin-submit w-full h-11 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Processing..." : isOtpMode ? (otpSent ? "Verify OTP" : "Send OTP") : "Sign In"}
              </Button>
            </form>

            <div className="signin-toggle text-center space-y-4">
              <div className="text-sm text-gray-600">
                {isOtpMode ? "Want to login with password?" : "Prefer OTP?"}{" "}
                <button type="button" onClick={() => { setIsOtpMode(!isOtpMode); setOtpSent(false); setOtp(""); setPassword(""); setErrors({}); }} className="signin-toggle-btn text-blue-600 hover:underline">
                  {isOtpMode ? "Use password login" : "One-Tap Code"}
                </button>
              </div>
              <div className="text-sm text-gray-600">
                Don&apos;t have an account? <Link href="/auth/signup" className="signin-signup text-blue-600 hover:underline">Click here to sign up</Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
