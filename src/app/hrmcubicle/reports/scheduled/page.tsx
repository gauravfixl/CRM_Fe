"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, CalendarClock, Edit, Mail, Pause, Play, Plus, RefreshCw, Search, Send,
  Trash2, X, CheckCircle2, AlertCircle
} from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
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
import { useReportsStore, ScheduledReport } from "@/shared/data/reports-store"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

const ScheduledReportsPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const {
    scheduledReports, savedReports, scheduleHistory,
    addScheduledReport, updateScheduledReport, deleteScheduledReport, addScheduleHistory,
    deleteScheduleHistory, clearScheduleHistory,
  } = useReportsStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    reportId: "",
    reportName: "",
    frequency: "weekly" as "daily" | "weekly" | "monthly",
    day: "Monday",
    time: "09:00",
    recipients: "",
    format: "PDF" as "PDF" | "Excel" | "CSV",
  })
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteHistoryId, setDeleteHistoryId] = useState<string | null>(null)
  const [clearHistoryOpen, setClearHistoryOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Paused">("all")
  const [formErrors, setFormErrors] = useState<{ reportId?: string; recipients?: string; time?: string; day?: string }>({})

  const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  const parseRecipients = (raw: string) =>
    raw.split(",").map((e) => e.trim()).filter(Boolean)

  const validateForm = (f: typeof form): typeof formErrors => {
    const errs: typeof formErrors = {}
    if (!f.reportId) errs.reportId = "Select a saved report"

    const emails = parseRecipients(f.recipients)
    if (emails.length === 0) {
      errs.recipients = "Add at least one recipient email"
    } else {
      const invalid = emails.filter((e) => !EMAIL_REGEX.test(e))
      const duplicates = emails.filter((e, i) => emails.indexOf(e) !== i)
      if (invalid.length) errs.recipients = `Invalid email(s): ${invalid.slice(0, 2).join(", ")}${invalid.length > 2 ? "..." : ""}`
      else if (duplicates.length) errs.recipients = `Duplicate email(s): ${[...new Set(duplicates)].slice(0, 2).join(", ")}`
      else if (emails.length > 20) errs.recipients = "Max 20 recipients allowed"
    }

    if (!f.time || !/^\d{2}:\d{2}$/.test(f.time)) errs.time = "Valid time required (HH:MM)"

    if (f.frequency === "weekly" && !f.day) errs.day = "Day of week required"
    if (f.frequency === "monthly" && !f.day) errs.day = "Day of month required"

    return errs
  }

  const searchLower = search.trim().toLowerCase()
  const filteredSchedules = scheduledReports.filter((sch) => {
    const matchesSearch = !searchLower ||
      sch.reportName.toLowerCase().includes(searchLower) ||
      sch.recipients.some((r) => r.toLowerCase().includes(searchLower))
    const matchesStatus = statusFilter === "all" || sch.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const filteredHistory = scheduleHistory.filter((h) =>
    !searchLower || h.reportName.toLowerCase().includes(searchLower)
  )

  const resetForm = () => {
    setForm({ reportId: "", reportName: "", frequency: "weekly", day: "Monday", time: "09:00", recipients: "", format: "PDF" })
    setEditingId(null)
    setFormErrors({})
  }

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    const next = { ...form, [key]: value }
    setForm(next)
    if (Object.keys(formErrors).length > 0) setFormErrors(validateForm(next))
  }

  const openNew = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (sch: ScheduledReport) => {
    setEditingId(sch.id)
    setForm({
      reportId: sch.reportId,
      reportName: sch.reportName,
      frequency: sch.frequency,
      day: sch.day || "Monday",
      time: sch.time || "09:00",
      recipients: sch.recipients.join(", "),
      format: sch.format,
    })
    setDialogOpen(true)
  }

  const handleSave = () => {
    const errs = validateForm(form)
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast({ title: "Fix validation errors", description: "One or more fields need attention.", variant: "destructive" })
      return
    }
    const recipientList = parseRecipients(form.recipients)

    if (editingId) {
      updateScheduledReport(editingId, {
        reportId: form.reportId,
        reportName: form.reportName,
        frequency: form.frequency,
        recipients: recipientList,
        format: form.format,
        day: form.day,
        time: form.time,
      })
      toast({ title: "Schedule Updated", description: `Schedule for "${form.reportName}" updated.` })
    } else {
      addScheduledReport({
        id: `SCH${Date.now()}`,
        reportId: form.reportId,
        reportName: form.reportName,
        frequency: form.frequency,
        recipients: recipientList,
        nextRun: getNextRun(form.frequency, form.day),
        lastSent: "Never",
        format: form.format,
        status: "Active",
        day: form.day,
        time: form.time,
      })
      toast({ title: "Schedule Created", description: `"${form.reportName}" has been scheduled.` })
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleTestRun = (sch: ScheduledReport) => {
    addScheduleHistory({
      id: `SH${Date.now()}`,
      scheduleId: sch.id,
      reportName: sch.reportName,
      sentDate: new Date().toISOString().split("T")[0],
      recipients: sch.recipients,
      status: "Sent",
      format: sch.format,
    })
    toast({ title: "Test Run Complete", description: `"${sch.reportName}" sent to ${sch.recipients.length} recipient(s).` })
  }

  const handleToggleStatus = (sch: ScheduledReport) => {
    updateScheduledReport(sch.id, { status: sch.status === "Active" ? "Paused" : "Active" })
    toast({ title: "Status Updated", description: `Schedule ${sch.status === "Active" ? "paused" : "activated"}.` })
  }

  const handleDelete = (id: string) => {
    deleteScheduledReport(id)
    setDeleteConfirmId(null)
    toast({ title: "Deleted", description: "Schedule has been removed." })
  }

  const handleDeleteHistory = (id: string) => {
    deleteScheduleHistory(id)
    setDeleteHistoryId(null)
    toast({ title: "Deleted", description: "History entry removed." })
  }

  const handleClearHistory = () => {
    clearScheduleHistory()
    setClearHistoryOpen(false)
    toast({ title: "History Cleared", description: "All history entries removed." })
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
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Scheduled Reports</h1>
            <p className="text-sm text-slate-500">Automate report generation and delivery</p>
          </div>
        </div>
        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> New Schedule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Schedules", value: scheduledReports.filter((s) => s.status === "Active").length, color: "text-emerald-600 bg-emerald-50", icon: CheckCircle2 },
          { label: "Paused", value: scheduledReports.filter((s) => s.status === "Paused").length, color: "text-amber-600 bg-amber-50", icon: Pause },
          { label: "Total Sent", value: scheduleHistory.filter((h) => h.status === "Sent").length, color: "text-blue-600 bg-blue-50", icon: Send },
          { label: "Failed", value: scheduleHistory.filter((h) => h.status === "Failed").length, color: "text-red-600 bg-red-50", icon: AlertCircle },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by report name or recipient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9 rounded-xl"
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
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-40 rounded-xl text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="schedules" className="flex-1">
        <TabsList className="bg-slate-100 rounded-xl p-1 mb-4">
          <TabsTrigger value="schedules" className="rounded-lg text-xs font-bold px-4">Active Schedules</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg text-xs font-bold px-4">History</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Report Name</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Frequency</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Recipients</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Next Run</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Last Sent</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Format</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-sm">
                      {scheduledReports.length === 0
                        ? 'No scheduled reports. Click "New Schedule" to create one.'
                        : "No schedules match your search/filter."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchedules.map((sch) => (
                    <TableRow
                      key={sch.id}
                      onClick={() => openEdit(sch)}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <TableCell className="font-semibold text-sm text-slate-800">{sch.reportName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold rounded-full capitalize">{sch.frequency}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="text-xs text-slate-500">{sch.recipients.length}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{sch.nextRun}</TableCell>
                      <TableCell className="text-xs text-slate-500">{sch.lastSent}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold rounded-full">{sch.format}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px] rounded-full", sch.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
                          {sch.status}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleTestRun(sch)} title="Test Run">
                            <Play className="h-3 w-3 text-[#8B5CF6]" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleToggleStatus(sch)} title={sch.status === "Active" ? "Pause" : "Resume"}>
                            {sch.status === "Active" ? <Pause className="h-3 w-3 text-amber-500" /> : <RefreshCw className="h-3 w-3 text-emerald-500" />}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(sch)} title="Edit">
                            <Edit className="h-3 w-3 text-slate-400" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setDeleteConfirmId(sch.id)} title="Delete">
                            <Trash2 className="h-3 w-3 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 pt-4">
              <p className="text-xs text-slate-400 font-bold">
                {filteredHistory.length} {filteredHistory.length === 1 ? "entry" : "entries"}
              </p>
              {scheduleHistory.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs text-red-500 font-bold hover:text-red-600" onClick={() => setClearHistoryOpen(true)}>
                  <Trash2 className="mr-1 h-3 w-3" /> Clear All
                </Button>
              )}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Report Name</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Sent Date</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Recipients</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Format</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                      {scheduleHistory.length === 0 ? "No history yet." : "No entries match your search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-slate-50">
                      <TableCell className="font-semibold text-sm text-slate-800">{entry.reportName}</TableCell>
                      <TableCell className="text-xs text-slate-500">{entry.sentDate}</TableCell>
                      <TableCell className="text-xs text-slate-500">{entry.recipients.join(", ")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold rounded-full">{entry.format}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px] rounded-full",
                          entry.status === "Sent" ? "bg-emerald-100 text-emerald-700" :
                          entry.status === "Failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setDeleteHistoryId(entry.id)} title="Delete">
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New/Edit Dialog */}
      <SideFormSheet
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setFormErrors({}) }}
        title={editingId ? "Edit Schedule" : "New Scheduled Report"}
        description="Automate report generation and email delivery on a recurring schedule."
        icon={<CalendarClock size={20} />}
        accentColor={editingId ? "#7c3aed" : "#8B5CF6"}
        width="lg"
        submitLabel={editingId ? "Update Schedule" : "Create Schedule"}
        submitDisabled={Object.keys(validateForm(form)).length > 0}
        onSubmit={(e) => { e.preventDefault(); handleSave() }}
        hideFooter={savedReports.length === 0}
      >
        {savedReports.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="h-10 w-10 mx-auto text-amber-400 mb-3" />
            <p className="text-sm font-bold text-slate-700">No saved reports yet</p>
            <p className="text-xs text-slate-500 mt-1">Create and save a report from the Report Builder first.</p>
            <Button
              className="mt-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold"
              onClick={() => { setDialogOpen(false); router.push("/hrmcubicle/reports/builder") }}
            >
              Go to Builder
            </Button>
          </div>
        ) : (
        <div className="space-y-4">
          <Field label="Saved Report" required error={formErrors.reportId || undefined}>
            <Select
              value={form.reportId}
              onValueChange={(v) => {
                const r = savedReports.find((sr) => sr.id === v)
                const next = { ...form, reportId: v, reportName: r?.name || "" }
                setForm(next)
                if (Object.keys(formErrors).length > 0) setFormErrors(validateForm(next))
              }}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select a saved report..." />
              </SelectTrigger>
              <SelectContent>
                {savedReports.map((sr) => (
                  <SelectItem key={sr.id} value={sr.id} className="text-xs">{sr.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Frequency">
              <Select value={form.frequency} onValueChange={(v) => updateField("frequency", v as typeof form.frequency)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {form.frequency !== "daily" && (
              <Field
                label={form.frequency === "weekly" ? "Day of Week" : "Day of Month"}
                required
                error={formErrors.day || undefined}
              >
                {form.frequency === "weekly" ? (
                  <Select value={form.day} onValueChange={(v) => updateField("day", v)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Select value={form.day} onValueChange={(v) => updateField("day", v)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["1", "5", "10", "15", "20", "25", "Last Day"].map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            )}
          </div>
          <Field label="Time" required error={formErrors.time || undefined}>
            <Input
              value={form.time}
              onChange={(e) => updateField("time", e.target.value)}
              type="time"
            />
          </Field>
          <Field
            label="Recipients"
            required
            error={formErrors.recipients || undefined}
            hint={
              !formErrors.recipients && parseRecipients(form.recipients).length > 0
                ? `${parseRecipients(form.recipients).length} valid recipient(s)`
                : "Comma-separated emails, max 20"
            }
          >
            <Input
              value={form.recipients}
              onChange={(e) => updateField("recipients", e.target.value)}
              onBlur={() => setFormErrors(validateForm(form))}
              placeholder="hr@company.com, admin@company.com"
            />
          </Field>
          <Field label="Format">
            <Select value={form.format} onValueChange={(v) => updateField("format", v as typeof form.format)}>
              <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Excel">Excel</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        )}
      </SideFormSheet>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Delete Schedule</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">Are you sure you want to delete this schedule? This action cannot be undone.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" className="rounded-xl font-bold" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete History Confirmation */}
      <Dialog open={!!deleteHistoryId} onOpenChange={() => setDeleteHistoryId(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Delete History Entry</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">Remove this history entry? This action cannot be undone.</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setDeleteHistoryId(null)}>Cancel</Button>
            <Button variant="destructive" className="rounded-xl font-bold" onClick={() => deleteHistoryId && handleDeleteHistory(deleteHistoryId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear History Confirmation */}
      <Dialog open={clearHistoryOpen} onOpenChange={setClearHistoryOpen}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Clear All History</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">This will remove all {scheduleHistory.length} history entries. Continue?</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setClearHistoryOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="rounded-xl font-bold" onClick={handleClearHistory}>Clear All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getNextRun(frequency: string, day: string): string {
  const now = new Date()
  if (frequency === "daily") {
    now.setDate(now.getDate() + 1)
  } else if (frequency === "weekly") {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const target = days.indexOf(day)
    const current = now.getDay()
    const diff = target > current ? target - current : 7 - current + target
    now.setDate(now.getDate() + (diff || 7))
  } else {
    now.setMonth(now.getMonth() + 1)
    const d = parseInt(day)
    if (!isNaN(d)) now.setDate(d)
  }
  return now.toISOString().split("T")[0]
}

export default ScheduledReportsPage
