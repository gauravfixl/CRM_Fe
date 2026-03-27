"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AutomationPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/client-management/automation/overview')
    }, [router])

    return null
}
