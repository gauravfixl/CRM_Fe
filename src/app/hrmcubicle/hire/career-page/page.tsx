"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Briefcase, Check, Copy, Edit, ExternalLink, Eye,
  Facebook, Globe, Image, Linkedin, MapPin, MonitorSmartphone, Plus,
  Settings, Share2, ToggleLeft, ToggleRight, TrendingUp, Twitter,
  Upload, Users, X, BarChart3, MousePointerClick, FileText
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/shared/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface CareerJob {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  isActive: boolean
}

interface FormField {
  id: string
  label: string
  type: "file" | "text" | "textarea" | "url"
  required: boolean
  enabled: boolean
}

const mockJobs: CareerJob[] = [
  { id: "J001", title: "Senior Frontend Engineer", department: "Engineering", location: "Bangalore", type: "Full-time", experience: "4-7 years", isActive: true },
  { id: "J002", title: "Product Designer", department: "Design", location: "Remote", type: "Full-time", experience: "3-5 years", isActive: true },
  { id: "J003", title: "Data Analyst", department: "Analytics", location: "Delhi", type: "Full-time", experience: "2-4 years", isActive: true },
  { id: "J004", title: "HR Business Partner", department: "HR", location: "Mumbai", type: "Full-time", experience: "5-8 years", isActive: false },
  { id: "J005", title: "DevOps Engineer", department: "Engineering", location: "Bangalore", type: "Full-time", experience: "3-6 years", isActive: true },
  { id: "J006", title: "Marketing Intern", department: "Marketing", location: "Bangalore", type: "Internship", experience: "0-1 years", isActive: false },
]

const defaultFormFields: FormField[] = [
  { id: "resume", label: "Resume / CV", type: "file", required: true, enabled: true },
  { id: "cover_letter", label: "Cover Letter", type: "textarea", required: false, enabled: true },
  { id: "portfolio", label: "Portfolio URL", type: "url", required: false, enabled: true },
  { id: "linkedin", label: "LinkedIn Profile", type: "url", required: false, enabled: true },
  { id: "q1", label: "Why do you want to join us?", type: "textarea", required: false, enabled: false },
  { id: "q2", label: "Expected CTC", type: "text", required: false, enabled: false },
  { id: "q3", label: "Notice Period (days)", type: "text", required: false, enabled: false },
]

const careerPageUrl = "https://careers.acmecorp.com"

const socialPlatforms = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-600", enabled: true },
  { id: "twitter", label: "Twitter", icon: Twitter, color: "text-sky-500", enabled: true },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-700", enabled: false },
]

const CareerPageBuilderPage = () => {
  const router = useRouter()
  const { toast } = useToast()

  const [jobs, setJobs] = useState<CareerJob[]>(mockJobs)
  const [formFields, setFormFields] = useState<FormField[]>(defaultFormFields)
  const [socials, setSocials] = useState(socialPlatforms)
  const [companyInfo, setCompanyInfo] = useState({
    tagline: "Build the future with us",
    about: "Acme Corp is a leading technology company building innovative solutions. We foster a culture of creativity, collaboration, and continuous learning. Join our team of passionate professionals making an impact across industries.",
    brandColor: "#8B5CF6",
    logoUploaded: false,
    bannerUploaded: false,
  })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [addFieldOpen, setAddFieldOpen] = useState(false)
  const [newFieldLabel, setNewFieldLabel] = useState("")
  const [newFieldType, setNewFieldType] = useState<"text" | "textarea" | "url">("text")
  const [urlCopied, setUrlCopied] = useState(false)

  const activeJobs = jobs.filter((j) => j.isActive)
  const analytics = { views: 3245, applications: 187, conversionRate: 5.8 }

  const toggleJob = (id: string) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, isActive: !j.isActive } : j)))
  }

  const toggleFormField = (id: string) => {
    setFormFields(formFields.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)))
  }

  const toggleRequired = (id: string) => {
    setFormFields(formFields.map((f) => (f.id === id ? { ...f, required: !f.required } : f)))
  }

  const toggleSocial = (id: string) => {
    setSocials(socials.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(careerPageUrl)
    setUrlCopied(true)
    toast({ title: "URL Copied", description: "Career page URL copied to clipboard." })
    setTimeout(() => setUrlCopied(false), 2000)
  }

  const addCustomField = () => {
    if (!newFieldLabel.trim()) return
    setFormFields([...formFields, {
      id: `custom_${Date.now()}`,
      label: newFieldLabel,
      type: newFieldType,
      required: false,
      enabled: true,
    }])
    setNewFieldLabel("")
    setAddFieldOpen(false)
    toast({ title: "Field Added", description: `"${newFieldLabel}" added to application form.` })
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
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Career Page Builder</h1>
            <p className="text-sm text-slate-500">Customize your public career page and manage job listings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl font-bold" onClick={() => setPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={() => toast({ title: "Published", description: "Career page changes published successfully." })}>
            <Globe className="mr-2 h-4 w-4" /> Publish
          </Button>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Page Views", value: analytics.views.toLocaleString(), icon: Eye, color: "text-blue-600 bg-blue-50" },
          { label: "Applications", value: analytics.applications, icon: FileText, color: "text-emerald-600 bg-emerald-50" },
          { label: "Conversion Rate", value: `${analytics.conversionRate}%`, icon: MousePointerClick, color: "text-violet-600 bg-violet-50" },
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

      {/* Career Page URL */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-[#8B5CF6]" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Career Page URL</p>
              <p className="text-sm font-mono text-slate-700">{careerPageUrl}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={copyUrl}>
              {urlCopied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
              {urlCopied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg text-xs">
              <ExternalLink className="mr-1 h-3 w-3" /> Open
            </Button>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="customize" className="flex-1">
        <TabsList className="bg-slate-100 rounded-xl p-1 mb-4">
          <TabsTrigger value="customize" className="rounded-lg text-xs font-bold px-4">Customization</TabsTrigger>
          <TabsTrigger value="jobs" className="rounded-lg text-xs font-bold px-4">Job Listings ({jobs.length})</TabsTrigger>
          <TabsTrigger value="form" className="rounded-lg text-xs font-bold px-4">Application Form</TabsTrigger>
          <TabsTrigger value="social" className="rounded-lg text-xs font-bold px-4">Social Sharing</TabsTrigger>
        </TabsList>

        {/* Customization Tab */}
        <TabsContent value="customize">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-800">Branding</h3>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Company Logo</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#8B5CF6] transition-colors cursor-pointer" onClick={() => { setCompanyInfo({ ...companyInfo, logoUploaded: true }); toast({ title: "Logo Uploaded" }) }}>
                  {companyInfo.logoUploaded ? (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-600">Logo uploaded</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs text-slate-400">Click to upload logo (PNG, SVG)</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Banner Image</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#8B5CF6] transition-colors cursor-pointer" onClick={() => { setCompanyInfo({ ...companyInfo, bannerUploaded: true }); toast({ title: "Banner Uploaded" }) }}>
                  {companyInfo.bannerUploaded ? (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-600">Banner uploaded</span>
                    </div>
                  ) : (
                    <>
                      <Image className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs text-slate-400">Click to upload banner (1200x300 recommended)</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Brand Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={companyInfo.brandColor} onChange={(e) => setCompanyInfo({ ...companyInfo, brandColor: e.target.value })} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
                  <Input value={companyInfo.brandColor} onChange={(e) => setCompanyInfo({ ...companyInfo, brandColor: e.target.value })} className="w-32 rounded-xl font-mono text-sm" />
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-800">Content</h3>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Tagline</label>
                <Input value={companyInfo.tagline} onChange={(e) => setCompanyInfo({ ...companyInfo, tagline: e.target.value })} className="rounded-xl" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">About Company</label>
                <textarea
                  value={companyInfo.about}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, about: e.target.value })}
                  rows={6}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm resize-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent outline-none"
                />
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Job Listings Tab */}
        <TabsContent value="jobs">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Job Listings</h3>
              <Badge variant="outline" className="text-[10px] font-bold">{activeJobs.length} active of {jobs.length}</Badge>
            </div>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className={cn("flex items-center justify-between p-4 rounded-xl border transition-all", job.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-70")}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleJob(job.id)} className="flex-shrink-0">
                      {job.isActive ? (
                        <ToggleRight className="h-6 w-6 text-[#8B5CF6]" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-slate-300" />
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{job.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-slate-400">{job.department}</span>
                        <span className="text-[10px] text-slate-300">|</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{job.location}</span>
                        <span className="text-[10px] text-slate-300">|</span>
                        <span className="text-[10px] text-slate-400">{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] rounded-full">{job.experience}</Badge>
                    <Badge className={cn("text-[9px] rounded-full", job.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                      {job.isActive ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Application Form Tab */}
        <TabsContent value="form">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Application Form Fields</h3>
              <Button size="sm" variant="outline" className="rounded-xl text-xs font-bold" onClick={() => setAddFieldOpen(true)}>
                <Plus className="mr-1 h-3 w-3" /> Add Custom Field
              </Button>
            </div>
            <div className="space-y-3">
              {formFields.map((field) => (
                <div key={field.id} className={cn("flex items-center justify-between p-4 rounded-xl border transition-all", field.enabled ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60")}>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleFormField(field.id)} className="flex-shrink-0">
                      {field.enabled ? <ToggleRight className="h-6 w-6 text-[#8B5CF6]" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
                    </button>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{field.label}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{field.type === "file" ? "File Upload" : field.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleRequired(field.id)} className={cn("text-[10px] font-bold px-2 py-1 rounded-full transition-all", field.required ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400")}>
                      {field.required ? "Required" : "Optional"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Social Sharing Tab */}
        <TabsContent value="social">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Social Media Sharing</h3>
            <p className="text-sm text-slate-500 mb-4">Configure social sharing links for your job listings.</p>
            <div className="space-y-3">
              {socials.map((platform) => {
                const Icon = platform.icon
                return (
                  <div key={platform.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <Icon className={cn("h-5 w-5", platform.color)} />
                      <span className="text-sm font-bold text-slate-800">{platform.label}</span>
                    </div>
                    <button onClick={() => toggleSocial(platform.id)}>
                      {platform.enabled ? <ToggleRight className="h-6 w-6 text-[#8B5CF6]" /> : <ToggleLeft className="h-6 w-6 text-slate-300" />}
                    </button>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Career Page Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl rounded-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Career Page Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Mock banner */}
            <div className="h-32 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-2xl font-black">ACME CORP</h2>
                <p className="text-sm font-medium mt-1 opacity-80">{companyInfo.tagline}</p>
              </div>
            </div>
            <div className="px-4">
              <h3 className="text-base font-bold text-slate-800 mb-2">About Us</h3>
              <p className="text-sm text-slate-500">{companyInfo.about}</p>
            </div>
            <div className="px-4">
              <h3 className="text-base font-bold text-slate-800 mb-3">Open Positions ({activeJobs.length})</h3>
              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{job.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>{job.department}</span>
                          <span>|</span>
                          <span>{job.location}</span>
                          <span>|</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <Button size="sm" className="rounded-lg text-xs font-bold" style={{ backgroundColor: companyInfo.brandColor }}>Apply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Custom Field Dialog */}
      <Dialog open={addFieldOpen} onOpenChange={setAddFieldOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Add Custom Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Field Label</label>
              <Input value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} placeholder="e.g., Years of experience" className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Field Type</label>
              <div className="flex gap-2">
                {(["text", "textarea", "url"] as const).map((t) => (
                  <Button key={t} variant={newFieldType === t ? "default" : "outline"} size="sm" className={cn("rounded-lg text-xs capitalize", newFieldType === t && "bg-[#8B5CF6]")} onClick={() => setNewFieldType(t)}>
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setAddFieldOpen(false)}>Cancel</Button>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold" onClick={addCustomField}>Add Field</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CareerPageBuilderPage
