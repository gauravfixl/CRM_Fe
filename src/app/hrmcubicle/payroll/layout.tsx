"use client"

import React from "react"

export default function PayrollLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#f8fafc]">
            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative flex flex-col">
                {children}
            </main>
        </div>
    )
}
