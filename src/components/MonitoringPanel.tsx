import { useMemo, useState } from 'react';
import { useTranslation } from '@nthucscc/utils';
// Ensure you have this constant. If not, define it locally:
// const SYSTEM_POD_PREFIXES = ['kube-', 'coredns', 'etcd', 'calico', 'ingress'];
import { SYSTEM_POD_PREFIXES } from '../config/constants';

// --- Type Definitions ---

export interface ResourceMessage {
  type: string;
  name: string;
  ns: string;
  status?: string;
  kind?: string;
  age?: string;

  // Network related
  clusterIP?: string;
  externalIP?: string;
  externalIPs?: string[];
  nodePorts?: number[];
  ports?: string[]; // Standard Service Ports (e.g., "80/TCP")
  serviceType?: string;

  // Pod related
  containers?: string[];
  images?: string[];
  restartCount?: number;

  // Metadata
  metadata?: {
    deletionTimestamp?: string | null;
    creationTimestamp?: string;
    labels?: Record<string, string>;
  };
}

// Definition for dynamic columns
type ColumnKey = 'kind' | 'name' | 'details' | 'age' | 'status' | 'images' | 'restarts' | 'labels';

// List of Kubernetes system labels to ignore in the UI to reduce noise
const IGNORED_LABELS = [
  'pod-template-hash',
  'controller-revision-hash',
  'pod-template-generation',
  'service.kubernetes.io/headless',
  'statefulset.kubernetes.io/pod-name',
];

// --- Helper Functions ---

const calculateAge = (creationTimestamp?: string) => {
  if (!creationTimestamp) return '-';
  const diff = Date.now() - new Date(creationTimestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
};

// --- Sub-Components ---

const StatusBadge = ({
  status,
  isTerminating,
}: {
  status: string | undefined;
  isTerminating?: boolean;
}) => {
  // Priority: If deletionTimestamp exists, show Terminating regardless of status
  if (isTerminating) {
    return (
      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 animate-pulse border border-gray-300 dark:border-gray-600">
        Terminating
      </span>
    );
  }

  const safeStatus = status?.toLowerCase() || 'unknown';
  let colorClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  switch (safeStatus) {
    case 'running':
    case 'active':
    case 'bound':
    case 'succeeded':
    case 'ready':
      colorClasses =
        'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800';
      break;
    case 'pending':
    case 'containercreating':
      colorClasses =
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
      break;
    case 'failed':
    case 'error':
    case 'crashloopbackoff':
    case 'errimagepull':
    case 'imagepullbackoff':
      colorClasses =
        'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800';
      break;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${colorClasses}`}
    >
      {status || 'Unknown'}
    </span>
  );
};

// --- Main Component ---

const MonitoringPanel = ({ messages }: { messages: ResourceMessage[] }) => {
  const { t } = useTranslation();

  // 1. Column Selection State
  // Default visible columns (Max 5 recommended for layout)
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(['kind', 'name', 'details', 'status', 'age']),
  );

  const safeMessages = Array.isArray(messages) ? messages : [];

  // 2. Data Aggregation & Filtering Logic (Optimized for WebSocket stream)
  const currentResources = useMemo(() => {
    const resourceMap = new Map<string, ResourceMessage>();

    safeMessages.forEach((msg) => {
      // Filter out system pods (noisy data)
      if (SYSTEM_POD_PREFIXES.some((prefix) => msg.name.startsWith(prefix))) {
        return;
      }

      const key = `${msg.kind}/${msg.name}`;
      if (msg.type === 'DELETED') {
        resourceMap.delete(key);
      } else {
        // Upsert: newer messages overwrite older ones
        resourceMap.set(key, msg);
      }
    });

    return Array.from(resourceMap.values()).sort((a, b) => {
      if (a.kind !== b.kind) return (a.kind || '').localeCompare(b.kind || '');
      if (a.metadata?.creationTimestamp && b.metadata?.creationTimestamp) {
        return b.metadata.creationTimestamp.localeCompare(a.metadata.creationTimestamp);
      }
      return a.name.localeCompare(b.name);
    });
  }, [safeMessages]);

  // Toggle column visibility with MAX limit
  const toggleColumn = (col: ColumnKey) => {
    const newSet = new Set(visibleColumns);
    if (newSet.has(col)) {
      newSet.delete(col);
    } else {
      // Constraint: Allow max 5 columns selected at once
      if (newSet.size >= 5) {
        // Optionally trigger a toast here: toast.error("Max 5 columns allowed");
        return;
      }
      newSet.add(col);
    }
    setVisibleColumns(newSet);
  };

  // Render Network Details (IPs, Ports)
  const renderDetails = (res: ResourceMessage) => {
    if (res.kind === 'Service') {
      return (
        <div className="flex flex-col gap-1.5 text-xs">
          {/* NodePorts */}
          {res.nodePorts && res.nodePorts.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-semibold text-gray-500">Node:</span>
              {res.nodePorts.map((port) => (
                <span
                  key={port}
                  className="font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                >
                  {port}
                </span>
              ))}
            </div>
          )}
          {/* Standard Ports */}
          {res.ports && res.ports.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-semibold text-gray-500">Port:</span>
              {res.ports.map((port) => (
                <span
                  key={port}
                  className="font-mono text-gray-700 dark:text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                >
                  {port}
                </span>
              ))}
            </div>
          )}
          {/* External IPs */}
          {res.externalIPs && res.externalIPs.length > 0 && (
            <div className="flex gap-1 items-center">
              <span className="font-semibold text-gray-500">Ext:</span>
              <span className="font-mono text-gray-700 dark:text-gray-300">
                {res.externalIPs.join(', ')}
              </span>
            </div>
          )}
          {/* Cluster IP */}
          {res.clusterIP && res.clusterIP !== 'None' && (
            <div className="flex gap-1 items-center text-gray-400">
              <span>IP:</span>
              <span className="font-mono">{res.clusterIP}</span>
            </div>
          )}
        </div>
      );
    }
    // Simple fallback for Pod IPs if needed
    if (res.kind === 'Pod' && res.clusterIP) {
      return <span className="text-xs font-mono text-gray-500">{res.clusterIP}</span>;
    }
    return <span className="text-gray-400">-</span>;
  };

  // Render Labels (Filtered)
  const renderLabels = (labels?: Record<string, string>) => {
    if (!labels) return <span className="text-gray-400">-</span>;

    // Filter out unimportant system labels
    const filteredLabels = Object.entries(labels).filter(([key]) => {
      return !IGNORED_LABELS.includes(key);
    });

    if (filteredLabels.length === 0) return <span className="text-gray-400">-</span>;

    return (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {filteredLabels.slice(0, 3).map(([k, v]) => (
          <span
            key={k}
            className="px-1.5 py-0.5 text-[10px] bg-gray-100 rounded border dark:bg-gray-800 dark:border-gray-700 truncate max-w-full"
            title={`${k}=${v}`}
          >
            {k}={v}
          </span>
        ))}
        {filteredLabels.length > 3 && (
          <span className="text-[10px] text-gray-400">+{filteredLabels.length - 3}</span>
        )}
      </div>
    );
  };

  const availableColumns: ColumnKey[] = [
    'kind',
    'name',
    'details',
    'status',
    'age',
    'images',
    'restarts',
    'labels',
  ];

  return (
    <div className="mt-4 flow-root">
      {/* --- Column Selector Toolbar --- */}
      <div className="mb-4 flex flex-wrap gap-2 items-center text-sm">
        <span className="text-gray-500 font-medium mr-2">Columns (Max 5):</span>
        {availableColumns.map((col) => {
          const isSelected = visibleColumns.has(col);
          const isMaxReached = visibleColumns.size >= 5;
          const isDisabled = !isSelected && isMaxReached;

          return (
            <button
              key={col}
              onClick={() => toggleColumn(col)}
              disabled={isDisabled}
              className={`px-3 py-1 rounded-full border transition-all text-xs font-medium 
                ${
                  isSelected
                    ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300'
                    : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              {t(`monitor.col.${col}`) || col.charAt(0).toUpperCase() + col.slice(1)}
            </button>
          );
        })}
      </div>

      {/* --- Data Table --- */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {visibleColumns.has('kind') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  {t('monitor.col.kind')}
                </th>
              )}
              {visibleColumns.has('name') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('monitor.col.name')}
                </th>
              )}
              {visibleColumns.has('details') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('monitor.col.details')}
                </th>
              )}
              {visibleColumns.has('images') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('monitor.col.images')}
                </th>
              )}
              {visibleColumns.has('labels') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('monitor.col.labels')}
                </th>
              )}
              {visibleColumns.has('restarts') && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  {t('monitor.col.restarts')}
                </th>
              )}
              {visibleColumns.has('age') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  {t('monitor.col.age')}
                </th>
              )}
              {visibleColumns.has('status') && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  {t('monitor.col.status')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
            {currentResources.length > 0 ? (
              currentResources.map((res) => {
                const isTerminating = !!res.metadata?.deletionTimestamp;
                const age = calculateAge(res.metadata?.creationTimestamp);

                return (
                  <tr
                    key={`${res.kind}-${res.name}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {/* Kind */}
                    {visibleColumns.has('kind') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {res.kind}
                      </td>
                    )}

                    {/* Name */}
                    {visibleColumns.has('name') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {res.name}
                      </td>
                    )}

                    {/* Network Details */}
                    {visibleColumns.has('details') && (
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {renderDetails(res)}
                      </td>
                    )}

                    {/* Images */}
                    {visibleColumns.has('images') && (
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {res.images?.map((img, i) => (
                          <div
                            key={i}
                            className="truncate max-w-[180px] text-xs font-mono"
                            title={img}
                          >
                            {img.split('/').pop()}
                          </div>
                        ))}
                      </td>
                    )}

                    {/* Labels (Filtered) */}
                    {visibleColumns.has('labels') && (
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {renderLabels(res.metadata?.labels)}
                      </td>
                    )}

                    {/* Restarts */}
                    {visibleColumns.has('restarts') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center font-mono">
                        {res.kind === 'Pod' ? res.restartCount || 0 : '-'}
                      </td>
                    )}

                    {/* Age */}
                    {visibleColumns.has('age') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {age}
                      </td>
                    )}

                    {/* Status */}
                    {visibleColumns.has('status') && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <StatusBadge status={res.status} isTerminating={isTerminating} />
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={visibleColumns.size} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <p className="font-medium">{t('monitor.waiting')}</p>
                    <p className="text-xs mt-1 text-gray-400">Waiting for resources...</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonitoringPanel;
