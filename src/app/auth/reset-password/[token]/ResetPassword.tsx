"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { resetPassword } from "@/hooks/authHooks"
import { showSuccess, showError } from "@/utils/toast"

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [token, setToken] = useState<string | null>(null)

    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        const tokenParam = params.token as string
        if (!tokenParam) {
            showError("Invalid or missing reset token")
            router.push("/auth/signin")
        } else {
            setToken(tokenParam)
        }
    }, [params, router])

    // Password strength checks
    const passwordChecks = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[^A-Za-z\d]/.test(password),
    }
    const allPasswordChecksPassed = Object.values(passwordChecks).every(Boolean)

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!password) {
            newErrors.password = "Password is required"
        } else if (!allPasswordChecksPassed) {
            newErrors.password = "Password does not meet all requirements"
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!token) {
            showError("Invalid reset token")
            return
        }

        if (!validateForm()) return

        setIsLoading(true)
        try {
            await resetPassword(token, password)
            showSuccess("Password reset successfully! Redirecting to sign in...")
            setTimeout(() => {
                router.push("/auth/signin")
            }, 2000)
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                "Failed to reset password. Please try again or request a new reset link."
            showError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
        <div className="flex items-center gap-2 text-xs">
            {met ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            ) : (
                <XCircle className="w-3.5 h-3.5 text-gray-300" />
            )}
            <span className={met ? "text-green-600" : "text-gray-500"}>{text}</span>
        </div>
    )

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
                            <CardTitle className="text-2xl font-bold text-blue-600">Reset Password</CardTitle>
                            <CardDescription className="text-gray-600">
                                Create a new password for your account
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                {/* New Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        New Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                                    {/* Password Requirements */}
                                    {password && (
                                        <div className="space-y-1.5 mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                                            <PasswordRequirement met={passwordChecks.minLength} text="At least 8 characters" />
                                            <PasswordRequirement met={passwordChecks.hasUppercase} text="One uppercase letter (A-Z)" />
                                            <PasswordRequirement met={passwordChecks.hasLowercase} text="One lowercase letter (a-z)" />
                                            <PasswordRequirement met={passwordChecks.hasNumber} text="One number (0-9)" />
                                            <PasswordRequirement met={passwordChecks.hasSpecial} text="One special character (!@#$%^&*)" />
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-11 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-400" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-400" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                                    disabled={isLoading || !token}
                                >
                                    {isLoading ? "Resetting Password..." : "Reset Password"}
                                </Button>
                            </form>

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Remember your password?{" "}
                                    <button
                                        onClick={() => router.push("/auth/signin")}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Sign in here
                                    </button>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
