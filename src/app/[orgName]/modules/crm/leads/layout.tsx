"use client"

import { ReactNode, useEffect } from "react"
import { useModule } from "@/app/context/ModuleContext"

interface LeadLayoutProps {
  children: ReactNode
}

export default function LeadLayout({ children }: LeadLayoutProps) {
  const { setLeftPanel, setRightPanel } = useModule()

  useEffect(() => {
    // Clear side panels to allow the Lead Management page to consume full width
    setLeftPanel(undefined)
    setRightPanel(undefined)

    return () => {
      setLeftPanel(undefined)
      setRightPanel(undefined)
    }
  }, [setLeftPanel, setRightPanel])

  return <>{children}</>
}

