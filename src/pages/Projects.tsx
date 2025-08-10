import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { getProjects, Project } from "../services/projectService";
import { getGroupsByUser } from "../services/userGroupService";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  useEffect(() => {
    const fetchProjectsAndFilter = async () => {
      try {
        setLoading(true);
        const allProjects = await getProjects();
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData.user_id);

          if (userId) {
            const userGroups = await getGroupsByUser(userId);
            const userGroupIds = userGroups.map((ug) => ug.gid);
            const filteredProjects = allProjects.filter((project) =>
              userGroupIds.includes(project.GID)
            );
            setProjects(filteredProjects);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectsAndFilter();
  }, [userId]);

  return (
    <div>
      <PageMeta
        title="React.js Projects Dashboard | TailAdmin"
        description="This is Projects Dashboard page for TailAdmin"
      />
      <PageBreadcrumb pageTitle="Projects" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
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