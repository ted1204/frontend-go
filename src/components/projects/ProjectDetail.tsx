import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageMeta from "../common/PageMeta";
import PageBreadcrumb from "../common/PageBreadCrumb";
import { getProjectById } from "../../services/projectService";

interface Project {
  PID: number;
  ProjectName: string;
  Description?: string;
  GID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        if (id) {
          const projectData = await getProjectById(parseInt(id));
          setProject(projectData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch project");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!project) return <p className="text-gray-500">Project not found.</p>;

  return (
    <div>
      <PageMeta
        title={`React.js Project ${project.ProjectName} | TailAdmin`}
        description={`Details for project ${project.ProjectName}`}
      />
      <PageBreadcrumb pageTitle={project.ProjectName} />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          Project Details
        </h3>
        <div className="space-y-2">
          <p><strong>ID:</strong> {project.PID}</p>
          <p><strong>Name:</strong> {project.ProjectName}</p>
          <p><strong>Description:</strong> {project.Description || "N/A"}</p>
          <p><strong>Group ID:</strong> {project.GID}</p>
          <p><strong>Created At:</strong> {project.CreatedAt}</p>
          <p><strong>Updated At:</strong> {project.UpdatedAt}</p>
        </div>
      </div>
    </div>
  );
}