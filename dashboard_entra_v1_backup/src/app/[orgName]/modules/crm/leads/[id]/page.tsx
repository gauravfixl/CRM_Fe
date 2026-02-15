"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  Target,
  MessageSquare,
  FileText,
  Clock,
  Plus,
  Activity,
  TrendingUp,
  MoreVertical,
  ChevronRight,
  Briefcase,
  DollarSign,
  User,
  MapPin,
  CheckCircle2,
  Zap,
  StickyNote
} from "lucide-react";

import { CustomButton } from "@/components/custom/CustomButton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useLoaderStore } from "@/lib/loaderStore";
import { getLeadById, updateLeadStage } from "@/hooks/leadHooks";
import { createDeal } from "@/modules/crm/deals/hooks/dealHooks";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// --- Helpers ---
const STAGE_CONFIG: Record<string, { color: string, bg: string, dot: string }> = {
  New: { color: "text-blue-700", bg: "bg-blue-50/50", dot: "bg-blue-500" },
  Qualified: { color: "text-emerald-700", bg: "bg-emerald-50/50", dot: "bg-emerald-500" },
  Proposal: { color: "text-amber-700", bg: "bg-amber-50/50", dot: "bg-amber-500" },
  Negotiation: { color: "text-purple-700", bg: "bg-purple-50/50", dot: "bg-purple-500" },
  Won: { color: "text-zinc-900", bg: "bg-zinc-100/50", dot: "bg-zinc-900" },
  Lost: { color: "text-red-700", bg: "bg-red-50/50", dot: "bg-red-500" },
  Hold: { color: "text-zinc-500", bg: "bg-zinc-50/50", dot: "bg-zinc-400" },
};

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  const orgName = params.orgName as string;

  const { showLoader, hideLoader } = useLoaderStore();
  const [lead, setLead] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [conversionData, setConversionData] = useState({
    value: 0,
    expectedCloseDate: "",
    title: "",
  });
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    if (lead) {
      setConversionData(prev => ({
        ...prev,
        title: `${lead.title || lead.contact?.name} - Opportunity`,
        value: lead.estimatedValue || 0
      }));
    }
  }, [lead]);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        showLoader();
        const response = await getLeadById(leadId);
        if (response.data?.lead) {
          setLead(response.data.lead);
        }
      } catch (err) {
        toast.error("Failed to load lead details");
      } finally {
        hideLoader();
      }
    };
    if (leadId) fetchLead();
  }, [leadId]);

  const handleConversion = async () => {
    if (!conversionData.title) {
      toast.error("Please provide an opportunity title");
      return;
    }

    setIsConverting(true);
    showLoader();

    try {
      // 1. Update Lead Stage to Won/Converted
      await updateLeadStage(leadId, "Won", "Lead successfully converted to opportunity", true);

      // 2. Create the Deal
      const dealPayload = {
        title: conversionData.title,
        value: conversionData.value,
        expectedCloseDate: conversionData.expectedCloseDate,
        firm: lead.firm?._id,
        stage: "New",
        priority: lead.priority || "Medium",
        source: lead.source || "Lead Conversion"
      };

      const dealRes = await createDeal(dealPayload);

      toast.success("Lead converted successfully! Redirecting to opportunity...");
      setIsConvertDialogOpen(false);

      // 3. Redirect to the new deal page
      if (dealRes?._id) {
        router.push(`/${orgName}/modules/crm/deals/${dealRes._id}`);
      } else {
        router.push(`/${orgName}/modules/crm/deals`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to convert lead");
    } finally {
      setIsConverting(false);
      hideLoader();
    }
  };
  if (!lead) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">

      {/* Header Navigation */}
      <div className="bg-white dark:bg-zinc-900 border-b px-8 py-4 shadow-sm relative z-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CustomButton variant="outline" size="sm" onClick={() => router.back()} className="h-9 px-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </CustomButton>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-xs font-medium">Leads</span>
            <ChevronRight className="h-3 w-3 text-zinc-300" />
            <span className="text-zinc-900 dark:text-zinc-100 text-sm font-bold">{lead.title || lead.contact?.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CustomButton variant="outline" className="h-9" onClick={() => router.push(`/${orgName}/modules/crm/leads/${leadId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Details
          </CustomButton>
          <CustomButton
            className="h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-bold"
            onClick={() => setIsConvertDialogOpen(true)}
            disabled={lead?.stage === "Won" || lead?.stage === "Converted"}
          >
            <Zap className="h-4 w-4 mr-2 fill-current" /> Convert to Deal
          </CustomButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <CustomButton className="h-9 bg-zinc-900 text-white">
                Actions <MoreVertical className="ml-2 h-4 w-4" />
              </CustomButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Log Call</DropdownMenuItem>
              <DropdownMenuItem>Send Email</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Delete Lead</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">

          {/* LEFT COLUMN: Main Info */}
          <div className="col-span-12 lg:col-span-8 space-y-8">

            {/* Lead Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[32px] p-10 border border-zinc-200/50 shadow-xl overflow-hidden relative"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] -mr-32 -mt-32" />

              <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-blue-500/20">
                  {lead.contact?.name?.[0] || lead.title?.[0] || "L"}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">{lead.title || "Sales Lead"}</h1>
                    <Badge className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${STAGE_CONFIG[lead.stage]?.color || "bg-zinc-50"} ${STAGE_CONFIG[lead.stage]?.bg}`}>
                      {lead.stage}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2 text-zinc-500 font-medium">
                      <Briefcase className="h-4 w-4 text-blue-500" />
                      <span>{lead.firm?.FirmName || "Global Operations"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 font-medium">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span>Created {new Date(lead.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 font-medium">
                      <Target className="h-4 w-4 text-emerald-500" />
                      <span>Lead ID: {lead.LeadId || "LEAD-001"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-dashed border-zinc-200 text-center min-w-[160px]">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Estimated Value</p>
                  <div className="flex items-center justify-center gap-1 text-2xl font-black text-zinc-900 dark:text-zinc-100">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    <span>{(lead.estimatedValue || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs Section */}
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200/50 shadow-sm overflow-hidden">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-zinc-50/50 dark:bg-zinc-800/50 w-full justify-start h-16 px-6 gap-8 rounded-none border-b">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none font-bold text-sm relative">
                    Overview
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full opacity-0 data-[state=active]:opacity-100 transition-opacity" />
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none font-bold text-sm relative">
                    Activities
                  </TabsTrigger>
                  <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none font-bold text-sm relative">
                    Stage History
                  </TabsTrigger>
                </TabsList>

                <div className="p-10">
                  <TabsContent value="overview" className="mt-0 space-y-10">
                    <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest border-b pb-2">Communication Hub</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Mail className="h-5 w-5" /></div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">Primary Email</p>
                              <p className="text-sm font-bold text-zinc-900 underline">{lead.contact?.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><Phone className="h-5 w-5" /></div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">Mobile Reach</p>
                              <p className="text-sm font-bold text-zinc-900">{lead.contact?.client?.phone || lead.contact?.phone || "Not recorded"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><User className="h-5 w-5" /></div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">Personal Contact</p>
                              <p className="text-sm font-bold text-zinc-900">{lead.contact?.name}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest border-b pb-2">Qualification Data</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-orange-50 text-orange-600"><Target className="h-5 w-5" /></div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">Lead Source</p>
                              <p className="text-sm font-bold text-zinc-900">{lead.source}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-zinc-100 text-zinc-600"><TrendingUp className="h-5 w-5" /></div>
                            <div>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase">Probability</p>
                              <div className="flex items-center gap-3">
                                <Progress value={65} className="h-2 w-24" />
                                <p className="text-sm font-bold text-zinc-900">65%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-zinc-800/20 p-8 rounded-[24px] border border-dashed border-zinc-200">
                      <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Internal Notes</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal italic">
                        "Prospect reached out via LinkedIn campaign. Interested in our automated billing module. Scheduled a technical demo with the CTO for next Tuesday."
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-0">
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-bold">Chronological Activity</h3>
                      <p className="text-sm text-zinc-400 max-w-sm mx-auto">Click on the Timeline tab in the sidebar for full activity history or use the quick list below.</p>
                      <CustomButton variant="outline" className="mt-4" onClick={() => router.push(`/${orgName}/modules/crm/leads/activities/timeline`)}>
                        Open Full Timeline
                      </CustomButton>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-0 space-y-6">
                    {lead.stageHistory?.map((entry: any, idx: number) => (
                      <div key={idx} className="flex gap-6 items-start relative pb-8 group last:pb-0">
                        {idx < lead.stageHistory.length - 1 && (
                          <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-zinc-100 group-last:hidden" />
                        )}
                        <div className="w-8 h-8 rounded-full border-4 border-white dark:border-zinc-900 bg-blue-600 shadow-md relative z-10" />
                        <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-white hover:shadow-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-900 uppercase tracking-tighter">Stage Transitioned to</span>
                              <Badge variant="outline" className="bg-white px-2 py-0 text-[10px] font-black">{entry.stage}</Badge>
                            </div>
                            <span className="text-[10px] text-zinc-400 font-bold">{new Date(entry.enteredAt).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-zinc-500 font-normal">{entry.notes || "No additional transition details recorded."}</p>
                        </div>
                      </div>
                    ))}
                    {!lead.stageHistory?.length && (
                      <div className="text-center py-10 opacity-40">No stage history recorded yet.</div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Stats */}
          <div className="col-span-12 lg:col-span-4 space-y-8">

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-indigo-700 to-blue-900 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-500/20">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Plus className="h-5 w-5" /> Quick Capture
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "New Call", icon: Phone, color: "bg-white/10 hover:bg-white/20" },
                  { label: "Add Note", icon: StickyNote, color: "bg-white/10 hover:bg-white/20" },
                  { label: "Schedule", icon: Calendar, color: "bg-white/10 hover:bg-white/20" },
                  { label: "Send Proposal", icon: FileText, color: "bg-white/10 hover:bg-white/20" },
                ].map((act, i) => (
                  <button key={i} className={`flex flex-col items-center gap-2 p-4 rounded-[22px] transition-all duration-300 ${act.color}`}>
                    <act.icon className="h-5 w-5" />
                    <span className="text-[10px] font-bold uppercase">{act.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Location & Info */}
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200/50 shadow-sm">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest border-b pb-4 mb-6">Client Logistics</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 rounded-2xl bg-zinc-50 text-zinc-500"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Business Location</p>
                    <p className="text-sm font-bold text-zinc-900 leading-tight">
                      {lead.contact?.client?.address?.line1 || "No address on file"},<br />
                      {lead.contact?.client?.address?.country || "International"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-3 rounded-2xl bg-zinc-50 text-zinc-500"><Building className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Enterprise Link</p>
                    <p className="text-sm font-bold text-zinc-900 underline">ABC Corporation HQ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Meter */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-100 dark:border-emerald-900/50 rounded-[32px] p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-emerald-700 uppercase tracking-widest">Lead Maturity</h3>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black text-emerald-900 dark:text-emerald-100">85%</span>
                  <span className="text-[10px] font-bold text-emerald-600 mb-1">READY FOR WON</span>
                </div>
                <Progress value={85} className="h-3 bg-emerald-100 [&>div]:bg-emerald-600" />
                <p className="text-[10px] text-emerald-700/70 font-medium leading-relaxed">
                  Excellent record quality! All communication fields are verified and legal address is validated.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Conversion Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10"><TrendingUp size={120} /></div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight uppercase">Convert to Opportunity</DialogTitle>
              <DialogDescription className="text-blue-100 font-medium">
                Elevate this lead to an active business opportunity in your pipeline.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6 bg-white dark:bg-zinc-900">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Opportunity Name</Label>
              <CustomInput
                value={conversionData.title}
                onChange={(e) => setConversionData({ ...conversionData, title: e.target.value })}
                placeholder="Name of the deal"
                className="h-12 bg-zinc-50 border-zinc-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Deal Value ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                  <CustomInput
                    type="number"
                    value={conversionData.value}
                    onChange={(e) => setConversionData({ ...conversionData, value: Number(e.target.value) })}
                    className="pl-9 h-12 bg-zinc-50 border-zinc-100 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Close Date</Label>
                <CustomInput
                  type="date"
                  value={conversionData.expectedCloseDate}
                  onChange={(e) => setConversionData({ ...conversionData, expectedCloseDate: e.target.value })}
                  className="h-12 bg-zinc-50 border-zinc-100"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <div className="p-2 bg-blue-600 rounded-lg text-white"><CheckCircle2 className="h-4 w-4" /></div>
              <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                Conversion will automatically create a <strong>Firm Account</strong> for the client and link this new <strong>Opportunity</strong> to their profile.
              </p>
            </div>
          </div>

          <DialogFooter className="p-8 bg-zinc-50/50 border-t border-zinc-100 rounded-b-[32px] sm:justify-between">
            <CustomButton variant="ghost" onClick={() => setIsConvertDialogOpen(false)} className="font-bold text-zinc-500">
              Cancel
            </CustomButton>
            <CustomButton
              onClick={handleConversion}
              disabled={isConverting}
              className="px-10 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-tighter shadow-xl shadow-blue-500/20 h-12 rounded-xl"
            >
              {isConverting ? "Processing..." : "Finish Conversion"}
            </CustomButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
