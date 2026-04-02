"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Award, Check, DollarSign, Edit, Gift, Medal, Plus,
  Search, Star, Trophy, Upload, UserCheck, UserPlus, Users, X
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface Referral {
  id: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  position: string
  referrerName: string
  referrerDept: string
  submittedDate: string
  status: "Submitted" | "Screening" | "Interview" | "Hired" | "Rejected"
  bonusStatus: "Pending" | "Approved" | "Paid" | "N/A"
  bonusAmount: number
  notes: string
}

const mockReferrals: Referral[] = [
  { id: "REF001", candidateName: "Vikram Joshi", candidateEmail: "vikram@email.com", candidatePhone: "+91-9876543210", position: "Senior Frontend Engineer", referrerName: "Aditya Singh", referrerDept: "Engineering", submittedDate: "2026-03-15", status: "Interview", bonusStatus: "Pending", bonusAmount: 25000, notes: "Strong React skills" },
  { id: "REF002", candidateName: "Neha Kapoor", candidateEmail: "neha@email.com", candidatePhone: "+91-9876543211", position: "Product Designer", referrerName: "Priya Sharma", referrerDept: "Product", submittedDate: "2026-03-10", status: "Hired", bonusStatus: "Paid", bonusAmount: 25000, notes: "Excellent portfolio" },
  { id: "REF003", candidateName: "Karan Malhotra", candidateEmail: "karan@email.com", candidatePhone: "+91-9876543212", position: "Data Analyst", referrerName: "Aditya Singh", referrerDept: "Engineering", submittedDate: "2026-03-20", status: "Screening", bonusStatus: "Pending", bonusAmount: 15000, notes: "Python + SQL expert" },
  { id: "REF004", candidateName: "Simran Kaur", candidateEmail: "simran@email.com", candidatePhone: "+91-9876543213", position: "DevOps Engineer", referrerName: "Rahul Verma", referrerDept: "Engineering", submittedDate: "2026-02-28", status: "Rejected", bonusStatus: "N/A", bonusAmount: 0, notes: "Didn't meet experience criteria" },
  { id: "REF005", candidateName: "Amit Deshmukh", candidateEmail: "amit@email.com", candidatePhone: "+91-9876543214", position: "HR Business Partner", referrerName: "Sneha Patel", referrerDept: "HR", submittedDate: "2026-03-05", status: "Submitted", bonusStatus: "Pending", bonusAmount: 20000, notes: "8 years HR experience" },
  { id: "REF006", candidateName: "Meera Nair", candidateEmail: "meera@email.com", candidatePhone: "+91-9876543215", position: "Senior Frontend Engineer", referrerName: "Drashi Garg", referrerDept: "Engineering", submittedDate: "2026-03-18", status: "Interview", bonusStatus: "Pending", bonusAmount: 25000, notes: "Vue + React experience" },
  { id: "REF007", candidateName: "Ravi Teja", candidateEmail: "ravi@email.com", candidatePhone: "+91-9876543216", position: "Marketing Intern", referrerName: "Priya Sharma", referrerDept: "Product", submittedDate: "2026-01-10", status: "Hired", bonusStatus: "Paid", bonusAmount: 10000, notes: "Good communication" },
]

const bonusPolicy = [
  { level: "Junior / Intern", amount: "₹10,000" },
  { level: "Mid-Level", amount: "₹15,000" },
  { level: "Senior", amount: "₹25,000" },
  { level: "Lead / Manager", amount: "₹40,000" },
  { level: "Director+", amount: "₹75,000" },
]

const positions = ["Senior Frontend Engineer", "Product Designer", "Data Analyst", "DevOps Engineer", "HR Business Partner", "Marketing Intern"]

const statusColors: Record<string, string> = {
  Submitted: "bg-blue-100 text-blue-700",
  Screening: "bg-amber-100 text-amber-700",
  Interview: "bg-violet-100 text-violet-700",
  Hired: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
}

const bonusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-blue-100 text-blue-700",
  Paid: "bg-emerald-100 text-emerald-700",
  "N/A": "bg-slate-100 text-slate-500",
}

const EmployeeReferralsPage = () => {
  const router = useRouter()
  const { toast } = useToast()

  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [submitOpen, setSubmitOpen] = useState(false)
  const [form, setForm] = useState({
    candidateName: "", candidateEmail: "", candidatePhone: "",
    position: "", notes: "",
  })

  const totalReferrals = referrals.length
  const pending = referrals.filter((r) => r.status === "Submitted" || r.status === "Screening").length
  const hired = referrals.filter((r) => r.status === "Hired").length
  const bonusPaid = referrals.filter((r) => r.bonusStatus === "Paid").reduce((acc, r) => acc + r.bonusAmount, 0)

  const filtered = referrals
    .filter((r) => statusFilter === "all" || r.status === statusFilter)
    .filter((r) =>
      !search ||
      r.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      r.position.toLowerCase().includes(search.toLowerCase()) ||
      r.referrerName.toLowerCase().includes(search.toLowerCase())
    )

  // Leaderboard
  const leaderboard = Object.values(
    referrals.reduce<Record<string, { name: string; dept: string; count: number; bonus: number; hired: number }>>((acc, r) => {
      if (!acc[r.referrerName]) {
        acc[r.referrerName] = { name: r.referrerName, dept: r.referrerDept, count: 0, bonus: 0, hired: 0 }
      }
      acc[r.referrerName].count++
      if (r.bonusStatus === "Paid") acc[r.referrerName].bonus += r.bonusAmount
      if (r.status === "Hired") acc[r.referrerName].hired++
      return acc
    }, {})
  ).sort((a, b) => b.count - a.count)

  const myReferrals = referrals.filter((r) => r.referrerName === "Aditya Singh")

  const handleSubmit = () => {
    if (!form.candidateName || !form.candidateEmail || !form.position) {
      toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }
    const newReferral: Referral = {
      id: `REF${Date.now()}`,
      candidateName: form.candidateName,
      candidateEmail: form.candidateEmail,
      candidatePhone: form.candidatePhone,
      position: form.position,
      referrerName: "Aditya Singh",
      referrerDept: "Engineering",
      submittedDate: new Date().toISOString().split("T")[0],
      status: "Submitted",
      bonusStatus: "Pending",
      bonusAmount: 0,
      notes: form.notes,
    }
    setReferrals([newReferral, ...referrals])
    setForm({ candidateName: "", candidateEmail: "", candidatePhone: "", position: "", notes: "" })
    setSubmitOpen(false)
    toast({ title: "Referral Submitted", description: `${form.candidateName} has been referred for ${form.position}.` })
  }

  return (
    <div className="flex-1 p-8 h-full flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/hrmcubicle/hire")} className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Employee Referrals</h1>
            <p className="text-sm text-slate-500">Refer candidates and track your referral rewards</p>
          </div>
        </div>
        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={() => setSubmitOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Refer Candidate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Referrals", value: totalReferrals, icon: Users, color: "text-violet-600 bg-violet-50" },
          { label: "Pending", value: pending, icon: UserPlus, color: "text-amber-600 bg-amber-50" },
          { label: "Hired via Referral", value: hired, icon: UserCheck, color: "text-emerald-600 bg-emerald-50" },
          { label: "Bonus Paid", value: `₹${bonusPaid.toLocaleString()}`, icon: DollarSign, color: "text-blue-600 bg-blue-50" },
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

      <Tabs defaultValue="my" className="flex-1">
        <TabsList className="bg-slate-100 rounded-xl p-1 mb-4">
          <TabsTrigger value="my" className="rounded-lg text-xs font-bold px-4">My Referrals</TabsTrigger>
          <TabsTrigger value="all" className="rounded-lg text-xs font-bold px-4">All Referrals (Admin)</TabsTrigger>
          <TabsTrigger value="leaderboard" className="rounded-lg text-xs font-bold px-4">Leaderboard</TabsTrigger>
          <TabsTrigger value="policy" className="rounded-lg text-xs font-bold px-4">Referral Policy</TabsTrigger>
        </TabsList>

        {/* My Referrals */}
        <TabsContent value="my">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">My Referrals ({myReferrals.length})</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Candidate</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Position</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Date</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Bonus Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myReferrals.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-400 text-sm">No referrals yet. Click "Refer Candidate" to get started.</TableCell></TableRow>
                ) : (
                  myReferrals.map((ref) => (
                    <TableRow key={ref.id} className="hover:bg-slate-50">
                      <TableCell>
                        <p className="text-sm font-semibold text-slate-800">{ref.candidateName}</p>
                        <p className="text-[10px] text-slate-400">{ref.candidateEmail}</p>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{ref.position}</TableCell>
                      <TableCell className="text-xs text-slate-500">{ref.submittedDate}</TableCell>
                      <TableCell><Badge className={cn("text-[10px] rounded-full", statusColors[ref.status])}>{ref.status}</Badge></TableCell>
                      <TableCell><Badge className={cn("text-[10px] rounded-full", bonusColors[ref.bonusStatus])}>{ref.bonusStatus}</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* All Referrals */}
        <TabsContent value="all">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search by candidate, position, or referrer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 rounded-xl text-xs"><SelectValue placeholder="Filter status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Screening">Screening</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Candidate</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Position</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Referrer</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Date</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Status</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Bonus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ref) => (
                  <TableRow key={ref.id} className="hover:bg-slate-50">
                    <TableCell>
                      <p className="text-sm font-semibold text-slate-800">{ref.candidateName}</p>
                      <p className="text-[10px] text-slate-400">{ref.candidateEmail}</p>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{ref.position}</TableCell>
                    <TableCell>
                      <p className="text-xs font-medium text-slate-700">{ref.referrerName}</p>
                      <p className="text-[10px] text-slate-400">{ref.referrerDept}</p>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">{ref.submittedDate}</TableCell>
                    <TableCell><Badge className={cn("text-[10px] rounded-full", statusColors[ref.status])}>{ref.status}</Badge></TableCell>
                    <TableCell>
                      <Badge className={cn("text-[10px] rounded-full", bonusColors[ref.bonusStatus])}>
                        {ref.bonusStatus === "Paid" ? `₹${ref.bonusAmount.toLocaleString()}` : ref.bonusStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" /> Top Referrers
            </h3>
            <div className="space-y-3">
              {leaderboard.map((entry, idx) => (
                <div key={entry.name} className={cn("flex items-center justify-between p-4 rounded-xl border transition-all", idx === 0 ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white")}>
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black text-sm",
                      idx === 0 ? "bg-amber-400 text-white" : idx === 1 ? "bg-slate-400 text-white" : idx === 2 ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-600"
                    )}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{entry.name}</p>
                      <p className="text-[10px] text-slate-400">{entry.dept}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-black text-slate-900">{entry.count}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Referrals</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-emerald-600">{entry.hired}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Hired</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-blue-600">₹{entry.bonus.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">Earned</p>
                    </div>
                    {idx < 3 && <Medal className={cn("h-5 w-5", idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-400" : "text-amber-600")} />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Referral Policy */}
        <TabsContent value="policy">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#8B5CF6]" /> Referral Bonus Policy
            </h3>
            <p className="text-sm text-slate-500 mb-6">Earn rewards for every successful hire through your referral.</p>
            <div className="space-y-3">
              {bonusPolicy.map((bp) => (
                <div key={bp.level} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-sm font-bold text-slate-800">{bp.level}</span>
                  <span className="text-lg font-black text-[#8B5CF6]">{bp.amount}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-violet-50 border border-violet-100">
              <p className="text-xs text-violet-700 font-medium">
                Bonus is paid after the referred candidate completes 90 days of employment. Both full-time and contract hires are eligible.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Referral Dialog */}
      <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Refer a Candidate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Candidate Name *</label>
              <Input value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} placeholder="Full name" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Email *</label>
                <Input value={form.candidateEmail} onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })} placeholder="email@example.com" className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Phone</label>
                <Input value={form.candidatePhone} onChange={(e) => setForm({ ...form, candidatePhone: e.target.value })} placeholder="+91-9876543210" className="rounded-xl" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Position *</label>
              <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select position..." /></SelectTrigger>
                <SelectContent>
                  {positions.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Resume Upload</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-[#8B5CF6] transition-colors cursor-pointer">
                <Upload className="h-6 w-6 mx-auto text-slate-300 mb-1" />
                <p className="text-xs text-slate-400">Drag & drop or click to upload (PDF, DOCX)</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="Why would this candidate be a good fit?"
                className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent outline-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setSubmitOpen(false)}>Cancel</Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={handleSubmit}>
              <UserPlus className="mr-1 h-4 w-4" /> Submit Referral
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeeReferralsPage
