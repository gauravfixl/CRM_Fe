"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CommunicationPage() {
    const router = useRouter()

    useEffect(() => {
        router.push('/client-management/communication/email')
    }, [router])

    return null
}
