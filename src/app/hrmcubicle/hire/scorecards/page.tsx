"use client"

// TODO: backend — scorecard templates + calibration require dedicated BE module
// Only "Submit Scorecard" is bridged to the interview-feedback endpoint today.

import React, { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import {
  ClipboardCheck, Target, Users, Star, TrendingUp, Scale, AlertTriangle,
  CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Copy, Edit, Trash2, Eye,
  Download, Plus, Search, Filter, MoreHorizontal, Award, BarChart3,
  GitCompare, FileCheck, X,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Label } from "@/shared/components/ui/label"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/shared/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useHireStore } from "@/shared/data/hire-store"

/* =========================================================================
   TYPES
   ========================================================================= */

type RatingScale = "1-5" | "1-10"
type RoundType = "HR" | "Technical" | "Managerial" | "Final" | "Custom"
type ScorecardRec = "Strong Hire" | "Hire" | "No Hire" | "Strong No Hire"

interface Criterion {
  id: string
  name: string
  weight: number
  helperText?: string
}

interface Template {
  id: string
  name: string
  roundType: RoundType
  scale: RatingScale
  criteria: Criterion[]
  description?: string
  createdAt: string
  active: boolean
}

interface Rating {
  criterionId: string
  score: number
}

interface Scorecard {
  id: string
  candidateId: string
  candidateName: string
  jobId: string
  position: string
  round: string
  interviewerId: string
  interviewerName: string
  templateId: string
  scale: RatingScale
  ratings: Rating[]
  weightedOverall: number
  recommendation: ScorecardRec
  notes: string
  criterionNotes: Record<string, string>
  submittedAt: string
  version: number
}

/* =========================================================================
   HELPERS
   ========================================================================= */

const weightedScore = (ratings: Rating[], criteria: Criterion[]) => {
  const tw = criteria.reduce((s, c) => s + c.weight, 0)
  if (!tw) return 0
  return (
    ratings.reduce((s, r) => {
      const c = criteria.find((x) => x.id === r.criterionId)
      return c ? s + r.score * c.weight : s
    }, 0) / tw
  )
}

const recTone = (rec: ScorecardRec) => {
  switch (rec) {
    case "Strong Hire":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Hire":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "No Hire":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Strong No Hire":
      return "bg-rose-50 text-rose-700 border-rose-200"
  }
}

const recIcon = (rec: ScorecardRec) => {
  switch (rec) {
    case "Strong Hire":
      return <ThumbsUp className="h-3 w-3" />
    case "Hire":
      return <CheckCircle2 className="h-3 w-3" />
    case "No Hire":
      return <XCircle className="h-3 w-3" />
    case "Strong No Hire":
      return <ThumbsDown className="h-3 w-3" />
  }
}

const scoreBand = (score: number, scale: RatingScale) => {
  const max = scale === "1-5" ? 5 : 10
  const pct = (score / max) * 100
  if (pct >= 80) return "text-emerald-600"
  if (pct >= 60) return "text-blue-600"
  if (pct >= 40) return "text-amber-600"
  return "text-rose-600"
}

const scoreBgBand = (score: number, scale: RatingScale) => {
  const max = scale === "1-5" ? 5 : 10
  const pct = (score / max) * 100
  if (pct >= 80) return "bg-emerald-500"
  if (pct >= 60) return "bg-blue-500"
  if (pct >= 40) return "bg-amber-500"
  return "bg-rose-500"
}

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  } catch {
    return iso
  }
}

/* =========================================================================
   SEED DATA — 4 templates + 8 scorecards
   ========================================================================= */

const SEED_TEMPLATES: Template[] = [
  {
    id: "TPL-001",
    name: "HR Screening",
    roundType: "HR",
    scale: "1-5",
    description: "Baseline screening for communication, motivation, and cultural fit.",
    createdAt: "2026-01-10",
    active: true,
    criteria: [
      { id: "C-HR-1", name: "Communication", weight: 30, helperText: "Clarity, articulation, listening" },
      { id: "C-HR-2", name: "Cultural Fit", weight: 25, helperText: "Alignment with values & team dynamic" },
      { id: "C-HR-3", name: "Motivation & Drive", weight: 25, helperText: "Why this role, growth appetite" },
      { id: "C-HR-4", name: "Availability & Logistics", weight: 20, helperText: "Notice period, relocation, compensation" },
    ],
  },
  {
    id: "TPL-002",
    name: "Technical Interview",
    roundType: "Technical",
    scale: "1-5",
    description: "Deep technical evaluation covering coding, system design, and problem solving.",
    createdAt: "2026-01-12",
    active: true,
    criteria: [
      { id: "C-TE-1", name: "Technical Skills", weight: 30, helperText: "Core stack proficiency" },
      { id: "C-TE-2", name: "Problem Solving", weight: 25, helperText: "Structured approach, edge cases" },
      { id: "C-TE-3", name: "System Design", weight: 20, helperText: "Architecture, trade-offs" },
      { id: "C-TE-4", name: "Code Quality", weight: 15, helperText: "Readability, testability, patterns" },
      { id: "C-TE-5", name: "Communication", weight: 10, helperText: "Explains reasoning clearly" },
    ],
  },
  {
    id: "TPL-003",
    name: "Managerial Round",
    roundType: "Managerial",
    scale: "1-5",
    description: "Leadership, ownership, and cross-functional collaboration.",
    createdAt: "2026-01-20",
    active: true,
    criteria: [
      { id: "C-MG-1", name: "Leadership", weight: 30 },
      { id: "C-MG-2", name: "Ownership & Accountability", weight: 25 },
      { id: "C-MG-3", name: "Stakeholder Management", weight: 25 },
      { id: "C-MG-4", name: "Strategic Thinking", weight: 20 },
    ],
  },
  {
    id: "TPL-004",
    name: "Final Round",
    roundType: "Final",
    scale: "1-10",
    description: "Executive sign-off round with higher-resolution scale.",
    createdAt: "2026-02-01",
    active: true,
    criteria: [
      { id: "C-FN-1", name: "Overall Fit", weight: 35 },
      { id: "C-FN-2", name: "Long-term Potential", weight: 25 },
      { id: "C-FN-3", name: "Values Alignment", weight: 20 },
      { id: "C-FN-4", name: "Impact Readiness", weight: 20 },
    ],
  },
]

const SEED_SCORECARDS: Scorecard[] = [
  {
    id: "SC-001",
    candidateId: "CAN-501",
    candidateName: "Aarav Patel",
    jobId: "JOB-101",
    position: "Senior Product Designer",
    round: "HR Screening",
    interviewerId: "EMP-021",
    interviewerName: "Priya Nair",
    templateId: "TPL-001",
    scale: "1-5",
    ratings: [
      { criterionId: "C-HR-1", score: 5 },
      { criterionId: "C-HR-2", score: 4 },
      { criterionId: "C-HR-3", score: 5 },
      { criterionId: "C-HR-4", score: 4 },
    ],
    weightedOverall: 4.55,
    recommendation: "Strong Hire",
    notes: "Exceptionally well-spoken, clearly motivated. Notice period 30 days.",
    criterionNotes: {
      "C-HR-1": "Articulate and confident.",
      "C-HR-3": "Referenced specific product work at Swiggy.",
    },
    submittedAt: "2026-04-02T10:40:00Z",
    version: 1,
  },
  {
    id: "SC-002",
    candidateId: "CAN-501",
    candidateName: "Aarav Patel",
    jobId: "JOB-101",
    position: "Senior Product Designer",
    round: "Technical Interview",
    interviewerId: "EMP-005",
    interviewerName: "Rahul Menon",
    templateId: "TPL-002",
    scale: "1-5",
    ratings: [
      { criterionId: "C-TE-1", score: 4 },
      { criterionId: "C-TE-2", score: 4 },
      { criterionId: "C-TE-3", score: 3 },
      { criterionId: "C-TE-4", score: 4 },
      { criterionId: "C-TE-5", score: 5 },
    ],
    weightedOverall: 3.85,
    recommendation: "Hire",
    notes: "Strong on execution and component architecture. System design was adequate.",
    criterionNotes: {
      "C-TE-3": "Could go deeper on caching strategies.",
    },
    submittedAt: "2026-04-05T14:20:00Z",
    version: 1,
  },
  {
    id: "SC-003",
    candidateId: "CAN-501",
    candidateName: "Aarav Patel",
    jobId: "JOB-101",
    position: "Senior Product Designer",
    round: "Managerial Round",
    interviewerId: "EMP-008",
    interviewerName: "Sneha Kapoor",
    templateId: "TPL-003",
    scale: "1-5",
    ratings: [
      { criterionId: "C-MG-1", score: 4 },
      { criterionId: "C-MG-2", score: 5 },
      { criterionId: "C-MG-3", score: 4 },
      { criterionId: "C-MG-4", score: 4 },
    ],
    weightedOverall: 4.25,
    recommendation: "Hire",
    notes: "Clear ownership mindset; will thrive with autonomy.",
    criterionNotes: {},
    submittedAt: "2026-04-09T11:10:00Z",
    version: 1,
  },
  {
    id: "SC-004",
    candidateId: "CAN-502",
    candidateName: "Vikram Joshi",
    jobId: "JOB-102",
    position: "Backend Engineer (Go)",
    round: "Technical Interview",
    interviewerId: "EMP-012",
    interviewerName: "Arjun Reddy",
    templateId: "TPL-002",
    scale: "1-5",
    ratings: [
      { criterionId: "C-TE-1", score: 5 },
      { criterionId: "C-TE-2", score: 5 },
      { criterionId: "C-TE-3", score: 4 },
      { criterionId: "C-TE-4", score: 5 },
      { criterionId: "C-TE-5", score: 4 },
    ],
    weightedOverall: 4.7,
    recommendation: "Strong Hire",
    notes: "Top-quartile candidate. Deep Go and distributed systems expertise.",
    criterionNotes: {
      "C-TE-1": "Very strong Go and gRPC depth.",
      "C-TE-2": "Solved the rate-limiter design cleanly.",
    },
    submittedAt: "2026-04-06T15:30:00Z",
    version: 1,
  },
  {
    id: "SC-005",
    candidateId: "CAN-502",
    candidateName: "Vikram Joshi",
    jobId: "JOB-102",
    position: "Backend Engineer (Go)",
    round: "Technical Interview",
    interviewerId: "EMP-015",
    interviewerName: "Meera Iyer",
    templateId: "TPL-002",
    scale: "1-5",
    ratings: [
      { criterionId: "C-TE-1", score: 3 },
      { criterionId: "C-TE-2", score: 4 },
      { criterionId: "C-TE-3", score: 2 },
      { criterionId: "C-TE-4", score: 3 },
      { criterionId: "C-TE-5", score: 4 },
    ],
    weightedOverall: 3.05,
    recommendation: "No Hire",
    notes: "Struggled with scale design trade-offs. Calibration gap vs peer interviewer.",
    criterionNotes: {
      "C-TE-3": "Could not articulate sharding strategy.",
    },
    submittedAt: "2026-04-07T09:45:00Z",
    version: 1,
  },
  {
    id: "SC-006",
    candidateId: "CAN-503",
    candidateName: "Ishita Rao",
    jobId: "JOB-101",
    position: "Senior Product Designer",
    round: "HR Screening",
    interviewerId: "EMP-021",
    interviewerName: "Priya Nair",
    templateId: "TPL-001",
    scale: "1-5",
    ratings: [
      { criterionId: "C-HR-1", score: 4 },
      { criterionId: "C-HR-2", score: 4 },
      { criterionId: "C-HR-3", score: 4 },
      { criterionId: "C-HR-4", score: 3 },
    ],
    weightedOverall: 3.8,
    recommendation: "Hire",
    notes: "Solid overall; notice period 60 days is a minor concern.",
    criterionNotes: {},
    submittedAt: "2026-04-03T16:00:00Z",
    version: 1,
  },
  {
    id: "SC-007",
    candidateId: "CAN-504",
    candidateName: "Rohan Mehta",
    jobId: "JOB-102",
    position: "Backend Engineer (Go)",
    round: "Final Round",
    interviewerId: "EMP-002",
    interviewerName: "Kunal Bhat",
    templateId: "TPL-004",
    scale: "1-10",
    ratings: [
      { criterionId: "C-FN-1", score: 8 },
      { criterionId: "C-FN-2", score: 9 },
      { criterionId: "C-FN-3", score: 8 },
      { criterionId: "C-FN-4", score: 7 },
    ],
    weightedOverall: 8.05,
    recommendation: "Hire",
    notes: "Exec panel aligned. Good long-term trajectory.",
    criterionNotes: {},
    submittedAt: "2026-04-12T17:20:00Z",
    version: 1,
  },
  {
    id: "SC-008",
    candidateId: "CAN-503",
    candidateName: "Ishita Rao",
    jobId: "JOB-101",
    position: "Senior Product Designer",
    round: "Managerial Round",
    interviewerId: "EMP-008",
    interviewerName: "Sneha Kapoor",
    templateId: "TPL-003",
    scale: "1-5",
    ratings: [
      { criterionId: "C-MG-1", score: 3 },
      { criterionId: "C-MG-2", score: 3 },
      { criterionId: "C-MG-3", score: 2 },
      { criterionId: "C-MG-4", score: 2 },
    ],
    weightedOverall: 2.6,
    recommendation: "No Hire",
    notes: "Ownership gaps surfaced during scenario discussion.",
    criterionNotes: {},
    submittedAt: "2026-04-11T12:00:00Z",
    version: 1,
  },
]

/* =========================================================================
   RATING INPUT COMPONENTS
   ========================================================================= */

const StarInput: React.FC<{
  value: number
  onChange: (v: number) => void
  max?: number
  size?: "sm" | "md" | "lg"
}> = ({ value, onChange, max = 5, size = "md" }) => {
  const sz = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className={cn(
              "transition-colors",
              filled ? "text-amber-400" : "text-slate-300 hover:text-amber-300"
            )}
            aria-label={`Rate ${i + 1}`}
          >
            <Star className={cn(sz, filled && "fill-amber-400")} />
          </button>
        )
      })}
    </div>
  )
}

const StarDisplay: React.FC<{ value: number; max?: number; size?: "sm" | "md" }> = ({
  value,
  max = 5,
  size = "sm",
}) => {
  const sz = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sz,
            i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"
          )}
        />
      ))}
    </div>
  )
}

const NumericScaleInput: React.FC<{
  value: number
  onChange: (v: number) => void
  max: number
}> = ({ value, onChange, max }) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: max }).map((_, i) => {
        const n = i + 1
        const active = value === n
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors",
              active
                ? "border-violet-500 bg-violet-500 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50"
            )}
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}

/* =========================================================================
   VALIDATION
   ========================================================================= */

const scorecardSubmitSchema = z.object({
  candidateId: z.string().min(1, "Candidate is required"),
  round: z.string().min(1, "Round is required"),
  templateId: z.string().min(1, "Template is required"),
  recommendation: z.enum(["Strong Hire", "Hire", "No Hire", "Strong No Hire"]),
  notes: z.string().optional(),
})

/* =========================================================================
   MAIN PAGE
   ========================================================================= */

export default function ScorecardsPage() {
  const { toast } = useToast()
  const storeCandidates = useHireStore((s) => s.candidates)
  const storeJobs = useHireStore((s) => s.jobs)
  const storeInterviews = useHireStore((s) => s.interviews)
  const moveCandidateStage = useHireStore((s) => s.moveCandidateStage)

  // ---------- Backend wiring ----------
  const loadInterviewsFromApi = useHireStore((s) => s.loadInterviewsFromApi)
  const loadCandidatesFromApi = useHireStore((s) => s.loadCandidatesFromApi)
  const submitInterviewFeedbackApi = useHireStore((s) => s.submitInterviewFeedbackApi)
  const hasLoadedIVs = useHireStore((s) => s.hasLoaded.interviews)
  const hasLoadedCands = useHireStore((s) => s.hasLoaded.candidates)

  useEffect(() => {
    if (!hasLoadedIVs) loadInterviewsFromApi()
    if (!hasLoadedCands) loadCandidatesFromApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- Local state ----------
  const [templates, setTemplates] = useState<Template[]>(SEED_TEMPLATES)
  const [scorecards, setScorecards] = useState<Scorecard[]>(SEED_SCORECARDS)
  const [activeTab, setActiveTab] = useState("scorecards")

  // Filters (Scorecards tab)
  const [search, setSearch] = useState("")
  const [filterPosition, setFilterPosition] = useState("all")
  const [filterRound, setFilterRound] = useState("all")
  const [filterRec, setFilterRec] = useState("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Calibration tab
  const [calCandidate, setCalCandidate] = useState<string>("CAN-502")

  // ---------- Dialog state ----------
  const [newSCOpen, setNewSCOpen] = useState(false)
  const [editSC, setEditSC] = useState<Scorecard | null>(null)
  const [newTplOpen, setNewTplOpen] = useState(false)
  const [editTpl, setEditTpl] = useState<Template | null>(null)
  const [dupTpl, setDupTpl] = useState<Template | null>(null)
  const [compareOpen, setCompareOpen] = useState(false)
  const [hireDecision, setHireDecision] = useState<{ candidateId: string; candidateName: string } | null>(null)
  const [viewSC, setViewSC] = useState<Scorecard | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [calibrationOpen, setCalibrationOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; kind: "scorecard" | "template" } | null>(null)

  // ---------- Derived ----------
  const allPositions = useMemo(
    () => Array.from(new Set(scorecards.map((s) => s.position))),
    [scorecards]
  )
  const allRounds = useMemo(
    () => Array.from(new Set(scorecards.map((s) => s.round))),
    [scorecards]
  )

  const filteredScorecards = useMemo(() => {
    return scorecards.filter((s) => {
      if (search) {
        const q = search.toLowerCase()
        if (
          !s.candidateName.toLowerCase().includes(q) &&
          !s.position.toLowerCase().includes(q) &&
          !s.interviewerName.toLowerCase().includes(q) &&
          !s.round.toLowerCase().includes(q)
        )
          return false
      }
      if (filterPosition !== "all" && s.position !== filterPosition) return false
      if (filterRound !== "all" && s.round !== filterRound) return false
      if (filterRec !== "all" && s.recommendation !== filterRec) return false
      return true
    })
  }, [scorecards, search, filterPosition, filterRound, filterRec])

  // Stats
  const stats = useMemo(() => {
    const totalEval = scorecards.length
    const uniqueCands = new Set(scorecards.map((s) => s.candidateId)).size
    const hireRecs = scorecards.filter(
      (s) => s.recommendation === "Hire" || s.recommendation === "Strong Hire"
    ).length
    // Normalize scale to 1-5 for average
    const normalized = scorecards.map((s) =>
      s.scale === "1-10" ? s.weightedOverall / 2 : s.weightedOverall
    )
    const avgScore = normalized.length
      ? normalized.reduce((a, b) => a + b, 0) / normalized.length
      : 0
    const activeTpls = templates.filter((t) => t.active).length
    return { totalEval, uniqueCands, hireRecs, avgScore, activeTpls }
  }, [scorecards, templates])

  // Grouped by candidate
  const candidateGroups = useMemo(() => {
    const map = new Map<string, Scorecard[]>()
    scorecards.forEach((s) => {
      if (!map.has(s.candidateId)) map.set(s.candidateId, [])
      map.get(s.candidateId)!.push(s)
    })
    return Array.from(map.entries()).map(([candidateId, cards]) => {
      const name = cards[0].candidateName
      const position = cards[0].position
      const jobId = cards[0].jobId
      const normalized = cards.map((c) =>
        c.scale === "1-10" ? c.weightedOverall / 2 : c.weightedOverall
      )
      const avg = normalized.reduce((a, b) => a + b, 0) / normalized.length
      const strongH = cards.filter((c) => c.recommendation === "Strong Hire").length
      const h = cards.filter((c) => c.recommendation === "Hire").length
      const nh = cards.filter((c) => c.recommendation === "No Hire").length
      const strongNh = cards.filter((c) => c.recommendation === "Strong No Hire").length

      // Calibration gap: across all interviewers for same criterion, look at 1-5 scale
      let gap = 0
      const byCrit = new Map<string, number[]>()
      cards.forEach((c) => {
        c.ratings.forEach((r) => {
          if (!byCrit.has(r.criterionId)) byCrit.set(r.criterionId, [])
          byCrit.get(r.criterionId)!.push(r.score)
        })
      })
      byCrit.forEach((scores) => {
        if (scores.length > 1) {
          const g = Math.max(...scores) - Math.min(...scores)
          if (g > gap) gap = g
        }
      })

      return { candidateId, name, position, jobId, cards, avg, strongH, h, nh, strongNh, gap }
    })
  }, [scorecards])

  // ---------- Handlers ----------
  const handleSaveScorecard = (card: Scorecard) => {
    // Validate submit payload before writing state
    const result = scorecardSubmitSchema.safeParse({
      candidateId: card.candidateId,
      round: card.round,
      templateId: card.templateId,
      recommendation: card.recommendation,
      notes: card.notes,
    })
    if (!result.success) {
      const msg = result.error.issues[0]?.message || "Invalid scorecard"
      toast({ title: "Validation failed", description: msg, variant: "destructive" })
      return
    }

    setScorecards((prev) => {
      const idx = prev.findIndex((p) => p.id === card.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...card, version: card.version + 1 }
        return next
      }
      return [card, ...prev]
    })
    toast({ title: "Scorecard saved", description: `${card.candidateName} - ${card.round}` })

    // Bridge to backend: if scorecard is linked to a scheduled interview, mirror as feedback
    const linkedInterview = storeInterviews.find(
      (i) => i.candidateId === card.candidateId && i.status === "Scheduled"
    )
    if (linkedInterview) {
      const comments = `Weighted Overall: ${card.weightedOverall.toFixed(2)}/5\n\nRecommendation: ${card.recommendation}\n\nNotes: ${card.notes || ""}`
      const ratingOutOfFive = Math.round(
        card.scale === "1-10" ? card.weightedOverall / 2 : card.weightedOverall
      )
      const interviewerId = linkedInterview.interviewers?.[0] ?? "current-user"
      submitInterviewFeedbackApi(linkedInterview.id, {
        interviewerId,
        comments,
        rating: Math.max(1, Math.min(5, ratingOutOfFive)),
      }).catch(() => {
        /* silent */
      })
    }
  }

  const handleSaveTemplate = (tpl: Template) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((p) => p.id === tpl.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = tpl
        return next
      }
      return [tpl, ...prev]
    })
    toast({ title: "Template saved", description: tpl.name })
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    if (deleteTarget.kind === "scorecard") {
      setScorecards((prev) => prev.filter((s) => !deleteTarget.ids.includes(s.id)))
      setSelectedIds([])
      toast({ title: `${deleteTarget.ids.length} scorecard(s) deleted` })
    } else {
      setTemplates((prev) => prev.filter((t) => !deleteTarget.ids.includes(t.id)))
      toast({ title: `Template deleted` })
    }
    setDeleteTarget(null)
  }

  const handleDuplicateTemplate = (tpl: Template, newName: string) => {
    const copy: Template = {
      ...tpl,
      id: `TPL-${Date.now()}`,
      name: newName,
      createdAt: new Date().toISOString().slice(0, 10),
      criteria: tpl.criteria.map((c, i) => ({ ...c, id: `${c.id}-dup-${i}` })),
    }
    setTemplates((prev) => [copy, ...prev])
    toast({ title: "Template duplicated", description: newName })
    setDupTpl(null)
  }

  const handleExport = () => {
    const ids = selectedIds.length ? selectedIds : filteredScorecards.map((s) => s.id)
    const rows = scorecards.filter((s) => ids.includes(s.id))
    const html = `
<html><head><title>Scorecards Export</title>
<style>
body{font-family:system-ui,sans-serif;padding:24px;color:#0f172a}
h1{color:#8B5CF6}
table{width:100%;border-collapse:collapse;margin-top:16px}
th,td{border:1px solid #e2e8f0;padding:8px 12px;text-align:left;font-size:13px}
th{background:#f8fafc;text-transform:uppercase;letter-spacing:.05em;font-size:11px}
</style></head><body>
<h1>Interview Scorecards Export</h1>
<p>Generated ${new Date().toLocaleString()}</p>
<table><thead><tr>
<th>Candidate</th><th>Position</th><th>Round</th><th>Interviewer</th>
<th>Score</th><th>Recommendation</th><th>Date</th>
</tr></thead><tbody>
${rows
  .map(
    (r) => `<tr>
<td>${r.candidateName}</td><td>${r.position}</td><td>${r.round}</td><td>${r.interviewerName}</td>
<td>${r.weightedOverall.toFixed(2)} / ${r.scale === "1-5" ? 5 : 10}</td>
<td>${r.recommendation}</td><td>${formatDate(r.submittedAt)}</td>
</tr>`
  )
  .join("")}
</tbody></table>
</body></html>`
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `scorecards-${Date.now()}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Export generated", description: `${rows.length} scorecard(s)` })
    setExportOpen(false)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredScorecards.length) setSelectedIds([])
    else setSelectedIds(filteredScorecards.map((s) => s.id))
  }

  /* =========================================================================
     RENDER
     ========================================================================= */

  return (
    <div className="font-sans flex min-h-screen flex-col bg-slate-50">
      {/* -------- HEADER -------- */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <ClipboardCheck className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Interview Scorecards</h1>
              <p className="text-xs text-slate-500">
                Structured evaluation, calibration, and hire decisions
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setNewTplOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New Template
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCompareOpen(true)}>
              <GitCompare className="mr-1.5 h-3.5 w-3.5" /> Compare
            </Button>
            <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export
            </Button>
            <Button
              size="sm"
              className="bg-violet-600 text-white hover:bg-violet-700"
              onClick={() => setNewSCOpen(true)}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New Scorecard
            </Button>
          </div>
        </div>
      </header>

      {/* -------- STATS -------- */}
      <section className="px-6 py-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard
            icon={<ClipboardCheck className="h-4 w-4" />}
            tone="violet"
            label="Total Evaluations"
            value={stats.totalEval.toString()}
            helper="All scorecards"
          />
          <StatCard
            icon={<Users className="h-4 w-4" />}
            tone="blue"
            label="Candidates Reviewed"
            value={stats.uniqueCands.toString()}
            helper="Unique evaluees"
          />
          <StatCard
            icon={<ThumbsUp className="h-4 w-4" />}
            tone="emerald"
            label="Hire Recommendations"
            value={stats.hireRecs.toString()}
            helper="Strong Hire + Hire"
          />
          <StatCard
            icon={<TrendingUp className="h-4 w-4" />}
            tone="amber"
            label="Average Score"
            value={`${stats.avgScore.toFixed(2)} / 5`}
            helper="Weighted mean"
          />
          <StatCard
            icon={<FileCheck className="h-4 w-4" />}
            tone="rose"
            label="Active Templates"
            value={stats.activeTpls.toString()}
            helper={`of ${templates.length}`}
          />
        </div>
      </section>

      {/* -------- TABS -------- */}
      <main className="flex-1 px-6 pb-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
            <TabsTrigger value="scorecards">
              <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" /> Scorecards
            </TabsTrigger>
            <TabsTrigger value="summary">
              <Users className="mr-1.5 h-3.5 w-3.5" /> Candidate Summary
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileCheck className="mr-1.5 h-3.5 w-3.5" /> Templates
            </TabsTrigger>
            <TabsTrigger value="calibration">
              <Scale className="mr-1.5 h-3.5 w-3.5" /> Calibration
            </TabsTrigger>
          </TabsList>

          {/* ============ SCORECARDS TAB ============ */}
          <TabsContent value="scorecards" className="mt-4">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 md:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search candidate, position, round..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={filterPosition} onValueChange={setFilterPosition}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      {allPositions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterRound} onValueChange={setFilterRound}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Round" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rounds</SelectItem>
                      {allRounds.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterRec} onValueChange={setFilterRec}>
                    <SelectTrigger className="w-[170px]">
                      <SelectValue placeholder="Recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Strong Hire">Strong Hire</SelectItem>
                      <SelectItem value="Hire">Hire</SelectItem>
                      <SelectItem value="No Hire">No Hire</SelectItem>
                      <SelectItem value="Strong No Hire">Strong No Hire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="w-10">
                      <Checkbox
                        checked={
                          filteredScorecards.length > 0 &&
                          selectedIds.length === filteredScorecards.length
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Candidate</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Position</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Round</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Interviewer</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Weighted Score</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Recommendation</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider">Date</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScorecards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-10 text-center text-sm text-slate-500">
                        No scorecards match your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredScorecards.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/70">
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(s.id)}
                            onCheckedChange={() => toggleSelect(s.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-slate-900">
                          {s.candidateName}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{s.position}</TableCell>
                        <TableCell className="text-sm text-slate-600">{s.round}</TableCell>
                        <TableCell className="text-sm text-slate-600">{s.interviewerName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "font-semibold tabular-nums",
                                scoreBand(s.weightedOverall, s.scale)
                              )}
                            >
                              {s.weightedOverall.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400 tabular-nums">
                              / {s.scale === "1-5" ? 5 : 10}
                            </span>
                            {s.scale === "1-5" && (
                              <StarDisplay value={s.weightedOverall} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("gap-1 text-[10px] uppercase tracking-wider", recTone(s.recommendation))}
                          >
                            {recIcon(s.recommendation)}
                            {s.recommendation}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 tabular-nums">
                          {formatDate(s.submittedAt)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewSC(s)}>
                                <Eye className="mr-2 h-3.5 w-3.5" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditSC(s)}>
                                <Edit className="mr-2 h-3.5 w-3.5" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-rose-600 focus:text-rose-700"
                                onClick={() =>
                                  setDeleteTarget({ ids: [s.id], kind: "scorecard" })
                                }
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Floating bulk bar */}
            {selectedIds.length > 0 && (
              <div className="sticky bottom-4 mt-4 flex justify-center">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 pl-4 shadow-lg">
                  <span className="text-xs font-medium text-slate-700 tabular-nums">
                    {selectedIds.length} selected
                  </span>
                  <div className="mx-1 h-5 w-px bg-slate-200" />
                  <Button size="sm" variant="ghost" onClick={() => setCompareOpen(true)}>
                    <GitCompare className="mr-1.5 h-3.5 w-3.5" /> Compare
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setExportOpen(true)}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Export
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() =>
                      setDeleteTarget({ ids: selectedIds, kind: "scorecard" })
                    }
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-slate-500"
                    onClick={() => setSelectedIds([])}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ============ CANDIDATE SUMMARY TAB ============ */}
          <TabsContent value="summary" className="mt-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {candidateGroups.length === 0 ? (
                <Card className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                  <p className="text-sm text-slate-500">No candidates evaluated yet.</p>
                </Card>
              ) : (
                candidateGroups.map((g) => (
                  <CandidateSummaryCard
                    key={g.candidateId}
                    group={g}
                    onHireDecision={() =>
                      setHireDecision({ candidateId: g.candidateId, candidateName: g.name })
                    }
                    onView={(id) => {
                      const sc = scorecards.find((s) => s.id === id)
                      if (sc) setViewSC(sc)
                    }}
                    onExport={() => {
                      setSelectedIds(g.cards.map((c) => c.id))
                      setExportOpen(true)
                    }}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* ============ TEMPLATES TAB ============ */}
          <TabsContent value="templates" className="mt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((tpl) => (
                <TemplateCard
                  key={tpl.id}
                  tpl={tpl}
                  onEdit={() => setEditTpl(tpl)}
                  onDuplicate={() => setDupTpl(tpl)}
                  onDelete={() => setDeleteTarget({ ids: [tpl.id], kind: "template" })}
                  onToggleActive={() =>
                    setTemplates((prev) =>
                      prev.map((p) => (p.id === tpl.id ? { ...p, active: !p.active } : p))
                    )
                  }
                />
              ))}
            </div>
          </TabsContent>

          {/* ============ CALIBRATION TAB ============ */}
          <TabsContent value="calibration" className="mt-4">
            <CalibrationView
              candidateGroups={candidateGroups}
              scorecards={scorecards}
              templates={templates}
              selected={calCandidate}
              onSelect={setCalCandidate}
              onSchedule={() => setCalibrationOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* ========================================================================
          DIALOGS
          ======================================================================== */}

      {/* 1. NEW / EDIT SCORECARD */}
      {(newSCOpen || editSC) && (
        <ScorecardDialog
          open
          onClose={() => {
            setNewSCOpen(false)
            setEditSC(null)
          }}
          initial={editSC}
          templates={templates}
          candidates={storeCandidates}
          jobs={storeJobs}
          seedScorecards={scorecards}
          onSave={handleSaveScorecard}
        />
      )}

      {/* 2 & 3. NEW / EDIT TEMPLATE */}
      {(newTplOpen || editTpl) && (
        <TemplateDialog
          open
          onClose={() => {
            setNewTplOpen(false)
            setEditTpl(null)
          }}
          initial={editTpl}
          onSave={handleSaveTemplate}
        />
      )}

      {/* 4. DUPLICATE TEMPLATE */}
      {dupTpl && (
        <DuplicateTemplateDialog
          tpl={dupTpl}
          onClose={() => setDupTpl(null)}
          onConfirm={(name) => handleDuplicateTemplate(dupTpl, name)}
        />
      )}

      {/* 5. COMPARE CANDIDATES */}
      {compareOpen && (
        <CompareDialog
          open
          onClose={() => setCompareOpen(false)}
          candidateGroups={candidateGroups}
          templates={templates}
          scorecards={scorecards}
          initialSelection={
            selectedIds.length
              ? Array.from(
                  new Set(
                    scorecards
                      .filter((s) => selectedIds.includes(s.id))
                      .map((s) => s.candidateId)
                  )
                )
              : []
          }
          onExport={() => {
            toast({ title: "Comparison exported" })
            setCompareOpen(false)
          }}
        />
      )}

      {/* 6. HIRE DECISION */}
      {hireDecision && (
        <HireDecisionDialog
          open
          data={hireDecision}
          scorecards={scorecards.filter((s) => s.candidateId === hireDecision.candidateId)}
          onClose={() => setHireDecision(null)}
          onConfirm={(decision, alsoMove, notes) => {
            toast({
              title: `Decision: ${decision}`,
              description: notes ? notes.slice(0, 80) : hireDecision.candidateName,
            })
            if (alsoMove && decision === "Recommend") {
              moveCandidateStage(hireDecision.candidateId, "Offer")
            }
            setHireDecision(null)
          }}
        />
      )}

      {/* 7. VIEW SCORECARD DETAIL */}
      {viewSC && (
        <ViewScorecardDialog
          sc={viewSC}
          templates={templates}
          onClose={() => setViewSC(null)}
          onEdit={() => {
            setEditSC(viewSC)
            setViewSC(null)
          }}
        />
      )}

      {/* 8. EXPORT */}
      {exportOpen && (
        <Dialog open onOpenChange={() => setExportOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Export Scorecards</DialogTitle>
              <DialogDescription>
                {selectedIds.length
                  ? `Export ${selectedIds.length} selected scorecard(s)`
                  : `Export ${filteredScorecards.length} currently visible scorecard(s)`}
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              A single HTML document will be downloaded containing a formatted table of candidate
              evaluations suitable for printing or PDF export.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExportOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleExport}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download HTML
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 9. SCHEDULE CALIBRATION */}
      {calibrationOpen && (
        <Dialog open onOpenChange={() => setCalibrationOpen(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Calibration Session</DialogTitle>
              <DialogDescription>
                Align interviewers on rating definitions and close rating gaps.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-[11px] uppercase tracking-wider">Session Name</Label>
                <Input defaultValue="Q2 Calibration - Engineering" />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-wider">Date & Time</Label>
                <Input type="datetime-local" />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-wider">Notes</Label>
                <Textarea placeholder="Focus areas..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCalibrationOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700"
                onClick={() => {
                  toast({
                    title: "Calibration scheduled",
                    description: "Invites will be sent to panel members.",
                  })
                  setCalibrationOpen(false)
                }}
              >
                Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 10. DELETE CONFIRM */}
      {deleteTarget && (
        <Dialog open onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Delete {deleteTarget.kind === "scorecard" ? "Scorecard(s)" : "Template"}?
              </DialogTitle>
              <DialogDescription>
                {deleteTarget.ids.length > 1
                  ? `${deleteTarget.ids.length} ${deleteTarget.kind}s will be permanently removed.`
                  : `This ${deleteTarget.kind} will be permanently removed.`}{" "}
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>Deleting evaluation data may impact calibration reports and audit trails.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

/* =========================================================================
   STAT CARD
   ========================================================================= */

const StatCard: React.FC<{
  icon: React.ReactNode
  tone: "violet" | "blue" | "emerald" | "amber" | "rose"
  label: string
  value: string
  helper: string
}> = ({ icon, tone, label, value, helper }) => {
  const tones: Record<string, string> = {
    violet: "bg-violet-500/10 text-violet-600",
    blue: "bg-blue-500/10 text-blue-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    amber: "bg-amber-500/10 text-amber-600",
    rose: "bg-rose-500/10 text-rose-600",
  }
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{helper}</div>
        </div>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", tones[tone])}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

/* =========================================================================
   CANDIDATE SUMMARY CARD
   ========================================================================= */

interface CandidateGroup {
  candidateId: string
  name: string
  position: string
  jobId: string
  cards: Scorecard[]
  avg: number
  strongH: number
  h: number
  nh: number
  strongNh: number
  gap: number
}

const CandidateSummaryCard: React.FC<{
  group: CandidateGroup
  onHireDecision: () => void
  onView: (id: string) => void
  onExport: () => void
}> = ({ group, onHireDecision, onView, onExport }) => {
  const total = group.cards.length
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100)
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{group.name}</h3>
            {group.gap > 2 && (
              <Badge
                variant="outline"
                className="gap-1 border-rose-200 bg-rose-50 text-[10px] uppercase tracking-wider text-rose-700"
              >
                <AlertTriangle className="h-3 w-3" />
                Calibration Gap
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{group.position}</p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-400 tabular-nums">
            {total} evaluation{total === 1 ? "" : "s"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Weighted Avg
          </div>
          <div className={cn("text-2xl font-semibold tabular-nums", scoreBand(group.avg, "1-5"))}>
            {group.avg.toFixed(2)}
          </div>
          <StarDisplay value={group.avg} />
        </div>
      </div>

      {/* Stacked recommendation bar */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Recommendations
          </span>
          <span className="text-[10px] text-slate-400 tabular-nums">{total}</span>
        </div>
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          {group.strongH > 0 && (
            <div
              className="bg-emerald-500"
              style={{ width: `${pct(group.strongH)}%` }}
              title={`Strong Hire: ${group.strongH}`}
            />
          )}
          {group.h > 0 && (
            <div
              className="bg-blue-500"
              style={{ width: `${pct(group.h)}%` }}
              title={`Hire: ${group.h}`}
            />
          )}
          {group.nh > 0 && (
            <div
              className="bg-amber-500"
              style={{ width: `${pct(group.nh)}%` }}
              title={`No Hire: ${group.nh}`}
            />
          )}
          {group.strongNh > 0 && (
            <div
              className="bg-rose-500"
              style={{ width: `${pct(group.strongNh)}%` }}
              title={`Strong No Hire: ${group.strongNh}`}
            />
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
          <LegendDot color="bg-emerald-500" label={`${group.strongH} Strong Hire`} />
          <LegendDot color="bg-blue-500" label={`${group.h} Hire`} />
          <LegendDot color="bg-amber-500" label={`${group.nh} No Hire`} />
          <LegendDot color="bg-rose-500" label={`${group.strongNh} Strong No Hire`} />
        </div>
      </div>

      {/* Round-by-round table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-100">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Round
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Interviewer
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Score
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Rec
              </th>
            </tr>
          </thead>
          <tbody>
            {group.cards.map((c) => (
              <tr
                key={c.id}
                className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                onClick={() => onView(c.id)}
              >
                <td className="px-3 py-2 text-slate-700">{c.round}</td>
                <td className="px-3 py-2 text-slate-600">{c.interviewerName}</td>
                <td className="px-3 py-2 text-right">
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      scoreBand(c.weightedOverall, c.scale)
                    )}
                  >
                    {c.weightedOverall.toFixed(2)}
                  </span>
                  <span className="text-slate-400 tabular-nums"> / {c.scale === "1-5" ? 5 : 10}</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] uppercase tracking-wider", recTone(c.recommendation))}
                  >
                    {c.recommendation}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {group.gap > 2 && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Interviewers show a rating gap of <strong className="tabular-nums">{group.gap}</strong>{" "}
            points on at least one criterion. A calibration session is recommended.
          </span>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button
          size="sm"
          className="bg-violet-600 text-white hover:bg-violet-700"
          onClick={onHireDecision}
        >
          <Award className="mr-1.5 h-3.5 w-3.5" /> Hire Decision
        </Button>
        <Button size="sm" variant="outline" onClick={onExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" /> Export
        </Button>
      </div>
    </Card>
  )
}

const LegendDot: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <span className={cn("h-2 w-2 rounded-full", color)} />
    <span className="tabular-nums">{label}</span>
  </div>
)

/* =========================================================================
   TEMPLATE CARD
   ========================================================================= */

const TemplateCard: React.FC<{
  tpl: Template
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  onToggleActive: () => void
}> = ({ tpl, onEdit, onDuplicate, onDelete, onToggleActive }) => {
  const weightTotal = tpl.criteria.reduce((s, c) => s + c.weight, 0)
  const roundTypeTone: Record<RoundType, string> = {
    HR: "bg-blue-50 text-blue-700 border-blue-200",
    Technical: "bg-violet-50 text-violet-700 border-violet-200",
    Managerial: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Final: "bg-amber-50 text-amber-700 border-amber-200",
    Custom: "bg-slate-50 text-slate-700 border-slate-200",
  }

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{tpl.name}</h3>
            {!tpl.active && (
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                Inactive
              </Badge>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-[10px] uppercase tracking-wider", roundTypeTone[tpl.roundType])}
            >
              {tpl.roundType}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-700"
            >
              Scale {tpl.scale}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleActive}>
              {tpl.active ? (
                <>
                  <XCircle className="mr-2 h-3.5 w-3.5" /> Deactivate
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Set Active
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600 focus:text-rose-700" onClick={onDelete}>
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {tpl.description && (
        <p className="mt-2 text-xs text-slate-500">{tpl.description}</p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Criteria
          </div>
          <div className="mt-1 text-lg font-semibold tabular-nums text-slate-900">
            {tpl.criteria.length}
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Weight Total
          </div>
          <div
            className={cn(
              "mt-1 text-lg font-semibold tabular-nums",
              weightTotal === 100 ? "text-emerald-600" : "text-amber-600"
            )}
          >
            {weightTotal}%
          </div>
        </div>
      </div>

      <ul className="mt-3 space-y-1.5">
        {tpl.criteria.slice(0, 4).map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-1.5 text-xs"
          >
            <span className="text-slate-700">{c.name}</span>
            <span className="font-medium text-slate-500 tabular-nums">{c.weight}%</span>
          </li>
        ))}
        {tpl.criteria.length > 4 && (
          <li className="text-center text-[11px] text-slate-400 tabular-nums">
            +{tpl.criteria.length - 4} more
          </li>
        )}
      </ul>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 tabular-nums">
        <span>Created {formatDate(tpl.createdAt)}</span>
      </div>
    </Card>
  )
}

/* =========================================================================
   CALIBRATION VIEW
   ========================================================================= */

const CalibrationView: React.FC<{
  candidateGroups: CandidateGroup[]
  scorecards: Scorecard[]
  templates: Template[]
  selected: string
  onSelect: (id: string) => void
  onSchedule: () => void
}> = ({ candidateGroups, scorecards, templates, selected, onSelect, onSchedule }) => {
  const group = candidateGroups.find((g) => g.candidateId === selected) || candidateGroups[0]

  if (!group) {
    return (
      <Card className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">No data for calibration analysis.</p>
      </Card>
    )
  }

  // Build criterion × interviewer matrix across all scorecards for this candidate
  const interviewers = Array.from(new Set(group.cards.map((c) => c.interviewerName)))
  const critMap = new Map<string, { name: string; scale: RatingScale; byInterviewer: Map<string, number> }>()

  group.cards.forEach((c) => {
    const tpl = templates.find((t) => t.id === c.templateId)
    c.ratings.forEach((r) => {
      const crit = tpl?.criteria.find((x) => x.id === r.criterionId)
      if (!crit) return
      if (!critMap.has(crit.id)) {
        critMap.set(crit.id, {
          name: crit.name,
          scale: c.scale,
          byInterviewer: new Map(),
        })
      }
      critMap.get(crit.id)!.byInterviewer.set(c.interviewerName, r.score)
    })
  })

  const critRows = Array.from(critMap.entries())

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Scale className="h-4 w-4 text-violet-600" />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Interviewer Calibration Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Spot divergence between panel members on the same criterion
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selected} onValueChange={onSelect}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {candidateGroups.map((g) => (
                  <SelectItem key={g.candidateId} value={g.candidateId}>
                    {g.name} - {g.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={onSchedule}>
              <Scale className="mr-1.5 h-3.5 w-3.5" /> Schedule Session
            </Button>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Criterion
                </th>
                {interviewers.map((iv) => (
                  <th
                    key={iv}
                    className="px-4 py-3 text-center text-[10px] font-medium uppercase tracking-wider text-slate-500"
                  >
                    {iv}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-slate-500">
                  Gap
                </th>
              </tr>
            </thead>
            <tbody>
              {critRows.map(([critId, data]) => {
                const scores = Array.from(data.byInterviewer.values())
                const gap = scores.length > 1 ? Math.max(...scores) - Math.min(...scores) : 0
                const critical = data.scale === "1-5" && gap > 2
                return (
                  <tr key={critId} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-slate-700">{data.name}</td>
                    {interviewers.map((iv) => {
                      const score = data.byInterviewer.get(iv)
                      return (
                        <td key={iv} className="px-4 py-3 text-center">
                          {score !== undefined ? (
                            <span
                              className={cn(
                                "inline-flex h-8 w-10 items-center justify-center rounded-lg text-sm font-semibold tabular-nums",
                                critical
                                  ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                                  : scoreBand(score, data.scale) + " bg-slate-50"
                              )}
                            >
                              {score}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">-</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-4 py-3 text-right">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase tracking-wider tabular-nums",
                          critical
                            ? "border-rose-200 bg-rose-50 text-rose-700"
                            : gap > 1
                              ? "border-amber-200 bg-amber-50 text-amber-700"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        )}
                      >
                        {gap} pts
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-900">Summary</h4>
            <p className="mt-1 text-xs text-slate-500">
              {critRows.filter(([, d]) => {
                const scores = Array.from(d.byInterviewer.values())
                return (
                  scores.length > 1 &&
                  d.scale === "1-5" &&
                  Math.max(...scores) - Math.min(...scores) > 2
                )
              }).length}{" "}
              criterion(s) show a significant gap for {group.name}. Consider a live panel
              calibration to align on rubric definitions.
            </p>
          </div>
          <Button
            size="sm"
            className="bg-violet-600 text-white hover:bg-violet-700"
            onClick={onSchedule}
          >
            Schedule
          </Button>
        </div>
      </Card>
    </div>
  )
}

/* =========================================================================
   DIALOG: NEW / EDIT SCORECARD (3 steps)
   ========================================================================= */

const ScorecardDialog: React.FC<{
  open: boolean
  onClose: () => void
  initial: Scorecard | null
  templates: Template[]
  candidates: { id: string; firstName: string; lastName: string; jobId: string }[]
  jobs: { id: string; title: string }[]
  seedScorecards: Scorecard[]
  onSave: (sc: Scorecard) => void
}> = ({ open, onClose, initial, templates, candidates, jobs, seedScorecards, onSave }) => {
  const [step, setStep] = useState(1)

  // Step 1: candidate + round + interviewer
  const [candidateId, setCandidateId] = useState(initial?.candidateId || "")
  const [candidateName, setCandidateName] = useState(initial?.candidateName || "")
  const [jobId, setJobId] = useState(initial?.jobId || "")
  const [position, setPosition] = useState(initial?.position || "")
  const [round, setRound] = useState(initial?.round || "")
  const [interviewerName, setInterviewerName] = useState(initial?.interviewerName || "")
  const [templateId, setTemplateId] = useState(initial?.templateId || templates[0]?.id || "")

  const template = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId]
  )
  const scale: RatingScale = template?.scale || initial?.scale || "1-5"
  const maxScore = scale === "1-5" ? 5 : 10

  // Step 2: ratings + notes
  const [ratings, setRatings] = useState<Rating[]>(
    initial?.ratings ||
      (template?.criteria.map((c) => ({ criterionId: c.id, score: 0 })) || [])
  )
  const [criterionNotes, setCriterionNotes] = useState<Record<string, string>>(
    initial?.criterionNotes || {}
  )

  // Step 3: recommendation + notes
  const [recommendation, setRecommendation] = useState<ScorecardRec>(
    initial?.recommendation || "Hire"
  )
  const [notes, setNotes] = useState(initial?.notes || "")

  // Sync ratings when template changes
  React.useEffect(() => {
    if (!template) return
    setRatings((prev) => {
      const next = template.criteria.map((c) => {
        const existing = prev.find((r) => r.criterionId === c.id)
        return existing || { criterionId: c.id, score: 0 }
      })
      return next
    })
  }, [template])

  // When candidate changes, auto-fill position from jobs/store
  const selectableCandidates = useMemo(() => {
    const fromStore = candidates.map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      jobId: c.jobId,
    }))
    const fromSeed = Array.from(
      new Map(
        seedScorecards.map((s) => [
          s.candidateId,
          { id: s.candidateId, name: s.candidateName, jobId: s.jobId },
        ])
      ).values()
    )
    const merged = new Map<string, { id: string; name: string; jobId: string }>()
    ;[...fromStore, ...fromSeed].forEach((c) => merged.set(c.id, c))
    return Array.from(merged.values())
  }, [candidates, seedScorecards])

  const resolvedPosition = (cid: string, jid: string) => {
    const seed = seedScorecards.find((s) => s.candidateId === cid)
    if (seed) return seed.position
    const job = jobs.find((j) => j.id === jid)
    return job?.title || ""
  }

  const handleCandidateChange = (cid: string) => {
    const cand = selectableCandidates.find((c) => c.id === cid)
    if (cand) {
      setCandidateId(cand.id)
      setCandidateName(cand.name)
      setJobId(cand.jobId)
      setPosition(resolvedPosition(cand.id, cand.jobId))
    }
  }

  const runningScore = useMemo(() => {
    if (!template) return 0
    return weightedScore(ratings, template.criteria)
  }, [ratings, template])

  const ratingsComplete = ratings.every((r) => r.score > 0)

  const handleSave = () => {
    if (!template || !candidateId || !round || !interviewerName) return
    const sc: Scorecard = {
      id: initial?.id || `SC-${Date.now()}`,
      candidateId,
      candidateName,
      jobId,
      position,
      round,
      interviewerId: initial?.interviewerId || `IV-${Date.now()}`,
      interviewerName,
      templateId,
      scale,
      ratings,
      weightedOverall: runningScore,
      recommendation,
      notes,
      criterionNotes,
      submittedAt: initial?.submittedAt || new Date().toISOString(),
      version: initial?.version || 1,
    }
    onSave(sc)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Scorecard" : "New Scorecard"}</DialogTitle>
          <DialogDescription>
            Structured evaluation with weighted scoring and calibrated recommendation.
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="mb-4 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <React.Fragment key={n}>
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium tabular-nums",
                  step === n
                    ? "border-violet-500 bg-violet-500 text-white"
                    : step > n
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-slate-200 bg-white text-slate-500"
                )}
              >
                {step > n ? <CheckCircle2 className="h-3.5 w-3.5" /> : n}
              </div>
              <div className="text-xs">
                {n === 1 && <span className={cn(step >= 1 ? "font-medium text-slate-900" : "text-slate-500")}>Candidate & Round</span>}
                {n === 2 && <span className={cn(step >= 2 ? "font-medium text-slate-900" : "text-slate-500")}>Ratings</span>}
                {n === 3 && <span className={cn(step >= 3 ? "font-medium text-slate-900" : "text-slate-500")}>Decision</span>}
              </div>
              {n < 3 && <div className="flex-1 border-t border-dashed border-slate-200" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="text-[11px] uppercase tracking-wider">Candidate</Label>
              <Select value={candidateId} onValueChange={handleCandidateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {selectableCandidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] uppercase tracking-wider">Position (auto)</Label>
                <Input value={position} readOnly className="bg-slate-50" />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-wider">Template</Label>
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} ({t.scale})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[11px] uppercase tracking-wider">Round</Label>
                <Input
                  placeholder="e.g. Technical Round 1"
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-wider">Interviewer Name</Label>
                <Input
                  placeholder="Your name"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && template && (
          <div className="space-y-4">
            <div className="sticky top-0 -mx-1 flex items-center justify-between rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-violet-700">
                  Live Weighted Score
                </div>
                <div className="text-2xl font-semibold tabular-nums text-violet-900">
                  {runningScore.toFixed(2)}{" "}
                  <span className="text-sm text-violet-600">/ {maxScore}</span>
                </div>
              </div>
              <div className="text-right text-xs text-violet-700">
                <div className="tabular-nums">
                  {ratings.filter((r) => r.score > 0).length} / {ratings.length} rated
                </div>
                <div>Scale {scale}</div>
              </div>
            </div>

            <div className="space-y-3">
              {template.criteria.map((c) => {
                const r = ratings.find((x) => x.criterionId === c.id)
                return (
                  <div
                    key={c.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{c.name}</span>
                          <Badge
                            variant="outline"
                            className="border-slate-200 text-[10px] uppercase tracking-wider tabular-nums"
                          >
                            {c.weight}%
                          </Badge>
                        </div>
                        {c.helperText && (
                          <p className="mt-0.5 text-xs text-slate-500">{c.helperText}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        {scale === "1-5" ? (
                          <StarInput
                            value={r?.score || 0}
                            onChange={(v) =>
                              setRatings((prev) =>
                                prev.map((x) =>
                                  x.criterionId === c.id ? { ...x, score: v } : x
                                )
                              )
                            }
                          />
                        ) : (
                          <NumericScaleInput
                            value={r?.score || 0}
                            onChange={(v) =>
                              setRatings((prev) =>
                                prev.map((x) =>
                                  x.criterionId === c.id ? { ...x, score: v } : x
                                )
                              )
                            }
                            max={10}
                          />
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label className="text-[10px] uppercase tracking-wider text-slate-500">
                        Notes (optional)
                      </Label>
                      <Textarea
                        rows={2}
                        placeholder="Specific observations for this criterion..."
                        value={criterionNotes[c.id] || ""}
                        onChange={(e) =>
                          setCriterionNotes((p) => ({ ...p, [c.id]: e.target.value }))
                        }
                        className="mt-1 text-xs"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Final Weighted Score
              </div>
              <div className={cn("mt-1 text-3xl font-semibold tabular-nums", scoreBand(runningScore, scale))}>
                {runningScore.toFixed(2)}
                <span className="ml-1 text-sm text-slate-400">/ {maxScore}</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={cn("h-full", scoreBgBand(runningScore, scale))}
                  style={{ width: `${(runningScore / maxScore) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <Label className="text-[11px] uppercase tracking-wider">Recommendation</Label>
              <RadioGroup
                value={recommendation}
                onValueChange={(v) => setRecommendation(v as ScorecardRec)}
                className="mt-2 grid grid-cols-2 gap-2"
              >
                {(["Strong Hire", "Hire", "No Hire", "Strong No Hire"] as ScorecardRec[]).map(
                  (rec) => (
                    <label
                      key={rec}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors",
                        recommendation === rec
                          ? "border-violet-500 bg-violet-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <RadioGroupItem value={rec} id={`rec-${rec}`} />
                      <div className="flex items-center gap-1.5">
                        {recIcon(rec)}
                        <span className="font-medium">{rec}</span>
                      </div>
                    </label>
                  )
                )}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-[11px] uppercase tracking-wider">Overall Notes</Label>
              <Textarea
                rows={4}
                placeholder="Summary of the evaluation, strengths, concerns..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <div className="flex w-full items-center justify-between">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && (!candidateId || !round || !interviewerName)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={handleSave}
                  disabled={!ratingsComplete}
                >
                  <FileCheck className="mr-1.5 h-3.5 w-3.5" /> Save Scorecard
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* =========================================================================
   DIALOG: TEMPLATE (New / Edit)
   ========================================================================= */

const TemplateDialog: React.FC<{
  open: boolean
  onClose: () => void
  initial: Template | null
  onSave: (tpl: Template) => void
}> = ({ open, onClose, initial, onSave }) => {
  const [name, setName] = useState(initial?.name || "")
  const [roundType, setRoundType] = useState<RoundType>(initial?.roundType || "Custom")
  const [scale, setScale] = useState<RatingScale>(initial?.scale || "1-5")
  const [description, setDescription] = useState(initial?.description || "")
  const [active, setActive] = useState(initial?.active ?? true)
  const [criteria, setCriteria] = useState<Criterion[]>(
    initial?.criteria || [
      { id: `C-${Date.now()}-1`, name: "Criterion 1", weight: 34 },
      { id: `C-${Date.now()}-2`, name: "Criterion 2", weight: 33 },
      { id: `C-${Date.now()}-3`, name: "Criterion 3", weight: 33 },
    ]
  )

  const weightTotal = criteria.reduce((s, c) => s + c.weight, 0)

  const addCriterion = () =>
    setCriteria((p) => [
      ...p,
      { id: `C-${Date.now()}`, name: `Criterion ${p.length + 1}`, weight: 0 },
    ])

  const removeCriterion = (id: string) =>
    setCriteria((p) => p.filter((c) => c.id !== id))

  const updateCriterion = (id: string, patch: Partial<Criterion>) =>
    setCriteria((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)))

  const handleSave = () => {
    if (!name || criteria.length === 0) return
    const tpl: Template = {
      id: initial?.id || `TPL-${Date.now()}`,
      name,
      roundType,
      scale,
      description,
      active,
      criteria,
      createdAt: initial?.createdAt || new Date().toISOString().slice(0, 10),
    }
    onSave(tpl)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Template" : "New Template"}</DialogTitle>
          <DialogDescription>
            Define criteria and weights. Total weight should sum to 100%.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] uppercase tracking-wider">Template Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Backend Engineering - Technical"
              />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider">Round Type</Label>
              <Select value={roundType} onValueChange={(v) => setRoundType(v as RoundType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["HR", "Technical", "Managerial", "Final", "Custom"] as RoundType[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <Label className="text-[11px] uppercase tracking-wider">Rating Scale</Label>
              <div className="mt-1.5 flex rounded-xl border border-slate-200 bg-white p-0.5">
                {(["1-5", "1-10"] as RatingScale[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScale(s)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors tabular-nums",
                      scale === s
                        ? "bg-violet-500 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider">Status</Label>
              <div className="mt-1.5 flex items-center gap-2">
                <Checkbox checked={active} onCheckedChange={(v) => setActive(v === true)} />
                <span className="text-sm text-slate-700">Active</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-[11px] uppercase tracking-wider">Description</Label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Purpose and intended use of this template..."
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-[11px] uppercase tracking-wider">Criteria</Label>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "text-xs font-medium tabular-nums",
                    weightTotal === 100 ? "text-emerald-600" : "text-amber-600"
                  )}
                >
                  Total: {weightTotal}%
                </div>
                <Button size="sm" variant="outline" onClick={addCriterion}>
                  <Plus className="mr-1 h-3 w-3" /> Add
                </Button>
              </div>
            </div>
            {weightTotal !== 100 && (
              <div className="mb-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
                <AlertTriangle className="h-3.5 w-3.5" />
                Weights must sum to exactly 100% (currently {weightTotal}%).
              </div>
            )}
            <div className="space-y-2">
              {criteria.map((c) => (
                <div
                  key={c.id}
                  className="grid grid-cols-[1fr,80px,auto] gap-2 rounded-xl border border-slate-200 bg-white p-2"
                >
                  <Input
                    value={c.name}
                    onChange={(e) => updateCriterion(c.id, { name: e.target.value })}
                    placeholder="Criterion name"
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={c.weight}
                    onChange={(e) => updateCriterion(c.id, { weight: Number(e.target.value) || 0 })}
                    className="text-right tabular-nums"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-rose-500"
                    onClick={() => removeCriterion(c.id)}
                    disabled={criteria.length <= 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700"
            onClick={handleSave}
            disabled={!name || criteria.length === 0}
          >
            <FileCheck className="mr-1.5 h-3.5 w-3.5" />
            {initial ? "Save Changes" : "Create Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* =========================================================================
   DIALOG: DUPLICATE TEMPLATE
   ========================================================================= */

const DuplicateTemplateDialog: React.FC<{
  tpl: Template
  onClose: () => void
  onConfirm: (name: string) => void
}> = ({ tpl, onClose, onConfirm }) => {
  const [name, setName] = useState(`${tpl.name} (Copy)`)
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Duplicate Template</DialogTitle>
          <DialogDescription>
            Create a copy of "{tpl.name}" with its criteria preserved.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label className="text-[11px] uppercase tracking-wider">New Template Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700"
            onClick={() => onConfirm(name)}
            disabled={!name}
          >
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Duplicate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* =========================================================================
   DIALOG: COMPARE CANDIDATES
   ========================================================================= */

const CompareDialog: React.FC<{
  open: boolean
  onClose: () => void
  candidateGroups: CandidateGroup[]
  templates: Template[]
  scorecards: Scorecard[]
  initialSelection: string[]
  onExport: () => void
}> = ({ open, onClose, candidateGroups, templates, scorecards, initialSelection, onExport }) => {
  const positions = useMemo(
    () => Array.from(new Set(candidateGroups.map((g) => g.position))),
    [candidateGroups]
  )
  const [positionFilter, setPositionFilter] = useState<string>("all")
  const [selection, setSelection] = useState<string[]>(initialSelection.slice(0, 4))

  const filteredGroups = useMemo(() => {
    return candidateGroups.filter(
      (g) => positionFilter === "all" || g.position === positionFilter
    )
  }, [candidateGroups, positionFilter])

  const toggle = (id: string) => {
    setSelection((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 4) return prev
      return [...prev, id]
    })
  }

  const selectedGroups = candidateGroups.filter((g) => selection.includes(g.candidateId))

  // Build criteria-wise average per candidate across their scorecards
  const allCriteria = useMemo(() => {
    const critMap = new Map<string, { id: string; name: string; scale: RatingScale }>()
    selectedGroups.forEach((g) => {
      g.cards.forEach((c) => {
        const tpl = templates.find((t) => t.id === c.templateId)
        tpl?.criteria.forEach((cr) => {
          if (!critMap.has(cr.name)) {
            critMap.set(cr.name, { id: cr.id, name: cr.name, scale: c.scale })
          }
        })
      })
    })
    return Array.from(critMap.values())
  }, [selectedGroups, templates])

  const cellValue = (candidateId: string, critName: string) => {
    const group = candidateGroups.find((g) => g.candidateId === candidateId)
    if (!group) return null
    const scores: { score: number; scale: RatingScale }[] = []
    group.cards.forEach((c) => {
      const tpl = templates.find((t) => t.id === c.templateId)
      c.ratings.forEach((r) => {
        const crit = tpl?.criteria.find((x) => x.id === r.criterionId)
        if (crit?.name === critName) scores.push({ score: r.score, scale: c.scale })
      })
    })
    if (scores.length === 0) return null
    // Normalize to 1-5 for comparison
    const normalized = scores.map((s) => (s.scale === "1-10" ? s.score / 2 : s.score))
    return normalized.reduce((a, b) => a + b, 0) / normalized.length
  }

  // Identify winner per criterion
  const winnerFor = (critName: string) => {
    let bestId: string | null = null
    let bestVal = -Infinity
    selectedGroups.forEach((g) => {
      const v = cellValue(g.candidateId, critName)
      if (v !== null && v > bestVal) {
        bestVal = v
        bestId = g.candidateId
      }
    })
    return bestId
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Candidates</DialogTitle>
          <DialogDescription>
            Select up to 4 candidates. Winner per criterion is highlighted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Label className="text-[11px] uppercase tracking-wider">Position</Label>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[260px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto text-xs text-slate-500 tabular-nums">
              {selection.length} / 4 selected
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {filteredGroups.map((g) => {
              const sel = selection.includes(g.candidateId)
              const disabled = !sel && selection.length >= 4
              return (
                <button
                  key={g.candidateId}
                  type="button"
                  onClick={() => !disabled && toggle(g.candidateId)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-colors",
                    sel
                      ? "border-violet-500 bg-violet-50"
                      : disabled
                        ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{g.name}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{g.position}</div>
                    </div>
                    {sel && <CheckCircle2 className="h-4 w-4 text-violet-600" />}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <StarDisplay value={g.avg} />
                    <span className={cn("text-sm font-semibold tabular-nums", scoreBand(g.avg, "1-5"))}>
                      {g.avg.toFixed(2)}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {selectedGroups.length >= 2 && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Criterion
                    </th>
                    {selectedGroups.map((g) => (
                      <th
                        key={g.candidateId}
                        className="px-4 py-3 text-center text-[10px] font-medium uppercase tracking-wider text-slate-500"
                      >
                        {g.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allCriteria.map((cr) => {
                    const winner = winnerFor(cr.name)
                    return (
                      <tr key={cr.name} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-sm font-medium text-slate-700">
                          {cr.name}
                        </td>
                        {selectedGroups.map((g) => {
                          const v = cellValue(g.candidateId, cr.name)
                          const isWinner = winner === g.candidateId
                          return (
                            <td key={g.candidateId} className="px-4 py-3 text-center">
                              {v !== null ? (
                                <div
                                  className={cn(
                                    "inline-flex items-center justify-center rounded-lg px-3 py-1 text-sm font-semibold tabular-nums",
                                    isWinner
                                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                      : "text-slate-700"
                                  )}
                                >
                                  {v.toFixed(2)}
                                  {isWinner && <Award className="ml-1 h-3 w-3" />}
                                </div>
                              ) : (
                                <span className="text-xs text-slate-300">-</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr className="border-t-2 border-slate-200 bg-slate-50">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                      Weighted Average
                    </td>
                    {selectedGroups.map((g) => (
                      <td key={g.candidateId} className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "text-base font-bold tabular-nums",
                            scoreBand(g.avg, "1-5")
                          )}
                        >
                          {g.avg.toFixed(2)}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700"
            onClick={onExport}
            disabled={selectedGroups.length < 2}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export Comparison
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* =========================================================================
   DIALOG: HIRE DECISION
   ========================================================================= */

const HireDecisionDialog: React.FC<{
  open: boolean
  data: { candidateId: string; candidateName: string }
  scorecards: Scorecard[]
  onClose: () => void
  onConfirm: (decision: "Recommend" | "Reject" | "Hold", alsoMove: boolean, notes: string) => void
}> = ({ open, data, scorecards, onClose, onConfirm }) => {
  const [decision, setDecision] = useState<"Recommend" | "Reject" | "Hold">("Recommend")
  const [alsoMove, setAlsoMove] = useState(true)
  const [notes, setNotes] = useState("")

  const weightedAvg = useMemo(() => {
    if (scorecards.length === 0) return 0
    const normalized = scorecards.map((s) =>
      s.scale === "1-10" ? s.weightedOverall / 2 : s.weightedOverall
    )
    return normalized.reduce((a, b) => a + b, 0) / normalized.length
  }, [scorecards])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hire Decision - {data.candidateName}</DialogTitle>
          <DialogDescription>
            Record the final outcome and optionally advance the candidate in the pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary strip */}
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-violet-700">
                  Aggregated Weighted Average
                </div>
                <div className="mt-1 text-3xl font-bold tabular-nums text-violet-900">
                  {weightedAvg.toFixed(2)}{" "}
                  <span className="text-sm text-violet-600">/ 5</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-medium uppercase tracking-wider text-violet-700">
                  Evaluations
                </div>
                <div className="mt-1 text-3xl font-bold tabular-nums text-violet-900">
                  {scorecards.length}
                </div>
              </div>
            </div>
          </div>

          {/* Per scorecard */}
          <div className="space-y-2">
            {scorecards.map((sc) => (
              <div
                key={sc.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900">{sc.round}</div>
                  <div className="text-[11px] text-slate-500">{sc.interviewerName}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-sm font-semibold tabular-nums",
                      scoreBand(sc.weightedOverall, sc.scale)
                    )}
                  >
                    {sc.weightedOverall.toFixed(2)}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] uppercase tracking-wider", recTone(sc.recommendation))}
                  >
                    {sc.recommendation}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Decision */}
          <div>
            <Label className="text-[11px] uppercase tracking-wider">Final Decision</Label>
            <RadioGroup
              value={decision}
              onValueChange={(v) => setDecision(v as "Recommend" | "Reject" | "Hold")}
              className="mt-2 grid grid-cols-3 gap-2"
            >
              {(
                [
                  { v: "Recommend", label: "Recommend", icon: <ThumbsUp className="h-3.5 w-3.5" />, tone: "emerald" },
                  { v: "Hold", label: "Hold", icon: <AlertTriangle className="h-3.5 w-3.5" />, tone: "amber" },
                  { v: "Reject", label: "Reject", icon: <ThumbsDown className="h-3.5 w-3.5" />, tone: "rose" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.v}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition-colors",
                    decision === opt.v
                      ? opt.tone === "emerald"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : opt.tone === "amber"
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  )}
                >
                  <RadioGroupItem value={opt.v} />
                  {opt.icon}
                  <span className="font-medium">{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-[11px] uppercase tracking-wider">Decision Notes</Label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Rationale, conditions, next steps..."
            />
          </div>

          {decision === "Recommend" && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <Checkbox checked={alsoMove} onCheckedChange={(v) => setAlsoMove(v === true)} />
              <div className="text-xs">
                <div className="font-medium text-emerald-800">
                  Also move to Offer stage
                </div>
                <div className="mt-0.5 text-emerald-700">
                  Candidate will advance in the hire pipeline via moveCandidateStage.
                </div>
              </div>
            </label>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700"
            onClick={() => onConfirm(decision, alsoMove, notes)}
          >
            <Award className="mr-1.5 h-3.5 w-3.5" /> Confirm Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* =========================================================================
   DIALOG: VIEW SCORECARD
   ========================================================================= */

const ViewScorecardDialog: React.FC<{
  sc: Scorecard
  templates: Template[]
  onClose: () => void
  onEdit: () => void
}> = ({ sc, templates, onClose, onEdit }) => {
  const template = templates.find((t) => t.id === sc.templateId)
  const maxScore = sc.scale === "1-5" ? 5 : 10

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sc.candidateName} - {sc.round}</DialogTitle>
          <DialogDescription>
            {sc.position} | Submitted by {sc.interviewerName} on {formatDate(sc.submittedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Weighted Overall
              </div>
              <div className={cn("mt-1 text-3xl font-bold tabular-nums", scoreBand(sc.weightedOverall, sc.scale))}>
                {sc.weightedOverall.toFixed(2)}
                <span className="ml-1 text-sm text-slate-400">/ {maxScore}</span>
              </div>
              {sc.scale === "1-5" && (
                <div className="mt-2">
                  <StarDisplay value={sc.weightedOverall} />
                </div>
              )}
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                Recommendation
              </div>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={cn(
                    "gap-1 border px-3 py-1 text-sm uppercase tracking-wider",
                    recTone(sc.recommendation)
                  )}
                >
                  {recIcon(sc.recommendation)}
                  {sc.recommendation}
                </Badge>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Template: {template?.name || sc.templateId}
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Criterion Ratings
            </h4>
            <div className="space-y-2">
              {(template?.criteria || []).map((c) => {
                const r = sc.ratings.find((x) => x.criterionId === c.id)
                const score = r?.score || 0
                return (
                  <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-slate-900">{c.name}</span>
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-slate-400 tabular-nums">
                          {c.weight}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {sc.scale === "1-5" ? (
                          <StarDisplay value={score} />
                        ) : (
                          <span className={cn("text-sm font-semibold tabular-nums", scoreBand(score, sc.scale))}>
                            {score} / {maxScore}
                          </span>
                        )}
                      </div>
                    </div>
                    {sc.criterionNotes[c.id] && (
                      <p className="mt-2 text-xs italic text-slate-600">
                        "{sc.criterionNotes[c.id]}"
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {sc.notes && (
            <div>
              <h4 className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Overall Notes
              </h4>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {sc.notes}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 tabular-nums">
            <span>Version {sc.version}</span>
            <span>{new Date(sc.submittedAt).toLocaleString()}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700" onClick={onEdit}>
            <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
