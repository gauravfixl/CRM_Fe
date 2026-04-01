"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Eye,
  EyeOff,
  Building2,
  ArrowLeft,
  Mail,
  Lock,
  KeyRound,
  Shield,
  Zap,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { useAuthStore } from "@/lib/useAuthStore"
import { showError, showSuccess } from "@/utils/toast"
import { signInUser, pwlessLogin, otpLogin } from "@/hooks/authHooks"
import { ErrorMessage } from "@/components/custom/ErrorMessage"
import { jwtDecode } from "jwt-decode"
import { supportAgentLogin } from "@/hooks/supportHooks"
import { useBrandingStore } from "../../../lib/useBrandingStore"
import { setAuthCookie } from "@/lib/auth-cookies"

const features = [
  { icon: Shield, title: "Enterprise Security", desc: "SOC2 compliant with end-to-end encryption" },
  { icon: Zap, title: "AI-Powered Insights", desc: "Smart analytics that drive decisions" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Live dashboards for every metric" },
  { icon: Users, title: "Team Collaboration", desc: "Work together across departments" },
]


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
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")
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
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)

    try {
      if (isOtpMode) {
        if (!otpSent) {
          await pwlessLogin(email)
          setOtpSent(true)
          showSuccess("OTP sent to your email!")
        } else {
          const response = await otpLogin(email, otp)
          const userData = response.data?.user
          login(userData)
          showSuccess("Logged in successfully!")
          if (response.data?.orgToken) {
            setAuthCookie(response.data.orgToken)
          }
          const decodedToken: any = jwtDecode(response.data?.orgToken)
          router.push(redirectTo || `/${decodedToken?.orgName || "null"}/dashboard`)
        }
      } else {
        const response = await signInUser({ email, password })
        if (response.status === 200) {
          const userData = response.data?.data
          login(userData)
          showSuccess("Logged in successfully!")

          if (response?.data?.orgToken) {
            const decodedToken: any = jwtDecode(response.data?.orgToken)
            const orgIdFromToken = decodedToken?.orgId || decodedToken?.organizationId || decodedToken?.id
            const orgName = userData?.orgName || ""
            const userRole = decodedToken?.role
            const newPermissionsArray = decodedToken?.permissions || []
            localStorage.setItem("orgToken", response.data?.orgToken)
            localStorage.setItem("orgID", orgIdFromToken)
            localStorage.setItem("orgName", orgName)
            setAuthCookie(response.data.orgToken)
            useAuthStore.getState().setUserRole(userRole)
            useAuthStore.getState().setPermissions(newPermissionsArray)
            useAuthStore.getState().setSingleOrganization({
              orgId: orgIdFromToken,
              orgName: orgName,
              orgActive: true,
            })

            if (userRole === "SupportAgent") {
              try {
                await supportAgentLogin({ email, password })
              } catch (err) {
                console.error("SupportAgent login failed:", err)
              }
            }
            router.push(redirectTo || `/${orgName || orgIdFromToken || "null"}/dashboard`)
          } else {
            router.push(redirectTo || `/${userData?.orgName || "null"}/dashboard`)
          }
        }
      }
    } catch (error: any) {
      showError(error.response?.data?.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const { loginLogoUrl, primaryColor, orgName } = useBrandingStore()
  const brandColor = primaryColor || "#0067B8"

  return (
    <div className="signin-page h-screen flex overflow-hidden" style={{ fontFamily: "'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc, #1e293b)` }}>
        {/* Static background */}
        <div className="absolute inset-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${brandColor}, transparent 70%)` }} />
          <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-5" style={{ background: `radial-gradient(circle, ${brandColor}, transparent 70%)` }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
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

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] mb-6 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-white/70 text-[11px] font-medium tracking-wide uppercase">Trusted by 10,000+ businesses</span>
            </div>

            <h1 className="text-4xl xl:text-[3.25rem] font-bold text-white leading-[1.15] mb-5">
              Manage your
              <br />
              business{" "}
              <span className="text-white/70">smarter</span>
            </h1>
            <p className="text-white/50 text-[15px] leading-relaxed mb-10 max-w-md">
              One platform for CRM, HRM, projects, invoicing, and analytics. Built for teams that move fast and scale without limits.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.06] border border-white/[0.06] hover:bg-white/[0.1] transition-colors duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-[18px] h-[18px] text-white/80" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-white text-[13px] font-semibold leading-snug">{f.title}</p>
                    <p className="text-white/40 text-[11px] mt-0.5 leading-snug">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom stats */}
          <div className="flex items-center gap-10">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "50+", label: "Integrations" },
              { value: "4.9/5", label: "User Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white font-bold text-xl">{s.value}</p>
                <p className="text-white/35 text-[11px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-[#FAFBFC] relative p-6">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F3F4F6] hover:border-[#D1D5DB] transition-colors cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#9CA3AF]" />
        </button>

        {/* Mobile logo */}
        <div className="lg:hidden absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <img
            src={loginLogoUrl || "/images/cubicleweb.png"}
            alt="Logo"
            className="h-7 w-auto object-contain"
          />
          <span className="font-bold text-[15px] text-[#1A1A1A]">{orgName || "CubicleERP"}</span>
        </div>

        <div className="signin-container w-full max-w-[420px]">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: brandColor, boxShadow: `0 8px 24px ${brandColor}30` }}
            >
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-[26px] font-bold text-[#1A1A1A]">Welcome back</h2>
            <p className="text-[#9CA3AF] text-[14px] mt-1.5">Sign in to your account to continue</p>
          </div>

          {/* Form Card */}
          <div className="signin-card bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-7">
            <form onSubmit={handleSignIn} className="signin-form space-y-5">
              {/* Email */}
              <div className="signin-email space-y-2">
                <Label htmlFor="email" className="text-[13px] font-semibold text-[#374151]">
                  Email <span className="text-red-400">*</span>
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5C9D0] group-focus-within:text-[#0067B8] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="signin-input h-12 pl-10 bg-[#FAFBFC] border-[#E5E7EB] focus:border-[#0067B8] focus:ring-2 focus:ring-[#0067B8]/10 focus:bg-white rounded-xl text-[14px] transition-all"
                  />
                </div>
                <ErrorMessage message={errors.email} />
              </div>

              {/* Password */}
              {!isOtpMode && (
                <div className="signin-password space-y-2">
                  <Label htmlFor="password" className="text-[13px] font-semibold text-[#374151]">
                    Password <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5C9D0] group-focus-within:text-[#0067B8] transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="signin-input h-12 pl-10 pr-11 bg-[#FAFBFC] border-[#E5E7EB] focus:border-[#0067B8] focus:ring-2 focus:ring-[#0067B8]/10 focus:bg-white rounded-xl text-[14px] transition-all"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="signin-password-toggle absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#F3F4F6] rounded-lg"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-[#9CA3AF]" />
                      ) : (
                        <Eye className="h-4 w-4 text-[#9CA3AF]" />
                      )}
                    </Button>
                  </div>
                  <ErrorMessage message={errors.password} />
                </div>
              )}

              {/* OTP */}
              {isOtpMode && otpSent && (
                <div className="signin-otp space-y-2">
                  <Label htmlFor="otp" className="text-[13px] font-semibold text-[#374151]">
                    OTP Code <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative group">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5C9D0] group-focus-within:text-[#0067B8] transition-colors" />
                    <Input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="signin-input h-12 pl-10 bg-[#FAFBFC] border-[#E5E7EB] focus:border-[#0067B8] focus:ring-2 focus:ring-[#0067B8]/10 focus:bg-white rounded-xl text-[14px] tracking-[0.4em] font-semibold text-center transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#9CA3AF]">We sent a 6-digit code to your email</p>
                  <ErrorMessage message={errors.otp} />
                </div>
              )}

              {/* Options row */}
              <div className="signin-options flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <Label htmlFor="remember" className="text-[12.5px] text-[#6B7280] cursor-pointer">
                    Remember me
                  </Label>
                </div>
                {!isOtpMode && (
                  <Link
                    href="/auth/forgot-pwd"
                    className="signin-forgot text-[12.5px] font-medium hover:underline transition-colors"
                    style={{ color: brandColor }}
                  >
                    Forgot password?
                  </Link>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="signin-submit w-full h-12 rounded-xl font-semibold text-[14px] text-white transition-all duration-200 hover:brightness-110"
                style={{ backgroundColor: brandColor, boxShadow: `0 4px 16px ${brandColor}35` }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block animate-spin" />
                    Processing...
                  </span>
                ) : isOtpMode ? (
                  otpSent ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Verify OTP
                    </span>
                  ) : "Send OTP"
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F0F0F0]" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="bg-white px-4 text-[#C5C9D0] uppercase tracking-widest font-medium">or</span>
              </div>
            </div>

            {/* OTP toggle */}
            <button
              type="button"
              onClick={() => {
                setIsOtpMode(!isOtpMode)
                setOtpSent(false)
                setOtp("")
                setPassword("")
                setErrors({})
              }}
              className="signin-toggle-btn w-full h-12 rounded-xl border border-[#E5E7EB] bg-white text-[#374151] text-[13.5px] font-medium hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-colors flex items-center justify-center gap-2"
            >
              {isOtpMode ? (
                <>
                  <Lock className="w-4 h-4 text-[#6B7280]" />
                  Sign in with password
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#6B7280]" />
                  Sign in with OTP
                </>
              )}
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center mt-6 text-[13px] text-[#9CA3AF]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="signin-signup font-semibold hover:underline transition-colors"
              style={{ color: brandColor }}
            >
              Create an account
            </Link>
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-5">
            {["SOC2 Certified", "256-bit SSL", "GDPR Ready"].map((badge) => (
              <span key={badge} className="flex items-center gap-1 text-[10px] text-[#C5C9D0]">
                <Shield className="w-3 h-3" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
