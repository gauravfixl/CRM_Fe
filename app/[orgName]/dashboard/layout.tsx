"use client"

import { ReactNode } from "react"
import { AppLayout } from "@/components/app-layout"

type DashboardLayoutProps = {
  children: ReactNode
  leftPanel?: ReactNode
  rightPanel?: ReactNode
}

export default function DashboardLayout({
  children,
  leftPanel,
  rightPanel,
}: DashboardLayoutProps) {
  return (
    <AppLayout >
      {children}
    </AppLayout>
  )
}
