"use client"

import React from "react"
import { Terminal } from "lucide-react"

export default function CodePage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Terminal className="h-8 w-8 text-slate-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Code Repositories</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto">Connect your GitHub or GitLab repositories to link commits directly to issues.</p>
            </div>
        </div>
    )
}
