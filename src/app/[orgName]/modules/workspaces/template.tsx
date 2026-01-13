"use client"

import { ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useModule } from "@/app/context/ModuleContext"
import AboutCard from "@/components/custom/AboutCard"
import ContactDetailsCard from "@/components/custom/ContactDetailsCard"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"

interface WorkspaceTemplateProps {
    children: ReactNode
}

export default function WorkspaceTemplate({ children }: WorkspaceTemplateProps) {
    const pathname = usePathname()
    const { setLeftPanel, setRightPanel } = useModule()

    useEffect(() => {
        // ONLY show panels on the main "Workspaces" management page (/manage)
        // Remove from everywhere else (Specific workspace details, boards, projects, etc.)
        const showPanels = pathname?.endsWith("/workspaces/manage")

        if (showPanels) {
            setLeftPanel(
                <div className="space-y-4">
                    <AboutCard name="Workspace Name" />
                    <ContactDetailsCard
                        phone="+91 9876543210"
                        email="workspace@example.com"
                        address="123 Work St, Mumbai"
                    />
                </div>
            )
            setRightPanel(
                <div className="space-y-4">
                    <CustomOptionsDropdown
                        title="Workspace Actions"
                        options={[
                            { label: "Add Workspace", value: "add" },
                            { label: "Export Workspaces", value: "export" },
                            { label: "Manage Members", value: "members" },
                        ]}
                        onSelect={() => { }}
                    />

                    <RecentActivityPanel title="Recent Workspace Activity">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Workspace "Alpha" created</li>
                            <li>Member "John Doe" added</li>
                            <li>Settings updated for "Beta Workspace"</li>
                        </ul>
                    </RecentActivityPanel>
                </div>
            )
        } else {
            setLeftPanel(undefined)
            setRightPanel(undefined)
        }

        return () => {
            setLeftPanel(undefined)
            setRightPanel(undefined)
        }
    }, [pathname, setLeftPanel, setRightPanel])

    return <>{children}</>
}
