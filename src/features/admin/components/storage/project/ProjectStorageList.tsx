import React, { useEffect, useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { toast } from 'react-hot-toast';
import { CubeIcon, PencilSquareIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Services & Types
import { getProjectStorages, deleteProjectStorage } from '@/core/services/storageService';
import { ProjectPVC } from '@/core/interfaces/projectStorage';

interface ProjectStorageListProps {
  refreshTrigger: number;
}

const ProjectStorageList: React.FC<ProjectStorageListProps> = ({ refreshTrigger }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [pvcs, setPvcs] = useState<ProjectPVC[]>([]);
  const translate = (key: string, fallback: string) => {
    const translator = t as unknown as (k: string) => string | undefined;
    return translator(key) || fallback;
  };

  // Track which specific ID is currently being deleted
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleExpand = (pvcName: string) => {
    const newSize = prompt(t('admin.storage.project.actionExpandPrompt'));
    if (newSize) {
      toast.success(`Expand request sent for ${pvcName} (Pending Implementation)`);
    }
  };

  const handleDelete = async (pid: string) => {
    if (!confirm(t('admin.storage.project.actionConfirmDelete'))) {
      return;
    }

    setDeletingId(pid);
    try {
      await deleteProjectStorage(pid);
      toast.success(t('common.success'));
      // Refresh list to reflect changes
      await fetchData();
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && pvcs.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex justify-end p-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {translate('common.refresh', 'Refresh')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('admin.storage.project.list.project')} / PVC
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
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {pvcs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm">
                  {t('admin.storage.project.list.empty')}
                </td>
              </tr>
            ) : (
              pvcs.map((pvc, index) => {
                const isDeleting = deletingId === pvc.id;

                return (
                  <tr
                    key={`${pvc.pvcName}-${index}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CubeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {pvc.projectName || `Project ${pvc.id}`}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-gray-400">
                            {pvc.namespace} / {pvc.pvcName}
                          </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono">
                      {pvc.capacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(pvc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleExpand(pvc.pvcName)}
                          disabled={isDeleting}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-30"
                          title={t('admin.storage.project.actionEdit')}
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pvc.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 flex items-center gap-1"
                          title={t('admin.storage.project.actionDelete')}
                        >
                          {isDeleting ? (
                            <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          ) : (
                            <TrashIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectStorageList;
