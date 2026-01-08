"use client";

import { useEffect, useState } from "react";
import { getProjectById } from "@/hooks/projectHooks";
import { ProjectDashBoard } from "@/components/project-dashboard";
import { useLoaderStore } from "@/lib/loaderStore";

export default function BoardPage({
  params,
}: {
  params: { workspaceId: string; projectId: string };
}) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showLoader, hideLoader } = useLoaderStore();

  useEffect(() => {
    if (!params.projectId) return;

    const fetchProject = async () => {
      setLoading(true);
      showLoader();
      try {
        const res = await getProjectById(params.projectId, params.workspaceId);
        setProject(res?.project);
      } catch (err) {
        console.error("Error fetching project:", err);
        setProject(null);
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchProject();
  }, [params.projectId, params.workspaceId, showLoader, hideLoader]);

  if (loading) return <div />;

  return (
    <ProjectDashBoard
      workspaceId={params.workspaceId}
      projectId={params.projectId}
      project={project}
    />
  );
}
