import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SYSTEM_POD_PREFIXES } from '../config/constants';
import { useTranslation } from '@tailadmin/utils';
/**
 * Helper component to display a colored badge based on status or event type.
 * @param {string | undefined} status - The status or event type string.
 */
const StatusBadge = ({ status }) => {
    const { t } = useTranslation();
    // Ensure status is a string for case comparison, defaulting to an empty string if undefined
    const safeStatus = status?.toLowerCase() || '';
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
    let colorClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'; // Default: Grey
    let displayText = status || 'N/A';
    switch (safeStatus) {
        case 'running':
            colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            displayText = t('monitor.status.running');
            break;
        case 'active':
            colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            displayText = t('monitor.status.active');
            break;
        case 'completed':
            colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            displayText = t('monitor.status.completed');
            break;
        case 'succeeded':
            colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            displayText = t('monitor.status.succeeded');
            break;
        case 'added': // Event: Added
            colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            displayText = t('monitor.status.added');
            break;
        case 'pending':
            colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            displayText = t('monitor.status.pending');
            break;
        case 'creating':
            colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            displayText = t('monitor.status.creating');
            break;
        case 'modified': // Event: Modified
            colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            displayText = t('monitor.status.modified');
            break;
        case 'failed':
            colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            displayText = t('monitor.status.failed');
            break;
        case 'error':
            colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            displayText = t('monitor.status.error');
            break;
        case 'deleted': // Event: Deleted
            colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            displayText = t('monitor.status.deleted');
            break;
    }
    return _jsx("span", { className: `${baseClasses} ${colorClasses}`, children: displayText });
};
/**
 * Component to display a table of monitored resource messages.
 * It includes logic to show Service IPs (externalIP, clusterIP, nodePorts).
 * @param {ResourceMessage[]} messages - Array of resource events.
 */
const MonitoringPanel = ({ messages }) => {
    const { t } = useTranslation();
    const filteredMessages = messages.filter((msg) => {
        return !SYSTEM_POD_PREFIXES.some((prefix) => msg.name.startsWith(prefix));
    });
    return (_jsx("div", { className: "mt-6 -mx-6 flow-root", children: _jsx("div", { className: "overflow-x-auto", children: _jsx("div", { className: "inline-block min-w-full align-middle", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { className: "text-xs text-gray-500 uppercase dark:text-gray-400", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left", children: t('monitor.col.eventType') }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left", children: t('monitor.col.kind') }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left", children: t('monitor.col.name') }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left", children: t('monitor.col.endpoint') }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right", children: t('monitor.col.status') })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: filteredMessages.length > 0 ? (filteredMessages.map((msg, index) => {
                                // Determine the IP/Endpoint to display
                                let endpoint = 'N/A';
                                if (msg.kind === 'Service') {
                                    // Prioritize externalIP, then fallback to clusterIP, and then show NodePort if available
                                    if (msg.externalIP) {
                                        endpoint = msg.externalIP;
                                    }
                                    else if (msg.clusterIP) {
                                        endpoint = msg.clusterIP;
                                    }
                                    else if (msg.nodePorts && msg.nodePorts.length > 0) {
                                        endpoint = `NodePort: ${msg.nodePorts.join(', ')}`;
                                    }
                                }
                                else if (msg.age) {
                                    endpoint = `${t('monitor.agePrefix')} ${msg.age}`; // Display age for other resources like Pods
                                }
                                return (_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-white/5", children: [_jsx("td", { className: "whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white", children: msg.type }), _jsx("td", { className: "whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400", children: msg.kind || 'N/A' }), _jsx("td", { className: "whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400 font-mono", children: msg.name }), _jsx("td", { className: "whitespace-nowrap px-6 py-4 text-gray-600 dark:text-gray-400 font-mono", children: endpoint }), _jsx("td", { className: "whitespace-nowrap px-6 py-4 text-right", children: _jsx(StatusBadge, { status: msg.status || msg.type }) })] }, index));
                            })) : (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-16 text-center text-gray-500", children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("p", { className: "mt-2 font-semibold", children: t('monitor.waiting') })] }) }) })) })] }) }) }) }));
};
export default MonitoringPanel;
