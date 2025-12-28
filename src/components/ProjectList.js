import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from '@tailadmin/utils';
import { Pagination } from '@tailadmin/ui';
// SVG Icon for a simple Loading Spinner
const SpinnerIcon = ({ className = 'w-5 h-5' }) => (_jsxs("svg", { className: `animate-spin ${className}`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }));
// SVG Icon for Deletion (Trash Can)
const TrashIcon = ({ className = 'w-5 h-5' }) => (_jsx("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }));
// SVG Icon for Search
const SearchIcon = ({ className = 'w-5 h-5' }) => (_jsx("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }));
const ProjectList = ({ projects, loading, error, onProjectClick, onDeleteProject, searchTerm, onSearchChange, 
// Destructure the action loading prop
isActionLoading, }) => {
    // Determine if filtering is active to show the correct empty state message
    const isFiltering = searchTerm.length > 0;
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // Reset page when search changes (projects prop changes)
    useEffect(() => {
        setCurrentPage(1);
    }, [projects]);
    const totalPages = Math.ceil(projects.length / itemsPerPage);
    const paginatedProjects = projects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const { t } = useTranslation();
    return (_jsxs("div", { className: "text-left", children: [_jsx("div", { className: "mb-4 pb-2 border-b border-gray-200 dark:border-gray-700", children: _jsx("h3", { className: "text-xl font-semibold text-gray-700 dark:text-gray-300", children: t('projectList.title') }) }), _jsxs("div", { className: "mb-6 relative", children: [_jsx(SearchIcon, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" }), _jsx("input", { type: "text", placeholder: t('projectList.searchPlaceholder'), value: searchTerm, onChange: onSearchChange, className: "\n                w-full \n                py-2 pl-10 pr-4 // Padding adjusted for icon space\n                border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white \n                rounded-lg \n                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500\n                transition duration-150\n            " })] }), loading ? (
            // Loading State: Centered spinner feedback
            _jsxs("div", { className: "flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-700 rounded-lg", children: [_jsx(SpinnerIcon, { className: "w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: t('projectList.loading') })] })) : error ? (
            // Error State: Visually distinct alert box
            _jsxs("p", { className: "p-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300 rounded-lg", children: [t('projectList.errorPrefix'), " ", error] })) : projects.length === 0 ? (
            // Empty State: Dynamic message based on whether the user is searching
            _jsx("p", { className: "p-4 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg border border-dashed border-gray-300 dark:border-gray-600", children: isFiltering
                    ? t('projectList.empty.filter', { term: searchTerm })
                    : t('projectList.empty.noProjects') })) : (
            /* --- Main Project List Body --- */
            _jsxs(_Fragment, { children: [_jsx("ul", { className: "space-y-3", children: paginatedProjects.map((project) => (_jsxs("li", { 
                            // Item Card Styling: Clean card appearance with enhanced hover effects
                            className: "\n                  flex justify-between items-center \n                  p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm \n                  bg-white dark:bg-gray-800 \n                  hover:shadow-md hover:border-violet-300 dark:hover:border-violet-500 \n                  transition duration-150 ease-in-out\n                ", children: [_jsxs("div", { onClick: () => onProjectClick(project.PID), className: "cursor-pointer flex-grow pr-4", children: [_jsxs("div", { className: "flex items-baseline mb-1", children: [_jsx("span", { className: "text-lg font-semibold text-gray-800 dark:text-white truncate", children: project.ProjectName || `${t('project.untitled')} (ID: ${project.PID})` }), project.PID && (_jsxs("span", { className: "text-xs text-gray-400 dark:text-gray-500 ml-3 flex-shrink-0", children: ["ID: ", project.PID] }))] }), project.Description && (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 line-clamp-1", children: project.Description }))] }), _jsx("button", { 
                                    // Apply action loading state to disable the button
                                    disabled: isActionLoading, className: "\n                    flex items-center justify-center w-8 h-8 rounded-full \n                    text-red-500 hover:text-white \n                    bg-transparent hover:bg-red-500 \n                    transition duration-150 flex-shrink-0\n                    // Disabled styles\n                    disabled:opacity-50 disabled:cursor-not-allowed\n                  ", "aria-label": t('project.delete', {
                                        name: project.ProjectName || `${t('project.untitled')} (ID: ${project.PID})`,
                                    }), onClick: (e) => {
                                        e.stopPropagation(); // Prevent navigation click
                                        // Pass the entire project object to the handler
                                        onDeleteProject(project);
                                    }, children: _jsx(TrashIcon, { className: "w-4 h-4" }) })] }, project.PID))) }), _jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: setCurrentPage })] }))] }));
};
export default ProjectList;
