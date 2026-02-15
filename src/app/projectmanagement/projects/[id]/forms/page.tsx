"use client"

import React from "react"
import { FileText } from "lucide-react"

export default function FormsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Forms Builder</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto">Create public forms to collect work requests and bugs from external stakeholders.</p>
            </div>
        </div>
    )
}
