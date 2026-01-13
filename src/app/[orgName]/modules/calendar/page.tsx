"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { CalendarHeader } from "@/shared/components/calendar/CalendarHeader"
import { MonthView } from "@/shared/components/calendar/views/MonthView"
import { WeekView } from "@/shared/components/calendar/views/WeekView"
import { DayView } from "@/shared/components/calendar/views/DayView"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
// import { AddEventDialog } from "@/shared/components/calendar/AddEventDialog" 
// Will implement dialog next

export default function GlobalCalendarPage() {
    const [view, setView] = useState<"month" | "week" | "day">("month")
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)

    // Determine header title based on view
    const headerTitle = React.useMemo(() => {
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            year: 'numeric'
        }
        return currentDate.toLocaleDateString('en-US', options)
    }, [currentDate])

    return (
        <div className="flex h-screen w-full flex-col bg-zinc-50/50 dark:bg-zinc-900/50 overflow-hidden">
            {/* Header Toolbar */}
            <header className="flex h-16 items-center justify-between border-b px-6 bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-4">
                    <CalendarHeader
                        title={headerTitle}
                        view={view}
                        setView={setView}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => setIsEventDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Plus className="h-4 w-4" />
                        New Event
                    </Button>
                </div>
            </header>

            {/* Main Calendar Grid */}
            <main className="flex-1 overflow-hidden p-6">
                <Card className="h-full w-full border-none shadow-sm flex flex-col overflow-hidden bg-white dark:bg-zinc-950">
                    {view === "month" && <MonthView currentDate={currentDate} />}
                    {view === "week" && <WeekView currentDate={currentDate} />}
                    {view === "day" && <DayView currentDate={currentDate} />}
                </Card>
            </main>

            {/* Dialog Placeholder - will be added in next step */}
            {/* <AddEventDialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen} /> */}
        </div>
    )
}
