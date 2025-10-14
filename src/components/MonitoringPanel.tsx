import React from 'react';
import { ResourceMessage } from '../hooks/useWebSocket'; // 導入介面
// MonitoringPanel.tsx

const StatusBadge = ({ status }: { status: string }) => {
  const safeStatus = status || '';

  const baseClasses =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
  let colorClasses =
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  switch (safeStatus.toLowerCase()) {
    case 'running':
    case 'active':
    case 'completed':
    case 'succeeded':
    case 'added':
      colorClasses =
        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      break;
    case 'pending':
    case 'creating':
    case 'modified':
      colorClasses =
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      break;
    case 'failed':
    case 'error':
    case 'deleted':
      colorClasses =
        'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      break;
  }

  return (
    <span className={`${baseClasses} ${colorClasses}`}>{status || 'N/A'}</span>
  );
};

const MonitoringPanel = ({ messages }: { messages: ResourceMessage[] }) => {
  return (
    <div className="mt-6 -mx-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-500 uppercase dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  Event Type
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Kind
                </th>
                <th scope="col" className="px-6 py-3 text-left">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
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
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <StatusBadge status={msg.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
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
                        Waiting for events...
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
