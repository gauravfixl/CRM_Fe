"use client"

import React, { useEffect, useRef } from "react"
import {
    format,
    isToday,
    setHours
} from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DayViewProps {
    currentDate: Date
}

export function DayView({ currentDate }: DayViewProps) {
    const hours = Array.from({ length: 24 }).map((_, i) => i)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            const rowHeight = 80 // px per hour (taller for day view)
            scrollRef.current.scrollTop = 8 * rowHeight
        }
    }, [])

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Day Header */}
            <div className="flex items-center justify-between border-b border-border p-4 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {format(currentDate, 'EEEE')}
                    </h2>
                    <span className="text-zinc-500">
                        {format(currentDate, 'MMMM d, yyyy')}
                    </span>
                </div>

                {/* Day Stats or Summary could go here */}
                <div className="text-sm text-zinc-500">
                    3 Events scheduled
                </div>
            </div>

            <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="flex relative min-h-[1920px]"> {/* 24h * 80px */}

                    {/* Time Labels */}
                    <div className="w-20 flex-shrink-0 flex flex-col bg-white dark:bg-zinc-950 border-r border-border">
                        {hours.map((hour) => (
                            <div key={hour} className="h-[80px] text-sm text-zinc-400 text-right pr-4 pt-2 relative border-b border-dashed border-zinc-100 dark:border-zinc-800">
                                {format(setHours(new Date(), hour), 'h a')}
                            </div>
                        ))}
                    </div>

                    {/* Day Grid */}
                    <div className="flex-1 relative bg-white dark:bg-zinc-950">
                        {/* Hour Guidelines */}
                        {hours.map((hour) => (
                            <div key={hour} className="h-[80px] border-b border-zinc-100 dark:border-zinc-800 w-full" />
                        ))}

                        {/* Dynamic Current Time Line */}
                        {isToday(currentDate) && (
                            <div
                                className="absolute w-full h-0.5 bg-red-500 z-20 pointer-events-none flex items-center"
                                style={{ top: `${(new Date().getHours() * 80) + (new Date().getMinutes() * (80 / 60))}px` }}
                            >
                                <div className="h-2 w-2 rounded-full bg-red-500 -ml-1"></div>
                                <span className="ml-2 text-xs font-bold text-red-500 bg-white dark:bg-zinc-950 px-1 rounded">
                                    {format(new Date(), 'h:mm a')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
