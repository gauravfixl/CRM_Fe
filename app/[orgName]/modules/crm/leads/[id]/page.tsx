"use client"

import { useState,useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, Calendar, Target, MessageSquare, FileText, Clock, Plus, Activity, TrendingUp } from 'lucide-react'
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"
import { getLeadById,updateLeadStage } from "@/hooks/leadHooks"
import { useLoaderStore } from "@/lib/loaderStore"
import { CustomCard } from "@/components/custom/CustomCard"

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
    case "Won":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
    case "Lost":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}
const getScoreFromStatus = (status: string) => {
  switch (status) {
    case "New": return 20
    case "Contacted": return 35
    case "Qualified": return 50
    case "Proposal": return 70
    case "Negotiation": return 85
    case "Closed-Won": return 100
    case "Closed-Lost": return 0
    default: return 20
  }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600"
  if (score >= 70) return "text-yellow-600"
  if (score >= 50) return "text-blue-600"
  return "text-red-600"
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "call": return <Phone className="h-4 w-4" />
    case "email": return <Mail className="h-4 w-4" />
    case "meeting": return <Calendar className="h-4 w-4" />
    case "note": return <FileText className="h-4 w-4" />
    case "status_change": return <TrendingUp className="h-4 w-4" />
    case "created": return <Plus className="h-4 w-4" />
    case "updated": return <Edit className="h-4 w-4" />
    default: return <Activity className="h-4 w-4" />
  }
}

export default function LeadDetailsPage() {
  const params = useParams()
  const leadId = params.id as string
  const {  updateLeadStatus, addLeadActivity } = useAppStore()
  const [orgName, setOrgName]= useState("")

  // const lead = getLeadById(leadId)
    const [lead, setLead] = useState<any>(null);
  const [error, setError] = useState("")
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false)
  const {showLoader,hideLoader}=useLoaderStore()
  const [statusForm, setStatusForm] = useState({
    status: lead?.status || "New",
    notes: ""
  })
  const [activityForm, setActivityForm] = useState({
    type: "note" as const,
    title: "",
    description: "",
    performedBy: "Current User"
  })
   const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [convertForm, setConvertForm] = useState({ reason: "" });
useEffect(() => {
    const storedOrg = localStorage.getItem("orgName") || "";
    setOrgName(storedOrg);
  }, []);
//  const handleStatusUpdate = async () => {
//   if (!lead) return;

//   try {
//      setIsStatusDialogOpen(false);
//     showLoader(); // <-- show loader before API call

//     await updateLeadStage(
//       lead.id,
//       statusForm.status as string,
//       statusForm.notes,  // reason
//       false              // or true if you want to create a client
//     );

//     toast.success("Lead status updated successfully!");
   
//     setStatusForm({ status: statusForm.status, notes: "" });
//   } catch (err) {
//     console.error("Failed to update lead stage:", err);
//     toast.error("Failed to update lead stage.");
//   } finally {
//     hideLoader(); // <-- always hide loader
//   }
// };
const handleStatusUpdate = async () => {
  if (!lead) return;

  if (statusForm.status === "Closed-Won") {
    setIsStatusDialogOpen(false);
    setIsConvertDialogOpen(true);
    return; // Do not update stage yet
  }

  try {
    setIsStatusDialogOpen(false);
    showLoader();

    await updateLeadStage(
      lead.id,
      statusForm.status,
      statusForm.notes,
      false
    );

    setLead(prev => prev ? { ...prev, status: statusForm.status } : prev);
    toast.success("Lead status updated successfully!");
    setStatusForm({ status: statusForm.status, notes: "" });
  } catch (err) {
    console.error("Failed to update lead stage:", err);
    toast.error("Failed to update lead stage.");
  } finally {
    hideLoader();
  }
};

const handleConvertToClient = async () => {
    if (!lead) return;
    try {
      showLoader();
      setIsConvertDialogOpen(false);

      const payload = {
        stage: "Closed-Won",
        reason: convertForm.reason,
        createClient: false
      };

      await updateLeadStage(lead.id, payload.stage, payload.reason, payload.createClient);
      setLead(prev => prev ? { ...prev, status: "Closed-Won" } : prev);

      toast.success("Lead converted successfully!");
      setConvertForm({ reason: "" });
    } catch (err) {
      console.error("Failed to convert lead:", err);
      toast.error("Failed to convert lead.");
    } finally {
      hideLoader();
    }
  };


  const handleAddActivity = () => {
    if (!lead || !activityForm.title) {
      toast.error("Please fill in the activity title")
      return
    }
    
    addLeadActivity(lead.id, activityForm)
    setIsActivityDialogOpen(false)
    setActivityForm({
      type: "note",
      title: "",
      description: "",
      performedBy: "Current User"
    })
    toast.success("Activity added successfully!")
  }
  function mapLeadResponse(apiLead: any) {
  return {
    id: apiLead._id,
    name: apiLead.contact?.name || apiLead.title || "Unnamed Lead",
    email: apiLead.contact?.email || "Not provided",
    phone: apiLead.contact?.phone || "",
    company: apiLead.organization?.name || apiLead.firm?.FirmName || "No Company",
    status: apiLead.stage || "New",
    value: apiLead.value || 0, // default if not provided
    source: apiLead.source || "Unknown",
    assignedTo: apiLead.assignedTo?.email || "Unassigned",
    createdAt: apiLead.createdAt,
    updatedAt: apiLead.updatedAt,
    stageHistory: apiLead.stageHistory?.map((s: any) => ({
      id: s._id || s.enteredAt,
      fromStatus: null,
      toStatus: s.stage,
      changedAt: s.enteredAt,
      changedBy: s.changedBy || "System",
      notes: s.notes || ""
    })) || [],
    activities: apiLead.interactions?.map((i: any) => ({
      id: i._id || i.performedAt,
      type: i.type || "note",
      title: i.title || "Interaction",
      description: i.description || "",
      performedAt: i.performedAt || apiLead.updatedAt,
      performedBy: i.performedBy || "Unknown"
    })) || []
  };
}
//   useEffect(() => {
//   if (lead?.status === "Closed-Won") {
//     setIsConvertDialogOpen(true);
//   }
// }, [lead?.status]);
useEffect(() => {
  const fetchLead = async () => {
    try {
      showLoader();   // <-- Show loader
      const response = await getLeadById(leadId);
      if (response.data) {
        setLead(mapLeadResponse(response.data.lead));
      } else {
        setLead(null);
      }
    } catch (err) {
      console.error("Error fetching lead:", err);
      setLead(null);
    } finally {
      hideLoader();  // <-- Always hide loader
    }
  };
  if (leadId) fetchLead();
}, [leadId, showLoader, hideLoader]);


  if (!lead) {
    return (
      <div className="space-y-6 lead-detail-page">
        <div className="flex items-center space-x-2">
      <Link href={`/${orgName}/modules/crm/leads`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leads
            </Button>
          </Link>
        </div>
        {/* <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium">Lead Not Found</h3>
              <p className="text-muted-foreground">The lead with ID "{leadId}" could not be found.</p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    )
  }



  const score = getScoreFromStatus(lead.status)

  return (
    <div className="space-y-6 lead-detail-page">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
           <Link href={`/${orgName}/modules/crm/leads`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leads
            </Button>
          </Link>
        </div>
        <div className="flex space-x-2 lead-actions-div">
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild className="update-lead-status-btn">
              <Button variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Update Status
              </Button>
            </DialogTrigger>
            <DialogContent  className="update-lead-status-dialog">
              <DialogHeader>
                <DialogTitle>Update Lead Status</DialogTitle>
                <DialogDescription>
                  Change the status of this lead and add notes about the change.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">New Status</Label>
                  <Select 
                    value={statusForm.status} 
                    onValueChange={(value) => setStatusForm(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
             <SelectContent>
  <SelectItem value="New">New</SelectItem>
  <SelectItem value="Contacted">Contacted</SelectItem>
  <SelectItem value="Qualified">Qualified</SelectItem>
  <SelectItem value="Proposal">Proposal</SelectItem>
  <SelectItem value="Negotiation">Negotiation</SelectItem>
  <SelectItem value="Closed-Won">Closed-Won</SelectItem>
  <SelectItem value="Closed-Lost">Closed-Lost</SelectItem>
</SelectContent>

                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={statusForm.notes}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add notes about this status change..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate}>Update Status</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
            <DialogTrigger asChild >
              {/* <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Activity
              </Button> */}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Activity</DialogTitle>
                <DialogDescription>
                  Record a new activity or interaction with this lead.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Activity Type</Label>
                  <Select 
                    value={activityForm.type} 
                    onValueChange={(value: any) => setActivityForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="note">Note</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={activityForm.title}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter activity title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={activityForm.description}
                    onChange={(e) => setActivityForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add details about this activity..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsActivityDialogOpen(false)}>
                  Cancel
                </Button>
                {/* <Button onClick={handleAddActivity}>Add Activity</Button> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Link href={`/${orgName}/modules/crm/leads/${lead.id}/edit`}>
            <Button variant="outline" className="edit-lead-btn">
              <Edit className="mr-2 h-4 w-4" />
              Edit Lead
            </Button>
          </Link>
          {/* <Button>
            Convert to Client
          </Button> */}
        </div>
      </div>

      {/* Lead Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between lead-main-detail-container">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 lead-avatar">
                <AvatarImage src="/placeholder.svg" alt={lead.name} />
                <AvatarFallback className="text-lg">
                  {lead.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl lead-name">{lead.name}</CardTitle>
                <CardDescription className="text-base">
                  {lead.company}
                </CardDescription>
                <div className="flex items-center space-x-4 mt-2 lead-status">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground lead-score">Score:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16">
                        <Progress value={score} className="h-2" />
                      </div>
                      <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                        {score}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Value: <span className="font-medium text-green-600 lead-value">${lead.value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground lead-assignee">
            Lead from {lead.source} - Assigned to {lead.assignedTo || "Unassigned"}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview lead-tabs" className="space-y-4 ">
        <TabsList>
          <TabsTrigger value="overview" className="lead-overview-tab-header">Overview</TabsTrigger>
          <TabsTrigger value="stage-history"  className="lead-stage-history-tab-header">Stage History</TabsTrigger>
          {/* <TabsTrigger value="activities">Activities</TabsTrigger> */}
          {/* <TabsTrigger value="tasks">Tasks</TabsTrigger> */}
        </TabsList>

     <TabsContent value="overview" className="space-y-4  lead-overview-tab-content">
  <div className="grid gap-1 md:grid-cols-2 ">
    {/* Contact Information */}
    <CustomCard
      title={
        <div className="flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          Contact Information
        </div>
      }
      padding="xs"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Email</label>
          <p className="font-medium">{lead.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Phone</label>
          <p className="font-medium">{lead.phone || "Not provided"}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Company</label>
          <p className="font-medium">{lead.company}</p>
        </div>
      </div>
    </CustomCard>

    {/* Lead Information */}
    <CustomCard
      title={
        <div className="flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Lead Information
        </div>
      }
      padding="xs"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Source</label>
          <p className="font-medium">{lead.source}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
          <p className="font-medium">{lead.assignedTo || "Unassigned"}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Created Date</label>
          <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
          <p className="font-medium">{new Date(lead.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </CustomCard>
  </div>
</TabsContent>


        {/* <TabsContent value="stage-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stage History</CardTitle>
              <CardDescription>
                Complete history of status changes for {lead.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.stageHistory?.map((stage, index) => (
                  <div key={stage.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {stage.fromStatus ? `${stage.fromStatus} → ${stage.toStatus}` : `Initial: ${stage.toStatus}`}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(stage.changedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Changed by {stage.changedBy}</p>
                      {stage.notes && (
                        <p className="text-sm mt-1 p-2 bg-muted rounded">{stage.notes}</p>
                      )}
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center py-4">No stage history available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
<TabsContent value="stage-history" className="space-y-2  overflow-y-auto h-[40vh] pb-3 lead-stage-history-tab-content">
  <Card className="stage-history-leadlist">
    <CardHeader>
      <CardTitle className="text-sm">Stage History</CardTitle>
      <CardDescription className="text-xs">
        Complete history of status changes for {lead.name}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-1">
        {lead.stageHistory && lead.stageHistory.length > 0 ? (
          lead.stageHistory.map((stage, index) => (
            <div
              key={stage.id}
              className={`flex items-start space-x-4 p-2 rounded ${
                index % 2 === 0 ? "bg-white" : "bg-primary/50"
              }`}
            >
              <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">
                    {stage.fromStatus
                      ? `${stage.fromStatus} → ${stage.toStatus}`
                      : `Initial: ${stage.toStatus}`}
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(stage.changedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Changed by {stage.changedBy}
                </p>
                {stage.notes && (
                  <p className="text-[11px] mt-1 p-1 bg-muted rounded">{stage.notes}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4 text-xs">
            No stage history available
          </p>
        )}
      </div>
    </CardContent>
  </Card>
</TabsContent>

        {/* <TabsContent value="activities" className="space-y-4 ">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>
                Complete history of interactions and activities with {lead.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lead.activities?.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                    <div className="flex-shrink-0 p-2 bg-muted rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{activity.title}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(activity.performedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">by {activity.performedBy}</p>
                      {activity.description && (
                        <p className="text-sm mt-1">{activity.description}</p>
                      )}
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground text-center py-4">No activities recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Upcoming tasks and follow-ups for {lead.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Follow up call</p>
                      <p className="text-sm text-muted-foreground">Due: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline">pending</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Send proposal</p>
                      <p className="text-sm text-muted-foreground">Due: {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline">pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
         {/* <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
            <DialogTrigger asChild>
              <Button>Convert to Client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convert Lead to Client</DialogTitle>
                <DialogDescription>
                  Provide a reason for converting this lead to a client.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="convertReason">Reason *</Label>
                  <Textarea
                    id="convertReason"
                    value={convertForm.reason}
                    onChange={(e) =>
                      setConvertForm({ ...convertForm, reason: e.target.value })
                    }
                    placeholder="e.g., Prospect confirmed budget & authority"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsConvertDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleConvertToClient} disabled={!convertForm.reason}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
    </div>

  )
}
