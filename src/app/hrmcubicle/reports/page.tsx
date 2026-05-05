"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users, DollarSign, Clock, CalendarDays, TrendingUp, Briefcase,
  Receipt, ShieldCheck, Download, FileText, Play, Star, ArrowRight,
  BarChart3, PieChart, Calendar, Plus, Search, Eye, Trash2,
  RefreshCw, MoreHorizontal, X
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/shared/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu"
import { useReportsStore } from "@/shared/data/reports-store"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

const categoryConfig = [
  { key: "HR Analytics", label: "HR Analytics", icon: Users, color: "bg-violet-100 text-violet-600", border: "border-violet-200" },
  { key: "Payroll MIS", label: "Payroll MIS", icon: DollarSign, color: "bg-emerald-100 text-emerald-600", border: "border-emerald-200" },
  { key: "Attendance", label: "Attendance", icon: Clock, color: "bg-blue-100 text-blue-600", border: "border-blue-200" },
  { key: "Leave", label: "Leave", icon: CalendarDays, color: "bg-amber-100 text-amber-600", border: "border-amber-200" },
  { key: "Performance", label: "Performance", icon: TrendingUp, color: "bg-rose-100 text-rose-600", border: "border-rose-200" },
  { key: "Recruitment", label: "Recruitment", icon: Briefcase, color: "bg-indigo-100 text-indigo-600", border: "border-indigo-200" },
  { key: "Expense", label: "Expense", icon: Receipt, color: "bg-orange-100 text-orange-600", border: "border-orange-200" },
  { key: "Compliance", label: "Compliance", icon: ShieldCheck, color: "bg-teal-100 text-teal-600", border: "border-teal-200" },
]

const quickReports = [
  { label: "Headcount", type: "HR" },
  { label: "Attrition", type: "HR" },
  { label: "Payroll Cost", type: "Payroll" },
  { label: "Attendance Summary", type: "Attendance" },
]

const ReportsDashboardPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { templates, recentRuns, scheduledReports, addReportRun, deleteReportRun, clearReportRuns } = useReportsStore()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null)
  const [deleteRunId, setDeleteRunId] = useState<string | null>(null)
  const [clearAllOpen, setClearAllOpen] = useState(false)

  const popularTemplates = [...templates].sort((a, b) => b.popularity - a.popularity).slice(0, 6)

  const searchLower = search.trim().toLowerCase()
  const matchesSearch = (t: typeof templates[0]) =>
    !searchLower ||
    t.name.toLowerCase().includes(searchLower) ||
    t.description.toLowerCase().includes(searchLower) ||
    t.category.toLowerCase().includes(searchLower)

  const filteredTemplates = templates
    .filter((t) => !selectedCategory || t.category === selectedCategory)
    .filter(matchesSearch)

  const searchResults = searchLower ? templates.filter(matchesSearch) : []

  const handleQuickGenerate = (label: string, type = "Quick") => {
    addReportRun({
      id: `RR${Date.now()}`,
      reportName: label,
      type,
      ranBy: "Admin",
      ranDate: new Date().toISOString().split("T")[0],
      rowCount: Math.floor(Math.random() * 200) + 50,
      format: "PDF",
    })
    toast({ title: "Report Generated", description: `${label} report has been generated.` })
  }

  const handleDownload = (name: string, format: string) => {
    toast({ title: "Downloading", description: `${name} (${format}) download started.` })
  }

  const handleRerun = (name: string, type: string) => {
    addReportRun({
      id: `RR${Date.now()}`,
      reportName: name,
      type,
      ranBy: "Admin",
      ranDate: new Date().toISOString().split("T")[0],
      rowCount: Math.floor(Math.random() * 200) + 50,
      format: "PDF",
    })
    toast({ title: "Report Re-run", description: `${name} has been regenerated.` })
  }

  const handleDeleteRun = (id: string) => {
    deleteReportRun(id)
    setDeleteRunId(null)
    toast({ title: "Deleted", description: "Report run removed from history." })
  }

  const handleClearAll = () => {
    clearReportRuns()
    setClearAllOpen(false)
    toast({ title: "History Cleared", description: "All recent report runs were removed." })
  }

  const handlePreview = (template: typeof templates[0]) => {
    setPreviewTemplate(template)
    setPreviewOpen(true)
  }

  return (
    <div className="flex-1 p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Generate, schedule, and manage organizational reports</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search reports..."
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
          <Button
            onClick={() => router.push("/hrmcubicle/reports/builder")}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold"
          >
            <Plus className="mr-2 h-4 w-4" /> Custom Report
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {searchLower && (
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">
              Search Results <span className="text-slate-400 font-medium">({searchResults.length})</span>
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-xs text-slate-400">
              Clear
            </Button>
          </div>
          {searchResults.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No reports match "<span className="font-semibold">{search}</span>".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((tmpl) => (
                <Card key={tmpl.id} className="rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-800">{tmpl.name}</h4>
                    <Badge variant="outline" className="text-[9px] font-bold rounded-full">{tmpl.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-xs font-bold" onClick={() => handleQuickGenerate(tmpl.name, tmpl.category)}>
                      <Play className="mr-1 h-3 w-3" /> Generate
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => handlePreview(tmpl)}>
                      <Eye className="mr-1 h-3 w-3" /> Preview
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Quick Generate */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Generate:</span>
        {quickReports.map((qr) => (
          <Button
            key={qr.label}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 hover:border-[#8B5CF6] hover:text-[#8B5CF6] font-semibold text-xs"
            onClick={() => handleQuickGenerate(qr.label)}
          >
            <Play className="mr-1.5 h-3 w-3" /> {qr.label}
          </Button>
        ))}
      </div>

      {/* Category Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Reports</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categoryConfig.map((cat) => {
            const Icon = cat.icon
            const count = templates.filter((t) => t.category === cat.key).length
            const isActive = selectedCategory === cat.key
            return (
              <Card
                key={cat.key}
                className={cn(
                  "rounded-2xl border border-slate-200 bg-white shadow-sm p-4 cursor-pointer transition-all hover:shadow-md text-center",
                  isActive && "ring-2 ring-[#8B5CF6] border-[#8B5CF6]"
                )}
                onClick={() => setSelectedCategory(isActive ? null : cat.key)}
              >
                <div className={cn("mx-auto w-10 h-10 rounded-xl flex items-center justify-center mb-2", cat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">{cat.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{count} templates</p>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Selected Category Templates */}
      {selectedCategory && (
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">{selectedCategory} Templates</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="text-xs text-slate-400">
              Clear Filter
            </Button>
          </div>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No templates in this category yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((tmpl) => (
                <Card key={tmpl.id} className="rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all">
                  <h4 className="font-bold text-sm text-slate-800">{tmpl.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-xs font-bold" onClick={() => handleQuickGenerate(tmpl.name, tmpl.category)}>
                      <Play className="mr-1 h-3 w-3" /> Generate
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => handlePreview(tmpl)}>
                      <Eye className="mr-1 h-3 w-3" /> Preview
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Recently Generated */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">Recently Generated</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">{recentRuns.length} reports</Badge>
            {recentRuns.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs text-red-500 font-bold hover:text-red-600" onClick={() => setClearAllOpen(true)}>
                <Trash2 className="mr-1 h-3 w-3" /> Clear All
              </Button>
            )}
          </div>
        </div>
        {recentRuns.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FileText className="h-10 w-10 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No reports generated yet</p>
            <p className="text-xs mt-1">Use Quick Generate or build a Custom Report to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Report Name</TableHead>
                <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Type</TableHead>
                <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Generated By</TableHead>
                <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Date</TableHead>
                <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Rows</TableHead>
                <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Download</TableHead>
                <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRuns.slice(0, 8).map((run) => (
                <TableRow key={run.id} className="hover:bg-slate-50">
                  <TableCell className="font-semibold text-sm text-slate-800">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      {run.reportName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold rounded-full">{run.type}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{run.ranBy}</TableCell>
                  <TableCell className="text-xs text-slate-500">{run.ranDate}</TableCell>
                  <TableCell className="text-xs text-slate-500">{run.rowCount}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-[#8B5CF6] hover:text-[#7C3AED] text-xs font-bold" onClick={() => handleDownload(run.reportName, run.format)}>
                      <Download className="mr-1 h-3 w-3" /> {run.format}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="h-4 w-4 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => handleRerun(run.reportName, run.type)} className="text-xs">
                          <RefreshCw className="mr-2 h-3.5 w-3.5" /> Re-run
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(run.reportName, run.format)} className="text-xs">
                          <Download className="mr-2 h-3.5 w-3.5" /> Download {run.format}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setDeleteRunId(run.id)} className="text-xs text-red-500 focus:text-red-600">
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Scheduled & Popular in 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduled Reports */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Scheduled Reports</h2>
            <Button variant="ghost" size="sm" className="text-xs text-[#8B5CF6] font-bold" onClick={() => router.push("/hrmcubicle/reports/scheduled")}>
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          {scheduledReports.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              No schedules yet. Create one from Scheduled Reports.
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledReports.slice(0, 4).map((sch) => (
                <div key={sch.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{sch.reportName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[9px] font-bold rounded-full capitalize">{sch.frequency}</Badge>
                      <span className="text-[10px] text-slate-400">{sch.recipients.length} recipient(s)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Next Run</p>
                    <p className="text-xs font-bold text-slate-700">{sch.nextRun}</p>
                    <Badge className={cn("text-[9px] mt-1 rounded-full", sch.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                      {sch.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Popular Reports */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Popular Reports</h2>
            <Button variant="ghost" size="sm" className="text-xs text-[#8B5CF6] font-bold" onClick={() => router.push("/hrmcubicle/reports/templates")}>
              All Templates <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-3">
            {popularTemplates.map((tmpl) => (
              <div key={tmpl.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all cursor-pointer" onClick={() => handlePreview(tmpl)}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{tmpl.name}</p>
                    <p className="text-[10px] text-slate-400">{tmpl.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tmpl.isFavorite && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
                  <Badge variant="outline" className="text-[9px] font-bold rounded-full">{tmpl.popularity}% used</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 cursor-pointer hover:shadow-md transition-all group"
          onClick={() => router.push("/hrmcubicle/reports/builder")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
              <PieChart className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Custom Report Builder</p>
              <p className="text-xs text-slate-400">Build reports with custom data sources</p>
            </div>
          </div>
        </Card>
        <Card
          className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 cursor-pointer hover:shadow-md transition-all group"
          onClick={() => router.push("/hrmcubicle/reports/scheduled")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Scheduled Reports</p>
              <p className="text-xs text-slate-400">Manage automated report delivery</p>
            </div>
          </div>
        </Card>
        <Card
          className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 cursor-pointer hover:shadow-md transition-all group"
          onClick={() => router.push("/hrmcubicle/reports/templates")}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Report Templates</p>
              <p className="text-xs text-slate-400">Browse pre-built report templates</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Template Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
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
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</p>
                <Badge className="bg-violet-100 text-violet-700 text-xs rounded-full">{previewTemplate.category}</Badge>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={() => { if (previewTemplate) handleQuickGenerate(previewTemplate.name, previewTemplate.category); setPreviewOpen(false) }}>
              <Play className="mr-1 h-4 w-4" /> Generate Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Run Confirmation */}
      <Dialog open={!!deleteRunId} onOpenChange={() => setDeleteRunId(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Delete Report Run</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">Remove this entry from your recent runs? This action cannot be undone.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setDeleteRunId(null)}>Cancel</Button>
            <Button variant="destructive" className="rounded-xl font-bold" onClick={() => deleteRunId && handleDeleteRun(deleteRunId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Confirmation */}
      <Dialog open={clearAllOpen} onOpenChange={setClearAllOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Clear All History</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">This will remove all {recentRuns.length} recent report runs. Continue?</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setClearAllOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="rounded-xl font-bold" onClick={handleClearAll}>Clear All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReportsDashboardPage
