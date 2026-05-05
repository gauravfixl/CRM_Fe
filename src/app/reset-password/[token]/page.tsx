'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ResetPasswordRedirect() {
    const router = useRouter()
    const params = useParams()
    const token = params.token as string

    useEffect(() => {
        // Redirect from /reset-password/[token] to /auth/reset-password/[token]
        if (token) {
            router.replace(`/auth/reset-password/${token}`)
        }
    }, [token, router])

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white text-lg font-medium">Redirecting...</p>
            </div>
        </div>
    )
}
