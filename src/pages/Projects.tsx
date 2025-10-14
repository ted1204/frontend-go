import React, { useState, useEffect } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { Project } from "../interfaces/project";
import { getProjects } from "../services/projectService";
import { getGroupsByUser } from "../services/userGroupService";
import { useNavigate } from "react-router-dom";

// A simple folder icon component for visual flair
const FolderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-blue-500 mb-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndFilterProjects = async () => {
      setLoading(true);
      try {
        // Get user data from localStorage first
        const userData = localStorage.getItem("userData");
        if (!userData) {
          throw new Error("User not logged in.");
        }
        const { user_id: userId } = JSON.parse(userData);

        // Fetch all projects and user's groups concurrently for better performance
        const [allProjects, userGroups] = await Promise.all([
          getProjects(),
          getGroupsByUser(userId),
        ]);

        // Filter projects based on user's group memberships
        const userGroupIds = userGroups.map((ug) => ug.GID);
        const filteredProjects = allProjects.filter((project) =>
          userGroupIds.includes(project.GID)
        );

        setProjects(filteredProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterProjects();
  }, []); // The dependency array is empty, so this runs only once on mount.

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  // Helper component for the loading state (Skeleton)
  const SkeletonCard = () => (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      <div className="mb-2 h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
      <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-600"></div>
      <div className="mt-1 h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-600"></div>
    </div>
  );

  // Helper component for displaying states like error or no projects
  const StateDisplay = ({ message }: { message: string }) => (
    <div className="col-span-full mt-10 flex flex-col items-center justify-center text-center">
      <p className="text-lg text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );

  return (
    <div>
      <PageMeta
        title="My Projects | TailAdmin"
        description="List of accessible projects."
      />
      <PageBreadcrumb pageTitle="Projects" />

      {/* Main container for the project grid */}
      <div className="rounded-2xl p-4 md:p-6 2xl:p-10">
        <h3 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
          My Projects
        </h3>

        {/* The main content area */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            // Show 6 skeleton cards while loading
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <StateDisplay message={`Error: ${error}`} />
          ) : projects.length === 0 ? (
            <StateDisplay message="No projects assigned to your groups." />
          ) : (
            // Map over the projects to create cards
            projects.map((project) => (
              <div
                key={project.PID}
                onClick={() => handleProjectClick(project.PID)}
                // Card styling with hover effects and transitions
                className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500"
              >
                <FolderIcon />
                <h4 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {project.ProjectName || `Unnamed Project`}
                </h4>
                <p className="h-20 text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
                  {project.Description || "No description provided."}
                </p>
                <span className="mt-4 inline-block text-xs font-medium text-gray-400 dark:text-gray-500">
                  Project ID: {project.PID}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}