import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { PageMeta } from '@tailadmin/ui';
import { useTranslation } from '@tailadmin/utils';
import { getProjects } from '../services/projectService';
import { getGroupsByUser } from '../services/userGroupService';
import { getPVCListByProject } from '../services/pvcService';
import PVCList from '../components/PVCList';
import { useGlobalWebSocket } from '../context/useGlobalWebSocket';
import { getUsername } from '../services/authService';
const FolderIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-10 w-10 text-blue-500 mb-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" }) }));
export default function FileBrowser() {
    const { t } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const [projectPvcs, setProjectPvcs] = useState({});
    const [loadingPvcs, setLoadingPvcs] = useState({});
    // Use Global WebSocket
    const { getProjectMessages } = useGlobalWebSocket();
    // Derive messages for the expanded project
    const expandedProject = projects.find((p) => p.PID === expandedProjectId);
    const username = getUsername();
    const namespace = expandedProject ? `proj-${expandedProject.PID}-${username}` : '';
    const messages = expandedProject ? getProjectMessages(namespace) : [];
    useEffect(() => {
        const fetchAndFilterProjects = async () => {
            setLoading(true);
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) {
                    throw new Error(t('groups.error.userNotLogged'));
                }
                const { user_id: userId } = JSON.parse(userData);
                const [allProjects, userGroups] = await Promise.all([
                    getProjects(),
                    getGroupsByUser(userId),
                ]);
                const userGroupIds = userGroups.map((ug) => ug.GID);
                const filteredProjects = allProjects.filter((project) => userGroupIds.includes(project.GID));
                setProjects(filteredProjects);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : t('error.initData'));
            }
            finally {
                setLoading(false);
            }
        };
        fetchAndFilterProjects();
    }, [t]);
    const handleProjectClick = async (project) => {
        if (expandedProjectId === project.PID) {
            setExpandedProjectId(null);
            return;
        }
        setExpandedProjectId(project.PID);
        if (!projectPvcs[project.PID]) {
            setLoadingPvcs((prev) => ({ ...prev, [project.PID]: true }));
            try {
                const pvcs = await getPVCListByProject(project.PID);
                setProjectPvcs((prev) => ({ ...prev, [project.PID]: pvcs }));
            }
            catch (err) {
                console.error(err);
                // Optionally set error state for this specific project
            }
            finally {
                setLoadingPvcs((prev) => ({ ...prev, [project.PID]: false }));
            }
        }
    };
    const SkeletonCard = () => (_jsxs("div", { className: "animate-pulse rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800", children: [_jsx("div", { className: "mb-4 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" }), _jsx("div", { className: "mb-2 h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-600" }), _jsx("div", { className: "h-4 w-full rounded bg-gray-300 dark:bg-gray-600" })] }));
    const StateDisplay = ({ message }) => (_jsx("div", { className: "col-span-full mt-10 flex flex-col items-center justify-center text-center", children: _jsx("p", { className: "text-lg text-gray-500 dark:text-gray-400", children: message }) }));
    return (_jsxs("div", { children: [_jsx(PageMeta, { title: t('fileBrowser.title'), description: t('fileBrowser.description') }), _jsx(PageBreadcrumb, { pageTitle: t('fileBrowser.title') }), _jsxs("div", { className: "rounded-2xl p-4 md:p-6 2xl:p-10", children: [_jsx("h3", { className: "mb-6 text-2xl font-bold text-gray-800 dark:text-white", children: t('fileBrowser.selectProject') }), _jsx("div", { className: "grid grid-cols-1 gap-6", children: loading ? ([...Array(3)].map((_, i) => _jsx(SkeletonCard, {}, i))) : error ? (_jsx(StateDisplay, { message: `${t('label.error') || 'Error'}: ${error}` })) : projects.length === 0 ? (_jsx(StateDisplay, { message: t('fileBrowser.noProjects') })) : (projects.map((project) => (_jsxs("div", { className: "rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800", children: [_jsxs("div", { onClick: () => handleProjectClick(project), className: "flex cursor-pointer items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(FolderIcon, {}), _jsxs("div", { children: [_jsx("h4", { className: "text-xl font-bold text-gray-900 dark:text-white", children: project.ProjectName }), _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["ID: ", project.PID] })] })] }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: `h-6 w-6 text-gray-400 transition-transform duration-200 ${expandedProjectId === project.PID ? 'rotate-180' : ''}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), expandedProjectId === project.PID && (_jsx("div", { className: "border-t border-gray-200 p-6 dark:border-gray-700", children: loadingPvcs[project.PID] ? (_jsx("div", { className: "flex justify-center py-4", children: _jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" }) })) : (_jsx(PVCList, { pvcs: projectPvcs[project.PID] || [], namespace: namespace, pods: messages })) }))] }, project.PID)))) })] })] }));
}
