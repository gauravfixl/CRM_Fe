"use client"

import { ReactNode, useEffect } from "react"
import { useModule } from "@/app/context/ModuleContext"

interface LeadTemplateProps {
    children: ReactNode
}

export default function LeadTemplate({ children }: LeadTemplateProps) {
    const { setLeftPanel, setRightPanel } = useModule()

    useEffect(() => {
        // Clear side panels to ensure Lead Module has a focused, full-width DataGrid experience
        // We do this in template to ensure it stays cleared even on re-mounting
        setLeftPanel(undefined)
        setRightPanel(undefined)

        return () => {
            setLeftPanel(undefined)
            setRightPanel(undefined)
        }
    }, [setLeftPanel, setRightPanel])

    return <>{children}</>
}
