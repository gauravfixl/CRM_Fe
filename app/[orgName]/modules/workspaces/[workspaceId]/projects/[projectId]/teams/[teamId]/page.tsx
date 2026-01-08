import { TeamDashboard } from "@/components/custom/team/team-dashboard"

export default function TeamPage({
  params,
}: {
  params: { workspaceId: string; teamId: string; projectId: string } // <-- added semicolon
}) {
  return (
    <TeamDashboard
      workspaceId={params.workspaceId}
      teamId={params.teamId}
      projectId={params.projectId}
    />
  );
}
