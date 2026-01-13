"use client";

import { useState, useEffect } from "react";
import { CustomButton } from "@/components/custom/CustomButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle, CustomDialogFooter
} from "@/components/custom/CustomDialog";
import { CustomSelect, CustomSelectContent, CustomSelectItem, CustomSelectTrigger, CustomSelectValue } from "@/components/custom/CustomSelect";
import { UserPlus, Trash2 } from "lucide-react";
import { useApp } from "@/contexts/app-context";
import { useToast } from "@/hooks/use-toast";
import { getTeamById, getAllTeamMembers, addTeamMember } from "@/modules/project-management/team/hooks/teamHooks";
import { getAllProjectMembers } from "@/modules/project-management/project-member/hooks/projectMemberHooks";
import { useLoaderStore } from "@/lib/loaderStore";
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks";
import { decryptData } from "@/utils/crypto";

interface TeamDashboardProps {
  workspaceId: string;
  teamId: string;
  projectId: string;
}

export function TeamDashboard({ workspaceId, teamId, projectId }: TeamDashboardProps) {
  const { state } = useApp();
  const { toast } = useToast();
  const [team, setTeam] = useState<any>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedMember, setCustomSelectedMember] = useState("");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const { showLoader, hideLoader } = useLoaderStore();
  const [selectedRole, setCustomSelectedRole] = useState("");
  const [teamRoles, setTeamRoles] = useState<any[]>([]);
  const scope = "sc-tm";

  useEffect(() => {
    if (!teamId) return;
    const fetchTeam = async () => {
      try {
        const fetchedTeam = await getTeamById(teamId);
        setTeam(fetchedTeam.data?.team);
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch team data", variant: "destructive" });
      }
    };
    fetchTeam();
  }, [teamId, toast]);

  useEffect(() => {
    if (!projectId) return;
    const fetchMembers = async () => {
      try {
        showLoader();
        const res = await getAllProjectMembers(projectId);
        setProjectMembers(res.data.members);
      } catch (err) {
        console.error("Failed to fetch project members:", err);
      } finally {
        hideLoader();
      }
    };
    fetchMembers();
  }, [projectId, showLoader, hideLoader]);

  useEffect(() => {
    if (!teamId) return;
    const fetchTeamMembers = async () => {
      try {
        const response = await getAllTeamMembers(teamId, projectId);
        setTeamMembers(response.data?.members || []);
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch team members", variant: "destructive" });
      }
    };
    fetchTeamMembers();
  }, [teamId, projectId, toast]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        showLoader();
        const projectRolesResp = await getAllRolesNPermissions({ scope });
        if (projectRolesResp?.data?.permissions && projectRolesResp?.data?.iv) {
          const decryptedTeam = decryptData(projectRolesResp.data.permissions, projectRolesResp.data.iv);
          setTeamRoles(Array.isArray(decryptedTeam) ? decryptedTeam : []);
        }
      } catch (err) {
        console.error("Error fetching roles and permissions:", err);
      } finally {
        hideLoader();
      }
    };
    fetchRoles();
  }, [scope, showLoader, hideLoader]);

  const availableMembers = projectMembers.filter(pm => !teamMembers.some(tm => tm.m_id === pm.m_id));

  const handleAddMember = async () => {
    if (!selectedMember || !selectedRole) return;
    try {
      showLoader();
      const body = { memberId: selectedMember, projectId, role: selectedRole };
      const res = await addTeamMember(teamId, body);
      if (res?.data?.success) {
        const memberData = availableMembers.find(m => m.m_id === selectedMember);
        if (memberData) {
          setTeamMembers(prev => [...prev, {
            _id: memberData.m_id,
            firstName: memberData.firstName || "",
            lastName: memberData.lastName || "",
            email: memberData.email,
            roleName: selectedRole,
            avatar: memberData.avatar || null,
          }]);
          toast({ title: "Member added", description: "Team member has been successfully added." });
          setCustomSelectedMember("");
          setCustomSelectedRole("");
          setIsAddMemberOpen(false);
        }
      } else {
        throw new Error(res?.data?.message || "Failed to add member");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Something went wrong", variant: "destructive" });
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="space-y-6 text-white">
      {team && (
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground">{team.description}</p>
          </div>
          <CustomButton onClick={() => setIsAddMemberOpen(true)} className="gap-2">
            <UserPlus size={16} /> Add Member
          </CustomButton>
        </div>
      )}

      <div className="space-y-4">
        {teamMembers.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl bg-muted/20">
            <h3 className="text-lg font-medium mb-1">No team members</h3>
            <p className="text-muted-foreground mb-4">Invite people to this team to start collaborating</p>
            <CustomButton onClick={() => setIsAddMemberOpen(true)} variant="outline">Add First Member</CustomButton>
          </div>
        ) : (
          teamMembers.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-4 bg-muted/30 border rounded-xl hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarImage src={member.avatar ?? `/placeholder.svg`} />
                  <AvatarFallback className="bg-primary/10 text-primary">{member.firstName?.charAt(0) || "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{member.firstName} {member.lastName}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="font-normal">{member.roleName}</Badge>
                <CustomButton variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10"><Trash2 size={16} /></CustomButton>
              </div>
            </div>
          ))
        )}
      </div>

      <CustomDialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <CustomDialogContent className="sm:max-w-md">
          <CustomDialogHeader><CustomDialogTitle>Add Team Member</CustomDialogTitle></CustomDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Member</label>
              <CustomSelect value={selectedMember} onValueChange={setCustomSelectedMember}>
                <CustomSelectTrigger><CustomSelectValue placeholder="Choose a person" /></CustomSelectTrigger>
                <CustomSelectContent>
                  {availableMembers.length === 0 ? <CustomSelectItem value="none" disabled>No available members</CustomSelectItem> :
                    availableMembers.map(m => <CustomSelectItem key={m.m_id} value={m.m_id}>{m.firstName ?? m.email} ({m.email})</CustomSelectItem>)}
                </CustomSelectContent>
              </CustomSelect>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Role</label>
              <CustomSelect value={selectedRole} onValueChange={setCustomSelectedRole}>
                <CustomSelectTrigger><CustomSelectValue placeholder="Select a role" /></CustomSelectTrigger>
                <CustomSelectContent>
                  {teamRoles.length === 0 ? <CustomSelectItem value="none" disabled>No roles available</CustomSelectItem> :
                    teamRoles.map(role => <CustomSelectItem key={role._id} value={role.name}>{role.name}</CustomSelectItem>)}
                </CustomSelectContent>
              </CustomSelect>
            </div>
          </div>
          <CustomDialogFooter>
            <CustomButton variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</CustomButton>
            <CustomButton onClick={handleAddMember} disabled={!selectedMember || !selectedRole}>Add Member</CustomButton>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  );
}
