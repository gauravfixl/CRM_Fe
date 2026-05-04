"use client"

import { usePathname, useRouter } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useTokenRefresher } from '@/hooks/userHooks'
import LoaderWrapper from './custom/LoaderWrapper'
import React, { useState, ReactNode, useEffect } from 'react'
import { SupportAccessProvider } from '@/contexts/AuthContext'
import { useModule } from '@/app/context/ModuleContext'
import { useLoaderStore } from '@/lib/loaderStore'
import { ProtectedRoute } from './custom/ProtectedRoute'
import { usePermissionLoader } from '@/shared/hooks/use-permission-loader'
import { usePermissionBootstrap } from '@/shared/hooks/use-permission-bootstrap'
import { useAuthStore } from '@/lib/useAuthStore'
import { BrandingProvider } from './BrandingProvider'

/**
 * Routes that don't require authentication layout
 */
const AUTH_ROUTES = [
  '/auth/signin',
  '/auth/signup',
  '/auth/create-org',
  '/auth/forgot-pwd',
  '/accept-invite'
] as const

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  '/products/enterprise',
  '/products/startups',
  '/products/agencies',
  '/products/healthcare',
  '/products/education',
  '/products/real-estate',
  '/products/retail',
  '/products/manufacturing',
  '/products/legal',
  '/products/non-profit',
  '/products/logistics',
  '/products/it-saas',
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
  const router = useRouter()
  const { leftPanel: contextLeftPanel, rightPanel: contextRightPanel } = useModule()
  const { showLoader, hideLoader } = useLoaderStore()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [hydrated, setHydrated] = useState(false)

  const isAuthRoute = AUTH_ROUTES.includes(pathname as typeof AUTH_ROUTES[number])
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname as typeof PUBLIC_ROUTES[number])

  // Wait for Zustand to hydrate from localStorage before checking auth
  useEffect(() => {
    // Zustand persist rehydrates synchronously on first render in the browser,
    // but the initial SSR/hydration pass uses the default (false) values.
    // We wait one tick to let persist middleware restore the real state.
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })
    // If already hydrated (e.g. hot reload), set immediately
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
    }
    return () => { unsub() }
  }, [])

  // Redirect unauthenticated users to signin (only after hydration completes)
  // Also handle cookie/store desync: if Zustand says authenticated but cookie is missing,
  // clear the stale state and redirect to signin.
  useEffect(() => {
    if (!hydrated) return
    if (isAuthRoute || isPublicRoute) return

    if (!isAuthenticated) {
      router.replace('/auth/signin')
      return
    }

    // Check if orgToken cookie exists - if not, Zustand state is stale
    const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('orgToken='))
    if (!hasCookie) {
      useAuthStore.getState().logout()
      router.replace('/auth/signin')
    }
  }, [hydrated, isAuthenticated, isAuthRoute, isPublicRoute, pathname, router])

  // Auto-fetch user permissions from backend on app load.
  // 1) usePermissionBootstrap → preferred path: hits /me/permissions (effective
  //    permissions = role.permissions ∪ permissionsOverride). Becomes the source
  //    of truth once the backend exposes that endpoint.
  // 2) usePermissionLoader → legacy fallback: derives permissions by matching
  //    the user's role against /role-permission/all. Kept until /me/permissions ships.
  usePermissionBootstrap()
  usePermissionLoader()

  const leftPanel = propLeftPanel || contextLeftPanel
  const rightPanel = propRightPanel || contextRightPanel

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )sidebar:state=([^;]+)'));
      return match ? match[2] === 'true' : true;
    }
    return true;
  })

  useTokenRefresher(!isAuthRoute)

  // Reset scroll on navigation & trigger loader
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    showLoader()
    const timer = setTimeout(() => {
      hideLoader()
    }, 150)

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
    return () => clearTimeout(timer)
  }, [pathname, showLoader, hideLoader])

  if (isAuthRoute) {
    return <>{children}</>
  }

  // Allow public routes without authentication
  if (isPublicRoute) {
    return <>{children}</>
  }

  // Show nothing while hydrating or redirecting unauthenticated users
  if (!hydrated || !isAuthenticated) {
    return null
  }

  return (
    <BrandingProvider>
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SupportAccessProvider>
          <div className="flex flex-col w-full h-[100dvh] overflow-hidden bg-background">
            <AppHeader setSidebarOpen={setSidebarOpen} />

            <div className="flex flex-1 pt-[63px] overflow-hidden">
              <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

              {leftPanel && (
                <aside className="hidden lg:block w-72 p-4 border-r border-border overflow-y-auto h-full bg-white dark:bg-zinc-950 flex-shrink-0">
                  {leftPanel}
                </aside>
              )}

              <SidebarInset className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-transparent relative isolate">
                <LoaderWrapper />
                <div ref={scrollContainerRef} className={`flex-1 flex flex-col gap-2 sm:gap-4 h-full relative z-0 isolate ${pathname?.endsWith('/dashboard') ? 'overflow-hidden p-0' : 'overflow-auto p-2 sm:p-4'}`}>
                  <div className="min-w-0 w-full flex-1 flex flex-col">
                    <ProtectedRoute>
                      {children}
                    </ProtectedRoute>
                  </div>
                </div>
              </SidebarInset>

              {rightPanel && (
                <aside className="hidden xl:block w-72 p-4 border-l border-border overflow-y-auto max-h-screen bg-white dark:bg-zinc-950 flex-shrink-0">
                  {rightPanel}
                </aside>
              )}
            </div>
          </div>
        </SupportAccessProvider>
      </SidebarProvider>
    </BrandingProvider>
  )
}
