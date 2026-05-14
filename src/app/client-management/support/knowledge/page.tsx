"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Search, Plus, MoreVertical, BookOpen, FileText, Video, Download, Eye, Edit, Trash2,
    Star, ThumbsUp, MessageSquare, TrendingUp, X, Send, Archive,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "@/shared/utils/toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

type Article = {
    id: string
    title: string
    category: string
    type: string
    author: string
    created: string
    updated: string
    views: number
    rating: number
    votes: number
    status: string
    tags: string[]
    content: string
}

const validators = {
    required: (v: string) => !v?.toString().trim() ? "Required" : "",
    minLen: (n: number) => (v: string) => v?.trim().length < n ? `Min ${n} chars` : "",
}

export default function KnowledgeBase() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [filterCategory, setFilterCategory] = React.useState("all")

    const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const [isViewOpen, setIsViewOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null)

    const [form, setForm] = React.useState({
        title: "",
        category: "General",
        type: "Article",
        content: "",
        tags: "",
        status: "Draft",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const [articles, setArticles] = React.useState<Article[]>([
        { id: "KB-001", title: "How to Reset Your Password", category: "Account Management", type: "Article", author: "John Doe", created: "2024-02-20", updated: "2024-02-25", views: 1250, rating: 4.8, votes: 45, status: "Published", tags: ["password", "reset", "account"], content: "Step-by-step guide to reset your password. Navigate to the login page, click \"Forgot Password\", enter your email address, and follow the instructions sent to your inbox." },
        { id: "KB-002", title: "API Integration Tutorial", category: "Technical", type: "Video", author: "Jane Smith", created: "2024-02-18", updated: "2024-02-22", views: 890, rating: 4.6, votes: 32, status: "Published", tags: ["api", "integration", "tutorial"], content: "Complete guide for API integration. Covers authentication, endpoints, request formats, and error handling with practical examples." },
        { id: "KB-003", title: "Billing FAQ", category: "Billing", type: "FAQ", author: "Mike Johnson", created: "2024-02-15", updated: "2024-02-24", views: 2100, rating: 4.9, votes: 67, status: "Published", tags: ["billing", "faq", "payments"], content: "Frequently asked questions about billing, payment methods, invoice generation, and subscription management." },
        { id: "KB-004", title: "System Requirements", category: "Technical", type: "Document", author: "Sarah Wilson", created: "2024-02-10", updated: "2024-02-20", views: 756, rating: 4.4, votes: 28, status: "Published", tags: ["system", "requirements", "specs"], content: "Minimum system requirements for installation: OS Windows 10+/macOS 11+, RAM 8GB minimum, Storage 20GB free space." },
        { id: "KB-005", title: "Troubleshooting Login Issues", category: "Troubleshooting", type: "Article", author: "Tom Brown", created: "2024-02-12", updated: "2024-02-26", views: 1680, rating: 4.7, votes: 52, status: "Published", tags: ["login", "troubleshooting", "issues"], content: "Common login issues and their solutions. Covers browser cache, cookie settings, two-factor authentication, and account lockout scenarios." },
        { id: "KB-006", title: "Getting Started With Dashboard", category: "Getting Started", type: "Article", author: "John Doe", created: "2024-02-05", updated: "2024-02-10", views: 0, rating: 0, votes: 0, status: "Draft", tags: ["dashboard", "getting-started"], content: "An overview of the dashboard and key features to help new users get started quickly." }
    ])

    const popularSearches = [
        { query: "password reset", count: 245 },
        { query: "api documentation", count: 189 },
        { query: "billing issues", count: 156 },
        { query: "login problems", count: 134 },
        { query: "system requirements", count: 98 }
    ]

    const categories = [
        { name: "Account Management", count: 45 },
        { name: "Technical", count: 67 },
        { name: "Billing", count: 32 },
        { name: "Troubleshooting", count: 54 },
        { name: "Getting Started", count: 28 },
        { name: "API Documentation", count: 21 }
    ]

    const publishedCount = articles.filter(a => a.status === "Published").length
    const totalViews = articles.reduce((acc, a) => acc + a.views, 0)
    const avgRating = articles.filter(a => a.rating > 0).length > 0
        ? (articles.filter(a => a.rating > 0).reduce((acc, a) => acc + a.rating, 0) / articles.filter(a => a.rating > 0).length).toFixed(1)
        : "0.0"

    const kbMetrics = [
        {
            title: "Total Articles", value: articles.length.toString(), change: "+12",
            icon: <FileText className="h-4 w-4 text-blue-600" />,
            bg: "bg-blue-50", border: "border-blue-100",
            cardBg: "bg-gradient-to-br from-blue-50 to-blue-100/60 border-blue-200/80",
            path: "/client-management/support/knowledge"
        },
        {
            title: "Monthly Views",
            value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(),
            change: "+8%",
            icon: <Eye className="h-4 w-4 text-emerald-600" />,
            bg: "bg-emerald-50", border: "border-emerald-100",
            cardBg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-emerald-200/80",
            path: "/client-management/analytics/performance"
        },
        {
            title: "Avg Rating", value: `${avgRating}/5`, change: "+0.2",
            icon: <Star className="h-4 w-4 text-amber-500" />,
            bg: "bg-amber-50", border: "border-amber-100",
            cardBg: "bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200/80",
            path: "/client-management/customers/segments"
        },
        {
            title: "Published", value: publishedCount.toString(), change: "+5%",
            icon: <ThumbsUp className="h-4 w-4 text-violet-600" />,
            bg: "bg-violet-50", border: "border-violet-100",
            cardBg: "bg-gradient-to-br from-violet-50 to-violet-100/60 border-violet-200/80",
            path: "/client-management/support/overview"
        }
    ]

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Video': return <Video className="w-3 h-3" />
            case 'Document': return <Download className="w-3 h-3" />
            case 'FAQ': return <MessageSquare className="w-3 h-3" />
            default: return <FileText className="w-3 h-3" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Video': return 'bg-red-100 text-red-700'
            case 'Document': return 'bg-blue-100 text-blue-700'
            case 'FAQ': return 'bg-green-100 text-green-700'
            default: return 'bg-slate-100 text-slate-600'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published': return 'bg-emerald-100 text-emerald-700'
            case 'Draft': return 'bg-amber-100 text-amber-700'
            case 'Archived': return 'bg-slate-100 text-slate-500'
            default: return 'bg-slate-100 text-slate-600'
        }
    }

    const publishedArticles = articles.filter(a => a.status === "Published")
    const draftArticles = articles.filter(a => a.status === "Draft" || a.status === "Archived")

    const filteredArticles = publishedArticles.filter(article => {
        const matchesSearch =
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = filterCategory === "all" || article.category === filterCategory
        return matchesSearch && matchesCategory
    })

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.title = validators.required(form.title) || validators.minLen(3)(form.title)
        errs.content = validators.required(form.content) || validators.minLen(10)(form.content)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ title: "", category: "General", type: "Article", content: "", tags: "", status: "Draft" })
        setErrors({})
        setIsCreateOpen(true)
    }

    const openEdit = (article: Article) => {
        setEditingId(article.id)
        setForm({
            title: article.title,
            category: article.category,
            type: article.type,
            content: article.content,
            tags: article.tags.join(', '),
            status: article.status,
        })
        setErrors({})
        setIsEditOpen(true)
    }

    const openView = (article: Article) => { setSelectedArticle(article); setIsViewOpen(true) }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const tags = form.tags.split(',').map(t => t.trim()).filter(t => t)
        if (editingId) {
            setArticles(articles.map(a => a.id === editingId ? {
                ...a,
                title: form.title,
                category: form.category,
                type: form.type,
                content: form.content,
                tags,
                status: form.status,
                updated: new Date().toISOString().split('T')[0],
            } : a))
            setIsEditOpen(false)
            toast.success("Article updated")
        } else {
            const article: Article = {
                id: `KB-${String(articles.length + 1).padStart(3, '0')}`,
                title: form.title,
                category: form.category,
                type: form.type,
                content: form.content,
                author: "Current User",
                created: new Date().toISOString().split('T')[0],
                updated: new Date().toISOString().split('T')[0],
                views: 0,
                rating: 0,
                votes: 0,
                status: form.status,
                tags,
            }
            setArticles([article, ...articles])
            setIsCreateOpen(false)
            toast.success("Article created")
        }
    }

    const handleDelete = (id: string) => {
        setArticles(articles.filter(a => a.id !== id))
        toast.success("Article deleted")
    }

    const handlePublish = (id: string) => {
        setArticles(articles.map(a => a.id === id ? { ...a, status: "Published" } : a))
        toast.success("Article published")
    }

    const handleArchive = (id: string) => {
        setArticles(articles.map(a => a.id === id ? { ...a, status: "Archived" } : a))
        toast.success("Article archived")
    }

    const FormFields = () => (
        <>
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Title <span className="text-rose-500">*</span></Label>
                <Input
                    value={form.title}
                    onChange={(e) => setField("title", e.target.value)}
                    placeholder="Article title"
                    className={`h-10 rounded-none ${errors.title ? "border-rose-500" : ""}`}
                />
                {errors.title && <p className="text-[11px] text-rose-500">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Category</Label>
                    <Select value={form.category} onValueChange={(v) => setField("category", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Account Management">Account Management</SelectItem>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Billing">Billing</SelectItem>
                            <SelectItem value="Troubleshooting">Troubleshooting</SelectItem>
                            <SelectItem value="Getting Started">Getting Started</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Type</Label>
                    <Select value={form.type} onValueChange={(v) => setField("type", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="Article">Article</SelectItem>
                            <SelectItem value="Video">Video</SelectItem>
                            <SelectItem value="Document">Document</SelectItem>
                            <SelectItem value="FAQ">FAQ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {editingId && (
                <div className="space-y-1.5">
                    <Label className="text-[12px] font-semibold">Status</Label>
                    <Select value={form.status} onValueChange={(v) => setField("status", v)}>
                        <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Published">Published</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Tags</Label>
                <Input
                    value={form.tags}
                    onChange={(e) => setField("tags", e.target.value)}
                    placeholder="Comma-separated tags (e.g., billing, payment)"
                    className="h-10 rounded-none"
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Content <span className="text-rose-500">*</span></Label>
                <Textarea
                    value={form.content}
                    onChange={(e) => setField("content", e.target.value)}
                    className={`rounded-none border-slate-200 resize-none ${errors.content ? "border-rose-500" : ""}`}
                    rows={8}
                    placeholder="Article content..."
                />
                {errors.content && <p className="text-[11px] text-rose-500">{errors.content}</p>}
            </div>
        </>
    )

    const ArticleCard = ({ article }: { article: Article }) => (
        <div className="group flex flex-col p-5 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openView(article)}>
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold text-slate-400">{article.id}</span>
                        <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold flex items-center gap-1 ${getTypeColor(article.type)}`}>
                            {getTypeIcon(article.type)} {article.type}
                        </Badge>
                        <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(article.status)}`}>
                            {article.status}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-none">{article.category}</span>
                    </div>
                    <h3 className="text-[14px] font-bold text-slate-800 mb-1 truncate">{article.title}</h3>
                    <p className="text-[12px] font-medium text-slate-500 mb-2.5 line-clamp-2">{article.content}</p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-medium text-slate-400">
                        <span>By <span className="text-slate-600 font-bold">{article.author}</span></span>
                        <span>Created: {formatDate(article.created)}</span>
                        <span>Updated: {formatDate(article.updated)}</span>
                        {article.views > 0 && (
                            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views} views</span>
                        )}
                        {article.rating > 0 && (
                            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" /><span className="font-bold text-amber-600">{article.rating}</span> ({article.votes})</span>
                        )}
                    </div>
                    {article.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                            {article.tags.map((tag, i) => (
                                <Badge key={i} className="text-[10px] px-2 py-0.5 rounded-none bg-indigo-50 text-indigo-600 border-0 font-bold">{tag}</Badge>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1.5 ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all" onClick={() => openView(article)}>
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all" onClick={() => openEdit(article)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-none">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-none font-outfit shadow-lg border-slate-200">
                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => openView(article)}>
                                <Eye className="h-4 w-4 text-blue-500" /> View Article
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => openEdit(article)}>
                                <Edit className="h-4 w-4 text-indigo-500" /> Edit Article
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {article.status !== "Published" && (
                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handlePublish(article.id)}>
                                    <Send className="h-4 w-4 text-emerald-500" /> Publish
                                </DropdownMenuItem>
                            )}
                            {article.status !== "Archived" && (
                                <DropdownMenuItem className="gap-2 font-medium cursor-pointer rounded-none" onClick={() => handleArchive(article.id)}>
                                    <Archive className="h-4 w-4 text-amber-500" /> Archive
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="gap-2 font-medium cursor-pointer rounded-none text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => handleDelete(article.id)}
                            >
                                <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )

    return (
        <div className="px-8 py-8 space-y-6 bg-slate-50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Knowledge <span className="text-blue-600">Base</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Manage documentation and self-service resources for your clients.
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-none h-11 px-6 font-bold font-outfit shadow-lg shadow-blue-600/20 gap-2" onClick={openCreate}>
                    <Plus className="h-5 w-5" /> Create Article
                </Button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kbMetrics.map((metric, index) => (
                    <Card key={index} className={`border shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 rounded-none cursor-pointer ${metric.cardBg}`} onClick={() => router.push(metric.path)}>
                        <CardContent className="px-5 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-9 w-9 rounded-none flex items-center justify-center ${metric.bg} border ${metric.border} shadow-sm`}>
                                    {metric.icon}
                                </div>
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-none bg-white/70 border border-emerald-100">
                                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                                    <span className="text-[11px] font-bold text-emerald-600">{metric.change}</span>
                                </div>
                            </div>
                            <p className="text-[12px] font-semibold text-slate-500 font-outfit mb-0.5">{metric.title}</p>
                            <h3 className="text-xl font-bold text-slate-900 font-outfit tracking-tight">{metric.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="space-y-4">
                    <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-5 py-4 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold text-slate-900 font-outfit">Categories</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 py-4">
                            <div className="space-y-1">
                                <button
                                    onClick={() => setFilterCategory("all")}
                                    className={`w-full text-left px-3 py-2 rounded-none text-[13px] font-bold hover:bg-slate-50 transition-colors ${filterCategory === "all" ? "bg-blue-50 text-blue-600" : "text-slate-500"}`}
                                >
                                    All Categories
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() => setFilterCategory(category.name)}
                                        className={`w-full text-left px-3 py-2 rounded-none text-[13px] font-bold hover:bg-slate-50 transition-colors flex justify-between items-center ${filterCategory === category.name ? "bg-blue-50 text-blue-600" : "text-slate-500"}`}
                                    >
                                        <span>{category.name}</span>
                                        <span className="text-[11px] font-bold bg-slate-100 px-2 py-0.5 rounded-none text-slate-400">{category.count}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                        <CardHeader className="px-5 py-4 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold text-slate-900 font-outfit">Popular Searches</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 py-4">
                            <div className="space-y-1">
                                {popularSearches.map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSearchQuery(search.query)}
                                        className="w-full text-left px-3 py-2 rounded-none text-[13px] font-bold hover:bg-slate-50 transition-colors text-slate-500 flex justify-between items-center"
                                    >
                                        <span>{search.query}</span>
                                        <span className="text-[11px] font-bold bg-slate-100 px-2 py-0.5 rounded-none text-slate-400">{search.count}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="col-span-3 space-y-5">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            placeholder="Search articles, tags, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 bg-white border-slate-200 rounded-none text-sm font-outfit shadow-sm"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <Tabs defaultValue="articles" className="space-y-5">
                        <TabsList className="bg-white border border-slate-200 p-1 rounded-none h-12 w-fit font-outfit shadow-sm">
                            <TabsTrigger value="articles" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">
                                Articles <Badge className="ml-2 bg-blue-50 text-blue-700 border-0 font-bold text-[10px] px-1.5 py-0 rounded-none">{publishedArticles.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="drafts" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">
                                Drafts <Badge className="ml-2 bg-amber-50 text-amber-700 border-0 font-bold text-[10px] px-1.5 py-0 rounded-none">{draftArticles.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="analytics" className="px-6 rounded-none data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold transition-all">Analytics</TabsTrigger>
                        </TabsList>

                        {/* Published Articles Tab */}
                        <TabsContent value="articles" className="space-y-4">
                            <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Published Articles</CardTitle>
                                            <Badge className="bg-blue-50 text-blue-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-none">
                                                {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                                            </Badge>
                                        </div>
                                        {filterCategory !== "all" && (
                                            <Button variant="ghost" onClick={() => { setFilterCategory("all"); toast.success("Filter cleared") }} className="h-9 px-3 rounded-none font-bold text-slate-500 gap-1.5 border border-slate-200 bg-white">
                                                <X className="h-3.5 w-3.5" /> Clear Filter
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 py-5">
                                    {filteredArticles.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="h-14 w-14 rounded-none bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                                <BookOpen className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="font-bold text-slate-500">No articles found</p>
                                            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or category filter</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredArticles.map(article => <ArticleCard key={article.id} article={article} />)}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Drafts Tab */}
                        <TabsContent value="drafts" className="space-y-4">
                            <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                                <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-base font-bold text-slate-900 font-outfit">Draft Articles</CardTitle>
                                        <Badge className="bg-amber-50 text-amber-700 border-0 font-bold text-[11px] px-2.5 py-0.5 rounded-none">{draftArticles.length} drafts</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 py-5">
                                    {draftArticles.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="h-14 w-14 rounded-none bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                                <BookOpen className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="font-bold text-slate-500">No draft articles</p>
                                            <p className="text-sm text-slate-400 mt-1">Create a new article to get started</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {draftArticles.map(article => (
                                                <div key={article.id} className="flex flex-col p-5 bg-amber-50/30 border border-amber-100 rounded-none hover:bg-amber-50/50 transition-all cursor-pointer" onClick={() => openView(article)}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="text-[11px] font-bold text-slate-400">{article.id}</span>
                                                                <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(article.status)}`}>{article.status}</Badge>
                                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-none">{article.category}</span>
                                                            </div>
                                                            <h3 className="text-[14px] font-bold text-slate-800 mb-1">{article.title}</h3>
                                                            <p className="text-[12px] font-medium text-slate-500 line-clamp-1">{article.content}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                            <Button size="sm" className="h-9 px-4 rounded-none font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5" onClick={() => handlePublish(article.id)}>
                                                                <Send className="h-3.5 w-3.5" /> Publish
                                                            </Button>
                                                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100" onClick={() => openEdit(article)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="outline" size="icon" className="h-9 w-9 rounded-none border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100" onClick={() => handleDelete(article.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Analytics Tab */}
                        <TabsContent value="analytics" className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                                        <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Top Performing Articles</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-5">
                                        <div className="space-y-3">
                                            {[...articles].filter(a => a.views > 0).sort((a, b) => b.views - a.views).slice(0, 5).map((article) => (
                                                <div key={article.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openView(article)}>
                                                    <span className="text-[13px] font-bold text-slate-700 truncate font-outfit max-w-[180px]">{article.title}</span>
                                                    <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-none ml-2 shrink-0">{article.views.toLocaleString()} views</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-none border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                                        <CardTitle className="text-base font-bold text-slate-900 tracking-tight font-outfit">Highest Rated Articles</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6 py-5">
                                        <div className="space-y-3">
                                            {[...articles].filter(a => a.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 5).map((article) => (
                                                <div key={article.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-none hover:bg-slate-50 transition-all cursor-pointer" onClick={() => openView(article)}>
                                                    <span className="text-[13px] font-bold text-slate-700 truncate font-outfit max-w-[180px]">{article.title}</span>
                                                    <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-none ml-2 shrink-0">
                                                        <Star className="h-3.5 w-3.5 text-amber-400" />
                                                        <span className="text-[12px] font-bold text-amber-600">{article.rating}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Create Sheet */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-blue-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Create New Article</SheetTitle>
                        <p className="text-[12px] text-slate-500">Add a new knowledge base article.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <FormFields />
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={handleSave}>Create Article</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Edit Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Edit Article</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <FormFields />
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>Save Changes</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* View Sheet */}
            <Sheet open={isViewOpen} onOpenChange={setIsViewOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold">Article Details</SheetTitle>
                    </SheetHeader>
                    {selectedArticle && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-slate-900">{selectedArticle.id}</span>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold flex items-center gap-1 ${getTypeColor(selectedArticle.type)}`}>
                                        {getTypeIcon(selectedArticle.type)} {selectedArticle.type}
                                    </Badge>
                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-none border-0 font-bold ${getStatusColor(selectedArticle.status)}`}>{selectedArticle.status}</Badge>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Title</p>
                                    <p className="text-sm font-bold text-slate-900">{selectedArticle.title}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                    <p className="text-[11px] font-bold text-slate-400 mb-1">Content</p>
                                    <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{selectedArticle.content}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Category</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedArticle.category}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Author</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedArticle.author}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Views</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedArticle.views.toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 mb-1">Rating</p>
                                        <p className="text-sm font-bold text-amber-600">{selectedArticle.rating > 0 ? `${selectedArticle.rating} / 5 (${selectedArticle.votes} votes)` : "Not rated"}</p>
                                    </div>
                                </div>
                                {selectedArticle.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedArticle.tags.map((tag, i) => (
                                            <Badge key={i} className="text-[10px] px-2 py-0.5 rounded-none bg-indigo-50 text-indigo-600 border-0 font-bold">{tag}</Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsViewOpen(false); openEdit(selectedArticle) }}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selectedArticle.id); setIsViewOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
