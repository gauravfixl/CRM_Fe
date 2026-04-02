"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, Download,
  Eye, FileText, Filter, GripVertical, Layers, Play, Plus, Save,
  Settings, Trash2, X
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
import { useReportsStore, ReportFilter } from "@/shared/data/reports-store"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

const dataSources = [
  { id: "employees", label: "Employees", icon: "👥", columns: ["Employee ID", "Name", "Email", "Department", "Designation", "Location", "Join Date", "Status", "Manager", "Salary", "Experience"] },
  { id: "attendance", label: "Attendance", icon: "🕐", columns: ["Employee ID", "Name", "Department", "Date", "Check In", "Check Out", "Total Hours", "Status", "Late", "Overtime"] },
  { id: "leaves", label: "Leaves", icon: "📅", columns: ["Employee ID", "Name", "Department", "Leave Type", "From Date", "To Date", "Days", "Status", "Approver", "Reason"] },
  { id: "payroll", label: "Payroll", icon: "💰", columns: ["Employee ID", "Name", "Department", "Basic", "HRA", "DA", "Special Allowance", "PF", "ESI", "TDS", "Deductions", "Net Pay", "CTC"] },
  { id: "performance", label: "Performance", icon: "📊", columns: ["Employee ID", "Name", "Department", "Rating", "Self Rating", "Manager Rating", "Goals Set", "Goals Achieved", "Review Period"] },
  { id: "recruitment", label: "Recruitment", icon: "💼", columns: ["Job ID", "Job Title", "Department", "Candidates", "Screened", "Interviewed", "Offered", "Joined", "Time to Hire", "Source"] },
]

const operators = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "between", label: "Between" },
]

const generateMockData = (source: string, columns: string[]) => {
  const names = ["Aditya Singh", "Priya Sharma", "Rahul Verma", "Sneha Patel", "Drashi Garg", "Arjun Mehta", "Kavya Reddy", "Vikram Joshi", "Ananya Gupta", "Rohan Kumar"]
  const depts = ["Engineering", "Product", "Design", "Marketing", "HR", "Finance"]
  const rows: Record<string, string>[] = []
  for (let i = 0; i < 10; i++) {
    const row: Record<string, string> = {}
    columns.forEach((col) => {
      if (col.toLowerCase().includes("id")) row[col] = `E${String(100 + i).padStart(3, "0")}`
      else if (col.toLowerCase().includes("name") && !col.toLowerCase().includes("job")) row[col] = names[i]
      else if (col.toLowerCase().includes("department")) row[col] = depts[i % depts.length]
      else if (col.toLowerCase().includes("email")) row[col] = `${names[i].toLowerCase().replace(" ", ".")}@company.com`
      else if (col.toLowerCase().includes("date")) row[col] = `2026-03-${String(10 + i).padStart(2, "0")}`
      else if (col.toLowerCase().includes("salary") || col.toLowerCase().includes("basic") || col.toLowerCase().includes("hra") || col.toLowerCase().includes("net") || col.toLowerCase().includes("ctc")) row[col] = `₹${(30000 + Math.floor(Math.random() * 70000)).toLocaleString()}`
      else if (col.toLowerCase().includes("hours")) row[col] = `${7 + Math.floor(Math.random() * 3)}h ${Math.floor(Math.random() * 60)}m`
      else if (col.toLowerCase().includes("status")) row[col] = ["Active", "On Leave", "Active", "Active", "Probation"][i % 5]
      else if (col.toLowerCase().includes("rating")) row[col] = `${(3 + Math.random() * 2).toFixed(1)}`
      else if (col.toLowerCase().includes("days") || col.toLowerCase().includes("count") || col.toLowerCase().includes("set") || col.toLowerCase().includes("achieved")) row[col] = `${Math.floor(Math.random() * 20) + 1}`
      else row[col] = `Sample ${i + 1}`
    })
    rows.push(row)
  }
  return rows
}

const steps = ["Data Source", "Columns", "Filters", "Preview", "Save / Export"]

const CustomReportBuilderPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { addSavedReport, addReportRun } = useReportsStore()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([])
  const [filters, setFilters] = useState<ReportFilter[]>([])
  const [groupBy, setGroupBy] = useState<string>("")
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [reportName, setReportName] = useState("")
  const [reportSchedule, setReportSchedule] = useState<"none" | "daily" | "weekly" | "monthly">("none")

  const sourceData = dataSources.find((ds) => ds.id === selectedSource)
  const availableColumns = sourceData?.columns || []

  const toggleColumn = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    )
  }

  const moveColumn = (index: number, direction: "up" | "down") => {
    const newCols = [...selectedColumns]
    const target = direction === "up" ? index - 1 : index + 1
    if (target < 0 || target >= newCols.length) return
    ;[newCols[index], newCols[target]] = [newCols[target], newCols[index]]
    setSelectedColumns(newCols)
  }

  const addFilter = () => {
    setFilters([...filters, { field: availableColumns[0] || "", operator: "equals", value: "" }])
  }

  const updateFilter = (index: number, updates: Partial<ReportFilter>) => {
    setFilters(filters.map((f, i) => (i === index ? { ...f, ...updates } : f)))
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const previewData = selectedColumns.length > 0 && selectedSource
    ? generateMockData(selectedSource, selectedColumns)
    : []

  const canProceed = () => {
    if (currentStep === 0) return !!selectedSource
    if (currentStep === 1) return selectedColumns.length > 0
    return true
  }

  const handleExport = (format: string) => {
    addReportRun({
      id: `RR${Date.now()}`,
      reportName: reportName || "Custom Report",
      type: "Custom",
      ranBy: "Admin",
      ranDate: new Date().toISOString().split("T")[0],
      rowCount: previewData.length,
      format,
    })
    toast({ title: "Export Started", description: `Report exported as ${format} successfully.` })
  }

  const handleSave = () => {
    if (!reportName.trim()) {
      toast({ title: "Error", description: "Please enter a report name.", variant: "destructive" })
      return
    }
    addSavedReport({
      id: `SR${Date.now()}`,
      name: reportName,
      type: "Custom",
      filters,
      columns: selectedColumns,
      lastRun: new Date().toISOString().split("T")[0],
      schedule: reportSchedule,
      createdBy: "Admin",
      createdDate: new Date().toISOString().split("T")[0],
    })
    toast({ title: "Report Saved", description: `"${reportName}" has been saved successfully.` })
    setSaveDialogOpen(false)
  }

  return (
    <div className="flex-1 p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/hrmcubicle/reports")} className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Custom Report Builder</h1>
          <p className="text-sm text-slate-500">Build reports with your preferred data sources and columns</p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                idx === currentStep
                  ? "bg-[#8B5CF6] text-white shadow-lg shadow-violet-200"
                  : idx < currentStep
                  ? "bg-violet-100 text-violet-700"
                  : "bg-slate-100 text-slate-400"
              )}
              onClick={() => idx <= currentStep && setCurrentStep(idx)}
            >
              {idx < currentStep ? <Check className="h-3.5 w-3.5" /> : <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{idx + 1}</span>}
              {step}
            </button>
            {idx < steps.length - 1 && <div className={cn("h-[2px] w-8", idx < currentStep ? "bg-violet-300" : "bg-slate-200")} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 flex-1">
        {/* Step 1: Data Source */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800">Select Data Source</h3>
            <p className="text-sm text-slate-500">Choose the module you want to pull data from.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {dataSources.map((ds) => (
                <Card
                  key={ds.id}
                  className={cn(
                    "rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md",
                    selectedSource === ds.id ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6] bg-violet-50" : "border-slate-200"
                  )}
                  onClick={() => { setSelectedSource(ds.id); setSelectedColumns([]); setFilters([]) }}
                >
                  <span className="text-2xl">{ds.icon}</span>
                  <p className="text-sm font-bold text-slate-800 mt-2">{ds.label}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{ds.columns.length} fields available</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Columns */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800">Choose Columns</h3>
            <p className="text-sm text-slate-500">Select and reorder the columns for your report.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Available */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Available Columns</p>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {availableColumns.map((col) => (
                    <label
                      key={col}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        selectedColumns.includes(col) ? "border-[#8B5CF6] bg-violet-50" : "border-slate-100 hover:bg-slate-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(col)}
                        onChange={() => toggleColumn(col)}
                        className="rounded border-slate-300 text-[#8B5CF6] focus:ring-[#8B5CF6]"
                      />
                      <span className="text-sm text-slate-700 font-medium">{col}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Selected order */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Selected Columns ({selectedColumns.length})
                </p>
                {selectedColumns.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm">Select columns from the left</div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {selectedColumns.map((col, idx) => (
                      <div key={col} className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50">
                        <GripVertical className="h-4 w-4 text-slate-300" />
                        <span className="text-sm text-slate-700 font-medium flex-1">{col}</span>
                        <button onClick={() => moveColumn(idx, "up")} disabled={idx === 0} className="p-1 hover:bg-white rounded disabled:opacity-30">
                          <ChevronUp className="h-3 w-3 text-slate-500" />
                        </button>
                        <button onClick={() => moveColumn(idx, "down")} disabled={idx === selectedColumns.length - 1} className="p-1 hover:bg-white rounded disabled:opacity-30">
                          <ChevronDown className="h-3 w-3 text-slate-500" />
                        </button>
                        <button onClick={() => toggleColumn(col)} className="p-1 hover:bg-red-50 rounded">
                          <X className="h-3 w-3 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Filters */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Apply Filters</h3>
                <p className="text-sm text-slate-500">Add conditions to narrow down your report data.</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-xl text-xs font-bold" onClick={addFilter}>
                <Plus className="mr-1 h-3 w-3" /> Add Filter
              </Button>
            </div>

            {filters.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Filter className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                <p className="text-sm font-medium">No filters applied</p>
                <p className="text-xs mt-1">Click "Add Filter" to narrow down results</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filters.map((filter, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <Select value={filter.field} onValueChange={(v) => updateFilter(idx, { field: v })}>
                      <SelectTrigger className="w-44 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {selectedColumns.map((col) => (
                          <SelectItem key={col} value={col} className="text-xs">{col}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filter.operator} onValueChange={(v) => updateFilter(idx, { operator: v as ReportFilter["operator"] })}>
                      <SelectTrigger className="w-36 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value} className="text-xs">{op.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={filter.value}
                      onChange={(e) => updateFilter(idx, { value: e.target.value })}
                      placeholder="Value..."
                      className="flex-1 rounded-lg text-xs"
                    />
                    {filter.operator === "between" && (
                      <Input
                        value={filter.value2 || ""}
                        onChange={(e) => updateFilter(idx, { value2: e.target.value })}
                        placeholder="To..."
                        className="w-32 rounded-lg text-xs"
                      />
                    )}
                    <button onClick={() => removeFilter(idx)} className="p-2 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Group By */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Group By / Pivot (Optional)</p>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="w-64 rounded-xl text-xs"><SelectValue placeholder="Select grouping column..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">None</SelectItem>
                  {selectedColumns.map((col) => (
                    <SelectItem key={col} value={col} className="text-xs">{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800">Preview</h3>
                <p className="text-sm text-slate-500">Showing first 10 rows of mock data. Filters: {filters.length}, Group by: {groupBy || "None"}</p>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold">{previewData.length} rows</Badge>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedColumns.map((col) => (
                      <TableHead key={col} className="font-bold text-slate-300 text-[9px] uppercase tracking-widest whitespace-nowrap">{col}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.map((row, i) => (
                    <TableRow key={i} className="hover:bg-slate-50">
                      {selectedColumns.map((col) => (
                        <TableCell key={col} className="text-xs text-slate-600 whitespace-nowrap">{row[col]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Step 5: Save/Export */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-800">Save & Export</h3>
            <p className="text-sm text-slate-500">Export this report or save it as a template for future use.</p>

            {/* Export Options */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Export Now</p>
              <div className="flex gap-3">
                {["CSV", "Excel", "PDF"].map((fmt) => (
                  <Button key={fmt} variant="outline" className="rounded-xl font-bold" onClick={() => handleExport(fmt)}>
                    <Download className="mr-2 h-4 w-4" /> Export as {fmt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Save as Template */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Save as Template</p>
              <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={() => setSaveDialogOpen(true)}>
                <Save className="mr-2 h-4 w-4" /> Save Report
              </Button>
            </div>

            {/* Summary */}
            <Card className="rounded-xl border border-slate-100 p-4 bg-slate-50">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Report Summary</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400">Data Source</p>
                  <p className="text-sm font-bold text-slate-700 capitalize">{selectedSource}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Columns</p>
                  <p className="text-sm font-bold text-slate-700">{selectedColumns.length}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Filters</p>
                  <p className="text-sm font-bold text-slate-700">{filters.length}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">Preview Rows</p>
                  <p className="text-sm font-bold text-slate-700">{previewData.length}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="rounded-xl font-bold"
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        {currentStep < steps.length - 1 && (
          <Button
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold"
            onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={!canProceed()}
          >
            Next <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Save Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Report Name</label>
              <Input
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name..."
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Schedule</label>
              <Select value={reportSchedule} onValueChange={(v) => setReportSchedule(v as typeof reportSchedule)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Schedule</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={handleSave}>
              <Save className="mr-1 h-4 w-4" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomReportBuilderPage
