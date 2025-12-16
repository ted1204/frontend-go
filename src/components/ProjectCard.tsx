import React from 'react';
import { Project } from '../interfaces/project';
import useTranslation from '../hooks/useTranslation';
import { useGlobalWebSocket } from '../context/WebSocketContext';
import { getUsername } from '../services/authService';

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
  // Connect to WebSocket for this project
  const { getProjectMessages } = useGlobalWebSocket();
  const username = getUsername();
  const namespace = `proj-${project.PID}-${username}`;
  const messages = getProjectMessages(namespace);

  // Determine status based on messages
  // If we have any running pods, we consider the project "Active"
  const runningPods = messages.filter(
    (msg) => msg.kind === 'Pod' && msg.status === 'Running'
  );
  const isRunning = runningPods.length > 0;
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onClick(project.PID)}
      className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 relative"
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span
          className={`h-3 w-3 rounded-full ${
            isRunning ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        ></span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
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
      <span className="mt-4 inline-block text-xs font-medium text-gray-400 dark:text-gray-500">
        {t('project.idLabel', { id: project.PID })}
      </span>
    </div>
  );
};

export default ProjectCard;
