"use client"

import React, { useEffect, useRef } from "react"
import {
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isToday,
    addMinutes,
    setHours,
    setMinutes,
    isSameDay
} from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WeekViewProps {
    currentDate: Date
}

export function WeekView({ currentDate }: WeekViewProps) {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 })
    const end = endOfWeek(currentDate, { weekStartsOn: 0 })
    const weekDays = eachDayOfInterval({ start, end })

    // 24 hours converted to array of hours
    const hours = Array.from({ length: 24 }).map((_, i) => i)

    const scrollRef = useRef<HTMLDivElement>(null)

    // Scroll to 8 AM on mount
    useEffect(() => {
        if (scrollRef.current) {
            const rowHeight = 60 // px per hour
            scrollRef.current.scrollTop = 8 * rowHeight
        }
    }, [])

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Week Header */}
            <div className="flex border-b border-border pl-16">
                {weekDays.map((day) => {
                    const isTodayDate = isToday(day)
                    return (
                        <div key={day.toString()} className="flex-1 py-3 text-center border-l first:border-l-0 border-border">
                            <div className={`text-xs font-semibold uppercase ${isTodayDate ? 'text-blue-600' : 'text-zinc-500'}`}>
                                {format(day, 'EEE')}
                            </div>
                            <div className={`
                mx-auto mt-1 h-8 w-8 flex items-center justify-center rounded-full text-lg font-medium
                ${isTodayDate ? 'bg-blue-600 text-white' : 'text-zinc-700 dark:text-zinc-300'}
              `}>
                                {format(day, 'd')}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Scrollable Time Grid */}
            <ScrollArea className="flex-1" ref={scrollRef}>
                <div className="flex relative min-h-[1440px]"> {/* 24h * 60px height */}

                    {/* Time Labels Column */}
                    <div className="w-16 flex-shrink-0 flex flex-col bg-zinc-50 dark:bg-zinc-900 border-r border-border">
                        {hours.map((hour) => (
                            <div key={hour} className="h-[60px] text-xs text-zinc-400 text-right pr-3 -mt-2.5 relative">
                                {format(setHours(new Date(), hour), 'h a')}
                            </div>
                        ))}
                    </div>

                    {/* Grid Columns */}
                    <div className="flex flex-1 relative">
                        {/* Horizontal Hour Lines (Background) */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            {hours.map((hour) => (
                                <div key={hour} className="h-[60px] border-b border-zinc-100 dark:border-zinc-800 w-full" />
                            ))}
                        </div>

                        {/* Day Columns */}
                        {weekDays.map((day, i) => (
                            <div key={day.toString()} className="flex-1 border-l first:border-l-0 border-zinc-100 dark:border-zinc-800 relative z-10 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                                {/* Events would be positioned absolutely here based on start time & duration */}
                                {/* Placeholder for "Now" indicator if today */}
                                {isToday(day) && (
                                    <div
                                        className="absolute w-full h-0.5 bg-red-500 z-20 pointer-events-none flex items-center"
                                        style={{ top: `${(new Date().getHours() * 60) + new Date().getMinutes()}px` }}
                                    >
                                        <div className="h-2 w-2 rounded-full bg-red-500 -ml-1"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
