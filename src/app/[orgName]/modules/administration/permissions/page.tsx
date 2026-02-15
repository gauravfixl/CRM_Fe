"use client"

import { AdminPlaceholder } from "@/shared/components/admin/AdminPlaceholder"
import { Lock } from "lucide-react"

export default function PermissionSets() {
    return (
        <AdminPlaceholder
            title="Permission Sets"
            description="Create and assign granular permission sets to users without changing their primary roles."
            icon={Lock}
            type="governance"
        />
    )
}
