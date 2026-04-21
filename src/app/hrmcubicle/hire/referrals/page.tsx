"use client"

import React, { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Gift, Users, Trophy, Award, IndianRupee, Plus, Copy, Edit, Trash2, Eye,
  CheckCircle2, XCircle, Clock, Search, Filter, MoreHorizontal, Crown, Star,
  TrendingUp, Send, Mail, Phone, UserCheck, Download, Link as LinkIcon, X,
  Upload, FileText, Sparkles, ChevronRight, ArrowUpRight, AlertCircle,
  CalendarDays, Building2, Briefcase, Hash, MessageSquare, History,
  ShieldCheck, Info, HelpCircle, Zap, Target, PieChart, ListChecks, Banknote,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"
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
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/shared/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { useHireStore } from "@/shared/data/hire-store"

/* ───────────────────────── Types ───────────────────────── */

type ReferralStatus =
  | "Submitted"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected"
  | "Dropped"

type BonusStatus = "Pending" | "Approved" | "Paid" | "Cancelled"

type ReferralActivity = {
  id: string
  action: string
  timestamp: string
  performer: string
}

type Referral = {
  id: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  position: string
  jobId?: string
  referrerId: string
  referrerName: string
  referrerDept: string
  submittedDate: string
  status: ReferralStatus
  resumeUrl?: string
  notes: string
  bonus: number
  bonusStatus: BonusStatus
  bonusApprovedDate?: string
  bonusPaidDate?: string
  linkedCandidateId?: string
  expiryDate: string
  activity: ReferralActivity[]
}

type BonusRule = {
  id: string
  level: string
  amount: number
  description?: string
  keywords?: string[]
}

type PolicyDoc = {
  guidelines: string
  bullets: string[]
  eligibility: string[]
  timeline: string[]
  faq: { q: string; a: string }[]
}

const CURRENT_USER = {
  id: "EMP-001",
  name: "Aditya Singh",
  dept: "Engineering",
}

/* ───────────────────────── Seed data ───────────────────────── */

const TODAY = "2026-04-18"

const SEED_BONUS_RULES: BonusRule[] = [
  { id: "BR-1", level: "Intern / Junior", amount: 10000, description: "Up to 1 year experience, entry-level roles.", keywords: ["intern", "junior", "trainee", "associate"] },
  { id: "BR-2", level: "Mid-Level", amount: 15000, description: "1-4 years experience, individual contributor.", keywords: ["analyst", "mid", "engineer ii"] },
  { id: "BR-3", level: "Senior", amount: 25000, description: "5-8 years experience, senior IC or specialist.", keywords: ["senior", "sr.", "lead designer", "principal"] },
  { id: "BR-4", level: "Lead / Manager", amount: 40000, description: "People manager, tech lead, or staff IC.", keywords: ["lead", "manager", "head", "staff"] },
  { id: "BR-5", level: "Director+", amount: 75000, description: "Director, VP, or executive-level hires.", keywords: ["director", "vp", "chief", "cto", "cpo"] },
]

const addMonthsIso = (date: string, months: number) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d.toISOString().split("T")[0]
}

const SEED_REFERRALS: Referral[] = [
  {
    id: "REF-001",
    candidateName: "Vikram Joshi",
    candidateEmail: "vikram.joshi@mail.com",
    candidatePhone: "+91-9876543210",
    position: "Senior Frontend Engineer",
    referrerId: CURRENT_USER.id,
    referrerName: CURRENT_USER.name,
    referrerDept: CURRENT_USER.dept,
    submittedDate: "2026-03-15",
    status: "Interview",
    notes: "Strong React + Next.js fundamentals. Worked with us at previous company.",
    bonus: 25000,
    bonusStatus: "Pending",
    expiryDate: addMonthsIso("2026-03-15", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2026-03-15T09:10:00Z", performer: CURRENT_USER.name },
      { id: "A-2", action: "Moved to Screening", timestamp: "2026-03-17T14:00:00Z", performer: "Priya Sharma" },
      { id: "A-3", action: "Moved to Interview", timestamp: "2026-03-24T11:30:00Z", performer: "Priya Sharma" },
    ],
  },
  {
    id: "REF-002",
    candidateName: "Neha Kapoor",
    candidateEmail: "neha.kapoor@mail.com",
    candidatePhone: "+91-9876543211",
    position: "Product Designer",
    referrerId: "EMP-002",
    referrerName: "Priya Sharma",
    referrerDept: "Product",
    submittedDate: "2026-01-10",
    status: "Hired",
    notes: "Excellent portfolio; mentored by head of design previously.",
    bonus: 25000,
    bonusStatus: "Paid",
    bonusApprovedDate: "2026-02-20",
    bonusPaidDate: "2026-03-05",
    linkedCandidateId: "CAN-501",
    expiryDate: addMonthsIso("2026-01-10", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2026-01-10T09:00:00Z", performer: "Priya Sharma" },
      { id: "A-2", action: "Hired", timestamp: "2026-02-15T10:00:00Z", performer: "Sneha Patel" },
      { id: "A-3", action: "Bonus approved", timestamp: "2026-02-20T12:00:00Z", performer: "HR Director" },
      { id: "A-4", action: "Bonus paid", timestamp: "2026-03-05T09:00:00Z", performer: "Payroll" },
    ],
  },
  {
    id: "REF-003",
    candidateName: "Karan Malhotra",
    candidateEmail: "karan.m@mail.com",
    candidatePhone: "+91-9876543212",
    position: "Data Analyst",
    referrerId: CURRENT_USER.id,
    referrerName: CURRENT_USER.name,
    referrerDept: CURRENT_USER.dept,
    submittedDate: "2026-03-20",
    status: "Screening",
    notes: "Python + SQL expert, 3 years at Flipkart.",
    bonus: 15000,
    bonusStatus: "Pending",
    expiryDate: addMonthsIso("2026-03-20", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2026-03-20T10:00:00Z", performer: CURRENT_USER.name },
      { id: "A-2", action: "Moved to Screening", timestamp: "2026-03-22T09:30:00Z", performer: "Priya Sharma" },
    ],
  },
  {
    id: "REF-004",
    candidateName: "Simran Kaur",
    candidateEmail: "simran.k@mail.com",
    candidatePhone: "+91-9876543213",
    position: "DevOps Engineer",
    referrerId: "EMP-003",
    referrerName: "Rahul Verma",
    referrerDept: "Engineering",
    submittedDate: "2026-02-28",
    status: "Rejected",
    notes: "Didn't meet experience criteria for senior track.",
    bonus: 0,
    bonusStatus: "Cancelled",
    expiryDate: addMonthsIso("2026-02-28", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2026-02-28T08:00:00Z", performer: "Rahul Verma" },
      { id: "A-2", action: "Rejected — insufficient experience", timestamp: "2026-03-10T15:00:00Z", performer: "Tech Lead" },
    ],
  },
  {
    id: "REF-005",
    candidateName: "Amit Deshmukh",
    candidateEmail: "amit.d@mail.com",
    candidatePhone: "+91-9876543214",
    position: "HR Business Partner",
    referrerId: "EMP-004",
    referrerName: "Sneha Patel",
    referrerDept: "HR",
    submittedDate: "2026-03-05",
    status: "Offer",
    notes: "8 years HR experience. Offer sent, awaiting signature.",
    bonus: 25000,
    bonusStatus: "Approved",
    bonusApprovedDate: "2026-04-05",
    expiryDate: addMonthsIso("2026-03-05", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2026-03-05T10:00:00Z", performer: "Sneha Patel" },
      { id: "A-2", action: "Offer extended", timestamp: "2026-04-01T14:00:00Z", performer: "HR Director" },
      { id: "A-3", action: "Bonus approved", timestamp: "2026-04-05T11:00:00Z", performer: "HR Director" },
    ],
  },
  {
    id: "REF-006",
    candidateName: "Meera Nair",
    candidateEmail: "meera.n@mail.com",
    candidatePhone: "+91-9876543215",
    position: "Senior Frontend Engineer",
    referrerId: "EMP-005",
    referrerName: "Drashi Garg",
    referrerDept: "Engineering",
    submittedDate: "2026-03-18",
    status: "Interview",
    notes: "Strong Vue + React experience, looking to shift to SaaS.",
    bonus: 25000,
    bonusStatus: "Pending",
    expiryDate: addMonthsIso("2026-03-18", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2026-03-18T09:30:00Z", performer: "Drashi Garg" },
      { id: "A-2", action: "Moved to Interview", timestamp: "2026-03-26T10:00:00Z", performer: "Priya Sharma" },
    ],
  },
  {
    id: "REF-007",
    candidateName: "Ravi Teja",
    candidateEmail: "ravi.t@mail.com",
    candidatePhone: "+91-9876543216",
    position: "Marketing Intern",
    referrerId: "EMP-002",
    referrerName: "Priya Sharma",
    referrerDept: "Product",
    submittedDate: "2026-01-12",
    status: "Hired",
    notes: "Excellent communication; ran a popular tech podcast.",
    bonus: 10000,
    bonusStatus: "Paid",
    bonusApprovedDate: "2026-02-10",
    bonusPaidDate: "2026-02-18",
    expiryDate: addMonthsIso("2026-01-12", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2026-01-12T09:00:00Z", performer: "Priya Sharma" },
      { id: "A-2", action: "Hired", timestamp: "2026-02-05T10:00:00Z", performer: "Marketing Head" },
      { id: "A-3", action: "Bonus paid", timestamp: "2026-02-18T09:00:00Z", performer: "Payroll" },
    ],
  },
  {
    id: "REF-008",
    candidateName: "Ishita Ramesh",
    candidateEmail: "ishita.r@mail.com",
    candidatePhone: "+91-9876543217",
    position: "Engineering Manager",
    referrerId: CURRENT_USER.id,
    referrerName: CURRENT_USER.name,
    referrerDept: CURRENT_USER.dept,
    submittedDate: "2026-02-05",
    status: "Hired",
    notes: "Led 12-person platform team at previous company.",
    bonus: 40000,
    bonusStatus: "Approved",
    bonusApprovedDate: "2026-03-28",
    linkedCandidateId: "CAN-502",
    expiryDate: addMonthsIso("2026-02-05", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2026-02-05T09:00:00Z", performer: CURRENT_USER.name },
      { id: "A-2", action: "Hired", timestamp: "2026-03-22T10:00:00Z", performer: "CTO" },
      { id: "A-3", action: "Bonus approved", timestamp: "2026-03-28T11:00:00Z", performer: "HR Director" },
    ],
  },
  {
    id: "REF-009",
    candidateName: "Tanvi Bhat",
    candidateEmail: "tanvi.b@mail.com",
    candidatePhone: "+91-9876543218",
    position: "Backend Engineer (Go)",
    referrerId: "EMP-003",
    referrerName: "Rahul Verma",
    referrerDept: "Engineering",
    submittedDate: "2026-04-02",
    status: "Submitted",
    notes: "Ex-Gojek, strong distributed systems background.",
    bonus: 15000,
    bonusStatus: "Pending",
    expiryDate: addMonthsIso("2026-04-02", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2026-04-02T11:30:00Z", performer: "Rahul Verma" },
    ],
  },
  {
    id: "REF-010",
    candidateName: "Ayaan Sheikh",
    candidateEmail: "ayaan.s@mail.com",
    candidatePhone: "+91-9876543219",
    position: "Product Designer",
    referrerId: "EMP-005",
    referrerName: "Drashi Garg",
    referrerDept: "Engineering",
    submittedDate: "2025-09-15",
    status: "Dropped",
    notes: "Candidate withdrew after first round — took another offer.",
    bonus: 0,
    bonusStatus: "Cancelled",
    expiryDate: addMonthsIso("2025-09-15", 6),
    activity: [
      { id: "A-1", action: "Referral submitted", timestamp: "2025-09-15T11:00:00Z", performer: "Drashi Garg" },
      { id: "A-2", action: "Candidate dropped", timestamp: "2025-10-02T12:00:00Z", performer: "Priya Sharma" },
    ],
  },
]

const SEED_POLICY: PolicyDoc = {
  guidelines: `Our referral programme rewards employees who help us find exceptional talent. Bonuses are paid after the referred candidate successfully completes 90 days of employment. Please only refer candidates you genuinely believe will be a strong fit — quality over quantity is how we build a great team.`,
  bullets: [
    "Referrals stay active for 6 months from the date of submission.",
    "Both full-time and contract-to-hire roles are eligible (unless flagged otherwise on the job).",
    "Bonus amount is determined by role seniority at the time of offer acceptance.",
    "If the same candidate is referred by multiple employees, the earliest referral wins.",
    "Referrals for direct reports or immediate family members are not eligible.",
    "Bonuses are taxable income and will be paid via payroll.",
  ],
  eligibility: [
    "Full-time employees who have completed probation (90 days).",
    "The referred candidate must not have an existing record in our ATS from the last 6 months.",
    "Managers may refer for roles outside their own reporting chain.",
  ],
  timeline: [
    "Day 0 — You submit the referral through this portal.",
    "Day 1-2 — Recruiting team reviews the profile and reaches out to the candidate.",
    "Day 3-30 — Candidate moves through screening, interviews, and offer.",
    "Offer accepted — Bonus is marked Approved in the system.",
    "Day 90 post-join — Bonus is released via payroll.",
  ],
  faq: [
    { q: "When do I get paid?", a: "Your bonus is released in the next payroll cycle after the referred candidate completes 90 days." },
    { q: "What if the candidate leaves before 90 days?", a: "The bonus is forfeit unless the candidate's exit was due to factors outside their control (company-side changes)." },
    { q: "Can I refer for roles that aren't posted?", a: "Yes — include a note about the intended role and our talent team will route it appropriately." },
    { q: "Is there a cap on how many referrals I can make?", a: "No cap. Refer as many high-quality candidates as you'd like." },
    { q: "Do I get credit if my referral is hired into a different role?", a: "Yes — as long as you referred them first and they are ultimately hired within 6 months." },
  ],
}

/* ───────────────────────── Helpers ───────────────────────── */

const fmtINR = (n: number) => `₹${n.toLocaleString("en-IN")}`
const fmtDate = (iso: string) => {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}
const fmtDateTime = (iso: string) => {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}
const initialsOf = (name: string) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()

const STATUS_STYLES: Record<ReferralStatus, { bg: string; fg: string; dot: string; label: string }> = {
  Submitted: { bg: "bg-blue-50", fg: "text-blue-700", dot: "bg-blue-500", label: "Submitted" },
  Screening: { bg: "bg-amber-50", fg: "text-amber-700", dot: "bg-amber-500", label: "Screening" },
  Interview: { bg: "bg-violet-50", fg: "text-violet-700", dot: "bg-violet-500", label: "Interview" },
  Offer: { bg: "bg-indigo-50", fg: "text-indigo-700", dot: "bg-indigo-500", label: "Offer" },
  Hired: { bg: "bg-emerald-50", fg: "text-emerald-700", dot: "bg-emerald-500", label: "Hired" },
  Rejected: { bg: "bg-rose-50", fg: "text-rose-700", dot: "bg-rose-500", label: "Rejected" },
  Dropped: { bg: "bg-slate-100", fg: "text-slate-600", dot: "bg-slate-400", label: "Dropped" },
}

const BONUS_STYLES: Record<BonusStatus, { bg: string; fg: string; label: string }> = {
  Pending: { bg: "bg-amber-50", fg: "text-amber-700", label: "Pending" },
  Approved: { bg: "bg-blue-50", fg: "text-blue-700", label: "Approved" },
  Paid: { bg: "bg-emerald-50", fg: "text-emerald-700", label: "Paid" },
  Cancelled: { bg: "bg-slate-100", fg: "text-slate-600", label: "Cancelled" },
}

const ACTIVE_STATUSES: ReferralStatus[] = ["Submitted", "Screening", "Interview", "Offer"]
const TERMINAL_STATUSES: ReferralStatus[] = ["Hired", "Rejected", "Dropped"]

const matchBonusRule = (position: string, rules: BonusRule[]): BonusRule => {
  const lower = position.toLowerCase()
  for (const r of rules) {
    if (r.keywords?.some((kw) => lower.includes(kw))) return r
  }
  return rules[1] ?? rules[0]
}

const isExpired = (r: Referral) =>
  r.status === "Submitted" && new Date(r.expiryDate) < new Date(TODAY)

/* ───────────────────────── Small UI primitives ───────────────────────── */

const StatusBadge: React.FC<{ status: ReferralStatus }> = ({ status }) => {
  const s = STATUS_STYLES[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        s.bg,
        s.fg,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  )
}

const BonusBadge: React.FC<{ status: BonusStatus; amount?: number }> = ({ status, amount }) => {
  const s = BONUS_STYLES[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide tabular-nums",
        s.bg,
        s.fg,
      )}
    >
      {s.label}
      {typeof amount === "number" && amount > 0 && (
        <span className="text-slate-400">•</span>
      )}
      {typeof amount === "number" && amount > 0 && <span>{fmtINR(amount)}</span>}
    </span>
  )
}

const Avatar: React.FC<{ name: string; size?: "sm" | "md" | "lg"; className?: string }> = ({
  name, size = "md", className,
}) => {
  const sizeClass = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs"
  const palette = [
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-blue-100 text-blue-700",
    "bg-indigo-100 text-indigo-700",
  ]
  const hash = Math.abs(name.split("").reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0))
  const color = palette[hash % palette.length]
  return (
    <div className={cn("flex items-center justify-center rounded-full font-bold shrink-0", sizeClass, color, className)}>
      {initialsOf(name)}
    </div>
  )
}

const StatCard: React.FC<{
  label: string
  value: string | number
  hint?: string
  icon: React.ElementType
  tone: "violet" | "amber" | "emerald" | "rose" | "blue" | "indigo"
}> = ({ label, value, hint, icon: Icon, tone }) => {
  const TONE_MAP = {
    violet: { ring: "ring-violet-100", iconBg: "bg-violet-100 text-violet-600", text: "text-violet-700" },
    amber: { ring: "ring-amber-100", iconBg: "bg-amber-100 text-amber-600", text: "text-amber-700" },
    emerald: { ring: "ring-emerald-100", iconBg: "bg-emerald-100 text-emerald-600", text: "text-emerald-700" },
    rose: { ring: "ring-rose-100", iconBg: "bg-rose-100 text-rose-600", text: "text-rose-700" },
    blue: { ring: "ring-blue-100", iconBg: "bg-blue-100 text-blue-600", text: "text-blue-700" },
    indigo: { ring: "ring-indigo-100", iconBg: "bg-indigo-100 text-indigo-600", text: "text-indigo-700" },
  }[tone]
  return (
    <Card className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm p-5 ring-1", TONE_MAP.ring)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className={cn("mt-2 text-2xl font-black tabular-nums", TONE_MAP.text)}>{value}</p>
          {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
        </div>
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", TONE_MAP.iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}

const EmptyState: React.FC<{ icon: React.ElementType; title: string; subtitle?: string; action?: React.ReactNode }> = ({
  icon: Icon, title, subtitle, action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-slate-400" />
    </div>
    <p className="text-sm font-bold text-slate-800">{title}</p>
    {subtitle && <p className="mt-1 text-xs text-slate-500 max-w-sm">{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
)

/* ───────────────────────── Main page ───────────────────────── */

const EmployeeReferralsPage: React.FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const jobs = useHireStore((s) => s.jobs)
  const candidates = useHireStore((s) => s.candidates)
  const addCandidate = useHireStore((s) => s.addCandidate)

  const [referrals, setReferrals] = useState<Referral[]>(SEED_REFERRALS)
  const [bonusRules, setBonusRules] = useState<BonusRule[]>(SEED_BONUS_RULES)
  const [policy, setPolicy] = useState<PolicyDoc>(SEED_POLICY)

  /* Filters */
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [bonusFilter, setBonusFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  /* Selection (admin) */
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  /* Leaderboard filter */
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<"quarter" | "year" | "all">("year")
  const [leaderboardSort, setLeaderboardSort] = useState<"total" | "hired" | "earned">("total")

  /* Dialog state */
  const [referOpen, setReferOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [bonusApproveOpen, setBonusApproveOpen] = useState(false)
  const [bonusPaidOpen, setBonusPaidOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteBulk, setDeleteBulk] = useState(false)

  const [activeReferral, setActiveReferral] = useState<Referral | null>(null)

  /* Refer form */
  const [referForm, setReferForm] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    position: "",
    jobId: "",
    notes: "",
    resumeName: "",
    resumeUrl: "",
  })
  const resumeInputRef = useRef<HTMLInputElement>(null)

  /* Edit form */
  const [editForm, setEditForm] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    position: "",
    jobId: "",
    notes: "",
  })

  /* Status update form */
  const [statusForm, setStatusForm] = useState<{
    status: ReferralStatus
    linkCandidateId: string
    rejectionReason: string
  }>({
    status: "Submitted",
    linkCandidateId: "",
    rejectionReason: "",
  })

  /* Bonus approve form */
  const [bonusForm, setBonusForm] = useState<{
    decision: "approve" | "reject"
    amount: number
    notes: string
  }>({ decision: "approve", amount: 0, notes: "" })

  /* Bonus paid form */
  const [paidForm, setPaidForm] = useState({
    paymentDate: TODAY,
    transactionRef: "",
    notes: "",
  })

  /* ───────────────────────── Aggregations (useMemo) ───────────────────────── */

  const myReferrals = useMemo(
    () => referrals.filter((r) => r.referrerId === CURRENT_USER.id),
    [referrals],
  )

  const stats = useMemo(() => {
    const total = referrals.length
    const active = referrals.filter((r) => ACTIVE_STATUSES.includes(r.status)).length
    const hired = referrals.filter((r) => r.status === "Hired").length
    const pendingPayout = referrals
      .filter((r) => r.bonusStatus === "Approved" || (r.status === "Hired" && r.bonusStatus === "Pending"))
      .reduce((acc, r) => acc + r.bonus, 0)
    const paidYtd = referrals
      .filter((r) => r.bonusStatus === "Paid" && r.bonusPaidDate && new Date(r.bonusPaidDate).getFullYear() === 2026)
      .reduce((acc, r) => acc + r.bonus, 0)
    return { total, active, hired, pendingPayout, paidYtd }
  }, [referrals])

  const filteredAll = useMemo(() => {
    return referrals.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false
      if (bonusFilter !== "all" && r.bonusStatus !== bonusFilter) return false
      if (dateFrom && new Date(r.submittedDate) < new Date(dateFrom)) return false
      if (dateTo && new Date(r.submittedDate) > new Date(dateTo)) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !r.candidateName.toLowerCase().includes(q) &&
          !r.position.toLowerCase().includes(q) &&
          !r.referrerName.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [referrals, search, statusFilter, bonusFilter, dateFrom, dateTo])

  const leaderboard = useMemo(() => {
    const withinPeriod = (dateIso: string) => {
      if (leaderboardPeriod === "all") return true
      const d = new Date(dateIso)
      const today = new Date(TODAY)
      if (leaderboardPeriod === "quarter") {
        const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
        return diff <= 92
      }
      return d.getFullYear() === today.getFullYear()
    }
    const acc: Record<string, { id: string; name: string; dept: string; total: number; hired: number; earned: number }> = {}
    referrals.forEach((r) => {
      if (!withinPeriod(r.submittedDate)) return
      if (!acc[r.referrerId]) {
        acc[r.referrerId] = { id: r.referrerId, name: r.referrerName, dept: r.referrerDept, total: 0, hired: 0, earned: 0 }
      }
      acc[r.referrerId].total += 1
      if (r.status === "Hired") acc[r.referrerId].hired += 1
      if (r.bonusStatus === "Paid") acc[r.referrerId].earned += r.bonus
    })
    const list = Object.values(acc)
    list.sort((a, b) => {
      if (leaderboardSort === "total") return b.total - a.total || b.hired - a.hired
      if (leaderboardSort === "hired") return b.hired - a.hired || b.total - a.total
      return b.earned - a.earned || b.hired - a.hired
    })
    return list
  }, [referrals, leaderboardPeriod, leaderboardSort])

  /* ───────────────────────── Handlers ───────────────────────── */

  const logActivity = (ref: Referral, action: string, performer = CURRENT_USER.name): Referral => ({
    ...ref,
    activity: [
      ...ref.activity,
      { id: `A-${Date.now()}`, action, timestamp: new Date().toISOString(), performer },
    ],
  })

  const handleResumeUpload = (file: File | undefined) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setReferForm((prev) => ({ ...prev, resumeName: file.name, resumeUrl: url }))
  }

  const openReferDialog = () => {
    setReferForm({
      candidateName: "", candidateEmail: "", candidatePhone: "",
      position: "", jobId: "", notes: "", resumeName: "", resumeUrl: "",
    })
    setReferOpen(true)
  }

  const handleSubmitReferral = () => {
    const { candidateName, candidateEmail, candidatePhone, position, jobId, notes, resumeUrl } = referForm
    if (!candidateName.trim() || !candidateEmail.trim() || !position.trim()) {
      toast({ title: "Missing fields", description: "Candidate name, email, and position are required.", variant: "destructive" })
      return
    }
    const today = TODAY
    const rule = matchBonusRule(position, bonusRules)
    const newRef: Referral = {
      id: `REF-${Date.now()}`,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      candidatePhone: candidatePhone.trim(),
      position: position.trim(),
      jobId: jobId || undefined,
      referrerId: CURRENT_USER.id,
      referrerName: CURRENT_USER.name,
      referrerDept: CURRENT_USER.dept,
      submittedDate: today,
      status: "Submitted",
      resumeUrl: resumeUrl || undefined,
      notes: notes.trim(),
      bonus: rule.amount,
      bonusStatus: "Pending",
      expiryDate: addMonthsIso(today, 6),
      activity: [
        { id: `A-${Date.now()}`, action: "Referral submitted", timestamp: new Date().toISOString(), performer: CURRENT_USER.name },
      ],
    }
    setReferrals((prev) => [newRef, ...prev])
    setReferOpen(false)
    toast({ title: "Referral submitted", description: `${candidateName} has been referred for ${position}.` })
  }

  const openEditDialog = (ref: Referral) => {
    setActiveReferral(ref)
    setEditForm({
      candidateName: ref.candidateName,
      candidateEmail: ref.candidateEmail,
      candidatePhone: ref.candidatePhone,
      position: ref.position,
      jobId: ref.jobId ?? "",
      notes: ref.notes,
    })
    setEditOpen(true)
  }

  const handleEditSubmit = () => {
    if (!activeReferral) return
    if (!editForm.candidateName.trim() || !editForm.candidateEmail.trim() || !editForm.position.trim()) {
      toast({ title: "Missing fields", description: "Candidate name, email and position are required.", variant: "destructive" })
      return
    }
    const rule = matchBonusRule(editForm.position, bonusRules)
    const updated: Referral = {
      ...activeReferral,
      ...editForm,
      bonus: rule.amount,
    }
    const logged = logActivity(updated, "Referral details edited")
    setReferrals((prev) => prev.map((r) => (r.id === activeReferral.id ? logged : r)))
    setEditOpen(false)
    toast({ title: "Referral updated", description: `${editForm.candidateName}'s details saved.` })
  }

  const openStatusDialog = (ref: Referral) => {
    setActiveReferral(ref)
    setStatusForm({
      status: ref.status,
      linkCandidateId: ref.linkedCandidateId ?? "",
      rejectionReason: "",
    })
    setStatusOpen(true)
  }

  const handleStatusUpdate = () => {
    if (!activeReferral) return
    const { status, linkCandidateId, rejectionReason } = statusForm
    let updated: Referral = { ...activeReferral, status }
    if (linkCandidateId) updated.linkedCandidateId = linkCandidateId
    if (status === "Hired" && updated.bonusStatus === "Pending") {
      updated.bonusStatus = "Pending"
    }
    if (status === "Rejected" || status === "Dropped") {
      if (updated.bonusStatus === "Pending") updated.bonusStatus = "Cancelled"
    }
    const actionLabel = status === "Rejected" && rejectionReason
      ? `Moved to ${status} — ${rejectionReason}`
      : `Moved to ${status}`
    updated = logActivity(updated, actionLabel)
    setReferrals((prev) => prev.map((r) => (r.id === activeReferral.id ? updated : r)))
    setStatusOpen(false)
    toast({ title: "Status updated", description: `${activeReferral.candidateName} → ${status}` })
  }

  const openBonusApprove = (ref: Referral) => {
    setActiveReferral(ref)
    setBonusForm({ decision: "approve", amount: ref.bonus, notes: "" })
    setBonusApproveOpen(true)
  }

  const handleBonusDecision = () => {
    if (!activeReferral) return
    const { decision, amount, notes } = bonusForm
    let updated: Referral
    if (decision === "approve") {
      updated = logActivity(
        { ...activeReferral, bonus: amount, bonusStatus: "Approved", bonusApprovedDate: TODAY },
        `Bonus approved — ${fmtINR(amount)}${notes ? ` (${notes})` : ""}`,
      )
    } else {
      updated = logActivity(
        { ...activeReferral, bonusStatus: "Cancelled" },
        `Bonus rejected${notes ? ` — ${notes}` : ""}`,
      )
    }
    setReferrals((prev) => prev.map((r) => (r.id === activeReferral.id ? updated : r)))
    setBonusApproveOpen(false)
    toast({ title: decision === "approve" ? "Bonus approved" : "Bonus rejected", description: activeReferral.candidateName })
  }

  const openMarkPaid = (ref: Referral) => {
    setActiveReferral(ref)
    setPaidForm({ paymentDate: TODAY, transactionRef: "", notes: "" })
    setBonusPaidOpen(true)
  }

  const handleMarkPaid = () => {
    if (!activeReferral) return
    const updated = logActivity(
      { ...activeReferral, bonusStatus: "Paid", bonusPaidDate: paidForm.paymentDate },
      `Bonus paid${paidForm.transactionRef ? ` (Ref: ${paidForm.transactionRef})` : ""}${paidForm.notes ? ` — ${paidForm.notes}` : ""}`,
    )
    setReferrals((prev) => prev.map((r) => (r.id === activeReferral.id ? updated : r)))
    setBonusPaidOpen(false)
    toast({ title: "Bonus marked as paid", description: `${fmtINR(activeReferral.bonus)} — ${activeReferral.referrerName}` })
  }

  const openDetail = (ref: Referral) => {
    setActiveReferral(ref)
    setDetailOpen(true)
  }

  const openDelete = (ref: Referral) => {
    setActiveReferral(ref)
    setDeleteBulk(false)
    setDeleteOpen(true)
  }

  const openDeleteBulk = () => {
    setDeleteBulk(true)
    setDeleteOpen(true)
  }

  const handleDelete = () => {
    if (deleteBulk) {
      setReferrals((prev) => prev.filter((r) => !selectedIds.includes(r.id)))
      toast({ title: "Referrals deleted", description: `${selectedIds.length} referrals removed.` })
      setSelectedIds([])
    } else if (activeReferral) {
      setReferrals((prev) => prev.filter((r) => r.id !== activeReferral.id))
      toast({ title: "Referral deleted", description: activeReferral.candidateName })
    }
    setDeleteOpen(false)
  }

  const handleLinkToCandidate = (ref: Referral) => {
    if (ref.linkedCandidateId) {
      router.push(`/hrmcubicle/hire/candidates?id=${ref.linkedCandidateId}`)
      return
    }
    const [firstName, ...rest] = ref.candidateName.split(" ")
    const jobId = ref.jobId ?? jobs[0]?.id ?? "JOB-NEW"
    addCandidate({
      jobId,
      firstName,
      lastName: rest.join(" "),
      email: ref.candidateEmail,
      phone: ref.candidatePhone,
      location: "",
      source: "Referral",
      resumeUrl: ref.resumeUrl,
    } as any)
    const latestId = `CAN-${Math.floor(Math.random() * 10000)}`
    const updated = logActivity(
      { ...ref, linkedCandidateId: latestId },
      "Linked to candidate pipeline",
    )
    setReferrals((prev) => prev.map((x) => (x.id === ref.id ? updated : x)))
    toast({ title: "Candidate linked", description: `${ref.candidateName} added to pipeline.` })
  }

  const handleBulkApprove = () => {
    let count = 0
    setReferrals((prev) =>
      prev.map((r) => {
        if (!selectedIds.includes(r.id)) return r
        if (r.bonusStatus !== "Pending") return r
        count++
        return logActivity(
          { ...r, bonusStatus: "Approved", bonusApprovedDate: TODAY },
          `Bulk bonus approved — ${fmtINR(r.bonus)}`,
        )
      }),
    )
    toast({ title: "Bonuses approved", description: `${count} referrals approved.` })
    setSelectedIds([])
  }

  const handleBulkMarkPaid = () => {
    let count = 0
    setReferrals((prev) =>
      prev.map((r) => {
        if (!selectedIds.includes(r.id)) return r
        if (r.bonusStatus !== "Approved") return r
        count++
        return logActivity(
          { ...r, bonusStatus: "Paid", bonusPaidDate: TODAY },
          `Bulk bonus marked paid`,
        )
      }),
    )
    toast({ title: "Bonuses marked paid", description: `${count} referrals settled.` })
    setSelectedIds([])
  }

  const handleExportCsv = () => {
    const header = ["ID", "Candidate", "Email", "Phone", "Position", "Referrer", "Dept", "Submitted", "Status", "Bonus", "Bonus Status", "Expiry"]
    const rows = referrals.map((r) => [
      r.id, r.candidateName, r.candidateEmail, r.candidatePhone, r.position,
      r.referrerName, r.referrerDept, r.submittedDate, r.status, r.bonus.toString(),
      r.bonusStatus, r.expiryDate,
    ])
    const csv = [header, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `referrals-${TODAY}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Exported", description: `${rows.length} referrals exported to CSV.` })
  }

  /* Bonus rule editing */
  const [ruleForm, setRuleForm] = useState<Partial<BonusRule>>({ level: "", amount: 0, description: "" })
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)

  const saveRule = () => {
    if (!ruleForm.level?.trim() || !ruleForm.amount) {
      toast({ title: "Invalid rule", description: "Level and amount are required.", variant: "destructive" })
      return
    }
    if (editingRuleId) {
      setBonusRules((prev) => prev.map((r) => (r.id === editingRuleId ? { ...r, ...ruleForm } as BonusRule : r)))
      toast({ title: "Rule updated" })
    } else {
      setBonusRules((prev) => [...prev, { id: `BR-${Date.now()}`, level: ruleForm.level!, amount: ruleForm.amount!, description: ruleForm.description } as BonusRule])
      toast({ title: "Rule added" })
    }
    setRuleForm({ level: "", amount: 0, description: "" })
    setEditingRuleId(null)
  }

  const deleteRule = (id: string) => {
    setBonusRules((prev) => prev.filter((r) => r.id !== id))
    toast({ title: "Rule removed" })
  }

  const startEditRule = (rule: BonusRule) => {
    setEditingRuleId(rule.id)
    setRuleForm({ level: rule.level, amount: rule.amount, description: rule.description })
  }

  /* ───────────────────────── Render ───────────────────────── */

  return (
    <div
      className="flex-1 p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar space-y-6 font-sans"
      style={{ zoom: "90%" }}
    >
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-violet-200">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Employee Referrals</h1>
            <p className="text-sm text-slate-500">
              Refer great candidates, track their journey, and earn rewards for successful hires.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl h-9 text-xs font-bold border-slate-200" onClick={handleExportCsv}>
            <Download className="mr-2 h-3.5 w-3.5" /> Export CSV
          </Button>
          <Button variant="outline" className="rounded-xl h-9 text-xs font-bold border-slate-200" onClick={() => setPolicyOpen(true)}>
            <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Referral Policy
          </Button>
          <Button
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl h-9 text-xs font-bold shadow-sm shadow-violet-200"
            onClick={openReferDialog}
          >
            <Plus className="mr-2 h-3.5 w-3.5" /> Refer Candidate
          </Button>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Referrals" value={stats.total} hint={`${myReferrals.length} are yours`} icon={Users} tone="violet" />
        <StatCard label="Active" value={stats.active} hint="Currently in pipeline" icon={Zap} tone="amber" />
        <StatCard label="Hired" value={stats.hired} hint="Successful placements" icon={UserCheck} tone="emerald" />
        <StatCard label="Pending Payout" value={fmtINR(stats.pendingPayout)} hint="Approved / awaiting" icon={Clock} tone="blue" />
        <StatCard label="Paid YTD" value={fmtINR(stats.paidYtd)} hint="Bonus paid this year" icon={IndianRupee} tone="indigo" />
      </div>

      {/* ─── Tabs ─── */}
      <Tabs defaultValue="my" className="flex-1">
        <TabsList className="bg-white border border-slate-200 rounded-xl p-1 mb-5 shadow-sm">
          <TabsTrigger
            value="my"
            className="rounded-lg text-[11px] font-bold px-4 py-1.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white uppercase tracking-wider"
          >
            My Referrals
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="rounded-lg text-[11px] font-bold px-4 py-1.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white uppercase tracking-wider"
          >
            All Referrals (Admin)
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="rounded-lg text-[11px] font-bold px-4 py-1.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white uppercase tracking-wider"
          >
            Leaderboard
          </TabsTrigger>
          <TabsTrigger
            value="policy"
            className="rounded-lg text-[11px] font-bold px-4 py-1.5 data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white uppercase tracking-wider"
          >
            Policy & Rewards
          </TabsTrigger>
        </TabsList>

        {/* ═════════════════════════ MY REFERRALS ═════════════════════════ */}
        <TabsContent value="my" className="space-y-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">My Referrals</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {myReferrals.length} referral{myReferrals.length !== 1 ? "s" : ""} · {myReferrals.filter((r) => r.status === "Hired").length} hired
                </p>
              </div>
              <Button
                size="sm"
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-bold"
                onClick={openReferDialog}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> New Referral
              </Button>
            </div>

            {myReferrals.length === 0 ? (
              <EmptyState
                icon={Gift}
                title="No referrals yet"
                subtitle="Refer someone great and earn a bonus when they join. Click 'New Referral' to get started."
                action={
                  <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-bold" onClick={openReferDialog}>
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Refer Someone
                  </Button>
                }
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Position</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Submitted</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bonus</TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myReferrals.map((r) => (
                    <TableRow key={r.id} className="hover:bg-violet-50/30 cursor-pointer" onClick={() => openDetail(r)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={r.candidateName} size="sm" />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{r.candidateName}</p>
                            <p className="text-[11px] text-slate-500">{r.candidateEmail}</p>
                          </div>
                          {isExpired(r) && (
                            <Badge className="bg-rose-50 text-rose-700 text-[9px] font-bold rounded-full border border-rose-200">
                              EXPIRED
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-semibold text-slate-700">{r.position}</p>
                        <p className="text-[10px] text-slate-400">Bonus {fmtINR(r.bonus)}</p>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 tabular-nums">{fmtDate(r.submittedDate)}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell><BonusBadge status={r.bonusStatus} amount={r.bonusStatus === "Paid" ? r.bonus : undefined} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-violet-100" onClick={() => openDetail(r)}>
                            <Eye className="h-3.5 w-3.5 text-slate-600" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-violet-100" onClick={() => openStatusDialog(r)}>
                            <TrendingUp className="h-3.5 w-3.5 text-slate-600" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-violet-100" onClick={() => handleLinkToCandidate(r)}>
                            <LinkIcon className="h-3.5 w-3.5 text-slate-600" />
                          </Button>
                          {r.status === "Submitted" && (
                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-violet-100" onClick={() => openEditDialog(r)}>
                              <Edit className="h-3.5 w-3.5 text-slate-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>

          {/* Quick stats strip for "my" */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Hires</p>
              <p className="text-xl font-black text-emerald-700 tabular-nums mt-1">{myReferrals.filter((r) => r.status === "Hired").length}</p>
            </Card>
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Pipeline</p>
              <p className="text-xl font-black text-violet-700 tabular-nums mt-1">{myReferrals.filter((r) => ACTIVE_STATUSES.includes(r.status)).length}</p>
            </Card>
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Earnings (Paid)</p>
              <p className="text-xl font-black text-indigo-700 tabular-nums mt-1">
                {fmtINR(myReferrals.filter((r) => r.bonusStatus === "Paid").reduce((a, r) => a + r.bonus, 0))}
              </p>
            </Card>
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Pending</p>
              <p className="text-xl font-black text-amber-700 tabular-nums mt-1">
                {fmtINR(myReferrals.filter((r) => r.bonusStatus === "Pending" || r.bonusStatus === "Approved").reduce((a, r) => a + r.bonus, 0))}
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* ═════════════════════════ ALL REFERRALS (ADMIN) ═════════════════════════ */}
        <TabsContent value="all" className="space-y-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by candidate, position, or referrer…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-xl h-9 text-xs"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 rounded-xl h-9 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {(Object.keys(STATUS_STYLES) as ReferralStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={bonusFilter} onValueChange={setBonusFilter}>
                <SelectTrigger className="w-36 rounded-xl h-9 text-xs">
                  <SelectValue placeholder="Bonus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All bonus</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-36 rounded-xl h-9 text-xs"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-36 rounded-xl h-9 text-xs"
              />
              {(search || statusFilter !== "all" || bonusFilter !== "all" || dateFrom || dateTo) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl h-9 text-xs font-bold text-slate-500"
                  onClick={() => {
                    setSearch(""); setStatusFilter("all"); setBonusFilter("all"); setDateFrom(""); setDateTo("")
                  }}
                >
                  <X className="mr-1 h-3.5 w-3.5" /> Clear
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-10">
                    <Checkbox
                      checked={filteredAll.length > 0 && selectedIds.length === filteredAll.length}
                      onCheckedChange={(v) => setSelectedIds(v ? filteredAll.map((r) => r.id) : [])}
                    />
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Position</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Referrer</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Submitted</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bonus</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAll.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <EmptyState icon={Search} title="No referrals match" subtitle="Try adjusting your filters or clearing the search." />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAll.map((r) => (
                    <TableRow
                      key={r.id}
                      className={cn("hover:bg-violet-50/30 cursor-pointer", selectedIds.includes(r.id) && "bg-violet-50/50")}
                      onClick={() => openDetail(r)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedIds.includes(r.id)}
                          onCheckedChange={(v) =>
                            setSelectedIds((prev) => (v ? [...prev, r.id] : prev.filter((id) => id !== r.id)))
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={r.candidateName} size="sm" />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{r.candidateName}</p>
                            <p className="text-[11px] text-slate-500">{r.candidateEmail}</p>
                          </div>
                          {isExpired(r) && (
                            <Badge className="bg-rose-50 text-rose-700 text-[9px] font-bold rounded-full border border-rose-200">
                              EXPIRED
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-semibold text-slate-700">{r.position}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name={r.referrerName} size="sm" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{r.referrerName}</p>
                            <p className="text-[10px] text-slate-400">{r.referrerDept}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 tabular-nums">{fmtDate(r.submittedDate)}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-slate-800 tabular-nums">{fmtINR(r.bonus)}</span>
                          <BonusBadge status={r.bonusStatus} />
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-violet-100" onClick={() => openDetail(r)}>
                            <Eye className="h-3.5 w-3.5 text-slate-600" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-violet-100" onClick={() => openStatusDialog(r)}>
                            <TrendingUp className="h-3.5 w-3.5 text-slate-600" />
                          </Button>
                          {r.bonusStatus === "Pending" && (
                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-emerald-100" onClick={() => openBonusApprove(r)}>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            </Button>
                          )}
                          {r.bonusStatus === "Approved" && (
                            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-indigo-100" onClick={() => openMarkPaid(r)}>
                              <Banknote className="h-3.5 w-3.5 text-indigo-600" />
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-rose-100" onClick={() => openDelete(r)}>
                            <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Floating bulk action bar */}
          {selectedIds.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
              <div className="rounded-2xl bg-slate-900 text-white px-4 py-3 shadow-xl flex items-center gap-3">
                <span className="text-xs font-bold">{selectedIds.length} selected</span>
                <div className="h-5 w-px bg-slate-700" />
                <Button size="sm" variant="ghost" className="text-xs font-bold text-white hover:bg-slate-800 rounded-lg h-8" onClick={handleBulkApprove}>
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve bonus
                </Button>
                <Button size="sm" variant="ghost" className="text-xs font-bold text-white hover:bg-slate-800 rounded-lg h-8" onClick={handleBulkMarkPaid}>
                  <Banknote className="mr-1.5 h-3.5 w-3.5" /> Mark paid
                </Button>
                <Button size="sm" variant="ghost" className="text-xs font-bold text-rose-300 hover:bg-slate-800 rounded-lg h-8" onClick={openDeleteBulk}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
                <div className="h-5 w-px bg-slate-700" />
                <Button size="sm" variant="ghost" className="text-xs font-bold text-slate-300 hover:bg-slate-800 rounded-lg h-8" onClick={() => setSelectedIds([])}>
                  <X className="mr-1.5 h-3.5 w-3.5" /> Clear
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ═════════════════════════ LEADERBOARD ═════════════════════════ */}
        <TabsContent value="leaderboard" className="space-y-5">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Top Referrers</h3>
                <Badge className="bg-violet-50 text-violet-700 text-[10px] rounded-full border border-violet-200 font-bold">
                  {leaderboard.length} members
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Select value={leaderboardSort} onValueChange={(v) => setLeaderboardSort(v as any)}>
                  <SelectTrigger className="w-40 rounded-xl h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total referrals</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="earned">Bonus earned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={leaderboardPeriod} onValueChange={(v) => setLeaderboardPeriod(v as any)}>
                  <SelectTrigger className="w-36 rounded-xl h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Top 3 podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, idx) => {
                  const actualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3
                  const medalColor = actualRank === 1 ? "from-amber-300 to-amber-500" : actualRank === 2 ? "from-slate-300 to-slate-400" : "from-orange-300 to-orange-500"
                  const MedalIcon = actualRank === 1 ? Crown : Award
                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        "rounded-2xl p-5 text-center relative border shadow-sm",
                        actualRank === 1 ? "bg-gradient-to-b from-amber-50 to-white border-amber-200 md:scale-105" :
                          actualRank === 2 ? "bg-gradient-to-b from-slate-50 to-white border-slate-200" :
                            "bg-gradient-to-b from-orange-50 to-white border-orange-200",
                      )}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className={cn("h-8 w-8 rounded-full bg-gradient-to-br shadow flex items-center justify-center", medalColor)}>
                          <MedalIcon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <Avatar name={entry.name} size="lg" className="mx-auto mt-2" />
                      <p className="mt-3 text-sm font-black text-slate-900">{entry.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{entry.dept}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-base font-black tabular-nums text-violet-700">{entry.total}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider">Total</p>
                        </div>
                        <div>
                          <p className="text-base font-black tabular-nums text-emerald-700">{entry.hired}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider">Hired</p>
                        </div>
                        <div>
                          <p className="text-base font-black tabular-nums text-indigo-700">{fmtINR(entry.earned)}</p>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider">Earned</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Full grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {leaderboard.length === 0 ? (
                <div className="col-span-full">
                  <EmptyState icon={Trophy} title="No referrers yet" subtitle="Once referrals are made, top referrers appear here." />
                </div>
              ) : (
                leaderboard.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition flex items-center gap-4",
                      idx === 0 && "ring-2 ring-amber-200 border-amber-200",
                    )}
                  >
                    <div className="relative">
                      <Avatar name={entry.name} size="lg" />
                      <div
                        className={cn(
                          "absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black text-white",
                          idx === 0 ? "bg-amber-500" : idx === 1 ? "bg-slate-400" : idx === 2 ? "bg-orange-500" : "bg-violet-500",
                        )}
                      >
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{entry.name}</p>
                      <p className="text-[11px] text-slate-500">{entry.dept}</p>
                      <div className="mt-2 flex items-center gap-3 text-[10px]">
                        <span className="font-bold text-violet-700 tabular-nums">{entry.total} total</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-bold text-emerald-700 tabular-nums">{entry.hired} hired</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black tabular-nums text-indigo-700">{fmtINR(entry.earned)}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">Earned</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        {/* ═════════════════════════ POLICY & REWARDS ═════════════════════════ */}
        <TabsContent value="policy" className="space-y-5">
          {/* Bonus Rules */}
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Gift className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">Bonus Rules</h3>
                  <p className="text-xs text-slate-500">Configure bonus amounts by role seniority.</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                {bonusRules.length} rules
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bonusRules.map((rule) => (
                <div
                  key={rule.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex items-start justify-between gap-3 hover:border-violet-200 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900">{rule.level}</p>
                    {rule.description && <p className="text-[11px] text-slate-500 mt-0.5">{rule.description}</p>}
                    {rule.keywords && rule.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rule.keywords.slice(0, 4).map((kw) => (
                          <span key={kw} className="text-[9px] font-bold text-slate-500 bg-white border border-slate-200 rounded-full px-2 py-0.5">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-black text-[#8B5CF6] tabular-nums">{fmtINR(rule.amount)}</p>
                    <div className="flex gap-1 mt-2">
                      <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md hover:bg-violet-100" onClick={() => startEditRule(rule)}>
                        <Edit className="h-3 w-3 text-slate-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 rounded-md hover:bg-rose-100" onClick={() => deleteRule(rule.id)}>
                        <Trash2 className="h-3 w-3 text-rose-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rule editor */}
            <div className="mt-5 rounded-xl border-2 border-dashed border-slate-200 p-4 bg-white">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                {editingRuleId ? "Edit rule" : "Add new rule"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Level</Label>
                  <Input
                    value={ruleForm.level ?? ""}
                    onChange={(e) => setRuleForm((p) => ({ ...p, level: e.target.value }))}
                    placeholder="e.g. Senior"
                    className="rounded-xl h-9 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount (INR)</Label>
                  <Input
                    type="number"
                    value={ruleForm.amount ?? 0}
                    onChange={(e) => setRuleForm((p) => ({ ...p, amount: Number(e.target.value) }))}
                    placeholder="25000"
                    className="rounded-xl h-9 text-xs mt-1 tabular-nums"
                  />
                </div>
                <div>
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                  <Input
                    value={ruleForm.description ?? ""}
                    onChange={(e) => setRuleForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Optional context"
                    className="rounded-xl h-9 text-xs mt-1"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                {editingRuleId && (
                  <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => { setEditingRuleId(null); setRuleForm({ level: "", amount: 0, description: "" }) }}>
                    Cancel
                  </Button>
                )}
                <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl h-9 text-xs font-bold" onClick={saveRule}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> {editingRuleId ? "Update rule" : "Add rule"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Policy text */}
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Policy Guidelines</h3>
                <p className="text-xs text-slate-500">High-level rules everyone should know.</p>
              </div>
            </div>

            <Textarea
              value={policy.guidelines}
              onChange={(e) => setPolicy((p) => ({ ...p, guidelines: e.target.value }))}
              rows={4}
              className="rounded-xl text-xs"
            />

            <div className="mt-5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Bullet Points</p>
              <ul className="space-y-2">
                {policy.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Eligibility & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Eligibility</h3>
              </div>
              <ul className="space-y-2">
                {policy.eligibility.map((e, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
                    <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black flex items-center justify-center shrink-0 tabular-nums">
                      {i + 1}
                    </span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Timeline</h3>
              </div>
              <ul className="space-y-3">
                {policy.timeline.map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ════════════════════════  DIALOGS  ═════════════════════════════ */}
      {/* ═════════════════════════════════════════════════════════════════ */}

      {/* 1. Refer Candidate Dialog */}
      <Dialog open={referOpen} onOpenChange={setReferOpen}>
        <DialogContent className="max-w-xl rounded-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] p-5 text-white">
            <DialogHeader>
              <DialogTitle className="text-base font-black tracking-tight flex items-center gap-2">
                <Gift className="h-5 w-5" /> Refer a Candidate
              </DialogTitle>
              <DialogDescription className="text-violet-100 text-xs">
                Submit a great candidate — earn a bonus when they join.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate Name *</Label>
              <Input
                value={referForm.candidateName}
                onChange={(e) => setReferForm((p) => ({ ...p, candidateName: e.target.value }))}
                placeholder="Full name"
                className="rounded-xl h-9 text-xs mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email *</Label>
                <Input
                  type="email"
                  value={referForm.candidateEmail}
                  onChange={(e) => setReferForm((p) => ({ ...p, candidateEmail: e.target.value }))}
                  placeholder="email@example.com"
                  className="rounded-xl h-9 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone</Label>
                <Input
                  value={referForm.candidatePhone}
                  onChange={(e) => setReferForm((p) => ({ ...p, candidatePhone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="rounded-xl h-9 text-xs mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Position *</Label>
              <Select
                value={referForm.jobId}
                onValueChange={(v) => {
                  const j = jobs.find((x) => x.id === v)
                  setReferForm((p) => ({ ...p, jobId: v, position: j?.title ?? p.position }))
                }}
              >
                <SelectTrigger className="rounded-xl h-9 text-xs mt-1">
                  <SelectValue placeholder="Select an open role…" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.title} <span className="text-slate-400 text-[10px]">· {j.department}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={referForm.position}
                onChange={(e) => setReferForm((p) => ({ ...p, position: e.target.value, jobId: "" }))}
                placeholder="Or type a custom role title"
                className="rounded-xl h-9 text-xs mt-2"
              />
              {referForm.position && (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-violet-700 bg-violet-50 rounded-lg px-3 py-1.5 border border-violet-100">
                  <Sparkles className="h-3 w-3" />
                  <span className="font-semibold">Estimated bonus:</span>
                  <span className="font-black tabular-nums">{fmtINR(matchBonusRule(referForm.position, bonusRules).amount)}</span>
                  <span className="text-violet-500">({matchBonusRule(referForm.position, bonusRules).level})</span>
                </div>
              )}
            </div>

            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resume Upload</Label>
              <div
                className="mt-1 border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-[#8B5CF6] transition cursor-pointer"
                onClick={() => resumeInputRef.current?.click()}
              >
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleResumeUpload(e.target.files?.[0])}
                />
                {referForm.resumeName ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-700">
                    <FileText className="h-4 w-4 text-violet-600" />
                    <span className="font-semibold">{referForm.resumeName}</span>
                    <button
                      className="text-rose-500 hover:text-rose-700"
                      onClick={(e) => { e.stopPropagation(); setReferForm((p) => ({ ...p, resumeName: "", resumeUrl: "" })) }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mx-auto text-slate-300 mb-1" />
                    <p className="text-[11px] text-slate-500 font-medium">
                      Drag & drop resume or <span className="text-[#8B5CF6] font-bold">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOC, DOCX — max 5MB</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notes</Label>
              <Textarea
                value={referForm.notes}
                onChange={(e) => setReferForm((p) => ({ ...p, notes: e.target.value }))}
                rows={3}
                placeholder="Why is this candidate a great fit? How do you know them?"
                className="rounded-xl text-xs mt-1 resize-none"
              />
            </div>

            <div className="rounded-xl bg-violet-50 border border-violet-100 p-3 flex items-start gap-2">
              <Info className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-violet-700 leading-relaxed">
                Referrals stay active for 6 months. Bonus is released via payroll after the candidate completes 90 days.
              </p>
            </div>
          </div>
          <DialogFooter className="p-5 border-t border-slate-100 bg-slate-50 gap-2">
            <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => setReferOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl h-9 text-xs font-bold" onClick={handleSubmitReferral}>
              <Send className="mr-1.5 h-3.5 w-3.5" /> Confirm Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Edit Referral Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-tight flex items-center gap-2">
              <Edit className="h-4 w-4 text-violet-600" /> Edit Referral
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Only referrals in 'Submitted' state can be edited.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Candidate Name</Label>
              <Input
                value={editForm.candidateName}
                onChange={(e) => setEditForm((p) => ({ ...p, candidateName: e.target.value }))}
                className="rounded-xl h-9 text-xs mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</Label>
                <Input
                  value={editForm.candidateEmail}
                  onChange={(e) => setEditForm((p) => ({ ...p, candidateEmail: e.target.value }))}
                  className="rounded-xl h-9 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone</Label>
                <Input
                  value={editForm.candidatePhone}
                  onChange={(e) => setEditForm((p) => ({ ...p, candidatePhone: e.target.value }))}
                  className="rounded-xl h-9 text-xs mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Position</Label>
              <Input
                value={editForm.position}
                onChange={(e) => setEditForm((p) => ({ ...p, position: e.target.value }))}
                className="rounded-xl h-9 text-xs mt-1"
              />
            </div>
            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notes</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                rows={3}
                className="rounded-xl text-xs mt-1 resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl h-9 text-xs font-bold" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. Update Status Dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-tight flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-600" /> Update Status
            </DialogTitle>
            {activeReferral && (
              <DialogDescription className="text-xs text-slate-500">
                {activeReferral.candidateName} — {activeReferral.position}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">New Status</Label>
              <RadioGroup
                value={statusForm.status}
                onValueChange={(v) => setStatusForm((p) => ({ ...p, status: v as ReferralStatus }))}
                className="grid grid-cols-2 gap-2"
              >
                {(Object.keys(STATUS_STYLES) as ReferralStatus[]).map((s) => {
                  const style = STATUS_STYLES[s]
                  const checked = statusForm.status === s
                  return (
                    <Label
                      key={s}
                      className={cn(
                        "rounded-xl border-2 p-2.5 flex items-center gap-2 cursor-pointer transition",
                        checked ? "border-[#8B5CF6] bg-violet-50" : "border-slate-200 hover:border-slate-300",
                      )}
                    >
                      <RadioGroupItem value={s} className="sr-only" />
                      <span className={cn("h-2 w-2 rounded-full", style.dot)} />
                      <span className="text-xs font-bold text-slate-800">{s}</span>
                    </Label>
                  )
                })}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Link to Candidate (optional)</Label>
              <Select
                value={statusForm.linkCandidateId}
                onValueChange={(v) => setStatusForm((p) => ({ ...p, linkCandidateId: v }))}
              >
                <SelectTrigger className="rounded-xl h-9 text-xs mt-1">
                  <SelectValue placeholder="Select a candidate record…" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} <span className="text-slate-400 text-[10px]">· {c.email}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(statusForm.status === "Rejected" || statusForm.status === "Dropped") && (
              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reason</Label>
                <Textarea
                  value={statusForm.rejectionReason}
                  onChange={(e) => setStatusForm((p) => ({ ...p, rejectionReason: e.target.value }))}
                  rows={2}
                  placeholder="Why was this candidate not moved forward?"
                  className="rounded-xl text-xs mt-1 resize-none"
                />
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => setStatusOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl h-9 text-xs font-bold" onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Approve / Reject Bonus Dialog */}
      <Dialog open={bonusApproveOpen} onOpenChange={setBonusApproveOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-tight flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" /> Approve / Reject Bonus
            </DialogTitle>
          </DialogHeader>
          {activeReferral && (
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div className="flex items-center gap-3">
                  <Avatar name={activeReferral.candidateName} size="md" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{activeReferral.candidateName}</p>
                    <p className="text-[11px] text-slate-500">{activeReferral.position}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-slate-400">Referred by</p>
                    <p className="font-bold text-slate-700">{activeReferral.referrerName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Current status</p>
                    <StatusBadge status={activeReferral.status} />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Decision</Label>
                <RadioGroup
                  value={bonusForm.decision}
                  onValueChange={(v) => setBonusForm((p) => ({ ...p, decision: v as "approve" | "reject" }))}
                  className="grid grid-cols-2 gap-2"
                >
                  <Label className={cn("rounded-xl border-2 p-3 flex items-center gap-2 cursor-pointer transition",
                    bonusForm.decision === "approve" ? "border-emerald-500 bg-emerald-50" : "border-slate-200")}>
                    <RadioGroupItem value="approve" className="sr-only" />
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Approve</span>
                  </Label>
                  <Label className={cn("rounded-xl border-2 p-3 flex items-center gap-2 cursor-pointer transition",
                    bonusForm.decision === "reject" ? "border-rose-500 bg-rose-50" : "border-slate-200")}>
                    <RadioGroupItem value="reject" className="sr-only" />
                    <XCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-xs font-bold text-slate-800">Reject</span>
                  </Label>
                </RadioGroup>
              </div>

              {bonusForm.decision === "approve" && (
                <div>
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Amount (INR)</Label>
                  <Input
                    type="number"
                    value={bonusForm.amount}
                    onChange={(e) => setBonusForm((p) => ({ ...p, amount: Number(e.target.value) }))}
                    className="rounded-xl h-9 text-xs mt-1 tabular-nums"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Suggested: {fmtINR(matchBonusRule(activeReferral.position, bonusRules).amount)} ({matchBonusRule(activeReferral.position, bonusRules).level})
                  </p>
                </div>
              )}

              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notes</Label>
                <Textarea
                  value={bonusForm.notes}
                  onChange={(e) => setBonusForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  placeholder="Internal notes (optional)"
                  className="rounded-xl text-xs mt-1 resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => setBonusApproveOpen(false)}>
              Cancel
            </Button>
            <Button
              className={cn(
                "rounded-xl h-9 text-xs font-bold text-white",
                bonusForm.decision === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700",
              )}
              onClick={handleBonusDecision}
            >
              {bonusForm.decision === "approve" ? "Approve Bonus" : "Reject Bonus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Mark Bonus Paid Dialog */}
      <Dialog open={bonusPaidOpen} onOpenChange={setBonusPaidOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-tight flex items-center gap-2">
              <Banknote className="h-4 w-4 text-indigo-600" /> Mark Bonus as Paid
            </DialogTitle>
          </DialogHeader>
          {activeReferral && (
            <div className="space-y-4">
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Amount to settle</p>
                  <p className="text-2xl font-black text-indigo-800 tabular-nums mt-0.5">{fmtINR(activeReferral.bonus)}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-indigo-300" />
              </div>

              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment Date *</Label>
                <Input
                  type="date"
                  value={paidForm.paymentDate}
                  onChange={(e) => setPaidForm((p) => ({ ...p, paymentDate: e.target.value }))}
                  className="rounded-xl h-9 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Transaction Reference</Label>
                <Input
                  value={paidForm.transactionRef}
                  onChange={(e) => setPaidForm((p) => ({ ...p, transactionRef: e.target.value }))}
                  placeholder="e.g. TXN-20260418-001"
                  className="rounded-xl h-9 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notes</Label>
                <Textarea
                  value={paidForm.notes}
                  onChange={(e) => setPaidForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  placeholder="Payroll batch / processing notes"
                  className="rounded-xl text-xs mt-1 resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => setBonusPaidOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-9 text-xs font-bold" onClick={handleMarkPaid}>
              <Banknote className="mr-1.5 h-3.5 w-3.5" /> Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Referral Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-y-auto">
          {activeReferral && (
            <>
              <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] p-5 text-white">
                <SheetHeader>
                  <SheetTitle className="text-white flex items-center gap-3">
                    <Avatar name={activeReferral.candidateName} size="lg" className="bg-white/20 text-white" />
                    <div className="text-left">
                      <p className="text-lg font-black tracking-tight">{activeReferral.candidateName}</p>
                      <p className="text-xs text-violet-100 font-medium">{activeReferral.position}</p>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="sr-only">Referral details and activity</SheetDescription>
                </SheetHeader>
                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge status={activeReferral.status} />
                  <BonusBadge status={activeReferral.bonusStatus} amount={activeReferral.bonus} />
                  {isExpired(activeReferral) && (
                    <Badge className="bg-rose-500 text-white text-[9px] font-bold rounded-full">EXPIRED</Badge>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Contact */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Contact</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <a href={`mailto:${activeReferral.candidateEmail}`} className="hover:text-violet-600">{activeReferral.candidateEmail}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <a href={`tel:${activeReferral.candidatePhone}`} className="hover:text-violet-600">{activeReferral.candidatePhone}</a>
                    </div>
                    {activeReferral.resumeUrl && (
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <a href={activeReferral.resumeUrl} target="_blank" rel="noreferrer" className="text-[#8B5CF6] hover:underline font-semibold">
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Referred by</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar name={activeReferral.referrerName} size="sm" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{activeReferral.referrerName}</p>
                        <p className="text-[10px] text-slate-500">{activeReferral.referrerDept}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Submitted</p>
                    <p className="text-xs font-bold text-slate-800 mt-1 tabular-nums">{fmtDate(activeReferral.submittedDate)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Bonus</p>
                    <p className="text-xs font-black text-violet-700 mt-1 tabular-nums">{fmtINR(activeReferral.bonus)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Expires</p>
                    <p className={cn("text-xs font-bold mt-1 tabular-nums", isExpired(activeReferral) ? "text-rose-700" : "text-slate-800")}>
                      {fmtDate(activeReferral.expiryDate)}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {activeReferral.notes && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</p>
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-slate-700 leading-relaxed">
                      {activeReferral.notes}
                    </div>
                  </div>
                )}

                {/* Linked candidate */}
                {activeReferral.linkedCandidateId ? (
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Linked Candidate</p>
                    <button
                      onClick={() => router.push(`/hrmcubicle/hire/candidates?id=${activeReferral.linkedCandidateId}`)}
                      className="w-full rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 p-3 flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-violet-600" />
                        <span className="text-xs font-bold text-violet-800">Open in pipeline</span>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-violet-600" />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl h-9 text-xs font-bold border-violet-200 text-violet-700 hover:bg-violet-50"
                    onClick={() => handleLinkToCandidate(activeReferral)}
                  >
                    <LinkIcon className="mr-1.5 h-3.5 w-3.5" /> Link to Candidate Pipeline
                  </Button>
                )}

                {/* Activity Timeline */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <History className="h-3 w-3" /> Activity Timeline
                  </p>
                  <div className="relative pl-5 border-l-2 border-slate-200 space-y-4">
                    {activeReferral.activity.slice().reverse().map((a) => (
                      <div key={a.id} className="relative">
                        <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-[#8B5CF6] ring-4 ring-violet-100" />
                        <p className="text-xs font-bold text-slate-800">{a.action}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {fmtDateTime(a.timestamp)} · by {a.performer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                  <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => { setDetailOpen(false); openStatusDialog(activeReferral) }}>
                    <TrendingUp className="mr-1.5 h-3.5 w-3.5" /> Update Status
                  </Button>
                  {activeReferral.bonusStatus === "Pending" && (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 text-xs font-bold" onClick={() => { setDetailOpen(false); openBonusApprove(activeReferral) }}>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve Bonus
                    </Button>
                  )}
                  {activeReferral.bonusStatus === "Approved" && (
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-9 text-xs font-bold" onClick={() => { setDetailOpen(false); openMarkPaid(activeReferral) }}>
                      <Banknote className="mr-1.5 h-3.5 w-3.5" /> Mark Paid
                    </Button>
                  )}
                  {activeReferral.status === "Submitted" && (
                    <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => { setDetailOpen(false); openEditDialog(activeReferral) }}>
                      <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </Button>
                  )}
                  <Button variant="outline" className="rounded-xl h-9 text-xs font-bold text-rose-700 border-rose-200 hover:bg-rose-50" onClick={() => { setDetailOpen(false); openDelete(activeReferral) }}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* 7. Referral Policy Dialog */}
      <Dialog open={policyOpen} onOpenChange={setPolicyOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] p-5 text-white">
            <DialogHeader>
              <DialogTitle className="text-base font-black tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Referral Policy & Rewards
              </DialogTitle>
              <DialogDescription className="text-violet-100 text-xs">
                Everything you need to know about our referral programme.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Bonus grid */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Gift className="h-3 w-3" /> Bonus Amounts
              </p>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Level</TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Bonus</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bonusRules.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs font-bold text-slate-800">{r.level}</TableCell>
                        <TableCell className="text-[11px] text-slate-600">{r.description}</TableCell>
                        <TableCell className="text-right text-sm font-black text-[#8B5CF6] tabular-nums">{fmtINR(r.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Eligibility */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="h-3 w-3" /> Eligibility
              </p>
              <ul className="space-y-2">
                {policy.eligibility.map((e, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CalendarDays className="h-3 w-3" /> Timeline
              </p>
              <ol className="space-y-2">
                {policy.timeline.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="h-5 w-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center shrink-0 tabular-nums">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* FAQ */}
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="h-3 w-3" /> FAQ
              </p>
              <div className="space-y-3">
                {policy.faq.map((f, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                    <p className="text-xs font-black text-slate-900">Q. {f.q}</p>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">A. {f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="p-5 border-t border-slate-100 bg-slate-50">
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl h-9 text-xs font-bold" onClick={() => setPolicyOpen(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-tight flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              {deleteBulk ? `Delete ${selectedIds.length} Referrals?` : "Delete Referral?"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 pt-2">
              {deleteBulk
                ? `You are about to permanently remove ${selectedIds.length} referrals. This cannot be undone.`
                : activeReferral
                  ? `This will permanently delete the referral for ${activeReferral.candidateName}. This cannot be undone.`
                  : "This cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-rose-50 border border-rose-100 p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Deleting a referral also removes its activity history. If a bonus was already paid, the payroll record is kept separately.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl h-9 text-xs font-bold" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-9 text-xs font-bold" onClick={handleDelete}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeeReferralsPage
