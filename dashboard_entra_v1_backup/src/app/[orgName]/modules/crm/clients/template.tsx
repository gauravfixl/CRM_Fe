"use client"

import { ReactNode, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useModule } from "@/app/context/ModuleContext"
import AboutCard from "@/components/custom/AboutCard"
import ContactDetailsCard from "@/components/custom/ContactDetailsCard"
import { CustomOptionsDropdown } from "@/components/custom/CustomOptionsDropdown"
import { RecentActivityPanel } from "@/components/custom/RecentActivityPanel"

interface ClientTemplateProps {
    children: ReactNode
}

export default function ClientTemplate({ children }: ClientTemplateProps) {
    const pathname = usePathname()
    const { setLeftPanel, setRightPanel } = useModule()

    useEffect(() => {
        // Show panels only for main clients page or client detail page
        const showPanels = pathname?.endsWith("/clients") || /\/clients\/[\w-]+$/.test(pathname || "")

        if (showPanels) {
            setLeftPanel(
                <div className="space-y-4">
                    <AboutCard name="Acme Corporation" />
                    <ContactDetailsCard
                        phone="+91 9876543210"
                        email="contact@acme.com"
                        address="456 Business St, Mumbai"
                    />
                </div>
            )
            setRightPanel(
                <div className="space-y-4">
                    <CustomOptionsDropdown
                        title="Client Actions"
                        options={[
                            { label: "Add Client", value: "add" },
                            { label: "Export Clients", value: "export" },
                            { label: "Assign Account Manager", value: "assign" },
                        ]}
                        onSelect={() => { }}
                    />
                    <RecentActivityPanel title="Recent Client Activity">
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Client "XYZ Corp" added</li>
                            <li>Follow-up scheduled with Jane</li>
                            <li>Client status updated to "Active"</li>
                        </ul>
                    </RecentActivityPanel>
                </div>
            )
        } else {
            setLeftPanel(undefined)
            setRightPanel(undefined)
        }

        // Cleanup panels on unmount
        return () => {
            setLeftPanel(undefined)
            setRightPanel(undefined)
        }
    }, [pathname, setLeftPanel, setRightPanel])

    return <>{children}</>
}
