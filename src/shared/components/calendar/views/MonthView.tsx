"use client"

import React from "react"
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
    isSameDay,
    isToday
} from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MonthViewProps {
    currentDate: Date
}

// Dummy data for visual scaffolding
const DUMMY_EVENTS = [
    { id: 1, title: 'Team Sync', date: new Date(), type: 'meeting', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 2, title: 'Project Due', date: new Date(new Date().setDate(new Date().getDate() + 2)), type: 'deadline', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 3, title: 'Client Call', date: new Date(new Date().setDate(new Date().getDate() - 2)), type: 'call', color: 'bg-green-100 text-green-700 border-green-200' },
]

export function MonthView({ currentDate }: MonthViewProps) {
    // 1. Generate the grid days
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }) // Sunday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    // 2. Weekday headers
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <div className="flex flex-col h-full w-full">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-border">
                {weekDays.map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-5 h-full">
                {calendarDays.map((day, dayIdx) => {
                    const isCurrentMonth = isSameMonth(day, monthStart)
                    const isTodayDate = isToday(day)

                    // Filter events for this day
                    const dayEvents = DUMMY_EVENTS.filter(evt => isSameDay(evt.date, day))

                    return (
                        <div
                            key={day.toString()}
                            className={`
                min-h-[100px] border-b border-r border-border p-2 relative group flex flex-col gap-1 transition-colors
                ${!isCurrentMonth ? 'bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-400' : 'bg-white dark:bg-zinc-950'}
                hover:bg-zinc-50 dark:hover:bg-zinc-900
              `}
                        >
                            <div className="flex items-center justify-between">
                                <span className={`
                  text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full
                  ${isTodayDate ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-700 dark:text-zinc-300'}
                `}>
                                    {format(day, 'd')}
                                </span>
                            </div>

                            {/* Event Stack */}
                            <div className="flex flex-col gap-1 mt-1">
                                {dayEvents.map(event => (
                                    <div
                                        key={event.id}
                                        className={`
                      text-[10px] px-2 py-1 rounded border truncate font-medium cursor-pointer
                      ${event.color}
                    `}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
