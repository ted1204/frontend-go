import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Project } from "../interfaces/project";
import ProjectList from "../components/ProjectList"
import { getProjects, createProject, deleteProject, CreateProjectDTO } from "../services/projectService";
import { useNavigate } from "react-router-dom";
import CreateProjectForm from "../components/CreateProjectForm";

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();
  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const allProjects = await getProjects();
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.user_id);
          setProjects(allProjects);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const input: CreateProjectDTO = { project_name: projectName, description, g_id: groupId };
    try {
      setLoading(true);
      const newProject = await createProject(input);
      if (newProject && newProject.PID) {
        setProjects((prevProjects) => [...prevProjects, newProject]);
      } else {
        setError("Invalid project data received from server");
      }
      setProjectName("");
      setDescription("");
      setGroupId(0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (ProjectId: number) => {
    const res = await deleteProject(ProjectId);
    if (res.message === "project deleted") {
      setProjects((prev) => prev.filter((p) => p.PID !== ProjectId));
    } else {
      console.error("刪除失敗:", res.message);
    }
  }

  return (
    <div>
      <PageMeta
        title="React.js Manage Projects | TailAdmin - Admin Dashboard Template"
        description="This is Manage Projects page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Manage Projects" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <CreateProjectForm
          projectName={projectName}
          description={description}
          groupId={groupId}
          loading={loading}
          error={error}
          onProjectNameChange={(e) => setProjectName(e.target.value)}
          onDescriptionChange={(e) => setDescription(e.target.value)}
          onGroupIdChange={(e) => setGroupId(parseInt(e.target.value) || 0)}
          onSubmit={handleCreateProject}
        />
        <ProjectList
          projects={projects}
          loading={loading}
          error={error}
          onProjectClick={handleProjectClick}
          onDeleteProject={handleDeleteProject}
        />
      </div>
    </div>
  );
}