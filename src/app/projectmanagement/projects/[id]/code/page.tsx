"use client"

import React, { useState } from "react"
import { Terminal, GitBranch, ExternalLink, Plus, Github, Gitlab } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIntegrationStore } from "@/shared/data/integration-store"

interface ConnectedRepo {
    id: string
    name: string
    provider: string
    url: string
    addedAt: string
}

export default function CodePage() {
    const { integrations } = useIntegrationStore()
    const [repos, setRepos] = useState<ConnectedRepo[]>([])
    const [showForm, setShowForm] = useState(false)
    const [repoUrl, setRepoUrl] = useState("")
    const [repoName, setRepoName] = useState("")

    const githubEnabled = integrations.find(i => i.id === "github")?.enabled

    const handleAdd = () => {
        if (!repoUrl.trim() || !repoName.trim()) return
        const provider = repoUrl.includes("github") ? "GitHub" : repoUrl.includes("gitlab") ? "GitLab" : "Other"
        setRepos(prev => [...prev, {
            id: `repo-${Date.now()}`,
            name: repoName.trim(),
            provider,
            url: repoUrl.trim(),
            addedAt: new Date().toISOString(),
        }])
        setRepoUrl("")
        setRepoName("")
        setShowForm(false)
    }

    return (
        <div className="flex flex-col h-full gap-5 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-slate-900 text-white flex items-center justify-center rounded-none">
                        <Terminal size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Code Repositories</h1>
                        <p className="text-[12px] text-slate-500 font-medium">Link source code repos to this project for traceability.</p>
                    </div>
                </div>
                <Button onClick={() => setShowForm(true)} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <Plus size={14} /> Link Repository
                </Button>
            </div>

            {!githubEnabled && (
                <Card className="border border-amber-200 bg-amber-50 rounded-none">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Github size={20} className="text-amber-700" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-900">GitHub integration is off</h4>
                                <p className="text-[11px] text-amber-700">Enable in workspace integrations to sync commits and PRs.</p>
                            </div>
                        </div>
                        <Link href="/projectmanagement/workspace/settings/integrations">
                            <Button variant="outline" className="h-8 border-amber-300 text-amber-800 text-xs font-bold rounded-none">
                                Open Integrations
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {showForm && (
                <Card className="border border-indigo-200 bg-indigo-50/30 rounded-none">
                    <CardContent className="p-4 space-y-3">
                        <h4 className="text-sm font-bold text-slate-800">Link a repository</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                value={repoName}
                                onChange={(e) => setRepoName(e.target.value)}
                                placeholder="Repository name"
                                className="h-9 px-3 border border-slate-200 text-xs font-medium rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                placeholder="https://github.com/org/repo"
                                className="h-9 px-3 border border-slate-200 text-xs font-medium rounded-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <Button variant="ghost" onClick={() => setShowForm(false)} className="h-8 text-xs font-bold rounded-none">Cancel</Button>
                            <Button onClick={handleAdd} disabled={!repoUrl.trim() || !repoName.trim()} className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-none">Add</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-3">
                {repos.length === 0 ? (
                    <div className="bg-slate-50 border border-dashed border-slate-200 py-12 text-center rounded-none">
                        <GitBranch size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No repositories linked yet.</p>
                        <p className="text-[11px] text-slate-400 mt-1">Connect a repo to track commits, branches, and PRs alongside your issues.</p>
                    </div>
                ) : (
                    repos.map(repo => (
                        <Card key={repo.id} className="border border-slate-200 shadow-sm bg-white rounded-none hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center rounded-none">
                                    {repo.provider === "GitHub" ? <Github size={18} /> : repo.provider === "GitLab" ? <Gitlab size={18} /> : <Terminal size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{repo.name}</h4>
                                    <p className="text-[11px] text-slate-500 truncate">{repo.url}</p>
                                </div>
                                <Badge className="bg-slate-50 text-slate-600 text-[10px] font-bold rounded-none">{repo.provider}</Badge>
                                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-none">
                                    <ExternalLink size={14} />
                                </a>
                                <button onClick={() => setRepos(prev => prev.filter(r => r.id !== repo.id))} className="h-8 px-2 text-[10px] font-bold text-rose-600 hover:bg-rose-50 rounded-none">Unlink</button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
