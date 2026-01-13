"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import CandidateDashboard from "@/components/hrm/org/onboarding/preboarding/candidate/candidatedashboard"

export default function UploadOnBehalfPage() {
  const { id } = useParams()
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  // OTP-related state
  const [showOtpForm, setShowOtpForm] = useState(false)
  const [mobile, setMobile] = useState("")
  const [captcha, setCaptcha] = useState("")
  const [enteredCaptcha, setEnteredCaptcha] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")

  // Generate random captcha
  const generateCaptcha = () => {
    const randomCaptcha = Math.random().toString(36).substring(2, 7).toUpperCase()
    setCaptcha(randomCaptcha)
  }

  // Simulate sending OTP
  const handleSendOtp = () => {
    if (!mobile || mobile.length !== 10) {
      alert("Enter a valid 10-digit mobile number")
      return
    }
    if (enteredCaptcha !== captcha) {
      alert("Captcha mismatch! Try again.")
      generateCaptcha()
      setEnteredCaptcha("")
      return
    }

    const otpValue = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otpValue)
    setOtpSent(true)
  }

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      alert("✅ Mobile number verified successfully!")
      setIsVerified(true)
    } else {
      alert("❌ Invalid OTP! Try again.")
    }
  }

  const handleVerify = (method: string) => {
    if (!acceptedPolicy) {
      alert("Please accept the Privacy Policy first.")
      return
    }

    if (method === "Mobile OTP") {
      setShowOtpForm(true)
      generateCaptcha()
      return
    }

    setIsVerified(true)
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm text-center space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-12 w-12 rounded-full border flex items-center justify-center text-lg">
              ☀️
            </div>
            <h2 className="text-base font-semibold">Welcome Aman Tiwari</h2>
            <p className="text-xs text-gray-500">
              You need to verify your account to continue
            </p>
          </div>

          <div className="flex items-start justify-center space-x-2 text-xs">
            <Checkbox
              checked={acceptedPolicy}
              onCheckedChange={() => setAcceptedPolicy(!acceptedPolicy)}
              id="policy"
            />
            <label htmlFor="policy" className="text-gray-600">
              I accept Cubicle’s{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>{" "}
              with respect to data collection and usage.
            </label>
          </div>

          {!showOtpForm ? (
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => handleVerify("Google")}
              >
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => handleVerify("LinkedIn")}
              >
                Sign in with LinkedIn
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => handleVerify("Microsoft")}
              >
                Sign in with Microsoft
              </Button>
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => handleVerify("Mobile OTP")}
              >
                Sign in with mobile OTP
              </Button>
            </div>
          ) : (
            <div className="text-left space-y-3 mt-4">
              <label className="text-xs font-medium">Mobile Number</label>
              <Input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit number"
                maxLength={10}
                className="text-xs"
              />

              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 border px-3 py-1 rounded text-sm font-mono">
                  {captcha}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={generateCaptcha}
                >
                  ↻
                </Button>
              </div>
              <Input
                type="text"
                placeholder="Enter captcha"
                value={enteredCaptcha}
                onChange={(e) => setEnteredCaptcha(e.target.value.toUpperCase())}
                className="text-xs"
              />

              {!otpSent ? (
                <Button
                  className="w-full bg-blue-600 text-white text-xs"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </Button>
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    className="w-full bg-green-600 text-white text-xs"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </Button>
                </>
              )}
            </div>
          )}

          <p className="text-[10px] text-gray-400 mt-2">
            Cubicle HR uses this page to manage employee onboarding experience.
          </p>
        </div>
      </div>
    )
  }

  return <CandidateDashboard />
}
