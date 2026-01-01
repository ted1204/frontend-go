// src/components/admin-storage/project/ProjectStorageList.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { toast } from 'react-hot-toast';
import { CubeIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Services & Types
import { getProjectStorages, deletePVC } from '@/core/services/storageService';
import { ProjectPVC } from '@/core/interfaces/projectStorage';
// Global WebSocket (not used here)

interface ProjectStorageListProps {
  refreshTrigger: number; // 用於從父層觸發刷新
}

const ProjectStorageList: React.FC<ProjectStorageListProps> = ({ refreshTrigger }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [pvcs, setPvcs] = useState<ProjectPVC[]>([]);

  // 2. Fetch Data Function
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getProjectStorages();
      setPvcs(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load storage list');
    } finally {
      setLoading(false);
    }
  };

  // Initial load & Refresh trigger
  useEffect(() => {
    fetchData();
  }, [refreshTrigger]); // 當 WebSocket 連上時也可以刷新一次確保資料最新

  const handleExpand = (pvcName: string) => {
    const newSize = prompt(t('admin.storage.project.actionExpandPrompt'));
    if (newSize) {
      // TODO: Implement expandPVC API call
      toast.success(`Expand request sent for ${pvcName} (Pending Implementation)`);
    }
  };

  const handleDelete = async (namespace: string, pvcName: string) => {
    if (confirm(t('admin.storage.project.actionConfirmDelete'))) {
      try {
        await deletePVC(namespace, pvcName);
        toast.success(t('common.success'));
        fetchData(); // Reload list after delete
      } catch (err: unknown) {
        const e = err as { message?: string };
        toast.error(e.message || 'Delete failed');
      }
    }
  };

  if (loading && pvcs.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Manual Refresh Button (Optional but useful) */}
      <div className="flex justify-end p-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={fetchData}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.storage.project.list.project')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.storage.project.list.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.storage.project.list.capacity')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.storage.project.list.age')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('admin.storage.project.list.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {pvcs.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                {t('admin.storage.project.list.empty')}
              </td>
            </tr>
          ) : (
            pvcs.map((pvc) => (
              <tr
                key={pvc.pvcName}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <CubeIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {pvc.projectName || `Project ${pvc.id}`}
                      </div>
                      <div className="text-xs text-gray-500">{pvc.namespace}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pvc.status === 'Bound'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : pvc.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {pvc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {pvc.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {/* ISO Date String to Locale Date */}
                  {new Date(pvc.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleExpand(pvc.pvcName)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                      title={t('admin.storage.project.actionEdit')}
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pvc.namespace, pvc.pvcName)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                      title={t('admin.storage.project.actionDelete')}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectStorageList;
