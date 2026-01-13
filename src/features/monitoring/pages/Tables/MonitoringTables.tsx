import React, { useEffect, useState, Fragment } from 'react';
import { useGlobalWebSocket } from '@/core/context/useGlobalWebSocket';
import { getUsername } from '@/core/services/authService';
import { getProjectListByUser, getProjects } from '@/core/services/projectService';
import { getGroupsByUser } from '@/core/services/userGroupService';
import { Pagination } from '@nthucscc/components-shared';
import { Project } from '@/core/interfaces/project';
import { useTranslation } from '@nthucscc/utils';
// English: Import WebSocketContext to access the connection pool functions

// --- Type Definitions --- //

interface Pod {
  name: string;
  containers: string[];
  status: string;
}

interface NamespacePods {
  [namespace: string]: Pod[];
}

// --- Icon Components --- //
const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" />
  </svg>
);

// You may already have ChevronDownIcon defined elsewhere, but if not, here's a simple version:
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface PodMonitoringTableProps {
  namespace: string;
  pods: Pod[];
  fetchPodLogs: (podName: string, container: string) => void;
}

const PodMonitoringTable: React.FC<PodMonitoringTableProps> = ({
  namespace,
  pods,
  fetchPodLogs,
}) => {
  const { t } = useTranslation();
  const [expandedPods, setExpandedPods] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [pods]);

  const totalPages = Math.ceil(pods.length / itemsPerPage);
  const paginatedPods = pods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const togglePodExpand = (podName: string) => {
    const key = `${namespace}-${podName}`;
    setExpandedPods((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConnectTerminal = (podName: string, container: string) => {
    // English: Ensure terminal connection uses the correct proxy path if necessary
    const url = `/terminal?namespace=${encodeURIComponent(namespace)}&pod=${encodeURIComponent(podName)}&container=${container}&command=/bin/bash&tty=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // pod logs UI state is lifted to parent `PodTablesPage` via `fetchPodLogs` prop

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const safeStatus = (status || 'Unknown').toString();
    const normalized = safeStatus.toLowerCase().replace(/[^a-z0-9]/g, '');

    let colorClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    let dotClasses = 'bg-gray-500';

    if (normalized === 'terminating') {
      colorClasses =
        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 animate-pulse border border-gray-300 dark:border-gray-600';
      dotClasses = 'bg-gray-500';
    } else if (
      ['running', 'active', 'bound', 'succeeded', 'ready', 'completed'].includes(normalized)
    ) {
      colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      dotClasses = 'bg-green-500';
    } else if (['pending', 'containercreating', 'containercreatinginit'].includes(normalized)) {
      colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      dotClasses = 'bg-yellow-500';
    } else if (
      [
        'failed',
        'error',
        'crashloopbackoff',
        'imagepullbackoff',
        'errimagepull',
        'backoff',
      ].includes(normalized)
    ) {
      colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      dotClasses = 'bg-red-500';
    }

    return (
      <span
        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${colorClasses}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dotClasses}`}></span>
        {safeStatus}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-2 w-2/5">
              {t('monitor.table.podName')}
            </th>
            <th scope="col" className="px-6 py-2 w-1/5">
              {t('monitor.table.namespace')}
            </th>
            <th scope="col" className="px-6 py-2 w-1/5">
              {t('monitor.table.status')}
            </th>
            <th scope="col" className="px-6 py-2 w-1/5 text-right">
              {t('monitor.table.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedPods.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-400 dark:text-gray-500">
                {t('monitor.empty.noPods')}
              </td>
            </tr>
          ) : (
            paginatedPods.map((pod: Pod) => {
              const podKey: string = `${namespace}-${pod.name}`;
              const isExpanded: boolean = !!expandedPods[podKey];

              interface ContainerRowProps {
                podKey: string;
                container: string;
                podName: string;
              }

              const ContainerRow: React.FC<ContainerRowProps> = ({
                podKey,
                container,
                podName,
              }) => (
                <tr key={`${podKey}-${container}`} className="bg-gray-50 dark:bg-gray-800/60">
                  <td className="pl-14 pr-6 py-2 text-sm text-gray-700 dark:text-gray-300">
                    {container}
                  </td>
                  <td className="px-6 py-2"></td>
                  <td className="px-6 py-2"></td>
                  <td className="px-6 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handleConnectTerminal(podName, container);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                      >
                        <TerminalIcon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{t('monitor.button.connect')}</span>
                      </button>
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          fetchPodLogs(podName, container);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-150"
                      >
                        {'Logs'}
                      </button>
                    </div>
                  </td>
                </tr>
              );

              return (
                <Fragment key={podKey}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer"
                    onClick={() => togglePodExpand(pod.name)}
                  >
                    <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center">
                        <ChevronDownIcon
                          className={`h-4 w-4 mr-2 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                        {pod.name}
                      </div>
                    </td>
                    <td className="px-6 py-2 text-sm">{namespace}</td>
                    <td className="px-6 py-2">
                      <StatusBadge status={pod.status} />
                    </td>
                    <td className="px-6 py-2"></td>
                  </tr>
                  {isExpanded &&
                    pod.containers.map((container: string) => (
                      <ContainerRow
                        key={`${podKey}-${container}`}
                        podKey={podKey}
                        container={container}
                        podName={pod.name}
                      />
                    ))}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
      <Pagination current={currentPage} total={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

// Simple modal for logs display (keeps in same file for convenience)
const PodLogsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  content: string;
  loading: boolean;
  target?: { pod: string; container: string } | null;
}> = ({ open, onClose, content, loading, target }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-2 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm font-medium">
            Logs: {target ? `${target.pod} / ${target.container}` : ''}
          </div>
          <div>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm rounded bg-gray-100 dark:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
        <div className="p-4 h-80 overflow-auto bg-black text-green-200 font-mono text-sm whitespace-pre-wrap">
          {loading ? 'Loading...' : content}
        </div>
      </div>
    </div>
  );
};

export default function PodTablesPage() {
  // English: Destructure functions from context pool
  const { messages, connectToNamespace } = useGlobalWebSocket();
  const [podsData, setPodsData] = useState<NamespacePods>({});
  const { t } = useTranslation();
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsContent, setLogsContent] = useState<string>('');
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsTarget, setLogsTarget] = useState<{ pod: string; container: string } | null>(null);

  const fetchPodLogs = async (namespace: string, podName: string, container: string) => {
    setLogsLoading(true);
    setLogsOpen(true);
    setLogsContent('');
    setLogsTarget({ pod: podName, container });
    try {
      const url = `/k8s/namespaces/${encodeURIComponent(namespace)}/pods/${encodeURIComponent(podName)}/logs?container=${encodeURIComponent(container)}&tailLines=200`;
      const resp = await fetch(url, { method: 'GET', credentials: 'include' });
      if (!resp.ok) {
        setLogsContent(`Error: ${resp.status} ${resp.statusText}`);
        setLogsLoading(false);
        return;
      }
      const text = await resp.text();
      setLogsContent(text || '(no logs)');
    } catch (err) {
      setLogsContent(`Fetch error: ${String(err)}`);
    } finally {
      setLogsLoading(false);
    }
  };

  /**
   * English: Assuming this page needs to monitor specific namespaces or all user-related namespaces.
   * If you have a specific list of namespaces, call connectToNamespace for each.
   */
  useEffect(() => {
    // Connect to the current user's personal namespace and all their project namespaces.
    const username = getUsername();
    if (username && username !== 'null') {
      // subscribe to personal namespace
      // connectToNamespace(username);

      // Use same logic as Projects.tsx: read userData -> getGroupsByUser + getProjects -> filter
      const userData = localStorage.getItem('userData');
      if (userData) {
        (async () => {
          try {
            const { user_id: userId } = JSON.parse(userData);
            const [allProjects, userGroups] = await Promise.all([
              getProjects(),
              getGroupsByUser(userId),
            ]);
            // console.log('All projects:', allProjects);
            // console.log('User groups:', userGroups);
            const userGroupIds = userGroups.map((g: { GID: number | string }) => g.GID);
            const userProjects = (allProjects || []).filter((p: Project) =>
              userGroupIds.includes(p.GID),
            );
            // console.log('Filtered user projects:', userProjects);
            userProjects.forEach((p: Project) => {
              const ns = `proj-${p.PID}-${username}`;
              connectToNamespace(ns);
            });
          } catch (err) {
            console.error('Failed to load user projects for namespace registration', err);
          }
        })();
      } else {
        // Fallback: try the simpler endpoint if userData not present
        (async () => {
          try {
            const projects = await getProjectListByUser();
            projects.forEach((p) => {
              const ns = `proj-${p.PID}-${username}`;
              connectToNamespace(ns);
            });
          } catch (err) {
            console.error(
              'Failed to load user projects (fallback) for namespace registration',
              err,
            );
          }
        })();
      }
    }

    // Also ensure any namespaces discovered in podsData are connected.
    const activeNamespaces = Object.keys(podsData);
    activeNamespaces.forEach((ns) => connectToNamespace(ns));
  }, [podsData, connectToNamespace]);

  // English: Process global messages into organized namespace-pod structure
  useEffect(() => {
    const newPodsData: NamespacePods = {};
    messages.forEach((msg) => {
      if (msg.kind === 'Pod') {
        if (!newPodsData[msg.ns]) {
          newPodsData[msg.ns] = [];
        }
        // English: Avoid duplicate pods in the same namespace list
        if (!newPodsData[msg.ns].find((p) => p.name === msg.name)) {
          newPodsData[msg.ns].push({
            name: msg.name,
            containers: msg.containers || [],
            status: msg.status || 'Unknown',
          });
        }
      }
    });
    setPodsData(newPodsData);
  }, [messages]);

  const hasPods = Object.keys(podsData).length > 0;

  return (
    <div className="space-y-8 p-4">
      {hasPods ? (
        Object.keys(podsData)
          .sort()
          .map((ns) => (
            <div
              key={ns}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  {t('monitor.table.namespace')}:
                  <span className="font-mono bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
                    {ns}
                  </span>
                </h2>
              </div>
              <PodMonitoringTable
                namespace={ns}
                pods={podsData[ns]}
                fetchPodLogs={(podName: string, container: string) =>
                  fetchPodLogs(ns, podName, container)
                }
              />
            </div>
          ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {t('monitor.empty.waitingForData') || 'Waiting for cluster data stream...'}
          </p>
        </div>
      )}
      <PodLogsModal
        open={logsOpen}
        onClose={() => setLogsOpen(false)}
        content={logsContent}
        loading={logsLoading}
        target={logsTarget}
      />
    </div>
  );
}
