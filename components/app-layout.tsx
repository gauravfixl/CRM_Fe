"use client"

import { usePathname } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useTokenRefresher } from '@/hooks/userHooks'
import LoaderWrapper from './custom/LoaderWrapper'
import { useState, ReactNode } from 'react'
import { SupportAccessProvider } from '@/contexts/AuthContext'

/**
 * Routes that don't require authentication layout
 */
const AUTH_ROUTES = [
  '/auth/signin',
  '/auth/signup',
  '/auth/create-org',
  '/auth/forgot-pwd',
  '/acceptInvite'
] as const

type AppLayoutProps = {
  children: ReactNode
  leftPanel?: ReactNode
  rightPanel?: ReactNode
}

/**
 * Main application layout component
 * Handles authentication routing, sidebar state, and panel rendering
 * 
 * Refactor Summary:
 * - Cleaned up commented code
 * - Added proper TypeScript types and constants
 * - Improved component organization and readability
 * - Preserved all existing functionality and UI behavior
 */
export function AppLayout({ children, leftPanel, rightPanel }: AppLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const isAuthRoute = AUTH_ROUTES.includes(pathname as typeof AUTH_ROUTES[number])

  useTokenRefresher(!isAuthRoute)

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <>
      <AppHeader setSidebarOpen={setSidebarOpen} />
      <SupportAccessProvider>
        <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <div className="flex w-[100vw]">
            <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            {leftPanel && (
              <div className="w-80 p-4 border-r border-white overflow-y-auto max-h-screen">
                {leftPanel}
              </div>
            )}

            <SidebarInset className="flex-1 transition-all duration-300 flex flex-col">
              <LoaderWrapper />
              
              <div className="flex-1 p-4 flex flex-col gap-4">
                {children}
              </div>
            </SidebarInset>

            {rightPanel && (
              <div className="w-80 p-4 border-l border-white overflow-y-auto max-h-screen">
                {rightPanel}
              </div>
            )}
          </div>
        </SidebarProvider>
      </SupportAccessProvider>
    </>
  )
}
