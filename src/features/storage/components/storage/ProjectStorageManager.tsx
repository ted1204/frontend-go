import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, Squares2X2Icon, Bars4Icon } from '@heroicons/react/24/outline';

import { WebSocketContext } from '@/core/context/WebSocketContext';
import {
  getMyProjectStorages,
  startProjectFileBrowser,
  stopProjectFileBrowser,
  getProjectStorageProxyUrl,
} from '@/core/services/storageService';

import { ProjectTableView } from './ProjectTableView';
import { ProjectGridView } from './ProjectGridView';
import { ProjectPVC } from '@/core/interfaces/projectStorage';

// --- Manager Component ---
// Handles data fetching, filtering, view switching, and action dispatching.
export const ProjectStorageManager: React.FC = () => {
  const { t } = useTranslation();
  const { connectToNamespace, messages } = useContext(WebSocketContext)!;

  // -- State Management --
  const [storages, setStorages] = useState<ProjectPVC[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table'); // Default to table view
  const [searchTerm, setSearchTerm] = useState('');

  // -- Initial Data Fetch --
  useEffect(() => {
    const init = async () => {
      try {
        const data = (await getMyProjectStorages()) as ProjectPVC[];
        setStorages(data || []);
        // Auto-connect to all project namespaces for live status
        data?.forEach((s: ProjectPVC) => {
          if (s.namespace) connectToNamespace(s.namespace);
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        // Show generic message but keep original i18n fallback
        toast.error(msg || t('storage.errLoadList'));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [connectToNamespace, t]);

  // -- Action Handlers --
  const handleAction = async (pId: string, action: 'start' | 'stop') => {
    // Prevent double clicks
    if (isActionLoading[pId]) return;
    setIsActionLoading((prev) => ({ ...prev, [pId]: true }));

    try {
      if (action === 'start') {
        await startProjectFileBrowser(pId);
        toast.success(t('storage.starting'));
      } else {
        await stopProjectFileBrowser(pId);
        toast.success(t('storage.stopping'));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || t('storage.actionFailed'));
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [pId]: false }));
    }
  };

  const handleOpen = (pId: string) => {
    window.open(getProjectStorageProxyUrl(pId), '_blank');
  };

  // -- Search Filter --
  const filteredStorages = useMemo(() => {
    return storages.filter(
      (s) =>
        s.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.namespace.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [storages, searchTerm]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400 animate-pulse">{t('storage.scanning')}</div>
    );

  return (
    <div className="space-y-6">
      {/* --- Toolbar Section --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder={t('search.projectsPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Bars4Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- Data Display Section --- */}
      {filteredStorages.length > 0 ? (
        viewMode === 'table' ? (
          <ProjectTableView
            data={filteredStorages}
            messages={messages}
            loadingState={isActionLoading}
            onAction={handleAction}
            onOpen={handleOpen}
          />
        ) : (
          <ProjectGridView
            data={filteredStorages}
            messages={messages}
            loadingState={isActionLoading}
            onAction={handleAction}
            onOpen={handleOpen}
          />
        )
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm
              ? t('project.list.empty.filter', { term: searchTerm })
              : t('project.list.empty.assigned')}
          </p>
        </div>
      )}
    </div>
  );
};
