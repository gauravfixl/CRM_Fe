"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileSearch,
  Upload,
  Trash2,
  Eye,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  RefreshCw,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Award,
  GraduationCap,
  Briefcase,
  Languages,
  FileText,
  Users,
  Copy as CopyIcon,
  Zap,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  XCircle,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Slider } from "@/shared/components/ui/slider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/shared/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
  useHireStore,
  type ParsedResume,
  type ResumeParseStatus,
} from "@/shared/data/hire-store"

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_BULK_FILES = 5
const ACCEPTED_TYPES = [".pdf", ".docx", ".doc"]
const ACCEPTED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatRelativeDate(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHr = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)
    if (diffSec < 60) return "just now"
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffHr < 24) return `${diffHr}h ago`
    if (diffDay < 30) return `${diffDay}d ago`
    return d.toLocaleDateString()
  } catch {
    return iso
  }
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("")
}

function validateFile(file: File): { ok: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: `File exceeds 10 MB limit` }
  }
  const nameLower = file.name.toLowerCase()
  const extOk = ACCEPTED_TYPES.some((ext) => nameLower.endsWith(ext))
  const mimeOk = ACCEPTED_MIME.includes(file.type) || file.type === ""
  if (!extOk && !mimeOk) {
    return { ok: false, error: `Unsupported file type` }
  }
  return { ok: true }
}

const STATUS_STYLES: Record<
  ResumeParseStatus,
  { badge: string; label: string; dot: string }
> = {
  Processing: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    label: "Processing",
    dot: "bg-blue-500",
  },
  Parsed: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    label: "Parsed",
    dot: "bg-emerald-500",
  },
  Duplicate: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    label: "Duplicate",
    dot: "bg-amber-500",
  },
  Converted: {
    badge: "bg-slate-200 text-slate-700 border-slate-300",
    label: "Converted",
    dot: "bg-slate-500",
  },
  Failed: {
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    label: "Failed",
    dot: "bg-rose-500",
  },
}

function qualityTone(score: number): {
  bar: string
  text: string
  bg: string
} {
  if (score >= 80) {
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-600",
      bg: "bg-emerald-50",
    }
  }
  if (score >= 60) {
    return { bar: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" }
  }
  return { bar: "bg-rose-500", text: "text-rose-600", bg: "bg-rose-50" }
}

// Track an in-flight upload for progress UI
interface UploadTask {
  id: string
  fileName: string
  fileSize: number
  progress: number
  status: "pending" | "uploading" | "parsed" | "duplicate" | "failed"
  error?: string
  resumeId?: string
}

// ────────────────────────────────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────────────────────────────────

const ResumeParserPage = () => {
  const { toast } = useToast()

  // ── store ──
  const parsedResumes = useHireStore((s) => s.parsedResumes)
  const jobs = useHireStore((s) => s.jobs)
  const uploadResume = useHireStore((s) => s.uploadResume)
  const deleteParsedResume = useHireStore((s) => s.deleteParsedResume)
  const convertResumeToCandidate = useHireStore(
    (s) => s.convertResumeToCandidate
  )
  const bulkConvertResumesToPipeline = useHireStore(
    (s) => s.bulkConvertResumesToPipeline
  )
  const recomputeResumeMatchScores = useHireStore(
    (s) => s.recomputeResumeMatchScores
  )
  const clearAllResumes = useHireStore((s) => s.clearAllResumes)

  // ── local state ──
  const [activeTab, setActiveTab] = useState<
    "all" | "parsed" | "duplicates" | "converted" | "history"
  >("all")
  const [search, setSearch] = useState("")
  const [dragging, setDragging] = useState(false)
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([])
  const [bulkProgressOpen, setBulkProgressOpen] = useState(false)
  const [isBulkMode, setIsBulkMode] = useState(false)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [detailResume, setDetailResume] = useState<ParsedResume | null>(null)
  const [convertResume, setConvertResume] = useState<ParsedResume | null>(null)
  const [convertJobId, setConvertJobId] = useState<string>("")

  const [bulkConvertOpen, setBulkConvertOpen] = useState(false)
  const [bulkConvertJobId, setBulkConvertJobId] = useState<string>("")

  const [clearAllOpen, setClearAllOpen] = useState(false)
  const [duplicateResume, setDuplicateResume] = useState<ParsedResume | null>(
    null
  )

  // filters
  const [minQuality, setMinQuality] = useState<number>(0)
  const [skillFilter, setSkillFilter] = useState<Set<string>>(new Set())
  const [expMin, setExpMin] = useState<number>(0)
  const [expMax, setExpMax] = useState<number>(20)
  const [filterOpen, setFilterOpen] = useState(false)

  // history sort
  const [historySort, setHistorySort] = useState<{
    col: keyof ParsedResume | "skillsCount"
    dir: "asc" | "desc"
  }>({ col: "uploadedAt", dir: "desc" })

  // refs
  const singleInputRef = useRef<HTMLInputElement | null>(null)
  const bulkInputRef = useRef<HTMLInputElement | null>(null)
  const dropZoneRef = useRef<HTMLDivElement | null>(null)

  // ── derived ──
  const stats = useMemo(() => {
    const total = parsedResumes.length
    const converted = parsedResumes.filter(
      (r) => r.status === "Converted"
    ).length
    const duplicates = parsedResumes.filter(
      (r) => r.status === "Duplicate"
    ).length
    const avgQuality = total
      ? Math.round(
          parsedResumes.reduce((sum, r) => sum + r.qualityScore, 0) / total
        )
      : 0
    return { total, converted, duplicates, avgQuality }
  }, [parsedResumes])

  const allSkills = useMemo(() => {
    const set = new Set<string>()
    parsedResumes.forEach((r) => r.skills.forEach((s) => set.add(s)))
    return Array.from(set).sort()
  }, [parsedResumes])

  const maxExp = useMemo(() => {
    return Math.max(
      20,
      ...parsedResumes.map((r) => r.totalYearsOfExperience ?? 0)
    )
  }, [parsedResumes])

  // master filtered list (shared by all tabs except history)
  const filteredResumes = useMemo(() => {
    const q = search.trim().toLowerCase()
    return parsedResumes.filter((r) => {
      if (q) {
        const hit =
          r.fullName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.skills.some((s) => s.toLowerCase().includes(q))
        if (!hit) return false
      }
      if (r.qualityScore < minQuality) return false
      if (skillFilter.size > 0) {
        const hasAll = Array.from(skillFilter).every((sf) =>
          r.skills.some((s) => s.toLowerCase() === sf.toLowerCase())
        )
        if (!hasAll) return false
      }
      const yrs = r.totalYearsOfExperience ?? 0
      if (yrs < expMin || yrs > expMax) return false
      return true
    })
  }, [parsedResumes, search, minQuality, skillFilter, expMin, expMax])

  const tabResumes = useMemo(() => {
    switch (activeTab) {
      case "parsed":
        return filteredResumes.filter((r) => r.status === "Parsed")
      case "duplicates":
        return filteredResumes.filter((r) => r.status === "Duplicate")
      case "converted":
        return filteredResumes.filter((r) => r.status === "Converted")
      case "all":
      default:
        return filteredResumes
    }
  }, [filteredResumes, activeTab])

  const historyResumes = useMemo(() => {
    const list = [...filteredResumes]
    list.sort((a, b) => {
      const { col, dir } = historySort
      const mul = dir === "asc" ? 1 : -1
      let av: any
      let bv: any
      if (col === "skillsCount") {
        av = a.skills.length
        bv = b.skills.length
      } else {
        av = (a as any)[col]
        bv = (b as any)[col]
      }
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * mul
      return String(av ?? "").localeCompare(String(bv ?? "")) * mul
    })
    return list
  }, [filteredResumes, historySort])

  // Keep bulk selections in sync with current list
  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set<string>()
      parsedResumes.forEach((r) => {
        if (prev.has(r.id)) next.add(r.id)
      })
      return next
    })
  }, [parsedResumes])

  // ── handlers ──

  const runUpload = useCallback(
    async (files: File[], bulk: boolean) => {
      if (files.length === 0) return
      // Validate up-front
      const tasks: UploadTask[] = files.map((f) => {
        const v = validateFile(f)
        return {
          id: `TASK-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          fileName: f.name,
          fileSize: f.size,
          progress: 0,
          status: v.ok ? "pending" : "failed",
          error: v.error,
        }
      })
      setUploadTasks((prev) => [...tasks, ...prev])
      if (bulk) setBulkProgressOpen(true)

      for (const t of tasks) {
        if (t.status === "failed") continue
        // progress animation
        setUploadTasks((prev) =>
          prev.map((x) =>
            x.id === t.id ? { ...x, status: "uploading", progress: 15 } : x
          )
        )
        const bump = window.setInterval(() => {
          setUploadTasks((prev) =>
            prev.map((x) =>
              x.id === t.id && x.progress < 85
                ? { ...x, progress: x.progress + 10 }
                : x
            )
          )
        }, 80)
        try {
          const file = files.find((f) => f.name === t.fileName)!
          const result = await uploadResume(
            {
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type || "application/octet-stream",
            },
            "HR Manager"
          )
          window.clearInterval(bump)
          setUploadTasks((prev) =>
            prev.map((x) =>
              x.id === t.id
                ? {
                    ...x,
                    progress: 100,
                    status: result.status === "Duplicate" ? "duplicate" : "parsed",
                    resumeId: result.id,
                  }
                : x
            )
          )
        } catch (err) {
          window.clearInterval(bump)
          setUploadTasks((prev) =>
            prev.map((x) =>
              x.id === t.id
                ? {
                    ...x,
                    progress: 100,
                    status: "failed",
                    error: "Parse failed",
                  }
                : x
            )
          )
        }
      }

      const okCount = tasks.filter((t) => t.status !== "failed").length
      const failCount = tasks.length - okCount
      if (!bulk) {
        toast({
          title: okCount > 0 ? "Resume parsed" : "Upload failed",
          description:
            okCount > 0
              ? `Successfully extracted candidate data.`
              : tasks[0]?.error ?? "Could not process file.",
        })
      } else {
        toast({
          title: "Bulk upload complete",
          description: `${okCount} parsed · ${failCount} failed`,
        })
      }
    },
    [uploadResume, toast]
  )

  const handleSingleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    runUpload(files.slice(0, 1), false)
    e.target.value = "" // reset
  }

  const handleBulkSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    if (files.length > MAX_BULK_FILES) {
      toast({
        title: "Too many files",
        description: `Max ${MAX_BULK_FILES} files per bulk upload.`,
        variant: "destructive",
      })
      return
    }
    runUpload(files, true)
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files ?? [])
    if (files.length === 0) return
    if (files.length > MAX_BULK_FILES) {
      toast({
        title: "Too many files",
        description: `Max ${MAX_BULK_FILES} files at once.`,
        variant: "destructive",
      })
      return
    }
    runUpload(files, files.length > 1)
  }

  const openSingleDialog = () => singleInputRef.current?.click()
  const openBulkDialog = () => bulkInputRef.current?.click()

  const handleDelete = (id: string) => {
    deleteParsedResume(id)
    setSelectedIds((prev) => {
      const n = new Set(prev)
      n.delete(id)
      return n
    })
    toast({ title: "Resume removed" })
  }

  const doConvertSingle = () => {
    if (!convertResume || !convertJobId) return
    const { candidateId } = convertResumeToCandidate(
      convertResume.id,
      convertJobId
    )
    toast({
      title: "Added to pipeline",
      description: `Candidate ${candidateId} created.`,
    })
    setConvertResume(null)
    setConvertJobId("")
  }

  const doBulkConvert = () => {
    if (!bulkConvertJobId || selectedIds.size === 0) return
    const { converted } = bulkConvertResumesToPipeline(
      Array.from(selectedIds),
      bulkConvertJobId
    )
    toast({
      title: `${converted} candidate${converted === 1 ? "" : "s"} created`,
      description: "Selected resumes moved to pipeline.",
    })
    setBulkConvertOpen(false)
    setBulkConvertJobId("")
    setSelectedIds(new Set())
    setIsBulkMode(false)
  }

  const doBulkDelete = () => {
    selectedIds.forEach((id) => deleteParsedResume(id))
    toast({
      title: `${selectedIds.size} resume${selectedIds.size === 1 ? "" : "s"} deleted`,
    })
    setSelectedIds(new Set())
    setIsBulkMode(false)
  }

  const doClearAll = () => {
    clearAllResumes()
    setSelectedIds(new Set())
    setClearAllOpen(false)
    toast({ title: "All resumes cleared" })
  }

  const doRecompute = () => {
    recomputeResumeMatchScores()
    toast({
      title: "Match scores recomputed",
      description: "All resumes re-scored against active jobs.",
    })
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const selectAllVisible = () => {
    setSelectedIds((prev) => {
      const n = new Set(prev)
      tabResumes.forEach((r) => n.add(r.id))
      return n
    })
  }

  const clearSelection = () => setSelectedIds(new Set())

  const toggleSkillFilter = (skill: string) => {
    setSkillFilter((prev) => {
      const n = new Set(prev)
      if (n.has(skill)) n.delete(skill)
      else n.add(skill)
      return n
    })
  }

  const clearFilters = () => {
    setMinQuality(0)
    setSkillFilter(new Set())
    setExpMin(0)
    setExpMax(maxExp)
  }

  const duplicateLinkedTo = useMemo(() => {
    if (!duplicateResume?.duplicateOf) return null
    const id = duplicateResume.duplicateOf
    const resume = parsedResumes.find((r) => r.id === id)
    const candidate = useHireStore
      .getState()
      .candidates.find((c) => c.id === id)
    return { resume, candidate }
  }, [duplicateResume, parsedResumes])

  const findJobTitle = (jobId: string) =>
    jobs.find((j) => j.id === jobId)?.title ?? jobId

  const activeCount = parsedResumes.filter((r) => r.status !== "Converted").length
  const canAnyBulkAction = selectedIds.size > 0

  // ────────────────────────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex-1 p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar space-y-6 font-sans"
      style={{ zoom: "90%" }}
    >
      {/* Hidden inputs */}
      <input
        ref={singleInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        className="hidden"
        onChange={handleSingleSelect}
      />
      <input
        ref={bulkInputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        multiple
        className="hidden"
        onChange={handleBulkSelect}
      />

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-violet-100 flex items-center justify-center">
            <FileSearch className="h-5 w-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Resume Parser
            </h1>
            <p className="text-sm text-slate-500">
              AI-powered resume extraction & auto-matching
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl font-bold text-xs border-slate-200"
            onClick={doRecompute}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Recompute match scores
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl font-bold text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={() => setClearAllOpen(true)}
            disabled={parsedResumes.length === 0}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear all
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl font-bold text-xs border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800"
            onClick={openBulkDialog}
          >
            <Upload className="mr-1.5 h-3.5 w-3.5" /> Bulk upload
          </Button>
          <Button
            size="sm"
            className="rounded-xl font-bold text-xs bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
            onClick={openSingleDialog}
          >
            <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload resume
          </Button>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Parsed"
          value={stats.total}
          icon={<FileText className="h-4 w-4" />}
          tone="violet"
        />
        <StatCard
          label="Converted to Pipeline"
          value={stats.converted}
          icon={<Users className="h-4 w-4" />}
          tone="emerald"
        />
        <StatCard
          label="Duplicates Flagged"
          value={stats.duplicates}
          icon={<CopyIcon className="h-4 w-4" />}
          tone="amber"
        />
        <StatCard
          label="Avg Quality Score"
          value={`${stats.avgQuality}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          tone="blue"
        />
      </div>

      {/* ── UPLOAD ZONE ── */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <div
          ref={dropZoneRef}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={openBulkDialog}
          className={cn(
            "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all",
            dragging
              ? "border-[#8B5CF6] bg-violet-50/60 scale-[1.01]"
              : "border-slate-200 hover:border-violet-300 hover:bg-violet-50/30"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors",
                dragging ? "bg-[#8B5CF6]" : "bg-violet-100"
              )}
            >
              <Upload
                className={cn(
                  "h-6 w-6 transition-colors",
                  dragging ? "text-white" : "text-[#8B5CF6]"
                )}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Drag files here or click to upload
              </p>
              <p className="text-[11px] text-slate-500 mt-1 tracking-wide">
                PDF, DOCX, DOC · max 10 MB per file · up to {MAX_BULK_FILES} at once
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-wider border-violet-200 text-violet-700 bg-violet-50"
              >
                <Sparkles className="h-3 w-3 mr-1" /> AI auto-matching
              </Badge>
              <Badge
                variant="outline"
                className="text-[10px] font-bold uppercase tracking-wider border-slate-200 text-slate-600"
              >
                Duplicate detection
              </Badge>
            </div>
          </div>
        </div>

        {/* Inline single-upload progress (non-bulk) */}
        <AnimatePresence>
          {uploadTasks.length > 0 && !bulkProgressOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              {uploadTasks.slice(0, 3).map((t) => (
                <UploadTaskRow
                  key={t.id}
                  task={t}
                  onDismiss={() =>
                    setUploadTasks((prev) => prev.filter((x) => x.id !== t.id))
                  }
                />
              ))}
              {uploadTasks.length > 3 && (
                <button
                  className="text-[11px] text-slate-500 hover:text-violet-600 font-medium"
                  onClick={() => setUploadTasks([])}
                >
                  Clear upload history ({uploadTasks.length})
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* ── EMPTY STATE ── */}
      {parsedResumes.length === 0 ? (
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-16 text-center">
          <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-2xl bg-violet-100 flex items-center justify-center">
              <FileSearch className="h-8 w-8 text-[#8B5CF6]" />
            </div>
            <h3 className="text-lg font-black text-slate-800">
              No resumes parsed yet
            </h3>
            <p className="text-sm text-slate-500">
              Upload your first resume to get started. Our AI extracts candidate
              info, matches against jobs, and flags duplicates automatically.
            </p>
            <Button
              size="sm"
              className="mt-2 rounded-xl font-bold text-xs bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
              onClick={openSingleDialog}
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload resume
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* ── TABS ── */}
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            className="flex-1"
          >
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <TabsList className="bg-slate-100 rounded-xl p-1">
                <TabsTrigger
                  value="all"
                  className="rounded-lg text-[11px] font-bold uppercase tracking-wider px-3"
                >
                  All · {parsedResumes.length}
                </TabsTrigger>
                <TabsTrigger
                  value="parsed"
                  className="rounded-lg text-[11px] font-bold uppercase tracking-wider px-3"
                >
                  Parsed ·{" "}
                  {parsedResumes.filter((r) => r.status === "Parsed").length}
                </TabsTrigger>
                <TabsTrigger
                  value="duplicates"
                  className="rounded-lg text-[11px] font-bold uppercase tracking-wider px-3"
                >
                  Duplicates · {stats.duplicates}
                </TabsTrigger>
                <TabsTrigger
                  value="converted"
                  className="rounded-lg text-[11px] font-bold uppercase tracking-wider px-3"
                >
                  Converted · {stats.converted}
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="rounded-lg text-[11px] font-bold uppercase tracking-wider px-3"
                >
                  Upload History
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search name, email, skill..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-72 rounded-xl h-9 text-xs border-slate-200"
                  />
                </div>
                <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl font-bold text-xs border-slate-200 h-9",
                        (skillFilter.size > 0 ||
                          minQuality > 0 ||
                          expMin > 0 ||
                          expMax < maxExp) &&
                          "border-violet-300 bg-violet-50 text-violet-700"
                      )}
                    >
                      <Filter className="mr-1.5 h-3.5 w-3.5" />
                      Filters
                      {(skillFilter.size > 0 ||
                        minQuality > 0 ||
                        expMin > 0 ||
                        expMax < maxExp) && (
                        <Badge className="ml-1.5 bg-violet-600 text-white text-[9px] h-4 px-1.5 rounded-full">
                          {skillFilter.size +
                            (minQuality > 0 ? 1 : 0) +
                            (expMin > 0 || expMax < maxExp ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-80 rounded-2xl p-4 space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Min Quality Score
                        </p>
                        <span className="text-xs font-bold tabular-nums text-slate-700">
                          {minQuality}%
                        </span>
                      </div>
                      <Slider
                        value={[minQuality]}
                        onValueChange={(v) => setMinQuality(v[0] ?? 0)}
                        max={100}
                        step={5}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Years of Experience
                        </p>
                        <span className="text-xs font-bold tabular-nums text-slate-700">
                          {expMin} – {expMax}
                        </span>
                      </div>
                      <Slider
                        value={[expMin, expMax]}
                        onValueChange={(v) => {
                          setExpMin(v[0] ?? 0)
                          setExpMax(v[1] ?? maxExp)
                        }}
                        min={0}
                        max={maxExp}
                        step={1}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Skills ({skillFilter.size} selected)
                      </p>
                      <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto custom-scrollbar">
                        {allSkills.length === 0 && (
                          <p className="text-xs text-slate-400">
                            No skills yet
                          </p>
                        )}
                        {allSkills.map((s) => {
                          const active = skillFilter.has(s)
                          return (
                            <button
                              key={s}
                              onClick={() => toggleSkillFilter(s)}
                              className={cn(
                                "text-[10px] font-medium rounded-full px-2 py-0.5 border transition-colors",
                                active
                                  ? "bg-violet-100 text-violet-700 border-violet-300"
                                  : "bg-white text-slate-600 border-slate-200 hover:border-violet-200"
                              )}
                            >
                              {s}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs rounded-lg"
                        onClick={clearFilters}
                      >
                        Clear
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                        onClick={() => setFilterOpen(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                {activeTab !== "history" && (
                  <Button
                    variant={isBulkMode ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-xl font-bold text-xs h-9",
                      isBulkMode
                        ? "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                        : "border-slate-200"
                    )}
                    onClick={() => {
                      setIsBulkMode((v) => !v)
                      if (isBulkMode) clearSelection()
                    }}
                  >
                    {isBulkMode ? "Done" : "Select"}
                  </Button>
                )}
              </div>
            </div>

            {/* Grid Tabs */}
            {(["all", "parsed", "duplicates", "converted"] as const).map(
              (tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  {tabResumes.length === 0 ? (
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
                      <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-600">
                        No resumes match
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try adjusting search or filters.
                      </p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <AnimatePresence initial={false}>
                        {tabResumes.map((resume) => (
                          <motion.div
                            key={resume.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <ResumeCard
                              resume={resume}
                              selected={selectedIds.has(resume.id)}
                              bulkMode={isBulkMode}
                              onToggleSelect={() => toggleSelect(resume.id)}
                              onView={() => setDetailResume(resume)}
                              onConvert={() => {
                                setConvertResume(resume)
                                const best = resume.matchScores[0]
                                setConvertJobId(best?.jobId ?? "")
                              }}
                              onDelete={() => handleDelete(resume.id)}
                              onDuplicate={() =>
                                setDuplicateResume(resume)
                              }
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </TabsContent>
              )
            )}

            {/* History Table */}
            <TabsContent value="history" className="mt-0">
              <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 hover:bg-transparent">
                      <HistoryHead
                        label="File Name"
                        col="fileName"
                        sort={historySort}
                        onSort={setHistorySort}
                      />
                      <HistoryHead
                        label="Candidate"
                        col="fullName"
                        sort={historySort}
                        onSort={setHistorySort}
                      />
                      <HistoryHead
                        label="Size"
                        col="fileSize"
                        sort={historySort}
                        onSort={setHistorySort}
                      />
                      <HistoryHead
                        label="Skills"
                        col="skillsCount"
                        sort={historySort}
                        onSort={setHistorySort}
                      />
                      <HistoryHead
                        label="Quality"
                        col="qualityScore"
                        sort={historySort}
                        onSort={setHistorySort}
                      />
                      <HistoryHead
                        label="Uploaded"
                        col="uploadedAt"
                        sort={historySort}
                        onSort={setHistorySort}
                      />
                      <HistoryHead
                        label="Status"
                        col="status"
                        sort={historySort}
                        onSort={setHistorySort}
                      />
                      <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyResumes.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-10 text-sm text-slate-400"
                        >
                          No upload history
                        </TableCell>
                      </TableRow>
                    )}
                    {historyResumes.map((r) => {
                      const style = STATUS_STYLES[r.status]
                      return (
                        <TableRow key={r.id} className="hover:bg-slate-50/60">
                          <TableCell className="text-xs">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[220px] text-slate-700 font-medium">
                                {r.fileName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-bold text-slate-800">
                            {r.fullName}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 tabular-nums">
                            {formatFileSize(r.fileSize)}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500 tabular-nums">
                            {r.skills.length}
                          </TableCell>
                          <TableCell className="text-xs tabular-nums">
                            <span
                              className={cn(
                                "font-bold",
                                qualityTone(r.qualityScore).text
                              )}
                            >
                              {r.qualityScore}%
                            </span>
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {formatRelativeDate(r.uploadedAt)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-bold rounded-full border",
                                style.badge
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full mr-1",
                                  style.dot
                                )}
                              />
                              {style.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[10px] rounded-lg text-slate-600 hover:text-violet-700"
                                onClick={() => setDetailResume(r)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[10px] rounded-lg text-slate-600 hover:text-violet-700"
                                disabled={r.status === "Converted"}
                                onClick={() => {
                                  setConvertResume(r)
                                  setConvertJobId(r.matchScores[0]?.jobId ?? "")
                                }}
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[10px] rounded-lg text-rose-500 hover:text-rose-700"
                                onClick={() => handleDelete(r.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* ── FLOATING BULK BAR ── */}
      <AnimatePresence>
        {canAnyBulkAction && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-2 bg-slate-900 text-white rounded-2xl shadow-2xl px-4 py-3 border border-slate-700">
              <Badge className="bg-[#8B5CF6] text-white text-[10px] font-bold rounded-full">
                {selectedIds.size} selected
              </Badge>
              <div className="h-5 w-px bg-slate-700" />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-[11px] font-bold text-white hover:bg-slate-800 hover:text-white rounded-lg"
                onClick={selectAllVisible}
              >
                Select all visible
              </Button>
              <Button
                size="sm"
                className="h-8 text-[11px] font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg"
                onClick={() => setBulkConvertOpen(true)}
              >
                <ArrowRight className="mr-1.5 h-3.5 w-3.5" /> Convert to pipeline
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-[11px] font-bold text-rose-300 hover:bg-rose-900/40 hover:text-rose-200 rounded-lg"
                onClick={doBulkDelete}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
                onClick={clearSelection}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DIALOG: Resume Detail ── */}
      <Dialog
        open={!!detailResume}
        onOpenChange={(o) => !o && setDetailResume(null)}
      >
        <DialogContent className="max-w-3xl rounded-2xl max-h-[85vh] overflow-y-auto custom-scrollbar p-0">
          {detailResume && (
            <ResumeDetailBody
              resume={detailResume}
              onClose={() => setDetailResume(null)}
              onConvert={() => {
                setConvertResume(detailResume)
                setConvertJobId(detailResume.matchScores[0]?.jobId ?? "")
                setDetailResume(null)
              }}
              findJobTitle={findJobTitle}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ── DIALOG: Convert to Pipeline ── */}
      <SideFormSheet
        open={!!convertResume}
        onOpenChange={(o) => {
          if (!o) {
            setConvertResume(null)
            setConvertJobId("")
          }
        }}
        title="Add to pipeline"
        description={`Create a candidate record for ${convertResume?.fullName ?? ""} in the selected job's pipeline.`}
        icon={<ArrowRight className="h-5 w-5" />}
        accentColor="#8B5CF6"
        width="md"
        submitLabel="Add to pipeline"
        submitDisabled={!convertJobId}
        onSubmit={(e) => { e.preventDefault(); doConvertSingle(); }}
      >
        <div className="space-y-4">
          <Field label="Target Job" required>
            <Select value={convertJobId} onValueChange={setConvertJobId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job..." />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((j) => {
                  const match = convertResume?.matchScores.find(
                    (m) => m.jobId === j.id
                  )
                  return (
                    <SelectItem key={j.id} value={j.id}>
                      <div className="flex items-center justify-between gap-3 w-full">
                        <span>{j.title}</span>
                        {match && (
                          <span
                            className={cn(
                              "text-[10px] font-bold tabular-nums",
                              qualityTone(match.score).text
                            )}
                          >
                            {match.score}%
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </Field>
          {convertResume?.matchScores && convertResume.matchScores[0] && (
            <div className="rounded-xl bg-violet-50 border border-violet-200 p-3 text-xs">
              <div className="flex items-center gap-2 text-violet-700 font-bold mb-1">
                <Sparkles className="h-3.5 w-3.5" /> Top AI match
              </div>
              <p className="text-violet-900">
                {convertResume.matchScores[0].jobTitle} —{" "}
                <span className="font-bold tabular-nums">
                  {convertResume.matchScores[0].score}% match
                </span>
              </p>
            </div>
          )}
        </div>
      </SideFormSheet>

      {/* ── DIALOG: Bulk Upload Progress ── */}
      <Dialog
        open={bulkProgressOpen}
        onOpenChange={(o) => {
          // Prevent close while uploads active
          if (
            !o &&
            uploadTasks.some(
              (t) => t.status === "pending" || t.status === "uploading"
            )
          ) {
            return
          }
          setBulkProgressOpen(o)
          if (!o) setUploadTasks([])
        }}
      >
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Upload className="h-5 w-5 text-[#8B5CF6]" /> Bulk upload
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Processing {uploadTasks.length} file
              {uploadTasks.length === 1 ? "" : "s"}...
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
            {uploadTasks.map((t) => (
              <UploadTaskRow
                key={t.id}
                task={t}
                onDismiss={() =>
                  setUploadTasks((prev) => prev.filter((x) => x.id !== t.id))
                }
              />
            ))}
          </div>
          <DialogFooter>
            <Button
              className="rounded-xl text-xs bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold"
              disabled={uploadTasks.some(
                (t) => t.status === "pending" || t.status === "uploading"
              )}
              onClick={() => {
                setBulkProgressOpen(false)
                setUploadTasks([])
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG: Bulk Convert ── */}
      <SideFormSheet
        open={bulkConvertOpen}
        onOpenChange={setBulkConvertOpen}
        title={`Convert ${selectedIds.size} to pipeline`}
        description="Each selected parsed resume will be added as a candidate to the chosen job. Already-converted or duplicate resumes will be skipped."
        icon={<ArrowRight className="h-5 w-5" />}
        accentColor="#8B5CF6"
        width="md"
        submitLabel={`Convert ${selectedIds.size}`}
        submitDisabled={!bulkConvertJobId}
        onSubmit={(e) => { e.preventDefault(); doBulkConvert(); }}
      >
        <Field label="Target Job" required>
          <Select
            value={bulkConvertJobId}
            onValueChange={setBulkConvertJobId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a job..." />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((j) => (
                <SelectItem key={j.id} value={j.id}>
                  {j.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </SideFormSheet>

      {/* ── DIALOG: Clear All Confirm ── */}
      <AlertDialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black text-slate-900">
              Clear all parsed resumes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500">
              This will remove all {parsedResumes.length} parsed resumes from
              the parser. Candidates already converted to the pipeline will NOT
              be affected. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold"
              onClick={doClearAll}
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── DIALOG: Duplicate Warning ── */}
      <Dialog
        open={!!duplicateResume}
        onOpenChange={(o) => !o && setDuplicateResume(null)}
      >
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Duplicate detected
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              This resume matches an existing record in the system.
            </DialogDescription>
          </DialogHeader>
          {duplicateResume && (
            <div className="space-y-3">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Uploaded
                </p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {duplicateResume.fullName}
                </p>
                <p className="text-xs text-slate-600">{duplicateResume.email}</p>
              </div>
              <div className="text-center text-slate-400 text-xs font-bold">
                ↓ matches ↓
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Existing record
                </p>
                {duplicateLinkedTo?.candidate ? (
                  <>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {duplicateLinkedTo.candidate.firstName}{" "}
                      {duplicateLinkedTo.candidate.lastName}
                    </p>
                    <p className="text-xs text-slate-600">
                      {duplicateLinkedTo.candidate.email}
                    </p>
                    <Badge className="mt-2 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-full">
                      Candidate · {duplicateLinkedTo.candidate.id} · Stage:{" "}
                      {duplicateLinkedTo.candidate.stage}
                    </Badge>
                  </>
                ) : duplicateLinkedTo?.resume ? (
                  <>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {duplicateLinkedTo.resume.fullName}
                    </p>
                    <p className="text-xs text-slate-600">
                      {duplicateLinkedTo.resume.email}
                    </p>
                    <Badge className="mt-2 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-full">
                      Parsed resume · {duplicateLinkedTo.resume.id}
                    </Badge>
                  </>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">
                    Original record no longer available.
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-xl text-xs"
              onClick={() => setDuplicateResume(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ResumeParserPage

// ────────────────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  tone: "violet" | "emerald" | "amber" | "blue"
}

function StatCard({ label, value, icon, tone }: StatCardProps) {
  const tones: Record<
    StatCardProps["tone"],
    { bg: string; text: string; ring: string }
  > = {
    violet: {
      bg: "bg-violet-100",
      text: "text-[#8B5CF6]",
      ring: "ring-violet-100",
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      ring: "ring-emerald-100",
    },
    amber: {
      bg: "bg-amber-100",
      text: "text-amber-600",
      ring: "ring-amber-100",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      ring: "ring-blue-100",
    },
  }
  const t = tones[tone]
  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <div
          className={cn(
            "h-8 w-8 rounded-xl flex items-center justify-center",
            t.bg,
            t.text
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-black tracking-tight text-slate-900 tabular-nums">
        {value}
      </p>
    </Card>
  )
}

interface UploadTaskRowProps {
  task: UploadTask
  onDismiss: () => void
}

function UploadTaskRow({ task, onDismiss }: UploadTaskRowProps) {
  const done =
    task.status === "parsed" ||
    task.status === "duplicate" ||
    task.status === "failed"
  const statusMap: Record<
    UploadTask["status"],
    { icon: React.ReactNode; label: string; tone: string }
  > = {
    pending: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />,
      label: "Pending",
      tone: "text-slate-500",
    },
    uploading: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-500" />,
      label: "Parsing...",
      tone: "text-violet-600",
    },
    parsed: {
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
      label: "Parsed",
      tone: "text-emerald-600",
    },
    duplicate: {
      icon: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
      label: "Duplicate",
      tone: "text-amber-600",
    },
    failed: {
      icon: <XCircle className="h-3.5 w-3.5 text-rose-500" />,
      label: task.error ?? "Failed",
      tone: "text-rose-600",
    },
  }
  const s = statusMap[task.status]
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-slate-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">
            {task.fileName}
          </p>
          <p className="text-[10px] text-slate-400 tabular-nums">
            {formatFileSize(task.fileSize)}
          </p>
        </div>
        <span
          className={cn("text-[10px] font-bold flex items-center gap-1", s.tone)}
        >
          {s.icon}
          {s.label}
        </span>
        {done && (
          <button
            onClick={onDismiss}
            className="text-slate-300 hover:text-slate-600 p-0.5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-200",
            task.status === "failed"
              ? "bg-rose-400"
              : task.status === "duplicate"
                ? "bg-amber-400"
                : task.status === "parsed"
                  ? "bg-emerald-500"
                  : "bg-[#8B5CF6]"
          )}
          style={{ width: `${task.progress}%` }}
        />
      </div>
    </div>
  )
}

interface ResumeCardProps {
  resume: ParsedResume
  selected: boolean
  bulkMode: boolean
  onToggleSelect: () => void
  onView: () => void
  onConvert: () => void
  onDelete: () => void
  onDuplicate: () => void
}

function ResumeCard({
  resume,
  selected,
  bulkMode,
  onToggleSelect,
  onView,
  onConvert,
  onDelete,
  onDuplicate,
}: ResumeCardProps) {
  const style = STATUS_STYLES[resume.status]
  const quality = qualityTone(resume.qualityScore)
  const topMatches = resume.matchScores.slice(0, 3)
  const isConverted = resume.status === "Converted"
  const isDuplicate = resume.status === "Duplicate"

  return (
    <Card
      className={cn(
        "group rounded-2xl border bg-white shadow-sm p-5 hover:shadow-md transition-all relative flex flex-col",
        selected
          ? "border-[#8B5CF6] ring-2 ring-violet-200"
          : "border-slate-200"
      )}
    >
      {/* Top row: checkbox + status */}
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "transition-opacity",
            bulkMode || selected
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          )}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={onToggleSelect}
            className="data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
          />
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] font-bold rounded-full border cursor-pointer",
            style.badge
          )}
          onClick={isDuplicate ? onDuplicate : undefined}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full mr-1", style.dot)} />
          {style.label}
        </Badge>
      </div>

      {/* Avatar + name */}
      <div className="flex items-start gap-3 mb-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center text-violet-700 font-black text-sm shrink-0">
          {initials(resume.fullName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-900 truncate">
            {resume.fullName}
          </p>
          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
            <Mail className="h-3 w-3 shrink-0" /> {resume.email}
          </p>
          <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
            <Phone className="h-3 w-3 shrink-0" /> {resume.phone}
          </p>
          {resume.location && (
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" /> {resume.location}
            </p>
          )}
        </div>
      </div>

      {/* Links */}
      {(resume.linkedIn || resume.portfolio) && (
        <div className="flex items-center gap-2 mb-3">
          {resume.linkedIn && (
            <a
              href={
                resume.linkedIn.startsWith("http")
                  ? resume.linkedIn
                  : `https://${resume.linkedIn}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="h-6 w-6 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Linkedin className="h-3 w-3" />
            </a>
          )}
          {resume.portfolio && (
            <a
              href={
                resume.portfolio.startsWith("http")
                  ? resume.portfolio
                  : `https://${resume.portfolio}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="h-6 w-6 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="h-3 w-3" />
            </a>
          )}
        </div>
      )}

      {/* Skills */}
      <div className="mb-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Skills
        </p>
        <div className="flex flex-wrap gap-1">
          {resume.skills.slice(0, 5).map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="text-[10px] font-medium rounded-full border-slate-200 text-slate-700 bg-slate-50"
            >
              {s}
            </Badge>
          ))}
          {resume.skills.length > 5 && (
            <Badge
              variant="outline"
              className="text-[10px] font-medium rounded-full border-violet-200 text-violet-700 bg-violet-50"
            >
              +{resume.skills.length - 5} more
            </Badge>
          )}
        </div>
      </div>

      {/* Experience summary */}
      <div className="flex items-center gap-3 text-[11px] text-slate-600 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1">
          <Briefcase className="h-3 w-3 text-slate-400" />
          <span className="font-bold tabular-nums">
            {resume.totalYearsOfExperience ?? 0}y
          </span>
        </div>
        {resume.experience[0] && (
          <span className="truncate text-slate-500">
            {resume.experience[0].title} @ {resume.experience[0].company}
          </span>
        )}
      </div>

      {/* Quality Score */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Quality
          </p>
          <span
            className={cn(
              "text-[11px] font-black tabular-nums",
              quality.text
            )}
          >
            {resume.qualityScore}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full", quality.bar)}
            style={{ width: `${resume.qualityScore}%` }}
          />
        </div>
      </div>

      {/* Top Matches */}
      {topMatches.length > 0 && (
        <div className="mb-3">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-violet-500" /> Job Matches
          </p>
          <div className="space-y-1.5">
            {topMatches.map((m) => {
              const tone = qualityTone(m.score)
              return (
                <div key={m.jobId} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-600 flex-1 truncate">
                    {m.jobTitle}
                  </span>
                  <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", tone.bar)}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold tabular-nums w-8 text-right",
                      tone.text
                    )}
                  >
                    {m.score}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-1 pt-3 border-t border-slate-100 mt-auto">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 rounded-lg text-[10px] font-bold h-8 border-slate-200"
          onClick={onView}
        >
          <Eye className="h-3 w-3 mr-1" /> View full
        </Button>
        <Button
          size="sm"
          className={cn(
            "flex-1 rounded-lg text-[10px] font-bold h-8",
            isConverted
              ? "bg-slate-100 text-slate-400 hover:bg-slate-100"
              : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
          )}
          disabled={isConverted}
          onClick={onConvert}
        >
          <ArrowRight className="h-3 w-3 mr-1" />
          {isConverted ? "Added" : "Pipeline"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="rounded-lg h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  )
}

interface HistoryHeadProps {
  label: string
  col: keyof ParsedResume | "skillsCount"
  sort: { col: keyof ParsedResume | "skillsCount"; dir: "asc" | "desc" }
  onSort: (s: {
    col: keyof ParsedResume | "skillsCount"
    dir: "asc" | "desc"
  }) => void
}

function HistoryHead({ label, col, sort, onSort }: HistoryHeadProps) {
  const active = sort.col === col
  return (
    <TableHead
      className="text-[10px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-600"
      onClick={() =>
        onSort({
          col,
          dir: active && sort.dir === "desc" ? "asc" : "desc",
        })
      }
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active ? (
          sort.dir === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <MoreHorizontal className="h-3 w-3 opacity-30" />
        )}
      </span>
    </TableHead>
  )
}

interface ResumeDetailBodyProps {
  resume: ParsedResume
  onClose: () => void
  onConvert: () => void
  findJobTitle: (id: string) => string
}

function ResumeDetailBody({
  resume,
  onClose,
  onConvert,
  findJobTitle,
}: ResumeDetailBodyProps) {
  const style = STATUS_STYLES[resume.status]
  const quality = qualityTone(resume.qualityScore)
  const isConverted = resume.status === "Converted"

  return (
    <>
      {/* Banner header */}
      <div className="p-6 bg-gradient-to-br from-violet-50 via-white to-white border-b border-slate-100 rounded-t-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-200 to-violet-300 flex items-center justify-center text-violet-800 font-black text-lg shrink-0">
              {initials(resume.fullName)}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-xl font-black text-slate-900">
                {resume.fullName}
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                {resume.fileName} · {formatFileSize(resume.fileSize)} · parsed{" "}
                {formatRelativeDate(resume.uploadedAt)}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold rounded-full border",
                    style.badge
                  )}
                >
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full mr-1", style.dot)}
                  />
                  {style.label}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold rounded-full border",
                    quality.bg,
                    quality.text,
                    "border-transparent"
                  )}
                >
                  <Zap className="h-2.5 w-2.5 mr-1" /> Quality{" "}
                  {resume.qualityScore}%
                </Badge>
                {resume.totalYearsOfExperience !== undefined && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold rounded-full border-slate-200 text-slate-600 bg-slate-50"
                  >
                    <Briefcase className="h-2.5 w-2.5 mr-1" />{" "}
                    {resume.totalYearsOfExperience}+ years
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Contact */}
        <Section title="Contact" icon={<Mail className="h-3.5 w-3.5" />}>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <ContactRow icon={<Mail />} value={resume.email} />
            <ContactRow icon={<Phone />} value={resume.phone} />
            {resume.location && (
              <ContactRow icon={<MapPin />} value={resume.location} />
            )}
            {resume.linkedIn && (
              <ContactRow
                icon={<Linkedin />}
                value={resume.linkedIn}
                href={
                  resume.linkedIn.startsWith("http")
                    ? resume.linkedIn
                    : `https://${resume.linkedIn}`
                }
              />
            )}
            {resume.portfolio && (
              <ContactRow
                icon={<Globe />}
                value={resume.portfolio}
                href={
                  resume.portfolio.startsWith("http")
                    ? resume.portfolio
                    : `https://${resume.portfolio}`
                }
              />
            )}
          </div>
        </Section>

        {/* Summary */}
        {resume.summary && (
          <Section
            title="Summary"
            icon={<FileText className="h-3.5 w-3.5" />}
          >
            <p className="text-sm text-slate-700 leading-relaxed">
              {resume.summary}
            </p>
          </Section>
        )}

        {/* Skills */}
        <Section title="Skills" icon={<Zap className="h-3.5 w-3.5" />}>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s) => (
              <Badge
                key={s}
                className="bg-violet-100 text-violet-800 text-xs font-medium rounded-full hover:bg-violet-200"
              >
                {s}
              </Badge>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section
          title="Experience"
          icon={<Briefcase className="h-3.5 w-3.5" />}
        >
          <div className="space-y-2">
            {resume.experience.map((e, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">{e.title}</p>
                  <p className="text-[10px] text-slate-500 tabular-nums">
                    {e.duration}
                  </p>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{e.company}</p>
                {e.description && (
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Education */}
        <Section
          title="Education"
          icon={<GraduationCap className="h-3.5 w-3.5" />}
        >
          <div className="space-y-2">
            {resume.education.map((e, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900">{e.degree}</p>
                  <p className="text-[10px] text-slate-500 tabular-nums">
                    {e.year}
                  </p>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{e.institution}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Certifications */}
        {resume.certifications.length > 0 && (
          <Section
            title="Certifications"
            icon={<Award className="h-3.5 w-3.5" />}
          >
            <div className="flex flex-wrap gap-1.5">
              {resume.certifications.map((c) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="text-xs rounded-full border-amber-200 text-amber-700 bg-amber-50"
                >
                  <Award className="h-3 w-3 mr-1" />
                  {c}
                </Badge>
              ))}
            </div>
          </Section>
        )}

        {/* Languages */}
        {resume.languages && resume.languages.length > 0 && (
          <Section
            title="Languages"
            icon={<Languages className="h-3.5 w-3.5" />}
          >
            <div className="flex flex-wrap gap-1.5">
              {resume.languages.map((l) => (
                <Badge
                  key={l}
                  variant="outline"
                  className="text-xs rounded-full border-slate-200 text-slate-700 bg-slate-50"
                >
                  {l}
                </Badge>
              ))}
            </div>
          </Section>
        )}

        {/* Match Scores */}
        {resume.matchScores.length > 0 && (
          <Section
            title="All Job Matches"
            icon={<Sparkles className="h-3.5 w-3.5" />}
          >
            <div className="space-y-2">
              {resume.matchScores.map((m) => {
                const tone = qualityTone(m.score)
                return (
                  <div
                    key={m.jobId}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/60"
                  >
                    <span className="text-sm text-slate-800 font-medium flex-1 truncate">
                      {m.jobTitle || findJobTitle(m.jobId)}
                    </span>
                    <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", tone.bar)}
                        style={{ width: `${m.score}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-black tabular-nums w-10 text-right",
                        tone.text
                      )}
                    >
                      {m.score}%
                    </span>
                  </div>
                )
              })}
            </div>
          </Section>
        )}
      </div>

      <DialogFooter className="gap-2 p-6 border-t border-slate-100">
        <Button
          variant="outline"
          className="rounded-xl text-xs"
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          className={cn(
            "rounded-xl text-xs font-bold",
            isConverted
              ? "bg-slate-200 text-slate-500"
              : "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
          )}
          disabled={isConverted}
          onClick={onConvert}
        >
          <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
          {isConverted ? "Already in pipeline" : "Add to pipeline"}
        </Button>
      </DialogFooter>
    </>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
        {icon} {title}
      </p>
      {children}
    </div>
  )
}

function ContactRow({
  icon,
  value,
  href,
}: {
  icon: React.ReactNode
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-center gap-2 text-slate-700">
      <span className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 [&>svg]:h-3 [&>svg]:w-3">
        {icon}
      </span>
      <span className="truncate">{value}</span>
    </div>
  )
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-violet-600"
      >
        {content}
      </a>
    )
  }
  return content
}
