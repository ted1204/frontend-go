import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageMeta } from '@nthucscc/ui';
import { PageBreadcrumb } from './common/PageBreadCrumb';
import { Project } from '../interfaces/project';
import { getProjectById } from '../services/projectService';
import {
  getConfigFilesByProjectId,
  createConfigFile,
  updateConfigFile,
  deleteConfigFile,
  createInstance,
  deleteInstance,
} from '../services/configFileService';
import { ConfigFile } from '../interfaces/configFile';
import AddConfigModal from './AddConfigModal';
import ConfigFileList from './ConfigFileList';
import EditConfigModal from './EditConfigModal';
import { useGlobalWebSocket } from '../context/useGlobalWebSocket';
import MonitoringPanel from './MonitoringPanel';
import { ProjectStorageManager } from './storage/ProjectStorageManager';
import Button from './ui/button/Button';
import { getUsername } from '../services/authService';
import CreateFormModal from './CreateFormModal';
import ProjectMembers from './ProjectMembers';
import { useTranslation } from '@nthucscc/utils';
import { ChartBarIcon, Cog6ToothIcon, CubeIcon, UsersIcon } from '@heroicons/react/24/outline';

// Helper component for the initial page loading state (Skeleton)
const PageSkeleton = () => (
  <div className="animate-pulse">
    {/* Breadcrumb Skeleton */}
    <div className="mb-6 h-8 w-1/3 rounded-md bg-gray-200 dark:bg-gray-700"></div>
    {/* Single-column grid for all screens */}
    <div className="grid grid-cols-1 gap-8">
      {/* Monitoring Panel Skeleton */}
      <div className="col-span-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-8 w-3/4 rounded-md bg-gray-300 dark:bg-gray-600"></div>
          <div className="h-40 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
      {/* Main Content Skeleton */}
      <div className="space-y-8 col-span-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-8 w-1/2 rounded-md bg-gray-300 dark:bg-gray-600"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Helper for displaying error or not found states
const StateDisplay = ({ title, message }: { title: string; message: string }) => (
  <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center dark:border-gray-700 dark:bg-gray-800">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
    <p className="mt-2 text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

export default function ProjectDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  if (!id) throw new Error(t('projectDetail.needProjectId'));

  // Global WebSocket for monitoring
  const { getProjectMessages } = useGlobalWebSocket();
  const username = getUsername();
  const namespace = `proj-${id}-${username}`;
  const messages = getProjectMessages(namespace);

  // --- State Management ---

  // Project Info (Always needed)
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true); // Main page loading (Project info)

  // Config Files (Lazy loaded)
  const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
  const [isConfigsLoaded, setIsConfigsLoaded] = useState(false); // Flag to check if loaded once
  const [configLoading, setConfigLoading] = useState(false); // Local loading for config tab

  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // UI State (Modals & Tabs)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ConfigFile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // --- Data Fetching ---

  // 1. Initial Load: Fetch Project Info Only (Fast)
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const projectId = parseInt(id);
        const projectData = await getProjectById(projectId);
        setProject(projectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('projectDetail.fetchError'));
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, t]);

  // 2. Lazy Load: Fetch Config Files only when tab is active and not loaded yet
  useEffect(() => {
    const fetchConfigs = async () => {
      if (activeTab === 'configurations' && !isConfigsLoaded && id) {
        try {
          setConfigLoading(true);
          const data = await getConfigFilesByProjectId(parseInt(id));
          setConfigFiles(data);
          setIsConfigsLoaded(true); // Mark as loaded so we don't re-fetch on tab switch
        } catch (err) {
          console.error('Failed to load configs', err);
          // Optional: Set a local error state for the tab
        } finally {
          setConfigLoading(false);
        }
      }
    };
    fetchConfigs();
  }, [activeTab, isConfigsLoaded, id]);

  // --- Handlers ---

  const handleCreate = async (data: { filename: string; raw_yaml: string }) => {
    setActionLoading(true);
    try {
      await createConfigFile({ ...data, project_id: parseInt(id) });
      setIsCreateModalOpen(false);
      // Refresh list
      const updated = await getConfigFilesByProjectId(parseInt(id));
      setConfigFiles(updated);
      setIsConfigsLoaded(true); // Ensure flag is set
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('projectDetail.createConfigError'));
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
      // Refresh list
      const updated = await getConfigFilesByProjectId(parseInt(id));
      setConfigFiles(updated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('projectDetail.updateConfigError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (configId: number) => {
    if (confirm(t('common.confirmDelete'))) {
      setActionLoading(true);
      try {
        await deleteConfigFile(configId);
        // Refresh list
        const updated = await getConfigFilesByProjectId(parseInt(id));
        setConfigFiles(updated);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('projectDetail.deleteConfigError'));
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCreateInstance = async (id: number) => {
    setActionLoading(true);
    try {
      await createInstance(id);
      alert(t('projectDetail.instanceCreateSent'));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('projectDetail.createInstanceError'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInstance = async (id: number) => {
    if (confirm(t('projectDetail.confirmDeleteInstance'))) {
      setActionLoading(true);
      try {
        await deleteInstance(id);
        alert(t('projectDetail.instanceDeleteSent'));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('projectDetail.deleteInstanceError'));
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleEdit = (config: ConfigFile) => {
    setSelectedConfig(config);
    setIsEditModalOpen(true);
  };

  // --- Render ---

  // Initial page skeleton (only waits for Project Info)
  if (loading) return <PageSkeleton />;

  if (error) return <StateDisplay title={t('projectDetail.errorTitle')} message={error} />;

  if (!project)
    return (
      <StateDisplay
        title={t('projectDetail.notFoundTitle')}
        message={t('projectDetail.notFoundMessage', { id })}
      />
    );

  return (
    <div>
      <PageMeta
        title={`${project.ProjectName} | ${t('projectDetail.titleSuffix')}`}
        description={t('projectDetail.description', { name: project.ProjectName })}
      />
      <PageBreadcrumb pageTitle={project.ProjectName} />

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 inline-flex">
          {[
            {
              id: 'overview',
              label: t('projectDetail.tab.overview'),
              icon: <ChartBarIcon className="h-4 w-4" />,
            },
            {
              id: 'configurations',
              label: t('projectDetail.tab.configurations'),
              icon: <Cog6ToothIcon className="h-4 w-4" />,
            },
            {
              id: 'storage',
              label: t('projectDetail.tab.storage'),
              icon: <CubeIcon className="h-4 w-4" />,
            },
            {
              id: 'members',
              label: t('projectDetail.tab.members'),
              icon: <UsersIcon className="h-4 w-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-white shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="inline-flex items-center text-current">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-8">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                    <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.ProjectName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('projectDetail.infoLabel')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                    title={t('project.requestSupport')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  {project.Description || t('project.noDescription')}
                </p>
                <hr className="mb-6 border-gray-200 dark:border-gray-700" />
                <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  {/* ID */}
                  <div className="flex items-start gap-3">
                    <CubeIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('project.idLabel', { id: project.PID })}
                      </dt>
                      <dd className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                        {project.PID}
                      </dd>
                    </div>
                  </div>
                  {/* GID */}
                  <div className="flex items-start gap-3">
                    <UsersIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('project.members.title')}
                      </dt>
                      <dd className="mt-1">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          ID: {project.GID}
                        </span>
                      </dd>
                    </div>
                  </div>
                  {/* Quota */}
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('project.gpuResources')}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        <div className="flex flex-col gap-1">
                          <span>{t('project.gpuQuotaUnit', { quota: project.GPUQuota })}</span>
                          <span>
                            {t('project.gpuAccessMode', {
                              mode: t(
                                project.GPUAccess === 'Shared'
                                  ? 'project.gpuAccessShared'
                                  : 'project.gpuAccessDedicated',
                              ),
                            })}
                          </span>
                        </div>
                      </dd>
                    </div>
                  </div>
                  {/* MPS */}
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('project.mpsSettings')}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        <div className="flex flex-col gap-1">
                          <span>
                            {t('project.mpsThreadLimit', {
                              value: project.MPSLimit
                                ? `${project.MPSLimit}%`
                                : t('project.mpsUnlimited'),
                            })}
                          </span>
                          <span>
                            {t('project.mpsMemoryLimit', {
                              value: project.MPSMemory
                                ? `${project.MPSMemory} MB`
                                : t('project.mpsUnlimited'),
                            })}
                          </span>
                        </div>
                      </dd>
                    </div>
                  </div>
                  {/* Time */}
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t('projectDetail.createdAt')}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date(project.CreatedAt).toLocaleString()}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            {/* Monitoring Panel */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800/60 backdrop-blur-lg">
              <div className="flex items-center gap-4 border-b border-gray-900/10 pb-4 dark:border-gray-50/10">
                <div className="grid h-10 w-10 flex-shrink-0 place-content-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('monitor.panel.title')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {t('monitor.panel.subtitle')}
                  </p>
                </div>
              </div>
              <MonitoringPanel messages={messages} />
            </div>
          </div>
        )}

        {/* --- CONFIGURATIONS TAB --- */}
        {activeTab === 'configurations' && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-600">
              <div>
                <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
                  {t('projectDetail.configTitle')}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {t('projectDetail.configDesc')}
                </p>
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-150 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <PlusIcon className="h-5 w-5" />
                {actionLoading ? t('common.loading') : t('projectDetail.addConfig')}
              </Button>
            </div>
            <div className="p-4 sm:p-6">
              {configLoading ? (
                <div className="py-10 text-center text-gray-500">
                  <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
                  <p>{t('common.loading')} Configurations...</p>
                </div>
              ) : (
                <ConfigFileList
                  configFiles={configFiles}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onCreateInstance={handleCreateInstance}
                  onDeleteInstance={handleDeleteInstance}
                  actionLoading={actionLoading}
                />
              )}
            </div>
          </div>
        )}

        {/* --- STORAGE TAB --- */}
        {activeTab === 'storage' && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 p-4 sm:p-6">
            <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">
              {t('storage.pageTitle')}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {t('storage.pageSubtitle')}
            </p>
            <div className="mt-4">
              <ProjectStorageManager />
            </div>
          </div>
        )}

        {/* --- MEMBERS TAB --- */}
        {activeTab === 'members' && <ProjectMembers groupId={project.GID} />}
      </div>

      {/* --- MODALS --- */}
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
      <CreateFormModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        projectId={project.PID}
      />
    </div>
  );
}

// Helper: Missing PlusIcon definition locally if not imported
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}
