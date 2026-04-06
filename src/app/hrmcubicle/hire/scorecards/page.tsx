"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Award, BarChart3, Check, ChevronDown, ClipboardList,
  Edit, Eye, Layers, MessageSquare, Plus, Search, Star, Trash2,
  User, UserCheck, Users, X, ThumbsUp, ThumbsDown, Minus
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/shared/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ScorecardTemplate {
  id: string
  name: string
  criteria: { id: string; name: string; weight: number }[]
  ratingScale: "1-5" | "1-10"
  createdDate: string
}

interface CompletedScorecard {
  id: string
  candidateName: string
  candidateId: string
  position: string
  interviewer: string
  round: string
  templateId: string
  ratings: { criteriaId: string; criteriaName: string; rating: number }[]
  overallScore: number
  recommendation: "Hire" | "No Hire" | "Maybe"
  notes: string
  date: string
}

const mockTemplates: ScorecardTemplate[] = [
  {
    id: "ST001", name: "Technical Interview", createdDate: "2026-01-10",
    criteria: [
      { id: "C1", name: "Technical Skills", weight: 30 },
      { id: "C2", name: "Problem Solving", weight: 25 },
      { id: "C3", name: "System Design", weight: 20 },
      { id: "C4", name: "Code Quality", weight: 15 },
      { id: "C5", name: "Communication", weight: 10 },
    ],
    ratingScale: "1-5",
  },
  {
    id: "ST002", name: "HR / Cultural Fit", createdDate: "2026-01-10",
    criteria: [
      { id: "C6", name: "Communication", weight: 25 },
      { id: "C7", name: "Cultural Fit", weight: 25 },
      { id: "C8", name: "Motivation & Drive", weight: 20 },
      { id: "C9", name: "Leadership Potential", weight: 15 },
      { id: "C10", name: "Adaptability", weight: 15 },
    ],
    ratingScale: "1-5",
  },
  {
    id: "ST003", name: "Design Review", createdDate: "2026-02-15",
    criteria: [
      { id: "C11", name: "Design Thinking", weight: 25 },
      { id: "C12", name: "Portfolio Quality", weight: 25 },
      { id: "C13", name: "Tool Proficiency", weight: 20 },
      { id: "C14", name: "User Empathy", weight: 15 },
      { id: "C15", name: "Presentation", weight: 15 },
    ],
    ratingScale: "1-5",
  },
]

const mockScorecards: CompletedScorecard[] = [
  {
    id: "SC001", candidateName: "Vikram Joshi", candidateId: "CAND001", position: "Senior Frontend Engineer",
    interviewer: "Aditya Singh", round: "Technical Round 1", templateId: "ST001",
    ratings: [
      { criteriaId: "C1", criteriaName: "Technical Skills", rating: 4 },
      { criteriaId: "C2", criteriaName: "Problem Solving", rating: 5 },
      { criteriaId: "C3", criteriaName: "System Design", rating: 4 },
      { criteriaId: "C4", criteriaName: "Code Quality", rating: 4 },
      { criteriaId: "C5", criteriaName: "Communication", rating: 3 },
    ],
    overallScore: 4.1, recommendation: "Hire", notes: "Strong problem-solving skills. Excellent React knowledge.", date: "2026-03-25",
  },
  {
    id: "SC002", candidateName: "Vikram Joshi", candidateId: "CAND001", position: "Senior Frontend Engineer",
    interviewer: "Priya Sharma", round: "HR Round", templateId: "ST002",
    ratings: [
      { criteriaId: "C6", criteriaName: "Communication", rating: 4 },
      { criteriaId: "C7", criteriaName: "Cultural Fit", rating: 5 },
      { criteriaId: "C8", criteriaName: "Motivation & Drive", rating: 4 },
      { criteriaId: "C9", criteriaName: "Leadership Potential", rating: 3 },
      { criteriaId: "C10", criteriaName: "Adaptability", rating: 4 },
    ],
    overallScore: 4.0, recommendation: "Hire", notes: "Great cultural fit. Motivated and collaborative.", date: "2026-03-26",
  },
  {
    id: "SC003", candidateName: "Neha Kapoor", candidateId: "CAND002", position: "Product Designer",
    interviewer: "Rahul Verma", round: "Design Review", templateId: "ST003",
    ratings: [
      { criteriaId: "C11", criteriaName: "Design Thinking", rating: 5 },
      { criteriaId: "C12", criteriaName: "Portfolio Quality", rating: 5 },
      { criteriaId: "C13", criteriaName: "Tool Proficiency", rating: 4 },
      { criteriaId: "C14", criteriaName: "User Empathy", rating: 5 },
      { criteriaId: "C15", criteriaName: "Presentation", rating: 4 },
    ],
    overallScore: 4.6, recommendation: "Hire", notes: "Outstanding portfolio and design process.", date: "2026-03-24",
  },
  {
    id: "SC004", candidateName: "Karan Malhotra", candidateId: "CAND003", position: "Data Analyst",
    interviewer: "Aditya Singh", round: "Technical Round 1", templateId: "ST001",
    ratings: [
      { criteriaId: "C1", criteriaName: "Technical Skills", rating: 3 },
      { criteriaId: "C2", criteriaName: "Problem Solving", rating: 3 },
      { criteriaId: "C3", criteriaName: "System Design", rating: 2 },
      { criteriaId: "C4", criteriaName: "Code Quality", rating: 3 },
      { criteriaId: "C5", criteriaName: "Communication", rating: 4 },
    ],
    overallScore: 3.0, recommendation: "Maybe", notes: "Good communication but needs more SQL depth.", date: "2026-03-27",
  },
  {
    id: "SC005", candidateName: "Simran Kaur", candidateId: "CAND004", position: "DevOps Engineer",
    interviewer: "Drashi Garg", round: "Technical Round 1", templateId: "ST001",
    ratings: [
      { criteriaId: "C1", criteriaName: "Technical Skills", rating: 2 },
      { criteriaId: "C2", criteriaName: "Problem Solving", rating: 2 },
      { criteriaId: "C3", criteriaName: "System Design", rating: 1 },
      { criteriaId: "C4", criteriaName: "Code Quality", rating: 2 },
      { criteriaId: "C5", criteriaName: "Communication", rating: 3 },
    ],
    overallScore: 2.0, recommendation: "No Hire", notes: "Doesn't meet minimum technical bar for the role.", date: "2026-03-20",
  },
]

const rounds = ["Technical Round 1", "Technical Round 2", "HR Round", "Design Review", "Final Round"]
const positions = ["Senior Frontend Engineer", "Product Designer", "Data Analyst", "DevOps Engineer", "HR Business Partner"]

const recColors: Record<string, string> = {
  Hire: "bg-emerald-100 text-emerald-700",
  "No Hire": "bg-red-100 text-red-700",
  Maybe: "bg-amber-100 text-amber-700",
}

const recIcons: Record<string, typeof ThumbsUp> = {
  Hire: ThumbsUp,
  "No Hire": ThumbsDown,
  Maybe: Minus,
}

const InterviewScorecardsPage = () => {
  const router = useRouter()
  const { toast } = useToast()

  const [templates, setTemplates] = useState<ScorecardTemplate[]>(mockTemplates)
  const [scorecards, setScorecards] = useState<CompletedScorecard[]>(mockScorecards)
  const [search, setSearch] = useState("")
  const [positionFilter, setPositionFilter] = useState("all")

  // Template management
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ScorecardTemplate | null>(null)
  const [templateForm, setTemplateForm] = useState({ name: "", ratingScale: "1-5" as "1-5" | "1-10", criteria: [{ id: "new1", name: "", weight: 0 }] })

  // Fill scorecard
  const [fillOpen, setFillOpen] = useState(false)
  const [fillForm, setFillForm] = useState({
    candidateName: "", position: "", round: "", templateId: "",
    ratings: [] as { criteriaId: string; criteriaName: string; rating: number }[],
    notes: "", recommendation: "Maybe" as "Hire" | "No Hire" | "Maybe",
  })

  // Compare
  const [compareOpen, setCompareOpen] = useState(false)
  const [comparePosition, setComparePosition] = useState("")

  const filtered = scorecards
    .filter((s) => positionFilter === "all" || s.position === positionFilter)
    .filter((s) => !search || s.candidateName.toLowerCase().includes(search.toLowerCase()) || s.interviewer.toLowerCase().includes(search.toLowerCase()))

  // Candidate summary
  const candidateSummary = Object.values(
    scorecards.reduce<Record<string, { name: string; candidateId: string; position: string; cards: CompletedScorecard[]; avgScore: number }>>((acc, sc) => {
      const key = sc.candidateId
      if (!acc[key]) acc[key] = { name: sc.candidateName, candidateId: sc.candidateId, position: sc.position, cards: [], avgScore: 0 }
      acc[key].cards.push(sc)
      return acc
    }, {})
  ).map((c) => ({ ...c, avgScore: +(c.cards.reduce((a, b) => a + b.overallScore, 0) / c.cards.length).toFixed(1) }))

  const openNewTemplate = () => {
    setEditingTemplate(null)
    setTemplateForm({ name: "", ratingScale: "1-5", criteria: [{ id: "new1", name: "", weight: 0 }] })
    setTemplateDialogOpen(true)
  }

  const openEditTemplate = (tmpl: ScorecardTemplate) => {
    setEditingTemplate(tmpl)
    setTemplateForm({ name: tmpl.name, ratingScale: tmpl.ratingScale, criteria: [...tmpl.criteria] })
    setTemplateDialogOpen(true)
  }

  const saveTemplate = () => {
    if (!templateForm.name.trim()) {
      toast({ title: "Error", description: "Template name is required.", variant: "destructive" })
      return
    }
    const validCriteria = templateForm.criteria.filter((c) => c.name.trim())
    if (validCriteria.length === 0) {
      toast({ title: "Error", description: "Add at least one criteria.", variant: "destructive" })
      return
    }
    if (editingTemplate) {
      setTemplates(templates.map((t) => t.id === editingTemplate.id ? { ...t, name: templateForm.name, ratingScale: templateForm.ratingScale, criteria: validCriteria } : t))
      toast({ title: "Updated", description: "Template updated successfully." })
    } else {
      setTemplates([...templates, { id: `ST${Date.now()}`, name: templateForm.name, ratingScale: templateForm.ratingScale, criteria: validCriteria, createdDate: new Date().toISOString().split("T")[0] }])
      toast({ title: "Created", description: "New scorecard template created." })
    }
    setTemplateDialogOpen(false)
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
    toast({ title: "Deleted", description: "Template removed." })
  }

  const addCriteria = () => {
    setTemplateForm({ ...templateForm, criteria: [...templateForm.criteria, { id: `new${Date.now()}`, name: "", weight: 0 }] })
  }

  const openFillScorecard = () => {
    setFillForm({ candidateName: "", position: "", round: "", templateId: "", ratings: [], notes: "", recommendation: "Maybe" })
    setFillOpen(true)
  }

  const onTemplateSelect = (tmplId: string) => {
    const tmpl = templates.find((t) => t.id === tmplId)
    if (tmpl) {
      setFillForm({
        ...fillForm,
        templateId: tmplId,
        ratings: tmpl.criteria.map((c) => ({ criteriaId: c.id, criteriaName: c.name, rating: 0 })),
      })
    }
  }

  const setRating = (criteriaId: string, rating: number) => {
    setFillForm({
      ...fillForm,
      ratings: fillForm.ratings.map((r) => (r.criteriaId === criteriaId ? { ...r, rating } : r)),
    })
  }

  const submitScorecard = () => {
    if (!fillForm.candidateName || !fillForm.position || !fillForm.templateId) {
      toast({ title: "Error", description: "Fill all required fields.", variant: "destructive" })
      return
    }
    const avg = fillForm.ratings.length > 0
      ? +(fillForm.ratings.reduce((a, r) => a + r.rating, 0) / fillForm.ratings.length).toFixed(1)
      : 0
    const newCard: CompletedScorecard = {
      id: `SC${Date.now()}`,
      candidateName: fillForm.candidateName,
      candidateId: `CAND${Date.now()}`,
      position: fillForm.position,
      interviewer: "Aditya Singh",
      round: fillForm.round,
      templateId: fillForm.templateId,
      ratings: fillForm.ratings,
      overallScore: avg,
      recommendation: fillForm.recommendation,
      notes: fillForm.notes,
      date: new Date().toISOString().split("T")[0],
    }
    setScorecards([newCard, ...scorecards])
    setFillOpen(false)
    toast({ title: "Scorecard Submitted", description: `Evaluation for ${fillForm.candidateName} submitted.` })
  }

  const compareCards = candidateSummary.filter((c) => c.position === comparePosition)

  return (
    <div className="flex-1 p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar space-y-6" style={{ zoom: "90%" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Interview Scorecards</h1>
          <p className="text-sm text-slate-500">Create evaluation templates and review candidate scores</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold" onClick={() => { setComparePosition(positions[0]); setCompareOpen(true) }}>
            <BarChart3 className="mr-2 h-4 w-4" /> Compare
          </Button>
          <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={openFillScorecard}>
            <Plus className="mr-2 h-4 w-4" /> New Scorecard
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Evaluations", value: scorecards.length, icon: ClipboardList, bg: "bg-violet-50 border-violet-100", iconColor: "text-violet-600 bg-violet-100", valueColor: "text-violet-700" },
          { label: "Candidates Reviewed", value: candidateSummary.length, icon: Users, bg: "bg-blue-50 border-blue-100", iconColor: "text-blue-600 bg-blue-100", valueColor: "text-blue-700" },
          { label: "Hire Recommended", value: scorecards.filter((s) => s.recommendation === "Hire").length, icon: ThumbsUp, bg: "bg-emerald-50 border-emerald-100", iconColor: "text-emerald-600 bg-emerald-100", valueColor: "text-emerald-700" },
          { label: "Templates", value: templates.length, icon: Layers, bg: "bg-amber-50 border-amber-100", iconColor: "text-amber-600 bg-amber-100", valueColor: "text-amber-700" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={cn("rounded-2xl border shadow-sm p-5", stat.bg)}>
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.iconColor)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className={cn("text-lg font-bold", stat.valueColor)}>{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="scorecards" className="flex-1">
        <TabsList className="bg-slate-100 rounded-xl p-1 mb-4">
          <TabsTrigger value="scorecards" className="rounded-lg text-xs font-bold px-4">Scorecards</TabsTrigger>
          <TabsTrigger value="candidates" className="rounded-lg text-xs font-bold px-4">Candidate Summary</TabsTrigger>
          <TabsTrigger value="templates" className="rounded-lg text-xs font-bold px-4">Templates</TabsTrigger>
        </TabsList>

        {/* Scorecards Table */}
        <TabsContent value="scorecards">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search candidate or interviewer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
              </div>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-52 rounded-xl text-xs"><SelectValue placeholder="Filter by position" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Candidate</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Position</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Interviewer</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Round</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Score</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Recommendation</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sc) => {
                  const RecIcon = recIcons[sc.recommendation]
                  return (
                    <TableRow key={sc.id} className="hover:bg-slate-50">
                      <TableCell className="font-semibold text-sm text-slate-800">{sc.candidateName}</TableCell>
                      <TableCell className="text-xs text-slate-600">{sc.position}</TableCell>
                      <TableCell className="text-xs text-slate-500">{sc.interviewer}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] rounded-full">{sc.round}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className={cn("h-3.5 w-3.5", sc.overallScore >= 4 ? "text-amber-400 fill-amber-400" : sc.overallScore >= 3 ? "text-amber-400" : "text-slate-300")} />
                          <span className="text-sm font-bold text-slate-800">{sc.overallScore}</span>
                          <span className="text-[10px] text-slate-400">/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px] rounded-full flex items-center gap-1 w-fit", recColors[sc.recommendation])}>
                          <RecIcon className="h-3 w-3" /> {sc.recommendation}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{sc.date}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Candidate Summary */}
        <TabsContent value="candidates">
          <div className="space-y-4">
            {candidateSummary.map((cand) => {
              const hireCount = cand.cards.filter((c) => c.recommendation === "Hire").length
              const noHireCount = cand.cards.filter((c) => c.recommendation === "No Hire").length
              const maybeCount = cand.cards.filter((c) => c.recommendation === "Maybe").length
              return (
                <Card key={cand.candidateId} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{cand.name}</p>
                        <p className="text-xs text-slate-400">{cand.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xl font-black text-slate-900">{cand.avgScore}</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-widest">Avg Score</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-700 text-[9px] rounded-full">{hireCount} Hire</Badge>
                        <Badge className="bg-amber-100 text-amber-700 text-[9px] rounded-full">{maybeCount} Maybe</Badge>
                        <Badge className="bg-red-100 text-red-700 text-[9px] rounded-full">{noHireCount} No Hire</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {cand.cards.map((card) => (
                      <div key={card.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[10px] rounded-full">{card.round}</Badge>
                          <span className="text-xs text-slate-500">by {card.interviewer}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold">{card.overallScore}</span>
                          </div>
                          <Badge className={cn("text-[9px] rounded-full", recColors[card.recommendation])}>{card.recommendation}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Scorecard Templates</h3>
              <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-bold" onClick={openNewTemplate}>
                <Plus className="mr-1 h-3 w-3" /> New Template
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((tmpl) => (
                <Card key={tmpl.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{tmpl.name}</p>
                      <p className="text-[10px] text-slate-400">Scale: {tmpl.ratingScale} | {tmpl.criteria.length} criteria</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditTemplate(tmpl)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                        <Edit className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                      <button onClick={() => deleteTemplate(tmpl.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {tmpl.criteria.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">{c.name}</span>
                        <span className="text-slate-400 font-medium">{c.weight}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">{editingTemplate ? "Edit" : "Create"} Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Template Name</label>
              <Input value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} placeholder="e.g., Technical Interview" className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Rating Scale</label>
              <div className="flex gap-2">
                {(["1-5", "1-10"] as const).map((s) => (
                  <Button key={s} variant={templateForm.ratingScale === s ? "default" : "outline"} size="sm" className={cn("rounded-lg text-xs", templateForm.ratingScale === s && "bg-[#8B5CF6]")} onClick={() => setTemplateForm({ ...templateForm, ratingScale: s })}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-500">Evaluation Criteria</label>
                <Button size="sm" variant="outline" className="rounded-lg text-xs" onClick={addCriteria}>
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {templateForm.criteria.map((c, idx) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <Input
                      value={c.name}
                      onChange={(e) => {
                        const newC = [...templateForm.criteria]
                        newC[idx] = { ...c, name: e.target.value }
                        setTemplateForm({ ...templateForm, criteria: newC })
                      }}
                      placeholder="Criteria name"
                      className="flex-1 rounded-lg text-xs"
                    />
                    <Input
                      type="number"
                      value={c.weight || ""}
                      onChange={(e) => {
                        const newC = [...templateForm.criteria]
                        newC[idx] = { ...c, weight: parseInt(e.target.value) || 0 }
                        setTemplateForm({ ...templateForm, criteria: newC })
                      }}
                      placeholder="Weight %"
                      className="w-24 rounded-lg text-xs"
                    />
                    <button onClick={() => setTemplateForm({ ...templateForm, criteria: templateForm.criteria.filter((_, i) => i !== idx) })} className="p-1 hover:bg-red-50 rounded">
                      <X className="h-3.5 w-3.5 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={saveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fill Scorecard Dialog */}
      <Dialog open={fillOpen} onOpenChange={setFillOpen}>
        <DialogContent className="max-w-lg rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Fill Scorecard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Candidate Name *</label>
                <Input value={fillForm.candidateName} onChange={(e) => setFillForm({ ...fillForm, candidateName: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Position *</label>
                <Select value={fillForm.position} onValueChange={(v) => setFillForm({ ...fillForm, position: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>{positions.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Round</label>
                <Select value={fillForm.round} onValueChange={(v) => setFillForm({ ...fillForm, round: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>{rounds.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Template *</label>
                <Select value={fillForm.templateId} onValueChange={onTemplateSelect}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>{templates.map((t) => (<SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            {/* Ratings */}
            {fillForm.ratings.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Ratings</label>
                <div className="space-y-3">
                  {fillForm.ratings.map((r) => (
                    <div key={r.criteriaId} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-sm text-slate-700 font-medium">{r.criteriaName}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                          <button key={star} onClick={() => setRating(r.criteriaId, star)} className="p-0.5">
                            <Star className={cn("h-5 w-5 transition-colors", star <= r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Recommendation</label>
              <div className="flex gap-2">
                {(["Hire", "Maybe", "No Hire"] as const).map((rec) => (
                  <Button
                    key={rec}
                    variant={fillForm.recommendation === rec ? "default" : "outline"}
                    size="sm"
                    className={cn("rounded-lg text-xs flex-1", fillForm.recommendation === rec && recColors[rec].replace("bg-", "bg-").replace("text-", "text-"))}
                    onClick={() => setFillForm({ ...fillForm, recommendation: rec })}
                  >
                    {rec}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Notes</label>
              <textarea
                value={fillForm.notes}
                onChange={(e) => setFillForm({ ...fillForm, notes: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent outline-none"
                placeholder="Additional comments about the candidate..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setFillOpen(false)}>Cancel</Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={submitScorecard}>Submit Scorecard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare Dialog */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-w-4xl rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Candidate Comparison</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={comparePosition} onValueChange={setComparePosition}>
              <SelectTrigger className="w-64 rounded-xl"><SelectValue placeholder="Select position..." /></SelectTrigger>
              <SelectContent>{positions.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
            </Select>

            {compareCards.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">No candidates found for this position.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compareCards.map((cand) => (
                  <Card key={cand.candidateId} className="rounded-xl border border-slate-200 p-4">
                    <div className="text-center mb-3">
                      <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-2">
                        <User className="h-6 w-6 text-violet-600" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">{cand.name}</p>
                      <p className="text-2xl font-black text-[#8B5CF6] mt-1">{cand.avgScore}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Avg Score</p>
                    </div>
                    <div className="space-y-1.5">
                      {cand.cards.map((card) => (
                        <div key={card.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50">
                          <span className="text-slate-500">{card.round}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{card.overallScore}</span>
                            <Badge className={cn("text-[8px] rounded-full", recColors[card.recommendation])}>{card.recommendation}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setCompareOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InterviewScorecardsPage
