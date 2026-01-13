"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { showError, showSuccess, showWarning } from "@/utils/toast"
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"
import {
  assignMemberToProject,
  updateProjectMember,
  getAllProjectMembers,
  removeProjectMember
} from "@/modules/project-management/project-member/hooks/projectMemberHooks"
import {
  addWorkspaceMember,
  removeWorkspaceMember,
  getWorkspaceMembers,
} from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { fetchUsersApi } from "@/hooks/orgHooks"
import { useLoaderStore } from "@/lib/loaderStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { addTeamMember, removeTeamMember, getAllTeamMembers } from "@/modules/project-management/team/hooks/teamHooks"
import { Permission } from "../custom/Permission"

interface Member {
  id: string
  email: string
  role: string
  name?: string
  [key: string]: any
}

interface PeopleProps {
  entityId: string
  parentId?: string
  level: "org" | "workspace" | "team" | "project"
}

const scopeMap: Record<string, string> = {
  org: "sc-org",
  workspace: "sc-ws",
  team: "sc-team",
  project: "sc-prj",
}

export default function People({ entityId, parentId, level }: PeopleProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [parentMembers, setParentMembers] = useState<Member[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [selectedRole, setSelectedRole] = useState("WorkspaceMember")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)
  const [deleteReason, setDeleteReason] = useState("")
  const [deleteLevel, setDeleteLevel] = useState<"workspace" | "project" | "team" | "org">("workspace")

  const { showLoader, hideLoader } = useLoaderStore()
  const scope = scopeMap[level]

  // API wrappers
  const api = {
    add: async (payload: any) => {
      if (level === "project") return assignMemberToProject(entityId, payload)
      if (level === "workspace") return addWorkspaceMember(entityId, payload)
      if (level === "team") return addTeamMember(entityId, payload)
      return null
    },
    update: async (memberId: string, payload: any) => {
      if (level === "project") return updateProjectMember(entityId, memberId, payload)
      return null
    },
    delete: async (memberId: string, payload?: any) => {
      if (level === "workspace") return removeWorkspaceMember(entityId, payload)
      if (level === "project") return removeProjectMember(entityId, memberId, payload.workspaceId) // payload needs to contain workspaceId or passed separately
      if (level === "team" && parentId) return removeTeamMember(entityId, memberId, parentId)
      return null
    },
    getAll: async (id?: string, l?: string) => {
      if (l === "project") return getAllProjectMembers(id || entityId, { workspaceId: parentId })
      if (l === "workspace") return getWorkspaceMembers(id || entityId)
      if (l === "team" && parentId) return getAllTeamMembers(id || entityId, parentId)
      return null
    },
  }

  const fetchMembers = async () => {
    try {
      showLoader()
      const res = await api.getAll(entityId, level)
      const currentMembers = (res?.data?.members || []).map((m: any) => ({
        id: m._id || m.memberId,
        email: m.email,
        role: m.role,
        ...m,
      }))
      setMembers(currentMembers)

      let combinedParentMembers: Member[] = []
      if (level === "workspace" && parentId) {
        const orgRes = await fetchUsersApi()
        combinedParentMembers = (orgRes?.users || []).map((m: any) => ({
          id: m._id || m.memberId,
          email: m.email,
          role: m.role,
          ...m,
        }))
      } else if (level === "project" && parentId) {
        const wsRes = await api.getAll(parentId, "workspace")
        combinedParentMembers = (wsRes?.data?.members || []).map((m: any) => ({
          id: m._id || m.memberId,
          email: m.email,
          role: m.role,
          ...m,
        }))
      } else if (level === "team" && parentId) {
        const projRes = await api.getAll(parentId, "project")
        combinedParentMembers = (projRes?.data?.members || []).map((m: any) => ({
          id: m._id || m.memberId,
          email: m.email,
          role: m.role,
          ...m,
        }))
      }
      setParentMembers(combinedParentMembers)
    } catch (err) {
      showError("Failed to fetch members")
    } finally {
      hideLoader()
    }
  }

  const fetchRoles = async () => {
    try {
      showLoader()
      const resp = await getAllRolesNPermissions({ scope })
      if (resp?.data?.permissions && resp?.data?.iv) {
        const decrypted = decryptData(resp.data.permissions, resp.data.iv)
        setRoles(Array.isArray(decrypted) ? decrypted : [])
      }
    } catch (err) {
      showError("Failed to fetch roles")
    } finally {
      hideLoader()
    }
  }

  const handleAddMember = async () => {
    if (!selectedMemberId) {
      showWarning("Select at least 1 member")
      return
    }

    try {
      showLoader()
      const selectedMember = parentMembers.find((pm) => pm.id === selectedMemberId)
      if (!selectedMember) {
        showError("Selected member not found")
        return
      }

      let payload: any = {}
      if (level === "project") {
        payload = { memberId: selectedMember.id, role: selectedRole, workspaceId: parentId }
      } else if (level === "workspace") {
        payload = { email: selectedMember.email, role: selectedRole }
      } else if (level === "team") {
        payload = { memberId: selectedMember.id, projectId: parentId, role: "TeamMember" }
      }

      const res = await api.add(payload)
      if (res?.status === 201 || res?.status === 200) {
        showSuccess("Member added successfully")
        setSelectedMemberId("")
        setSelectedRole(roles[0]?.name || "")
        fetchMembers()
      } else {
        showError("Failed to add member")
      }
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to add member")
    } finally {
      hideLoader()
    }
  }

  const handleDeleteClick = (member: Member, lvl: "workspace" | "project" | "team" | "org") => {
    setMemberToDelete(member)
    setDeleteLevel(lvl)
    if (lvl === "workspace") {
      setIsDeleteModalOpen(true)
    } else {
      handleDeleteMember(member, "", lvl)
    }
  }

  const handleDeleteMember = async (member: Member, reason: string, level: "workspace" | "project" | "team" | "org") => {
    try {
      showLoader()
      let res;
      if (level === "workspace") {
        res = await removeWorkspaceMember(entityId, { email: member.email, reason: reason || "Removed by administrator" });
      } else if (level === "project") {
        res = await removeProjectMember(entityId, member.id, parentId!);
      } else if (level === "team" && parentId) {
        res = await removeTeamMember(entityId, member.id, parentId);
      }

      if (res?.status === 200 || res?.status === 201) {
        showSuccess("Member removed successfully")
        fetchMembers()
        setIsDeleteModalOpen(false)
        setDeleteReason("")
        setMemberToDelete(null)
      } else {
        showError("Failed to remove member")
      }
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to remove member")
    } finally {
      hideLoader()
    }
  }

  useEffect(() => {
    fetchRoles()
    fetchMembers()
  }, [entityId, level, parentId])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold capitalize">{level} Members</h2>

      {parentMembers.length > 0 && (
        <div className="border rounded p-3 bg-gray-50">
          <h3 className="font-medium text-sm mb-2">Available from Parent</h3>
          {parentMembers.map((pm) => (
            <div key={pm.id} className="flex justify-between py-1 text-sm">
              <span>{pm.email}</span>
              <span className="text-muted-foreground">{pm.role}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <select
          value={selectedMemberId}
          onChange={(e) => setSelectedMemberId(e.target.value)}
          className="border p-2 rounded flex-1"
        >
          <option value="">-- Select Member --</option>
          {parentMembers.map((pm) => (
            <option key={pm.id} value={pm.id}>{pm.email} ({pm.role})</option>
          ))}
        </select>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border p-2 rounded"
        >
          {roles.map((role) => (
            <option key={role._id} value={role.name}>{role.name}</option>
          ))}
        </select>

        <Permission module="project" action={["ADD_MEMBER", "ASSIGN_MEMBER_TO_PROJECT", "ADD_TEAM_MEMBER"]}>
          <Button onClick={handleAddMember}>Add</Button>
        </Permission>
      </div>

      <Permission module="project" action="VIEW_MEMBER_LIST">
        <div className="border rounded p-4">
          {members.length === 0 && <p className="text-gray-500">No members yet</p>}
          {members.map((m) => (
            <div key={m.id} className="flex justify-between items-center py-2 border-b last:border-none">
              <div>
                <span className="font-medium">{m.email}</span>
                <span className="ml-2 text-sm text-muted-foreground">({m.role || m.roleName})</span>
              </div>
              <Permission module="project" action="REMOVE_MEMBER">
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(m, level)}>Remove</Button>
              </Permission>
            </div>
          ))}
        </div>
      </Permission>

      {level === "workspace" && (
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Remove Member</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Please provide a reason for removing <span className="font-medium">{memberToDelete?.email}</span></p>
              <Textarea value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="Enter reason..." className="w-full" />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => { setIsDeleteModalOpen(false); setDeleteReason(""); setMemberToDelete(null); }}>Cancel</Button>
              <Button variant="destructive" onClick={() => memberToDelete && handleDeleteMember(memberToDelete, deleteReason, deleteLevel)}>Confirm Remove</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
