"use client"

import React, { useEffect } from 'react'
import { useBrandingStore } from '../../lib/useBrandingStore'
import { useTheme } from 'next-themes'

interface HSL {
    h: number
    s: number
    l: number
}

export const BrandingProvider = ({ children }: { children: React.ReactNode }) => {
    const { primaryColor, borderRadius, themeMode } = useBrandingStore()
    const { setTheme } = useTheme()

    useEffect(() => {
        // Apply Theme Mode
        setTheme(themeMode)

        const root = document.documentElement

        // Generate HSL from hex
        const hexToHsl = (hex: string): HSL => {
            let r = 0, g = 0, b = 0
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16)
                g = parseInt(hex[2] + hex[2], 16)
                b = parseInt(hex[3] + hex[3], 16)
            } else if (hex.length === 7) {
                r = parseInt(hex.substring(1, 3), 16)
                g = parseInt(hex.substring(3, 5), 16)
                b = parseInt(hex.substring(5, 7), 16)
            }
            r /= 255; g /= 255; b /= 255
            const max = Math.max(r, g, b), min = Math.min(r, g, b)
            let h = 0, s = 0, l = (max + min) / 2
            if (max !== min) {
                const d = max - min
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break
                    case g: h = (b - r) / d + 2; break
                    case b: h = (r - g) / d + 4; break
                }
                h /= 6
            }
            return {
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            }
        }

        const hsl = hexToHsl(primaryColor)
        const formatHsl = (l: number) => `${hsl.h} ${hsl.s}% ${l}%`

        // Set Shadcn/Tailwind standard variable
        root.style.setProperty('--primary', formatHsl(hsl.l))
        root.style.setProperty('--ring', formatHsl(hsl.l))

        // Set shades and override blue/indigo as well for global consistency
        // This ensures components using blue-600 or indigo-600 also follow the brand theme
        const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
        const lightessMap: Record<number, number> = {
            50: 97, 100: 92, 200: 85, 300: 75, 400: 65, 500: 55, 600: 45, 700: 35, 800: 25, 900: 15, 950: 10
        }

        shades.forEach(shade => {
            const val = formatHsl(lightessMap[shade])
            root.style.setProperty(`--primary-${shade}`, val)
            // Override legacy utility colors to match the brand
            root.style.setProperty(`--blue-${shade}`, val)
            root.style.setProperty(`--indigo-${shade}`, val)
        })

        // Apply Border Radius
        // Map the single radius variable to multiple Tailwind-level radius increments
        const r = parseFloat(borderRadius)
        root.style.setProperty('--radius', `${r}rem`)
        root.style.setProperty('--radius-sm', `${Math.max(0, r - 0.25)}rem`)
        root.style.setProperty('--radius-md', `${Math.max(0, r - 0.125)}rem`)
        root.style.setProperty('--radius-lg', `${r}rem`)
        root.style.setProperty('--radius-xl', `${r + 0.25}rem`)
        root.style.setProperty('--radius-2xl', `${r + 0.5}rem`)
        root.style.setProperty('--radius-3xl', `${r + 1.25}rem`)

    }, [primaryColor, borderRadius, themeMode, setTheme])

    return <>{children}</>
}
