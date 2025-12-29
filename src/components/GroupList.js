import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/GroupList.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from '@tailadmin/utils';
import { Pagination } from '@tailadmin/ui';
// --- SVG Icons --- //
/** SVG Icon for Deletion (Trash Can) */
const TrashIcon = ({ className = 'h-5 w-5' }) => (_jsx("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" }) }));
/** SVG Icon for Group/Team */
const GroupIcon = ({ className = 'h-5 w-5' }) => (_jsx("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.028.658a.78.78 0 01-.357.442zM20 9a3 3 0 100-6 3 3 0 000 6zM14 8a2 2 0 11-4 0 2 2 0 014 0zm5.51 7.326a.78.78 0 01-.358-.442 3 3 0 01-4.308-3.516 6.484 6.484 0 001.905 3.959c.023.222.014.442-.028.658a.78.78 0 01.357.442zM9.25 12.164a4.5 4.5 0 00-5.462-3.332 6.49 6.49 0 00-1.905 3.959c-.023.222-.014.442.028.658a.78.78 0 00.358.442 4.5 4.5 0 005.462-3.332zM14.75 12.164a4.5 4.5 0 015.462-3.332 6.49 6.49 0 011.905 3.959c.023.222.014.442-.028.658a.78.78 0 01-.358.442 4.5 4.5 0 01-5.462-3.332z" }) }));
/** SVG Icon for Search */
const SearchIcon = ({ className = 'w-5 h-5' }) => (_jsx("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }));
// --- Helper Components for States (Loading, Error, Empty) --- //
const LoadingSpinner = ({ t }) => (_jsxs("div", { className: "flex justify-center items-center p-8 text-gray-500 dark:text-gray-400", children: [_jsxs("svg", { className: "animate-spin h-6 w-6 mr-3 text-blue-500 dark:text-blue-400", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), _jsx("span", { children: t('groupList.loading') })] }));
const ErrorDisplay = ({ message, t }) => (_jsxs("div", { className: "bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg", role: "alert", children: [_jsx("strong", { className: "font-bold mr-1", children: t('projectList.errorPrefix') }), _jsx("span", { className: "block sm:inline", children: message })] }));
const EmptyState = ({ isFiltering, t }) => (_jsxs("div", { className: "text-center py-12 px-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800", children: [_jsx(GroupIcon, { className: "mx-auto h-10 w-10 text-gray-400" }), _jsx("h3", { className: "mt-4 text-lg font-semibold text-gray-800 dark:text-white", children: isFiltering ? t('groupList.empty.filter') : t('groupList.empty.noGroups') }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: isFiltering ? t('groupList.empty.filterTip') : t('groupList.empty.noGroupsTip') })] }));
const GroupList = ({ groups, loading, error, onGroupClick, onDeleteGroup, searchTerm, onSearchChange,
// isActionLoading = false, // Uncomment if adding isActionLoading
 }) => {
    const { t } = useTranslation();
    const isFiltering = (searchTerm || '').length > 0;
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // Reset page when search changes (groups prop changes)
    useEffect(() => {
        setCurrentPage(1);
    }, [groups]);
    const totalPages = Math.ceil(groups.length / itemsPerPage);
    const paginatedGroups = groups.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const renderContent = () => {
        if (loading) {
            return _jsx(LoadingSpinner, { t: t });
        }
        if (error) {
            return _jsx(ErrorDisplay, { message: error, t: t });
        }
        // Defensive check: Ensure 'groups' is an array before checking its length
        if (!groups || groups.length === 0) {
            return _jsx(EmptyState, { isFiltering: isFiltering, t: t });
        }
        return (_jsxs(_Fragment, { children: [_jsx("ul", { className: "space-y-4", children: paginatedGroups.map((group) => (_jsxs("li", { 
                        // Aesthetic card styling with hover feedback
                        className: "group flex justify-between items-center \n                          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl \n                          shadow-md transition-all duration-200 \n                          hover:shadow-lg hover:border-violet-400 dark:hover:border-violet-500", children: [_jsx("div", { onClick: () => onGroupClick(group.GID), className: "flex-grow cursor-pointer px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 shadow-sm", children: _jsx(GroupIcon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-lg text-gray-800 dark:text-white truncate", children: group.GroupName }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5", children: group.Description || t('groupList.noDescription', { id: group.GID }) })] })] }) }), _jsx("div", { className: "px-4 flex-shrink-0", children: _jsx("button", { 
                                    // FIX: Pass the whole group object instead of just the ID
                                    onClick: (e) => {
                                        e.stopPropagation(); // Prevent onGroupClick from firing
                                        onDeleteGroup(group);
                                    }, className: "p-2 rounded-full text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200", "aria-label": t('groupList.deleteGroupAria'), children: _jsx(TrashIcon, { className: "h-5 w-5" }) }) })] }, group.GID))) }), _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: setCurrentPage })] }));
    };
    return (_jsxs("div", { className: "mx-auto w-full max-w-4xl", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white", children: t('groupList.title') }), _jsx("p", { className: "mt-1 text-base text-gray-600 dark:text-gray-400", children: t('groupList.description') })] }), _jsxs("div", { className: "mb-6 relative", children: [_jsx(SearchIcon, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" }), _jsx("input", { type: "text", placeholder: t('groupList.searchPlaceholder'), value: searchTerm, onChange: onSearchChange, className: "\n                w-full \n                py-2 pl-10 pr-4 \n                border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white \n                rounded-lg \n                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500\n                transition duration-150\n            " })] }), _jsx("div", { className: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-8 shadow-lg", children: renderContent() })] }));
};
export default GroupList;
