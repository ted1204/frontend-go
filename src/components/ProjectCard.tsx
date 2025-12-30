import React, { useEffect } from 'react';
import { Project } from '../interfaces/project';
import { useTranslation } from '@nthucscc/utils';
import { useGlobalWebSocket } from '../context/useGlobalWebSocket';
// English: Removed getUsername if namespace is now handled by project ID and backend logic

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

interface ProjectCardProps {
  project: Project;
  onClick: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // English: Destructure connectToNamespace to ensure the pool connection is active
  const { getProjectMessages, connectToNamespace } = useGlobalWebSocket();
  const { t } = useTranslation();

  /** * English: Namespace should match the format returned by GetUserProjectStorages (e.g., project-test-b1f7f5)
   * If the project object contains the namespace, use it directly.
   */
  const namespace = `project-${project.ProjectName?.toLowerCase()}-${project.PID}`;

  // English: Initiate connection for this specific project's namespace
  useEffect(() => {
    if (namespace) {
      connectToNamespace(namespace);
    }
  }, [namespace, connectToNamespace]);

  const messages = getProjectMessages(namespace);

  /**
   * English: Determine status based on filebrowser pod status.
   * Using 'includes' for pod names to match dynamic K8s naming conventions.
   */
  const isRunning = messages.some(
    (msg) => msg.kind === 'Pod' && msg.status === 'Running' && msg.name.includes('filebrowser'),
  );

  return (
    <div
      onClick={() => onClick(project.PID)}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 relative"
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className={`h-3 w-3 rounded-full ${
            isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        ></span>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
          {isRunning ? t('status.active') : t('status.idle')}
        </span>
      </div>

      <FolderIcon />
      <h4 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
        {project.ProjectName || t('project.untitled')}
      </h4>
      <p className="h-20 text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
        {project.Description || t('project.noDescription')}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
          {t('project.idLabel', { id: project.PID })}
        </span>
        {/* English: If project data includes role info, it could be displayed here as a PermissionBadge */}
      </div>
    </div>
  );
};

export default ProjectCard;
