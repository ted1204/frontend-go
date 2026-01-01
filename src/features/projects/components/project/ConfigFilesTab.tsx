import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@nthucscc/utils';
import { PlusIcon } from '@heroicons/react/24/outline';

// Services
import {
  getConfigFilesByProjectId,
  createConfigFile,
  updateConfigFile,
  deleteConfigFile,
  createInstance,
  deleteInstance,
} from '../../services/configFileService';

// Interfaces
import { Project } from '../../interfaces/project';
import { ConfigFile } from '../../interfaces/configFile';

// Components
import Button from '../ui/button/Button';
import ConfigFileList from '../ConfigFileList';
import AddConfigModal from '../AddConfigModal';
import EditConfigModal from '../EditConfigModal';

interface ConfigFilesTabProps {
  project: Project;
}

const ConfigFilesTab: React.FC<ConfigFilesTabProps> = ({ project }) => {
  const { t } = useTranslation();
  const projectId = project.PID;

  // --- State ---
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfigFile | null>(null);

  // --- Data Fetching ---
  const fetchConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getConfigFilesByProjectId(projectId);
      setConfigFiles(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load configs', err);
      setError(t('project.detail.fetchError') || 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  }, [projectId, t]);

  // Initial Load
  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  // --- Handlers ---

  const handleCreate = async (data: { filename: string; raw_yaml: string }) => {
    setActionLoading(true);
    try {
      await createConfigFile({ ...data, project_id: projectId });
      setIsCreateModalOpen(false);
      await fetchConfigs(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : t('project.detail.createConfigError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: { filename: string; raw_yaml: string }) => {
    if (!selectedConfig) return;
    setActionLoading(true);
    try {
      await updateConfigFile(selectedConfig.CFID, {
        filename: data.filename || selectedConfig.Filename,
        raw_yaml: data.raw_yaml || selectedConfig.Content,
      });
      setIsEditModalOpen(false);
      await fetchConfigs(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : t('project.detail.updateConfigError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (configId: number) => {
    if (!window.confirm(t('common.confirmDelete'))) return;

    setActionLoading(true);
    try {
      await deleteConfigFile(configId);
      await fetchConfigs(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : t('project.detail.deleteConfigError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateInstance = async (id: number) => {
    setActionLoading(true);
    try {
      await createInstance(id);
      alert(t('project.detail.instanceCreateSent'));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('project.detail.createInstanceError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInstance = async (id: number) => {
    if (!window.confirm(t('project.detail.confirmDeleteInstance'))) return;

    setActionLoading(true);
    try {
      await deleteInstance(id);
      alert(t('project.detail.instanceDeleteSent'));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('project.detail.deleteInstanceError'));
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (config: ConfigFile) => {
    setSelectedConfig(config);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-600">
          <div>
            <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
              {t('project.detail.configTitle')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {t('project.detail.configDesc')}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={actionLoading}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-150 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <PlusIcon className="h-5 w-5" />
            {actionLoading ? t('common.loading') : t('project.detail.addConfig')}
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-gray-500">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent mb-2"></div>
              <p>{t('common.loading')} Configurations...</p>
            </div>
          ) : (
            <ConfigFileList
              configFiles={configFiles}
              onDelete={handleDelete}
              onEdit={openEditModal}
              onCreateInstance={handleCreateInstance}
              onDeleteInstance={handleDeleteInstance}
              actionLoading={actionLoading}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddConfigModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        actionLoading={actionLoading}
        project={project}
      />
      <EditConfigModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdate}
        selectedConfig={selectedConfig}
        actionLoading={actionLoading}
      />
    </>
  );
};

export default ConfigFilesTab;
