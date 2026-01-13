"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, List } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns"

interface CalendarHeaderProps {
    title: string
    view: "month" | "week" | "day"
    setView: (view: "month" | "week" | "day") => void
    currentDate: Date
    setCurrentDate: (date: Date) => void
}

export function CalendarHeader({
    title,
    view,
    setView,
    currentDate,
    setCurrentDate,
}: CalendarHeaderProps) {

    const handlePrevious = () => {
        if (view === "month") setCurrentDate(subMonths(currentDate, 1))
        if (view === "week") setCurrentDate(subWeeks(currentDate, 1))
        if (view === "day") setCurrentDate(subDays(currentDate, 1))
    }

    const handleNext = () => {
        if (view === "month") setCurrentDate(addMonths(currentDate, 1))
        if (view === "week") setCurrentDate(addWeeks(currentDate, 1))
        if (view === "day") setCurrentDate(addDays(currentDate, 1))
    }

    const handleToday = () => {
        setCurrentDate(new Date())
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center rounded-md border bg-white dark:bg-zinc-950 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevious}
                    className="h-9 w-9 border-r rounded-r-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center px-4 min-w-[140px] font-semibold text-sm">
                    {title}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNext}
                    className="h-9 w-9 border-l rounded-l-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <Button variant="outline" size="sm" onClick={handleToday}>
                Today
            </Button>

            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                <button
                    onClick={() => setView("month")}
                    className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${view === "month"
                            ? "bg-white dark:bg-zinc-700 shadow-sm text-foreground"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                >
                    Month
                </button>
                <button
                    onClick={() => setView("week")}
                    className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${view === "week"
                            ? "bg-white dark:bg-zinc-700 shadow-sm text-foreground"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                >
                    Week
                </button>
                <button
                    onClick={() => setView("day")}
                    className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${view === "day"
                            ? "bg-white dark:bg-zinc-700 shadow-sm text-foreground"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }`}
                >
                    Day
                </button>
            </div>
        </div>
    )
}
