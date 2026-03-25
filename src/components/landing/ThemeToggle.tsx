"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/lib/theme-store"
import { useBrandingStore } from "@/lib/useBrandingStore"

export function ThemeToggle() {
    const { setTheme, theme, resolvedTheme } = useTheme()
    const { setDarkMode } = useThemeStore()
    const { themeMode, setBranding } = useBrandingStore()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
        console.log("Current Theme:", theme)
        console.log("Resolved Theme:", resolvedTheme)
    }, [theme, resolvedTheme])

    if (!mounted) {
        return <div className="w-9 h-9" /> // Placeholder to avoid layout shift
    }

    const isDark = resolvedTheme === "dark" || theme === "dark" || themeMode === "dark"

    const toggleTheme = () => {
        const nextTheme = isDark ? "light" : "dark"
        console.log("Senior Full Stack Fix: Toggling Theme to", nextTheme)

        // 1. Sync with next-themes (Visual Layer)
        setTheme(nextTheme)

        // 2. Sync with custom branding store (Enforced Layer)
        if (setBranding) {
            setBranding({ themeMode: nextTheme })
        }

        // 3. Sync with custom theme store (Platform Layer)
        if (setDarkMode) {
            setDarkMode(nextTheme)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200"
        >
            <div className="relative w-full h-full flex items-center justify-center">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
