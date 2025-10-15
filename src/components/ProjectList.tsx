import React, { ChangeEvent } from 'react';
import { Project } from '../interfaces/project';

// SVG Icon for a simple Loading Spinner
const SpinnerIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// SVG Icon for Deletion (Trash Can)
const TrashIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

// SVG Icon for Search
const SearchIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onProjectClick: (projectId: number) => void;
  onDeleteProject: (projectId: number) => void;
  // Props for the new search functionality
  searchTerm: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  loading,
  error,
  onProjectClick,
  onDeleteProject,
  searchTerm,
  onSearchChange,
}) => {
  // Determine if filtering is active to show the correct empty state message
  const isFiltering = searchTerm.length > 0;

  return (
    <div className="text-left">
      {/* List Title Section: Subdued, clean heading with a separator line */}
      <div className="mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Project List
        </h3>
      </div>

      {/* Search Input Field: Clean, modern design with an integrated search icon */}
      <div className="mb-6 relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search projects by name, description, or ID..."
          value={searchTerm}
          onChange={onSearchChange}
          className="
                w-full 
                py-2 pl-10 pr-4 // Padding adjusted for icon space
                border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white 
                rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition duration-150
            "
        />
      </div>

      {/* --- Status Display Area --- */}
      {loading ? (
        // Loading State: Centered spinner feedback
        <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <SpinnerIcon className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading projects...
          </p>
        </div>
      ) : error ? (
        // Error State: Visually distinct alert box
        <p className="p-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300 rounded-lg">
          Error: {error}
        </p>
      ) : projects.length === 0 ? (
        // Empty State: Dynamic message based on whether the user is searching
        <p className="p-4 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
          {isFiltering
            ? `No projects match "${searchTerm}". Try a different term.`
            : `No projects found. Create a new project to get started.`}
        </p>
      ) : (
        /* --- Main Project List Body --- */
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.PID}
              // Item Card Styling: Clean card appearance with enhanced hover effects
              className="
                flex justify-between items-center 
                p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm 
                bg-white dark:bg-gray-800 
                hover:shadow-md hover:border-violet-300 dark:hover:border-violet-500 
                transition duration-150 ease-in-out
              "
            >
              {/* Clickable Area - Project Information */}
              <div
                onClick={() => onProjectClick(project.PID)}
                className="cursor-pointer flex-grow pr-4"
              >
                <div className="flex items-baseline mb-1">
                  {/* Project Name: Primary content, bold text */}
                  <span className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                    {project.ProjectName ||
                      `Unnamed Project (ID: ${project.PID})`}
                  </span>
                  {/* Project ID: Secondary metadata */}
                  {project.PID && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-3 flex-shrink-0">
                      ID: {project.PID}
                    </span>
                  )}
                </div>

                {/* Description: Subdued text, clamped to one line */}
                {project.Description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {project.Description}
                  </p>
                )}
              </div>

              {/* Delete Button (Icon) */}
              <button
                className="
                  flex items-center justify-center w-8 h-8 rounded-full 
                  text-red-500 hover:text-white 
                  bg-transparent hover:bg-red-500 
                  transition duration-150 flex-shrink-0
                "
                aria-label={`Delete project ${project.ProjectName}`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation click
                  onDeleteProject(project.PID);
                }}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectList;
