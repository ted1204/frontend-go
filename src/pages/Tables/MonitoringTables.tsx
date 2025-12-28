import { useEffect, useState, Fragment } from 'react';
import { useGlobalWebSocket } from '../../context/WebSocketContext';
import Pagination from '../../components/common/Pagination';
import useTranslation from '../../hooks/useTranslation';

// --- Type Definitions --- //

interface Pod {
  name: string;
  containers: string[];
  status: string;
}

interface NamespacePods {
  [namespace: string]: Pod[];
}

// Icon for the terminal connect button
const TerminalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M2 5a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm4.5 2.5a.5.5 0 00-.5.5v.5a.5.5 0 00.5.5h.5a.5.5 0 00.5-.5V8a.5.5 0 00-.5-.5h-.5zM8 8a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5A.5.5 0 018 8zm-1.5 3.5a.5.5 0 00-.5.5v.5a.5.5 0 00.5.5h.5a.5.5 0 00.5-.5v-.5a.5.5 0 00-.5-.5h-.5zM8 12a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z"
      clipRule="evenodd"
    />
  </svg>
);

// Icon to indicate expandable rows
const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

// --- PodMonitoringTable Component --- //

interface PodMonitoringTableProps {
  namespace: string;
  pods: Pod[];
}

const PodMonitoringTable: React.FC<PodMonitoringTableProps> = ({ namespace, pods }) => {
  const { t } = useTranslation();
  const [expandedPods, setExpandedPods] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when pods change
  useEffect(() => {
    setCurrentPage(1);
  }, [pods]);

  const totalPages = Math.ceil(pods.length / itemsPerPage);
  const paginatedPods = pods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Toggles the expanded state for a specific pod
  const togglePodExpand = (podName: string) => {
    const key = `${namespace}-${podName}`;
    setExpandedPods((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Opens a new window to the terminal for a specific container
  const handleConnectTerminal = (podName: string, container: string) => {
    const url = `/terminal?namespace=${encodeURIComponent(namespace)}&pod=${encodeURIComponent(podName)}&container=${container}&command=/bin/bash&tty=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Renders a colored badge based on pod status
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
              {t('monitor.table.podName')}
            </th>
            <th scope="col" className="px-6 py-3 w-1/5">
              {t('monitor.table.namespace')}
            </th>
            <th scope="col" className="px-6 py-3 w-1/5">
              {t('monitor.table.status')}
            </th>
            <th scope="col" className="px-6 py-3 w-1/5 text-right">
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
            paginatedPods.map((pod) => {
              const podKey = `${namespace}-${pod.name}`;
              const isExpanded = !!expandedPods[podKey];

              return (
                <Fragment key={podKey}>
                  {/* Main pod row */}
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

                  {/* Expanded container rows */}
                  {isExpanded &&
                    pod.containers.map((container) => (
                      <tr key={`${podKey}-${container}`} className="bg-gray-50 dark:bg-gray-800/60">
                        <td className="pl-14 pr-6 py-3 text-gray-700 dark:text-gray-300">
                          {container}
                        </td>
                        <td className="px-6 py-3"></td>
                        <td className="px-6 py-3"></td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click from firing
                              handleConnectTerminal(pod.name, container);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <TerminalIcon className="w-4 h-4" />
                            {t('monitor.button.connect')}
                          </button>
                        </td>
                      </tr>
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
  const { messages } = useGlobalWebSocket();
  const [podsData, setPodsData] = useState<NamespacePods>({});
  const { t } = useTranslation();

  useEffect(() => {
    const newPodsData: NamespacePods = {};
    messages.forEach((msg) => {
      if (msg.kind === 'Pod') {
        if (!newPodsData[msg.ns]) {
          newPodsData[msg.ns] = [];
        }
        newPodsData[msg.ns].push({
          name: msg.name,
          containers: msg.containers || [],
          status: msg.status || 'Unknown',
        });
      }
    });
    setPodsData(newPodsData);
  }, [messages]);

  const hasPods = Object.keys(podsData).length > 0;

  return (
    <div className="space-y-8">
      {/* Placeholder for PageMeta and PageBreadcrumb if needed */}
      {/* <PageMeta title="Pods Dashboard" /> */}
      {/* <PageBreadcrumb pageTitle="Containers" /> */}

      {hasPods ? (
        Object.keys(podsData)
          .sort()
          .map((ns) => (
            <div
              key={ns}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {t('monitor.table.namespace')}:&nbsp;
                  <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-blue-600 dark:text-blue-400">
                    {ns}
                  </span>
                </h2>
              </div>
              <PodMonitoringTable namespace={ns} pods={podsData[ns]} />
            </div>
          ))
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {t('monitor.table.namespace')}
            </h2>
          </div>
          <PodMonitoringTable namespace={''} pods={[]} />
        </div>
      )}
    </div>
  );
}
