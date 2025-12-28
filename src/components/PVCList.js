import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { startFileBrowser, stopFileBrowser } from '../services/pvcService';
import { BASE_URL } from '../config/url';
// --- Icons ---
const PlayIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: className, children: _jsx("path", { d: "M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" }) }));
const StopIcon = ({ className }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: className, children: _jsx("path", { d: "M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" }) }));
const ExternalLinkIcon = ({ className }) => (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: className, children: [_jsx("path", { fillRule: "evenodd", d: "M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z", clipRule: "evenodd" }), _jsx("path", { fillRule: "evenodd", d: "M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z", clipRule: "evenodd" })] }));
export default function PVCList({ pvcs, pods = [], }) {
    const [loading, setLoading] = useState({});
    const [waitingForFileBrowser, setWaitingForFileBrowser] = useState(null);
    useEffect(() => {
        if (waitingForFileBrowser) {
            const fbPodName = `filebrowser-${waitingForFileBrowser}`;
            const fbPod = pods.find((p) => p.name === fbPodName && p.kind === 'Pod');
            const fbSvc = pods.find((p) => p.name === `${fbPodName}-svc` && p.kind === 'Service');
            if (fbPod?.status === 'Running' && fbSvc?.nodePorts?.[0]) {
                const nodePort = fbSvc.nodePorts[0];
                const hostname = BASE_URL.split(':')[0];
                const url = `http://${hostname}:${nodePort}`;
                window.open(url, '_blank');
                setWaitingForFileBrowser(null);
                setLoading((prev) => ({ ...prev, [waitingForFileBrowser]: false }));
            }
        }
    }, [pods, waitingForFileBrowser]);
    const handleFileBrowser = async (pvc) => {
        setLoading((prev) => ({ ...prev, [pvc.name]: true }));
        try {
            // Start the file browser
            await startFileBrowser(pvc.namespace, pvc.name);
            setWaitingForFileBrowser(pvc.name);
            // We don't open the window here anymore, we wait for the pod to be running
        }
        catch (error) {
            console.error('Failed to start file browser:', error);
            alert('無法啟動檔案瀏覽器: ' + (error instanceof Error ? error.message : String(error)));
            setLoading((prev) => ({ ...prev, [pvc.name]: false }));
        }
    };
    const handleStopFileBrowser = async (pvc) => {
        if (!confirm(`您確定要停止 ${pvc.name} 的檔案瀏覽器嗎？`))
            return;
        setLoading((prev) => ({ ...prev, [pvc.name]: true }));
        try {
            await stopFileBrowser(pvc.namespace, pvc.name);
        }
        catch (error) {
            console.error('Failed to stop file browser:', error);
            alert('無法停止檔案瀏覽器: ' + (error instanceof Error ? error.message : String(error)));
        }
        finally {
            setLoading((prev) => ({ ...prev, [pvc.name]: false }));
        }
    };
    if (pvcs.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 dark:text-white", children: "\u627E\u4E0D\u5230 PVC" }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "\u6B64\u5C08\u6848\u4E2D\u6C92\u6709 Persistent Volume Claims\u3002" })] }));
    }
    return (_jsx("div", { className: "divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700", children: pvcs.map((pvc) => {
            const fbPodName = `filebrowser-${pvc.name}`;
            const fbPod = pods.find((p) => p.name === fbPodName && p.kind === 'Pod');
            const fbSvc = pods.find((p) => p.name === `${fbPodName}-svc` && p.kind === 'Service');
            const isRunning = fbPod?.status === 'Running';
            const isPending = fbPod && !isRunning;
            const nodePort = fbSvc?.nodePorts?.[0];
            return (_jsx("div", { className: "bg-white dark:bg-gray-800", children: _jsxs("div", { className: "flex items-center justify-between p-4", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-900 dark:text-white", children: pvc.name }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["\u5927\u5C0F: ", _jsx("span", { className: "font-mono", children: pvc.size }), " | \u72C0\u614B: ", pvc.status] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2 mr-2", children: [_jsxs("span", { className: "relative flex h-3 w-3", children: [isPending && (_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" })), _jsx("span", { className: `relative inline-flex rounded-full h-3 w-3 ${isRunning
                                                        ? 'bg-green-500'
                                                        : isPending
                                                            ? 'bg-yellow-500'
                                                            : 'bg-gray-300 dark:bg-gray-600'}` })] }), _jsx("span", { className: "text-xs font-medium text-gray-600 dark:text-gray-300", children: isRunning ? '執行中' : isPending ? fbPod?.status || '等待中' : '已停止' })] }), isRunning && nodePort && (_jsxs("a", { href: `http://${BASE_URL.split(':')[0]}:${nodePort}`, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600", children: [_jsx(ExternalLinkIcon, { className: "h-4 w-4" }), "\u958B\u555F"] })), fbPod ? (_jsxs("button", { onClick: () => handleStopFileBrowser(pvc), disabled: loading[pvc.name], className: "inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50", children: [_jsx(StopIcon, { className: "h-4 w-4" }), loading[pvc.name] ? '停止中...' : '停止'] })) : (_jsxs("button", { onClick: () => handleFileBrowser(pvc), disabled: loading[pvc.name], className: "inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50", children: [_jsx(PlayIcon, { className: "h-4 w-4" }), loading[pvc.name] ? '啟動中...' : '啟動'] }))] })] }) }, pvc.name));
        }) }));
}
