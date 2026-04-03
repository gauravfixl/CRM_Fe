"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import {
    Calculator,
    TrendingUp,
    HelpCircle,
    BarChart3,
    ChevronRight,
    Check,
    Eye,
    EyeOff,
    Users,
    Shuffle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { useIssueStore } from "@/shared/data/issue-store"
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21]
const LINEAR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const TSHIRT_MAP: Record<string, number> = { XS: 1, S: 2, M: 3, L: 5, XL: 8, XXL: 13 }
const MOCK_TEAM = [
    { id: "u1", name: "John Doe", avatar: "https://i.pravatar.cc/150?u=u1" },
    { id: "u2", name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=u2" },
    { id: "u3", name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?u=u3" },
    { id: "u4", name: "Emily Davis", avatar: "https://i.pravatar.cc/150?u=u4" },
]

export default function EstimationPage() {
    const params = useParams()
    const { issues: allIssues, updateIssue } = useIssueStore()
    const { sprints: allSprints } = useSprintEpicStore()
    const { projects } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [selectedProjectId, setSelectedProjectId] = useState<string>("")

    const workspaceProjects = useMemo(() =>
        projects.filter(p => !activeWorkspaceId || p.workspaceId === activeWorkspaceId),
        [projects, activeWorkspaceId]
    )

    useEffect(() => {
        if (!selectedProjectId && workspaceProjects.length > 0) {
            setSelectedProjectId(workspaceProjects[0].id)
        }
    }, [workspaceProjects, selectedProjectId])

    const issues = useMemo(() => selectedProjectId ? allIssues.filter(i => i.projectId === selectedProjectId) : allIssues, [allIssues, selectedProjectId])
    const sprints = useMemo(() => selectedProjectId ? allSprints.filter(s => s.projectId === selectedProjectId) : allSprints, [allSprints, selectedProjectId])

    const [estimationMethod, setEstimationMethod] = useState<"story-points" | "tshirt" | "hours">("story-points")
    const [pointScale, setPointScale] = useState<"fibonacci" | "linear" | "custom">("fibonacci")
    const [customScale, setCustomScale] = useState("")
    const [pokerSprintId, setPokerSprintId] = useState<string>("")
    const [pokerIssueIndex, setPokerIssueIndex] = useState(0)
    const [votes, setVotes] = useState<Record<string, number | null>>({})
    const [revealed, setRevealed] = useState(false)
    const [activeTab, setActiveTab] = useState("unestimated")

    const currentScale = pointScale === "fibonacci" ? FIBONACCI : pointScale === "linear" ? LINEAR : customScale.split(",").map(Number).filter(Boolean)

    const unestimatedIssues = useMemo(() => issues.filter(i => !i.storyPoints || i.storyPoints === 0), [issues])
    const estimatedIssues = useMemo(() => issues.filter(i => i.storyPoints && i.storyPoints > 0), [issues])

    const totalPoints = useMemo(() => estimatedIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0), [estimatedIssues])
    const avgPoints = useMemo(() => estimatedIssues.length > 0 ? (totalPoints / estimatedIssues.length).toFixed(1) : "0", [totalPoints, estimatedIssues])

    const completedSprints = useMemo(() => sprints.filter(s => s.status === "COMPLETED"), [sprints])
    const velocity = useMemo(() => {
        if (completedSprints.length === 0) return totalPoints > 0 ? totalPoints : 15
        return Math.round(totalPoints / Math.max(completedSprints.length, 1))
    }, [completedSprints, totalPoints])

    const mockVelocityData = [
        { sprint: "Sprint 19", points: 21 },
        { sprint: "Sprint 20", points: 18 },
        { sprint: "Sprint 21", points: 25 },
        { sprint: "Sprint 22", points: 22 },
        { sprint: "Sprint 23", points: 28 },
        { sprint: "Sprint 24", points: velocity },
    ]

    const mockAccuracyData = [
        { sprint: "Sprint 19", estimated: 24, actual: 21 },
        { sprint: "Sprint 20", estimated: 20, actual: 18 },
        { sprint: "Sprint 21", estimated: 26, actual: 25 },
        { sprint: "Sprint 22", estimated: 24, actual: 22 },
        { sprint: "Sprint 23", estimated: 30, actual: 28 },
    ]

    const pokerIssues = useMemo(() => {
        if (!pokerSprintId) return unestimatedIssues.slice(0, 5)
        return issues.filter(i => i.sprintId === pokerSprintId && (!i.storyPoints || i.storyPoints === 0))
    }, [pokerSprintId, issues, unestimatedIssues])

    const currentPokerIssue = pokerIssues[pokerIssueIndex]

    const handleSetPoints = (issueId: string, points: number) => {
        updateIssue(issueId, { storyPoints: points })
        toast.success(`Set ${points} story points`)
    }

    const handleVote = (userId: string, points: number) => {
        setVotes(prev => ({ ...prev, [userId]: points }))
    }

    const handleReveal = () => {
        setRevealed(true)
    }

    const handleSetFinalEstimate = () => {
        if (!currentPokerIssue) return
        const voteValues = Object.values(votes).filter(v => v !== null) as number[]
        if (voteValues.length === 0) {
            toast.error("No votes to average")
            return
        }
        const avg = Math.round(voteValues.reduce((a, b) => a + b, 0) / voteValues.length)
        const closest = currentScale.reduce((prev, curr) => Math.abs(curr - avg) < Math.abs(prev - avg) ? curr : prev)
        updateIssue(currentPokerIssue.id, { storyPoints: closest })
        toast.success(`Set ${closest} points for ${currentPokerIssue.title}`)
        setVotes({})
        setRevealed(false)
        if (pokerIssueIndex < pokerIssues.length - 1) {
            setPokerIssueIndex(prev => prev + 1)
        }
    }

    const handleNextIssue = () => {
        if (pokerIssueIndex < pokerIssues.length - 1) {
            setPokerIssueIndex(prev => prev + 1)
            setVotes({})
            setRevealed(false)
        }
    }

    const maxBarHeight = 120
    const maxVelocity = Math.max(...mockVelocityData.map(d => d.points))

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* BREADCRUMB & HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECTS</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-zinc-600">ESTIMATION</span>
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Story Points & Estimation</h1>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                        <SelectTrigger className="h-8 w-48 rounded-md border-zinc-200 text-xs font-medium">
                            <SelectValue placeholder="Select project..." />
                        </SelectTrigger>
                        <SelectContent>
                            {workspaceProjects.map(p => (
                                <SelectItem key={p.id} value={p.id} className="text-xs">{p.icon} {p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-4 gap-4">
                <SmallCard>
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
                        <span className="text-xs font-medium text-zinc-500">Total Points Assigned</span>
                        <Calculator className="h-3.5 w-3.5 text-zinc-400" />
                    </SmallCardHeader>
                    <SmallCardContent>
                        <span className="text-xl font-bold text-zinc-900">{totalPoints}</span>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard>
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
                        <span className="text-xs font-medium text-zinc-500">Avg Points / Issue</span>
                        <TrendingUp className="h-3.5 w-3.5 text-zinc-400" />
                    </SmallCardHeader>
                    <SmallCardContent>
                        <span className="text-xl font-bold text-zinc-900">{avgPoints}</span>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard>
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
                        <span className="text-xs font-medium text-zinc-500">Unestimated Issues</span>
                        <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
                    </SmallCardHeader>
                    <SmallCardContent>
                        <span className="text-xl font-bold text-zinc-900">{unestimatedIssues.length}</span>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard>
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1">
                        <span className="text-xs font-medium text-zinc-500">Velocity</span>
                        <BarChart3 className="h-3.5 w-3.5 text-zinc-400" />
                    </SmallCardHeader>
                    <SmallCardContent>
                        <span className="text-xl font-bold text-zinc-900">{velocity} pts/sprint</span>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* ESTIMATION CONFIG */}
            <SmallCard>
                <SmallCardHeader>
                    <span className="text-xs font-medium text-zinc-900">Estimation Configuration</span>
                </SmallCardHeader>
                <SmallCardContent className="flex gap-4 items-end">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-500">Method</label>
                        <Select value={estimationMethod} onValueChange={(v: any) => setEstimationMethod(v)}>
                            <SelectTrigger className="w-[180px] h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="story-points">Story Points</SelectItem>
                                <SelectItem value="tshirt">T-shirt Sizes</SelectItem>
                                <SelectItem value="hours">Hours</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-500">Point Scale</label>
                        <Select value={pointScale} onValueChange={(v: any) => setPointScale(v)}>
                            <SelectTrigger className="w-[180px] h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fibonacci">Fibonacci (1,2,3,5,8,13,21)</SelectItem>
                                <SelectItem value="linear">Linear (1-10)</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {pointScale === "custom" && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-zinc-500">Custom Values (comma separated)</label>
                            <Input
                                className="w-[200px] h-8 text-xs"
                                placeholder="1,2,4,8,16"
                                value={customScale}
                                onChange={e => setCustomScale(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs text-zinc-400">Active scale:</span>
                        <div className="flex gap-1">
                            {currentScale.map(p => (
                                <Badge key={p} variant="outline" className="text-[10px] px-1.5 py-0">
                                    {estimationMethod === "tshirt" ? Object.keys(TSHIRT_MAP).find(k => TSHIRT_MAP[k] === p) || p : p}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </SmallCardContent>
            </SmallCard>

            {/* TABS */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-white border">
                    <TabsTrigger value="unestimated" className="text-xs">Unestimated Issues</TabsTrigger>
                    <TabsTrigger value="poker" className="text-xs">Planning Poker</TabsTrigger>
                    <TabsTrigger value="velocity" className="text-xs">Velocity & Accuracy</TabsTrigger>
                </TabsList>

                {/* UNESTIMATED ISSUES TAB */}
                <TabsContent value="unestimated" className="mt-4">
                    <SmallCard>
                        <SmallCardHeader>
                            <span className="text-xs font-medium text-zinc-900">Unestimated Issues ({unestimatedIssues.length})</span>
                        </SmallCardHeader>
                        <SmallCardContent>
                            {unestimatedIssues.length === 0 ? (
                                <div className="text-center py-8 text-xs text-zinc-400">All issues have been estimated</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-[11px] font-semibold uppercase text-zinc-500">Issue</TableHead>
                                            <TableHead className="text-[11px] font-semibold uppercase text-zinc-500">Title</TableHead>
                                            <TableHead className="text-[11px] font-semibold uppercase text-zinc-500">Type</TableHead>
                                            <TableHead className="text-[11px] font-semibold uppercase text-zinc-500">Priority</TableHead>
                                            <TableHead className="text-[11px] font-semibold uppercase text-zinc-500">Set Points</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {unestimatedIssues.map(issue => (
                                            <TableRow key={issue.id}>
                                                <TableCell className="text-xs font-mono text-zinc-500">{issue.id}</TableCell>
                                                <TableCell className="text-xs text-zinc-900 font-medium">{issue.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px]">{issue.type}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={`text-[10px] ${issue.priority === "URGENT" ? "bg-red-100 text-red-700" : issue.priority === "HIGH" ? "bg-orange-100 text-orange-700" : issue.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" : "bg-zinc-100 text-zinc-600"}`}
                                                    >
                                                        {issue.priority}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        {currentScale.slice(0, 7).map(p => (
                                                            <Button
                                                                key={p}
                                                                variant="outline"
                                                                className="h-7 w-7 p-0 text-[10px] font-medium hover:bg-indigo-600 hover:text-white active:scale-95"
                                                                onClick={() => handleSetPoints(issue.id, p)}
                                                            >
                                                                {p}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </SmallCardContent>
                    </SmallCard>
                </TabsContent>

                {/* PLANNING POKER TAB */}
                <TabsContent value="poker" className="mt-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Select value={pokerSprintId} onValueChange={v => { setPokerSprintId(v); setPokerIssueIndex(0); setVotes({}); setRevealed(false) }}>
                                <SelectTrigger className="w-[260px] h-8 text-xs">
                                    <SelectValue placeholder="Select sprint (or all unestimated)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Unestimated</SelectItem>
                                    {sprints.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-zinc-400">
                                Issue {pokerIssueIndex + 1} of {pokerIssues.length}
                            </span>
                        </div>

                        {currentPokerIssue ? (
                            <SmallCard>
                                <SmallCardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-mono text-zinc-400">{currentPokerIssue.id}</span>
                                        <span className="text-sm font-medium text-zinc-900">{currentPokerIssue.title}</span>
                                        <span className="text-xs text-zinc-500">{currentPokerIssue.description}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[10px]">{currentPokerIssue.type}</Badge>
                                </SmallCardHeader>
                                <SmallCardContent>
                                    <div className="flex flex-col gap-4">
                                        {/* Team votes */}
                                        <div className="flex flex-col gap-3">
                                            <span className="text-xs font-medium text-zinc-500">Team Votes</span>
                                            {MOCK_TEAM.map(member => (
                                                <div key={member.id} className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 w-[140px]">
                                                        <img src={member.avatar} alt={member.name} className="h-6 w-6 rounded-full" />
                                                        <span className="text-xs text-zinc-700">{member.name}</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {currentScale.slice(0, 7).map(p => (
                                                            <Button
                                                                key={p}
                                                                variant={votes[member.id] === p ? "default" : "outline"}
                                                                className={`h-7 w-7 p-0 text-[10px] font-medium active:scale-95 ${votes[member.id] === p ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                                                                onClick={() => handleVote(member.id, p)}
                                                            >
                                                                {revealed || votes[member.id] === p ? p : "?"}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    {!revealed && votes[member.id] !== null && votes[member.id] !== undefined && (
                                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-2 border-t">
                                            <Button
                                                className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
                                                onClick={handleReveal}
                                                disabled={revealed}
                                            >
                                                <Eye className="h-3.5 w-3.5 mr-1" />
                                                Reveal Votes
                                            </Button>
                                            {revealed && (
                                                <Button
                                                    className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white"
                                                    onClick={handleSetFinalEstimate}
                                                >
                                                    Set Final Estimate
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95"
                                                onClick={() => { setVotes({}); setRevealed(false) }}
                                            >
                                                <Shuffle className="h-3.5 w-3.5 mr-1" />
                                                Reset
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 ml-auto"
                                                onClick={handleNextIssue}
                                                disabled={pokerIssueIndex >= pokerIssues.length - 1}
                                            >
                                                Next Issue
                                                <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </SmallCardContent>
                            </SmallCard>
                        ) : (
                            <div className="text-center py-12 text-xs text-zinc-400">No unestimated issues found for this selection</div>
                        )}
                    </div>
                </TabsContent>

                {/* VELOCITY & ACCURACY TAB */}
                <TabsContent value="velocity" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Velocity chart */}
                        <SmallCard>
                            <SmallCardHeader>
                                <span className="text-xs font-medium text-zinc-900">Velocity (Last 6 Sprints)</span>
                            </SmallCardHeader>
                            <SmallCardContent>
                                <div className="flex items-end gap-3 h-[160px] pt-4">
                                    {mockVelocityData.map((d, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                            <span className="text-[10px] font-medium text-zinc-700">{d.points}</span>
                                            <div
                                                className="w-full bg-indigo-500 rounded-t-sm transition-all"
                                                style={{ height: `${(d.points / maxVelocity) * maxBarHeight}px` }}
                                            />
                                            <span className="text-[9px] text-zinc-400 truncate w-full text-center">{d.sprint.replace("Sprint ", "S")}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-2 border-t">
                                    <span className="text-[10px] text-zinc-400">Avg velocity</span>
                                    <span className="text-xs font-semibold text-zinc-900">
                                        {Math.round(mockVelocityData.reduce((a, b) => a + b.points, 0) / mockVelocityData.length)} pts
                                    </span>
                                </div>
                            </SmallCardContent>
                        </SmallCard>

                        {/* Accuracy chart */}
                        <SmallCard>
                            <SmallCardHeader>
                                <span className="text-xs font-medium text-zinc-900">Estimation Accuracy</span>
                            </SmallCardHeader>
                            <SmallCardContent>
                                <div className="flex items-end gap-3 h-[160px] pt-4">
                                    {mockAccuracyData.map((d, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                            <span className="text-[10px] text-zinc-500">{d.estimated}/{d.actual}</span>
                                            <div className="flex gap-0.5 w-full items-end">
                                                <div
                                                    className="flex-1 bg-indigo-300 rounded-t-sm"
                                                    style={{ height: `${(d.estimated / 35) * maxBarHeight}px` }}
                                                />
                                                <div
                                                    className="flex-1 bg-indigo-600 rounded-t-sm"
                                                    style={{ height: `${(d.actual / 35) * maxBarHeight}px` }}
                                                />
                                            </div>
                                            <span className="text-[9px] text-zinc-400 truncate w-full text-center">{d.sprint.replace("Sprint ", "S")}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4 mt-3 pt-2 border-t">
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-sm bg-indigo-300" />
                                        <span className="text-[10px] text-zinc-400">Estimated</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="h-2 w-2 rounded-sm bg-indigo-600" />
                                        <span className="text-[10px] text-zinc-400">Actual</span>
                                    </div>
                                    <span className="text-[10px] text-zinc-400 ml-auto">
                                        Accuracy: {Math.round((mockAccuracyData.reduce((a, d) => a + d.actual, 0) / mockAccuracyData.reduce((a, d) => a + d.estimated, 0)) * 100)}%
                                    </span>
                                </div>
                            </SmallCardContent>
                        </SmallCard>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
