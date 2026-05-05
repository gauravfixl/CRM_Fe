"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Palette,
    Image as ImageIcon,
    FileImage,
    Eye,
    EyeOff,
    Link2,
    Copy,
    Check,
    ExternalLink,
    Upload,
    Trash2,
    Plus,
    Edit,
    ChevronUp,
    ChevronDown,
    GripVertical,
    Globe,
    Linkedin,
    Twitter,
    Facebook,
    MessageCircle,
    Search,
    Send,
    X,
    Rocket,
    Heart,
    Plane,
    GraduationCap,
    Zap,
    Briefcase,
    MapPin,
    Users,
    FileText,
    Share2,
    AlertTriangle,
    Sparkles,
    Circle,
    Settings,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/shared/components/ui/dialog"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/shared/components/ui/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
    useHireStore,
    type CareerPageField,
    type CareerPageFieldType,
    type CareerPageTheme,
    type CareerPageSubmission,
} from "@/shared/data/hire-store"

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const BRAND_PRESETS = [
    "#8B5CF6",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EC4899",
    "#0F172A",
]

const CORE_FIELD_IDS = new Set(["F-1", "F-2"])

const FIELD_TYPES: { value: CareerPageFieldType; label: string }[] = [
    { value: "text", label: "Short text" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "url", label: "URL" },
    { value: "textarea", label: "Long text" },
    { value: "select", label: "Dropdown" },
    { value: "file", label: "File upload" },
    { value: "checkbox", label: "Checkbox" },
]

const PERK_ICONS = ["Heart", "Plane", "GraduationCap", "Rocket", "Zap", "Sparkles", "Users", "Globe"]

const THEME_OPTIONS: { id: CareerPageTheme; title: string; tagline: string }[] = [
    { id: "Modern", title: "Modern", tagline: "Bold gradients, rounded cards." },
    { id: "Classic", title: "Classic", tagline: "Clean lines, corporate polish." },
    { id: "Minimal", title: "Minimal", tagline: "Monochrome, spacious typography." },
]

const renderPerkIcon = (name: string, className?: string) => {
    const map: Record<string, React.ComponentType<{ className?: string }>> = {
        Heart,
        Plane,
        GraduationCap,
        Rocket,
        Zap,
        Sparkles,
        Users,
        Globe,
    }
    const Icon = map[name] ?? Sparkles
    return <Icon className={className ?? "h-5 w-5"} />
}

const formatDate = (iso?: string) => {
    if (!iso) return "—"
    try {
        return new Date(iso).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    } catch {
        return iso
    }
}

const formatDateTime = (iso?: string) => {
    if (!iso) return "—"
    try {
        const d = new Date(iso)
        return `${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} • ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
    } catch {
        return iso
    }
}

const slugify = (raw: string) =>
    raw
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")

const isHex = (v: string) => /^#([0-9a-f]{3}){1,2}$/i.test(v)

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const CareerPageBuilderPage = () => {
    const { toast } = useToast()

    // Store subscriptions
    const config = useHireStore((s) => s.careerPageConfig)
    const submissions = useHireStore((s) => s.careerSubmissions)
    const jobs = useHireStore((s) => s.jobs)

    const updateCareerPageConfig = useHireStore((s) => s.updateCareerPageConfig)
    const addCareerPageField = useHireStore((s) => s.addCareerPageField)
    const updateCareerPageField = useHireStore((s) => s.updateCareerPageField)
    const deleteCareerPageField = useHireStore((s) => s.deleteCareerPageField)
    const reorderCareerPageFields = useHireStore((s) => s.reorderCareerPageFields)
    const publishCareerPage = useHireStore((s) => s.publishCareerPage)
    const unpublishCareerPage = useHireStore((s) => s.unpublishCareerPage)
    const setJobVisibilityOnCareerPage = useHireStore((s) => s.setJobVisibilityOnCareerPage)
    const moveCareerSubmissionToPipeline = useHireStore((s) => s.moveCareerSubmissionToPipeline)
    const incrementCareerPageViews = useHireStore((s) => s.incrementCareerPageViews)

    // Dialog / UI state
    const [previewOpen, setPreviewOpen] = useState(false)
    const [fieldDialogOpen, setFieldDialogOpen] = useState(false)
    const [fieldDialogMode, setFieldDialogMode] = useState<"create" | "edit">("create")
    const [editingField, setEditingField] = useState<CareerPageField | null>(null)
    const [deleteFieldId, setDeleteFieldId] = useState<string | null>(null)
    const [unpublishOpen, setUnpublishOpen] = useState(false)

    const [viewSubmissionId, setViewSubmissionId] = useState<string | null>(null)
    const [moveSubmissionId, setMoveSubmissionId] = useState<string | null>(null)
    const [moveJobId, setMoveJobId] = useState<string>("")

    const [urlCopied, setUrlCopied] = useState(false)
    const [slugDraft, setSlugDraft] = useState(config.slug)
    const [brandColorDraft, setBrandColorDraft] = useState(config.brandColor)

    const [keywordDraft, setKeywordDraft] = useState("")
    const [jobFilter, setJobFilter] = useState<"all" | "visible" | "hidden">("all")

    // Perk editor state
    const [editingPerkIndex, setEditingPerkIndex] = useState<number | null>(null)
    const [perkForm, setPerkForm] = useState<{ icon: string; title: string; description: string }>({
        icon: "Heart",
        title: "",
        description: "",
    })
    const [perkDialogOpen, setPerkDialogOpen] = useState(false)

    // File inputs
    const logoInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)

    // Keep local drafts in sync when config changes (e.g. after reset)
    useEffect(() => {
        setSlugDraft(config.slug)
    }, [config.slug])
    useEffect(() => {
        setBrandColorDraft(config.brandColor)
    }, [config.brandColor])

    // Derived data
    const sortedFields = useMemo(
        () => [...config.formFields].sort((a, b) => a.order - b.order),
        [config.formFields],
    )

    const enabledFields = useMemo(
        () => sortedFields.filter((f) => f.enabled),
        [sortedFields],
    )

    const visibleJobsList = useMemo(() => {
        return jobs.filter((j) => {
            const visible = config.jobVisibility[j.id] !== false
            return j.workflowStatus === "Active" && visible
        })
    }, [jobs, config.jobVisibility])

    const filteredJobsForTab = useMemo(() => {
        return jobs.filter((j) => {
            if (jobFilter === "all") return true
            const visible = config.jobVisibility[j.id] !== false
            return jobFilter === "visible" ? visible : !visible
        })
    }, [jobs, config.jobVisibility, jobFilter])

    const sortedSubmissions = useMemo(
        () =>
            [...submissions].sort(
                (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
            ),
        [submissions],
    )

    const liveApplications = submissions.length
    const conversionRate =
        config.views > 0 ? ((liveApplications / config.views) * 100).toFixed(2) : "0.00"

    const fullUrl = `${config.publicUrl}/${config.slug}`

    // -----------------------------------------------------------------------
    // Handlers
    // -----------------------------------------------------------------------
    const handleLogoSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        updateCareerPageConfig({ logoUrl: url, logoName: file.name })
        toast({ title: "Logo updated", description: file.name })
    }

    const handleBannerSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        updateCareerPageConfig({ bannerUrl: url, bannerName: file.name })
        toast({ title: "Banner updated", description: file.name })
    }

    const removeLogo = () => {
        updateCareerPageConfig({ logoUrl: undefined, logoName: undefined })
    }

    const removeBanner = () => {
        updateCareerPageConfig({ bannerUrl: undefined, bannerName: undefined })
    }

    const applyBrandColor = (value: string) => {
        if (!isHex(value)) return
        updateCareerPageConfig({ brandColor: value })
    }

    const applyTheme = (theme: CareerPageTheme) => {
        updateCareerPageConfig({ theme })
        toast({ title: "Theme updated", description: `${theme} theme applied.` })
    }

    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl)
        } catch {
            /* no-op */
        }
        setUrlCopied(true)
        toast({ title: "URL copied", description: fullUrl })
        setTimeout(() => setUrlCopied(false), 2000)
    }

    const saveSlug = () => {
        const next = slugify(slugDraft)
        if (!next) {
            toast({ title: "Invalid slug", description: "Slug cannot be empty." })
            return
        }
        updateCareerPageConfig({ slug: next })
        setSlugDraft(next)
        toast({ title: "URL updated", description: `/${next}` })
    }

    const handlePublish = () => {
        publishCareerPage()
        toast({
            title: "Career page published",
            description: "Your page is now live. Candidates can apply immediately.",
        })
    }

    const confirmUnpublish = () => {
        unpublishCareerPage()
        setUnpublishOpen(false)
        toast({
            title: "Career page unpublished",
            description: "The public page is now hidden.",
        })
    }

    const openCreateField = () => {
        setFieldDialogMode("create")
        setEditingField(null)
        setFieldDialogOpen(true)
    }

    const openEditField = (field: CareerPageField) => {
        setFieldDialogMode("edit")
        setEditingField(field)
        setFieldDialogOpen(true)
    }

    const moveField = (id: string, direction: "up" | "down") => {
        const ids = sortedFields.map((f) => f.id)
        const idx = ids.indexOf(id)
        if (idx < 0) return
        const target = direction === "up" ? idx - 1 : idx + 1
        if (target < 0 || target >= ids.length) return
        const next = [...ids]
        ;[next[idx], next[target]] = [next[target], next[idx]]
        reorderCareerPageFields(next)
    }

    const removeField = (id: string) => {
        if (CORE_FIELD_IDS.has(id)) {
            toast({ title: "Protected field", description: "Core fields cannot be deleted." })
            return
        }
        setDeleteFieldId(id)
    }

    const confirmDeleteField = () => {
        if (!deleteFieldId) return
        deleteCareerPageField(deleteFieldId)
        setDeleteFieldId(null)
        toast({ title: "Field removed" })
    }

    const openMoveSubmission = (id: string) => {
        setMoveSubmissionId(id)
        const sub = submissions.find((s) => s.id === id)
        setMoveJobId(sub?.jobId ?? "")
    }

    const confirmMoveSubmission = () => {
        if (!moveSubmissionId || !moveJobId) return
        try {
            moveCareerSubmissionToPipeline(moveSubmissionId, moveJobId)
            toast({
                title: "Moved to pipeline",
                description: "Candidate profile created in the hiring pipeline.",
            })
            setMoveSubmissionId(null)
            setMoveJobId("")
        } catch (err) {
            toast({ title: "Could not move", description: (err as Error).message })
        }
    }

    const rejectSubmission = (id: string) => {
        // No dedicated reject action — piggy-back updateSubmission via state spread
        const state = useHireStore.getState()
        useHireStore.setState({
            careerSubmissions: state.careerSubmissions.map((s) =>
                s.id === id ? { ...s, status: "Rejected" as const } : s,
            ),
        })
        toast({ title: "Application rejected" })
    }

    const addKeyword = () => {
        const kw = keywordDraft.trim()
        if (!kw) return
        if (config.seoKeywords.includes(kw)) {
            setKeywordDraft("")
            return
        }
        updateCareerPageConfig({ seoKeywords: [...config.seoKeywords, kw] })
        setKeywordDraft("")
    }

    const removeKeyword = (kw: string) => {
        updateCareerPageConfig({ seoKeywords: config.seoKeywords.filter((k) => k !== kw) })
    }

    const toggleSocial = (
        key: keyof typeof config.socialEnabled,
        value: boolean,
    ) => {
        updateCareerPageConfig({
            socialEnabled: { ...config.socialEnabled, [key]: value },
        })
    }

    // Perk handlers
    const openAddPerk = () => {
        setEditingPerkIndex(null)
        setPerkForm({ icon: "Heart", title: "", description: "" })
        setPerkDialogOpen(true)
    }
    const openEditPerk = (idx: number) => {
        const perk = (config.perks ?? [])[idx]
        if (!perk) return
        setEditingPerkIndex(idx)
        setPerkForm({ icon: perk.icon, title: perk.title, description: perk.description })
        setPerkDialogOpen(true)
    }
    const savePerk = () => {
        const list = [...(config.perks ?? [])]
        if (!perkForm.title.trim()) {
            toast({ title: "Title required" })
            return
        }
        if (editingPerkIndex === null) {
            list.push({ ...perkForm })
        } else {
            list[editingPerkIndex] = { ...perkForm }
        }
        updateCareerPageConfig({ perks: list })
        setPerkDialogOpen(false)
        toast({ title: editingPerkIndex === null ? "Perk added" : "Perk updated" })
    }
    const removePerk = (idx: number) => {
        const list = [...(config.perks ?? [])]
        list.splice(idx, 1)
        updateCareerPageConfig({ perks: list })
    }

    // Simulate public view increment whenever preview is opened
    const openPreview = () => {
        incrementCareerPageViews()
        setPreviewOpen(true)
    }

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
        <div
            className="flex-1 p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar space-y-6 font-sans"
            style={{ zoom: "90%" }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">
                        Career Page Builder
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Design, publish and analyse your public careers site.
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    {config.isPublished ? (
                        <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] uppercase tracking-wider font-bold px-3 py-1">
                            <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500 mr-1.5" />
                            Published · {formatDate(config.publishedAt)}
                        </Badge>
                    ) : (
                        <Badge className="rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] uppercase tracking-wider font-bold px-3 py-1">
                            <Circle className="h-2 w-2 fill-amber-500 text-amber-500 mr-1.5" />
                            Draft
                        </Badge>
                    )}
                    <div className="flex items-center rounded-xl border border-slate-200 bg-white pl-3 pr-1 py-1 gap-2">
                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[11px] font-mono text-slate-600 truncate max-w-[220px]">
                            {fullUrl}
                        </span>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={copyUrl}>
                            {urlCopied ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                                <Copy className="h-3.5 w-3.5 text-slate-400" />
                            )}
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => window.open(fullUrl, "_blank")}
                        >
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-xl font-bold text-xs"
                        onClick={openPreview}
                    >
                        <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                    {config.isPublished ? (
                        <>
                            <Button
                                onClick={handlePublish}
                                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold text-xs"
                            >
                                <Rocket className="mr-2 h-4 w-4" /> Publish changes
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl font-bold text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
                                onClick={() => setUnpublishOpen(true)}
                            >
                                <EyeOff className="mr-2 h-4 w-4" /> Unpublish
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={handlePublish}
                            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold text-xs"
                        >
                            <Rocket className="mr-2 h-4 w-4" /> Publish
                        </Button>
                    )}
                </div>
            </div>

            {/* URL slug card */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                        <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
                            <Link2 className="h-5 w-5 text-[#8B5CF6]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                Your career page URL
                            </p>
                            <div className="flex items-center gap-1 mt-1 text-sm">
                                <span className="text-slate-500 font-mono">
                                    careers.fixlsolutions.com /
                                </span>
                                <Input
                                    value={slugDraft}
                                    onChange={(e) => setSlugDraft(e.target.value)}
                                    className="h-8 w-52 rounded-lg font-mono text-sm"
                                    placeholder="your-slug"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                                Lowercase letters, numbers and dashes only.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={saveSlug}
                        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold text-xs"
                        disabled={slugify(slugDraft) === config.slug}
                    >
                        Save URL
                    </Button>
                </div>
            </Card>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label="Page Views"
                    value={config.views.toLocaleString()}
                    caption="in last 30 days"
                    icon={<Eye className="h-5 w-5" />}
                    tint="blue"
                />
                <StatCard
                    label="Applications"
                    value={liveApplications.toLocaleString()}
                    caption={`${conversionRate}% conversion`}
                    icon={<FileText className="h-5 w-5" />}
                    tint="emerald"
                />
                <StatCard
                    label="Active Jobs Listed"
                    value={visibleJobsList.length.toLocaleString()}
                    caption={`${jobs.length} jobs in system`}
                    icon={<Briefcase className="h-5 w-5" />}
                    tint="violet"
                />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="branding" className="flex-1">
                <TabsList className="bg-slate-100 rounded-xl p-1 mb-4 flex flex-wrap">
                    <TabsTrigger value="branding" className="rounded-lg text-xs font-bold px-4">
                        <Palette className="mr-2 h-3.5 w-3.5" /> Branding
                    </TabsTrigger>
                    <TabsTrigger value="content" className="rounded-lg text-xs font-bold px-4">
                        <FileText className="mr-2 h-3.5 w-3.5" /> Content
                    </TabsTrigger>
                    <TabsTrigger value="jobs" className="rounded-lg text-xs font-bold px-4">
                        <Briefcase className="mr-2 h-3.5 w-3.5" /> Jobs ({jobs.length})
                    </TabsTrigger>
                    <TabsTrigger value="form" className="rounded-lg text-xs font-bold px-4">
                        <Settings className="mr-2 h-3.5 w-3.5" /> Application Form
                    </TabsTrigger>
                    <TabsTrigger value="social" className="rounded-lg text-xs font-bold px-4">
                        <Share2 className="mr-2 h-3.5 w-3.5" /> Social
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="rounded-lg text-xs font-bold px-4">
                        <Search className="mr-2 h-3.5 w-3.5" /> SEO
                    </TabsTrigger>
                    <TabsTrigger value="submissions" className="rounded-lg text-xs font-bold px-4">
                        <Users className="mr-2 h-3.5 w-3.5" /> Submissions ({submissions.length})
                    </TabsTrigger>
                </TabsList>

                {/* ---------------- Branding tab ---------------- */}
                <TabsContent value="branding" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Logo upload */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                        Branding · Logo
                                    </p>
                                    <h3 className="text-base font-bold text-slate-800">
                                        Company Logo
                                    </h3>
                                </div>
                                <ImageIcon className="h-5 w-5 text-slate-300" />
                            </div>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#8B5CF6] transition-colors bg-slate-50">
                                {config.logoUrl ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <img
                                            src={config.logoUrl}
                                            alt="logo"
                                            className="h-20 w-auto max-w-[180px] object-contain rounded-lg bg-white p-2 border border-slate-200"
                                        />
                                        <p className="text-[11px] font-medium text-slate-500 truncate max-w-[220px]">
                                            {config.logoName ?? "logo"}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg text-xs"
                                                onClick={() => logoInputRef.current?.click()}
                                            >
                                                <Upload className="h-3 w-3 mr-1" /> Replace
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                                                onClick={removeLogo}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => logoInputRef.current?.click()}
                                        className="w-full flex flex-col items-center gap-2"
                                    >
                                        <Upload className="h-8 w-8 text-slate-300" />
                                        <p className="text-xs font-semibold text-slate-500">
                                            Upload logo
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            PNG or SVG, transparent background, square ratio.
                                        </p>
                                    </button>
                                )}
                                <input
                                    ref={logoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleLogoSelect}
                                />
                            </div>
                        </Card>

                        {/* Banner upload */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                        Branding · Banner
                                    </p>
                                    <h3 className="text-base font-bold text-slate-800">
                                        Hero Banner
                                    </h3>
                                </div>
                                <FileImage className="h-5 w-5 text-slate-300" />
                            </div>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#8B5CF6] transition-colors bg-slate-50">
                                {config.bannerUrl ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <img
                                            src={config.bannerUrl}
                                            alt="banner"
                                            className="h-28 w-full object-cover rounded-lg border border-slate-200"
                                        />
                                        <p className="text-[11px] font-medium text-slate-500 truncate max-w-[220px]">
                                            {config.bannerName ?? "banner"}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg text-xs"
                                                onClick={() => bannerInputRef.current?.click()}
                                            >
                                                <Upload className="h-3 w-3 mr-1" /> Replace
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                                                onClick={removeBanner}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => bannerInputRef.current?.click()}
                                        className="w-full flex flex-col items-center gap-2"
                                    >
                                        <Upload className="h-8 w-8 text-slate-300" />
                                        <p className="text-xs font-semibold text-slate-500">
                                            Upload banner
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            Recommended 1200×300. JPEG, PNG or WEBP.
                                        </p>
                                    </button>
                                )}
                                <input
                                    ref={bannerInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleBannerSelect}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Brand color */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    Branding · Color
                                </p>
                                <h3 className="text-base font-bold text-slate-800">Brand Color</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Used for buttons, links, and highlights on your public page.
                                </p>
                            </div>
                            <Palette className="h-5 w-5 text-slate-300" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={config.brandColor}
                                        onChange={(e) => applyBrandColor(e.target.value)}
                                        className="h-11 w-14 rounded-xl border border-slate-200 cursor-pointer"
                                    />
                                    <div className="flex-1 flex items-center gap-2">
                                        <Input
                                            value={brandColorDraft}
                                            onChange={(e) => {
                                                setBrandColorDraft(e.target.value)
                                                if (isHex(e.target.value)) {
                                                    applyBrandColor(e.target.value)
                                                }
                                            }}
                                            className={cn(
                                                "rounded-xl font-mono text-sm uppercase",
                                                !isHex(brandColorDraft) &&
                                                    "border-rose-300 focus-visible:ring-rose-400",
                                            )}
                                            placeholder="#8B5CF6"
                                        />
                                        <Badge
                                            className={cn(
                                                "rounded-full text-[10px]",
                                                isHex(brandColorDraft)
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-rose-100 text-rose-700",
                                            )}
                                        >
                                            {isHex(brandColorDraft) ? "Valid" : "Invalid"}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                                        Presets
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {BRAND_PRESETS.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => {
                                                    setBrandColorDraft(c)
                                                    applyBrandColor(c)
                                                }}
                                                className={cn(
                                                    "h-9 w-9 rounded-xl border-2 transition-all hover:scale-110",
                                                    config.brandColor.toLowerCase() === c.toLowerCase()
                                                        ? "border-slate-900 ring-2 ring-offset-2 ring-slate-300"
                                                        : "border-white ring-1 ring-slate-200",
                                                )}
                                                style={{ backgroundColor: c }}
                                                aria-label={c}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                                    Live Preview
                                </p>
                                <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-3">
                                    <div
                                        className="h-16 rounded-lg flex items-center px-4 text-white font-bold text-sm"
                                        style={{ backgroundColor: config.brandColor }}
                                    >
                                        {config.tagline}
                                    </div>
                                    <Button
                                        className="rounded-xl text-white font-bold text-xs"
                                        style={{ backgroundColor: config.brandColor }}
                                    >
                                        Apply now
                                    </Button>
                                    <p className="text-xs text-slate-500">
                                        Link example:{" "}
                                        <span style={{ color: config.brandColor }}>
                                            View all open roles
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Theme */}
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                Branding · Theme
                            </p>
                            <h3 className="text-base font-bold text-slate-800">
                                Page Theme
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Pick a layout aesthetic. Content and jobs stay the same.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {THEME_OPTIONS.map((t) => {
                                const selected = config.theme === t.id
                                return (
                                    <button
                                        key={t.id}
                                        onClick={() => applyTheme(t.id)}
                                        className={cn(
                                            "text-left rounded-2xl border p-4 transition-all bg-white hover:shadow-md",
                                            selected
                                                ? "border-transparent ring-2 ring-[#8B5CF6]"
                                                : "border-slate-200",
                                        )}
                                    >
                                        <ThemeMini theme={t.id} brandColor={config.brandColor} />
                                        <div className="mt-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {t.title}
                                                </p>
                                                <p className="text-[11px] text-slate-500">
                                                    {t.tagline}
                                                </p>
                                            </div>
                                            {selected && (
                                                <Check className="h-4 w-4 text-[#8B5CF6]" />
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </Card>
                </TabsContent>

                {/* ---------------- Content tab ---------------- */}
                <TabsContent value="content" className="space-y-4">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                Content · Intro
                            </p>
                            <h3 className="text-base font-bold text-slate-800">Hero & About</h3>
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Tagline
                            </Label>
                            <Input
                                value={config.tagline}
                                onChange={(e) => updateCareerPageConfig({ tagline: e.target.value })}
                                className="rounded-xl mt-1"
                                placeholder="One-liner shown under your logo"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">
                                Keep it under 80 characters for best mobile display.
                            </p>
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                About the company
                            </Label>
                            <Textarea
                                value={config.about}
                                onChange={(e) => updateCareerPageConfig({ about: e.target.value })}
                                rows={6}
                                className="rounded-xl mt-1 resize-none"
                                placeholder="Who you are, what you build, why candidates should care."
                            />
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-[10px] text-slate-400">
                                    Supports plain text. Paragraphs preserved on render.
                                </p>
                                <p className="text-[10px] text-slate-400">
                                    {config.about.length} chars
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    Content · Perks
                                </p>
                                <h3 className="text-base font-bold text-slate-800">
                                    Perks & Benefits
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Shown as a 3-column grid on your public page.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="rounded-xl text-xs font-bold"
                                onClick={openAddPerk}
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Add perk
                            </Button>
                        </div>

                        {(config.perks ?? []).length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                                <Heart className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-500">
                                    No perks added yet
                                </p>
                                <p className="text-xs text-slate-400">
                                    Add 3-6 perks to stand out to candidates.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                {(config.perks ?? []).map((perk, idx) => (
                                    <div
                                        key={`${perk.title}-${idx}`}
                                        className="rounded-xl border border-slate-200 bg-white p-4 relative group"
                                    >
                                        <div
                                            className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                                            style={{
                                                backgroundColor: `${config.brandColor}1A`,
                                                color: config.brandColor,
                                            }}
                                        >
                                            {renderPerkIcon(perk.icon, "h-5 w-5")}
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {perk.title}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {perk.description}
                                        </p>
                                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7"
                                                onClick={() => openEditPerk(idx)}
                                            >
                                                <Edit className="h-3.5 w-3.5 text-slate-500" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7"
                                                onClick={() => removePerk(idx)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </TabsContent>

                {/* ---------------- Jobs tab ---------------- */}
                <TabsContent value="jobs" className="space-y-4">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    Jobs · Visibility
                                </p>
                                <h3 className="text-base font-bold text-slate-800">
                                    Show on career page
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Only Active jobs appear publicly, even if toggled on.
                                </p>
                            </div>
                            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                                {(["all", "visible", "hidden"] as const).map((k) => (
                                    <button
                                        key={k}
                                        onClick={() => setJobFilter(k)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all",
                                            jobFilter === k
                                                ? "bg-white shadow text-slate-900"
                                                : "text-slate-500",
                                        )}
                                    >
                                        {k}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredJobsForTab.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                                <Briefcase className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-500">
                                    No jobs match this filter
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredJobsForTab.map((job) => {
                                    const visible = config.jobVisibility[job.id] !== false
                                    const isActive = job.workflowStatus === "Active"
                                    return (
                                        <div
                                            key={job.id}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl border transition-all",
                                                visible
                                                    ? "border-slate-200 bg-white"
                                                    : "border-slate-100 bg-slate-50 opacity-75",
                                            )}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Switch
                                                    checked={visible}
                                                    onCheckedChange={(v) =>
                                                        setJobVisibilityOnCareerPage(job.id, v)
                                                    }
                                                    className="data-[state=checked]:bg-[#8B5CF6]"
                                                />
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-slate-800 truncate">
                                                            {job.title}
                                                        </p>
                                                        <Badge
                                                            className={cn(
                                                                "text-[9px] rounded-full",
                                                                isActive
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-slate-100 text-slate-500",
                                                            )}
                                                        >
                                                            {job.workflowStatus}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                        <span className="text-[10px] text-slate-400">
                                                            {job.department}
                                                        </span>
                                                        <span className="text-[10px] text-slate-300">
                                                            |
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                            <MapPin className="h-2.5 w-2.5" />
                                                            {job.location}
                                                        </span>
                                                        <span className="text-[10px] text-slate-300">
                                                            |
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {job.experience}
                                                        </span>
                                                        <span className="text-[10px] text-slate-300">
                                                            |
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {job.salaryRange}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] rounded-full"
                                                >
                                                    {job.type}
                                                </Badge>
                                                <Badge
                                                    className={cn(
                                                        "text-[9px] rounded-full",
                                                        visible && isActive
                                                            ? "bg-violet-100 text-[#8B5CF6]"
                                                            : "bg-slate-100 text-slate-500",
                                                    )}
                                                >
                                                    {visible && isActive
                                                        ? "Live"
                                                        : visible
                                                          ? "Hidden (not active)"
                                                          : "Hidden"}
                                                </Badge>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </Card>
                </TabsContent>

                {/* ---------------- Application Form tab ---------------- */}
                <TabsContent value="form" className="space-y-4">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    Application · Form Fields
                                </p>
                                <h3 className="text-base font-bold text-slate-800">
                                    Fields candidates fill out
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Drag to reorder • Toggle enabled/required • Edit labels & placeholders.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-bold"
                                onClick={openCreateField}
                            >
                                <Plus className="h-3.5 w-3.5 mr-1" /> Add custom field
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {sortedFields.map((field, idx) => {
                                const isCore = CORE_FIELD_IDS.has(field.id)
                                return (
                                    <motion.div
                                        key={field.id}
                                        layout
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className={cn(
                                            "grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 rounded-xl border",
                                            field.enabled
                                                ? "border-slate-200 bg-white"
                                                : "border-slate-100 bg-slate-50 opacity-80",
                                        )}
                                    >
                                        <div className="flex items-center gap-1">
                                            <GripVertical className="h-4 w-4 text-slate-300" />
                                            <div className="flex flex-col">
                                                <button
                                                    className="h-5 w-5 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                                                    onClick={() => moveField(field.id, "up")}
                                                    disabled={idx === 0}
                                                >
                                                    <ChevronUp className="h-3 w-3" />
                                                </button>
                                                <button
                                                    className="h-5 w-5 flex items-center justify-center rounded hover:bg-slate-100 text-slate-500 disabled:opacity-30"
                                                    onClick={() => moveField(field.id, "down")}
                                                    disabled={idx === sortedFields.length - 1}
                                                >
                                                    <ChevronDown className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="min-w-0 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_auto] gap-2 items-center">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={field.label}
                                                        onChange={(e) =>
                                                            updateCareerPageField(field.id, {
                                                                label: e.target.value,
                                                            })
                                                        }
                                                        className="h-8 rounded-lg text-sm font-semibold"
                                                    />
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-full text-[10px] uppercase tracking-wider"
                                                    >
                                                        {field.type}
                                                    </Badge>
                                                    {isCore && (
                                                        <Badge className="rounded-full text-[9px] bg-violet-100 text-[#8B5CF6]">
                                                            Core
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Input
                                                    value={field.placeholder ?? ""}
                                                    onChange={(e) =>
                                                        updateCareerPageField(field.id, {
                                                            placeholder: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Placeholder text"
                                                    className="h-7 rounded-lg text-xs text-slate-500"
                                                />
                                            </div>
                                            <div className="flex items-center gap-4 md:justify-end">
                                                <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                                    Enabled
                                                    <Switch
                                                        checked={field.enabled}
                                                        onCheckedChange={(v) =>
                                                            updateCareerPageField(field.id, {
                                                                enabled: v,
                                                            })
                                                        }
                                                        className="data-[state=checked]:bg-[#8B5CF6]"
                                                    />
                                                </label>
                                                <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                                                    Required
                                                    <Switch
                                                        checked={field.required}
                                                        onCheckedChange={(v) =>
                                                            updateCareerPageField(field.id, {
                                                                required: v,
                                                            })
                                                        }
                                                        className="data-[state=checked]:bg-rose-500"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8"
                                                onClick={() => openEditField(field)}
                                            >
                                                <Edit className="h-3.5 w-3.5 text-slate-500" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 disabled:opacity-30"
                                                onClick={() => removeField(field.id)}
                                                disabled={isCore}
                                            >
                                                <Trash2
                                                    className={cn(
                                                        "h-3.5 w-3.5",
                                                        isCore ? "text-slate-300" : "text-rose-500",
                                                    )}
                                                />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </Card>
                </TabsContent>

                {/* ---------------- Social tab ---------------- */}
                <TabsContent value="social" className="space-y-4">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                Share · Channels
                            </p>
                            <h3 className="text-base font-bold text-slate-800">
                                Social sharing
                            </h3>
                            <p className="text-xs text-slate-500">
                                Toggle platforms to expose share buttons on your career page.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <SocialRow
                                name="LinkedIn"
                                Icon={Linkedin}
                                color="text-blue-600"
                                bg="bg-blue-50"
                                enabled={config.socialEnabled.linkedin}
                                onToggle={(v) => toggleSocial("linkedin", v)}
                                shareUrl={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                    fullUrl,
                                )}`}
                            />
                            <SocialRow
                                name="Twitter / X"
                                Icon={Twitter}
                                color="text-sky-500"
                                bg="bg-sky-50"
                                enabled={config.socialEnabled.twitter}
                                onToggle={(v) => toggleSocial("twitter", v)}
                                shareUrl={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                    "We're hiring!",
                                )}&url=${encodeURIComponent(fullUrl)}`}
                            />
                            <SocialRow
                                name="Facebook"
                                Icon={Facebook}
                                color="text-blue-700"
                                bg="bg-blue-50"
                                enabled={config.socialEnabled.facebook}
                                onToggle={(v) => toggleSocial("facebook", v)}
                                shareUrl={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                    fullUrl,
                                )}`}
                            />
                            <SocialRow
                                name="WhatsApp"
                                Icon={MessageCircle}
                                color="text-emerald-600"
                                bg="bg-emerald-50"
                                enabled={config.socialEnabled.whatsapp}
                                onToggle={(v) => toggleSocial("whatsapp", v)}
                                shareUrl={`https://wa.me/?text=${encodeURIComponent(
                                    `Check our open roles: ${fullUrl}`,
                                )}`}
                            />
                        </div>
                    </Card>
                </TabsContent>

                {/* ---------------- SEO tab ---------------- */}
                <TabsContent value="seo" className="space-y-4">
                    <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-4">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    SEO · Metadata
                                </p>
                                <h3 className="text-base font-bold text-slate-800">
                                    Search engine optimisation
                                </h3>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                        SEO title
                                    </Label>
                                    <span
                                        className={cn(
                                            "text-[10px] font-bold",
                                            config.seoTitle.length > 60
                                                ? "text-rose-500"
                                                : "text-slate-400",
                                        )}
                                    >
                                        {config.seoTitle.length} / 60
                                    </span>
                                </div>
                                <Input
                                    value={config.seoTitle}
                                    onChange={(e) =>
                                        updateCareerPageConfig({ seoTitle: e.target.value })
                                    }
                                    maxLength={80}
                                    className="rounded-xl"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                        Meta description
                                    </Label>
                                    <span
                                        className={cn(
                                            "text-[10px] font-bold",
                                            config.seoDescription.length > 160
                                                ? "text-rose-500"
                                                : "text-slate-400",
                                        )}
                                    >
                                        {config.seoDescription.length} / 160
                                    </span>
                                </div>
                                <Textarea
                                    value={config.seoDescription}
                                    onChange={(e) =>
                                        updateCareerPageConfig({
                                            seoDescription: e.target.value,
                                        })
                                    }
                                    rows={3}
                                    maxLength={220}
                                    className="rounded-xl resize-none"
                                />
                            </div>
                            <div>
                                <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                    Keywords
                                </Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        value={keywordDraft}
                                        onChange={(e) => setKeywordDraft(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                addKeyword()
                                            }
                                        }}
                                        placeholder="Press Enter to add (e.g. remote jobs)"
                                        className="rounded-xl"
                                    />
                                    <Button
                                        variant="outline"
                                        className="rounded-xl text-xs font-bold"
                                        onClick={addKeyword}
                                    >
                                        <Plus className="h-3.5 w-3.5 mr-1" /> Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {config.seoKeywords.length === 0 && (
                                        <p className="text-xs text-slate-400">
                                            No keywords added yet.
                                        </p>
                                    )}
                                    {config.seoKeywords.map((kw) => (
                                        <Badge
                                            key={kw}
                                            className="rounded-full bg-violet-100 text-[#8B5CF6] hover:bg-violet-100 text-[11px] font-semibold pl-3 pr-1 py-1 flex items-center gap-1"
                                        >
                                            {kw}
                                            <button
                                                onClick={() => removeKeyword(kw)}
                                                className="h-5 w-5 rounded-full hover:bg-violet-200 flex items-center justify-center"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Google preview */}
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-3">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    Preview · Google
                                </p>
                                <h3 className="text-base font-bold text-slate-800">
                                    Search result preview
                                </h3>
                            </div>
                            <div className="rounded-xl border border-slate-200 p-4 bg-white font-sans">
                                <p className="text-[12px] text-slate-600 truncate">
                                    {fullUrl}
                                </p>
                                <p className="text-[18px] leading-tight text-[#1a0dab] hover:underline cursor-pointer mt-1">
                                    {config.seoTitle || "Careers at your company"}
                                </p>
                                <p className="text-[13px] text-slate-600 mt-1 line-clamp-2">
                                    {config.seoDescription ||
                                        "Add a description so candidates know what to expect."}
                                </p>
                                {config.seoKeywords.length > 0 && (
                                    <p className="text-[11px] text-slate-400 mt-2">
                                        {config.seoKeywords.slice(0, 6).join(" · ")}
                                    </p>
                                )}
                            </div>
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800 flex items-start gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                <span>
                                    Tip: keep titles under 60 characters and descriptions under 160
                                    to avoid truncation in search results.
                                </span>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* ---------------- Submissions tab ---------------- */}
                <TabsContent value="submissions" className="space-y-4">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    Candidates · Submissions
                                </p>
                                <h3 className="text-base font-bold text-slate-800">
                                    Career page applications
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Move qualified applicants into your hiring pipeline.
                                </p>
                            </div>
                            <Badge className="rounded-full bg-violet-100 text-[#8B5CF6] text-[10px] font-bold uppercase tracking-wider">
                                {submissions.length} total
                            </Badge>
                        </div>
                        {sortedSubmissions.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center">
                                <Users className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-500">
                                    No submissions yet
                                </p>
                                <p className="text-xs text-slate-400">
                                    Publish your page to start receiving applications.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-[10px] uppercase tracking-wider">
                                                Applicant
                                            </TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-wider">
                                                Job
                                            </TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-wider">
                                                Submitted
                                            </TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-wider">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-[10px] uppercase tracking-wider text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedSubmissions.map((sub) => {
                                            const name =
                                                sub.data["F-1"] ??
                                                Object.values(sub.data)[0] ??
                                                "Anonymous"
                                            const email = sub.data["F-2"]
                                            return (
                                                <TableRow key={sub.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">
                                                                {name}
                                                            </p>
                                                            {email && (
                                                                <p className="text-[11px] text-slate-400">
                                                                    {email}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="text-sm font-semibold text-slate-700">
                                                            {sub.jobTitle ?? "General"}
                                                        </p>
                                                        {sub.jobId && (
                                                            <p className="text-[10px] text-slate-400 font-mono">
                                                                {sub.jobId}
                                                            </p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-slate-500">
                                                        {formatDateTime(sub.submittedAt)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <SubmissionStatusBadge status={sub.status} />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center gap-1 justify-end">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="rounded-lg text-[11px] font-bold"
                                                                onClick={() =>
                                                                    setViewSubmissionId(sub.id)
                                                                }
                                                            >
                                                                <Eye className="h-3 w-3 mr-1" /> View
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="rounded-lg text-[11px] font-bold bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"
                                                                onClick={() =>
                                                                    openMoveSubmission(sub.id)
                                                                }
                                                                disabled={
                                                                    sub.status === "Moved to Pipeline"
                                                                }
                                                            >
                                                                <Send className="h-3 w-3 mr-1" />{" "}
                                                                Move
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="rounded-lg text-[11px] font-bold border-rose-200 text-rose-600 hover:bg-rose-50"
                                                                onClick={() =>
                                                                    rejectSubmission(sub.id)
                                                                }
                                                                disabled={sub.status === "Rejected"}
                                                            >
                                                                <X className="h-3 w-3 mr-1" /> Reject
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>

            {/* =================== Dialogs =================== */}

            {/* 1. Career Page Preview (Sheet) */}
            <Sheet open={previewOpen} onOpenChange={setPreviewOpen}>
                <SheetContent
                    side="right"
                    className="!w-full sm:!max-w-3xl lg:!max-w-4xl p-0 overflow-y-auto"
                >
                    <SheetHeader className="p-4 border-b border-slate-200">
                        <SheetTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <Eye className="h-5 w-5 text-[#8B5CF6]" /> Public page preview
                        </SheetTitle>
                        <SheetDescription className="text-xs">
                            This is exactly what candidates will see on{" "}
                            <span className="font-mono">{fullUrl}</span>
                        </SheetDescription>
                    </SheetHeader>

                    <AnimatePresence>
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white"
                        >
                            {/* Banner */}
                            <div
                                className="h-56 flex items-center justify-center relative overflow-hidden"
                                style={{
                                    backgroundColor: config.brandColor,
                                    backgroundImage: config.bannerUrl
                                        ? `url(${config.bannerUrl})`
                                        : undefined,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute inset-0 bg-black/30" />
                                <div className="relative text-center text-white px-6">
                                    {config.logoUrl ? (
                                        <img
                                            src={config.logoUrl}
                                            alt="logo"
                                            className="h-16 mx-auto mb-3 rounded-lg bg-white/90 p-2"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 mx-auto mb-3 rounded-xl bg-white/20 flex items-center justify-center">
                                            <Briefcase className="h-8 w-8" />
                                        </div>
                                    )}
                                    <h1 className="text-3xl font-black">
                                        {config.seoTitle || "Careers"}
                                    </h1>
                                    <p className="text-sm mt-2 opacity-90 max-w-xl mx-auto">
                                        {config.tagline}
                                    </p>
                                </div>
                            </div>

                            {/* About */}
                            <section className="p-6 max-w-3xl mx-auto space-y-3">
                                <h2 className="text-xl font-black text-slate-900">
                                    About us
                                </h2>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                    {config.about}
                                </p>
                            </section>

                            {/* Perks */}
                            {(config.perks ?? []).length > 0 && (
                                <section className="p-6 max-w-3xl mx-auto">
                                    <h2 className="text-xl font-black text-slate-900 mb-4">
                                        Why join us?
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {(config.perks ?? []).map((perk, idx) => (
                                            <div
                                                key={`${perk.title}-${idx}`}
                                                className="rounded-2xl border border-slate-200 p-4 bg-white"
                                            >
                                                <div
                                                    className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                                                    style={{
                                                        backgroundColor: `${config.brandColor}1A`,
                                                        color: config.brandColor,
                                                    }}
                                                >
                                                    {renderPerkIcon(perk.icon, "h-5 w-5")}
                                                </div>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {perk.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {perk.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Open Positions */}
                            <section className="p-6 max-w-3xl mx-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-black text-slate-900">
                                        Open positions
                                    </h2>
                                    <Badge className="rounded-full bg-slate-100 text-slate-700 text-[11px]">
                                        {visibleJobsList.length} jobs
                                    </Badge>
                                </div>
                                {visibleJobsList.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                                        No open roles right now — check back soon!
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {visibleJobsList.map((job) => (
                                            <div
                                                key={job.id}
                                                className="rounded-2xl border border-slate-200 p-4 bg-white hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">
                                                            {job.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 flex-wrap mt-1">
                                                            <span className="text-[11px] text-slate-500">
                                                                {job.department}
                                                            </span>
                                                            <span className="text-[11px] text-slate-300">
                                                                •
                                                            </span>
                                                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                                                <MapPin className="h-2.5 w-2.5" />
                                                                {job.location}
                                                            </span>
                                                            <span className="text-[11px] text-slate-300">
                                                                •
                                                            </span>
                                                            <span className="text-[11px] text-slate-500">
                                                                {job.type}
                                                            </span>
                                                            <span className="text-[11px] text-slate-300">
                                                                •
                                                            </span>
                                                            <span className="text-[11px] text-slate-500">
                                                                {job.experience}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="rounded-xl text-xs font-bold text-white"
                                                        style={{ backgroundColor: config.brandColor }}
                                                    >
                                                        Apply
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Application form preview */}
                            <section className="p-6 max-w-3xl mx-auto">
                                <h2 className="text-xl font-black text-slate-900 mb-4">
                                    Apply now
                                </h2>
                                <div className="rounded-2xl border border-slate-200 p-5 bg-white space-y-3">
                                    {enabledFields.map((field) => (
                                        <div key={field.id}>
                                            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                                {field.label}
                                                {field.required && (
                                                    <span className="text-rose-500"> *</span>
                                                )}
                                            </Label>
                                            {field.type === "textarea" ? (
                                                <Textarea
                                                    placeholder={field.placeholder}
                                                    rows={3}
                                                    className="rounded-xl mt-1"
                                                    disabled
                                                />
                                            ) : field.type === "select" ? (
                                                <select
                                                    className="w-full h-9 rounded-xl border border-slate-200 mt-1 px-3 text-sm bg-slate-50"
                                                    disabled
                                                >
                                                    <option>
                                                        {field.placeholder ?? "Select…"}
                                                    </option>
                                                    {(field.options ?? []).map((o) => (
                                                        <option key={o}>{o}</option>
                                                    ))}
                                                </select>
                                            ) : field.type === "file" ? (
                                                <div className="rounded-xl border-2 border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 mt-1">
                                                    <Upload className="h-5 w-5 mx-auto mb-1" />
                                                    Drop file here or click to upload
                                                </div>
                                            ) : field.type === "checkbox" ? (
                                                <label className="flex items-center gap-2 mt-1">
                                                    <input type="checkbox" disabled />
                                                    <span className="text-xs text-slate-500">
                                                        {field.placeholder ?? "Agree"}
                                                    </span>
                                                </label>
                                            ) : (
                                                <Input
                                                    type={
                                                        field.type === "email"
                                                            ? "email"
                                                            : field.type === "phone"
                                                              ? "tel"
                                                              : field.type === "url"
                                                                ? "url"
                                                                : "text"
                                                    }
                                                    placeholder={field.placeholder}
                                                    className="rounded-xl mt-1"
                                                    disabled
                                                />
                                            )}
                                            {field.helperText && (
                                                <p className="text-[10px] text-slate-400 mt-1">
                                                    {field.helperText}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        className="w-full rounded-xl text-white font-bold text-sm"
                                        style={{ backgroundColor: config.brandColor }}
                                        disabled
                                    >
                                        Submit application
                                    </Button>
                                </div>
                            </section>

                            {/* Social share footer */}
                            <section className="p-6 max-w-3xl mx-auto border-t border-slate-100">
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3">
                                    Share this page
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {config.socialEnabled.linkedin && (
                                        <SocialPill Icon={Linkedin} label="LinkedIn" />
                                    )}
                                    {config.socialEnabled.twitter && (
                                        <SocialPill Icon={Twitter} label="Twitter" />
                                    )}
                                    {config.socialEnabled.facebook && (
                                        <SocialPill Icon={Facebook} label="Facebook" />
                                    )}
                                    {config.socialEnabled.whatsapp && (
                                        <SocialPill Icon={MessageCircle} label="WhatsApp" />
                                    )}
                                </div>
                            </section>
                        </motion.div>
                    </AnimatePresence>

                    <SheetFooter className="p-4 border-t border-slate-200 sticky bottom-0 bg-white">
                        <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => setPreviewOpen(false)}
                        >
                            Close preview
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* 2. Add/Edit field dialog */}
            <FieldEditorDialog
                open={fieldDialogOpen}
                onOpenChange={setFieldDialogOpen}
                mode={fieldDialogMode}
                field={editingField}
                onCreate={(payload) => addCareerPageField(payload)}
                onUpdate={(id, payload) => updateCareerPageField(id, payload)}
            />

            {/* 3. View submission dialog */}
            <Dialog
                open={Boolean(viewSubmissionId)}
                onOpenChange={(open) => !open && setViewSubmissionId(null)}
            >
                <DialogContent className="max-w-lg rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-slate-900">
                            Application details
                        </DialogTitle>
                    </DialogHeader>
                    {viewSubmissionId &&
                        (() => {
                            const sub = submissions.find((s) => s.id === viewSubmissionId)
                            if (!sub) return null
                            const name =
                                sub.data["F-1"] ??
                                Object.values(sub.data)[0] ??
                                "Anonymous"
                            return (
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                    <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                            Candidate
                                        </p>
                                        <p className="text-sm font-bold text-slate-900">{name}</p>
                                        <p className="text-xs text-slate-500">
                                            {sub.jobTitle ?? "General"}
                                            {sub.jobId ? ` · ${sub.jobId}` : ""}
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            Submitted {formatDateTime(sub.submittedAt)}
                                        </p>
                                        <div className="mt-2">
                                            <SubmissionStatusBadge status={sub.status} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {Object.entries(sub.data).map(([fid, value]) => {
                                            const field = config.formFields.find((f) => f.id === fid)
                                            return (
                                                <div
                                                    key={fid}
                                                    className="rounded-xl border border-slate-200 p-3"
                                                >
                                                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                                        {field?.label ?? fid}
                                                    </p>
                                                    <p className="text-sm text-slate-700 mt-1 break-words">
                                                        {value || "—"}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })()}
                    <DialogFooter className="gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => setViewSubmissionId(null)}
                        >
                            Close
                        </Button>
                        {viewSubmissionId && (
                            <>
                                <Button
                                    variant="outline"
                                    className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
                                    onClick={() => {
                                        rejectSubmission(viewSubmissionId)
                                        setViewSubmissionId(null)
                                    }}
                                >
                                    <X className="h-4 w-4 mr-1" /> Reject
                                </Button>
                                <Button
                                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold"
                                    onClick={() => {
                                        openMoveSubmission(viewSubmissionId)
                                        setViewSubmissionId(null)
                                    }}
                                >
                                    <Send className="h-4 w-4 mr-1" /> Move to pipeline
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 4. Move to pipeline dialog */}
            <Dialog
                open={Boolean(moveSubmissionId)}
                onOpenChange={(open) => {
                    if (!open) {
                        setMoveSubmissionId(null)
                        setMoveJobId("")
                    }
                }}
            >
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-slate-900">
                            Move to hiring pipeline
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Select which job this candidate should be linked to. A candidate
                            profile will be created automatically.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                            Target job
                        </Label>
                        <Select value={moveJobId} onValueChange={setMoveJobId}>
                            <SelectTrigger className="rounded-xl">
                                <SelectValue placeholder="Select a job" />
                            </SelectTrigger>
                            <SelectContent>
                                {jobs.map((j) => (
                                    <SelectItem key={j.id} value={j.id}>
                                        {j.title} — {j.department}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => {
                                setMoveSubmissionId(null)
                                setMoveJobId("")
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold"
                            onClick={confirmMoveSubmission}
                            disabled={!moveJobId}
                        >
                            <Send className="h-4 w-4 mr-1" /> Move candidate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 5. Delete field confirm */}
            <AlertDialog
                open={Boolean(deleteFieldId)}
                onOpenChange={(open) => !open && setDeleteFieldId(null)}
            >
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this field?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove the field from your application form.
                            Existing submission data remains unaffected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="rounded-xl bg-rose-600 hover:bg-rose-700"
                            onClick={confirmDeleteField}
                        >
                            Delete field
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* 6. Unpublish confirm */}
            <AlertDialog open={unpublishOpen} onOpenChange={setUnpublishOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" /> Unpublish career page?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will make your career page private. Candidates will see a
                            &quot;Careers temporarily unavailable&quot; message. Existing submissions
                            are preserved.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Keep published</AlertDialogCancel>
                        <AlertDialogAction
                            className="rounded-xl bg-amber-600 hover:bg-amber-700"
                            onClick={confirmUnpublish}
                        >
                            Yes, unpublish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Perk editor dialog */}
            <Dialog open={perkDialogOpen} onOpenChange={setPerkDialogOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-slate-900">
                            {editingPerkIndex === null ? "Add perk" : "Edit perk"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Icon
                            </Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {PERK_ICONS.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        className={cn(
                                            "h-10 w-10 rounded-xl border flex items-center justify-center transition-all",
                                            perkForm.icon === icon
                                                ? "border-[#8B5CF6] bg-violet-50 text-[#8B5CF6]"
                                                : "border-slate-200 text-slate-400 hover:border-slate-300",
                                        )}
                                        onClick={() => setPerkForm({ ...perkForm, icon })}
                                    >
                                        {renderPerkIcon(icon, "h-4 w-4")}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Title
                            </Label>
                            <Input
                                value={perkForm.title}
                                onChange={(e) =>
                                    setPerkForm({ ...perkForm, title: e.target.value })
                                }
                                className="rounded-xl mt-1"
                                placeholder="e.g. Learning budget"
                            />
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Description
                            </Label>
                            <Textarea
                                value={perkForm.description}
                                onChange={(e) =>
                                    setPerkForm({ ...perkForm, description: e.target.value })
                                }
                                className="rounded-xl mt-1 resize-none"
                                rows={3}
                                placeholder="Brief, concrete value for candidates."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={() => setPerkDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold"
                            onClick={savePerk}
                        >
                            {editingPerkIndex === null ? "Add perk" : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

interface StatCardProps {
    label: string
    value: string
    caption: string
    icon: React.ReactNode
    tint: "blue" | "emerald" | "violet"
}

const StatCard: React.FC<StatCardProps> = ({ label, value, caption, icon, tint }) => {
    const tintMap: Record<StatCardProps["tint"], { bg: string; text: string; iconBg: string }> = {
        blue: { bg: "bg-blue-50 border-blue-100", text: "text-blue-700", iconBg: "bg-blue-100 text-blue-600" },
        emerald: {
            bg: "bg-emerald-50 border-emerald-100",
            text: "text-emerald-700",
            iconBg: "bg-emerald-100 text-emerald-600",
        },
        violet: {
            bg: "bg-violet-50 border-violet-100",
            text: "text-violet-700",
            iconBg: "bg-violet-100 text-[#8B5CF6]",
        },
    }
    const s = tintMap[tint]
    return (
        <Card className={cn("rounded-2xl border shadow-sm p-5", s.bg)}>
            <div className="flex items-center gap-3">
                <div
                    className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center",
                        s.iconBg,
                    )}
                >
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-0.5">
                        {label}
                    </p>
                    <p className={cn("text-xl font-black leading-tight", s.text)}>{value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{caption}</p>
                </div>
            </div>
        </Card>
    )
}

interface ThemeMiniProps {
    theme: CareerPageTheme
    brandColor: string
}

const ThemeMini: React.FC<ThemeMiniProps> = ({ theme, brandColor }) => {
    if (theme === "Modern") {
        return (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                <div
                    className="h-12"
                    style={{
                        background: `linear-gradient(135deg, ${brandColor}, ${brandColor}AA)`,
                    }}
                />
                <div className="p-3 space-y-2">
                    <div className="h-3 rounded-full bg-slate-100 w-2/3" />
                    <div className="h-2 rounded-full bg-slate-100 w-1/2" />
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="h-10 rounded-lg bg-slate-50 border border-slate-100" />
                        <div className="h-10 rounded-lg bg-slate-50 border border-slate-100" />
                    </div>
                </div>
            </div>
        )
    }
    if (theme === "Classic") {
        return (
            <div className="rounded-lg overflow-hidden border border-slate-300 bg-white">
                <div
                    className="h-12 flex items-center px-3"
                    style={{ backgroundColor: brandColor }}
                >
                    <div className="h-2 w-10 rounded bg-white/60" />
                </div>
                <div className="p-3 space-y-2">
                    <div className="h-3 rounded bg-slate-200 w-3/4" />
                    <div className="h-2 rounded bg-slate-100 w-1/2" />
                    <div className="space-y-1 pt-2">
                        <div className="h-8 rounded border border-slate-200" />
                        <div className="h-8 rounded border border-slate-200" />
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
            <div className="h-12 bg-white border-b border-slate-100 flex items-center px-3">
                <div className="h-2 w-8 rounded bg-slate-300" />
            </div>
            <div className="p-3 space-y-2">
                <div className="h-3 rounded bg-slate-200 w-1/2" />
                <div className="h-2 rounded bg-slate-100 w-2/3" />
                <div className="grid grid-cols-2 gap-2 pt-2">
                    <div
                        className="h-10 rounded border"
                        style={{ borderColor: brandColor, borderWidth: 1 }}
                    />
                    <div className="h-10 rounded border border-slate-200" />
                </div>
            </div>
        </div>
    )
}

interface SocialRowProps {
    name: string
    Icon: React.ComponentType<{ className?: string }>
    color: string
    bg: string
    enabled: boolean
    onToggle: (value: boolean) => void
    shareUrl: string
}

const SocialRow: React.FC<SocialRowProps> = ({ name, Icon, color, bg, enabled, onToggle, shareUrl }) => {
    const { toast } = useToast()
    const [copied, setCopied] = useState(false)
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
        } catch {}
        setCopied(true)
        toast({ title: `${name} link copied` })
        setTimeout(() => setCopied(false), 1500)
    }
    return (
        <div className="rounded-xl border border-slate-200 p-4 bg-white flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", bg)}>
                        <Icon className={cn("h-5 w-5", color)} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">{name}</p>
                        <p className="text-[11px] text-slate-400">
                            {enabled ? "Visible on page" : "Hidden"}
                        </p>
                    </div>
                </div>
                <Switch
                    checked={enabled}
                    onCheckedChange={onToggle}
                    className="data-[state=checked]:bg-[#8B5CF6]"
                />
            </div>
            <div className="flex items-center gap-2">
                <Input
                    readOnly
                    value={shareUrl}
                    className="rounded-lg text-[11px] font-mono h-8 bg-slate-50"
                />
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={copy}
                >
                    {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                        <Copy className="h-3.5 w-3.5 text-slate-400" />
                    )}
                </Button>
            </div>
        </div>
    )
}

const SocialPill: React.FC<{ Icon: React.ComponentType<{ className?: string }>; label: string }> = ({
    Icon,
    label,
}) => (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 bg-white">
        <Icon className="h-3.5 w-3.5" />
        {label}
    </div>
)

const SubmissionStatusBadge: React.FC<{ status: CareerPageSubmission["status"] }> = ({ status }) => {
    const map: Record<CareerPageSubmission["status"], { label: string; className: string }> = {
        New: { label: "New", className: "bg-blue-100 text-blue-700" },
        Reviewed: { label: "Reviewed", className: "bg-slate-100 text-slate-700" },
        "Moved to Pipeline": {
            label: "In pipeline",
            className: "bg-emerald-100 text-emerald-700",
        },
        Rejected: { label: "Rejected", className: "bg-rose-100 text-rose-700" },
    }
    const s = map[status]
    return (
        <Badge className={cn("rounded-full text-[10px] uppercase tracking-wider font-bold", s.className)}>
            {s.label}
        </Badge>
    )
}

// ---------------------------------------------------------------------------
// Field editor dialog
// ---------------------------------------------------------------------------

interface FieldEditorDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    mode: "create" | "edit"
    field: CareerPageField | null
    onCreate: (payload: Omit<CareerPageField, "id" | "order">) => void
    onUpdate: (id: string, payload: Partial<CareerPageField>) => void
}

const FieldEditorDialog: React.FC<FieldEditorDialogProps> = ({
    open,
    onOpenChange,
    mode,
    field,
    onCreate,
    onUpdate,
}) => {
    const { toast } = useToast()
    const [label, setLabel] = useState("")
    const [type, setType] = useState<CareerPageFieldType>("text")
    const [placeholder, setPlaceholder] = useState("")
    const [helperText, setHelperText] = useState("")
    const [required, setRequired] = useState(false)
    const [enabled, setEnabled] = useState(true)
    const [options, setOptions] = useState<string[]>([])
    const [optionDraft, setOptionDraft] = useState("")

    useEffect(() => {
        if (open) {
            if (mode === "edit" && field) {
                setLabel(field.label)
                setType(field.type)
                setPlaceholder(field.placeholder ?? "")
                setHelperText(field.helperText ?? "")
                setRequired(field.required)
                setEnabled(field.enabled)
                setOptions(field.options ?? [])
            } else {
                setLabel("")
                setType("text")
                setPlaceholder("")
                setHelperText("")
                setRequired(false)
                setEnabled(true)
                setOptions([])
            }
            setOptionDraft("")
        }
    }, [open, mode, field])

    const addOption = () => {
        const v = optionDraft.trim()
        if (!v || options.includes(v)) return
        setOptions([...options, v])
        setOptionDraft("")
    }
    const removeOption = (v: string) => {
        setOptions(options.filter((o) => o !== v))
    }

    const submit = () => {
        if (!label.trim()) {
            toast({ title: "Label required" })
            return
        }
        const payload: Omit<CareerPageField, "id" | "order"> = {
            label: label.trim(),
            type,
            placeholder: placeholder.trim() || undefined,
            helperText: helperText.trim() || undefined,
            required,
            enabled,
            options: type === "select" ? options : undefined,
        }
        if (mode === "edit" && field) {
            onUpdate(field.id, payload)
            toast({ title: "Field updated" })
        } else {
            onCreate(payload)
            toast({ title: "Field added" })
        }
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-black text-slate-900">
                        {mode === "edit" ? "Edit field" : "Add custom field"}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        Customise how candidates see this field on your application form.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    <div>
                        <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                            Label
                        </Label>
                        <Input
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="rounded-xl mt-1"
                            placeholder="e.g. Years of experience"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Type
                            </Label>
                            <Select value={type} onValueChange={(v) => setType(v as CareerPageFieldType)}>
                                <SelectTrigger className="rounded-xl mt-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {FIELD_TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Placeholder
                            </Label>
                            <Input
                                value={placeholder}
                                onChange={(e) => setPlaceholder(e.target.value)}
                                className="rounded-xl mt-1"
                                placeholder="Hint text"
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                            Helper text
                        </Label>
                        <Input
                            value={helperText}
                            onChange={(e) => setHelperText(e.target.value)}
                            className="rounded-xl mt-1"
                            placeholder="Shown underneath the field"
                        />
                    </div>

                    {type === "select" && (
                        <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 space-y-2">
                            <Label className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                                Dropdown options
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    value={optionDraft}
                                    onChange={(e) => setOptionDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            addOption()
                                        }
                                    }}
                                    className="rounded-lg"
                                    placeholder="Add option and press Enter"
                                />
                                <Button
                                    variant="outline"
                                    className="rounded-lg text-xs"
                                    onClick={addOption}
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {options.length === 0 && (
                                    <p className="text-xs text-slate-400">No options yet.</p>
                                )}
                                {options.map((o) => (
                                    <Badge
                                        key={o}
                                        className="rounded-full bg-white text-slate-700 border border-slate-200 text-[11px] font-semibold pl-3 pr-1 py-1 flex items-center gap-1"
                                    >
                                        {o}
                                        <button
                                            onClick={() => removeOption(o)}
                                            className="h-5 w-5 rounded-full hover:bg-slate-100 flex items-center justify-center"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-700">Required</p>
                                <p className="text-[10px] text-slate-400">
                                    Candidates must fill this.
                                </p>
                            </div>
                            <Switch
                                checked={required}
                                onCheckedChange={setRequired}
                                className="data-[state=checked]:bg-rose-500"
                            />
                        </div>
                        <div className="rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-slate-700">Enabled</p>
                                <p className="text-[10px] text-slate-400">
                                    Show this field on the form.
                                </p>
                            </div>
                            <Switch
                                checked={enabled}
                                onCheckedChange={setEnabled}
                                className="data-[state=checked]:bg-[#8B5CF6]"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold"
                        onClick={submit}
                    >
                        {mode === "edit" ? "Save changes" : "Add field"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CareerPageBuilderPage
