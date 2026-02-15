"use client"

import { AdminPlaceholder } from "@/shared/components/admin/AdminPlaceholder"
import { Box } from "lucide-react"

export default function ExternalApps() {
    return (
        <AdminPlaceholder
            title="External Apps"
            description="Connect and manage third-party applications and their access permissions to your CRM data."
            icon={Box}
            type="settings"
        />
    )
}
