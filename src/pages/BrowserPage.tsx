import React, { useState, useEffect, useMemo } from 'react';
import { PageBreadcrumb } from '../components/common/PageBreadCrumb';
import { PageMeta } from '@tailadmin/ui';
// translations not needed in this file
import { toast } from 'react-hot-toast';

// Icons
import {
  UserCircleIcon,
  CubeIcon,
  CloudIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  StopIcon,
  LockClosedIcon,
  PencilSquareIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';

// Services
import { 
  openUserDrive, 
  stopUserDrive, 
  checkUserStorageStatus, 
  getProjectStorageProxyUrl,
  startFileBrowser, // Ensure these are exported from storageService
  stopFileBrowser 
} from '../services/storageService';
import { getUsername } from '../services/authService';
import { getProjectListByUser } from '../services/projectService';

// Context & Config
import { useGlobalWebSocket } from '../context/useGlobalWebSocket';
import { API_BASE_URL } from '../config/url';

// --- Configuration ---
const getPersonalProxyUrl = () => `${API_BASE_URL}/k8s/users/proxy/`;

/**
 * Permission Badge Component
 */
const PermissionBadge: React.FC<{ role: string }> = ({ role }) => {
  const isManager = role === 'manager' || role === 'admin';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
      isManager ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
    }`}>
      {isManager ? <PencilSquareIcon className="h-3 w-3" /> : <LockClosedIcon className="h-3 w-3" />}
      {isManager ? 'Read/Write' : 'Read Only'}
    </span>
  );
};

// ==========================================
// Sub-Component: Personal Hub
// ==========================================
const PersonalHub: React.FC = () => {
  // translation not used in this component
  const [isRequesting, setIsRequesting] = useState(false);
  const [storageExists, setStorageExists] = useState<boolean | null>(null);

  const username = getUsername();
  const safeUsername = username?.toLowerCase() || '';
  const personalNs = `user-${safeUsername}-storage`;
  const podName = `fb-hub-${safeUsername}`;

  const { messages } = useGlobalWebSocket();
  
  const runtimeStatus = useMemo(() => {
    const pod = messages.find(m => m.kind === 'Pod' && m.ns === personalNs && m.name === podName);
    if (!pod) return 'Stopped';
    if (pod.metadata?.deletionTimestamp) return 'Terminating';
    return pod.status || 'Unknown';
  }, [messages, personalNs, podName]);

  useEffect(() => {
    checkUserStorageStatus(safeUsername).then(setStorageExists);
  }, [safeUsername]);

  const handleStart = async () => {
    setIsRequesting(true);
    try {
      await openUserDrive();
      toast.success('Starting personal hub...');
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Start failed');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleStop = async () => {
    setIsRequesting(true);
    try {
      await stopUserDrive();
      toast.success('Stopping personal hub...');
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Stop failed');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-sm dark:border-gray-700 dark:bg-gray-800 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
        <CloudIcon className={`h-12 w-12 ${runtimeStatus === 'Running' ? 'text-green-500' : 'text-blue-500'}`} />
      </div>
      <h3 className="text-2xl font-bold dark:text-white">Personal Storage Hub</h3>
      <p className="mt-2 text-gray-500">Manage your private files and data.</p>
      
      <div className="mt-8 flex justify-center gap-4">
        {runtimeStatus === 'Running' ? (
          <>
            <button onClick={() => window.open(getPersonalProxyUrl(), '_blank')} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 transition-all">
              <ArrowTopRightOnSquareIcon className="h-5 w-5" /> Open Browser
            </button>
            <button onClick={handleStop} disabled={isRequesting} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-6 py-3 font-bold text-red-600 hover:bg-red-50 transition-all">
              <StopIcon className="h-5 w-5" /> Stop
            </button>
          </>
        ) : (
          <button onClick={handleStart} disabled={isRequesting || storageExists === false} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all">
            {isRequesting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <PlayIcon className="h-5 w-5" />}
            {isRequesting ? 'Requesting...' : 'Start Hub'}
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// Sub-Component: Project Storage List
// ==========================================
const ProjectStorage: React.FC = () => {
  interface ProjectInfo {
    id: string | number;
    namespace: string;
    name: string;
    userRole?: string;
  }

  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<Record<string, boolean>>({});
  
  const { messages } = useGlobalWebSocket();

  useEffect(() => {
    getProjectListByUser()
      .then((data) => {
        setProjects(data as ProjectInfo[]);
      })
      .catch((err) => console.error('API Error:', err))
      .finally(() => setLoading(false));
  }, []);

  const getProjectStatus = (namespace: string) => {
    // Assuming the pod name contains the namespace hash or starts with 'pvc-project'
    const pod = messages.find(m => m.kind === 'Pod' && m.ns === namespace);
    if (!pod) return 'Stopped';
    if (pod.metadata?.deletionTimestamp) return 'Terminating';
    return pod.status || 'Unknown';
  };

  const handleStartProject = async (namespace: string, projectPvcName: string, projectId: string) => {
    setIsActionLoading(prev => ({ ...prev, [projectId]: true }));
    try {
      await startFileBrowser(namespace, projectPvcName);
      toast.success('Starting project drive...');
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Start failed');
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const handleStopProject = async (namespace: string, projectPvcName: string, projectId: string) => {
    setIsActionLoading(prev => ({ ...prev, [projectId]: true }));
    try {
      await stopFileBrowser(namespace, projectPvcName);
      toast.success('Stopping project drive...');
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error(e.message || 'Stop failed');
    } finally {
      setIsActionLoading((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  if (loading) return <div className="py-20 text-center animate-pulse text-gray-500 font-medium">Fetching shared storages...</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const status = getProjectStatus(project.namespace);
        const isRunning = status === 'Running';
        const isPending = status === 'Pending' || status === 'ContainerCreating';
        const isActionBusy = isActionLoading[project.id];
        const pvcName = `pvc-${project.namespace}`; // Consistent with your Go backend naming

        return (
          <div key={project.id} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-hover hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-900/20">
                <CircleStackIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <PermissionBadge role={project.userRole} />
            </div>

            <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">{project.name}</h4>
            <div className="mt-2 flex items-center gap-2 text-sm">
               <span className={`h-2.5 w-2.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
               <span className="font-medium text-gray-600 dark:text-gray-400">{status}</span>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              {isRunning ? (
                <>
                  <button
                    onClick={() => window.open(getProjectStorageProxyUrl(project.id), '_blank')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-black transition-all"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" /> Open Shared Drive
                  </button>
                  <button
                    onClick={() => handleStopProject(project.namespace, pvcName, project.id)}
                    disabled={isActionBusy}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <StopIcon className="h-4 w-4" /> Stop Drive
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleStartProject(project.namespace, pvcName, project.id)}
                  disabled={isActionBusy || isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  {isActionBusy || isPending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                  {isActionBusy ? 'Processing...' : isPending ? 'Pending...' : 'Start Shared Drive'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// Main Entry Component
// ==========================================
function BrowserPage() {
  const [activeTab, setActiveTab] = useState<'personal' | 'project'>('personal');

  return (
    <>
      <PageMeta title="File Browser | Platform" />
      <PageBreadcrumb pageTitle="Cloud Explorer" />

      <div className="space-y-6">
        {/* Tab Switcher - Rounded Pill Style */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1.5 dark:bg-gray-800">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'personal' 
                ? 'bg-white shadow-md text-blue-600 dark:bg-gray-700 dark:text-blue-400' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <UserCircleIcon className="h-5 w-5" /> Personal Hub
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all ${
              activeTab === 'project' 
                ? 'bg-white shadow-md text-blue-600 dark:bg-gray-700 dark:text-blue-400' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            <CubeIcon className="h-5 w-5" /> Project Storage
          </button>
        </div>

        {/* Dynamic Content Rendering */}
        <div className="min-h-[400px]">
          {activeTab === 'personal' ? (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <PersonalHub />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <ProjectStorage />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default BrowserPage;