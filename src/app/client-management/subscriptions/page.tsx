"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SubscriptionsPage() {
    const router = useRouter()

    useEffect(() => {
        router.push('/client-management/subscriptions/overview')
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-slate-500 animate-pulse tracking-widest uppercase">Booting Subscription Engine...</p>
            </div>
        </div>
    )
}
