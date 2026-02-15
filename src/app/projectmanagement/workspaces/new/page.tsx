"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Building2,
    Globe,
    Link as LinkIcon,
    CheckCircle2,
    Rocket,
    ArrowRight,
    Sparkles,
    Shield,
    Briefcase,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

export default function CreateWorkspacePage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [workspaceName, setWorkspaceName] = useState("")
    const [slug, setSlug] = useState("")
    const [industry, setIndustry] = useState("Software")
    const [purpose, setPurpose] = useState("Product Management")
    const [setupProgress, setSetupProgress] = useState(0)
    const { addWorkspace } = useWorkspaceStore()

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setWorkspaceName(val)
        // Auto-slugify
        setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'))
    }

    // Simulate setup progress
    React.useEffect(() => {
        if (step === 2 && setupProgress < 4) {
            const timer = setTimeout(() => {
                setSetupProgress(prev => prev + 1)
            }, 1200)
            return () => clearTimeout(timer)
        }
    }, [step, setupProgress])

    const industries = ["Software", "Marketing", "Business", "Education", "Healthcare", "Other"]
    const purposes = ["Product Management", "Team Collaboration", "Project Tracking", "Software Development", "Marketing Campaigns"]

    const setupSteps = [
        { label: 'Provisioning cloud resources...', id: 1 },
        { label: 'Applying Jira-style project engine...', id: 2 },
        { label: 'Generating workspace dashboard...', id: 3 },
        { label: 'Connecting team modules...', id: 4 },
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">

            {/* Logo / Branding */}
            <div className="mb-8 flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Rocket size={20} />
                </div>
                <span className="text-xl font-black text-slate-800 tracking-tighter uppercase">CubiclePM</span>
            </div>

            <div className="w-full max-w-[550px] space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                    <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                </div>

                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">Create your workspace</h1>
                            <p className="text-slate-500 font-medium italic text-sm">Set up a space for your projects, tasks, and team members.</p>
                        </div>

                        <Card className="border border-slate-200/60 shadow-2xl shadow-slate-200/50 rounded-[32px] overflow-hidden bg-white">
                            <CardContent className="p-10 space-y-8">
                                {/* Workspace Name & Slug */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-700 tracking-tight ml-1 uppercase">Workspace Name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                            <Input
                                                placeholder="e.g. Fixl Solutions"
                                                value={workspaceName}
                                                onChange={handleNameChange}
                                                className="h-12 pl-12 border-slate-200 focus:ring-2 focus:ring-indigo-500/10 text-[15px] font-semibold rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-700 tracking-tight ml-1 uppercase">Workspace URL</label>
                                        <div className="flex items-center group">
                                            <div className="h-12 px-4 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl flex items-center text-[12px] font-bold text-slate-400 group-focus-within:bg-indigo-50 transition-colors">
                                                cubicle.pm/
                                            </div>
                                            <Input
                                                placeholder="my-workspace"
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                className="h-12 border-slate-200 rounded-l-none rounded-r-xl focus:ring-2 focus:ring-indigo-500/10 text-[14px] font-bold text-indigo-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Industry & Purpose (Optional Jira Fields) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-700 tracking-tight uppercase ml-1">Industry</label>
                                        <select
                                            value={industry}
                                            onChange={(e) => setIndustry(e.target.value)}
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/5 cursor-pointer"
                                        >
                                            {industries.map(i => <option key={i} value={i}>{i}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-700 tracking-tight uppercase ml-1">Work Type</label>
                                        <select
                                            value={purpose}
                                            onChange={(e) => setPurpose(e.target.value)}
                                            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/5 cursor-pointer"
                                        >
                                            {purposes.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    disabled={!workspaceName || !slug}
                                    onClick={() => setStep(2)}
                                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-[15px] gap-2 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
                                >
                                    Create Workspace
                                    <ArrowRight size={18} />
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-center gap-6 opacity-60">
                            {[
                                { icon: <Shield size={16} />, text: 'Secure' },
                                { icon: <Zap size={16} />, text: 'Instant Setup' },
                                { icon: <Briefcase size={16} />, text: 'Team Ready' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    {item.icon}
                                    {item.text}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in zoom-in duration-500 scale-95" style={{ zoom: "0.8" }}>
                        <div className="text-center space-y-2">
                            <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-50">
                                <Sparkles size={40} />
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter">Workspace Ready!</h1>
                            <p className="text-slate-500 font-medium italic text-[18px]">Initializing {workspaceName} at cubicle.pm/{slug}</p>
                        </div>

                        <Card className="border border-slate-200/60 shadow-2xl bg-white rounded-[32px] p-10">
                            <div className="space-y-6 mb-10">
                                {setupSteps.map((item) => {
                                    const status = setupProgress >= item.id ? 'complete' : (setupProgress === item.id - 1 ? 'loading' : 'waiting')
                                    return (
                                        <div key={item.id} className="flex items-center justify-between text-[15px] font-bold">
                                            <span className={status === 'complete' ? 'text-slate-800' : 'text-slate-400'}>{item.label}</span>
                                            {status === 'complete' && <CheckCircle2 size={18} className="text-emerald-500" />}
                                            {status === 'loading' && <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />}
                                        </div>
                                    )
                                })}
                            </div>

                            {setupProgress === setupSteps.length && (
                                <Button
                                    onClick={() => {
                                        const newWorkspaceId = `ws-${Date.now()}`
                                        addWorkspace({
                                            id: newWorkspaceId,
                                            name: workspaceName,
                                            slug: slug,
                                            icon: '🚀',
                                            createdAt: new Date().toISOString(),
                                            description: `Workspace for ${workspaceName}`,
                                            industry: industry,
                                            purpose: purpose
                                        })
                                        router.push('/projectmanagement')
                                    }}
                                    className="w-full bg-slate-900 hover:bg-black text-white font-bold h-14 rounded-2xl text-[16px] shadow-2xl shadow-slate-200"
                                >
                                    Enter Workspace
                                </Button>
                            )}
                        </Card>
                    </div>
                )}
            </div>

            {/* Subtle Aesthetic Elements */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.05),transparent)]" />
        </div>
    )
}
