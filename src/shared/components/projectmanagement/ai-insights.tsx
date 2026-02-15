"use client"

import React, { useEffect } from "react"
import { Sparkles, Brain, ArrowRight, Zap, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAIStore } from "@/shared/data/ai-store"
import { Skeleton } from "@/components/ui/skeleton"

interface AIInsightsProps {
    projectId: string
}

export function AIInsights({ projectId }: AIInsightsProps) {
    const { recommendations, isAnalyzing, getRecommendationsForProject } = useAIStore()

    useEffect(() => {
        getRecommendationsForProject(projectId)
    }, [projectId, getRecommendationsForProject])

    if (isAnalyzing) {
        return (
            <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-xl shadow-indigo-100/20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 animate-pulse">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <Skeleton className="h-6 w-[200px]" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-[120px] w-full rounded-2xl" />
                    <Skeleton className="h-[120px] w-full rounded-2xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-200 rounded-[24px] p-4 shadow-xl shadow-indigo-100/10 border-t-indigo-500 border-t-[3px] transition-all hover:shadow-indigo-200/20">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-100">
                        <Brain className="h-3.5 w-3.5" />
                    </div>
                    <div>
                        <h2 className="text-[13px] font-bold text-slate-800 tracking-tight">System Intelligence</h2>
                        <p className="text-[9px] text-slate-400 font-medium leading-none">Predictive insights.</p>
                    </div>
                </div>
                <Badge className="bg-indigo-50 text-indigo-600 border-none text-[8px] font-bold px-1.5 h-3.5 animate-pulse">
                    ACTIVE
                </Badge>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {recommendations.map((rec) => (
                    <div key={rec.id} className="group relative bg-slate-50/50 border border-slate-100 rounded-2xl p-3 transition-all hover:bg-white hover:shadow-md hover:border-indigo-100 overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 p-3 opacity-5 bg-indigo-600 rounded-bl-[32px] group-hover:opacity-10 transition-opacity">
                            <Zap className="h-8 w-8 text-white" />
                        </div>

                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`p-3 rounded-xl shrink-0 shadow-sm ${rec.type === 'PLANNING' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                                }`}>
                                {rec.type === 'PLANNING' ? <Zap className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="font-bold text-slate-800 tracking-tight text-[12px]">{rec.title}</h4>
                                    <span className="text-[7.5px] font-bold text-slate-500 bg-white border border-slate-200 px-1 rounded-full uppercase">
                                        {(rec.confidence * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <p className="text-[10.5px] text-slate-400 font-medium leading-tight mb-2 line-clamp-1">
                                    {rec.description}
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button size="sm" className="h-7 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-[10px] gap-2 rounded-lg px-4 shadow-sm transition-all group/btn border-none">
                                        Take Action
                                        <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-slate-400 hover:text-slate-600">
                                        Dismiss
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-[8.5px] font-bold text-slate-300 uppercase tracking-widest">Core v4.2 Secured</span>
                </div>
                <Button variant="ghost" className="h-6 text-[9px] font-bold text-indigo-600 gap-1 hover:bg-indigo-50 px-2 rounded-lg">
                    Full Trace
                    <ArrowRight size={10} />
                </Button>
            </div>
        </div>
    )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    )
}
