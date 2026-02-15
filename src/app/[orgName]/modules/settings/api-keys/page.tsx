"use client"

import { AdminPlaceholder } from "@/shared/components/admin/AdminPlaceholder"
import { Key } from "lucide-react"

export default function APIKeys() {
    return (
        <AdminPlaceholder
            title="API Keys"
            description="Manage administrative API keys for programmatic access to your organization's data."
            icon={Key}
            type="settings"
        />
    )
}
