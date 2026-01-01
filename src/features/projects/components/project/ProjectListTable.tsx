import React from 'react';
import { Project } from '@/core/interfaces/project';
import { useTranslation } from '@nthucscc/utils';
import { FolderIcon } from '@nthucscc/ui';

interface ProjectListTableProps {
  projects: Project[];
  onClick?: (id: number) => void;
  // legacy / alternate prop name
  onProjectClick?: (id: number) => void;
  // Optional compatibility props used by pages that wrap this table
  error?: string | null;
  onDeleteProject?: (project: Project) => void;
  searchTerm?: string;
  isActionLoading?: boolean;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProjectListTable: React.FC<ProjectListTableProps> = ({
  projects,
  onClick,
  onProjectClick,
}) => {
  const { t } = useTranslation();

  if (projects.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t('project.name')}
            </th>
            <th className="hidden px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell dark:text-gray-400">
              {t('project.description')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t('project.group')}
            </th>
            <th className="hidden px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell dark:text-gray-400">
              {t('common.createdAt')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {projects.map((project) => (
            <tr
              key={project.PID}
              onClick={() => (onClick ?? onProjectClick)?.(project.PID)}
              className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="mr-4 flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <FolderIcon size={20} />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.ProjectName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ID: {project.PID}
                    </div>
                  </div>
                </div>
              </td>
              <td className="hidden px-6 py-4 md:table-cell">
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {project.Description || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  GID: {project.GID}
                </span>
              </td>
              <td className="hidden px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 sm:table-cell dark:text-gray-400">
                {new Date(project.CreatedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectListTable;
