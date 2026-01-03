import React from 'react';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { PermissionBadge, StatusBadge, StorageActionButtons } from './StorageComponents';
import { ProjectPVC } from '@/core/interfaces/projectStorage';
import type { ResourceMessage } from '@/shared/hooks/useWebSocket';

interface Props {
  data: ProjectPVC[];
  messages: ResourceMessage[];
  loadingState: Record<string, boolean>;
  onAction: (id: string, action: 'start' | 'stop') => void;
  onOpen: (id: string) => void;
  canManage: boolean;
}

// --- Grid View Component ---
// Renders the storage list as cards. Good for visual overview.
export const ProjectGridView: React.FC<Props> = ({
  data,
  messages,
  loadingState,
  onAction,
  onOpen,
  canManage,
}) => {
  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((storage, idx) => {
        // WebSocket Status Logic
        const msgs = messages.filter((m) => m.ns === storage.namespace);
        const podExists = msgs.some((m) => m.kind === 'Pod' && m.name.includes('filebrowser'));
        const isOnline = msgs.some(
          (m) => m.kind === 'Pod' && m.status === 'Running' && m.name.includes('filebrowser'),
        );
        // Allow manage if global flag or storage role is admin/manager
        const canManageRow =
          canManage ||
          ['admin', 'manager'].includes(
            (storage as unknown as { role?: string }).role?.toLowerCase?.() || '',
          );

        return (
          <div
            key={`${storage.id}-${storage.pvcName || idx}`}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl shrink-0">
                  <CircleStackIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-lg font-bold text-gray-900 dark:text-white truncate"
                    title={storage.projectName}
                  >
                    {storage.projectName}
                  </h3>
                  <div className="mt-1">
                    <PermissionBadge role={(storage as unknown as { role?: string }).role} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                    <div>NS: {storage.namespace}</div>
                    <div>
                      PVC:{' '}
                      {(storage as unknown as { pvcList?: string[] }).pvcList?.join(', ') ||
                        storage.pvcName ||
                        '-'}
                    </div>
                  </div>
                </div>
              </div>
              <StatusBadge isOnline={isOnline} />
            </div>

            {/* Reusing the shared button component in full mode */}
            <StorageActionButtons
              pId={storage.id}
              isOnline={isOnline}
              podExists={podExists}
              isLoading={!!loadingState[storage.id]}
              onAction={onAction}
              onOpen={onOpen}
              canManage={canManageRow}
              compact={false}
            />
          </div>
        );
      })}
    </div>
  );
};
