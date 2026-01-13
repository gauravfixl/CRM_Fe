"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { forgotPassword } from "@/hooks/authHooks"
import { showSuccess, showError } from "@/utils/toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format"
    return ""
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const emailError = validateEmail(email)
    if (emailError) {
      setErrors({ email: emailError })
      return
    }

    setIsLoading(true)
    try {
      const response = await forgotPassword({ email })
      showSuccess(response?.data?.message || "Password reset link sent to your email.")
      router.push("/auth/login") // redirect after success
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to send password reset link. Please try again."
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-6xl h-full md:h-[90%]">
        {/* Left - Animation */}
        <div className="hidden md:flex items-center justify-center w-full md:w-1/2 bg-blue-50">
          <DotLottieReact
            src="https://lottie.host/18ebe672-c02d-4cc8-8c7c-d313371bf0ac/iV3oknqcnq.lottie"
            loop
            autoplay
          />
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-blue-600">Forgot Password</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your email and we&apos;ll send you a reset link
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
