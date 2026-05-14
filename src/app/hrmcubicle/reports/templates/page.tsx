"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Eye, Filter, Layers, Play, Search, X,
  Star, FileText, Users, DollarSign, Clock, CalendarDays, TrendingUp,
  ShieldCheck, Briefcase, Receipt, ArrowDownAZ, ArrowUpAZ, Flame, Heart
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
import { useReportsStore, ReportTemplate } from "@/shared/data/reports-store"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

const categoryMeta: Record<string, { icon: typeof Users; color: string }> = {
  "HR Analytics": { icon: Users, color: "bg-violet-100 text-violet-600" },
  "Payroll MIS": { icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
  "Attendance": { icon: Clock, color: "bg-blue-100 text-blue-600" },
  "Leave": { icon: CalendarDays, color: "bg-amber-100 text-amber-600" },
  "Performance": { icon: TrendingUp, color: "bg-rose-100 text-rose-600" },
  "Compliance": { icon: ShieldCheck, color: "bg-teal-100 text-teal-600" },
  "Recruitment": { icon: Briefcase, color: "bg-indigo-100 text-indigo-600" },
  "Expense": { icon: Receipt, color: "bg-orange-100 text-orange-600" },
}

const sampleData: Record<string, string>[][] = [
  [
    { "Employee ID": "E001", "Name": "Aditya Singh", "Department": "Engineering", "Location": "Bangalore", "Type": "Full-time", "Join Date": "2023-06-15", "Status": "Active" },
    { "Employee ID": "E002", "Name": "Priya Sharma", "Department": "Product", "Location": "Delhi", "Type": "Full-time", "Join Date": "2022-11-01", "Status": "Active" },
    { "Employee ID": "E003", "Name": "Rahul Verma", "Department": "Design", "Location": "Mumbai", "Type": "Contract", "Join Date": "2024-01-10", "Status": "Active" },
  ],
  [
    { "Employee ID": "E010", "Name": "Sneha Patel", "Department": "Marketing", "Exit Date": "2026-02-28", "Reason": "Better Opportunity", "Tenure": "2.5 years", "Manager": "Vikram Joshi" },
    { "Employee ID": "E015", "Name": "Arjun Mehta", "Department": "Engineering", "Exit Date": "2026-01-15", "Reason": "Relocation", "Tenure": "1.8 years", "Manager": "Aditya Singh" },
  ],
]

const ReportTemplatesPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { templates, toggleFavorite, addReportRun } = useReportsStore()

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null)
  const [sortBy, setSortBy] = useState<"popularity" | "name-asc" | "name-desc" | "favorites">("popularity")
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))]

  const filtered = templates
    .filter((t) => selectedCategory === "all" || t.category === selectedCategory)
    .filter((t) => !showOnlyFavorites || t.isFavorite)
    .filter((t) =>
      !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "popularity") return b.popularity - a.popularity
      if (sortBy === "name-asc") return a.name.localeCompare(b.name)
      if (sortBy === "name-desc") return b.name.localeCompare(a.name)
      if (sortBy === "favorites") return Number(b.isFavorite) - Number(a.isFavorite)
      return 0
    })

  const favorites = templates.filter((t) => t.isFavorite)

  const handleGenerate = (tmpl: ReportTemplate) => {
    addReportRun({
      id: `RR${Date.now()}`,
      reportName: tmpl.name,
      type: tmpl.category,
      ranBy: "Admin",
      ranDate: new Date().toISOString().split("T")[0],
      rowCount: Math.floor(Math.random() * 200) + 50,
      format: "PDF",
    })
    toast({ title: "Report Generated", description: `"${tmpl.name}" has been generated successfully.` })
  }

  const handlePreview = (tmpl: ReportTemplate) => {
    setPreviewTemplate(tmpl)
    setPreviewOpen(true)
  }

  const handleToggleFavorite = (tmpl: ReportTemplate) => {
    toggleFavorite(tmpl.id)
    toast({
      title: tmpl.isFavorite ? "Unpinned" : "Pinned",
      description: tmpl.isFavorite
        ? `"${tmpl.name}" removed from pinned templates.`
        : `"${tmpl.name}" added to pinned templates.`,
    })
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategory("all")
    setShowOnlyFavorites(false)
    setSortBy("popularity")
  }

  const hasActiveFilters = !!search || selectedCategory !== "all" || showOnlyFavorites || sortBy !== "popularity"

  const getPreviewData = () => {
    if (!previewTemplate) return []
    const idx = templates.indexOf(previewTemplate) % sampleData.length
    return sampleData[idx]
  }

  return (
    <div className="flex-1 p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/hrmcubicle/reports")} className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Report Templates</h1>
            <p className="text-sm text-slate-500">Browse and generate from pre-built report templates</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9 w-64 rounded-xl"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 text-slate-400" />
              </button>
            )}
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-44 rounded-xl text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity"><div className="flex items-center gap-2 text-xs"><Flame className="h-3.5 w-3.5" /> Popularity</div></SelectItem>
              <SelectItem value="favorites"><div className="flex items-center gap-2 text-xs"><Star className="h-3.5 w-3.5" /> Pinned First</div></SelectItem>
              <SelectItem value="name-asc"><div className="flex items-center gap-2 text-xs"><ArrowDownAZ className="h-3.5 w-3.5" /> Name A→Z</div></SelectItem>
              <SelectItem value="name-desc"><div className="flex items-center gap-2 text-xs"><ArrowUpAZ className="h-3.5 w-3.5" /> Name Z→A</div></SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showOnlyFavorites ? "default" : "outline"}
            size="sm"
            className={cn("rounded-xl text-xs font-bold", showOnlyFavorites && "bg-amber-500 hover:bg-amber-600")}
            onClick={() => setShowOnlyFavorites((v) => !v)}
          >
            <Heart className={cn("mr-1 h-3.5 w-3.5", showOnlyFavorites && "fill-white")} /> Pinned
          </Button>
        </div>
      </div>

      {/* Pinned / Favorites */}
      {favorites.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Pinned Templates
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {favorites.map((tmpl) => {
              const meta = categoryMeta[tmpl.category] || { icon: FileText, color: "bg-slate-100 text-slate-600" }
              const Icon = meta.icon
              return (
                <Card
                  key={tmpl.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 min-w-[240px] flex-shrink-0 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handlePreview(tmpl)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", meta.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">{tmpl.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tmpl.category}</p>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-slate-400" />
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full text-xs font-bold capitalize",
              selectedCategory === cat && "bg-[#8B5CF6] hover:bg-[#7C3AED]"
            )}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "all" ? "All" : cat}
          </Button>
        ))}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-400 ml-auto" onClick={clearFilters}>
            <X className="mr-1 h-3 w-3" /> Clear Filters
          </Button>
        )}
      </div>
      <p className="text-xs text-slate-400 font-medium -mt-2">
        Showing {filtered.length} of {templates.length} templates
      </p>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tmpl) => {
          const meta = categoryMeta[tmpl.category] || { icon: FileText, color: "bg-slate-100 text-slate-600" }
          const Icon = meta.icon
          return (
            <Card
              key={tmpl.id}
              onClick={() => handlePreview(tmpl)}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", meta.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleFavorite(tmpl) }}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                  title={tmpl.isFavorite ? "Unpin template" : "Pin template"}
                >
                  <Star className={cn("h-4 w-4", tmpl.isFavorite ? "text-amber-400 fill-amber-400" : "text-slate-300")} />
                </button>
              </div>
              <h3 className="text-sm font-bold text-slate-800">{tmpl.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>

              {/* Columns preview */}
              <div className="mt-3 flex flex-wrap gap-1">
                {tmpl.columns.slice(0, 4).map((col) => (
                  <Badge key={col} variant="outline" className="text-[9px] rounded-full font-medium">{col}</Badge>
                ))}
                {tmpl.columns.length > 4 && (
                  <Badge variant="outline" className="text-[9px] rounded-full font-medium">+{tmpl.columns.length - 4} more</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-xs font-bold flex-1"
                  onClick={() => handleGenerate(tmpl)}
                >
                  <Play className="mr-1 h-3 w-3" /> Generate
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => handlePreview(tmpl)}>
                  <Eye className="mr-1 h-3 w-3" /> Preview
                </Button>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <Badge className={cn("text-[9px] rounded-full", meta.color)}>{tmpl.category}</Badge>
                <span className="text-[10px] text-slate-400">{tmpl.popularity}% popularity</span>
              </div>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Layers className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-400">No templates found</p>
          <p className="text-xs text-slate-300 mt-1">Try adjusting your search or filter</p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold mt-4" onClick={clearFilters}>
              <X className="mr-1 h-3 w-3" /> Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">{previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">{previewTemplate.description}</p>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Columns</p>
                <div className="flex flex-wrap gap-2">
                  {previewTemplate.columns.map((col) => (
                    <Badge key={col} variant="outline" className="text-xs rounded-full">{col}</Badge>
                  ))}
                </div>
              </div>

              {/* Sample Data */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sample Data</p>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {previewTemplate.columns.slice(0, 7).map((col) => (
                          <TableHead key={col} className="font-bold text-slate-300 text-[9px] uppercase tracking-widest whitespace-nowrap">{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPreviewData().map((row, i) => (
                        <TableRow key={i} className="hover:bg-slate-50">
                          {previewTemplate.columns.slice(0, 7).map((col) => (
                            <TableCell key={col} className="text-xs text-slate-600 whitespace-nowrap">{row[col] || "-"}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                      {getPreviewData().length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-sm">Sample data preview</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold"
              onClick={() => {
                if (previewTemplate) handleGenerate(previewTemplate)
                setPreviewOpen(false)
              }}
            >
              <Play className="mr-1 h-4 w-4" /> Generate Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReportTemplatesPage
