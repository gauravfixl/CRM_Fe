"use client"

import React from "react"

import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FormsPage() {
    const forms = [
        { id: "f1", title: "Bug Report Intake", responses: 342, updated: "2 days ago", status: "Active" },
        { id: "f2", title: "Feature Request", responses: 12, updated: "1 week ago", status: "Active" },
        { id: "f3", title: "Client Feedback Survey", responses: 89, updated: "3 weeks ago", status: "Draft" },
    ]

    return (
        <div className="flex flex-col h-full gap-6 max-w-7xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Forms Builder</h1>
                        <p className="text-[13px] text-slate-500 font-medium italic">Create and manage public intake forms.</p>
                    </div>
                </div>
                <Button onClick={() => alert("Form builder launching...")} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                    <React.Fragment>
                        <span className="text-lg leading-none">+</span> New Form
                    </React.Fragment>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forms.map(form => (
                    <div key={form.id} className="group border border-slate-200 rounded-xl p-5 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                <FileText size={20} />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${form.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                {form.status.toUpperCase()}
                            </span>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">{form.title}</h3>
                        <p className="text-[12px] text-slate-500 font-medium mb-4">External link enabled</p>

                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 border-t border-slate-100 pt-3">
                            <span>{form.responses} Responses</span>
                            <span>Updated {form.updated}</span>
                        </div>
                    </div>
                ))}

                <div
                    onClick={() => alert("Create new form wizard")}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-600 cursor-pointer transition-colors bg-slate-50/50"
                >
                    <span className="text-3xl mb-2 font-light">+</span>
                    <span className="font-bold text-sm">Create Blank Form</span>
                </div>
            </div>
        </div>
    )
}
