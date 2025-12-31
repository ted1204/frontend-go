import React, { useEffect, useState, Fragment } from 'react';
import { useGlobalWebSocket } from '../../context/useGlobalWebSocket';
import { getUsername } from '../../services/authService';
import { getProjectListByUser, getProjects } from '../../services/projectService';
import { getGroupsByUser } from '../../services/userGroupService';
import { Pagination } from '@nthucscc/ui';
import { Project } from '../../interfaces/project';
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
}

const PodMonitoringTable: React.FC<PodMonitoringTableProps> = ({ namespace, pods }) => {
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

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const isRunning = status === 'Running';
    const colorClasses = isRunning
      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    const dotClasses = isRunning ? 'bg-green-500' : 'bg-red-500';

    return (
      <span
        className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${colorClasses}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dotClasses}`}></span>
        {status}
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 w-2/5">
              {t('monitor_table_podName')}
            </th>
            <th scope="col" className="px-6 py-3 w-1/5">
              {t('monitor_table_namespace')}
            </th>
            <th scope="col" className="px-6 py-3 w-1/5">
              {t('monitor_table_status')}
            </th>
            <th scope="col" className="px-6 py-3 w-1/5 text-right">
              {t('monitor_table_actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedPods.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-400 dark:text-gray-500">
                {t('monitor_empty_noPods')}
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
                  <td className="pl-14 pr-6 py-3 text-gray-700 dark:text-gray-300">{container}</td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3"></td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleConnectTerminal(podName, container);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                    >
                      <TerminalIcon className="w-4 h-4" />
                      {t('monitor_button_connect')}
                    </button>
                  </td>
                </tr>
              );

              return (
                <Fragment key={podKey}>
                  <tr
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer"
                    onClick={() => togglePodExpand(pod.name)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center">
                        <ChevronDownIcon
                          className={`h-5 w-5 mr-2 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                        {pod.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">{namespace}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={pod.status} />
                    </td>
                    <td className="px-6 py-4"></td>
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
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default function PodTablesPage() {
  // English: Destructure functions from context pool
  const { messages, connectToNamespace } = useGlobalWebSocket();
  const [podsData, setPodsData] = useState<NamespacePods>({});
  const { t } = useTranslation();

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
            const userGroupIds = userGroups.map((g: { GID: number | string }) => g.GID);
            const userProjects = (allProjects || []).filter((p: Project) =>
              userGroupIds.includes(p.GID),
            );
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
                  {t('monitor_table_namespace')}:
                  <span className="font-mono bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
                    {ns}
                  </span>
                </h2>
              </div>
              <PodMonitoringTable namespace={ns} pods={podsData[ns]} />
            </div>
          ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {t('monitor_empty_waitingForData') || 'Waiting for cluster data stream...'}
          </p>
        </div>
      )}
    </div>
  );
}
