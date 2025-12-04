import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageMeta from './common/PageMeta';
import PageBreadcrumb from './common/PageBreadCrumb';
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
import { getPVCListByProject } from '../services/pvcService';
import { PVC } from '../interfaces/pvc';
import AddConfigModal from './AddConfigModal';
import ConfigFileList from './ConfigFileList';
import PVCList from './PVCList';
import EditConfigModal from './EditConfigModal';
import { useGlobalWebSocket } from '../context/WebSocketContext';
import MonitoringPanel from './MonitoringPanel';
import { ConfigFile } from '../interfaces/configFile';
import Button from './ui/button/Button';
import { getUsername } from '../services/authService';
import CreateTicketModal from './CreateTicketModal';
import ProjectMembers from './ProjectMembers';

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
      {/* Main Content Skeleton (Project Details and Config Files) */}
      <div className="space-y-8 col-span-full">
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-8 w-1/2 rounded-md bg-gray-300 dark:bg-gray-600"></div>
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 h-8 w-1/3 rounded-md bg-gray-300 dark:bg-gray-600"></div>
          <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  </div>
);

// Helper for displaying error or not found states
  const StateDisplay = ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => (
    <div className="flex h-96 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-center dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );

  export default function ProjectDetail() {
    const { id } = useParams<{ id?: string }>();
    if (!id) throw new Error('需要專案 ID');
  
    // State management remains largely the same
    const { getProjectMessages } = useGlobalWebSocket();
    const username = getUsername();
    const namespace = `proj-${id}-${username}`;
    const messages = getProjectMessages(namespace);
  
    const [project, setProject] = useState<Project | null>(null);
    const [configFiles, setConfigFiles] = useState<ConfigFile[]>([]);
    const [pvcs, setPvcs] = useState<PVC[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<ConfigFile | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
  
    // Data fetching logic remains the same, fetching Project and Config Files in parallel
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const projectId = parseInt(id);
          const projectData = await getProjectById(projectId);
          const [configData, pvcData] = await Promise.all([
            getConfigFilesByProjectId(projectId),
            getPVCListByProject(projectId),
          ]);
          setProject(projectData);
          setConfigFiles(configData);
          setPvcs(pvcData);
        } catch (err) {
          setError(err instanceof Error ? err.message : '無法取得資料');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [id]);
  
    // Handler functions for CRUD operations
    const handleCreate = async (data: { filename: string; raw_yaml: string }) => {
      setActionLoading(true);
      try {
        await createConfigFile({ ...data, project_id: parseInt(id) });
        setIsCreateModalOpen(false);
        const updated = await getConfigFilesByProjectId(parseInt(id));
        setConfigFiles(updated);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '無法建立設定檔'
        );
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
        const updated = await getConfigFilesByProjectId(parseInt(id));
        setConfigFiles(updated);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '無法更新設定檔'
        );
      } finally {
        setActionLoading(false);
      }
    };
  
    const handleDelete = async (configId: number) => {
      if (confirm('您確定嗎？')) {
        setActionLoading(true);
        try {
          await deleteConfigFile(configId);
          const updated = await getConfigFilesByProjectId(parseInt(id));
          setConfigFiles(updated);
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : '無法刪除設定檔'
          );
        } finally {
          setActionLoading(false);
        }
      }
    };
  
    // Handler for creating an instance from a config file
    const handleCreateInstance = async (id: number) => {
      setActionLoading(true);
      try {
        await createInstance(id);
        alert('已發送實例建立請求。請檢查狀態。');
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '無法建立實例'
        );
      } finally {
        setActionLoading(false);
      }
    };
  
    // Handler for deleting an instance
    const handleDeleteInstance = async (id: number) => {
      if (confirm('您確定要刪除此實例嗎？')) {
        setActionLoading(true);
        try {
          await deleteInstance(id);
          alert('已發送實例刪除請求。');
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : '無法刪除實例'
          );
        } finally {
          setActionLoading(false);
        }
      }
    };
  
    // Prepares the config file data for the Edit Modal
    const handleEdit = (config: ConfigFile) => {
      setSelectedConfig(config);
      setIsEditModalOpen(true);
    };
  
    // Render loading skeleton first
    if (loading) return <PageSkeleton />;
  
    // Render error or not found states
    if (error) return <StateDisplay title="發生錯誤" message={error} />;
    if (!project)
      return (
        <StateDisplay
          title="找不到專案"
          message={`無法找到 ID 為 ${id} 的專案。`}
        />
      );
  
    return (
      <div>
        <PageMeta
          title={`${project.ProjectName} | 專案詳情`}
          description={`專案 ${project.ProjectName} 的詳情與設定`}
        />
        <PageBreadcrumb pageTitle={project.ProjectName} />
  
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', label: '總覽' },
              { id: 'configurations', label: '設定檔' },
              { id: 'storage', label: '儲存空間' },
              { id: 'members', label: '成員' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium capitalize
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
  
        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-8">
              {/* Project Details Card */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {project.ProjectName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        專案資訊
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsTicketModalOpen(true)}
                      className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                      title="請求支援"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
  
                {/* Card Body */}
                <div className="p-6">
                  <p className="mb-6 text-gray-600 dark:text-gray-300">
                    {project.Description || '未提供描述。'}
                  </p>
                  <hr className="mb-6 border-gray-200 dark:border-gray-700" />
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">專案 ID</dt>
                        <dd className="mt-1 font-mono text-sm text-gray-900 dark:text-white">{project.PID}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">群組</dt>
                        <dd className="mt-1">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            ID: {project.GID}
                          </span>
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">GPU 資源</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          <div className="flex flex-col gap-1">
                            <span>配額: {project.GPUQuota} (單位)</span>
                            <span>存取模式: {project.GPUAccess}</span>
                          </div>
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">MPS 設定</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          <div className="flex flex-col gap-1">
                            <span>執行緒限制: {project.MPSLimit ? `${project.MPSLimit}%` : '無限制'}</span>
                            <span>記憶體限制: {project.MPSMemory ? `${project.MPSMemory} MB` : '無限制'}</span>
                          </div>
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">建立時間</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{new Date(project.CreatedAt).toLocaleString()}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M23 18v-5h-5m-4-1V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4h-4a1 1 0 00-1 1v4a1 1 0 001 1h4v4a1 1 0 001 1h4a1 1 0 001-1v-4h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z" />
                      </svg>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">最後更新</dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">{new Date(project.UpdatedAt).toLocaleString()}</dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
  
              {/* Monitoring Panel */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700/50 dark:bg-gray-800/60 backdrop-blur-lg">
                <div className="flex items-center gap-4 border-b border-gray-900/10 pb-4 dark:border-gray-50/10">
                  <div className="grid h-10 w-10 flex-shrink-0 place-content-center rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">即時監控</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">即時日誌與狀態更新。</p>
                  </div>
                </div>
                <MonitoringPanel messages={messages} />
              </div>
            </div>
          )}
  
          {activeTab === 'configurations' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-600">
                <div>
                  <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">設定檔</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">管理、編輯與部署您的 YAML 設定。</p>
                </div>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-150 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  {actionLoading ? '處理中...' : '新增設定'}
                </Button>
              </div>
              <div className="p-4 sm:p-6">
                <ConfigFileList
                  configFiles={configFiles}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onCreateInstance={handleCreateInstance}
                  onDeleteInstance={handleDeleteInstance}
                  actionLoading={actionLoading}
                />
              </div>
            </div>
          )}
  
          {activeTab === 'storage' && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6 dark:border-gray-600">
                <div>
                  <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white">Persistent Volume Claims</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">管理您的儲存卷與存取檔案。</p>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <PVCList pvcs={pvcs} namespace={`proj-${project.PID}-${getUsername()}`} pods={messages} />
              </div>
            </div>
          )}
  
          {activeTab === 'members' && (
            <ProjectMembers groupId={project.GID} />
          )}
        </div>
  
        {/* Modals remain the same */}
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
        <CreateTicketModal
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          projectId={project.PID}
        />
      </div>
    );
}
