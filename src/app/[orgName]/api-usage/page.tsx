"use client"

import { AdminPlaceholder } from "@/shared/components/admin/AdminPlaceholder"
import { BarChart3 } from "lucide-react"

export default function APIUsage() {
    return (
        <AdminPlaceholder
            title="API Usage"
            description="Track API request volumes, authentication rates, and endpoint popularity."
            icon={BarChart3}
            type="monitoring"
        />
    )
}
