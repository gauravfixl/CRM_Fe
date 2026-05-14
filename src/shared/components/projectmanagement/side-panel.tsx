"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SidePanelProps {
    open: boolean
    onClose: () => void
    title: string
    description?: string
    children: React.ReactNode
    footer?: React.ReactNode
    width?: "sm" | "md" | "lg" | "xl"
    closeOnOverlayClick?: boolean
}

const widthMap: Record<NonNullable<SidePanelProps["width"]>, string> = {
    sm: "w-full sm:max-w-sm",
    md: "w-full sm:max-w-md",
    lg: "w-full sm:max-w-lg",
    xl: "w-full sm:max-w-xl",
}

/**
 * Reusable right-side slide-in form panel for Project Management.
 * - Slides in from the right with framer-motion.
 * - Locks body scroll while open.
 * - Closes on overlay click (configurable) and Escape key.
 * - No rounded corners — matches PM design rules.
 */
export default function SidePanel({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    width = "md",
    closeOnOverlayClick = true,
}: SidePanelProps) {
    React.useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        document.addEventListener("keydown", onKey)
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.removeEventListener("keydown", onKey)
            document.body.style.overflow = prevOverflow
        }
    }, [open, onClose])

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="sidepanel-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[1px]"
                        onClick={() => {
                            if (closeOnOverlayClick) onClose()
                        }}
                    />
                    <motion.aside
                        key="sidepanel-content"
                        role="dialog"
                        aria-modal="true"
                        aria-label={title}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                        className={cn(
                            "fixed inset-y-0 right-0 z-[101] flex h-full flex-col bg-white shadow-2xl border-l border-slate-200",
                            widthMap[width]
                        )}
                    >
                        <header className="flex items-start justify-between px-6 py-4 border-b border-slate-200 shrink-0">
                            <div className="flex flex-col">
                                <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>
                                {description && (
                                    <p className="text-[11px] font-medium text-slate-500 mt-1 leading-snug">
                                        {description}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                aria-label="Close panel"
                            >
                                <X size={16} />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
                            {children}
                        </div>

                        {footer && (
                            <footer className="px-6 py-4 border-t border-slate-200 bg-slate-50/60 shrink-0">
                                {footer}
                            </footer>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}
