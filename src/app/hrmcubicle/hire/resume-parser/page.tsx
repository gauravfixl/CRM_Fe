"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Briefcase, Check, FileText, Mail, MapPin, Phone, Plus,
  Search, Sparkles, Star, Trash2, Upload, User, UserPlus, X, Clock,
  GraduationCap, Wrench, Eye
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ParsedResume {
  id: string
  fileName: string
  name: string
  email: string
  phone: string
  location: string
  skills: string[]
  experience: { company: string; role: string; duration: string }[]
  education: { institution: string; degree: string; year: string }[]
  totalExperience: string
  parsedDate: string
  matchedPositions: { title: string; matchScore: number }[]
  addedToPipeline: boolean
}

const mockParsedResumes: ParsedResume[] = [
  {
    id: "PR001", fileName: "vikram_joshi_resume.pdf",
    name: "Vikram Joshi", email: "vikram@email.com", phone: "+91-9876543210", location: "Bangalore",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
    experience: [
      { company: "Tech Solutions Pvt Ltd", role: "Senior Frontend Developer", duration: "2023-Present" },
      { company: "Innovate Labs", role: "Frontend Developer", duration: "2020-2023" },
    ],
    education: [{ institution: "IIT Delhi", degree: "B.Tech CSE", year: "2020" }],
    totalExperience: "5+ years", parsedDate: "2026-03-28",
    matchedPositions: [{ title: "Senior Frontend Engineer", matchScore: 92 }, { title: "DevOps Engineer", matchScore: 45 }],
    addedToPipeline: false,
  },
  {
    id: "PR002", fileName: "neha_kapoor_cv.docx",
    name: "Neha Kapoor", email: "neha@email.com", phone: "+91-9876543211", location: "Mumbai",
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
    experience: [
      { company: "Design Studio", role: "Senior Product Designer", duration: "2022-Present" },
      { company: "UX First", role: "UI Designer", duration: "2019-2022" },
    ],
    education: [{ institution: "NID Ahmedabad", degree: "M.Des", year: "2019" }],
    totalExperience: "6+ years", parsedDate: "2026-03-27",
    matchedPositions: [{ title: "Product Designer", matchScore: 95 }, { title: "Senior Frontend Engineer", matchScore: 20 }],
    addedToPipeline: true,
  },
  {
    id: "PR003", fileName: "karan_resume.pdf",
    name: "Karan Malhotra", email: "karan@email.com", phone: "+91-9876543212", location: "Delhi",
    skills: ["Python", "SQL", "Tableau", "Power BI", "Machine Learning", "Statistics"],
    experience: [
      { company: "Data Insights Co", role: "Data Analyst", duration: "2024-Present" },
      { company: "Analytics Hub", role: "Junior Analyst", duration: "2022-2024" },
    ],
    education: [{ institution: "Delhi University", degree: "M.Sc Statistics", year: "2022" }],
    totalExperience: "3+ years", parsedDate: "2026-03-26",
    matchedPositions: [{ title: "Data Analyst", matchScore: 88 }, { title: "HR Business Partner", matchScore: 15 }],
    addedToPipeline: false,
  },
  {
    id: "PR004", fileName: "simran_kaur_cv.pdf",
    name: "Simran Kaur", email: "simran@email.com", phone: "+91-9876543213", location: "Hyderabad",
    skills: ["AWS", "Kubernetes", "Terraform", "Jenkins", "Docker", "Linux", "Python"],
    experience: [
      { company: "CloudOps Inc", role: "DevOps Engineer", duration: "2023-Present" },
      { company: "Server Solutions", role: "SysAdmin", duration: "2021-2023" },
    ],
    education: [{ institution: "BITS Pilani", degree: "B.E. IT", year: "2021" }],
    totalExperience: "4+ years", parsedDate: "2026-03-25",
    matchedPositions: [{ title: "DevOps Engineer", matchScore: 90 }, { title: "Senior Frontend Engineer", matchScore: 25 }],
    addedToPipeline: false,
  },
]

const ResumeParserPage = () => {
  const router = useRouter()
  const { toast } = useToast()

  const [resumes, setResumes] = useState<ParsedResume[]>(mockParsedResumes)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState("")
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedResume, setSelectedResume] = useState<ParsedResume | null>(null)

  const filtered = resumes.filter((r) =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  )

  const handleUpload = () => {
    setUploading(true)
    setTimeout(() => {
      const newResume: ParsedResume = {
        id: `PR${Date.now()}`,
        fileName: "new_candidate_resume.pdf",
        name: "Amit Deshmukh",
        email: "amit.d@email.com",
        phone: "+91-9876543220",
        location: "Pune",
        skills: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "Redis"],
        experience: [
          { company: "Enterprise Solutions", role: "Backend Developer", duration: "2022-Present" },
          { company: "Code Factory", role: "Java Developer", duration: "2020-2022" },
        ],
        education: [{ institution: "Pune University", degree: "B.Tech CSE", year: "2020" }],
        totalExperience: "5+ years",
        parsedDate: new Date().toISOString().split("T")[0],
        matchedPositions: [{ title: "DevOps Engineer", matchScore: 55 }, { title: "Senior Frontend Engineer", matchScore: 30 }],
        addedToPipeline: false,
      }
      setResumes([newResume, ...resumes])
      setUploading(false)
      toast({ title: "Resume Parsed", description: "Successfully extracted candidate information from resume." })
    }, 1500)
  }

  const handleBulkUpload = () => {
    setUploading(true)
    setTimeout(() => {
      const bulk: ParsedResume[] = [
        {
          id: `PR${Date.now()}a`, fileName: "candidate_1.pdf",
          name: "Ravi Teja", email: "ravi@email.com", phone: "+91-9876543221", location: "Chennai",
          skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
          experience: [{ company: "Mobile First", role: "Mobile Developer", duration: "2021-Present" }],
          education: [{ institution: "Anna University", degree: "B.E. CSE", year: "2021" }],
          totalExperience: "4+ years", parsedDate: new Date().toISOString().split("T")[0],
          matchedPositions: [{ title: "Senior Frontend Engineer", matchScore: 60 }], addedToPipeline: false,
        },
        {
          id: `PR${Date.now()}b`, fileName: "candidate_2.docx",
          name: "Meera Nair", email: "meera@email.com", phone: "+91-9876543222", location: "Kochi",
          skills: ["Content Strategy", "SEO", "Google Analytics", "Social Media", "Copywriting"],
          experience: [{ company: "Digital Agency", role: "Content Marketer", duration: "2022-Present" }],
          education: [{ institution: "Kerala University", degree: "MBA Marketing", year: "2022" }],
          totalExperience: "3+ years", parsedDate: new Date().toISOString().split("T")[0],
          matchedPositions: [{ title: "Marketing Intern", matchScore: 70 }], addedToPipeline: false,
        },
      ]
      setResumes([...bulk, ...resumes])
      setUploading(false)
      toast({ title: "Bulk Upload Complete", description: `${bulk.length} resumes parsed successfully.` })
    }, 2000)
  }

  const addToPipeline = (id: string) => {
    setResumes(resumes.map((r) => (r.id === id ? { ...r, addedToPipeline: true } : r)))
    toast({ title: "Added to Pipeline", description: "Candidate has been added to the recruitment pipeline." })
  }

  const viewDetail = (resume: ParsedResume) => {
    setSelectedResume(resume)
    setDetailOpen(true)
  }

  const removeResume = (id: string) => {
    setResumes(resumes.filter((r) => r.id !== id))
    toast({ title: "Removed", description: "Parsed resume has been removed." })
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
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Resume Parser</h1>
            <p className="text-sm text-slate-500">Upload resumes and auto-extract candidate information</p>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#8B5CF6] transition-colors">
          {uploading ? (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-violet-100 mx-auto flex items-center justify-center animate-pulse">
                <Sparkles className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <p className="text-sm font-medium text-slate-600">Parsing resume...</p>
              <div className="w-48 h-2 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-[#8B5CF6] rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: "70%" }} />
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-600">Drag & drop resume files here</p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX (max 10MB each)</p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={handleUpload}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Single
                </Button>
                <Button variant="outline" className="rounded-xl font-bold" onClick={handleBulkUpload}>
                  <Plus className="mr-2 h-4 w-4" /> Bulk Upload
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      <Tabs defaultValue="parsed" className="flex-1">
        <TabsList className="bg-slate-100 rounded-xl p-1 mb-4">
          <TabsTrigger value="parsed" className="rounded-lg text-xs font-bold px-4">Parsed Results ({resumes.length})</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg text-xs font-bold px-4">Upload History</TabsTrigger>
        </TabsList>

        <TabsContent value="parsed">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search by name or skill..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-80 rounded-xl" />
            </div>
          </div>

          {/* Parsed Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((resume) => (
              <Card key={resume.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{resume.name}</p>
                      <p className="text-[10px] text-slate-400">{resume.fileName}</p>
                    </div>
                  </div>
                  {resume.addedToPipeline && (
                    <Badge className="bg-emerald-100 text-emerald-700 text-[9px] rounded-full">In Pipeline</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Mail className="h-3 w-3" /> {resume.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Phone className="h-3 w-3" /> {resume.phone}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="h-3 w-3" /> {resume.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3 w-3" /> {resume.totalExperience}
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {resume.skills.slice(0, 5).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-[9px] rounded-full">{skill}</Badge>
                    ))}
                    {resume.skills.length > 5 && (
                      <Badge variant="outline" className="text-[9px] rounded-full">+{resume.skills.length - 5}</Badge>
                    )}
                  </div>
                </div>

                {/* Match Scores */}
                <div className="mb-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Position Match</p>
                  <div className="space-y-1.5">
                    {resume.matchedPositions.map((pos) => (
                      <div key={pos.title} className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", pos.matchScore >= 80 ? "bg-emerald-500" : pos.matchScore >= 50 ? "bg-amber-500" : "bg-red-400")}
                            style={{ width: `${pos.matchScore}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-500 w-24 truncate">{pos.title}</span>
                        <span className={cn("text-[10px] font-bold w-8 text-right", pos.matchScore >= 80 ? "text-emerald-600" : pos.matchScore >= 50 ? "text-amber-600" : "text-red-500")}>
                          {pos.matchScore}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Button size="sm" variant="outline" className="rounded-lg text-xs flex-1" onClick={() => viewDetail(resume)}>
                    <Eye className="mr-1 h-3 w-3" /> View Details
                  </Button>
                  {!resume.addedToPipeline ? (
                    <Button size="sm" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg text-xs flex-1" onClick={() => addToPipeline(resume.id)}>
                      <UserPlus className="mr-1 h-3 w-3" /> Add to Pipeline
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="rounded-lg text-xs flex-1 text-emerald-600 border-emerald-200" disabled>
                      <Check className="mr-1 h-3 w-3" /> Added
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="rounded-lg text-xs text-red-400 hover:text-red-600" onClick={() => removeResume(resume.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-400">No parsed resumes</p>
              <p className="text-xs text-slate-300 mt-1">Upload resumes above to get started</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">File Name</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Candidate</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Skills Found</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Parsed Date</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Pipeline</TableHead>
                  <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumes.map((resume) => (
                  <TableRow key={resume.id} className="hover:bg-slate-50">
                    <TableCell className="text-xs text-slate-600 flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-slate-400" /> {resume.fileName}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-slate-800">{resume.name}</TableCell>
                    <TableCell className="text-xs text-slate-500">{resume.skills.length} skills</TableCell>
                    <TableCell className="text-xs text-slate-500">{resume.parsedDate}</TableCell>
                    <TableCell>
                      <Badge className={cn("text-[9px] rounded-full", resume.addedToPipeline ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                        {resume.addedToPipeline ? "Added" : "Not Added"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="text-[#8B5CF6] text-xs font-bold" onClick={() => viewDetail(resume)}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">{selectedResume?.name}</DialogTitle>
          </DialogHeader>
          {selectedResume && (
            <div className="space-y-5">
              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="h-4 w-4 text-slate-400" />{selectedResume.email}</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="h-4 w-4 text-slate-400" />{selectedResume.phone}</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="h-4 w-4 text-slate-400" />{selectedResume.location}</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><Clock className="h-4 w-4 text-slate-400" />{selectedResume.totalExperience}</div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Wrench className="h-3 w-3" /> Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedResume.skills.map((skill) => (
                    <Badge key={skill} className="bg-violet-100 text-violet-700 text-xs rounded-full">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Briefcase className="h-3 w-3" /> Experience</p>
                <div className="space-y-2">
                  {selectedResume.experience.map((exp, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{exp.role}</p>
                      <p className="text-xs text-slate-500">{exp.company} | {exp.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><GraduationCap className="h-3 w-3" /> Education</p>
                <div className="space-y-2">
                  {selectedResume.education.map((edu, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{edu.degree}</p>
                      <p className="text-xs text-slate-500">{edu.institution} | {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Position Matches */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1"><Sparkles className="h-3 w-3" /> Position Match</p>
                <div className="space-y-2">
                  {selectedResume.matchedPositions.map((pos) => (
                    <div key={pos.title} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-sm text-slate-700 flex-1">{pos.title}</span>
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", pos.matchScore >= 80 ? "bg-emerald-500" : pos.matchScore >= 50 ? "bg-amber-500" : "bg-red-400")} style={{ width: `${pos.matchScore}%` }} />
                      </div>
                      <span className={cn("text-sm font-bold", pos.matchScore >= 80 ? "text-emerald-600" : pos.matchScore >= 50 ? "text-amber-600" : "text-red-500")}>{pos.matchScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setDetailOpen(false)}>Close</Button>
            {selectedResume && !selectedResume.addedToPipeline && (
              <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={() => { addToPipeline(selectedResume.id); setDetailOpen(false) }}>
                <UserPlus className="mr-1 h-4 w-4" /> Add to Pipeline
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ResumeParserPage
