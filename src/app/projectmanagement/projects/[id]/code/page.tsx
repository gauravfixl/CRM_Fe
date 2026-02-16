"use client"

import React from "react"
import { Terminal } from "lucide-react"

export default function CodePage() {
    const repositories = [
        { id: "r1", name: "website-redesign-v2", type: "GitHub", branches: 12, commits: 1450, status: "Connected", lastSync: "2 mins ago" },
        { id: "r2", name: "mobile-app-flutter", type: "GitLab", branches: 8, commits: 890, status: "Connected", lastSync: "1 hour ago" },
        { id: "r3", name: "backend-api-service", type: "Bitbucket", branches: 24, commits: 3200, status: "Syncing...", lastSync: "Just now" },
    ]

    return (
        <div className="flex flex-col h-full gap-6 max-w-7xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                        <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Code Repositories</h1>
                        <p className="text-[13px] text-slate-500 font-medium italic">Manage connected source code repositories.</p>
                    </div>
                </div>
                <button
                    onClick={() => alert("Connecting to provider...")}
                    className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-sm flex items-center gap-2 transition-colors"
                >
                    <span>Connect Repository</span>
                </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="grid grid-cols-1 divide-y divide-slate-100">
                    {repositories.map(repo => (
                        <div key={repo.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                                    {repo.type.substring(0, 2)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        {repo.name}
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${repo.status === 'Connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {repo.status}
                                        </span>
                                    </h3>
                                    <p className="text-[12px] text-slate-500 font-medium mt-0.5 flex items-center gap-3">
                                        <span>{repo.type}</span>
                                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                        <span>{repo.branches} Branches</span>
                                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                        <span>{repo.commits} Commits</span>
                                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                        <span>Synced {repo.lastSync}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="h-8 px-3 text-[12px] font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">View Commit Log</button>
                                <button className="h-8 px-3 text-[12px] font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">Disconnect</button>
                            </div>
                        </div>
                    ))}

                    <div className="p-8 flex flex-col items-center justify-center text-center bg-slate-50/30">
                        <p className="text-slate-500 font-medium text-sm mb-3">Want to link more code?</p>
                        <div className="flex gap-3">
                            {['GitHub', 'GitLab', 'Bitbucket', 'Azure DevOps'].map(provider => (
                                <div key={provider} className="h-10 px-4 border border-slate-200 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-slate-600 shadow-sm cursor-pointer hover:border-slate-300 hover:shadow-md transition-all">
                                    {provider}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
