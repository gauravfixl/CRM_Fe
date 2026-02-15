"use client"

import React, { useState, useEffect } from "react"
import {
    HelpCircle,
    Book,
    MessageSquare,
    LifeBuoy,
    Video,
    FileText,
    Search,
    ChevronRight,
    ExternalLink,
    Zap,
    Mail,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function HelpHubPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const resources = [
        { title: 'Getting Started', desc: 'Master the basics of workspace management and task orchestration.', icon: <Zap size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { title: 'Video Tutorials', desc: 'Step-by-step visual guides for advanced workflow configurations.', icon: <Video size={20} />, color: 'text-rose-600', bg: 'bg-rose-50' },
        { title: 'API Documentation', desc: 'Integrate your existing tools with our robust enterprise API.', icon: <FileText size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Community Forum', desc: 'Exchange strategies and solutions with other power users.', icon: <MessageSquare size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' }
    ]

    return (
        <div className="w-full space-y-8 py-6 animate-in fade-in duration-1000 px-4 pb-32">
            {/* dynamic header */}
            <div className="flex flex-col items-center text-center space-y-6 pb-12 border-b border-slate-200">
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <HelpCircle size={18} className="fill-white" />
                        </div>
                        <h4 className="text-[12px] font-bold text-indigo-600">Resource Center</h4>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                        How can we <span className="text-indigo-600">Empower</span> you today?
                    </h1>
                </div>

                <div className="relative w-full max-w-xl bg-white p-1.5 rounded-[24px] border-2 border-slate-100 shadow-xl shadow-indigo-50/50">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        placeholder="Search for documentation, guides, or support tickets..."
                        className="w-full h-11 pl-14 pr-8 bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder:text-slate-400"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button className="h-8 px-5 bg-slate-900 text-white rounded-lg font-bold text-[11px] hover:bg-indigo-600 transition-colors">Search</Button>
                    </div>
                </div>
            </div>

            {/* Quick Link Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resources.map((res, i) => (
                    <Card key={i} className="group border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500 rounded-3xl overflow-hidden bg-white">
                        <CardContent className="p-6 space-y-4">
                            <div className={`h-11 w-11 ${res.bg} ${res.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                {res.icon}
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-none">{res.title}</h4>
                                <p className="text-[12px] font-medium text-slate-500 leading-relaxed">{res.desc}</p>
                            </div>
                            <Button variant="ghost" className="w-full h-8 border border-slate-100 rounded-lg hover:bg-slate-100 font-bold text-[11px] text-slate-600 gap-2">
                                Explore <ExternalLink size={12} />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Support Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
                <div className="bg-indigo-600 rounded-[32px] p-8 text-white space-y-6 relative overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="space-y-3">
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-white">
                            <LifeBuoy size={28} />
                        </div>
                        <h2 className="text-2xl font-bold leading-none">
                            Live Support Interaction
                        </h2>
                        <p className="text-indigo-100 font-medium text-[14px] max-w-sm">
                            Our enterprise support engineers are available 24/7 to assist with critical infrastructure issues.
                        </p>
                    </div>
                    <Button className="h-10 px-8 bg-white text-indigo-600 hover:bg-slate-50 rounded-xl font-bold text-[12px] shadow-lg shadow-indigo-900/20">
                        Start Live Chat
                    </Button>
                </div>

                <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6 relative overflow-hidden">
                    <div className="space-y-3">
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <Mail size={28} className="text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold leading-none">
                            Connect with the Architects
                        </h2>
                        <p className="text-slate-400 font-medium text-[14px] max-w-sm">
                            Have a feature request or specialized feedback? Reach out directly to the product engineering team.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button className="h-10 px-8 bg-slate-800 text-white hover:bg-slate-700 rounded-xl font-bold text-[12px] border border-slate-700">
                            Send Feedback
                        </Button>
                        <Button variant="ghost" className="text-white hover:text-white/80 font-bold text-[12px] group">
                            Contact Sales <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Popular Topics List */}
            <div className="pt-12 space-y-8">
                <div className="flex items-center gap-3 px-1">
                    <Book size={18} className="text-slate-400" />
                    <h3 className="text-[14px] font-bold text-slate-800">Frequently Consulted Knowledge</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        "How to manage workspace permissions?",
                        "Configuring automated sprint transitions",
                        "Setting up MFA and security keys",
                        "Bulk importing issues from CSV/Jira",
                        "Integrating with Slack and Microsoft Teams",
                        "Understanding velocity and burnup metrics"
                    ].map((topic, i) => (
                        <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-100 transition-all cursor-pointer">
                            <span className="text-[13.5px] font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                                {topic}
                            </span>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
