import React from "react";
import { Project } from "../interfaces/project"; // Adjust import based on your structure

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onProjectClick: (projectId: number) => void;
  onDeleteProject: (projectId: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  loading,
  error,
  onProjectClick,
  onDeleteProject,
}) => {
  return (
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
              className="flex justify-between items-center border-b py-2 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <div
                onClick={() => onProjectClick(project.PID)}
                className="cursor-pointer"
              >
                <span className="font-medium dark:text-white">
                  {project.ProjectName || `Unnamed Project (ID: ${project.PID})`}
                </span>
                {project.Description && (
                  <span className="text-gray-500 ml-2">{project.Description}</span>
                )}
                {project.PID && (
                  <span className="text-gray-500 ml-2">id: {project.PID}</span>
                )}
              </div>
              <button
                className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project.PID);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Explore projects
      </button> */}
    </div>
  );
};

export default ProjectList;
