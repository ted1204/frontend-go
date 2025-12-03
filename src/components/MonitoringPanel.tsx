import { ResourceMessage } from '../hooks/useWebSocket';
import { SYSTEM_POD_PREFIXES } from '../config/constants';

/**
 * Helper component to display a colored badge based on status or event type.
 * @param {string | undefined} status - The status or event type string.
 */
const StatusBadge = ({ status }: { status: string | undefined }) => {
  // Ensure status is a string for case comparison, defaulting to an empty string if undefined
  const safeStatus = status?.toLowerCase() || '';

  const baseClasses =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
  let colorClasses =
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // Default: Grey
  let displayText = status || 'N/A';

  switch (safeStatus) {
    case 'running':
      colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      displayText = '執行中';
      break;
    case 'active':
      colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      displayText = '活躍';
      break;
    case 'completed':
      colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      displayText = '已完成';
      break;
    case 'succeeded':
      colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      displayText = '成功';
      break;
    case 'added': // Event: Added
      colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      displayText = '已新增';
      break;
    case 'pending':
      colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      displayText = '等待中';
      break;
    case 'creating':
      colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      displayText = '建立中';
      break;
    case 'modified': // Event: Modified
      colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      displayText = '已修改';
      break;
    case 'failed':
      colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      displayText = '失敗';
      break;
    case 'error':
      colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      displayText = '錯誤';
      break;
    case 'deleted': // Event: Deleted
      colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      displayText = '已刪除';
      break;
  }

  return (
    <span className={`${baseClasses} ${colorClasses}`}>{displayText}</span>
  );
};

/**
 * Component to display a table of monitored resource messages.
 * It includes logic to show Service IPs (externalIP, clusterIP, nodePorts).
 * @param {ResourceMessage[]} messages - Array of resource events.
 */
const MonitoringPanel = ({ messages }: { messages: ResourceMessage[] }) => {
  const filteredMessages = messages.filter((msg) => {
    return !SYSTEM_POD_PREFIXES.some((prefix) => msg.name.startsWith(prefix));
  });

  return (
    <div className="mt-6 -mx-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  事件類型
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  種類
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  名稱
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  端點/IP
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  狀態
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg, index) => {
                  // Determine the IP/Endpoint to display
                  let endpoint = 'N/A';
                  if (msg.kind === 'Service') {
                    // Prioritize externalIP, then fallback to clusterIP, and then show NodePort if available
                    if (msg.externalIP) {
                      endpoint = msg.externalIP;
                    } else if (msg.clusterIP) {
                      endpoint = msg.clusterIP;
                    } else if (msg.nodePorts && msg.nodePorts.length > 0) {
                      endpoint = `NodePort: ${msg.nodePorts.join(', ')}`;
                    }
                  } else if (msg.age) {
                    endpoint = `存在時間: ${msg.age}`; // Display age for other resources like Pods
                  }

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {msg.type}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400">
                        {msg.kind || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400 font-mono">
                        {msg.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400 font-mono">
                        {endpoint}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {/* Fallback to event type if status is missing (common for Service) */}
                        <StatusBadge status={msg.status || msg.type} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5} // Colspan adjusted to 5 to cover all columns
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mt-2 font-semibold">
                        等待事件中...
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPanel;
