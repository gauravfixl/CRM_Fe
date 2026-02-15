"use client"

import { usePathname } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useTokenRefresher } from '@/hooks/userHooks'
import LoaderWrapper from './custom/LoaderWrapper'
import React, { useState, ReactNode } from 'react'
import { SupportAccessProvider } from '@/contexts/AuthContext'
import { useModule } from '@/app/context/ModuleContext'

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
export function AppLayout({ children, leftPanel: propLeftPanel, rightPanel: propRightPanel }: AppLayoutProps) {
  const pathname = usePathname()
  const { leftPanel: contextLeftPanel, rightPanel: contextRightPanel } = useModule()

  const leftPanel = propLeftPanel || contextLeftPanel
  const rightPanel = propRightPanel || contextRightPanel

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )sidebar:state=([^;]+)'));
      return match ? match[2] === 'true' : true;
    }
    return true;
  })

  const isAuthRoute = AUTH_ROUTES.includes(pathname as typeof AUTH_ROUTES[number])

  useTokenRefresher(!isAuthRoute)

  // Reset scroll on navigation
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [pathname])

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <>
      <AppHeader setSidebarOpen={setSidebarOpen} />
      <SupportAccessProvider>
        <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <div className="flex w-full h-screen overflow-hidden pt-[63px]">
            <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            {leftPanel && (
              <aside className="hidden lg:block w-72 p-4 border-r border-border overflow-y-auto h-full bg-white dark:bg-zinc-950 flex-shrink-0">
                {leftPanel}
              </aside>
            )}

            <SidebarInset className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
              <LoaderWrapper />

              <div ref={scrollContainerRef} className={`flex-1 flex flex-col gap-4 h-full ${pathname?.endsWith('/dashboard') ? 'overflow-hidden p-0' : 'overflow-auto p-4'}`}>
                <div className="min-w-0 w-full flex-1 flex flex-col">
                  {children}
                </div>
              </div>
            </SidebarInset>

            {rightPanel && (
              <aside className="hidden xl:block w-72 p-4 border-l border-border overflow-y-auto max-h-screen bg-white dark:bg-zinc-950 flex-shrink-0">
                {rightPanel}
              </aside>
            )}
          </div>
        </SidebarProvider>
      </SupportAccessProvider>
    </>
  )
}
