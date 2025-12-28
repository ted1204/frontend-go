import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { getResourcesByConfigFile } from '../services/resourceService';
// --- Helper Components ---
// Chevron icon for the expand/collapse functionality
const ChevronIcon = ({ isOpen }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: `h-5 w-5 transform text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" }) }));
// The "More Actions" dropdown menu component (kebab menu)
// It is self-contained and handles its own state.
const MoreActionsButton = ({ onEdit, onDelete, onDeleteInstance, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    // This effect handles closing the menu when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (_jsxs("div", { className: "relative", ref: menuRef, children: [_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white", "aria-label": "More actions", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" }) }) }), isOpen && (_jsxs("div", { className: "absolute right-0 top-full z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700", children: [_jsx("button", { onClick: () => {
                            onEdit();
                            setIsOpen(false);
                        }, className: "flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700", children: "\u7DE8\u8F2F\u6A94\u6848" }), _jsx("button", { onClick: () => {
                            onDeleteInstance();
                            setIsOpen(false);
                        }, className: "flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700", children: "\u92B7\u6BC0\u5BE6\u4F8B" }), _jsx("div", { className: "my-1 h-px bg-gray-100 dark:bg-gray-700" }), _jsx("button", { onClick: () => {
                            onDelete();
                            setIsOpen(false);
                        }, className: "flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50", children: "\u522A\u9664\u6A94\u6848" })] }))] }));
};
// --- Main Component ---
export default function ConfigFileList({ configFiles, onDelete, onEdit, onCreateInstance, onDeleteInstance, actionLoading, }) {
    const [expanded, setExpanded] = useState({});
    const [resources, setResources] = useState({});
    const [loading, setLoading] = useState({});
    const toggleExpand = async (cfId) => {
        const isOpen = !expanded[cfId];
        setExpanded((prev) => ({ ...prev, [cfId]: isOpen }));
        if (isOpen && !resources[cfId]) {
            setLoading((prev) => ({ ...prev, [cfId]: true }));
            try {
                const res = await getResourcesByConfigFile(cfId);
                setResources((prev) => ({ ...prev, [cfId]: res }));
            }
            catch (error) {
                console.error('Error fetching resources:', error);
            }
            finally {
                setLoading((prev) => ({ ...prev, [cfId]: false }));
            }
        }
    };
    if (configFiles.length === 0) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 dark:text-white", children: "\u627E\u4E0D\u5230\u8A2D\u5B9A\u6A94" }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "\u9EDE\u64CA\u300C\u65B0\u589E\u8A2D\u5B9A\u6A94\u300D\u4EE5\u958B\u59CB\u3002" })] }));
    }
    return (_jsx("div", { className: "divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700", children: configFiles.map((cf) => (_jsxs("div", { className: "bg-white dark:bg-gray-800", children: [_jsxs("div", { className: "flex items-center p-4", children: [_jsx("button", { onClick: () => toggleExpand(cf.CFID), className: "mr-4 flex-shrink-0 rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700", disabled: actionLoading, "aria-label": "Toggle resources", children: _jsx(ChevronIcon, { isOpen: !!expanded[cf.CFID] }) }), _jsxs("div", { className: "flex-grow", children: [_jsx("p", { className: "font-semibold text-gray-900 dark:text-white", children: cf.Filename }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["ID: ", _jsx("span", { className: "font-mono", children: cf.CFID }), " | \u5EFA\u7ACB\u6642\u9593:", ' ', new Date(cf.CreatedAt).toLocaleDateString()] })] }), _jsxs("div", { className: "flex flex-shrink-0 items-center gap-4", children: [_jsx("button", { onClick: () => onCreateInstance(cf.CFID), disabled: actionLoading, className: "text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-500 dark:hover:text-blue-400", title: "\u90E8\u7F72\u5BE6\u4F8B", children: "\u90E8\u7F72" }), _jsx(MoreActionsButton, { onEdit: () => onEdit(cf), onDelete: () => onDelete(cf.CFID), onDeleteInstance: () => onDeleteInstance(cf.CFID) })] })] }), _jsx("div", { className: `overflow-hidden transition-[max-height] duration-300 ease-in-out ${expanded[cf.CFID] ? 'max-h-96' : 'max-h-0'}`, children: _jsx("div", { className: "border-t border-gray-200 bg-gray-50/75 p-4 dark:border-gray-700 dark:bg-black/20 sm:px-6 sm:py-4", children: loading[cf.CFID] ? (_jsx("div", { className: "space-y-3", children: [...Array(3)].map((_, i) => (_jsxs("div", { className: "animate-pulse flex items-center justify-between", children: [_jsx("div", { className: "h-4 w-2/5 rounded-md bg-gray-200 dark:bg-gray-700" }), _jsx("div", { className: "h-5 w-1/5 rounded-full bg-gray-200 dark:bg-gray-700" })] }, i))) })) : resources[cf.CFID]?.length ? (_jsxs("div", { children: [_jsx("h4", { className: "mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400", children: "\u95DC\u806F\u8CC7\u6E90" }), _jsx("ul", { className: "space-y-2", children: resources[cf.CFID].map((r) => (_jsxs("li", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: r.Name }), _jsx("span", { className: "inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300", children: r.Type })] }, r.RID))) })] })) : (_jsxs("div", { className: "flex flex-col items-center justify-center py-4 text-center", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-8 w-8 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" }) }), _jsx("p", { className: "mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300", children: "\u7121\u95DC\u806F\u8CC7\u6E90" }), _jsx("p", { className: "mt-1 text-xs text-gray-500 dark:text-gray-400", children: "\u6B64\u8A2D\u5B9A\u6A94\u5C1A\u672A\u90E8\u7F72\u3002" })] })) }) })] }, cf.CFID))) }));
}
