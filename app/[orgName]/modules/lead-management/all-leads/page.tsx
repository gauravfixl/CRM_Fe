"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Plus, Search, Mail, Phone, Calendar, Target, TrendingUp, Users, DollarSign } from 'lucide-react'
import { useRouter } from "next/navigation"

type Lead = {
  id: number
  name: string
  company: string
  email: string
  phone: string
  source: string
  status: string
  score: number
  value: string
  assignedTo: string
  lastActivity: string
  createdDate: string
  avatar: string
}

const initialLeads: Lead[] = [
  {
    id: 1,
    name: "John Smith",
    company: "Tech Startup Inc",
    email: "john@techstartup.com",
    phone: "+1 (555) 123-4567",
    source: "Website",
    status: "New",
    score: 85,
    value: "$15,000",
    assignedTo: "Sarah Johnson",
    lastActivity: "2024-01-15",
    createdDate: "2024-01-10",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  // other leads...
]
const orgName= localStorage.getItem("orgName")
const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Qualified":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Proposal":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case "Negotiation":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "Closed Won":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
    case "Closed Lost":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600"
  if (score >= 70) return "text-yellow-600"
  return "text-red-600"
}

export default function AllLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
const router = useRouter()

  // Form state
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "",
    value: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateLead = () => {
    const newLead: Lead = {
      id: Date.now(),
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      source: form.source,
      status: "New",
      score: Math.floor(Math.random() * 31) + 70, // Random score 70-100
      value: form.value,
      assignedTo: "Unassigned",
      lastActivity: new Date().toISOString().split("T")[0],
      createdDate: new Date().toISOString().split("T")[0],
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setLeads(prev => [newLead, ...prev])
    setForm({ name: "", company: "", email: "", phone: "", source: "", value: "", notes: "" })
    setIsAddDialogOpen(false)
  }

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.source.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground">
            Track and nurture your sales leads through the pipeline
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>
                Create a new lead entry with contact and qualification information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lead-name">Full Name</Label>
                  <Input
                    id="lead-name"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Enter company name"
                    value={form.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <Select
                    value={form.source}
                    onValueChange={(value) => handleInputChange("source", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Google Ads">Google Ads</SelectItem>
                      <SelectItem value="Cold Call">Cold Call</SelectItem>
                      <SelectItem value="Trade Show">Trade Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Estimated Value</Label>
                  <Input
                    id="value"
                    placeholder="$0"
                    value={form.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this lead"
                  value={form.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleCreateLead}>
                Create Lead
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>


      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              26.6% qualification rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.8M</div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Pipeline</CardTitle>
          <CardDescription>
            Track all leads through your sales funnel
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={lead.avatar || "/placeholder.svg"} alt={lead.name} />
                        <AvatarFallback>
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-muted-foreground">{lead.company}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-2 h-3 w-3" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-3 w-3" />
                        {lead.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{lead.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16">
                        <Progress value={lead.score} className="h-2" />
                      </div>
                      <span className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{lead.value}</TableCell>
                  <TableCell>{lead.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-3 w-3" />
                      {lead.lastActivity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/${orgName}/modules/crm/leads/${lead.id}`)}>
  View details
</DropdownMenuItem>
                        <DropdownMenuItem  onClick={() => router.push(`/${orgName}/modules/crm/leads/edit`)}>Edit lead</DropdownMenuItem>
                        <DropdownMenuItem>Convert to client</DropdownMenuItem>
                        <DropdownMenuItem>Schedule follow-up</DropdownMenuItem>
                        <DropdownMenuItem>Send email</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Mark as lost
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
