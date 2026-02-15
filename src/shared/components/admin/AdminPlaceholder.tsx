"use client"

import React from "react"
import { LucideIcon, Info, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AdminPlaceholderProps {
    title: string
    description: string
    icon: LucideIcon
    type?: "settings" | "governance" | "security" | "monitoring" | "data" | "billing"
}

export function AdminPlaceholder({ title, description, icon: Icon, type = "settings" }: AdminPlaceholderProps) {
    const getBadgeColor = () => {
        switch (type) {
            case "security": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            case "governance": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            case "monitoring": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            case "data": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            case "billing": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
            default: return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
        }
    }

    return (
        <div className="flex flex-col gap-6 p-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${getBadgeColor()} border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>
                        {type}
                    </Badge>
                    <Badge variant="outline" className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        Enterprise Feature
                    </Badge>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-dashed border-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <CardHeader>
                        <div className="h-12 w-12 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border flex items-center justify-center mb-4">
                            <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">Module Setup</CardTitle>
                        <CardDescription>Configure the core parameters for this administrative module.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full group">
                            Start Configuration <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100 dark:border-blue-900/20">
                    <CardHeader>
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600">
                            <Info className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg text-blue-900 dark:text-blue-100">About this module</CardTitle>
                        <CardDescription className="text-blue-700/70 dark:text-blue-300/50">
                            This module provides enterprise-grade control over {title.toLowerCase()} tailored for multi-tenant SaaS environments.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400">
                                <div className="h-1 w-1 rounded-full bg-blue-400" />
                                Metadata-driven configuration
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400">
                                <div className="h-1 w-1 rounded-full bg-blue-400" />
                                Role-based access control (RBAC)
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400">
                                <div className="h-1 w-1 rounded-full bg-blue-400" />
                                Audit logging & governance
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Icon className="h-24 w-24" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg">Need Assistance?</CardTitle>
                        <CardDescription className="text-zinc-400 dark:text-zinc-500">Read our documentation or contact support for help with {title}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="w-full">
                            View Documentation
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-zinc-50/30 dark:bg-black/5">
                <div className="h-16 w-16 mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Workspace Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    We are currently implementing the advanced features for <span className="font-bold text-zinc-900 dark:text-zinc-100">{title}</span>.
                    Stay tuned for the full release of this module.
                </p>
            </div>
        </div>
    )
}
