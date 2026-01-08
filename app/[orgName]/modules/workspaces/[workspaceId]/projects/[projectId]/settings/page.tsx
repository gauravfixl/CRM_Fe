"use client"

import { useParams } from "next/navigation"
import { useApp } from "@/contexts/app-context"
import { useEffect, useState } from "react"
import SettingsLayout from "@/components/SettingsLayout"

// Import content views
import { ProjectSettingsDetailsForm } from "@/components/projectsettings-detailform"
import Summary from "@/components/project/project-summary/Summary"
import People from "@/components/project/People"
import PermissionScheme from "@/components/project/PermissionScheme"
import NotificationSettings from "@/components/project/notifications/notification-settings"
import ProjectAuditSettingsPage from "@/components/project/notifications/ProjectAuditSettings"
import AutomationPage from "@/components/project/automation/automation-settings"
import Features from "@/components/project/features/Features"
import Toolchain from "@/components/project/toolchain"

import Workflows from "@/components/project/project-summary/Workflows"
import Workflow from "@/components/project/Workflow"

import Types from "@/components/project/workitems/pages/Types"
import IssueLayout from "@/components/project/workitems/pages/IssueLayout"
import Screens from "@/components/project/project-summary/Screens"
import FieldsPage from "@/components/project/workitems/pages/Fields"
import Collectors from "@/components/project/workitems/pages/Collectors"
import Security from "@/components/project/workitems/pages/Security"
import Versions from "@/components/project/Versions"
import Components from "@/components/project/Components"
import DevelopmentToolsEmptyState from "@/components/project/DevelopmentTools"
import MicrosoftTeamsIntegration from "@/components/project/Apps/MicrosoftTeamsIntegration"
import SlackIntegration from "@/components/project/Apps/SlackIntegration"
import { useLoaderStore } from "@/lib/loaderStore"
import { getProjectById } from "@/hooks/projectHooks"
import { getWorkspaceById } from "@/hooks/workspaceHooks"
import { getAllProjectMembers } from "@/hooks/projectMemberHooks"
import { showError, showSuccess } from "@/utils/toast"
import { fetchUsersApi } from "@/hooks/orgHooks"

const projectMenu = [
  "Details",
  "Summary",
  "People",
  "Permissions",
  {
    title: "Notifications",
    children: ["Settings", "Project email audit"],
  },
  "Automation",
  "Features",
  "Toolchain",
  "Workflows",
  {
    title: "Work Items",
    children: ["Types", "Layout", "Screens", "Fields", "Collectors", "Security"],
  },
  "Versions",
  "Components",
  "Development tools",
  {
    title: "Apps",
    children: ["Microsoft Teams", "Slack Integration"],
  },
]

interface Team {
  id: string;
  name: string;
}

interface ProjectSettingsPageProps {
  teams: Team[];
}

export default function ProjectSettingsPage({ teams }: ProjectSettingsPageProps) {
  const params = useParams()
  const workspaceId = params?.workspaceId as string
  const projectId = params?.projectId as string
  const [project, setProject] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [boardId, setBoardId] = useState(null)
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const { state } = useApp()
  const { showLoader, hideLoader } = useLoaderStore();
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("public")

  useEffect(() => {
    if (!params.projectId) return
    const fetchProject = async () => {
      try {
        showLoader()
        const res = await getProjectById(params.projectId as string, params.workspaceId as string)
        setProject(res?.project)
        if (res?.project?.boardId?._id) {
          setBoardId(res?.project?.boardId._id)
        }
      } catch (err) {
        console.error("Error fetching project:", err)
      } finally {
        hideLoader()
      }
    }
    fetchProject()
  }, [params.projectId, params.workspaceId])

  useEffect(() => {
    if (!workspaceId) return;
    const fetchWorkspace = async () => {
      try {
        showLoader()
        const res = await getWorkspaceById(workspaceId);
        setWorkspace(res.data.workspace);
      } catch (err) {
        console.error("Error fetching workspace:", err);
      } finally {
        hideLoader();
      }
    };
    fetchWorkspace();
  }, [workspaceId]);

  useEffect(() => {
    if (!projectId) return;
    const fetchMembers = async () => {
      try {
        showLoader()
        const res = await getAllProjectMembers(projectId);
        setMembers(res.data.members);
      } catch (err) {
        console.error("❌ Failed to fetch project members:", err);
      } finally {
        hideLoader();
      }
    };
    fetchMembers();
  }, [projectId]);

  useEffect(() => {
    const getUsers = async () => {
      showLoader();
      try {
        const res = await fetchUsersApi();
        const mappedUsers = res.users.map((u: any) => ({
          id: u.memberId,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          permissions: u.permissions?.map((p: any) => ({
            module: p.module,
            actions: p.actions?.filter(Boolean) || [],
          })),
        }));
        setUsers(mappedUsers);
      } catch (err) {
        console.error(err);
        showError("error fetching users")
      } finally {
        hideLoader();
      }
    };
    getUsers();
  }, []);

  if (!project || !workspace) {
    return null
  }

  const renderContent = (selectedTab: string) => {
    switch (selectedTab) {
      case "Details":
        return (
          <>
            <h2 className="text-2xl font-semibold mb-6">Details</h2>
            <ProjectSettingsDetailsForm
              project={project}
              workspace={workspace}
              projectName={projectName}
              setProjectName={setProjectName}
              projectDescription={projectDescription}
              setProjectDescription={setProjectDescription}
              visibility={visibility}
              setVisibility={setVisibility}
            />
          </>
        )
      case "Summary":
        return <Summary />
      case "People":
        return (
          <People
            parentId={workspaceId}
            entityId={projectId}
            workspaceId={workspaceId}
            level="project"
          />
        )
      case "Permissions":
        return <PermissionScheme />
      case "Notifications > Settings":
        return <NotificationSettings />
      case "Notifications > Project email audit":
        return <ProjectAuditSettingsPage />
      case "Automation":
        return <AutomationPage />
      case "Features":
        return <Features />
      case "Toolchain":
        return <Toolchain />
      case "Workflows":
        return <Workflow boardId={boardId} teams={teams!} />
      case "Work Items > Types":
        return <Types />
      case "Work Items > Layout":
        return <IssueLayout />
      case "Work Items > Screens":
        return <Screens />
      case "Work Items > Fields":
        return <FieldsPage />
      case "Work Items > Collectors":
        return <Collectors />
      case "Work Items > Security":
        return <Security />
      case "Versions":
        return <Versions />
      case "Components":
        return <Components />
      case "Development tools":
        return <DevelopmentToolsEmptyState />
      case "Apps > Microsoft Teams":
        return <MicrosoftTeamsIntegration />
      case "Apps > Slack Integration":
        return <SlackIntegration />
      default:
        return <div className="text-gray-500">Coming soon: {selectedTab}</div>
    }
  }

  return (
    <SettingsLayout
      title="Project"
      menuItems={projectMenu}
      renderContent={renderContent}
    />
  )
}
