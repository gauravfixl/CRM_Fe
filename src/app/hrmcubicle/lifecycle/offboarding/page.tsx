"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  LogOut, MessageSquare, UserCheck, AlertCircle, Calendar,
  ArrowRight, Search, Users, RotateCcw, Undo2, ClipboardCheck,
} from "lucide-react"
import { Card } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { useToast } from "@/shared/components/ui/use-toast"
import { Input } from "@/shared/components/ui/input"
import { useLifecycleStore, LifecycleEmployee } from "@/shared/data/lifecycle-store"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/lib/utils"

const TODAY = new Date().toISOString().split('T')[0]

const ExitManagementPage = () => {
  const { toast } = useToast()
  const { employees, initiateExit, cancelExit } = useLifecycleStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState<"All" | "Notice" | "Exited">("All")
  const [detailEmp, setDetailEmp] = useState<LifecycleEmployee | null>(null)

  const [isInitiateOpen, setIsInitiateOpen] = useState(false)
  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [withdrawEmp, setWithdrawEmp] = useState<LifecycleEmployee | null>(null)

  const [selectedEmpId, setSelectedEmpId] = useState("")
  const [exitReason, setExitReason] = useState("")
  const [lwd, setLwd] = useState("")

  const offboardingList = useMemo(() => employees.filter(e => {
    const isOffboarding = e.status === "Notice Period" || e.status === "Exited"
    const q = searchTerm.toLowerCase()
    const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)
    let matchesFilter = true
    if (filterActive === "Notice") matchesFilter = e.status === "Notice Period"
    if (filterActive === "Exited") matchesFilter = e.status === "Exited"
    return isOffboarding && matchesSearch && matchesFilter
  }), [employees, searchTerm, filterActive])

  const activeEmployees = employees.filter(e => e.status === "Active" || e.status === "Probation")
  const noticeCount = employees.filter(e => e.status === "Notice Period").length
  const exitedCount = employees.filter(e => e.status === "Exited").length

  const clearanceProgress = (emp: LifecycleEmployee) => {
    if (!emp.clearance) return 0
    const { it, finance, admin, manager } = emp.clearance
    return Math.round(([it, finance, admin, manager].filter(Boolean).length / 4) * 100)
  }

  const resetForm = () => { setSelectedEmpId(""); setExitReason(""); setLwd("") }

  const openInitiate = () => {
    resetForm()
    setIsInitiateOpen(true)
  }

  const handleInitiateReview = () => {
    if (!selectedEmpId || !exitReason.trim() || !lwd) {
      toast({ title: "Incomplete details", description: "Please fill all fields.", variant: "destructive" })
      return
    }
    setIsInitiateOpen(false)
    setIsConfirmExitOpen(true)
  }

  const confirmInitiate = () => {
    const empName = employees.find(e => e.id === selectedEmpId)?.name
    initiateExit(selectedEmpId, exitReason.trim(), lwd)
    setIsConfirmExitOpen(false)
    resetForm()
    toast({ title: "Exit Initiated", description: `${empName} moved to Notice Period. Proceed to Clearance.` })
  }

  const openWithdraw = (emp: LifecycleEmployee) => {
    setWithdrawEmp(emp)
    setIsWithdrawOpen(true)
  }

  const confirmWithdraw = () => {
    if (!withdrawEmp) return
    cancelExit(withdrawEmp.id)
    toast({ title: "Exit Withdrawn", description: `${withdrawEmp.name} restored to Active status.` })
    setIsWithdrawOpen(false)
    setWithdrawEmp(null)
    setDetailEmp(null)
  }

  const handleReset = () => { localStorage.clear(); window.location.reload() }

  return (
    <div className="flex-1 p-4 min-h-screen flex flex-col bg-[#fcfdff] space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Exit Management</h1>
          <p className="text-[10px] text-slate-500 font-bold mt-0.5">Stage 7: Manage resignations, notice periods and separations.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" className="rounded-xl font-bold border-slate-200 h-9 px-4 text-[10px] text-slate-500" onClick={() => setIsResetOpen(true)}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> System Reset
          </Button>
          <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold h-9 px-4 shadow-lg shadow-rose-100 text-[10px]" onClick={openInitiate} disabled={activeEmployees.length === 0}>
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> Initiate Exit
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Resignations", value: noticeCount, icon: LogOut, bg: "bg-[#F0C1E1]", filter: "Notice" as const },
          { label: "Exits Recorded", value: exitedCount, icon: UserCheck, bg: "bg-[#CB9DF0]", filter: "Exited" as const },
          { label: "Total Transitions", value: noticeCount + exitedCount, icon: Users, bg: "bg-[#FDDBBB]", filter: "All" as const },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className={cn(
                "rounded-2xl border-none shadow-sm p-4 cursor-pointer transition-all hover:shadow-md",
                stat.bg,
                filterActive === stat.filter && "ring-2 ring-rose-300"
              )}
              onClick={() => setFilterActive(stat.filter)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/30 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-slate-800" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-0.5">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Separation queue */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm flex-1">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-sm font-bold text-slate-800">Separation Queue</h3>
            <Badge variant="outline" className="text-[10px] font-bold">{offboardingList.length} shown</Badge>
            {filterActive !== 'All' && (
              <Button variant="ghost" size="sm" onClick={() => setFilterActive('All')} className="h-7 px-3 text-[10px] font-bold text-slate-500">Clear filter</Button>
            )}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search name, dept, role..." className="pl-9 rounded-xl h-9 text-xs font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>

        <div className="p-4 space-y-3">
          {offboardingList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <AlertCircle className="h-12 w-12 mx-auto text-slate-200" />
              <p className="text-xs text-slate-400 font-bold">
                {employees.filter(e => e.status === "Notice Period" || e.status === "Exited").length === 0
                  ? 'No separations in progress.'
                  : 'No results match your filter.'}
              </p>
            </div>
          ) : offboardingList.map((emp) => {
            const progress = clearanceProgress(emp)
            return (
              <div
                key={emp.id}
                onClick={() => setDetailEmp(emp)}
                className={cn("flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-xl border transition-all hover:shadow-sm cursor-pointer", emp.status === "Notice Period" ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/50 opacity-90")}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarFallback className="bg-violet-100 text-violet-600 text-xs font-bold rounded-xl">{emp.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{emp.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{emp.role} — {emp.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {emp.exitReason && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold" title={emp.exitReason}>
                      <MessageSquare className="h-3 w-3 text-slate-400" />
                      <span className="max-w-[180px] truncate">{emp.exitReason}</span>
                    </div>
                  )}
                  {emp.lwd && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>{emp.lwd}</span>
                    </div>
                  )}
                  {emp.status === "Notice Period" && (
                    <div className="flex items-center gap-1.5">
                      <ClipboardCheck className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500">Clearance: {progress}%</span>
                    </div>
                  )}
                  <Badge className={cn("text-[9px] rounded-full font-bold", emp.status === "Notice Period" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500")}>
                    {emp.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500" onClick={() => setDetailEmp(emp)} title="View details">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Initiate Exit Dialog */}
      <Dialog open={isInitiateOpen} onOpenChange={setIsInitiateOpen}>
        <DialogContent className="max-w-lg rounded-2xl border-2 border-slate-200 p-6 bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Initiate Separation</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400">Start the offboarding process for an active employee.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">Select Employee</Label>
              <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
                <SelectTrigger className="rounded-xl h-10 bg-slate-50 border border-slate-100 text-xs font-bold"><SelectValue placeholder="Choose employee..." /></SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  {activeEmployees.length === 0 ? (
                    <div className="px-3 py-2 text-xs font-bold text-slate-400">No eligible employees</div>
                  ) : activeEmployees.map(e => (
                    <SelectItem key={e.id} value={e.id} className="text-xs">{e.name} — {e.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">Last Working Day</Label>
              <Input type="date" min={TODAY} className="rounded-xl h-10 bg-slate-50 border border-slate-100 text-xs font-bold" value={lwd} onChange={(e) => setLwd(e.target.value)} />
            </div>
            <div>
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">Reason for Exit</Label>
              <Textarea placeholder="Specify resignation details..." className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs font-medium resize-none min-h-[90px] focus-visible:ring-0" value={exitReason} onChange={(e) => setExitReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl h-10 font-bold text-xs" onClick={() => setIsInitiateOpen(false)}>Cancel</Button>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold h-10 text-xs flex-1" onClick={handleInitiateReview}>
              Review & Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Confirm Exit */}
      <Dialog open={isConfirmExitOpen} onOpenChange={setIsConfirmExitOpen}>
        <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Confirm Resignation?</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400">
              {(() => {
                const emp = employees.find(e => e.id === selectedEmpId)
                return emp ? `${emp.name} will be moved to Notice Period with LWD ${lwd}. Clearance workflow starts immediately.` : ''
              })()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => { setIsConfirmExitOpen(false); setIsInitiateOpen(true) }} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Go Back</Button>
            <Button onClick={confirmInitiate} className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-10 text-xs flex-1">Yes, Initiate Exit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Exit */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Withdraw Resignation?</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400">
              {withdrawEmp ? `${withdrawEmp.name} will return to Active status. Clearance data and exit reason will be cleared.` : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => { setIsWithdrawOpen(false); setWithdrawEmp(null) }} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
            <Button onClick={confirmWithdraw} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl h-10 text-xs">
              <Undo2 className="mr-1.5 h-3.5 w-3.5" /> Yes, Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirm */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Reset All Lifecycle Data?</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400">Clears all local storage and reloads with mock seed data.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setIsResetOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
            <Button onClick={handleReset} className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-10 text-xs">Yes, Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detailEmp} onOpenChange={(open) => { if (!open) setDetailEmp(null) }}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-slate-200 p-6 bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">Separation Details</DialogTitle>
            <DialogDescription className="text-xs font-bold text-slate-400">Offboarding info for {detailEmp?.name}.</DialogDescription>
          </DialogHeader>
          {detailEmp && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-xl">
                  <AvatarFallback className="bg-violet-100 text-violet-600 font-bold rounded-xl text-sm">{detailEmp.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-slate-800">{detailEmp.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{detailEmp.role} — {detailEmp.department}</p>
                </div>
              </div>
              <div className="space-y-2 bg-slate-50 rounded-xl p-4 text-xs">
                <div className="flex justify-between"><span className="text-slate-400 font-bold">Status</span><Badge className={cn("text-[9px] rounded-full font-bold", detailEmp.status === "Notice Period" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500")}>{detailEmp.status}</Badge></div>
                <div className="flex justify-between gap-3"><span className="text-slate-400 font-bold shrink-0">Exit reason</span><span className="text-slate-700 font-bold text-right">{detailEmp.exitReason || "N/A"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-bold">Last working day</span><span className="text-slate-700 font-bold">{detailEmp.lwd || "N/A"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-bold">Join date</span><span className="text-slate-700 font-bold">{detailEmp.joinDate}</span></div>
                <div className="flex justify-between"><span className="text-slate-400 font-bold">Department</span><span className="text-slate-700 font-bold">{detailEmp.department}</span></div>
                {detailEmp.status === "Notice Period" && (
                  <div className="flex justify-between"><span className="text-slate-400 font-bold">Clearance progress</span><span className="text-slate-700 font-bold">{clearanceProgress(detailEmp)}%</span></div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 flex-col sm:flex-row">
            {detailEmp?.status === "Notice Period" && (
              <>
                <Button variant="outline" className="rounded-xl h-10 font-bold border-slate-200 text-xs flex-1" onClick={() => { if (detailEmp) openWithdraw(detailEmp) }}>
                  <Undo2 className="mr-1.5 h-3.5 w-3.5" /> Withdraw Exit
                </Button>
                <Link href="/hrmcubicle/lifecycle/clearance" className="flex-1">
                  <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 text-xs w-full">
                    <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" /> Go to Clearance
                  </Button>
                </Link>
              </>
            )}
            {detailEmp?.status === "Exited" && (
              <Link href="/hrmcubicle/lifecycle/settlement" className="w-full">
                <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 text-xs w-full">
                  Go to Settlement
                </Button>
              </Link>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExitManagementPage
