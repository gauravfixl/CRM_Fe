"use client"

import { AdminPlaceholder } from "@/shared/components/admin/AdminPlaceholder"
import { AlertTriangle } from "lucide-react"

export default function ErrorsAlerts() {
    return (
        <AdminPlaceholder
            title="Errors & Alerts"
            description="View recent system errors, integration failures, and platform health alerts."
            icon={AlertTriangle}
            type="monitoring"
        />
    )
}
