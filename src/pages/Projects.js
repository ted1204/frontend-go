import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { PageMeta } from '@tailadmin/ui';
import { getProjects } from '../services/projectService';
import { getGroupsByUser } from '../services/userGroupService';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { Pagination } from '@tailadmin/ui';
import { SearchInput } from '@tailadmin/ui';
import { GridIcon } from '../icons';
import { useTranslation } from '@tailadmin/utils';
export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const itemsPerPage = 5; // Limit to 5 projects per page as requested
    const navigate = useNavigate();
    const { t } = useTranslation();
    useEffect(() => {
        const fetchAndFilterProjects = async () => {
            setLoading(true);
            try {
                // Get user data from localStorage first
                const userData = localStorage.getItem('userData');
                if (!userData) {
                    throw new Error(t('error.userNotLogged'));
                }
                const { user_id: userId } = JSON.parse(userData);
                // Fetch all projects and user's groups concurrently for better performance
                const [allProjects, userGroups] = await Promise.all([
                    getProjects(),
                    getGroupsByUser(userId),
                ]);
                // Filter projects based on user's group memberships
                const userGroupIds = userGroups.map((ug) => ug.GID);
                const filteredProjects = allProjects.filter((project) => userGroupIds.includes(project.GID));
                setProjects(filteredProjects);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : t('error.fetchData'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchAndFilterProjects();
    }, [t]); // The dependency array includes `t` to satisfy exhaustive-deps and ensures consistent error messages.
    const handleProjectClick = (projectId) => {
        navigate(`/projects/${projectId}`);
    };
    // Filter logic
    const filteredProjects = projects.filter((project) => project.ProjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.Description && project.Description.toLowerCase().includes(searchTerm.toLowerCase())));
    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    // Reset page on search
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    // Helper component for the loading state (Skeleton)
    const SkeletonCard = () => (_jsxs("div", { className: "animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800", children: [_jsx("div", { className: "mb-4 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" }), _jsx("div", { className: "mb-2 h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-600" }), _jsx("div", { className: "h-4 w-full rounded bg-gray-300 dark:bg-gray-600" }), _jsx("div", { className: "mt-1 h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-600" })] }));
    // Helper component for displaying states like error or no projects
    const StateDisplay = ({ message }) => (_jsx("div", { className: "col-span-full mt-10 flex flex-col items-center justify-center text-center", children: _jsx("p", { className: "text-lg text-gray-500 dark:text-gray-400", children: message }) }));
    // List View Component
    const ProjectListItem = ({ project, onClick, }) => (_jsxs("div", { onClick: () => onClick(project.PID), className: "group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 cursor-pointer", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400", children: _jsx("span", { className: "font-bold", children: project.ProjectName.charAt(0).toUpperCase() }) }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400", children: project.ProjectName }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 line-clamp-1", children: project.Description || t('project.noDescription') })] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsxs("div", { className: "hidden sm:block text-right", children: [_jsx("p", { className: "text-xs text-gray-400", children: t('createdAt') }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: new Date(project.CreatedAt).toLocaleDateString() })] }), _jsxs("div", { className: "hidden sm:block text-right", children: [_jsx("p", { className: "text-xs text-gray-400", children: t('groupId') }), _jsx("span", { className: "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300", children: project.GID })] }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-gray-400 group-hover:text-blue-500", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", clipRule: "evenodd" }) })] })] }));
    return (_jsxs("div", { children: [_jsx(PageMeta, { title: t('page.projects.title'), description: t('page.projects.description') }), _jsx(PageBreadcrumb, { pageTitle: t('breadcrumb.projects') }), _jsxs("div", { className: "rounded-2xl p-4 md:p-6 2xl:p-10", children: [_jsxs("div", { className: "mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800 dark:text-white", children: t('myProjects') }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800", children: [_jsx("button", { onClick: () => setViewMode('grid'), className: `rounded p-1.5 transition-colors ${viewMode === 'grid'
                                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`, title: t('view.grid'), children: _jsx(GridIcon, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => setViewMode('list'), className: `rounded p-1.5 transition-colors ${viewMode === 'list'
                                                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`, title: t('view.list'), children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6h16M4 12h16M4 18h16" }) }) })] }), _jsx(SearchInput, { value: searchTerm, onChange: setSearchTerm, placeholder: t('search.projectsPlaceholder') })] })] }), viewMode === 'grid' ? (_jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: loading ? (
                        // Show 6 skeleton cards while loading
                        [...Array(6)].map((_, i) => _jsx(SkeletonCard, {}, i))) : error ? (_jsx(StateDisplay, { message: `${t('label.error') || 'Error'}: ${error}` })) : filteredProjects.length === 0 ? (_jsx(StateDisplay, { message: projects.length === 0
                                ? t('noProjectsAssigned')
                                : t('noMatchingProjects', { term: searchTerm }) })) : (
                        // Map over the projects to create cards
                        currentProjects.map((project) => (_jsx(ProjectCard, { project: project, onClick: handleProjectClick }, project.PID)))) })) : (_jsx("div", { className: "flex flex-col gap-4", children: loading ? (
                        // Show skeleton list items
                        [...Array(5)].map((_, i) => (_jsx("div", { className: "animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 h-20" }, i)))) : error ? (_jsx(StateDisplay, { message: `${t('label.error') || 'Error'}: ${error}` })) : filteredProjects.length === 0 ? (_jsx(StateDisplay, { message: projects.length === 0
                                ? t('noProjectsAssigned')
                                : t('noMatchingProjects', { term: searchTerm }) })) : (currentProjects.map((project) => (_jsx(ProjectListItem, { project: project, onClick: handleProjectClick }, project.PID)))) })), !loading && !error && filteredProjects.length > itemsPerPage && (_jsx(Pagination, { currentPage: currentPage, totalPages: totalPages, onPageChange: setCurrentPage }))] })] }));
}
