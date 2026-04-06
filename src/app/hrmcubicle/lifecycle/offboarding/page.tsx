"use client"

import React, { useState, useMemo } from "react"
import {
  LogOut, MessageSquare, UserCheck, AlertCircle, Calendar,
  ArrowRight, Search, LayoutGrid, Clock, Users
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
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/lib/utils"

const ExitManagementPage = () => {
  const { toast } = useToast()
  const { employees, initiateExit } = useLifecycleStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterActive, setFilterActive] = useState<"All" | "Notice" | "Exited">("All")
  const [detailEmp, setDetailEmp] = useState<LifecycleEmployee | null>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmpId, setSelectedEmpId] = useState("")
  const [exitReason, setExitReason] = useState("")
  const [lwd, setLwd] = useState("")

  const offboardingList = useMemo(() => {
    return employees.filter(e => {
      const isOffboarding = e.status === "Notice Period" || e.status === "Exited"
      const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase())
      let matchesFilter = true
      if (filterActive === "Notice") matchesFilter = e.status === "Notice Period"
      if (filterActive === "Exited") matchesFilter = e.status === "Exited"
      return isOffboarding && matchesSearch && matchesFilter
    })
  }, [employees, searchTerm, filterActive])

  const activeEmployees = employees.filter(e => e.status === "Active" || e.status === "Probation")

  const noticeCount = employees.filter(e => e.status === "Notice Period").length
  const exitedCount = employees.filter(e => e.status === "Exited").length

  const handleInitiateExit = () => {
    if (!selectedEmpId || !exitReason || !lwd) {
      toast({ title: "Incomplete details", description: "Please fill all fields to initiate exit.", variant: "destructive" })
      return
    }
    const empName = employees.find(e => e.id === selectedEmpId)?.name
    initiateExit(selectedEmpId, exitReason, lwd)
    setIsDialogOpen(false)
    setSelectedEmpId("")
    setExitReason("")
    setLwd("")
    toast({ title: "Exit initiated", description: `${empName} has been moved to notice period.` })
  }

  return (
    <div className="flex-1 p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Exit Management</h1>
          <p className="text-sm text-slate-500">Manage resignations, notice periods and employee separations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl font-bold"
            onClick={() => { localStorage.clear(); window.location.reload() }}
          >
            <LayoutGrid className="mr-2 h-4 w-4" /> System reset
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold">
                <LogOut className="mr-2 h-4 w-4" /> Initiate exit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg rounded-2xl border-2 border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-lg font-black text-slate-900">Initiate separation</DialogTitle>
                <DialogDescription className="text-slate-500">Start the offboarding process for an active employee.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-xs font-bold text-slate-500 mb-1 block">Select employee</Label>
                  <Select value={selectedEmpId} onValueChange={setSelectedEmpId}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose employee..." /></SelectTrigger>
                    <SelectContent>
                      {activeEmployees.map(e => (
                        <SelectItem key={e.id} value={e.id}>{e.name} — {e.role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-500 mb-1 block">Last working day</Label>
                  <Input type="date" className="rounded-xl border border-slate-200" value={lwd} onChange={(e) => setLwd(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-500 mb-1 block">Reason for exit</Label>
                  <Textarea
                    placeholder="Specify resignation details..."
                    className="rounded-xl border border-slate-200 resize-none min-h-[100px]"
                    value={exitReason}
                    onChange={(e) => setExitReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-xl" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold" onClick={handleInitiateExit}>
                  Confirm resignation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active resignations", value: noticeCount, icon: LogOut, bg: "bg-[#F0C1E1]", filter: "Notice" as const },
          { label: "Exits recorded", value: exitedCount, icon: UserCheck, bg: "bg-[#CB9DF0]", filter: "Exited" as const },
          { label: "Managed transitions", value: offboardingList.length, icon: Users, bg: "bg-[#FDDBBB]", filter: "All" as const },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className={cn(
                "rounded-2xl border-none shadow-sm p-5 cursor-pointer transition-all hover:shadow-md",
                stat.bg,
                filterActive === stat.filter && "ring-2 ring-[#8B5CF6]/30"
              )}
              onClick={() => setFilterActive(stat.filter)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/30 backdrop-blur-sm">
                  <Icon className="h-5 w-5 text-slate-800" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Separation queue */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm flex-1">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-800">Separation queue</h3>
            <Badge variant="outline" className="text-[10px] font-bold">{offboardingList.length} employees</Badge>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name..."
              className="pl-9 rounded-xl"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 space-y-3">
          {offboardingList.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <AlertCircle className="h-12 w-12 mx-auto text-slate-200" />
              <p className="text-sm text-slate-400">No employees matching your filter criteria.</p>
            </div>
          ) : offboardingList.map((emp) => (
            <div
              key={emp.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-sm",
                emp.status === "Notice Period" ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-80"
              )}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 rounded-xl">
                  <AvatarFallback className="bg-violet-100 text-violet-600 text-sm font-bold rounded-xl">{emp.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                  <p className="text-[10px] text-slate-400">{emp.role} — {emp.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {emp.exitReason && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                    <span className="max-w-[150px] truncate">{emp.exitReason}</span>
                  </div>
                )}
                {emp.lwd && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{emp.lwd}</span>
                  </div>
                )}
                <Badge className={cn(
                  "text-[10px] rounded-full",
                  emp.status === "Notice Period" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                )}>
                  {emp.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6]" onClick={() => setDetailEmp(emp)}>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!detailEmp} onOpenChange={(open) => { if (!open) setDetailEmp(null) }}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Separation details</DialogTitle>
            <DialogDescription className="text-slate-500">Offboarding information for {detailEmp?.name}.</DialogDescription>
          </DialogHeader>
          {detailEmp && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 rounded-xl">
                  <AvatarFallback className="bg-violet-100 text-violet-600 font-bold rounded-xl">{detailEmp.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-bold text-slate-800">{detailEmp.name}</p>
                  <p className="text-xs text-slate-400">{detailEmp.role} — {detailEmp.department}</p>
                </div>
              </div>
              <div className="space-y-3 bg-slate-50 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status</span>
                  <Badge className={cn("text-[10px] rounded-full", detailEmp.status === "Notice Period" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500")}>{detailEmp.status}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Exit reason</span>
                  <span className="text-slate-700 font-medium text-right max-w-[60%]">{detailEmp.exitReason || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Last working day</span>
                  <span className="text-slate-700 font-medium">{detailEmp.lwd || "N/A"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Join date</span>
                  <span className="text-slate-700 font-medium">{detailEmp.joinDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Department</span>
                  <span className="text-slate-700 font-medium">{detailEmp.department}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExitManagementPage
