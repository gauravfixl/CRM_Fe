"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import SubHeader from "@/components/custom/SubHeader"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { Construction } from "lucide-react"

export default function PaymentsPage() {
    const params = useParams() as { orgName?: string }
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    return (
        <>
            <SubHeader
                title="Payments"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Finance", href: `/${orgName}/modules/invoice/all` },
                    { label: "Payments", href: `/${orgName}/modules/payments` },
                ]}
            />

            <div className="p-4">
                <FlatCard className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <FlatCardHeader>
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Construction className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <FlatCardTitle className="text-2xl">Payments Tracking Coming Soon</FlatCardTitle>
                        <FlatCardDescription className="max-w-md mx-auto mt-2">
                            Manage your incoming and outgoing payments. Track payment methods, transaction history,
                            and automated payment reminders.
                        </FlatCardDescription>
                    </FlatCardHeader>
                </FlatCard>
            </div>
        </>
    )
}
