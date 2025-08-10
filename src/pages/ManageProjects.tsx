import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import {
  getProjects,
  createProject,
  Project,
  CreateProjectInput,
} from "../services/projectService";
import { useNavigate } from "react-router-dom";

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState<number>(0); // 假設初始值為 0，需根據實際群組選擇
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
          // 移除 isSuperAdmin 檢查，直接顯示所有專案
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
    const input: CreateProjectInput = { project_name: projectName, description, g_id: groupId };
    try {
      setLoading(true);
      const newProject = await createProject(input);
      console.log("New project created:", newProject);
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

  return (
    <div>
      <PageMeta
        title="React.js Manage Projects | TailAdmin - Admin Dashboard Template"
        description="This is Manage Projects page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Manage Projects" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* 創建專案表單 - 移除 isSuperAdmin 檢查，直接顯示 */}
        <div className="mx-auto w-full max-w-[630px] text-center mb-6">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Create New Project
          </h3>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleCreateProject} className="space-y-4">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={loading}
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
            <input
              type="number"
              value={groupId || ""}
              onChange={(e) => setGroupId(parseInt(e.target.value) || 0)}
              placeholder="Group ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Creating..." : "New Project"}
            </button>
          </form>
        </div>

        {/* 專案列表 */}
        <div className="mx-auto w-full max-w-[630px] text-left">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Project List
          </h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500">No projects found.</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project.PID}
                  className="border-b py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleProjectClick(project.PID)}
                >
                  <span className="font-medium">
                    {project.ProjectName || `Unnamed Project (ID: ${project.PID})`}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {project.Description || "No description"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Explore projects
          </button>
        </div>
      </div>
    </div>
  );
}