"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import SubHeader from "@/components/custom/SubHeader"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import { Construction } from "lucide-react"

export default function GlobalTasksPage() {
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
                title="My Tasks"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Work Management", href: `/${orgName}/modules/workspaces` },
                    { label: "Tasks", href: `/${orgName}/modules/tasks` },
                ]}
            />

            <div className="p-4">
                <FlatCard className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                    <FlatCardHeader>
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Construction className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <FlatCardTitle className="text-2xl">Global Task View Coming Soon</FlatCardTitle>
                        <FlatCardDescription className="max-w-md mx-auto mt-2">
                            View all tasks assigned to you across all projects in a single list.
                            Manage your daily workload efficiently.
                        </FlatCardDescription>
                    </FlatCardHeader>
                </FlatCard>
            </div>
        </>
    )
}
