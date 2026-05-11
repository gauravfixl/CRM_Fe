"use client"

/**
 * Live formatter hooks that read from the OrgAdmin settings store.
 * Use these everywhere instead of hard-coding date/number/currency formats —
 * any change in Settings → General Preferences / Localization will propagate
 * across the dashboard automatically.
 */

import { useAdminSettingsStore } from "@/shared/data/admin-settings-store"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const pad = (n: number, w = 2) => String(n).padStart(w, "0")

const toDate = (input: Date | string | number | null | undefined): Date | null => {
    if (input == null) return null
    if (input instanceof Date) return input
    const d = new Date(input)
    return isNaN(d.getTime()) ? null : d
}

/** Format a date using the user's chosen Date Format from General Preferences */
export function useFormatDate() {
    const fmt = useAdminSettingsStore((s) => s.general.dateFormat)
    return (input: Date | string | number | null | undefined): string => {
        const d = toDate(input)
        if (!d) return "—"
        const dd = pad(d.getDate())
        const mm = pad(d.getMonth() + 1)
        const yyyy = d.getFullYear()
        const mmmShort = MONTHS[d.getMonth()]
        switch (fmt) {
            case "DD/MM/YYYY": return `${dd}/${mm}/${yyyy}`
            case "MM/DD/YYYY": return `${mm}/${dd}/${yyyy}`
            case "YYYY-MM-DD": return `${yyyy}-${mm}-${dd}`
            case "DD MMM YYYY": return `${dd} ${mmmShort} ${yyyy}`
            case "MMM DD, YYYY": return `${mmmShort} ${dd}, ${yyyy}`
            case "DD-MM-YYYY": return `${dd}-${mm}-${yyyy}`
            default: return d.toLocaleDateString()
        }
    }
}

/** Format a time using the user's chosen 12/24-hour preference */
export function useFormatTime() {
    const fmt = useAdminSettingsStore((s) => s.general.timeFormat)
    return (input: Date | string | number | null | undefined): string => {
        const d = toDate(input)
        if (!d) return "—"
        if (fmt === "24-hour") {
            return `${pad(d.getHours())}:${pad(d.getMinutes())}`
        }
        const h = d.getHours()
        const period = h >= 12 ? "PM" : "AM"
        const hh = ((h + 11) % 12) + 1
        return `${pad(hh)}:${pad(d.getMinutes())} ${period}`
    }
}

/** Format a date+time stamp combining the date + time format prefs */
export function useFormatDateTime() {
    const formatDate = useFormatDate()
    const formatTime = useFormatTime()
    return (input: Date | string | number | null | undefined): string => {
        const d = toDate(input)
        if (!d) return "—"
        return `${formatDate(d)} · ${formatTime(d)}`
    }
}

/** Format a plain number using the user's Number Format preference */
export function useFormatNumber() {
    const fmt = useAdminSettingsStore((s) => s.general.numberFormat)
    return (n: number | null | undefined, opts?: { decimals?: number }): string => {
        if (n == null || isNaN(Number(n))) return "—"
        const decimals = opts?.decimals ?? (Number.isInteger(Number(n)) ? 0 : 2)
        const value = Number(n)
        if (fmt.startsWith("1,234,567.89")) return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        if (fmt.startsWith("1.234.567,89")) return value.toLocaleString("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        if (fmt.startsWith("1,23,456.78")) return value.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        return value.toFixed(decimals)
    }
}

/** Format a money amount with the org's default currency from Localization */
export function useFormatCurrency() {
    const currency = useAdminSettingsStore((s) => s.localization.defaultCurrency)
    const numberFmt = useAdminSettingsStore((s) => s.general.numberFormat)
    return (n: number | null | undefined, opts?: { decimals?: number; currencyOverride?: string }): string => {
        if (n == null || isNaN(Number(n))) return "—"
        const code = opts?.currencyOverride ?? currency
        const decimals = opts?.decimals ?? 2
        // Pick a sensible locale based on number-format preference
        let locale = "en-IN"
        if (numberFmt.startsWith("1,234,567.89")) locale = "en-US"
        else if (numberFmt.startsWith("1.234.567,89")) locale = "de-DE"
        try {
            return new Intl.NumberFormat(locale, {
                style: "currency",
                currency: code,
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            }).format(Number(n))
        } catch {
            return `${code} ${Number(n).toFixed(decimals)}`
        }
    }
}

/** Returns the user's selected timezone (e.g. for new Date().toLocaleString({timeZone})) */
export function useTimezone() {
    return useAdminSettingsStore((s) => s.general.timezone)
}

/** Combined helper that returns all formatters in one call (for places that need many) */
export function useAdminFormatters() {
    const formatDate = useFormatDate()
    const formatTime = useFormatTime()
    const formatDateTime = useFormatDateTime()
    const formatNumber = useFormatNumber()
    const formatCurrency = useFormatCurrency()
    const timezone = useTimezone()
    return { formatDate, formatTime, formatDateTime, formatNumber, formatCurrency, timezone }
}
