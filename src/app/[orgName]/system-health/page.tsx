"use client"

import { AdminPlaceholder } from "@/shared/components/admin/AdminPlaceholder"
import { HeartPulse } from "lucide-react"

export default function SystemHealth() {
    return (
        <AdminPlaceholder
            title="System Health"
            description="Monitor the real-time status and uptime of core platform services and dependencies."
            icon={HeartPulse}
            type="monitoring"
        />
    )
}
