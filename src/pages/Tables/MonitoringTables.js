import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, Fragment } from 'react';
import { useGlobalWebSocket } from '../../context/useGlobalWebSocket';
import { Pagination } from '@tailadmin/ui';
import { useTranslation } from '@tailadmin/utils';
// Icon for the terminal connect button
const TerminalIcon = (props) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", ...props, children: _jsx("path", { fillRule: "evenodd", d: "M2 5a3 3 0 013-3h10a3 3 0 013 3v10a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm4.5 2.5a.5.5 0 00-.5.5v.5a.5.5 0 00.5.5h.5a.5.5 0 00.5-.5V8a.5.5 0 00-.5-.5h-.5zM8 8a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5A.5.5 0 018 8zm-1.5 3.5a.5.5 0 00-.5.5v.5a.5.5 0 00.5.5h.5a.5.5 0 00.5-.5v-.5a.5.5 0 00-.5-.5h-.5zM8 12a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5z", clipRule: "evenodd" }) }));
// Icon to indicate expandable rows
const ChevronDownIcon = (props) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", ...props, children: _jsx("path", { fillRule: "evenodd", d: "M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z", clipRule: "evenodd" }) }));
const PodMonitoringTable = ({ namespace, pods }) => {
    const { t } = useTranslation();
    const [expandedPods, setExpandedPods] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // Reset page when pods change
    useEffect(() => {
        setCurrentPage(1);
    }, [pods]);
    const totalPages = Math.ceil(pods.length / itemsPerPage);
    const paginatedPods = pods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // Toggles the expanded state for a specific pod
    const togglePodExpand = (podName) => {
        const key = `${namespace}-${podName}`;
        setExpandedPods((prev) => ({ ...prev, [key]: !prev[key] }));
    };
    // Opens a new window to the terminal for a specific container
    const handleConnectTerminal = (podName, container) => {
        const url = `/terminal?namespace=${encodeURIComponent(namespace)}&pod=${encodeURIComponent(podName)}&container=${container}&command=/bin/bash&tty=true`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    // Renders a colored badge based on pod status
    const StatusBadge = ({ status }) => {
        const isRunning = status === 'Running';
        const colorClasses = isRunning
            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
        const dotClasses = isRunning ? 'bg-green-500' : 'bg-red-500';
        return (_jsxs("span", { className: `inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${colorClasses}`, children: [_jsx("span", { className: `h-1.5 w-1.5 rounded-full ${dotClasses}` }), status] }));
    };
    return (_jsxs("div", { className: "w-full overflow-x-auto", children: [_jsxs("table", { className: "min-w-full text-sm text-left", children: [_jsx("thead", { className: "text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 w-2/5", children: t('monitor.table.podName') }), _jsx("th", { scope: "col", className: "px-6 py-3 w-1/5", children: t('monitor.table.namespace') }), _jsx("th", { scope: "col", className: "px-6 py-3 w-1/5", children: t('monitor.table.status') }), _jsx("th", { scope: "col", className: "px-6 py-3 w-1/5 text-right", children: t('monitor.table.actions') })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: paginatedPods.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "text-center py-6 text-gray-400 dark:text-gray-500", children: t('monitor.empty.noPods') }) })) : (paginatedPods.map((pod) => {
                            const podKey = `${namespace}-${pod.name}`;
                            const isExpanded = !!expandedPods[podKey];
                            return (_jsxs(Fragment, { children: [_jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer", onClick: () => togglePodExpand(pod.name), children: [_jsx("td", { className: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white", children: _jsxs("div", { className: "flex items-center", children: [_jsx(ChevronDownIcon, { className: `h-5 w-5 mr-2 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}` }), pod.name] }) }), _jsx("td", { className: "px-6 py-4", children: namespace }), _jsx("td", { className: "px-6 py-4", children: _jsx(StatusBadge, { status: pod.status }) }), _jsx("td", { className: "px-6 py-4" })] }), isExpanded &&
                                        pod.containers.map((container) => (_jsxs("tr", { className: "bg-gray-50 dark:bg-gray-800/60", children: [_jsx("td", { className: "pl-14 pr-6 py-3 text-gray-700 dark:text-gray-300", children: container }), _jsx("td", { className: "px-6 py-3" }), _jsx("td", { className: "px-6 py-3" }), _jsx("td", { className: "px-6 py-3 text-right", children: _jsxs("button", { onClick: (e) => {
                                                            e.stopPropagation(); // Prevent row click from firing
                                                            handleConnectTerminal(pod.name, container);
                                                        }, className: "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: [_jsx(TerminalIcon, { className: "w-4 h-4" }), t('monitor.button.connect')] }) })] }, `${podKey}-${container}`)))] }, podKey));
                        })) })] }), _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: setCurrentPage })] }));
};
export default function PodTablesPage() {
    const { messages } = useGlobalWebSocket();
    const [podsData, setPodsData] = useState({});
    const { t } = useTranslation();
    useEffect(() => {
        const newPodsData = {};
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
    return (_jsx("div", { className: "space-y-8", children: hasPods ? (Object.keys(podsData)
            .sort()
            .map((ns) => (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("h2", { className: "text-lg font-semibold text-gray-800 dark:text-white", children: [t('monitor.table.namespace'), ":\u00A0", _jsx("span", { className: "font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md text-blue-600 dark:text-blue-400", children: ns })] }) }), _jsx(PodMonitoringTable, { namespace: ns, pods: podsData[ns] })] }, ns)))) : (_jsxs("div", { className: "bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700", children: [_jsx("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700", children: _jsx("h2", { className: "text-lg font-semibold text-gray-800 dark:text-white", children: t('monitor.table.namespace') }) }), _jsx(PodMonitoringTable, { namespace: '', pods: [] })] })) }));
}
