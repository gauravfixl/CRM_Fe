"use client"

import { AppLayout } from "@/shared/components/app-layout"

export default function OrgLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AppLayout>{children}</AppLayout>
}
