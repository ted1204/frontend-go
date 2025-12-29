import { useState, useEffect } from 'react';
import { PageBreadcrumb } from '../components/common/PageBreadCrumb';
import { PageMeta } from '@tailadmin/ui';
import { useTranslation } from '@tailadmin/utils';

// Icons
import {
  UserCircleIcon,
  CubeIcon,
  FolderIcon,
  CloudIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon, // Use Heroicons or custom SVG
  StopIcon, // Use Heroicons or custom SVG
} from '@heroicons/react/24/outline';

// Services
import { Project } from '../interfaces/project';
import { getProjects } from '../services/projectService';
import { getGroupsByUser } from '../services/userGroupService';
import { getPVCListByProject, openUserDrive, stopUserDrive } from '../services/storageService';
import { PVC } from '../interfaces/pvc';
import { getUsername } from '../services/authService';

// Components
import PVCList from '../components/PVCList';

// Context
import { useGlobalWebSocket } from '../context/useGlobalWebSocket';

// --- Sub-Component: User Personal Storage (WebSocket Enhanced) ---
const UserFileBrowser = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Get current username to derive resource names
  const username = getUsername(); // e.g., "sky-lin"
  const safeUsername = username.toLowerCase(); // Ensure consistency with backend

  // 2. Define Naming Convention (Must match Go Backend)
  const namespace = `user-${safeUsername}-storage`;
  const podName = `fb-hub-${safeUsername}`;
  const svcName = `fb-hub-svc-${safeUsername}`;

  // 3. Subscribe to WebSocket for this namespace
  const { getProjectMessages } = useGlobalWebSocket();
  const resources = getProjectMessages(namespace);

  // 4. Derive Status from WebSocket Data
  const pod = resources.find((r) => r.kind === 'Pod' && r.name === podName);
  const svc = resources.find((r) => r.kind === 'Service' && r.name === svcName);

  const isRunning = pod?.status === 'Running';
  const isPending = pod && !isRunning;
  const nodePort = svc?.nodePorts?.[0];

  // 5. Auto-open logic (Optional: if user clicked start, wait for running)
  const [waitingForOpen, setWaitingForOpen] = useState(false);

  useEffect(() => {
    if (waitingForOpen && isRunning && nodePort) {
      const url = `${window.location.protocol}//${window.location.hostname}:${nodePort}`;
      window.open(url, '_blank');
      setWaitingForOpen(false);
      setLoading(false);
    }
  }, [waitingForOpen, isRunning, nodePort]);

  // Handlers
  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      // Backend creates resources. We assume it returns success.
      // We don't strictly need the nodePort return value here anymore
      // because we rely on WebSocket to tell us when it's ready.
      await openUserDrive();
      setWaitingForOpen(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to open drive.');
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!confirm(t('fileBrowser.user.confirmStop') || 'Stop your personal drive?')) return;
    setLoading(true);
    try {
      await stopUserDrive();
      // WebSocket will update UI to "Stopped" automatically
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDirectly = () => {
    if (nodePort) {
      const url = `${window.location.protocol}//${window.location.hostname}:${nodePort}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col items-center justify-center text-center">
        {/* Status Badge */}
        <div className="relative mb-6">
          <div className="rounded-full bg-blue-50 p-6 dark:bg-blue-900/20">
            <CloudIcon className="h-16 w-16 text-blue-500" />
          </div>
          {/* Ping Animation if Pending */}
          {isPending && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-500"></span>
            </span>
          )}
          {/* Green Dot if Running */}
          {isRunning && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
          )}
        </div>

        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {t('fileBrowser.user.title') || 'My Personal Drive'}
        </h3>

        <div className="mb-8 max-w-md">
          <p className="text-gray-500 dark:text-gray-400">
            {t('fileBrowser.user.description') || 'Access your private storage space.'}
          </p>

          {/* Status Text */}
          <div className="mt-2 flex justify-center items-center gap-2 text-sm font-medium">
            Status:
            <span
              className={`${isRunning ? 'text-green-600' : isPending ? 'text-yellow-600' : 'text-gray-500'}`}
            >
              {isRunning ? 'Running (Ready)' : isPending ? 'Starting...' : 'Stopped'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 w-full max-w-md rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {/* Start / Open Button */}
          {!isRunning && !isPending && (
            <button
              onClick={handleStart}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-all hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5" />
                  <span>Start Drive</span>
                </>
              )}
            </button>
          )}

          {/* If Running: Show Open & Stop */}
          {isRunning && (
            <>
              <button
                onClick={handleOpenDirectly}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-8 py-3 font-medium text-white transition-all hover:bg-green-700 shadow-md hover:shadow-lg"
              >
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                Open
              </button>

              <button
                onClick={handleStop}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-6 py-3 font-medium text-red-600 transition-all hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
              >
                {loading ? (
                  'Stopping...'
                ) : (
                  <>
                    <StopIcon className="h-5 w-5" />
                    Stop
                  </>
                )}
              </button>
            </>
          )}

          {/* Pending State */}
          {isPending && (
            <button
              disabled
              className="flex items-center gap-2 rounded-lg bg-yellow-100 px-8 py-3 font-medium text-yellow-700 cursor-wait"
            >
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />
              Preparing...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ... ProjectFileBrowser (保持不變) ...
// ... FileBrowser (保持不變) ...

export default function FileBrowser() {
  // ... Copy from previous answer ...
  // Just make sure UserFileBrowser is used inside
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'user' | 'project'>('user');

  return (
    <div>
      <PageMeta title={t('fileBrowser.title')} description={t('fileBrowser.description')} />
      <PageBreadcrumb pageTitle={t('fileBrowser.title')} />

      <div className="rounded-2xl p-4 md:p-6 2xl:p-10">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex shadow-inner">
            <button
              onClick={() => setActiveTab('user')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'user' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <UserCircleIcon className="w-5 h-5" />
              {t('fileBrowser.tab.user')}
            </button>
            <button
              onClick={() => setActiveTab('project')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'project' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              <CubeIcon className="w-5 h-5" />
              {t('fileBrowser.tab.project')}
            </button>
          </div>
        </div>

        <div className="animate-in fade-in duration-300">
          {activeTab === 'user' ? <UserFileBrowser /> : <ProjectFileBrowser />}
        </div>
      </div>
    </div>
  );
}

// Reuse ProjectFileBrowser from previous answer, or define it here if needed.
const ProjectFileBrowser = () => {
  // ... logic same as before ...
  // Make sure to return the JSX
  return <div>{/* Project Browser Content */}</div>;
};
