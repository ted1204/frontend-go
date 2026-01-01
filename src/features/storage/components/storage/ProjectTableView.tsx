import React from 'react';
import { useTranslation } from '@nthucscc/utils';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { PermissionBadge, StatusBadge, StorageActionButtons } from './StorageComponents';
import { ProjectPVC } from '../../interfaces/projectStorage';
import type { ResourceMessage } from '../../hooks/useWebSocket';

interface Props {
  data: ProjectPVC[]; // List of projects
  messages: ResourceMessage[]; // WebSocket messages for status
  loadingState: Record<string, boolean>; // Loading status per project ID
  onAction: (id: string, action: 'start' | 'stop') => void;
  onOpen: (id: string) => void;
}

// --- Table View Component ---
// Renders the storage list in a dense table format.
export const ProjectTableView: React.FC<Props> = ({
  data,
  messages,
  loadingState,
  onAction,
  onOpen,
}) => {
  const { t } = useTranslation();

  if (data.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              {t('storage.project')}
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              {t('role.label', { role: '' }).replace(': ', '')}
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              {t('monitor.table.status')}
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              {t('table.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {data.map((storage) => {
            // Filter WS messages for this specific namespace
            const msgs = messages.filter((m) => m.ns === storage.namespace);
            // Check if any pod exists (Running, Pending, Error, etc.)
            const podExists = msgs.some((m) => m.kind === 'Pod' && m.name.includes('filebrowser'));
            // Check if the pod is strictly Running
            const isOnline = msgs.some(
              (m) => m.kind === 'Pod' && m.status === 'Running' && m.name.includes('filebrowser'),
            );

            return (
              <tr
                key={storage.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <CircleStackIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        {storage.projectName}
                      </div>
                      <div className="text-xs text-gray-500">NS: {storage.namespace}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PermissionBadge role={(storage as unknown as { role?: string }).role} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge isOnline={isOnline} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {/* Reusing the shared button component in compact mode */}
                  <StorageActionButtons
                    pId={storage.id}
                    isOnline={isOnline}
                    podExists={podExists}
                    isLoading={!!loadingState[storage.id]}
                    onAction={onAction}
                    onOpen={onOpen}
                    compact={true}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
