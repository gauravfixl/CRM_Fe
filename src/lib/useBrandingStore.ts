// Branding store for managing organization-specific theme and logos
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface BrandingState {
    primaryColor: string
    borderRadius: string // In rem, e.g., '0.75'
    logoUrl: string
    loginLogoUrl: string
    themeMode: ThemeMode
    orgName: string
    // Actions
    setBranding: (updates: Partial<Omit<BrandingState, 'setBranding' | 'resetBranding'>>) => void
    resetBranding: () => void
}

export const useBrandingStore = create<BrandingState>()(
    persist(
        (set) => ({
            primaryColor: '#2563eb', // Default Blue
            borderRadius: '0.75',
            themeMode: 'light',
            logoUrl: '/images/cubicleweb.png',
            loginLogoUrl: '/images/cubicleweb.png',
            orgName: 'Cubicle CRM',
            setBranding: (updates) => set((state) => ({ ...state, ...updates })),
            resetBranding: () => set({
                primaryColor: '#2563eb',
                borderRadius: '0.75',
                themeMode: 'light',
                logoUrl: '/images/cubicleweb.png',
                loginLogoUrl: '/images/cubicleweb.png',
                orgName: 'Cubicle CRM',
            }),
        }),
        {
            name: 'org-branding-storage',
        }
    )
)

